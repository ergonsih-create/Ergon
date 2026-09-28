/**
 * @license
 * GRAM-DISHA — FastAPI / MySQL Client Service Boundary
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Provides unified HTTP interface for the FastAPI backend and MySQL store,
 * handling real authentication headers, error classification,
 * low-bandwidth network degradation, and domain-specific APIs.
 */

import { JWTAuthService } from '../auth/jwtAuthService';

export type ApiStatus = 
  | 'IDLE' 
  | 'LOADING' 
  | 'SUCCESS' 
  | 'EMPTY' 
  | 'VALIDATION_ERROR' 
  | 'AUTH_ERROR' 
  | 'NETWORK_ERROR' 
  | 'SERVER_ERROR' 
  | 'UNAVAILABLE';

export interface ApiResponse<T> {
  status: ApiStatus;
  data: T | null;
  error?: string;
  statusCode?: number;
  isBackendConnected: boolean;
  timestamp: string;
}

export class ApiClient {
  private static BASE_URL = (import.meta as any).env?.VITE_BACKEND_URL || '/api/v1';
  private static TIMEOUT_MS = 8000;

  /**
   * Universal fetch wrapper with typed status handling
   */
  public static async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = JWTAuthService.getStoredToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...((options.headers as Record<string, string>) || {})
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

