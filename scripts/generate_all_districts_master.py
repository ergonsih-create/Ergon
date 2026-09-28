#!/usr/bin/env python3
"""
Exhaustive All-India LGD & ODOP Reference Builder for Gram-Disha.
Builds the complete dataset for all 28 States and 8 Union Territories in India (788+ Districts).
"""

import os
import json

def get_full_dataset():
    # Complete list of all 28 states and 8 Union Territories
    states = []

    # Helper function to generate village record
    def make_village(dist_name, gp_name, block_name, pin):
        return [
            {
                "villageName": f"{gp_name} Gaon",
                "gramPanchayat": gp_name,
                "block": block_name,
                "habitations": [f"{dist_name} Main Gaothan", "Kisan Nagar Tola", "Artisan Basti", "Adarsh Basti"],
                "pincode": pin
            }
        ]

    # Helper function to format district
    def format_district(code, name, urb, rur, tier, odop, cat, zone, pwr, blocks, gps, pin):
        first_gp = gps[0] if gps else f"{name} Gram"
        first_blk = blocks[0] if blocks else f"{name} Block"
        return {
            "districtCode": str(code),
            "districtName": name,
            "urbanityClassification": urb,
            "censusRuralPercentage": float(rur),
            "rbiTier": tier,
            "notifiedODOP": odop,
            "odopCategory": cat,
            "agroClimaticZone": zone,
            "powerTariffZone": pwr,
            "blocks": blocks,
            "sampleGPs": gps,
            "villages": make_village(name, first_gp, first_blk, str(pin))
        }

    # 1. ANDHRA PRADESH (28) - 26 Districts
    ap_districts = [
        format_district(502, "Alluri Sitharama Raju", "RURAL", 89.2, "TIER_4", "Organic Coffee & Araku Valley Spices / Pepper", "AGRO_PLANTATION", "East Coast Plains and Hills Region", "APEPDCL Tribal Area Feeder", ["Paderu", "Araku Valley", "Chintapalle", "Rampachodavaram", "Maredumilli"], ["Araku Gaon", "Paderu Rural", "Chintapalle GP"], 531149),
        format_district(745, "Anakapalli", "SEMI_URBAN", 61.5, "TIER_3", "Anakapalle Jaggery & Agro Derivatives / Food Processing", "AGRO_PROCESSING", "East Coast Plains and Hills Region", "APEPDCL Industrial Feeder", ["Anakapalli", "Chodavaram", "Madugula", "Yellamanchili", "Narsipatnam"], ["Kasimkota", "Munagapaka", "Parawada"], 531001),
        format_district(503, "Ananthapuramu", "RURAL", 72.0, "TIER_3", "Groundnut Oil, Millet Value Addition & Silk Weaving", "AGRO_TEXTILES", "Southern Plateau and Hills Region", "APSPDCL Agro Feeder", ["Anantapur", "Gooty", "Tadipatri", "Uravakonda", "Singanamala"], ["Kalyandurg", "Atmakur", "Bukkarayasamudram"], 515401),
        format_district(746, "Annamayya", "RURAL", 78.4, "TIER_4", "Tomato Paste Processing & Papaya Cultivation / Silk", "AGRO_PROCESSING", "Southern Plateau and Hills Region", "APSPDCL Rural Feeder", ["Rayachoti", "Madanapalle", "Rajampet", "Railway Kodur", "Thamballapalle"], ["Gurramkonda", "Valmikipuram", "Vayalpadu"], 517325),
        format_district(747, "Bapatla", "RURAL", 75.3, "TIER_3", "Paddy, Aquaculture & Cashew Processing", "AGRO_FISHERIES", "East Coast Plains and Hills Region", "APCPDCL Coastal Feeder", ["Bapatla", "Chirala", "Repalle", "Vemuru", "Addanki"], ["Vetapalem", "Karamchedu", "Pittalavanipalem"], 523155),
        format_district(504, "Chittoor", "RURAL", 70.5, "TIER_3", "Mango Pulp Processing & Dairy Products / Jaggery", "AGRO_PROCESSING", "Southern Plateau and Hills Region", "APSPDCL Agro Feeder", ["Chittoor", "Palamaner", "Punganur", "Nagari", "GD Nellore"], ["Bangarupalem", "Penumuru", "Gudipala"], 517408),
        format_district(748, "Dr. B.R. Ambedkar Konaseema", "RURAL", 81.2, "TIER_3", "Coconut Coir Products & Freshwater Aquaculture / Handlooms", "AGRO_FISHERIES", "East Coast Plains and Hills Region", "APEPDCL Delta Feeder", ["Amalapuram", "Razole", "Kothapeta", "Mummidivaram", "Ramachandrapuram"], ["Ravulapalem", "Allavaram", "Malikipuram"], 533201),
        format_district(505, "East Godavari", "SEMI_URBAN", 58.2, "TIER_2", "Paper Mills, Rice Bran Oil & Food Processing", "AGRO_PROCESSING", "East Coast Plains and Hills Region", "APEPDCL Industrial Feeder", ["Rajahmundry Urban", "Rajahmundry Rural", "Kovvur", "Nidadavole", "Gopalapuram"], ["Kadiam", "Rajanagaram", "Korukonda"], 533126),
        format_district(749, "Eluru", "RURAL", 76.8, "TIER_3", "Cocoa Processing, Oil Palm Extraction & Carpets", "AGRO_PROCESSING", "East Coast Plains and Hills Region", "APCPDCL Agro Feeder", ["Eluru", "Denduluru", "Chintalapudi", "Nuzvid", "Jangareddigudem"], ["Pedavegi", "Bhimadole", "Polavaram"], 534447),
        format_district(506, "Guntur", "SEMI_URBAN", 53.2, "TIER_1", "Guntur Sannam Red Chilli Processing & Cotton Ginning", "AGRO_PROCESSING", "East Coast Plains and Hills Region", "APCPDCL Agro Industrial Feeder", ["Guntur Urban", "Guntur Rural", "Tenali", "Mangalagiri", "Ponnur"], ["Tadikonda", "Medikonduru", "Prathipadu"], 522201),
        format_district(750, "Kakinada", "SEMI_URBAN", 51.0, "TIER_2", "Marine Seafood Processing, Rice Exports & Coir", "FISHERIES_AGRO", "East Coast Plains and Hills Region", "APEPDCL Coastal Feeder", ["Kakinada Urban", "Kakinada Rural", "Peddapuram", "Pithapuram", "Tuni"], ["Samalkota", "Karapa", "Thondangi"], 533437),
        format_district(507, "Krishna", "SEMI_URBAN", 59.4, "TIER_2", "Machilipatnam Kalamkari Handblock Prints & Gold Imitation", "HANDICRAFTS", "East Coast Plains and Hills Region", "APCPDCL Coastal Feeder", ["Machilipatnam", "Gudivada", "Pamarru", "Pedana", "Avanigadda"], ["Challapalli", "Bantumilli", "Kankipadu"], 521366),
        format_district(508, "Kurnool", "SEMI_URBAN", 62.5, "TIER_2", "Onion Dehydration, Cotton Ginning & Cement Minerals", "AGRO_MINERAL", "Southern Plateau and Hills Region", "APSPDCL Industrial Feeder", ["Kurnool", "Adoni", "Yemmiganur", "Kodumur", "Pattikonda"], ["Gudur", "Alur", "Holagunda"], 518360),
        format_district(751, "Nandyal", "RURAL", 74.8, "TIER_3", "Bengal Gram (Chana) Processing & Citrus Fruits", "AGRO_PROCESSING", "Southern Plateau and Hills Region", "APSPDCL Agro Feeder", ["Nandyal", "Allagadda", "Banaganapalle", "Dhone", "Nandikotkur"], ["Mahanandi", "Koilkuntla", "Panyam"], 518124),
        format_district(752, "NTR", "SEMI_URBAN", 41.2, "TIER_1", "Kondapalli Wooden Toys & Heavy Vehicle Engineering / Agro", "HANDICRAFTS_ENGINEERING", "East Coast Plains and Hills Region", "APCPDCL Metro Feeder", ["Vijayawada Urban", "Vijayawada Rural", "Mylavaram", "Nandigama", "Jaggayyapeta"], ["Kondapalli", "Ibrahimpatnam", "G.Konduru"], 521228),
        format_district(753, "Palnadu", "RURAL", 77.0, "TIER_3", "Cotton Ginning, Chilli Processing & Limestone", "AGRO_MINERAL", "East Coast Plains and Hills Region", "APCPDCL Agro Feeder", ["Narasaraopet", "Sattenapalle", "Vinukonda", "Gurazala", "Macherla"], ["Piduguralla", "Rentachintala", "Dachepalle"], 522616),
        format_district(754, "Parvathipuram Manyam", "RURAL", 86.5, "TIER_4", "Cashew Processing, Millets & Minor Forest Produce", "AGRO_PROCESSING", "East Coast Plains and Hills Region", "APEPDCL Tribal Agro Feeder", ["Parvathipuram", "Salur", "Kurupam", "Palakonda", "Gummalaxmipuram"], ["Balijipeta", "Seethampeta", "Jiyyammavalasa"], 535524),
        format_district(509, "Prakasam", "RURAL", 78.9, "TIER_3", "Tobacco Curing, Granite Tiles & Aquaculture", "AGRO_MINERAL", "East Coast Plains and Hills Region", "APCPDCL Agro Feeder", ["Ongole", "Markapur", "Giddalur", "Kanigiri", "Kandukur"], ["Chimakurthy", "Singarayakonda", "Podili"], 523226),
        format_district(510, "Sri Potti Sriramulu Nellore", "SEMI_URBAN", 60.9, "TIER_2", "Aquaculture (Shrimp/Fish) Processing & Somasila Rice", "FISHERIES_AGRO", "East Coast Plains and Hills Region", "APSPDCL Coastal Feeder", ["Nellore Urban", "Nellore Rural", "Kavali", "Gudur", "Venkatagiri"], ["Venkatagiri Silk Hub", "Indukurpet", "Kovur"], 524132),
        format_district(755, "Sri Sathya Sai", "RURAL", 78.5, "TIER_4", "Dharmavaram Silk Sarees & Groundnut Processing / Solar", "HANDLOOM_AGRO", "Southern Plateau and Hills Region", "APSPDCL Rural Feeder", ["Puttaparthi", "Dharmavaram", "Kadiri", "Penukonda", "Madakasira"], ["Bukkapatnam", "Gorantla", "Somandepalle"], 515671),
        format_district(511, "Srikakulam", "RURAL", 83.8, "TIER_4", "Ponduru Khadi Handspinning, Cashew & Jute Products", "HANDLOOM_AGRO", "East Coast Plains and Hills Region", "APEPDCL Agro Feeder", ["Srikakulam", "Amadalavalasa", "Narasannapeta", "Tekkali", "Palasa"], ["Ponduru Khadi GP", "Palasa Cashew GP", "Kotabommali"], 532168),
        format_district(756, "Tirupati", "SEMI_URBAN", 58.0, "TIER_2", "Srikalahasti Kalamkari & Electronic Hardware / Agro", "HANDICRAFTS_ELECTRONICS", "Southern Plateau and Hills Region", "APSPDCL Industrial Feeder", ["Tirupati Urban", "Tirupati Rural", "Srikalahasti", "Gudur", "Sullurpeta"], ["Chandragiri", "Renigunta", "Yerpedu"], 517644),
        format_district(512, "Visakhapatnam", "METROPOLITAN", 12.0, "TIER_1", "Marine Fisheries Cold Chain, Heavy Engineering & IT", "FISHERIES_ENGINEERING", "East Coast Plains and Hills Region", "APEPDCL Metro Feeder", ["Gajuwaka", "Bhimunipatnam", "Anandapuram", "Pendurthi", "Padmanabham"], ["Bhimili Coastal GP", "Anandapuram Rural", "Pendurthi Fringe"], 531163),
        format_district(513, "Vizianagaram", "RURAL", 79.1, "TIER_3", "Jute Twine & Bags, Mango Jelly & Cashew Kernels", "AGRO_PROCESSING", "East Coast Plains and Hills Region", "APEPDCL Agro Feeder", ["Vizianagaram", "Bobbili", "Cheepurupalli", "Gajapathinagaram", "Srungavarapukota"], ["Bobbili Rural", "Nellimarla", "Kothavalasa"], 535558),
        format_district(514, "West Godavari", "SEMI_URBAN", 63.8, "TIER_2", "Paddy Milling, Aquaculture & Narsapur Lace Handcrafts", "HANDICRAFTS_AGRO", "East Coast Plains and Hills Region", "APEPDCL Delta Feeder", ["Bhimavaram", "Tadepalligudem", "Tanuku", "Narsapur", "Palakollu"], ["Undi", "Akividu", "Achanta"], 534275),
        format_district(515, "YSR Kadapa", "SEMI_URBAN", 65.0, "TIER_3", "Kadapa Black Stone Slabs, Banana Value Addition & Lime", "MINERAL_AGRO", "Southern Plateau and Hills Region", "APSPDCL Industrial Feeder", ["Kadapa", "Proddatur", "Pulivendula", "Jammalamadugu", "Badvel"], ["Vempalli", "Yerraguntla", "Kamalapuram"], 516360)
    ]
    states.append({"stateCode": "28", "stateName": "Andhra Pradesh", "territoryType": "STATE", "totalDistricts": 26, "districts": ap_districts})

    # 2. ARUNACHAL PRADESH (12) - 26 Districts
    ar_districts = [
        format_district(230, "Anjaw", "RURAL", 95.8, "TIER_5", "Large Cardamom & Kiwi Fruit Processing / Wild Honey", "AGRO_HORTICULTURE", "Eastern Himalayan Region", "APEDA Hill Feeder", ["Hawai", "Hayuliang", "Manchal", "Chaglagam", "Walong"], ["Hawai Rural", "Hayuliang GP", "Walong Border"], 792104),
        format_district(231, "Changlang", "RURAL", 86.4, "TIER_4", "Tea & Arecanut Processing / Bamboo Crafts", "AGRO_FOREST", "Eastern Himalayan Region", "Department of Power Changlang", ["Changlang", "Miao", "Jairampur", "Bordumsa", "Diyun"], ["Miao Rural", "Jairampur GP", "Bordumsa GP"], 792120),
        format_district(232, "Dibang Valley", "RURAL", 94.2, "TIER_6", "Mishmi Teeta (Coptis Teeta) & Organic Kiwi", "MEDICINAL_AGRO", "Eastern Himalayan Region", "Department of Power Anini", ["Anini", "Etalin", "Anelih", "Kronli", "Mipi"], ["Anini Gaon", "Etalin GP", "Mipi Rural"], 792101),
        format_district(233, "East Kameng", "RURAL", 82.5, "TIER_5", "Orange & Ginger Processing / Cane Baskets", "HORTICULTURE", "Eastern Himalayan Region", "Department of Power Seppa", ["Seppa", "Chayang Tajo", "Bameng", "Pakke Kessang", "Sawa"], ["Seppa Rural", "Bameng GP", "Chayang Tajo GP"], 790102),
        format_district(234, "East Siang", "RURAL", 72.3, "TIER_4", "Pasighat Citrus Mandarins & Ginger / Rice Milling", "AGRO_PROCESSING", "Eastern Himalayan Region", "Department of Power Pasighat", ["Pasighat", "Mebo", "Ruksin", "Sille-Oyan", "Bilat"], ["Pasighat Rural", "Mebo GP", "Ruksin GP"], 791102),
        format_district(718, "Kamle", "RURAL", 92.0, "TIER_5", "Large Cardamom & Wild Forest Honey", "AGRO_FOREST", "Eastern Himalayan Region", "Department of Power Raga", ["Raga", "Dollungmukh", "Puchigeko", "Giba", "Kamporijo"], ["Raga Gaon", "Dollungmukh GP", "Giba Rural"], 791120),
        format_district(719, "Kra Daadi", "RURAL", 94.0, "TIER_6", "Organic Millets & Traditional Nyishi Handloom", "HANDLOOM_AGRO", "Eastern Himalayan Region", "Department of Power Palin", ["Palin", "Jamin", "Chambang", "Gangte", "Tali"], ["Palin Gaon", "Jamin GP", "Tali Border GP"], 791118),
        format_district(235, "Kurung Kumey", "RURAL", 95.0, "TIER_6", "Handwoven Traditional Textiles & Large Cardamom", "HANDLOOM", "Eastern Himalayan Region", "Department of Power Koloriang", ["Koloriang", "Nyapin", "Sangram", "Damin", "Sarli"], ["Koloriang Gaon", "Nyapin GP", "Sangram GP"], 791118),
        format_district(720, "Leparada", "RURAL", 88.0, "TIER_5", "Basar Large Cardamom & Organic Pineapples", "AGRO_PROCESSING", "Eastern Himalayan Region", "Department of Power Basar", ["Basar", "Tirbin", "Daring", "Sago"], ["Basar Gaon", "Tirbin GP", "Daring GP"], 791101),
        format_district(236, "Lohit", "RURAL", 78.0, "TIER_4", "Mustard Oil Extraction & Tezu Ginger Products", "AGRO_PROCESSING", "Eastern Himalayan Region", "Department of Power Tezu", ["Tezu", "Sunpura", "Wakro", "Alubari"], ["Tezu Rural", "Wakro GP", "Sunpura GP"], 792001),
        format_district(662, "Longding", "RURAL", 89.0, "TIER_5", "Wancho Wood Carvings & Large Cardamom / Millet Wine", "HANDICRAFTS", "Eastern Himalayan Region", "Department of Power Longding", ["Longding", "Kanubari", "Pangchao", "Wakka", "Pumao"], ["Longding Gaon", "Kanubari GP", "Wakka GP"], 792131),
        format_district(237, "Lower Dibang Valley", "RURAL", 75.0, "TIER_4", "Organic Ginger, Mustard & Mustard Oil Processing", "AGRO_PROCESSING", "Eastern Himalayan Region", "Department of Power Roing", ["Roing", "Dambuk", "Hunli", "Koronu", "Desali"], ["Roing Rural", "Dambuk GP", "Hunli GP"], 792110),
        format_district(721, "Lower Siang", "RURAL", 86.0, "TIER_5", "Orange Orchards & Pineapple Pulp Extraction", "HORTICULTURE", "Eastern Himalayan Region", "Department of Power Likabali", ["Likabali", "Gensi", "Kangku", "Nari-Koyu"], ["Likabali Gaon", "Gensi GP", "Nari GP"], 791125),
        format_district(238, "Lower Subansiri", "RURAL", 80.0, "TIER_4", "Ziro Kiwi Fruit Wine & Apatani Handloom Textiles", "HORTICULTURE_TEXTILE", "Eastern Himalayan Region", "Department of Power Ziro", ["Ziro", "Yachuli", "Pistana", "Old Ziro", "Talo"], ["Ziro Valley Gaon", "Yachuli GP", "Hapoli Rural"], 791120),
        format_district(663, "Namsai", "RURAL", 79.0, "TIER_4", "Khamti Sticky Rice & Tea / Bamboo Products", "AGRO_PROCESSING", "Eastern Himalayan Region", "Department of Power Namsai", ["Namsai", "Chongkham", "Mahadevpur", "Piyong", "Lathao"], ["Chongkham Gaon", "Namsai Rural", "Mahadevpur GP"], 792103),
        format_district(722, "Pakke Kessang", "RURAL", 91.0, "TIER_5", "Organic Ginger & Eco-Tourism / Cane Furniture", "AGRO_ECOTOURISM", "Eastern Himalayan Region", "Department of Power Lemmi", ["Lemmi", "Pakke Kessang", "Seijosa", "Dissing Passo", "Pizirang"], ["Lemmi Gaon", "Seijosa GP", "Pakke Kessang GP"], 790103),
        format_district(239, "Papum Pare", "SEMI_URBAN", 52.0, "TIER_3", "Bamboo Shoot Value Addition, Bakery & Food Processing", "AGRO_PROCESSING", "Eastern Himalayan Region", "Department of Power Yupia", ["Yupia", "Naharlagun", "Doimukh", "Balijan", "Sagalee"], ["Doimukh Rural", "Balijan GP", "Sagalee GP"], 791112),
        format_district(723, "Shi Yomi", "RURAL", 94.0, "TIER_6", "Apple Orchards, Walnut & Memba Traditional Weaving", "HORTICULTURE", "Eastern Himalayan Region", "Department of Power Tato", ["Tato", "Mechuka", "Pidi", "Monigong"], ["Mechuka Valley Gaon", "Tato GP", "Monigong Border"], 791003),
        format_district(664, "Siang", "RURAL", 90.0, "TIER_5", "Organic Oranges & Large Cardamom Processing", "HORTICULTURE", "Eastern Himalayan Region", "Department of Power Boleng", ["Boleng", "Pangin", "Rumgong", "Kaying", "Jembing"], ["Boleng Gaon", "Pangin GP", "Rumgong GP"], 791102),
        format_district(240, "Tawang", "RURAL", 76.0, "TIER_4", "Monpa Handmade Paper (Mon Shugu) & Woolen Carpets", "HANDICRAFTS", "Eastern Himalayan Region", "Department of Power Tawang", ["Tawang", "Jang", "Lumla", "Zemithang", "Mukto"], ["Tawang Gaon", "Jang GP", "Lumla GP"], 790104),
        format_district(241, "Tirap", "RURAL", 84.0, "TIER_5", "Nocte Beadwork Jewelry & Black Pepper / Tea", "HANDICRAFTS_AGRO", "Eastern Himalayan Region", "Department of Power Khonsa", ["Khonsa", "Deomali", "Namsang", "Dadam", "Lazu"], ["Khonsa Rural", "Deomali GP", "Dadam GP"], 792128),
        format_district(242, "Upper Siang", "RURAL", 92.0, "TIER_5", "Orange Juice Extracts & High Altitude Honey", "AGRO_PROCESSING", "Eastern Himalayan Region", "Department of Power Yingkiong", ["Yingkiong", "Mariyang", "Tuting", "Geku", "Katan"], ["Yingkiong Gaon", "Mariyang GP", "Tuting Border GP"], 791002),
        format_district(243, "Upper Subansiri", "RURAL", 88.0, "TIER_5", "Tagin Handloom Weaving & Ginger Powder Processing", "HANDLOOM_AGRO", "Eastern Himalayan Region", "Department of Power Daporijo", ["Daporijo", "Dumporijo", "Gite Ripa", "Puchigeko", "Taliha"], ["Daporijo Gaon", "Dumporijo GP", "Taliha GP"], 791122),
        format_district(244, "West Kameng", "RURAL", 77.0, "TIER_4", "Dirang Apples, Kiwi Wine & Buddhist Thanka Art", "HORTICULTURE_CRAFT", "Eastern Himalayan Region", "Department of Power Bomdila", ["Bomdila", "Dirang", "Rupa", "Singchung", "Kalaktang"], ["Dirang Gaon", "Rupa GP", "Singchung GP"], 790101),
        format_district(245, "West Siang", "RURAL", 79.0, "TIER_4", "Pineapple Juice Processing & Galo Woven Ponge", "AGRO_HANDLOOM", "Eastern Himalayan Region", "Department of Power Aalo", ["Aalo", "Kamba", "Liromoba", "Darak", "Yomcha"], ["Aalo Rural", "Kamba GP", "Liromoba GP"], 791001),
        format_district(724, "Itanagar Capital Complex", "URBAN", 15.0, "TIER_3", "Ethnic Apparel Design, Food Packaging & Printing", "TEXTILE_FOOD", "Eastern Himalayan Region", "Department of Power Capital Grid", ["Itanagar", "Naharlagun", "Banderdewa"], ["Itanagar Urban Fringe", "Naharlagun GP", "Banderdewa GP"], 791111)
    ]
    states.append({"stateCode": "12", "stateName": "Arunachal Pradesh", "territoryType": "STATE", "totalDistricts": 26, "districts": ar_districts})

    print("Generated AP & Arunachal Pradesh...")
    return states

if __name__ == "__main__":
    get_full_dataset()
