/**
 * @license
 * GRAM-DISHA — Operations Entity Service (Inventory & Sales)
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Interacts with FastAPI backend for MySQL operations records.
 * User-entered records persist reliably across views and sessions.
 */

import { ApiClient, ApiResponse } from './apiClient';
import { InventoryItem, SalesRecord } from '../../types';
import { BrowserCacheService } from '../storage/browserCache';
import { FirestoreService } from '../firestoreService';

export class OperationsService {
  private static INVENTORY_CACHE_KEY = 'user_inventory_list';
  private static SALES_CACHE_KEY = 'user_sales_list';

  /**
   * Fetch user's inventory items from Firestore / API
   */
  public static async getInventory(): Promise<ApiResponse<InventoryItem[]>> {
    try {
      const firestoreItems = await FirestoreService.getInventory();
      if (firestoreItems && firestoreItems.length > 0) {
        BrowserCacheService.set(this.INVENTORY_CACHE_KEY, firestoreItems);
        return {
          status: 'SUCCESS',
          data: firestoreItems,
          isBackendConnected: true,
          timestamp: new Date().toISOString()
        };
      }
    } catch (err) {
      console.warn('Firestore inventory fetch failed, checking API/cache', err);
    }

    const apiRes = await ApiClient.request<any[]>('/inventory/items?business_id=biz_default');
    if (apiRes.status === 'SUCCESS' && apiRes.data && Array.isArray(apiRes.data)) {
      const items: InventoryItem[] = apiRes.data.map(d => ({
        id: d.id,
        itemName: d.item_name || d.itemName,
        category: d.category,
        unit: d.unit,
        currentStock: d.current_stock ?? d.currentStock,
        reorderThreshold: d.reorder_threshold ?? d.reorderThreshold,
        avgPurchaseRate: d.avg_purchase_rate ?? d.avgPurchaseRate,
        lastRestockedDate: d.last_restocked_date || d.lastRestockedDate || new Date().toISOString().split('T')[0]
      }));
      BrowserCacheService.set(this.INVENTORY_CACHE_KEY, items);
      // Sync to Firestore
      for (const item of items) {
        await FirestoreService.saveInventoryItem(item).catch(() => {});
      }
      return {
        ...apiRes,
        data: items
      };
    }

    const cached = BrowserCacheService.get<InventoryItem[]>(this.INVENTORY_CACHE_KEY);
    return {
      status: cached && cached.data.length > 0 ? 'SUCCESS' : 'EMPTY',
      data: cached ? cached.data : [],
      isBackendConnected: apiRes.isBackendConnected,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Add a new stock item to Firestore & API
   */
  public static async addInventoryItem(
    itemInput: Omit<InventoryItem, 'id' | 'lastRestockedDate'>
  ): Promise<ApiResponse<InventoryItem>> {
    const newItem: InventoryItem = {
      ...itemInput,
      id: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      lastRestockedDate: new Date().toISOString().split('T')[0]
    };

    // Save to Firestore
    await FirestoreService.saveInventoryItem(newItem).catch(err => {
      console.warn('Firestore failed to save inventory item:', err);
    });

    const payload = {
      id: newItem.id,
      business_id: 'biz_default',
      item_name: newItem.itemName,
      category: newItem.category,
      unit: newItem.unit,
      current_stock: newItem.currentStock,
      reorder_threshold: newItem.reorderThreshold,
      avg_purchase_rate: newItem.avgPurchaseRate
    };

    const apiRes = await ApiClient.request<any>('/inventory/items', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    // Update local persistence
    const cached = BrowserCacheService.get<InventoryItem[]>(this.INVENTORY_CACHE_KEY);
    const list = cached ? cached.data : [];
    const updated = [newItem, ...list];
    BrowserCacheService.set(this.INVENTORY_CACHE_KEY, updated);

    return {
      status: 'SUCCESS',
      data: newItem,
      isBackendConnected: apiRes.isBackendConnected,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Delete an inventory item
   */
  public static async deleteInventoryItem(id: string): Promise<ApiResponse<boolean>> {
    // Delete from Firestore
    await FirestoreService.deleteInventoryItem(id).catch(err => {
      console.warn('Firestore failed to delete inventory item:', err);
    });

    const apiRes = await ApiClient.request<boolean>(`/inventory/items/${id}`, {
      method: 'DELETE'
    });

    const cached = BrowserCacheService.get<InventoryItem[]>(this.INVENTORY_CACHE_KEY);
    if (cached) {
      const updated = cached.data.filter(item => item.id !== id);
      BrowserCacheService.set(this.INVENTORY_CACHE_KEY, updated);
    }

    return {
      status: 'SUCCESS',
      data: true,
      isBackendConnected: apiRes.isBackendConnected,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Fetch user's recorded sales from Firestore / API
   */
  public static async getSales(): Promise<ApiResponse<SalesRecord[]>> {
    try {
      const firestoreSales = await FirestoreService.getSales();
      if (firestoreSales && firestoreSales.length > 0) {
        BrowserCacheService.set(this.SALES_CACHE_KEY, firestoreSales);
        return {
          status: 'SUCCESS',
          data: firestoreSales,
          isBackendConnected: true,
          timestamp: new Date().toISOString()
        };
      }
    } catch (err) {
      console.warn('Firestore sales fetch failed, checking API/cache', err);
    }

    const apiRes = await ApiClient.request<any[]>('/inventory/sales?business_id=biz_default');
    if (apiRes.status === 'SUCCESS' && apiRes.data && Array.isArray(apiRes.data)) {
      const records: SalesRecord[] = apiRes.data.map(d => ({
        id: d.id,
        date: d.sale_date || d.date || new Date().toISOString().split('T')[0],
        productName: d.product_name || d.productName,
        customerName: d.customer_name || d.customerName,
        customerType: d.customer_type || d.customerType,
        unitsSold: d.units_sold ?? d.unitsSold,
        unit: d.unit,
        ratePerUnit: d.rate_per_unit ?? d.ratePerUnit,
        totalRevenue: d.total_revenue ?? d.totalRevenue,
        paymentMode: d.payment_mode || d.paymentMode
      }));
      BrowserCacheService.set(this.SALES_CACHE_KEY, records);
      // Sync to Firestore
      for (const rec of records) {
        await FirestoreService.saveSaleRecord(rec).catch(() => {});
      }
      return {
        ...apiRes,
        data: records
      };
    }

    const cached = BrowserCacheService.get<SalesRecord[]>(this.SALES_CACHE_KEY);
    return {
      status: cached && cached.data.length > 0 ? 'SUCCESS' : 'EMPTY',
      data: cached ? cached.data : [],
      isBackendConnected: apiRes.isBackendConnected,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Record a new sale to Firestore & API
   */
  public static async recordSale(
    saleInput: Omit<SalesRecord, 'id' | 'date'>
  ): Promise<ApiResponse<SalesRecord>> {
    const newSale: SalesRecord = {
      ...saleInput,
      id: `sale_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      date: new Date().toISOString().split('T')[0]
    };

    // Save sale to Firestore
    await FirestoreService.saveSaleRecord(newSale).catch(err => {
      console.warn('Firestore failed to save sales record:', err);
    });

    const payload = {
      business_id: 'biz_default',
      sale_date: newSale.date,
      product_name: newSale.productName,
      customer_name: newSale.customerName,
      customer_type: newSale.customerType,
      units_sold: newSale.unitsSold,
      unit: newSale.unit,
      rate_per_unit: newSale.ratePerUnit,
      unit_sale_price: newSale.ratePerUnit,
      total_revenue: newSale.totalRevenue,
      payment_mode: newSale.paymentMode
    };

    const apiRes = await ApiClient.request<any>('/inventory/sales', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    // Update local persistence
    const cached = BrowserCacheService.get<SalesRecord[]>(this.SALES_CACHE_KEY);
    const list = cached ? cached.data : [];
    const updated = [newSale, ...list];
    BrowserCacheService.set(this.SALES_CACHE_KEY, updated);

    // Auto deduct inventory if matching product exists
    const invCached = BrowserCacheService.get<InventoryItem[]>(this.INVENTORY_CACHE_KEY);
    if (invCached) {
      const invUpdated = invCached.data.map(inv => {
        if (inv.itemName.toLowerCase() === newSale.productName.toLowerCase()) {
          const updatedInv = {
            ...inv,
            currentStock: Math.max(0, inv.currentStock - newSale.unitsSold)
          };
          // Also sync inventory update to Firestore
          FirestoreService.saveInventoryItem(updatedInv).catch(() => {});
          return updatedInv;
        }
        return inv;
      });
      BrowserCacheService.set(this.INVENTORY_CACHE_KEY, invUpdated);
    }

    return {
      status: 'SUCCESS',
      data: newSale,
      isBackendConnected: apiRes.isBackendConnected,
      timestamp: new Date().toISOString()
    };
  }
}
