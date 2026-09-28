/**
 * @license
 * GRAM-DISHA — Scheme Application Tracking Service
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Interacts with FastAPI backend for MySQL scheme application persistence.
 * Tracks user DPR preparation, document verification, and submission statuses.
 */

import { ApiClient, ApiResponse } from './apiClient';
import { SchemeApplication } from '../../types';
import { BrowserCacheService } from '../storage/browserCache';
import { FirestoreService } from '../firestoreService';

export class ApplicationService {
  private static CACHE_KEY = 'user_scheme_applications';

  /**
   * Fetch user's registered scheme applications from Firestore / API
   */
  public static async getApplications(): Promise<ApiResponse<SchemeApplication[]>> {
    try {
      const firestoreApps = await FirestoreService.getApplications();
      if (firestoreApps && firestoreApps.length > 0) {
        BrowserCacheService.set(this.CACHE_KEY, firestoreApps);
        return {
          status: 'SUCCESS',
          data: firestoreApps,
          isBackendConnected: true,
          timestamp: new Date().toISOString()
        };
      }
    } catch (err) {
      console.warn('Firestore applications fetch failed, checking API/cache', err);
    }

    const apiRes = await ApiClient.request<SchemeApplication[]>('/applications');
    if (apiRes.status === 'SUCCESS' && apiRes.data && Array.isArray(apiRes.data)) {
      BrowserCacheService.set(this.CACHE_KEY, apiRes.data);
      // Sync fetched API items to Firestore
      for (const app of apiRes.data) {
        await FirestoreService.saveApplication(app).catch(() => {});
      }
      return apiRes;
    }

    const cached = BrowserCacheService.get<SchemeApplication[]>(this.CACHE_KEY);
    return {
      status: cached && cached.data.length > 0 ? 'SUCCESS' : 'EMPTY',
      data: cached ? cached.data : [],
      isBackendConnected: apiRes.isBackendConnected,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Create or register a scheme application draft to Firestore & API
   */
  public static async createApplication(
    appInput: Omit<SchemeApplication, 'id'>
  ): Promise<ApiResponse<SchemeApplication>> {
    const newApp: SchemeApplication = {
      ...appInput,
      id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };

    // Save to Firestore
    await FirestoreService.saveApplication(newApp).catch(err => {
      console.warn('Firestore failed to save application:', err);
    });

    const apiRes = await ApiClient.request<SchemeApplication>('/applications', {
      method: 'POST',
      body: JSON.stringify(newApp)
    });

    const cached = BrowserCacheService.get<SchemeApplication[]>(this.CACHE_KEY);
    const list = cached ? cached.data : [];
    const updated = [newApp, ...list];
    BrowserCacheService.set(this.CACHE_KEY, updated);

    return {
      status: 'SUCCESS',
      data: newApp,
      isBackendConnected: apiRes.isBackendConnected,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Update application status or documents in Firestore & API
   */
  public static async updateApplication(
    id: string, 
    updates: Partial<SchemeApplication>
  ): Promise<ApiResponse<SchemeApplication>> {
    const cached = BrowserCacheService.get<SchemeApplication[]>(this.CACHE_KEY);
    if (cached) {
      const existing = cached.data.find(app => app.id === id);
      if (existing) {
        const merged = { ...existing, ...updates };

        // Save to Firestore
        await FirestoreService.saveApplication(merged).catch(err => {
          console.warn('Firestore failed to update application:', err);
        });

        const apiRes = await ApiClient.request<SchemeApplication>(`/applications/${id}`, {
          method: 'PUT',
          body: JSON.stringify(updates)
        });

        const updated = cached.data.map(app => app.id === id ? merged : app);
        BrowserCacheService.set(this.CACHE_KEY, updated);

        return {
          status: 'SUCCESS',
          data: merged,
          isBackendConnected: apiRes.isBackendConnected,
          timestamp: new Date().toISOString()
        };
      }
    }

    return ApiClient.request<SchemeApplication>(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }
}