    const url = endpoint.startsWith('http') 
      ? endpoint 
      : endpoint.startsWith('/api') 
        ? endpoint 
        : `${this.BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.status === 401 || response.status === 403) {
        return {
          status: 'AUTH_ERROR',
          data: null,
          error: 'Authentication session invalid or expired. Please sign in again.',
          statusCode: response.status,
          isBackendConnected: true,
          timestamp: new Date().toISOString()
        };
      }

      if (response.status === 422 || response.status === 400) {
        const errorBody = await response.json().catch(() => ({ detail: 'Validation failed' }));
        return {
          status: 'VALIDATION_ERROR',
          data: null,
          error: typeof errorBody.detail === 'string' ? errorBody.detail : JSON.stringify(errorBody.detail),
          statusCode: response.status,
          isBackendConnected: true,
          timestamp: new Date().toISOString()
        };
      }

      if (response.status >= 500) {
        return {
          status: 'SERVER_ERROR',
          data: null,
          error: `FastAPI Server Error (${response.status}). Database or service temporarily unready.`,
          statusCode: response.status,
          isBackendConnected: true,
          timestamp: new Date().toISOString()
        };
      }

      if (response.status === 404) {
        return {
          status: 'UNAVAILABLE',
          data: null,
          error: `Endpoint ${endpoint} is not available on this server.`,
          statusCode: 404,
          isBackendConnected: true,
          timestamp: new Date().toISOString()
        };
      }

      if (!response.ok) {
        return {
          status: 'SERVER_ERROR',
          data: null,
          error: `Unexpected response status: ${response.statusText}`,
          statusCode: response.status,
          isBackendConnected: true,
          timestamp: new Date().toISOString()
        };
      }

      const json = await response.json();
      
      if (json === null || json === undefined || (Array.isArray(json) && json.length === 0)) {
        return {
          status: 'EMPTY',
          data: json,
          isBackendConnected: true,
          timestamp: new Date().toISOString()
        };
      }

      return {
        status: 'SUCCESS',
        data: json,
        isBackendConnected: true,
        timestamp: new Date().toISOString()
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      return {
        status: 'UNAVAILABLE',
        data: null,
        error: err.name === 'AbortError' 
          ? 'FastAPI request timed out. Server may be offline or unreachable.' 
          : 'Backend service is currently not reachable.',
        statusCode: 0,
        isBackendConnected: false,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Health check
  public static async checkHealth(): Promise<boolean> {
    const res = await this.request<{ status: string }>('/api/health');
    return res.status === 'SUCCESS' && res.data?.status === 'healthy';
  }

  /* ==========================================================
     DOMAIN API METHODS CONNECTED DIRECTLY TO FASTAPI & MYSQL
     ========================================================== */

  // 1. Geography & LGD
  public static async getStates() {
    return this.request<any[]>('/geography/states');
  }
  public static async getDistricts(stateName: string) {
    return this.request<any[]>(`/geography/districts?state_name=${encodeURIComponent(stateName)}`);
  }
  public static async getBlocks(districtName: string) {
    return this.request<any[]>(`/geography/blocks?district_name=${encodeURIComponent(districtName)}`);
  }
  public static async getPanchayats(blockName: string) {
    return this.request<any[]>(`/geography/panchayats?block_name=${encodeURIComponent(blockName)}`);
  }
  public static async getVillages(panchayatName: string) {
    return this.request<any[]>(`/geography/villages?panchayat_name=${encodeURIComponent(panchayatName)}`);
  }

  // 2. Market Insights (AGMARKNET & MSME Udyam)
  public static async getMarketInsights(district: string, category: string = 'AGRO_PROCESSING') {
    return this.request<any>(`/market/insights?district=${encodeURIComponent(district)}&category=${encodeURIComponent(category)}`);
  }

  // 3. Finance & Deterministic Banking Calculations
  public static async calculateFinance(payload: any) {
    return this.request<any>('/finance/calculate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // 4. Feasibility & Ranking Tier
  public static async calculateFeasibility(payload: any) {
    return this.request<any>('/feasibility/score', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // 5. Schemes Matching
  public static async matchSchemes(payload: any) {
    return this.request<any[]>('/schemes/match', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // 6. Documents & Bankable DPR Generator
  public static async generateBankableDPR(payload: any) {
    return this.request<any>('/documents/generate-dpr', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
  public static async getDocumentsChecklist(businessId: string = 'biz_default') {
    return this.request<any[]>(`/documents/checklist?business_id=${encodeURIComponent(businessId)}`);
  }
  public static async updateDocumentStatus(docId: string, businessId: string, status: string) {
    return this.request<any>('/documents/status', {
      method: 'POST',
      body: JSON.stringify({ document_id: docId, business_id: businessId, status }),
    });
  }

  // 7. Applications
  public static async getMyApplications(businessId?: string) {
    const q = businessId ? `?business_id=${encodeURIComponent(businessId)}` : '';
    return this.request<any[]>(`/applications/my-applications${q}`);
  }
  public static async submitApplication(payload: any) {
    return this.request<any>('/applications/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
  public static async updateApplicationStage(appId: string, payload: any) {
    return this.request<any>(`/applications/${appId}/stage`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  }

  // 8. Micro-ERP Inventory & Sales
  public static async getInventoryItems(businessId: string = 'biz_default') {
    return this.request<any[]>(`/inventory/items?business_id=${encodeURIComponent(businessId)}`);
  }
  public static async addInventoryItem(payload: any) {
    return this.request<any>('/inventory/items', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
  public static async deleteInventoryItem(itemId: string) {
    return this.request<any>(`/inventory/items/${itemId}`, { method: 'DELETE' });
  }
  public static async getSales(businessId: string = 'biz_default') {
    return this.request<any[]>(`/inventory/sales?business_id=${encodeURIComponent(businessId)}`);
  }
  public static async recordSale(payload: any) {
    return this.request<any>('/inventory/sales', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
  public static async getInventoryStats(businessId: string = 'biz_default') {
    return this.request<any>(`/inventory/stats?business_id=${encodeURIComponent(businessId)}`);
  }

  // 9. Action Plan & Milestones
  public static async getActionMilestones(businessId: string = 'biz_default') {
    return this.request<any[]>(`/action-plan/milestones?business_id=${encodeURIComponent(businessId)}`);
  }
  public static async addMilestone(payload: any) {
    return this.request<any>('/action-plan/milestones', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
  public static async toggleMilestone(milestoneId: number) {
    return this.request<any>(`/action-plan/milestones/${milestoneId}/toggle`, {
      method: 'PATCH',
    });
  }

  // 10. Progress & Operational KPIs
  public static async getProgressKPIs(businessId: string = 'biz_default', district: string = 'Yavatmal') {
    return this.request<any>(`/progress/kpis?business_id=${encodeURIComponent(businessId)}&district=${encodeURIComponent(district)}`);
  }

  // 11. Learning Resources Vault
  public static async getLearningResources(category?: string) {
    const q = category ? `?category=${encodeURIComponent(category)}` : '';
    return this.request<any[]>(`/learning/resources${q}`);
  }

  // 12. Support & Helpdesk
  public static async getSupportTickets(userId: string = 'user_default') {
    return this.request<any[]>(`/support/tickets?user_id=${encodeURIComponent(userId)}`);
  }
  public static async createSupportTicket(payload: any) {
    return this.request<any>('/support/tickets', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
  public static async getSupportHelplines() {
    return this.request<any[]>('/support/helplines');
  }
  public static async getSupportFaqs() {
    return this.request<any[]>('/support/faqs');
  }

  // 13. Admin Master Datasets Registry
  public static async getAdminDatasets(category?: string, query?: string) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (query) params.append('query', query);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return this.request<any[]>(`/admin/datasets${qs}`);
  }
  public static async syncAdminDataset(code: string) {
    return this.request<any>(`/admin/sync/${code}`, { method: 'POST' });
  }
  public static async getSystemStatus() {
    return this.request<any>('/admin/system-status');
  }

  // 14. Notifications
  public static async getNotifications(userId: string = 'user_default') {
    return this.request<any[]>(`/notifications?user_id=${encodeURIComponent(userId)}`);
  }
  public static async markNotificationRead(id: string) {
    return this.request<any>(`/notifications/${id}/read`, { method: 'POST' });
  }
  public static async clearAllNotifications() {
    return this.request<any>('/notifications/clear', { method: 'POST' });
  }

  // 15. User & Enterprise Profile
  public static async getUserProfile() {
    return this.request<any>('/profile');
  }
  public static async updateUserProfile(payload: any) {
    return this.request<any>('/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }
  public static async getEnterpriseProfile() {
    return this.request<any>('/profile/enterprise');
  }
  public static async updateEnterpriseProfile(payload: any) {
    return this.request<any>('/profile/enterprise', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }
}
