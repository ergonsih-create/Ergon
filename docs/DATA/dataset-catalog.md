# GRAM-DISHA — Dataset Catalog & Provenance Registry

## Master 30 Dataset Framework
1. **LGD (Local Government Directory)**: State, District, Block, Gram Panchayat, Village codes.
2. **AGMARKNET**: Daily agricultural commodity arrivals, min/max/modal prices across APMC mandis.
3. **PMEGP Register (KVIC/MSME)**: Micro-enterprise capital subsidy rates, social category matrices.
4. **MUDRA Scheme Rules**: Shishu, Kishore, Tarun loan criteria and SIDBI refinance terms.
5. **NSFDC / NBCFDC / NSKFDC**: Concessional finance norms for SC/OBC/Safai Karamchari entrepreneurs.
6. **PMFME (MoFPI)**: Micro food processing enterprise guidelines & credit-linked capital subsidies.
7. **Stand-Up India (SIDBI)**: Scheduled Caste, Scheduled Tribe, and Women greenfield enterprise norms.
8. **NABARD Sectoral Benchmarks**: Model project profiles (Dairy, Poultry, Cold storage, Solar dryer).
9. **RBI Priority Sector Lending (PSL)**: Small & Marginal Farmers, MSME sub-targets & rate caps.
10. **State Industrial Policies**: State-specific power subsidies, stamp duty exemptions, and capital grants.
11. **Census / SECC Data**: Demographic indices and household occupational profiles.
12. **National Skills Registry (NSDC)**: Vocational certification tracks and local cluster mapping.
13. **Geographical Indications (GI) Registry**: Traditional handicraft and artisanal cluster boundaries.
14. **CPCB / SPCB Categorization**: White/Green/Orange industrial pollution clearances.
15. **Udyam Registration Database**: MSME registration verification & activity classification (NIC codes).
... and 15 additional secondary agro-climatic, trade, and transport registries.

## Evidence & Uncertainty Protocol
- If a dataset is absent or hyper-local data cannot be verified, status is set to `UNKNOWN`.
- The HBFS engine deducts `0.20 * U` penalty to avoid overconfident guidance on incomplete datasets.
