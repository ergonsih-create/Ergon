/**
 * @license
 * GRAM-DISHA — Micro-ERP Operations & Inventory Hub
 */

import React, { useState } from 'react';
import { 
  Boxes, 
  Plus, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ShoppingCart, 
  Calendar,
  IndianRupee,
  Package,
  Layers
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface InventoryItem {
  id: string;
  name: string;
  category: 'RAW_MATERIAL' | 'FINISHED_GOODS' | 'PACKAGING';
  currentStock: number;
  unit: string;
  reorderThreshold: number;
  avgPurchaseRate: number;
}

interface SalesLog {
  id: string;
  date: string;
  customerName: string;
  customerType: 'RETAIL_KIRANA' | 'INDIVIDUAL_CONSUMER' | 'SHG_OUTLET' | 'INSTITUTION';
  item: string;
  quantity: number;
  unit: string;
  ratePerUnit: number;
  totalAmount: number;
  paymentMode: 'UPI' | 'CASH' | 'CREDIT_15_DAYS';
}

export const InventoryOperationsView: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: 'inv_1',
      name: 'Desi Chana (Unprocessed Raw)',
      category: 'RAW_MATERIAL',
      currentStock: 3200,
      unit: 'kg',
      reorderThreshold: 1000,
      avgPurchaseRate: 59.5,
    },
    {
      id: 'inv_2',
      name: 'Polished Chana Dal (Finished 1kg Pouch)',
      category: 'FINISHED_GOODS',
      currentStock: 850,
      unit: 'kg',
      reorderThreshold: 300,
      avgPurchaseRate: 85.0,
    },
    {
      id: 'inv_3',
      name: 'Chana Husk & Chuni Byproduct (Feed)',
      category: 'FINISHED_GOODS',
      currentStock: 420,
      unit: 'kg',
      reorderThreshold: 100,
      avgPurchaseRate: 18.0,
    },
    {
      id: 'inv_4',
      name: 'Food-Grade LDPE 1kg Pouches',
      category: 'PACKAGING',
      currentStock: 2400,
      unit: 'pcs',
      reorderThreshold: 500,
      avgPurchaseRate: 1.8,
    }
  ]);

  const [salesLogs, setSalesLogs] = useState<SalesLog[]>([
    {
      id: 'sl_1',
      date: '2026-03-01',
      customerName: 'Shri Ganesh Kirana Stores (Bhaironda)',
      customerType: 'RETAIL_KIRANA',
      item: 'Polished Chana Dal (1kg Pouch)',
      quantity: 150,
      unit: 'kg',
      ratePerUnit: 95,
      totalAmount: 14250,
      paymentMode: 'UPI',
    },
    {
      id: 'sl_2',
      date: '2026-03-01',
      customerName: 'Pusad Ashram School Canteen',
      customerType: 'INSTITUTION',
      item: 'Polished Chana Dal (50kg Bag)',
      quantity: 200,
      unit: 'kg',
      ratePerUnit: 92,
      totalAmount: 18400,
      paymentMode: 'CREDIT_15_DAYS',
    },
    {
      id: 'sl_3',
      date: '2026-02-28',
      customerName: 'Kisan Dairy Farm (Chuni)',
      customerType: 'INDIVIDUAL_CONSUMER',
      item: 'Chana Husk & Chuni Byproduct',
      quantity: 120,
      unit: 'kg',
      ratePerUnit: 22,
      totalAmount: 2640,
      paymentMode: 'CASH',
    }
  ]);

  const totalSalesRevenue = salesLogs.reduce((sum, item) => sum + item.totalAmount, 0);

  return (
    <div id="inventory_operations_view" className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D9D3C7]/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-[#242522]">
            Operations, Inventory & Sales Ledger
          </h1>
          <p className="text-xs text-[#68655D] mt-0.5">
            Micro-enterprise raw material stock tracking, re-order thresholds, and daily sales cash ledger.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="forest" size="md">Total Sales: ₹{totalSalesRevenue.toLocaleString('en-IN')}</Badge>
        </div>
      </div>

      {/* Primary Inventory Stock Table */}
      <Card title="Raw Material & Finished Goods Inventory" subtitle="Real-time storage levels vs statutory buffer threshold">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8F5EE] text-[#242522] font-semibold border-b border-[#D9D3C7]">
              <tr>
                <th className="p-3">Item Name</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Current Stock</th>
                <th className="p-3 text-right">Reorder Alert Level</th>
                <th className="p-3 text-right">Unit Valuation</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9D3C7]/60">
              {inventory.map((item) => {
                const isLow = item.currentStock <= item.reorderThreshold;
                return (
                  <tr key={item.id} className="hover:bg-[#F8F5EE]/60 transition-colors">
                    <td className="p-3 font-bold text-[#242522]">{item.name}</td>
                    <td className="p-3">
                      <Badge variant="neutral" size="sm">{item.category}</Badge>
                    </td>
                    <td className="p-3 text-right font-mono font-extrabold text-[#174C3A]">
                      {item.currentStock.toLocaleString()} {item.unit}
                    </td>
                    <td className="p-3 text-right font-mono text-[#68655D]">
                      {item.reorderThreshold.toLocaleString()} {item.unit}
                    </td>
                    <td className="p-3 text-right font-mono text-[#242522]">
                      ₹{item.avgPurchaseRate.toFixed(1)} / {item.unit}
                    </td>
                    <td className="p-3 text-center">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
                          <AlertTriangle className="w-3 h-3" /> Reorder Needed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Healthy Stock
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Daily Sales Ledger */}
      <Card title="Daily Sales & Receivables Ledger" subtitle="Verified dispatch and payment settlement journal">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8F5EE] text-[#242522] font-semibold border-b border-[#D9D3C7]">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Customer / Buyer</th>
                <th className="p-3">Segment</th>
                <th className="p-3">Item Dispatched</th>
                <th className="p-3 text-right">Quantity</th>
                <th className="p-3 text-right">Rate (₹)</th>
                <th className="p-3 text-right">Total (₹)</th>
                <th className="p-3 text-center">Payment Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9D3C7]/60">
              {salesLogs.map((sl) => (
                <tr key={sl.id} className="hover:bg-[#F8F5EE]/60 transition-colors">
                  <td className="p-3 text-[#68655D] font-mono">{sl.date}</td>
                  <td className="p-3 font-bold text-[#242522]">{sl.customerName}</td>
                  <td className="p-3">
                    <Badge variant="neutral" size="sm">{sl.customerType}</Badge>
                  </td>
                  <td className="p-3 text-[#242522]">{sl.item}</td>
                  <td className="p-3 text-right font-mono">{sl.quantity} {sl.unit}</td>
                  <td className="p-3 text-right font-mono">₹{sl.ratePerUnit}</td>
                  <td className="p-3 text-right font-mono font-bold text-[#174C3A]">
                    ₹{sl.totalAmount.toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    <Badge variant={sl.paymentMode === 'UPI' ? 'forest' : sl.paymentMode === 'CASH' ? 'harvest' : 'terracotta'} size="sm">
                      {sl.paymentMode}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
};
