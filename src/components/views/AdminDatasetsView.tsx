/**
 * @license
 * GRAM-DISHA — 30 Master Government Datasets Registry & Provenance Vault
 */

import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  RefreshCw, 
  Layers, 
  Info,
  Calendar
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { MASTER_GOVERNMENT_DATASETS, MasterDatasetMetadata } from '../../data/masterDatasets';

export const AdminDatasetsView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDataset, setSelectedDataset] = useState<MasterDatasetMetadata | null>(null);

  const categories = [
    'ALL',
    'GEOGRAPHIC_LGD',
    'COMMODITY_AGMARKNET',
    'GOVERNMENT_SCHEMES',
    'INFRASTRUCTURE_ENERGY',
    'DEMOGRAPHICS_SOCIOECONOMIC',
    'CREDIT_BANKING',
    'REGULATORY_COMPLIANCE'
  ];

  const filteredDatasets = MASTER_GOVERNMENT_DATASETS.filter((ds) => {
    const matchesSearch = ds.datasetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ds.ministryOrPublisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ds.datasetCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || ds.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div id="admin_datasets_view" className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D9D3C7]/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-display font-bold text-[#242522]">
              30 Master Government Datasets Registry
            </h1>
            <Badge variant="forest">{MASTER_GOVERNMENT_DATASETS.length} Verified Registers</Badge>
          </div>
          <p className="text-xs text-[#68655D] mt-0.5">
            Full provenance tracking, confidence benchmarks, and sync vintage across all official government sources.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#68655D] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search datasets by ministry, code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl border border-[#D9D3C7] bg-[#FCFAF5] text-xs text-[#242522] focus:outline-none focus:ring-2 focus:ring-[#174C3A]/30 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-[#174C3A] text-[#FCFAF5]'
                : 'bg-[#FCFAF5] text-[#68655D] border border-[#D9D3C7] hover:bg-[#F8F5EE]'
            }`}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Datasets Table */}
      <Card title="Master Dataset Catalog" subtitle="Evidence-bound data ground truth">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8F5EE] text-[#242522] font-semibold border-b border-[#D9D3C7]">
              <tr>
                <th className="p-3">Dataset Code</th>
                <th className="p-3">Dataset Name & Description</th>
                <th className="p-3">Ministry / Publisher</th>
                <th className="p-3">Category</th>
                <th className="p-3">Frequency</th>
                <th className="p-3 text-center">Confidence</th>
                <th className="p-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9D3C7]/60">
              {filteredDatasets.map((ds) => (
                <tr key={ds.datasetCode} className="hover:bg-[#F8F5EE]/60 transition-colors">
                  <td className="p-3 font-mono font-bold text-[#174C3A]">
                    {ds.datasetCode}
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-[#242522]">{ds.datasetName}</div>
                    <div className="text-[10px] text-[#68655D] max-w-md truncate">{ds.description}</div>
                  </td>
                  <td className="p-3 text-[#242522] font-medium">
                    {ds.ministryOrPublisher}
                  </td>
                  <td className="p-3">
                    <Badge variant="neutral" size="sm">{ds.category}</Badge>
                  </td>
                  <td className="p-3 text-[#68655D]">
                    {ds.updateFrequency}
                  </td>
                  <td className="p-3 text-center">
                    <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                      {(ds.confidenceWeight * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedDataset(ds)}
                      className="text-xs font-semibold text-[#174C3A] hover:text-[#B95736] underline"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: Detailed Dataset Provenance */}
      {selectedDataset && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FCFAF5] rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-[#D9D3C7] space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-[#174C3A]">{selectedDataset.datasetCode}</span>
                <h3 className="font-display font-bold text-lg text-[#242522] mt-0.5">
                  {selectedDataset.datasetName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDataset(null)}
                className="w-7 h-7 rounded-full bg-[#F8F5EE] border border-[#D9D3C7] flex items-center justify-center text-xs font-bold text-[#68655D]"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#68655D] leading-relaxed">
              {selectedDataset.description}
            </p>

            <div className="space-y-2 text-xs border-y border-[#D9D3C7]/60 py-3">
              <div className="flex justify-between">
                <span className="text-[#68655D]">Publishing Ministry:</span>
                <span className="font-bold text-[#242522]">{selectedDataset.ministryOrPublisher}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#68655D]">Update Frequency:</span>
                <span className="font-semibold text-[#242522]">{selectedDataset.updateFrequency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#68655D]">Last Synced Vintage:</span>
                <span className="font-mono text-[#242522]">{selectedDataset.lastSyncedVintage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#68655D]">Deterministic Engine Usage:</span>
                <span className="font-semibold text-[#174C3A]">{selectedDataset.primaryEngineUsage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#68655D]">Confidence Score:</span>
                <span className="font-mono font-bold text-emerald-800">{(selectedDataset.confidenceWeight * 100).toFixed(0)}%</span>
              </div>
              {selectedDataset.officialPortalUrl && (
                <div className="flex justify-between">
                  <span className="text-[#68655D]">Official Portal:</span>
                  <a
                    href={selectedDataset.officialPortalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#174C3A] font-semibold hover:underline flex items-center gap-1"
                  >
                    {selectedDataset.officialPortalUrl}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            <Button
              variant="forest"
              size="sm"
              className="w-full justify-center text-xs"
              onClick={() => setSelectedDataset(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}

    </div>
  );
};
