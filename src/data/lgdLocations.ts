/**
 * @license
 * GRAM-DISHA — LGD Administrative Directory Pre-Seeded Dataset
 * Team ERGON — Smart India Hackathon 2026
 */

export interface LGDStateRecord {
  stateCode: string;
  stateName: string;
  districts: {
    districtCode: string;
    districtName: string;
    blocks: string[];
    sampleGPs: string[];
  }[];
}

export const LGD_STATES: LGDStateRecord[] = [
  {
    stateCode: '27',
    stateName: 'Maharashtra',
    districts: [
      {
        districtCode: '489',
        districtName: 'Yavatmal',
        blocks: ['Pusad', 'Umarkhed', 'Mahagaon', 'Digras', 'Darwha', 'Kelapur', 'Wani'],
        sampleGPs: ['Shendurjana', 'Gahuli', 'Khandala', 'Marsul', 'Fulsawangi', 'Bittergaon']
      },
      {
        districtCode: '490',
        districtName: 'Pune',
        blocks: ['Baramati', 'Haveli', 'Junner', 'Khed', 'Indapur', 'Shirur'],
        sampleGPs: ['Malegaon', 'Songaon', 'Korhale', 'Narayangaon', 'Alephata']
      },
      {
        districtCode: '491',
        districtName: 'Nashik',
        blocks: ['Niphad', 'Dindori', 'Sinnar', 'Yeola', 'Kalwan', 'Malegaon'],
        sampleGPs: ['Pimpalgaon Baswant', 'Ozar', 'Vinchur', 'Lasalgaon']
      },
      {
        districtCode: '492',
        districtName: 'Amravati',
        blocks: ['Achalpur', 'Chandur Bazar', 'Morshi', 'Warud', 'Daryapur'],
        sampleGPs: ['Shirasgaon Kasba', 'Bhatkuli', 'Ashti', 'Jarud']
      }
    ]
  },
  {
    stateCode: '09',
    stateName: 'Uttar Pradesh',
    districts: [
      {
        districtCode: '175',
        districtName: 'Varanasi',
        blocks: ['Pindra', 'Kashi Vidyapeeth', 'Araziline', 'Sewapuri', 'Cholapur'],
        sampleGPs: ['Babatpur', 'Rameshwar', 'Kharawan', 'Sindhora', 'Tikari']
      },
      {
        districtCode: '176',
        districtName: 'Gorakhpur',
        blocks: ['Pipraich', 'Bhathat', 'Campierganj', 'Sardar Nagar', 'Bansgaon'],
        sampleGPs: ['Mahuawa', 'Khorabar', 'Jangal Kauria', 'Bharmpur']
      },
      {
        districtCode: '177',
        districtName: 'Prayagraj',
        blocks: ['Phulpur', 'Koraon', 'Handia', 'Karchhana', 'Jasra'],
        sampleGPs: ['Sahson', 'Manda', 'Saidabad', 'Bara']
      }
    ]
  },
  {
    stateCode: '08',
    stateName: 'Rajasthan',
    districts: [
      {
        districtCode: '112',
        districtName: 'Jodhpur',
        blocks: ['Osian', 'Mandore', 'Luni', 'Phalodi', 'Bhopalgarh'],
        sampleGPs: ['Tiwari', 'Balesar', 'Salawas', 'Tinwari', 'Khangta']
      },
      {
        districtCode: '113',
        districtName: 'Jaipur',
        blocks: ['Chamu', 'Amber', 'Sanganer', 'Bassi', 'Chaksu'],
        sampleGPs: ['Achrol', 'Bagru', 'Tunga', 'Watika', 'Kukas']
      }
    ]
  },
  {
    stateCode: '24',
    stateName: 'Gujarat',
    districts: [
      {
        districtCode: '445',
        districtName: 'Rajkot',
        blocks: ['Gondal', 'Jasdan', 'Jetpur', 'Dhoraji', 'Kotda Sangani'],
        sampleGPs: ['Gomta', 'Virpur', 'Ribda', 'Panchpipla', 'Hadmatiya']
      },
      {
        districtCode: '446',
        districtName: 'Anand',
        blocks: ['Petlad', 'Borsad', 'Umreth', 'Khambhat', 'Tarapur'],
        sampleGPs: ['Mogri', 'Karamsad', 'Chikhodra', 'Vasad']
      }
    ]
  },
  {
    stateCode: '23',
    stateName: 'Madhya Pradesh',
    districts: [
      {
        districtCode: '410',
        districtName: 'Ujjain',
        blocks: ['Mahidpur', 'Nagda', 'Tarana', 'Badnagar', 'Ghatiya'],
        sampleGPs: ['Kayatha', 'Rupakhedi', 'Bichhrod', 'Unhel']
      },
      {
        districtCode: '411',
        districtName: 'Indore',
        blocks: ['Sanwer', 'Depalpur', 'Mhow', 'Rau'],
        sampleGPs: ['Betma', 'Gautampura', 'Hasalpur', 'Dharampuri']
      }
    ]
  },
  {
    stateCode: '29',
    stateName: 'Karnataka',
    districts: [
      {
        districtCode: '540',
        districtName: 'Dharwad',
        blocks: ['Hubballi', 'Navalgund', 'Kundgol', 'Kalghatgi'],
        sampleGPs: ['Annigeri', 'Alnavar', 'Hebballi', 'Mugad']
      },
      {
        districtCode: '541',
        districtName: 'Mandya',
        blocks: ['Maddur', 'Malavalli', 'Pandavapura', 'Srirangapatna'],
        sampleGPs: ['Koppa', 'Besagarahalli', 'Kikkeri', 'Bellur']
      }
    ]
  },
  {
    stateCode: '10',
    stateName: 'Bihar',
    districts: [
      {
        districtCode: '215',
        districtName: 'Muzaffarpur',
        blocks: ['Kanti', 'Motipur', 'Paroo', 'Sahebganj', 'Marwan'],
        sampleGPs: ['Damodarpur', 'Repura', 'Bakhra', 'Madhurapur']
      },
      {
        districtCode: '216',
        districtName: 'Nalanda',
        blocks: ['Biharsharif', 'Rajgir', 'Hilsa', 'Silao', 'Ekangarsarai'],
        sampleGPs: ['Pawapuri', 'Nalanda', 'Chandi', 'Noorsarai']
      }
    ]
  }
];
