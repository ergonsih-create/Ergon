/**
 * @license
 * GRAM-DISHA — Support & Grievance Entity Service
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Interacts with FastAPI backend for grievance lodging and tracking.
 * Users can file real inquiries (DIC, Bank, Scheme verification, Platform)
 * and receive persistent tracking reference numbers.
 */

import { ApiClient, ApiResponse } from './apiClient';
import { GrievanceTicket } from '../../types';
import { BrowserCacheService } from '../storage/browserCache';
import { FirestoreService } from '../firestoreService';

export class SupportService {
  private static CACHE_KEY = 'user_grievance_tickets';

  /**
   * Fetch user's submitted support tickets from Firestore / API
   */
  public static async getTickets(): Promise<ApiResponse<GrievanceTicket[]>> {
    try {
      const firestoreTickets = await FirestoreService.getSupportTickets();
      if (firestoreTickets && firestoreTickets.length > 0) {
        BrowserCacheService.set(this.CACHE_KEY, firestoreTickets);
        return {
          status: 'SUCCESS',
          data: firestoreTickets,
          isBackendConnected: true,
          timestamp: new Date().toISOString()
        };
      }
    } catch (err) {
      console.warn('Firestore tickets fetch failed, checking API/cache', err);
    }

    const apiRes = await ApiClient.request<GrievanceTicket[]>('/support/tickets');
    if (apiRes.status === 'SUCCESS' && apiRes.data && Array.isArray(apiRes.data)) {
      BrowserCacheService.set(this.CACHE_KEY, apiRes.data);
      // Sync fetched API items to Firestore
      for (const ticket of apiRes.data) {
        await FirestoreService.saveSupportTicket(ticket).catch(() => {});
      }
      return apiRes;
    }

    const cached = BrowserCacheService.get<GrievanceTicket[]>(this.CACHE_KEY);
    return {
      status: cached && cached.data.length > 0 ? 'SUCCESS' : 'EMPTY',
      data: cached ? cached.data : [],
      isBackendConnected: apiRes.isBackendConnected,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Submit a new grievance or inquiry ticket to Firestore & API
   */
  public static async submitTicket(
    ticketInput: Omit<GrievanceTicket, 'id' | 'referenceCode' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<GrievanceTicket>> {
    const now = new Date().toISOString();
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const year = new Date().getFullYear();
    const categoryCode = ticketInput.category.split('_')[0];
    const referenceCode = `GRV-${year}-${categoryCode}-${randomHex}`;

    const newTicket: GrievanceTicket = {
      ...ticketInput,
      id: `ticket_${Date.now()}`,
      referenceCode,
      status: 'SUBMITTED',
      createdAt: now,
      updatedAt: now
    };

    // Save to Firestore
    await FirestoreService.saveSupportTicket(newTicket).catch(err => {
      console.warn('Firestore failed to save support ticket:', err);
    });

    const apiRes = await ApiClient.request<GrievanceTicket>('/support/tickets', {
      method: 'POST',
      body: JSON.stringify(newTicket)
    });

    const cached = BrowserCacheService.get<GrievanceTicket[]>(this.CACHE_KEY);
    const list = cached ? cached.data : [];
    const updated = [newTicket, ...list];
    BrowserCacheService.set(this.CACHE_KEY, updated);

    return {
      status: 'SUCCESS',
      data: newTicket,
      isBackendConnected: apiRes.isBackendConnected,
      timestamp: now
    };
  }
}
