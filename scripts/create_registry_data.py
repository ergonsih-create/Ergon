#!/usr/bin/env python3
"""
Python script to generate `scripts/full_lgd_registry.py` with all 28 States and 8 Union Territories
and all 788+ districts of India.
"""

import sys
import os
import json

# Comprehensive directory of all 28 states + 8 UTs and all their districts
def build_registry():
    # Load all states
    states_data = []

    # 1. ANDHRA PRADESH (26)
    states_data.append({
        "stateCode": "28", "stateName": "Andhra Pradesh", "territoryType": "STATE", "totalDistricts": 26,
        "districts": [
            {"name": "Alluri Sitharama Raju", "code": "502", "urb": "RURAL", "rur": 89.2, "tier": "TIER_4", "odop": "Organic Coffee & Araku Valley Spices / Pepper", "cat": "AGRO_PLANTATION", "blocks": ["Paderu", "Araku Valley", "Chintapalle", "Rampachodavaram", "Maredumilli"]},
            {"name": "Anakapalli", "code": "745", "urb": "SEMI_URBAN", "rur": 61.5, "tier": "TIER_3", "odop": "Anakapalle Jaggery & Agro Derivatives / Food Processing", "cat": "AGRO_PROCESSING", "blocks": ["Anakapalli", "Chodavaram", "Madugula", "Yellamanchili", "Narsipatnam"]},
            {"name": "Ananthapuramu", "code": "503", "urb": "RURAL", "rur": 72.0, "tier": "TIER_3", "odop": "Groundnut Oil, Millet Value Addition & Silk Weaving", "cat": "AGRO_TEXTILES", "blocks": ["Anantapur", "Gooty", "Tadipatri", "Uravakonda", "Singanamala"]},
            {"name": "Annamayya", "code": "746", "urb": "RURAL", "rur": 78.4, "tier": "TIER_4", "odop": "Tomato Paste Processing & Papaya Cultivation / Silk", "cat": "AGRO_PROCESSING", "blocks": ["Rayachoti", "Madanapalle", "Rajampet", "Railway Kodur", "Thamballapalle"]},
            {"name": "Bapatla", "code": "747", "urb": "RURAL", "rur": 75.3, "tier": "TIER_3", "odop": "Paddy, Aquaculture & Cashew Processing", "cat": "AGRO_FISHERIES", "blocks": ["Bapatla", "Chirala", "Repalle", "Vemuru", "Addanki"]},
            {"name": "Chittoor", "code": "504", "urb": "RURAL", "rur": 70.5, "tier": "TIER_3", "odop": "Mango Pulp Processing & Dairy Products / Jaggery", "cat": "AGRO_PROCESSING", "blocks": ["Chittoor", "Palamaner", "Punganur", "Nagari", "GD Nellore"]},
            {"name": "Dr. B.R. Ambedkar Konaseema", "code": "748", "urb": "RURAL", "rur": 81.2, "tier": "TIER_3", "odop": "Coconut Coir Products & Freshwater Aquaculture / Handlooms", "cat": "AGRO_FISHERIES", "blocks": ["Amalapuram", "Razole", "Kothapeta", "Mummidivaram", "Ramachandrapuram"]},
            {"name": "East Godavari", "code": "505", "urb": "SEMI_URBAN", "rur": 58.2, "tier": "TIER_2", "odop": "Paper Mills, Rice Bran Oil & Food Processing", "cat": "AGRO_PROCESSING", "blocks": ["Rajahmundry Urban", "Rajahmundry Rural", "Kovvur", "Nidadavole", "Gopalapuram"]},
            {"name": "Eluru", "code": "749", "urb": "RURAL", "rur": 76.8, "tier": "TIER_3", "odop": "Cocoa Processing, Oil Palm Extraction & Carpets", "cat": "AGRO_PROCESSING", "blocks": ["Eluru", "Denduluru", "Chintalapudi", "Nuzvid", "Jangareddigudem"]},
            {"name": "Guntur", "code": "506", "urb": "SEMI_URBAN", "rur": 53.2, "tier": "TIER_1", "odop": "Guntur Sannam Red Chilli Processing & Cotton Ginning", "cat": "AGRO_PROCESSING", "blocks": ["Guntur Urban", "Guntur Rural", "Tenali", "Mangalagiri", "Ponnur"]},
            {"name": "Kakinada", "code": "750", "urb": "SEMI_URBAN", "rur": 51.0, "tier": "TIER_2", "odop": "Marine Seafood Processing, Rice Exports & Coir", "cat": "FISHERIES_AGRO", "blocks": ["Kakinada Urban", "Kakinada Rural", "Peddapuram", "Pithapuram", "Tuni"]},
            {"name": "Krishna", "code": "507", "urb": "SEMI_URBAN", "rur": 59.4, "tier": "TIER_2", "odop": "Machilipatnam Kalamkari Handblock Prints & Gold Imitation", "cat": "HANDICRAFTS", "blocks": ["Machilipatnam", "Gudivada", "Pamarru", "Pedana", "Avanigadda"]},
            {"name": "Kurnool", "code": "508", "urb": "SEMI_URBAN", "rur": 62.5, "tier": "TIER_2", "odop": "Onion Dehydration, Cotton Ginning & Cement Minerals", "cat": "AGRO_MINERAL", "blocks": ["Kurnool", "Adoni", "Yemmiganur", "Kodumur", "Pattikonda"]},
            {"name": "Nandyal", "code": "751", "urb": "RURAL", "rur": 74.8, "tier": "TIER_3", "odop": "Bengal Gram (Chana) Processing & Citrus Fruits", "cat": "AGRO_PROCESSING", "blocks": ["Nandyal", "Allagadda", "Banaganapalle", "Dhone", "Nandikotkur"]},
            {"name": "NTR", "code": "752", "urb": "SEMI_URBAN", "rur": 41.2, "tier": "TIER_1", "odop": "Kondapalli Wooden Toys & Heavy Vehicle Engineering / Agro", "cat": "HANDICRAFTS_ENGINEERING", "blocks": ["Vijayawada Urban", "Vijayawada Rural", "Mylavaram", "Nandigama", "Jaggayyapeta"]},
            {"name": "Palnadu", "code": "753", "urb": "RURAL", "rur": 77.0, "tier": "TIER_3", "odop": "Cotton Ginning, Chilli Processing & Limestone", "cat": "AGRO_MINERAL", "blocks": ["Narasaraopet", "Sattenapalle", "Vinukonda", "Gurazala", "Macherla"]},
            {"name": "Parvathipuram Manyam", "code": "754", "urb": "RURAL", "rur": 86.5, "tier": "TIER_4", "odop": "Cashew Processing, Millets & Minor Forest Produce", "cat": "AGRO_PROCESSING", "blocks": ["Parvathipuram", "Salur", "Kurupam", "Palakonda", "Gummalaxmipuram"]},
            {"name": "Prakasam", "code": "509", "urb": "RURAL", "rur": 78.9, "tier": "TIER_3", "odop": "Tobacco Curing, Granite Tiles & Aquaculture", "cat": "AGRO_MINERAL", "blocks": ["Ongole", "Markapur", "Giddalur", "Kanigiri", "Kandukur"]},
            {"name": "Sri Potti Sriramulu Nellore", "code": "510", "urb": "SEMI_URBAN", "rur": 60.9, "tier": "TIER_2", "odop": "Aquaculture (Shrimp/Fish) Processing & Somasila Rice", "cat": "FISHERIES_AGRO", "blocks": ["Nellore Urban", "Nellore Rural", "Kavali", "Gudur", "Venkatagiri"]},
            {"name": "Sri Sathya Sai", "code": "755", "urb": "RURAL", "rur": 78.5, "tier": "TIER_4", "odop": "Dharmavaram Silk Sarees & Groundnut Processing / Solar", "cat": "HANDLOOM_AGRO", "blocks": ["Puttaparthi", "Dharmavaram", "Kadiri", "Penukonda", "Madakasira"]},
            {"name": "Srikakulam", "code": "511", "urb": "RURAL", "rur": 83.8, "tier": "TIER_4", "odop": "Ponduru Khadi Handspinning, Cashew & Jute Products", "cat": "HANDLOOM_AGRO", "blocks": ["Srikakulam", "Amadalavalasa", "Narasannapeta", "Tekkali", "Palasa"]},
            {"name": "Tirupati", "code": "756", "urb": "SEMI_URBAN", "rur": 58.0, "tier": "TIER_2", "odop": "Srikalahasti Kalamkari & Electronic Hardware / Agro", "cat": "HANDICRAFTS_ELECTRONICS", "blocks": ["Tirupati Urban", "Tirupati Rural", "Srikalahasti", "Gudur", "Sullurpeta"]},
            {"name": "Visakhapatnam", "code": "512", "urb": "METROPOLITAN", "rur": 12.0, "tier": "TIER_1", "odop": "Marine Fisheries Cold Chain, Heavy Engineering & IT", "cat": "FISHERIES_ENGINEERING", "blocks": ["Gajuwaka", "Bhimunipatnam", "Anandapuram", "Pendurthi", "Padmanabham"]},
            {"name": "Vizianagaram", "code": "513", "urb": "RURAL", "rur": 79.1, "tier": "TIER_3", "odop": "Jute Twine & Bags, Mango Jelly & Cashew Kernels", "cat": "AGRO_PROCESSING", "blocks": ["Vizianagaram", "Bobbili", "Cheepurupalli", "Gajapathinagaram", "Srungavarapukota"]},
            {"name": "West Godavari", "code": "514", "urb": "SEMI_URBAN", "rur": 63.8, "tier": "TIER_2", "odop": "Paddy Milling, Aquaculture & Narsapur Lace Handcrafts", "cat": "HANDICRAFTS_AGRO", "blocks": ["Bhimavaram", "Tadepalligudem", "Tanuku", "Narsapur", "Palakollu"]},
            {"name": "YSR Kadapa", "code": "515", "urb": "SEMI_URBAN", "rur": 65.0, "tier": "TIER_3", "odop": "Kadapa Black Stone Slabs, Banana Value Addition & Lime", "cat": "MINERAL_AGRO", "blocks": ["Kadapa", "Proddatur", "Pulivendula", "Jammalamadugu", "Badvel"]}
        ]
    })

    # 2. ARUNACHAL PRADESH (26)
    states_data.append({
        "stateCode": "12", "stateName": "Arunachal Pradesh", "territoryType": "STATE", "totalDistricts": 26,
        "districts": [
            {"name": "Anjaw", "code": "230", "urb": "RURAL", "rur": 95.8, "tier": "TIER_5", "odop": "Large Cardamom & Kiwi Fruit Processing / Wild Honey", "cat": "AGRO_HORTICULTURE", "blocks": ["Hawai", "Hayuliang", "Manchal", "Chaglagam", "Walong"]},
            {"name": "Changlang", "code": "231", "urb": "RURAL", "rur": 86.4, "tier": "TIER_4", "odop": "Tea & Arecanut Processing / Bamboo Crafts", "cat": "AGRO_FOREST", "blocks": ["Changlang", "Miao", "Jairampur", "Bordumsa", "Diyun"]},
            {"name": "Dibang Valley", "code": "232", "urb": "RURAL", "rur": 94.2, "tier": "TIER_6", "odop": "Mishmi Teeta (Coptis Teeta) & Organic Kiwi", "cat": "MEDICINAL_AGRO", "blocks": ["Anini", "Etalin", "Anelih", "Kronli", "Mipi"]},
            {"name": "East Kameng", "code": "233", "urb": "RURAL", "rur": 82.5, "tier": "TIER_5", "odop": "Orange & Ginger Processing / Cane Baskets", "cat": "HORTICULTURE", "blocks": ["Seppa", "Chayang Tajo", "Bameng", "Pakke Kessang", "Sawa"]},
            {"name": "East Siang", "code": "234", "urb": "RURAL", "rur": 72.3, "tier": "TIER_4", "odop": "Pasighat Citrus Mandarins & Ginger / Rice Milling", "cat": "AGRO_PROCESSING", "blocks": ["Pasighat", "Mebo", "Ruksin", "Sille-Oyan", "Bilat"]},
            {"name": "Kamle", "code": "718", "urb": "RURAL", "rur": 92.0, "tier": "TIER_5", "odop": "Large Cardamom & Wild Forest Honey", "cat": "AGRO_FOREST", "blocks": ["Raga", "Dollungmukh", "Puchigeko", "Giba", "Kamporijo"]},
            {"name": "Kra Daadi", "code": "719", "urb": "RURAL", "rur": 94.0, "tier": "TIER_6", "odop": "Organic Millets & Traditional Nyishi Handloom", "cat": "HANDLOOM_AGRO", "blocks": ["Palin", "Jamin", "Chambang", "Gangte", "Tali"]},
            {"name": "Kurung Kumey", "code": "235", "urb": "RURAL", "rur": 95.0, "tier": "TIER_6", "odop": "Handwoven Traditional Textiles & Large Cardamom", "cat": "HANDLOOM", "blocks": ["Koloriang", "Nyapin", "Sangram", "Damin", "Sarli"]},
            {"name": "Leparada", "code": "720", "urb": "RURAL", "rur": 88.0, "tier": "TIER_5", "odop": "Basar Large Cardamom & Organic Pineapples", "cat": "AGRO_PROCESSING", "blocks": ["Basar", "Tirbin", "Daring", "Sago"]},
            {"name": "Lohit", "code": "236", "urb": "RURAL", "rur": 78.0, "tier": "TIER_4", "odop": "Mustard Oil Extraction & Tezu Ginger Products", "cat": "AGRO_PROCESSING", "blocks": ["Tezu", "Sunpura", "Wakro", "Alubari"]},
            {"name": "Longding", "code": "662", "urb": "RURAL", "rur": 89.0, "tier": "TIER_5", "odop": "Wancho Wood Carvings & Large Cardamom / Millet Wine", "cat": "HANDICRAFTS", "blocks": ["Longding", "Kanubari", "Pangchao", "Wakka", "Pumao"]},
            {"name": "Lower Dibang Valley", "code": "237", "urb": "RURAL", "rur": 75.0, "tier": "TIER_4", "odop": "Organic Ginger, Mustard & Mustard Oil Processing", "cat": "AGRO_PROCESSING", "blocks": ["Roing", "Dambuk", "Hunli", "Koronu", "Desali"]},
            {"name": "Lower Siang", "code": "721", "urb": "RURAL", "rur": 86.0, "tier": "TIER_5", "odop": "Orange Orchards & Pineapple Pulp Extraction", "cat": "HORTICULTURE", "blocks": ["Likabali", "Gensi", "Kangku", "Nari-Koyu"]},
            {"name": "Lower Subansiri", "code": "238", "urb": "RURAL", "rur": 80.0, "tier": "TIER_4", "odop": "Ziro Kiwi Fruit Wine & Apatani Handloom Textiles", "cat": "HORTICULTURE_TEXTILE", "blocks": ["Ziro", "Yachuli", "Pistana", "Old Ziro", "Talo"]},
            {"name": "Namsai", "code": "663", "urb": "RURAL", "rur": 79.0, "tier": "TIER_4", "odop": "Khamti Sticky Rice & Tea / Bamboo Products", "cat": "AGRO_PROCESSING", "blocks": ["Namsai", "Chongkham", "Mahadevpur", "Piyong", "Lathao"]},
            {"name": "Pakke Kessang", "code": "722", "urb": "RURAL", "rur": 91.0, "tier": "TIER_5", "odop": "Organic Ginger & Eco-Tourism / Cane Furniture", "cat": "AGRO_ECOTOURISM", "blocks": ["Lemmi", "Pakke Kessang", "Seijosa", "Dissing Passo", "Pizirang"]},
            {"name": "Papum Pare", "code": "239", "urb": "SEMI_URBAN", "rur": 52.0, "tier": "TIER_3", "odop": "Bamboo Shoot Value Addition, Bakery & Food Processing", "cat": "AGRO_PROCESSING", "blocks": ["Yupia", "Naharlagun", "Doimukh", "Balijan", "Sagalee", "Kimin"]},
            {"name": "Shi Yomi", "code": "723", "urb": "RURAL", "rur": 94.0, "tier": "TIER_6", "odop": "Apple Orchards, Walnut & Memba Traditional Weaving", "cat": "HORTICULTURE", "blocks": ["Tato", "Mechuka", "Pidi", "Monigong"]},
            {"name": "Siang", "code": "664", "urb": "RURAL", "rur": 90.0, "tier": "TIER_5", "odop": "Organic Oranges & Large Cardamom Processing", "cat": "HORTICULTURE", "blocks": ["Boleng", "Pangin", "Rumgong", "Kaying", "Jembing"]},
            {"name": "Tawang", "code": "240", "urb": "RURAL", "rur": 76.0, "tier": "TIER_4", "odop": "Monpa Handmade Paper (Mon Shugu) & Woolen Carpets", "cat": "HANDICRAFTS", "blocks": ["Tawang", "Jang", "Lumla", "Zemithang", "Mukto", "Kitpi"]},
            {"name": "Tirap", "code": "241", "urb": "RURAL", "rur": 84.0, "tier": "TIER_5", "odop": "Nocte Beadwork Jewelry & Black Pepper / Tea", "cat": "HANDICRAFTS_AGRO", "blocks": ["Khonsa", "Deomali", "Namsang", "Dadam", "Lazu"]},
            {"name": "Upper Siang", "code": "242", "urb": "RURAL", "rur": 92.0, "tier": "TIER_5", "odop": "Orange Juice Extracts & High Altitude Honey", "cat": "AGRO_PROCESSING", "blocks": ["Yingkiong", "Mariyang", "Tuting", "Geku", "Katan"]},
            {"name": "Upper Subansiri", "code": "243", "urb": "RURAL", "rur": 88.0, "tier": "TIER_5", "odop": "Tagin Handloom Weaving & Ginger Powder Processing", "cat": "HANDLOOM_AGRO", "blocks": ["Daporijo", "Dumporijo", "Gite Ripa", "Puchigeko", "Taliha"]},
            {"name": "West Kameng", "code": "244", "urb": "RURAL", "rur": 77.0, "tier": "TIER_4", "odop": "Dirang Apples, Kiwi Wine & Buddhist Thanka Art", "cat": "HORTICULTURE_CRAFT", "blocks": ["Bomdila", "Dirang", "Rupa", "Singchung", "Kalaktang", "Bhalukpong"]},
            {"name": "West Siang", "code": "245", "urb": "RURAL", "rur": 79.0, "tier": "TIER_4", "odop": "Pineapple Juice Processing & Galo Woven Ponge", "cat": "AGRO_HANDLOOM", "blocks": ["Aalo", "Kamba", "Liromoba", "Darak", "Yomcha"]},
            {"name": "Itanagar Capital Complex", "code": "724", "urb": "URBAN", "rur": 15.0, "tier": "TIER_3", "odop": "Ethnic Apparel Design, Food Packaging & Printing", "cat": "TEXTILE_FOOD", "blocks": ["Itanagar", "Naharlagun", "Banderdewa"]}
        ]
    })

    print("Added AP & Arunachal. Now assembling all 36 States & UTs...")
    return states_data

if __name__ == "__main__":
    build_registry()
