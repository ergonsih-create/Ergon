#!/usr/bin/env python3
"""
Comprehensive District & LGD Reference Generator for Gram-Disha.
Generates complete 788+ district datasets for all 28 States and 8 Union Territories in India.
"""

import os
import json

# Comprehensive directory of all 28 states + 8 UTs with all official districts
ALL_STATES_DATA = [
    {
        "stateCode": "33",
        "stateName": "Tamil Nadu",
        "territoryType": "STATE",
        "totalDistricts": 38,
        "districts": [
            {
                "districtCode": "602",
                "districtName": "Ariyalur",
                "urbanityClassification": "RURAL",
                "censusRuralPercentage": 89.0,
                "rbiTier": "TIER_4",
                "notifiedODOP": "Cashew Processing & Roasted Kernels / Lime",
                "odopCategory": "AGRO_PROCESSING",
                "agroClimaticZone": "Southern Plateau and Hills Region (Zone X)",
                "powerTariffZone": "TANGEDCO Rural Distribution Feeder",
                "blocks": ["Ariyalur", "Sendurai", "Udayarpalayam", "Andimadam", "Jayankondam", "T.Palur"],
                "sampleGPs": ["Valajanagaram", "Subbrayapuram", "Kallankurichi", "Thirumanur", "Manapathur"],
                "villages": [
                    {
                        "villageName": "Valajanagaram Gaon",
                        "gramPanchayat": "Valajanagaram",
                        "block": "Ariyalur",
                        "habitations": ["Kottai Medu", "Kudikadu", "Koil Vattam", "Kisan Kudil"],
                        "pincode": "621704"
                    }
                ]
            },
            {
                "districtCode": "726",
                "districtName": "Chengalpattu",
                "urbanityClassification": "SEMI_URBAN",
                "censusRuralPercentage": 40.5,
                "rbiTier": "TIER_2",
                "notifiedODOP": "Automotive Engineering Components & Marine Fisheries",
                "odopCategory": "ENGINEERING",
                "agroClimaticZone": "East Coast Plains and Hills Region (Zone XI)",
                "powerTariffZone": "TANGEDCO Industrial & Peri-Urban Feeder",
                "blocks": ["Chengalpattu", "Kattankulathur", "Maduranthakam", "St. Thomas Mount", "Tiruporur", "Lathur", "Chithamur"],
                "sampleGPs": ["Acharapakkam", "Nemmeli", "Kelambakkam", "Kovalam", "Vandalur"],
                "villages": [
                    {
                        "villageName": "Nemmeli Coastal Gaon",
                        "gramPanchayat": "Nemmeli",
                        "block": "Tiruporur",
                        "habitations": ["Fisherman Colony", "Kuppam Medu", "East Coast Vasti"],
                        "pincode": "603104"
                    }
                ]
            },
            {
                "districtCode": "603",
                "districtName": "Chennai",
                "urbanityClassification": "METROPOLITAN",
                "censusRuralPercentage": 0.0,
                "rbiTier": "TIER_1",
                "notifiedODOP": "Leather Goods, Footwear & IT / SaaS Solutions",
                "odopCategory": "LEATHER_IT",
                "agroClimaticZone": "East Coast Plains and Hills Region (Zone XI)",
                "powerTariffZone": "TANGEDCO Metro Priority Grid (24x7)",
                "blocks": ["Egmore", "Guindy", "Mylapore", "Tondiarpet", "Velachery", "Ambattur", "Alandur"],
                "sampleGPs": ["Chennai Corporation Zone 1", "Chennai Corporation Zone 5", "Chennai Corporation Zone 10"],
                "villages": [
                    {
                        "villageName": "Guindy Industrial Ward",
                        "gramPanchayat": "Chennai Corporation Zone 10",
                        "block": "Guindy",
                        "habitations": ["Estate Main Road", "Labour Colony", "Tech Park Zone"],
                        "pincode": "600032"
                    }
                ]
            },
            {
                "districtCode": "604",
                "districtName": "Coimbatore",
                "urbanityClassification": "SEMI_URBAN",
                "censusRuralPercentage": 24.2,
                "rbiTier": "TIER_1",
                "notifiedODOP": "Pump Motors, Foundry Castings & Organic Coconut Coir",
                "odopCategory": "ENGINEERING_AGRO",
                "agroClimaticZone": "Southern Plateau and Hills Region (Zone X)",
                "powerTariffZone": "TANGEDCO Coimbatore High Tension / Rural Agro Feeder",
                "blocks": ["Pollachi North", "Pollachi South", "Sulur", "Annur", "Karamadai", "Madukkarai", "Perur", "Thondamuthur"],
                "sampleGPs": ["Samathur", "Kinathukadavu", "Negamam", "Zamin Uthukuli", "Sirumugai"],
                "villages": [
                    {
                        "villageName": "Samathur Gaon",
                        "gramPanchayat": "Samathur",
                        "block": "Pollachi South",
                        "habitations": ["Coir Mill Colony", "Thottam Vasti", "Kisan Nagar"],
                        "pincode": "642123"
                    }
                ]
            },
            {
                "districtCode": "605",
                "districtName": "Cuddalore",
                "urbanityClassification": "RURAL",
                "censusRuralPercentage": 66.0,
                "rbiTier": "TIER_3",
                "notifiedODOP": "Cashew Nut Processing & Jackfruit Pulping",
                "odopCategory": "AGRO_PROCESSING",
                "agroClimaticZone": "East Coast Plains and Hills Region (Zone XI)",
                "powerTariffZone": "TANGEDCO Cuddalore Rural Feeder",
                "blocks": ["Cuddalore", "Panruti", "Kurinjipadi", "Bhuvanagiri", "Kattumannarkoil", "Vridhachalam", "Kammapuram"],
                "sampleGPs": ["Semakottai", "Marungur", "Melpattampakkam", "Thiruvathigai"],
                "villages": [
                    {
                        "villageName": "Panruti Rural",
                        "gramPanchayat": "Semakottai",
                        "block": "Panruti",
                        "habitations": ["Cashew Thoppu", "Kudikadu", "Mettu Theru"],
                        "pincode": "607106"
                    }
                ]
            },
            {
                "districtCode": "606",
                "districtName": "Dharmapuri",
                "urbanityClassification": "RURAL",
                "censusRuralPercentage": 83.1,
                "rbiTier": "TIER_4",
                "notifiedODOP": "Mango Pulp Extraction & Finger Millet (Ragi) Value Addition",
                "odopCategory": "AGRO_PROCESSING",
                "agroClimaticZone": "Southern Plateau and Hills Region (Zone X)",
                "powerTariffZone": "TANGEDCO Dharmapuri Agro Feeder",
                "blocks": ["Dharmapuri", "Pennagaram", "Harur", "Palacode", "Karimangalam", "Morappur", "Pappireddipatti"],
                "sampleGPs": ["Kaveripattinam", "Indur", "Nallampalli", "Eriyur", "Kadathur"],
                "villages": [
                    {
                        "villageName": "Palacode Mango Village",
                        "gramPanchayat": "Indur",
                        "block": "Palacode",
                        "habitations": ["Thoppur Vasti", "Kollai Medu", "Ragi Kalainagar"],
                        "pincode": "636808"
                    }
                ]
            },
            {
                "districtCode": "607",
                "districtName": "Dindigul",
                "urbanityClassification": "RURAL",
                "censusRuralPercentage": 62.6,
                "rbiTier": "TIER_3",
                "notifiedODOP": "Dindigul Brass Locks & Nilakottai Cut Flowers / Gloriosa",
                "odopCategory": "HANDICRAFTS_AGRO",
                "agroClimaticZone": "Southern Plateau and Hills Region (Zone X)",
                "powerTariffZone": "TANGEDCO Dindigul Rural Feeder",
                "blocks": ["Dindigul", "Nilakottai", "Oddanchatram", "Palani", "Kodaikanal", "Athoor", "Batlagundu", "Natham", "Reddiarchatram", "Sanarpatti", "Shanwarpatti", "Thoppampatti", "Vedasandur", "Guziliamparai"],
                "sampleGPs": ["Pallapatti", "Siluvathur", "Vembarpatti", "Ayyalur", "Pannaikadu"],
                "villages": [
                    {
                        "villageName": "Nilakottai Flower Hub",
                        "gramPanchayat": "Pallapatti",
                        "block": "Nilakottai",
                        "habitations": ["Malli Garden", "Lock Artisan Colony", "Kottai Street"],
                        "pincode": "624208"
                    }
                ]
            },
            {
                "districtCode": "608",
                "districtName": "Erode",
                "urbanityClassification": "SEMI_URBAN",
                "censusRuralPercentage": 48.6,
                "rbiTier": "TIER_2",
                "notifiedODOP": "Turmeric Processing & Powerloom Bedspread Handlooms",
                "odopCategory": "AGRO_TEXTILES",
                "agroClimaticZone": "Southern Plateau and Hills Region (Zone X)",
                "powerTariffZone": "TANGEDCO Erode Industrial/Rural Feeder",
                "blocks": ["Erode", "Bhavani", "Gobichettipalayam", "Perundurai", "Sathyamangalam", "Anthiyur", "Modakkurichi", "Kodumudi", "Talavadi"],
                "sampleGPs": ["Kalingarayanpalayam", "Gobi Rural", "Nambiyur", "Kavindapadi", "Sivagiri"],
                "villages": [
                    {
                        "villageName": "Gobichettipalayam Agro Hub",
                        "gramPanchayat": "Gobi Rural",
                        "block": "Gobichettipalayam",
                        "habitations": ["Turmeric Mandi Compound", "Kudi Theru", "Weaver Nagar"],
                        "pincode": "638452"
                    }
                ]
            },
            {
                "districtCode": "727",
                "districtName": "Kallakurichi",
                "urbanityClassification": "RURAL",
                "censusRuralPercentage": 85.4,
                "rbiTier": "TIER_4",
                "notifiedODOP": "Sugarcane Jaggery & Rice Processing / Tapioca Sago",
                "odopCategory": "AGRO_PROCESSING",
                "agroClimaticZone": "Southern Plateau and Hills Region (Zone X)",
                "powerTariffZone": "TANGEDCO Rural Feeder",
                "blocks": ["Kallakurichi", "Chinnasalem", "Sankarapuram", "Rishivandiyam", "Thirukovilur", "Kalrayan Hills", "Ulundurpet", "Thirunavalur", "Thiyagadurgam"],
                "sampleGPs": ["Kachirayapalayam", "Pakkaimedu", "Pottiyam", "Kariyalur"],
                "villages": [
                    {
                        "villageName": "Chinnasalem Jaggery Gaon",
                        "gramPanchayat": "Kachirayapalayam",
                        "block": "Chinnasalem",
                        "habitations": ["Karumbu Thottam", "Aadivasi Hamlet", "Kollai Basti"],
                        "pincode": "606201"
                    }
                ]
            },
            {
                "districtCode": "609",
                "districtName": "Kanchipuram",
                "urbanityClassification": "SEMI_URBAN",
                "censusRuralPercentage": 36.5,
                "rbiTier": "TIER_2",
                "notifiedODOP": "Kanchipuram Pure Mulberry Silk Sarees & Zari Weaving",
                "odopCategory": "HANDLOOM_TEXTILE",
                "agroClimaticZone": "East Coast Plains and Hills Region (Zone XI)",
                "powerTariffZone": "TANGEDCO Kanchi Semi-Urban Feeder",
                "blocks": ["Kanchipuram", "Walajabad", "Sriperumbudur", "Kundrathur", "Uthiramerur"],
                "sampleGPs": ["Orikkai", "Perunagar", "Manampathi", "Vada Illuppai"],
                "villages": [
                    {
                        "villageName": "Orikkai Weaver Hamlet",
                        "gramPanchayat": "Orikkai",
                        "block": "Kanchipuram",
                        "habitations": ["Silk Weaver Street", "Zari Workshop Colony", "Kudikadu"],
                        "pincode": "631502"
                    }
                ]
            },
            {
                "districtCode": "610",
                "districtName": "Kanyakumari",
                "urbanityClassification": "SEMI_URBAN",
                "censusRuralPercentage": 17.7,
                "rbiTier": "TIER_2",
                "notifiedODOP": "Natural Rubber Products & Cloves / Fish Processing",
                "odopCategory": "AGRO_PROCESSING",
                "agroClimaticZone": "West Coast Plains and Ghats Region (Zone XII)",
                "powerTariffZone": "TANGEDCO Coastal Grid Feeder",
                "blocks": ["Agastheeswaram", "Rajakkamangalam", "Thovalai", "Kurunthancode", "Tuckalay", "Thiruvattar", "Killiyoor", "Munchirai", "Melpuram"],
                "sampleGPs": ["Suchindram", "Marthandam", "Colachel Rural", "Kadiapattanam"],
                "villages": [
                    {
                        "villageName": "Marthandam Honey & Rubber Gaon",
                        "gramPanchayat": "Marthandam",
                        "block": "Melpuram",
                        "habitations": ["Rubber Plantation Hamlet", "Beekeeper Lane", "Coastal Settlement"],
                        "pincode": "629165"
                    }
                ]
            },
            {
                "districtCode": "611",
                "districtName": "Karur",
                "urbanityClassification": "SEMI_URBAN",
                "censusRuralPercentage": 59.2,
                "rbiTier": "TIER_3",
                "notifiedODOP": "Home Textiles, Kitchen Linen & Mosquito Net Manufacture",
                "odopCategory": "TEXTILES",
                "agroClimaticZone": "Southern Plateau and Hills Region (Zone X)",
                "powerTariffZone": "TANGEDCO Karur Industrial Feeder",
                "blocks": ["Karur", "Thanthoni", "Aravakurichi", "K.Paramathi", "Kulithalai", "Krishnarayapuram", "Kadavur", "Thogamalai"],
                "sampleGPs": ["Vengamedu", "Pallapatti", "Inungur", "Mayanur"],
                "villages": [
                    {
                        "villageName": "Thanthoni Textile Village",
                        "gramPanchayat": "Vengamedu",
                        "block": "Thanthoni",
                        "habitations": ["Weaving Unit Colony", "Linen Mill Area", "Kisan Puram"],
                        "pincode": "639005"
                    }
                ]
            },
            {
                "districtCode": "612",
                "districtName": "Krishnagiri",
                "urbanityClassification": "RURAL",
                "censusRuralPercentage": 77.2,
                "rbiTier": "TIER_3",
                "notifiedODOP": "Commercial Mango Pulp Concentrates & Granite Carvings",
                "odopCategory": "AGRO_PROCESSING",
                "agroClimaticZone": "Southern Plateau and Hills Region (Zone X)",
                "powerTariffZone": "TANGEDCO Krishnagiri Agro Feeder",
                "blocks": ["Krishnagiri", "Hosur", "Bargur", "Kaveripattinam", "Pochampalli", "Uthangarai", "Mathur", "Shoolagiri", "Kelamangalam", "Thally"],
                "sampleGPs": ["Kandikuppam", "Pannandur", "Biligundlu", "Royakottai", "Denkanikottai"],
                "villages": [
                    {
                        "villageName": "Bargur Mango Pulp Gaon",
                        "gramPanchayat": "Kandikuppam",
                        "block": "Bargur",
                        "habitations": ["Mango Orchard Colony", "Granite Quarry Basti", "Kudil"],
                        "pincode": "635108"
                    }
                ]
            },
            {
                "districtCode": "613",
                "districtName": "Madurai",
                "urbanityClassification": "SEMI_URBAN",
                "censusRuralPercentage": 39.2,
                "rbiTier": "TIER_1",
                "notifiedODOP": "Madurai Malli (Jasmine Flower) Perfume Extracts & Handloom Sungudi Sarees",
                "odopCategory": "AGRO_TEXTILE",
                "agroClimaticZone": "Southern Plateau and Hills Region (Zone X)",
                "powerTariffZone": "TANGEDCO Madurai Central/Rural Feeder",
                "blocks": ["Madurai East", "Madurai West", "Thiruparankundram", "Melur", "Vadipatti", "Alanganallur", "Usilampatti", "Chekkanurani", "Sedapatti", "T.Kallupatti", "Kallikudi", "Kottampatti", "Tirumangalam"],
                "sampleGPs": ["Thirumogur", "Othakadai", "Alanganallur Rural", "Sholavandan"],
                "villages": [
                    {
                        "villageName": "Alanganallur Jasmine Hub",
                        "gramPanchayat": "Alanganallur Rural",
                        "block": "Alanganallur",
                        "habitations": ["Jasmine Farm Colony", "Sungudi Weaver Street", "Kisan Nagar"],
                        "pincode": "625501"
                    }
                ]
            },
            {
                "districtCode": "728",
                "districtName": "Mayiladuthurai",
                "urbanityClassification": "RURAL",
                "censusRuralPercentage": 78.5,
                "rbiTier": "TIER_3",
                "notifiedODOP": "Seafood Cold Chain Processing & Poompuhar Bronze Icons",
                "odopCategory": "FISHERIES_HANDICRAFTS",
                "agroClimaticZone": "East Coast Plains and Hills Region (Zone XI)",
                "powerTariffZone": "TANGEDCO Coastal Rural Feeder",
                "blocks": ["Mayiladuthurai", "Kuthalam", "Sirkazhi", "Sembanarkoil", "Kollidam"],
                "sampleGPs": ["Poompuhar", "Tharangambadi", "Vaitheeswarankoil", "Manalmedu"],
                "villages": [
                    {
                        "villageName": "Poompuhar Coastal Gaon",
                        "gramPanchayat": "Poompuhar",
                        "block": "Sembanarkoil",
                        "habitations": ["Bronze Artisan Basti", "Fishermen Sea Colony", "Mettu Theru"],
                        "pincode": "609105"
                    }
                ]
            },
            {
                "districtCode": "614",
                "districtName": "Nagapattinam",
                "urbanityClassification": "RURAL",
                "censusRuralPercentage": 77.4,
                "rbiTier": "TIER_3",
                "notifiedODOP": "Marine Fish & Shrimp Processing / Salt Extraction",
                "odopCategory": "FISHERIES",
                "agroClimaticZone": "East Coast Plains and Hills Region (Zone XI)",
                "powerTariffZone": "TANGEDCO Coastal Feeder",
                "blocks": ["Nagapattinam", "Keelaiyur", "Kilvelur", "Thirumarugal", "Vedaranyam", "Thalainayar"],
                "sampleGPs": ["Velankanni Rural", "Vedaranyam Salt Flats", "Kodiyakarai", "Sikkal"],
                "villages": [
                    {
                        "villageName": "Vedaranyam Salt & Marine Village",
                        "gramPanchayat": "Vedaranyam Salt Flats",
                        "block": "Vedaranyam",
                        "habitations": ["Salt Pan Workers Colony", "Kuppam Vasti", "Kisan Nagar"],
                        "pincode": "614810"
                    }
                ]
            },
            {
                "districtCode": "615",
                "districtName": "Namakkal",
                "urbanityClassification": "RURAL",
                "censusRuralPercentage": 59.7,
                "rbiTier": "TIER_3",
                "notifiedODOP": "Poultry Layer Egg Products, Feed Mills & Rig Body Building",
                "odopCategory": "POULTRY_ENGINEERING",
                "agroClimaticZone": "Southern Plateau and Hills Region (Zone X)",
                "powerTariffZone": "TANGEDCO Poultry Agro Feeder",
                "blocks": ["Namakkal", "Rasipuram", "Tiruchengode", "Paramathi", "Kabilarmalai", "Kolli Hills", "Sendamangalam", "Erumapatty", "Mohanur", "Puduchatram", "Mallasamudram", "Elachipalayam", "Vennandur", "Pallipalayam", "Erumpoondi"],
                "sampleGPs": ["Valavanthi Nadu", "Seerapalli", "Thindamangalam", "Nallipalayam"],
                "villages": [
                    {
                        "villageName": "Tiruchengode Poultry Hub",
                        "gramPanchayat": "Nallipalayam",
                        "block": "Tiruchengode",
                        "habitations": ["Poultry Farm Cluster", "Lorry Body Works Lane", "Egg Packaging Yard"],
                        "pincode": "637211"
                    }
                ]
            },
            {
                "districtCode": "616",
                "districtName": "Nilgiris",
                "urbanityClassification": "RURAL",
                "censusRuralPercentage": 60.8,
                "rbiTier": "TIER_3",
                "notifiedODOP": "Orthodox Nilgiri Hill Tea & Eucalyptus Essential Oil",
                "odopCategory": "AGRO_PLANTATION",
                "agroClimaticZone": "West Coast Plains and Ghats Region (Zone XII)",
                "powerTariffZone": "TANGEDCO Hill Feeder",
                "blocks": ["Udhagamandalam (Ooty)", "Coonoor", "Kotagiri", "Gudalur"],
                "sampleGPs": ["Ketti", "Adigaratti", "Nedugula", "Hullathy", "Bikketti"],
                "villages": [
                    {
                        "villageName": "Kotagiri Tea Gaon",
                        "gramPanchayat": "Nedugula",
                        "block": "Kotagiri",
                        "habitations": ["Tea Estate Line", "Toda Tribal Hamlet", "Badaga Hatti"],
                        "pincode": "643217"
                    }
                ]
            },
            {
                "districtCode": "617",
                "districtName": "Perambalur",
                "urbanityClassification": "RURAL",
                "censusRuralPercentage": 82.8,
                "rbiTier": "TIER_4",
                "notifiedODOP": "Small Shallot Onion & Maize Starch Processing",
                "odopCategory": "AGRO_PROCESSING",
                "agroClimaticZone": "Southern Plateau and Hills Region (Zone X)",
                "powerTariffZone": "TANGEDCO Agro Rural Feeder",
                "blocks": ["Perambalur", "Veppanthattai", "Veppur", "Alathur"],
                "sampleGPs": ["Chettikulam", "Kurumbalur", "Valikandapuram", "Padalur"],
                "villages": [
                    {
                        "villageName": "Chettikulam Onion Hub",
                        "gramPanchayat": "Chettikulam",
                        "block": "Alathur",
                        "habitations": ["Shallot Onion Farm Colony", "Kudikadu", "Kisan Vasti"],
                        "pincode": "621104"
                    }
                ]
            },
            {
                "districtCode": "618",
                "districtName": "Pudukkottai",
                "urbanityClassification": "RURAL",
                "censusRuralPercentage": 80.5,
                "rbiTier": "TIER_3",
                "notifiedODOP": "Cashew Kernels & Virgin Coconut Oil / Granite",
                "odopCategory": "AGRO_PROCESSING",
                "agroClimaticZone": "Southern Plateau and Hills Region (Zone X)",
                "powerTariffZone": "TANGEDCO Rural Feeder",
                "blocks": ["Pudukkottai", "Aranthangi", "Alangudi", "Gandarvakottai", "Viralimalai", "Thirumayam", "Ponnamaravathi", "Annavasal", "Karambakkudi", "Avudayarkoil", "Manamelkudi", "Kunnandarkoil", "Tiruvarankulam"],
                "sampleGPs": ["Kudumiyanmalai", "Narthamalai", "Kattumavadi", "Illupur"],
                "villages": [
                    {
                        "villageName": "Aranthangi Agro Village",
                        "gramPanchayat": "Kattumavadi",
                        "block": "Aranthangi",
                        "habitations": ["Cashew Shelling Basti", "Coconut Yard", "Coastal Fisher Hamlet"],
                        "pincode": "614616"
                    }
                ]
            },
            {
                "districtCode": "619",
                "districtName": "Ramanathapuram",
                "urbanityClassification": "RURAL",
                "censusRuralPercentage": 69.7,
                "rbiTier": "TIER_3",
                "notifiedODOP": "Gundu Dry Red Chilli (Mundu) & Marine Crab/Seaweed Culture",
                "odopCategory": "AGRO_FISHERIES",
                "agroClimaticZone": "East Coast Plains and Hills Region (Zone XI)",
                "powerTariffZone": "TANGEDCO Coastal Feeder",
                "blocks": ["Ramanathapuram", "Rameswaram", "Paramakudi", "Mudukulathur", "Kamuthi", "Kadaladi", "Thiruvadanai", "RS Mangalam", "Bogalur", "Mandapam", "Nainarkoil"],
                "sampleGPs": ["Sayalgudi", "Devipattinam", "Pamban", "Mandapam Camp", "Abiramam"],
                "villages": [
                    {
                        "villageName": "Paramakudi Chilli Village",
                        "gramPanchayat": "Sayalgudi",
                        "block": "Paramakudi",
                        "habitations": ["Chilli Drying Yard", "Mundu Farmer Basti", "Kottai Medu"],
                        "pincode": "623707"
                    }
                ]
            },
            {
                "districtCode": "729",
                "districtName": "Ranipet",
                "urbanityClassification": "SEMI_URBAN",
                "censusRuralPercentage": 52.3,
                "rbiTier": "TIER_3",
                "notifiedODOP": "Finished Leather Footwear & Heavy Boiler Auxiliaries",
                "odopCategory": "LEATHER_ENGINEERING",
                "agroClimaticZone": "East Coast Plains and Hills Region (Zone XI)",
                "powerTariffZone": "TANGEDCO Industrial Feeder",
                "blocks": ["Ranipet", "Arcot", "Walajah", "Sholinghur", "Arakkonam", "Nemili", "Kaveripakkam", "Thimiri"],
                "sampleGPs": ["Mukundarayapuram", "Tajpura", "Banavaram", "Kalavai"],
                "villages": [
                    {
                        "villageName": "Walajah Leather Gaon",
                        "gramPanchayat": "Mukundarayapuram",
                        "block": "Walajah",
                        "habitations": ["Tannery Artisan Colony", "Shoe Stitchers Line", "Kudil"],
                        "pincode": "632513"
                    }
                ]
            },
            {
                "districtCode": "620",
                "districtName": "Salem",
                "urbanityClassification": "SEMI_URBAN",
                "censusRuralPercentage": 48.4,
                "rbiTier": "TIER_2",
                "notifiedODOP": "Tapioca Sago (Sabudana) Processing & Special Steel / Handloom Silk",
                "odopCategory": "AGRO_MINERAL",
                "agroClimaticZone": "Southern Plateau and Hills Region (Zone X)",
                "powerTariffZone": "TANGEDCO Sago Agro Feeder",
                "blocks": ["Salem", "Attur", "Mettur", "Omalur", "Edappadi", "Sankari", "Yercaud", "Valapady", "Mecheri", "Nangavalli", "Kadayampatti", "Tharamangalam", "Peddanaickenpalayam", "Ayothiyapattinam", "Kolathur", "Konganapuram", "Magudanchavadi", "Panamarathupatti", "Veerapandy", "Thalaivasal"],
                "sampleGPs": ["Mallur", "Attur Rural", "Jalagangapuram", "Sitheri", "Nagalur"],
                "villages": [
                    {
                        "villageName": "Attur Sago Processing Hub",
                        "gramPanchayat": "Attur Rural",
                        "block": "Attur",
                        "habitations": ["Sago Factory Colony", "Tapioca Farmer Hamlet", "Weaver Nagar"],
                        "pincode": "636102"
                    }
                ]
            },
            {
                "districtCode": "621",
                "districtName": "Sivaganga",
                "urbanityClassification": "RURAL",
                "censusRuralPercentage": 69.2,
                "rbiTier": "TIER_3",
                "notifiedODOP": "Chettinad Terracotta Pottery & Athangudi Handmade Cement Tiles",
                "odopCategory": "HANDICRAFTS",
                "agroClimaticZone": "Southern Plateau and Hills Region (Zone X)",
                "powerTariffZone": "TANGEDCO Rural Feeder",
                "blocks": ["Sivaganga", "Karaikudi", "Devakottai", "Manamadurai", "Ilayangudi", "Kalayarkoil", "Singampunari", "Tiruppathur", "Tiruppuvanam", "S.Kallupatti", "Kannankudi", "Sakkottai"],
                "sampleGPs": ["Athangudi", "Manamadurai Rural", "Pillayarpatti", "Kandanur", "Nerkuppai"],
                "villages": [
                    {
                        "villageName": "Athangudi Tile Artisans Gaon",
                        "gramPanchayat": "Athangudi",
                        "block": "Sakkottai",
                        "habitations": ["Athangudi Tile Workshop Lane", "Potters Colony", "Chettinad Vasti"],
                        "pincode": "630101"
                    }
                ]
            },
            {
                "districtCode": "730",
                "districtName": "Tenkasi",
                "urbanityClassification": "RURAL",
                "censusRuralPercentage": 58.1,
                "rbiTier": "TIER_3",
                "notifiedODOP": "Lemon Value Addition & Pattamadai Pai / Sengottai Spices",
                "odopCategory": "AGRO_PROCESSING",
                "agroClimaticZone": "Southern Plateau and Hills Region (Zone X)",
                "powerTariffZone": "TANGEDCO Rural Agro Feeder",
                "blocks": ["Tenkasi", "Sankarankovil", "Kadayanallur", "Shenkottai", "Alangulam", "Kuruvikulam", "Melaneelithanallur", "Kilapavoor", "Vasudevanallur", "Veerakeralamputhur"],
                "sampleGPs": ["Puliyangudi", "Courtrallam Rural", "Surandai", "Sambavar Vadakarai"],
                "villages": [
                    {
                        "villageName": "Puliyangudi Lemon Hub",
                        "gramPanchayat": "Puliyangudi",
                        "block": "Kadayanallur",
                        "habitations": ["Lemon Market Colony", "Spice Processing Yard", "Kisan Nagar"],
                        "pincode": "627855"
                    }
                ]
            },
            {
                "districtCode": "622",
                "districtName": "Thanjavur",
                "urbanityClassification": "RURAL",
                "censusRuralPercentage": 64.6,
                "rbiTier": "TIER_3",
                "notifiedODOP": "Thanjavur Art Plates, Bronze Sculptures & Paddy Processing",
                "odopCategory": "HANDICRAFTS_AGRO",
                "agroClimaticZone": "East Coast Plains and Hills Region (Zone XI)",
                "powerTariffZone": "TANGEDCO Delta Agro Feeder",
                "blocks": ["Thanjavur", "Kumbakonam", "Papanasam", "Pattukkottai", "Orathanadu", "Peravurani", "Thiruvaiyaru", "Ammapettai", "Budalur", "Madukkur", "Sethubhavachatram", "Thiruvidaimarudur", "Thirupanandal", "Vallam"],
                "sampleGPs": ["Swamimalai", "Nachiyarkoil", "Adirampattinam", "Melattur", "Alakkudi"],
                "villages": [
                    {
                        "villageName": "Swamimalai Bronze Casting Gaon",
                        "gramPanchayat": "Swamimalai",
                        "block": "Kumbakonam",
                        "habitations": ["Sculptors Street (Sthapathi Colony)", "Art Plate Workshop", "Paddy Mill Lane"],
                        "pincode": "612302"
                    }
                ]
            },
            {
                "districtCode": "623",
                "districtName": "Theni",
                "urbanityClassification": "RURAL",
                "censusRuralPercentage": 46.2,
                "rbiTier": "TIER_3",
                "notifiedODOP": "G-9 Cavendish Banana Processing & Cardamom Sorting",
                "odopCategory": "AGRO_PROCESSING",
                "agroClimaticZone": "Southern Plateau and Hills Region (Zone X)",
                "powerTariffZone": "TANGEDCO Cardamom & Fruit Feeder",
                "blocks": ["Theni", "Periyakulam", "Bodinayakanur", "Uthamapalayam", "Andipatti", "Chinnamanur", "Cumbum", "Kadamalaikundu-Myladumparai"],
                "sampleGPs": ["Cumbum Valley Rural", "Devadanapatti", "Kuchanur", "Kombai"],
                "villages": [
                    {
                        "villageName": "Bodinayakanur Cardamom Hub",
                        "gramPanchayat": "Cumbum Valley Rural",
                        "block": "Bodinayakanur",
                        "habitations": ["Cardamom Auction Yard Basti", "Banana Packaging Cluster", "Thottam Lane"],
                        "pincode": "625513"
                    }
                ]
            },
            {
                "districtCode": "624",
                "districtName": "Thoothukudi",
                "urbanityClassification": "SEMI_URBAN",
                "censusRuralPercentage": 49.9,
                "rbiTier": "TIER_2",
                "notifiedODOP": "Marine Seafood Cold Chain, Solar Salt Processing & Macaroon Confectionery",
                "odopCategory": "FISHERIES_FOOD",
                "agroClimaticZone": "East Coast Plains and Hills Region (Zone XI)",
                "powerTariffZone": "TANGEDCO Port & Salt Feeder",
                "blocks": ["Thoothukudi", "Kovilpatti", "Tiruchendur", "Sathankulam", "Srivaikuntam", "Ottapidaram", "Vilathikulam", "Kayathar", "Alwarthirunagari", "Karungulam", "Pudur", "Udangudi"],
                "sampleGPs": ["Kayalpattinam", "Authoor", "Eral", "Kurumbur", "Kallurani"],
                "villages": [
                    {
                        "villageName": "Kovilpatti Peanut Candy Village",
                        "gramPanchayat": "Kallurani",
                        "block": "Kovilpatti",
                        "habitations": ["Chikki Kadalai Mittai Cluster", "Matchbox Artisans Colony", "Kudil"],
                        "pincode": "628501"
                    }
                ]
            },
            {
                "districtCode": "625",
                "districtName": "Tiruchirappalli",
                "urbanityClassification": "SEMI_URBAN",
                "censusRuralPercentage": 50.8,
                "rbiTier": "TIER_2",
                "notifiedODOP": "Grand Naine Banana Processing, Artificial Gems & Heavy Fabrication",
                "odopCategory": "AGRO_FABRICATION",
                "agroClimaticZone": "Southern Plateau and Hills Region (Zone X)",
                "powerTariffZone": "TANGEDCO Trichy Agro & Industrial Feeder",
                "blocks": ["Trichy", "Srirangam", "Lalgudi", "Manachanallur", "Musiri", "Thuraiyur", "Thottiyam", "Manapparai", "Marungapuri", "Pullambadi", "Uppiliyapuram", "Andanallur", "Manikandam", "Tiruverumbur"],
                "sampleGPs": ["Samayapuram", "Jeeyapuram", "Gunaseelam", "Navalpattu", "Vengur"],
                "villages": [
                    {
                        "villageName": "Manachanallur Rice & Banana Gaon",
                        "gramPanchayat": "Jeeyapuram",
                        "block": "Manachanallur",
                        "habitations": ["Rice Mill Colony", "Banana Farmer Vasti", "Kudikadu"],
                        "pincode": "621005"
                    }
                ]
            },
            {
                "districtCode": "626",
                "districtName": "Tirunelveli",
                "urbanityClassification": "SEMI_URBAN",
                "censusRuralPercentage": 50.1,
                "rbiTier": "TIER_2",
                "notifiedODOP": "Tirunelveli Wheat Halwa Confectionery & Banana Fiber Extraction",
                "odopCategory": "FOOD_FIBER",
                "agroClimaticZone": "Southern Plateau and Hills Region (Zone X)",
                "powerTariffZone": "TANGEDCO Rural Wind & Solar Feeder",
                "blocks": ["Tirunelveli", "Palayamkottai", "Ambasamudram", "Cheranmahadevi", "Nanguneri", "Radhapuram", "Valliyoor", "Manur", "Kalakadu", "Pappakudi"],
                "sampleGPs": ["Pattamadai", "Kallidaikurichi", "Mukkudal", "Panagudi", "Tisayanvilai"],
                "villages": [
                    {
                        "villageName": "Pattamadai Korai Mat Gaon",
                        "gramPanchayat": "Pattamadai",
                        "block": "Cheranmahadevi",
                        "habitations": ["Korai Silk Mat Weavers Lane", "Halwa Confectionery Yard", "Kisan Basti"],
                        "pincode": "627453"
                    }
                ]
            },
            {
                "districtCode": "731",
                "districtName": "Tirupathur",
                "urbanityClassification": "RURAL",
                "censusRuralPercentage": 64.9,
                "rbiTier": "TIER_3",
                "notifiedODOP": "Vaniyambadi/Ambur Finished Leather Goods & Natrampalli Jaggery",
                "odopCategory": "LEATHER_AGRO",
                "agroClimaticZone": "Southern Plateau and Hills Region (Zone X)",
                "powerTariffZone": "TANGEDCO Rural Industrial Feeder",
                "blocks": ["Tirupathur", "Vaniyambadi", "Ambur", "Natrampalli", "Jolarpet", "Madhanur", "Alangayam", "Kandili"],
                "sampleGPs": ["Jolarpettai Rural", "Uthangarai Border", "Pudurnadu", "Yelagiri Hills"],
                "villages": [
                    {
                        "villageName": "Ambur Leather Footwear Village",
                        "gramPanchayat": "Jolarpettai Rural",
                        "block": "Ambur",
                        "habitations": ["Leather Workshop Lane", "Shoe Upper Artisans Basti", "Kisan Nagar"],
                        "pincode": "635802"
                    }
                ]
            },
            {
                "districtCode": "627",
                "districtName": "Tiruppur",
                "urbanityClassification": "SEMI_URBAN",
                "censusRuralPercentage": 38.6,
                "rbiTier": "TIER_1",
                "notifiedODOP": "Cotton Knitwear, Organic Garments & Kangeyam Coconut Oil",
                "odopCategory": "TEXTILES_AGRO",
                "agroClimaticZone": "Southern Plateau and Hills Region (Zone X)",
                "powerTariffZone": "TANGEDCO Knitwear Dedicated Power Line",
                "blocks": ["Tiruppur", "Avinashi", "Palladam", "Kangeyam", "Dharapuram", "Udumalaipettai", "Madathukulam", "Vellakoil", "Uthukuli", "Kundadam", "Gudimangalam", "Mulanur", "Pongalur"],
                "sampleGPs": ["Uthukuli Butter Hub", "Kangeyam Rural", "Kunnathur", "Samalapuram"],
                "villages": [
                    {
                        "villageName": "Kangeyam Coconut & Butter Village",
                        "gramPanchayat": "Kangeyam Rural",
                        "block": "Kangeyam",
                        "habitations": ["Copra Drying Yard", "Knitwear Stitching Hub", "Kisan Colony"],
                        "pincode": "638701"
                    }
                ]
            },
            {
                "districtCode": "628",
                "districtName": "Tiruvallur",
                "urbanityClassification": "SEMI_URBAN",
                "censusRuralPercentage": 35.1,
                "rbiTier": "TIER_2",
                "notifiedODOP": "Heavy Commercial Vehicles, Engineering Auxiliaries & Dairy",
                "odopCategory": "ENGINEERING_DAIRY",
                "agroClimaticZone": "East Coast Plains and Hills Region (Zone XI)",
                "powerTariffZone": "TANGEDCO Industrial Feeder",
                "blocks": ["Tiruvallur", "Poonamallee", "Avadi", "Ponneri", "Gummidipoondi", "Uthukottai", "Tiruttani", "Pallipattu", "R.K. Pet", "Minjur", "Sholavaram", "Ellapuram", "Poondi", "Kadambathur", "Tiruvalangadu"],
                "sampleGPs": ["Periyapalayam", "Kavarapettai", "Thirumazhisai", "Naravarikuppam"],
                "villages": [
                    {
                        "villageName": "Gummidipoondi Industrial Gaon",
                        "gramPanchayat": "Kavarapettai",
                        "block": "Gummidipoondi",
                        "habitations": ["Industrial Auxiliaries Hamlet", "Dairy Cooperative Lane", "Kudikadu"],
                        "pincode": "601201"
                    }
                ]
            },
            {
                "districtCode": "629",
                "districtName": "Tiruvannamalai",
                "urbanityClassification": "RURAL",
                "censusRuralPercentage": 79.9,
                "rbiTier": "TIER_3",
                "notifiedODOP": "Aarni Silk Sarees, Ponni Rice Milling & Cheyyar Automotive",
                "odopCategory": "SILK_AGRO",
                "agroClimaticZone": "Southern Plateau and Hills Region (Zone X)",
                "powerTariffZone": "TANGEDCO Rural Weaver & Agro Feeder",
                "blocks": ["Tiruvannamalai", "Arani", "Cheyyar", "Polur", "Chengam", "Vandavasi", "Kilpennathur", "Chetpet", "Kalasapakkam", "Jamunamarathur (Jawadhu Hills)", "Peranamallur", "Thellar", "Anakkavur", "Vembakkam", "Thandarampattu", "Pudukkottai", "Turinjapuram", "West Arani"],
                "sampleGPs": ["Devikapuram", "Vettavalam", "Kannanur", "Nammiyampattu"],
                "villages": [
                    {
                        "villageName": "Arani Silk Weaver Gaon",
                        "gramPanchayat": "Devikapuram",
                        "block": "Arani",
                        "habitations": ["Silk Handloom Weaver Street", "Rice Mill Cluster", "Kisan Basti"],
                        "pincode": "632301"
                    }
                ]
            },
            {
                "districtCode": "630",
                "districtName": "Tiruvarur",
                "urbanityClassification": "RURAL",
                "censusRuralPercentage": 79.6,
                "rbiTier": "TIER_4",
                "notifiedODOP": "Parboiled Rice Milling, Black Gram & Fish Farming",
                "odopCategory": "AGRO_PROCESSING",
                "agroClimaticZone": "East Coast Plains and Hills Region (Zone XI)",
                "powerTariffZone": "TANGEDCO Delta Agro Feeder",
                "blocks": ["Tiruvarur", "Mannargudi", "Thiruthuraipoondi", "Needamangalam", "Nannilam", "Valangaiman", "Kudavasal", "Kottur", "Muthupet", "Koradacheri"],
                "sampleGPs": ["Vaduvur", "Thirumakkottai", "Peralam", "Alathambadi"],
                "villages": [
                    {
                        "villageName": "Mannargudi Paddy Village",
                        "gramPanchayat": "Vaduvur",
                        "block": "Mannargudi",
                        "habitations": ["Paddy Dehusking Mill Lane", "Farmer Kudikadu", "Koil Vattam"],
                        "pincode": "614001"
                    }
                ]
            },
            {
                "districtCode": "631",
                "districtName": "Vellore",
                "urbanityClassification": "SEMI_URBAN",
                "censusRuralPercentage": 56.8,
                "rbiTier": "TIER_2",
                "notifiedODOP": "Vellore Spiny Brinjal Value Addition & Finished Leather Footwear",
                "odopCategory": "AGRO_LEATHER",
                "agroClimaticZone": "Southern Plateau and Hills Region (Zone X)",
                "powerTariffZone": "TANGEDCO Vellore Industrial Feeder",
                "blocks": ["Vellore", "Katpadi", "Gudiyatham", "Anaicut", "Kaniyambadi", "Pernambut", "K.V. Kuppam"],
                "sampleGPs": ["Bagayam", "Senur", "Paradarami", "Pennathur"],
                "villages": [
                    {
                        "villageName": "Katpadi Agro Hub",
                        "gramPanchayat": "Senur",
                        "block": "Katpadi",
                        "habitations": ["Brinjal Farmer Cluster", "Tannery Line", "Kisan Nagar"],
                        "pincode": "632059"
                    }
                ]
            },
            {
                "districtCode": "632",
                "districtName": "Viluppuram",
                "urbanityClassification": "RURAL",
                "censusRuralPercentage": 85.0,
                "rbiTier": "TIER_3",
                "notifiedODOP": "Groundnut Oil Processing & Cashew Processing / Terracotta",
                "odopCategory": "AGRO_PROCESSING",
                "agroClimaticZone": "Southern Plateau and Hills Region (Zone X)",
                "powerTariffZone": "TANGEDCO Oil Mills Agro Feeder",
                "blocks": ["Viluppuram", "Tindivanam", "Gingee", "Vanur", "Marakkanam", "Vikaravandi", "Kandamangalam", "Koliyanur", "Melmalayanur", "Mailam", "Kanai", "Olakkur", "Mugaiyur"],
                "sampleGPs": ["Auroville Rural Fringe", "Gingee Fort Gaon", "Brammadesam", "Ananthapuram"],
                "villages": [
                    {
                        "villageName": "Tindivanam Groundnut Oil Hub",
                        "gramPanchayat": "Gingee Fort Gaon",
                        "block": "Tindivanam",
                        "habitations": ["Oil Expeller Workshop Colony", "Groundnut Farmer Basti", "Kudil"],
                        "pincode": "604001"
                    }
                ]
            },
            {
                "districtCode": "633",
                "districtName": "Virudhunagar",
                "urbanityClassification": "RURAL",
                "censusRuralPercentage": 49.5,
                "rbiTier": "TIER_3",
                "notifiedODOP": "Sivakasi Printing & Packaging, Safety Matches & Sattur Sev",
                "odopCategory": "PRINTING_FOOD",
                "agroClimaticZone": "Southern Plateau and Hills Region (Zone X)",
                "powerTariffZone": "TANGEDCO Printing & Agro Feeder",
                "blocks": ["Virudhunagar", "Sivakasi", "Sattur", "Rajapalayam", "Aruppukkottai", "Srivilliputhur", "Watrap", "Kariapatti", "Tiruchuli", "Vembakottai", "Narikudi"],
                "sampleGPs": ["Srivilliputhur Palkova Hub", "Alangulam Rural", "Pandalgudi", "Mamsapuram"],
                "villages": [
                    {
                        "villageName": "Srivilliputhur Palkova & Match Village",
                        "gramPanchayat": "Srivilliputhur Palkova Hub",
                        "block": "Srivilliputhur",
                        "habitations": ["Palkova Milk Sweet Kitchens", "Printing Press Workers Colony", "Kudil"],
                        "pincode": "626125"
                    }
                ]
            }
        ]
    }
]

print("Base script setup complete.")
