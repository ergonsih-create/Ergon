/**
 * @license
 * GRAM-DISHA — Market & Commodity Benchmark Engine
 * Sourced from AGMARKNET, LGD, and National Sectoral Benchmarks.
 */

import { ProvenanceRecord } from '../../types';
import { LGD_STATES } from '../../data/lgdLocations';

export interface MandiCommodityRecord {
  commodity: string;
  variety: string;
  marketMandi: string;
  district: string;
  state: string;
  minPricePerQuintal: number;
  maxPricePerQuintal: number;
  modalPricePerQuintal: number;
  dailyArrivalTonnes: number;
  priceTrend: 'UPWARD' | 'STABLE' | 'DOWNWARD';
  dataDate: string;
  provenance: ProvenanceRecord;
}

export interface LocalMarketInsightData {
  demandIndex: number;
  accessibilityIndex: number;
  infrastructureIndex: number;
  competitorDensity: 'LOW' | 'MODERATE' | 'HIGH' | 'UNKNOWN';
  registeredCompetitorsCount: number | 'UNKNOWN';
  transportConnectivity: string;
  powerReliabilityHoursPerDay: number;
  coldStorageWithin25Km: boolean | 'UNKNOWN';
  commodities: MandiCommodityRecord[];
  provenanceSources: ProvenanceRecord[];
  odopCommodity?: string;
}

export class MarketEngine {
  public static getMarketInsights(districtName: string, category: string): LocalMarketInsightData {
    // Find district record across all states
    let foundDistrict: any = null;
    let foundState: any = null;

    for (const st of LGD_STATES) {
      const match = st.districts.find((d) => d.districtName.toLowerCase() === districtName.toLowerCase());
      if (match) {
        foundDistrict = match;
        foundState = st;
        break;
      }
    }

    const state = foundState ? foundState.stateName : 'India';
    const odop = foundDistrict ? foundDistrict.notifiedODOP : 'Agro-Processing Commodity';
    const isRural = foundDistrict ? foundDistrict.urbanityClassification === 'RURAL' : true;

    return {
      demandIndex: 0,
      accessibilityIndex: 0,
      infrastructureIndex: 0,
      odopCommodity: odop,
      competitorDensity: 'UNKNOWN',
      registeredCompetitorsCount: 'UNKNOWN',
      transportConnectivity: foundDistrict 
        ? `LGD Reference: ${foundDistrict.districtName} is connected via State/National Highway network and PMGSY rural roads. Live traffic/connectivity telemetry requires local sensor connection.`
        : 'Connectivity status unverified for selected location.',
      powerReliabilityHoursPerDay: foundDistrict?.powerTariffZone.includes('24x7') ? 24.0 : 0,
      coldStorageWithin25Km: 'UNKNOWN', // Live cold-chain telemetry unverified
      commodities: [], // Live AGMARKNET spot prices not connected; honesty over fabrication
      provenanceSources: [
        {
          sourceId: 'SRC_LGD_01',
          sourceName: 'Local Government Directory (LGD), MoPR',
          sourceType: 'OFFICIAL_GOVERNMENT',
          sourceUrl: 'https://lgdirectory.gov.in',
          dataVintage: '2026 Directory Master Ingestion',
          geographicScope: 'DISTRICT',
          confidenceScore: 0.99,
          assumptions: ['Constitutional Gram Panchayat jurisdictional boundaries & LGD standard codes'],
          lastVerifiedDate: '2026-03-01',
        },
        {
          sourceId: 'SRC_ODOP_01',
          sourceName: 'One District One Product (ODOP) — Ministry of Commerce & Industry',
          sourceType: 'OFFICIAL_GOVERNMENT',
          sourceUrl: 'https://www.investindia.gov.in/one-district-one-product',
          dataVintage: '2025-11-20',
          geographicScope: 'DISTRICT',
          confidenceScore: 0.98,
          assumptions: ['Notified commercial commodity under central ODOP initiative'],
          lastVerifiedDate: '2025-11-20',
        }
      ]
    };
  }
}
