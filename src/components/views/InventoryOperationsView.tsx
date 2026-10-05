/**
 * @license
 * GRAM-DISHA — Micro-ERP Operations, Inventory & Sales Hub (/operations/*)
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Strict No-Demo-Data Policy:
 * - Displays only genuine inventory and sales records entered by the user
 * - Real empty states when no records exist
 * - Dynamic low-stock alerts when current stock <= reorder threshold
 * - Automatically computes sales total revenue and deducts inventory
 */

import React, { useState } from 'react';
import { 
  Boxes, 
  Plus, 
  Trash2, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar,
  IndianRupee,
  Layers,
  ArrowRight,
  ShoppingCart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { InventoryItem, SalesRecord } from '../../types';

export const InventoryOperationsView: React.FC = () => {
  const { inventory, sales, addInventoryItem, deleteInventoryItem, recordSale } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'INVENTORY' | 'SALES' | 'PLANNING'>('INVENTORY');

  // Modal / Form States
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [isRecordSaleOpen, setIsRecordSaleOpen] = useState(false);

  // New Stock Form
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<'RAW_MATERIAL' | 'FINISHED_GOODS' | 'PACKAGING'>('RAW_MATERIAL');
  const [unit, setUnit] = useState('kg');
  const [currentStock, setCurrentStock] = useState<string>('');
  const [reorderThreshold, setReorderThreshold] = useState<string>('');
  const [avgPurchaseRate, setAvgPurchaseRate] = useState<string>('');

  // New Sale Form
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [productName, setProductName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerType, setCustomerType] = useState<SalesRecord['customerType']>('RETAIL_KIRANA');
  const [unitsSold, setUnitsSold] = useState<string>('');
  const [unitSalePrice, setUnitSalePrice] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<SalesRecord['paymentMode']>('UPI');

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !currentStock) return;

    await addInventoryItem({
      itemName: itemName.trim(),
      category,
      unit,
      currentStock: parseFloat(currentStock) || 0,
      reorderThreshold: parseFloat(reorderThreshold) || 0,
      avgPurchaseRate: parseFloat(avgPurchaseRate) || 0,
    });

    setItemName('');
    setCurrentStock('');
    setReorderThreshold('');
    setAvgPurchaseRate('');
    setIsAddStockOpen(false);
  };

  const handleRecordSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !unitsSold || !unitSalePrice) return;

    const qty = parseFloat(unitsSold) || 0;
    const rate = parseFloat(unitSalePrice) || 0;
    const total = qty * rate;

    await recordSale({
      productName: productName.trim(),
      customerName: customerName.trim() || 'Direct Customer',
      customerType,
      unitsSold: qty,
      unit: unit || 'kg',
      ratePerUnit: rate,
      totalRevenue: total,
      paymentMode,
    });

    setProductName('');
    setCustomerName('');
    setUnitsSold('');
    setUnitSalePrice('');
    setIsRecordSaleOpen(false);
  };

  const totalSalesRevenue = sales.reduce((acc, s) => acc + (s.totalRevenue || 0), 0);
  const lowStockItems = inventory.filter(i => i.currentStock <= i.reorderThreshold);

  return (
    <div id="operations_view_root" className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#C8A96B]/20">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#174C3A] text-[#FAF7F2] flex items-center justify-center">
              <Boxes className="w-4 h-4 text-[#C8A96B]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-[#3B2F2A]">
              {t('inventoryOperations')}
            </h1>
          </div>
          <p className="text-xs text-[#3B2F2A]/70 mt-1">
            Real-time stock ledger, batch reorder thresholds, and sales journal for daily rural enterprise transactions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddStockOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#174C3A] text-[#FAF7F2] text-xs font-bold hover:bg-[#174C3A]/90 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#C8A96B]" />
            <span>+ {t('registeredStockItems')}</span>
          </button>
          <button
            onClick={() => setIsRecordSaleOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/40 text-[#3B2F2A] hover:bg-[#F2E8D6]/60 text-xs font-bold transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-[#174C3A]" />
            <span>{t('recordStockOrSale')}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#C8A96B]/20 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'INVENTORY', label: `${t('registeredStockItems')} (${inventory.length})` },
          { id: 'SALES', label: `${t('recordedSalesRevenue')} (${sales.length})` },
          { id: 'PLANNING', label: t('lowStockReorderAlerts') },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#174C3A] text-[#FAF7F2] shadow-xs'
                : 'text-[#3B2F2A]/70 hover:bg-[#F2E8D6]/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/30 shadow-xs">
          <span className="text-[11px] text-[#3B2F2A]/60 font-semibold uppercase">{t('registeredStockItems')}</span>
          <div className="text-xl font-display font-extrabold text-[#3B2F2A] mt-0.5">
            {inventory.length}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/30 shadow-xs">
          <span className="text-[11px] text-[#3B2F2A]/60 font-semibold uppercase">{t('lowStockReorderAlerts')}</span>
          <div className={`text-xl font-display font-extrabold mt-0.5 ${lowStockItems.length > 0 ? 'text-[#B45B4A]' : 'text-[#5A6B4F]'}`}>
            {lowStockItems.length}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/30 shadow-xs">
          <span className="text-[11px] text-[#3B2F2A]/60 font-semibold uppercase">{t('recordedSalesRevenue')}</span>
          <div className="text-xl font-display font-extrabold text-[#174C3A] mt-0.5">
            ₹{totalSalesRevenue.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* TAB 1: INVENTORY STOCK */}
      {activeTab === 'INVENTORY' && (
        <div>
          {inventory.length === 0 ? (
            <div className="bg-[#FAF7F2] border border-[#C8A96B]/30 rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#F2E8D6] flex items-center justify-center text-[#3B2F2A]/60">
                <Boxes className="w-6 h-6 text-[#C8A96B]" />
              </div>
              <h3 className="text-sm font-bold text-[#3B2F2A]">No inventory items recorded yet</h3>
              <p className="text-xs text-[#3B2F2A]/70 leading-relaxed">
                Add your raw materials (e.g. grain, oilseed), packaged finished goods, and packaging pouches to start tracking physical stock and reorder warnings.
              </p>
              <button
                onClick={() => setIsAddStockOpen(true)}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#174C3A] text-[#FAF7F2] text-xs font-bold hover:bg-[#174C3A]/90 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#C8A96B]" />
                <span>Add First Stock Item</span>
              </button>
            </div>
          ) : (
            <div className="bg-[#FAF7F2] border border-[#C8A96B]/30 rounded-2xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#C8A96B]/30 bg-[#F2E8D6]/40 text-[#3B2F2A]/70 font-semibold">
                      <th className="p-3">Item Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Current Stock</th>
                      <th className="p-3">Reorder Threshold</th>
                      <th className="p-3">Avg Rate (₹)</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C8A96B]/20">
                    {inventory.map((item) => {
                      const isLowStock = item.currentStock <= item.reorderThreshold;
                      return (
                        <tr key={item.id} className="hover:bg-[#F2E8D6]/20 transition-colors">
                          <td className="p-3 font-bold text-[#3B2F2A]">{item.itemName}</td>
                          <td className="p-3 text-[#3B2F2A]/70">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F2E8D6] text-[#3B2F2A]">
                              {item.category.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-bold text-[#3B2F2A]">
                            {item.currentStock} {item.unit}
                          </td>
                          <td className="p-3 font-mono text-[#3B2F2A]/70">
                            {item.reorderThreshold} {item.unit}
                          </td>
                          <td className="p-3 font-mono text-[#3B2F2A]">
                            ₹{item.avgPurchaseRate || 0}
                          </td>
                          <td className="p-3">
                            {isLowStock ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#B45B4A]/15 text-[#B45B4A] flex items-center gap-1 w-fit">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Low Stock</span>
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#5A6B4F]/15 text-[#5A6B4F] flex items-center gap-1 w-fit">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Sufficient</span>
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => deleteInventoryItem(item.id)}
                              className="p-1 text-[#3B2F2A]/50 hover:text-[#B45B4A] transition-colors cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SALES JOURNAL */}
      {activeTab === 'SALES' && (
        <div>
          {sales.length === 0 ? (
            <div className="bg-[#FAF7F2] border border-[#C8A96B]/30 rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#F2E8D6] flex items-center justify-center text-[#3B2F2A]/60">
                <ShoppingCart className="w-6 h-6 text-[#C8A96B]" />
              </div>
              <h3 className="text-sm font-bold text-[#3B2F2A]">No sales transactions recorded yet</h3>
              <p className="text-xs text-[#3B2F2A]/70 leading-relaxed">
                Record your daily sales to retail kirana stores, mandi wholesalers, or individual customers. Gram-Disha automatically logs your revenue and deducts matching stock.
              </p>
              <button
                onClick={() => setIsRecordSaleOpen(true)}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#174C3A] text-[#FAF7F2] text-xs font-bold hover:bg-[#174C3A]/90 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#C8A96B]" />
                <span>Record First Sale</span>
              </button>
            </div>
          ) : (
            <div className="bg-[#FAF7F2] border border-[#C8A96B]/30 rounded-2xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#C8A96B]/30 bg-[#F2E8D6]/40 text-[#3B2F2A]/70 font-semibold">
                      <th className="p-3">Date</th>
                      <th className="p-3">Product Name</th>
                      <th className="p-3">Customer / Buyer</th>
                      <th className="p-3">Quantity Sold</th>
                      <th className="p-3">Rate / Unit (₹)</th>
                      <th className="p-3">Total Amount (₹)</th>
                      <th className="p-3">Payment Mode</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C8A96B]/20">
                    {sales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-[#F2E8D6]/20 transition-colors">
                        <td className="p-3 font-mono text-[#3B2F2A]/80">{sale.date}</td>
                        <td className="p-3 font-bold text-[#3B2F2A]">{sale.productName}</td>
                        <td className="p-3 text-[#3B2F2A]/70">
                          <div>{sale.customerName}</div>
                          <span className="text-[10px] text-[#3B2F2A]/50 font-mono">
                            {sale.customerType?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-[#3B2F2A]">
                          {sale.unitsSold} {sale.unit}
                        </td>
                        <td className="p-3 font-mono text-[#3B2F2A]">
                          ₹{sale.ratePerUnit}
                        </td>
                        <td className="p-3 font-mono font-bold text-[#174C3A]">
                          ₹{sale.totalRevenue.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#174C3A]/10 text-[#174C3A] font-bold">
                            {sale.paymentMode}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PLANNING & REORDER NOTICES */}
      {activeTab === 'PLANNING' && (
        <div className="bg-[#FAF7F2] border border-[#C8A96B]/30 rounded-2xl p-6 shadow-xs space-y-4 max-w-2xl">
          <div className="border-b border-[#C8A96B]/20 pb-3">
            <h2 className="text-sm font-bold text-[#3B2F2A]">Operational Reorder Thresholds</h2>
            <p className="text-xs text-[#3B2F2A]/60 mt-0.5">
              Automated triggers based on physical stock counts to prevent processing plant idling.
            </p>
          </div>

          {lowStockItems.length > 0 ? (
            <div className="space-y-3">
              {lowStockItems.map(item => (
                <div key={item.id} className="p-3.5 rounded-xl border border-[#B45B4A]/30 bg-[#B45B4A]/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#3B2F2A]">{item.itemName}</div>
                    <div className="text-[11px] text-[#B45B4A] mt-0.5">
                      Current: {item.currentStock} {item.unit} • Threshold: {item.reorderThreshold} {item.unit}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setItemName(item.itemName);
                      setUnit(item.unit);
                      setIsAddStockOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#174C3A] text-[#FAF7F2] text-xs font-bold hover:bg-[#174C3A]/90 transition-colors cursor-pointer"
                  >
                    Restock
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center border border-dashed border-[#C8A96B]/30 rounded-xl space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-[#5A6B4F]" />
              <div className="text-xs font-bold text-[#3B2F2A]">All Inventory Levels Healthy</div>
              <p className="text-xs text-[#3B2F2A]/60">
                No items are currently below their minimum safety reorder thresholds.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ADD STOCK MODAL */}
      {isAddStockOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <form onSubmit={handleAddStock} className="bg-[#FAF7F2] border border-[#C8A96B]/40 rounded-2xl p-6 shadow-xl max-w-md w-full space-y-4">
            <div className="border-b border-[#C8A96B]/20 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#3B2F2A]">Add Stock Item</h3>
              <button
                type="button"
                onClick={() => setIsAddStockOpen(false)}
                className="text-xs text-[#3B2F2A]/60 hover:text-[#3B2F2A] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#3B2F2A] mb-1">Item / Material Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Desi Chana Raw Grain"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3B2F2A] mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
                  >
                    <option value="RAW_MATERIAL">Raw Material</option>
                    <option value="FINISHED_GOODS">Finished Goods</option>
                    <option value="PACKAGING">Packaging Material</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B2F2A] mb-1">Measurement Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="quintal">Quintal</option>
                    <option value="pcs">Pieces (pcs)</option>
                    <option value="litre">Litre</option>
                    <option value="bag">Bags</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3B2F2A] mb-1">Initial Stock Count *</label>
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    value={currentStock}
                    onChange={(e) => setCurrentStock(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B2F2A] mb-1">Reorder Threshold</label>
                  <input
                    type="number"
                    placeholder="e.g. 100"
                    value={reorderThreshold}
                    onChange={(e) => setReorderThreshold(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3B2F2A] mb-1">Purchase Cost / Unit (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 60"
                  value={avgPurchaseRate}
                  onChange={(e) => setAvgPurchaseRate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#C8A96B]/20 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddStockOpen(false)}
                className="px-3.5 py-2 rounded-xl border border-[#C8A96B]/30 text-xs font-semibold text-[#3B2F2A] hover:bg-[#F2E8D6]/50 transition-colors cursor-pointer"
              >
                {t('forms.cancelBtn') || 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#174C3A] text-[#FAF7F2] text-xs font-bold hover:bg-[#174C3A]/90 transition-colors shadow-xs cursor-pointer"
              >
                {t('forms.saveProfileBtn') || 'Save Stock Item'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* RECORD SALE MODAL */}
      {isRecordSaleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <form onSubmit={handleRecordSale} className="bg-[#FAF7F2] border border-[#C8A96B]/40 rounded-2xl p-6 shadow-xl max-w-md w-full space-y-4">
            <div className="border-b border-[#C8A96B]/20 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#3B2F2A]">Record Commercial Sale</h3>
              <button
                type="button"
                onClick={() => setIsRecordSaleOpen(false)}
                className="text-xs text-[#3B2F2A]/60 hover:text-[#3B2F2A] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#3B2F2A] mb-1">Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Polished Chana Dal 1kg"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3B2F2A] mb-1">Customer / Buyer Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kirana Store"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B2F2A] mb-1">Customer Type</label>
                  <select
                    value={customerType}
                    onChange={(e) => setCustomerType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
                  >
                    <option value="RETAIL_KIRANA">Retail Kirana Store</option>
                    <option value="INDIVIDUAL_CONSUMER">Direct Consumer</option>
                    <option value="SHG_OUTLET">SHG Village Outlet</option>
                    <option value="INSTITUTION">Wholesale / Mandi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3B2F2A] mb-1">Units Sold *</label>
                  <input
                    type="number"
                    placeholder="e.g. 50"
                    value={unitsSold}
                    onChange={(e) => setUnitsSold(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B2F2A] mb-1">Rate / Unit (₹) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 95"
                    value={unitSalePrice}
                    onChange={(e) => setUnitSalePrice(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3B2F2A] mb-1">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
                  >
                    <option value="UPI">UPI / QR Code</option>
                    <option value="CASH">Cash in Hand</option>
                    <option value="CREDIT_15_DAYS">Bank NEFT / IMPS</option>
                  </select>
                </div>

                <div className="p-2 rounded-xl bg-[#F2E8D6]/50 flex flex-col justify-center">
                  <span className="text-[10px] text-[#3B2F2A]/60">Total Bill Value</span>
                  <div className="font-bold text-sm text-[#174C3A]">
                    ₹{((parseFloat(unitsSold) || 0) * (parseFloat(unitSalePrice) || 0)).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#C8A96B]/20 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsRecordSaleOpen(false)}
                className="px-3.5 py-2 rounded-xl border border-[#C8A96B]/30 text-xs font-semibold text-[#3B2F2A] hover:bg-[#F2E8D6]/50 transition-colors cursor-pointer"
              >
                {t('forms.cancelBtn') || 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#174C3A] text-[#FAF7F2] text-xs font-bold hover:bg-[#174C3A]/90 transition-colors shadow-xs cursor-pointer"
              >
                {t('forms.saveProfileBtn') || 'Log Sale Record'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
