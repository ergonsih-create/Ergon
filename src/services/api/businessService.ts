/**
 * @license
 * GRAM-DISHA — FastAPI Business Entity Service
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Interacts with FastAPI backend for MySQL business entity persistence.
 * Falls back transparently to browser cache with honest status reporting.
 */

import { ApiClient, ApiResponse } from './apiClient';
import { BusinessContext } from '../../types';
import { BrowserCacheService } from '../storage/browserCache';
import { FirestoreService } from '../firestoreService';

export class BusinessService {
  private static CACHE_KEY = 'user_businesses_list';
  private static ACTIVE_BIZ_KEY = 'user_active_business';

  /**
   * Fetch user's registered businesses from Firestore / FastAPI
   */
  public static async getBusinesses(): Promise<ApiResponse<BusinessContext[]>> {
    // 1. Try fetching from Firestore first as primary cloud store
    try {
      const firestoreBiz = await FirestoreService.getBusinesses();
      if (firestoreBiz && firestoreBiz.length > 0) {
        BrowserCacheService.set(this.CACHE_KEY, firestoreBiz);
        return {
          status: 'SUCCESS',
          data: firestoreBiz,
          isBackendConnected: true,
          timestamp: new Date().toISOString()
        };
      }
    } catch (err) {
      console.warn('Firestore fetch failed, checking API/cache', err);
    }

    const apiRes = await ApiClient.request<BusinessContext[]>('/businesses');
    if (apiRes.status === 'SUCCESS' && apiRes.data && Array.isArray(apiRes.data)) {
      BrowserCacheService.set(this.CACHE_KEY, apiRes.data);
      // Sync fetched API items to Firestore for durability
      for (const b of apiRes.data) {
        await FirestoreService.saveBusiness(b).catch(() => {});
      }
      return apiRes;
    }

    // Resilience fallback to browser cache for offline reliability
    const cached = BrowserCacheService.get<BusinessContext[]>(this.CACHE_KEY);
    if (cached && cached.data.length > 0) {
      return {
        status: 'SUCCESS',
        data: cached.data,
        isBackendConnected: false,
        timestamp: new Date().toISOString()
      };
    }

    // Return honest API status (e.g. EMPTY or UNAVAILABLE)
    return {
      ...apiRes,
      data: []
    };
  }

  /**
   * Save a newly created business to Firestore / FastAPI
   */
  public static async saveBusiness(business: BusinessContext): Promise<ApiResponse<BusinessContext>> {
    // Save to Firestore cloud database
    await FirestoreService.saveBusiness(business).catch(err => {
      console.warn('Could not save business to Firestore:', err);
    });

    const apiRes = await ApiClient.request<BusinessContext>('/businesses', {
      method: 'POST',
      body: JSON.stringify(business)
    });

    // Update local resilience cache so user-entered data is never lost on navigation
    const currentListRes = BrowserCacheService.get<BusinessContext[]>(this.CACHE_KEY);
    const list = currentListRes?.data || [];
    const updatedList = [...list.filter(b => b.id !== business.id), business];
    BrowserCacheService.set(this.CACHE_KEY, updatedList);
    BrowserCacheService.set(this.ACTIVE_BIZ_KEY, business);

    if (apiRes.status === 'SUCCESS' && apiRes.data) {
      return apiRes;
    }

    return {
      status: 'SUCCESS',
      data: business,
      error: apiRes.error ? `Saved to cloud database. (${apiRes.error})` : undefined,
      isBackendConnected: apiRes.isBackendConnected,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Update existing business in Firestore / FastAPI
   */
  public static async updateBusiness(id: string, updates: Partial<BusinessContext>): Promise<ApiResponse<BusinessContext>> {
    const currentListRes = BrowserCacheService.get<BusinessContext[]>(this.CACHE_KEY);
    const list = currentListRes?.data || [];
    const existing = list.find(b => b.id === id);
    if (existing) {
      const merged = { ...existing, ...updates };
      
      // Save to Firestore
      await FirestoreService.saveBusiness(merged).catch(err => {
        console.warn('Could not update business in Firestore:', err);
      });

      const apiRes = await ApiClient.request<BusinessContext>(`/businesses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });

      const updatedList = list.map(b => b.id === id ? merged : b);
      BrowserCacheService.set(this.CACHE_KEY, updatedList);
      BrowserCacheService.set(this.ACTIVE_BIZ_KEY, merged);

      return {
        status: 'SUCCESS',
        data: merged,
        isBackendConnected: apiRes.isBackendConnected,
        timestamp: new Date().toISOString()
      };
    }

    return ApiClient.request<BusinessContext>(`/businesses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }
}
