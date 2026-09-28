"""
Part 3: Northern Region & Northern UTs
- Uttar Pradesh (75)
- Rajasthan (50)
- Punjab (23)
- Haryana (22)
- Himachal Pradesh (12)
- Uttarakhand (13)
- Jammu and Kashmir (20)
- Ladakh (2)
- Delhi (11)
- Chandigarh (1)
Total: 229 districts
"""

def get_north_data(format_district):
    states = []

    # 1. UTTAR PRADESH (75)
    up_names = [
        ("121", "Agra", "SEMI_URBAN", 54.2, "TIER_1", "Leather Footwear, Petha Sweet Confectionery & Marble Inlay", "LEATHER_FOOD_HANDICRAFT", ["Agra", "Achhnera", "Fatehabad", "Fatehpur Sikri", "Kheragarh", "Pinahat", "Barauli Ahir"], 282001),
        ("122", "Aligarh", "SEMI_URBAN", 66.9, "TIER_2", "Aligarh Brass Hardware, Security Locks & Metal Sculptures", "HARDWARE_METAL", ["Aligarh", "Atrauli", "Iglas", "Khair", "Gabhana", "Dhanipur", "Jawa"], 202001),
        ("123", "Ambedkar Nagar", "RURAL", 87.8, "TIER_3", "Tanda Handloom Powerloom Cotton Jacquard & Readymade Cloth", "TEXTILES", ["Akbarpur", "Tanda", "Jalalpur", "Alapur", "Katehari", "Bhiti"], 224122),
        ("124", "Amethi", "RURAL", 90.5, "TIER_4", "Moonj Grass Decorative Handicrafts & Aromatic Essential Oils", "HANDICRAFTS_AGRO", ["Gauriganj", "Amethi", "Musafirkhana", "Tiloi", "Bhadar", "Jagdishpur"], 227409),
        ("125", "Amroha", "RURAL", 75.0, "TIER_3", "Amroha Wooden Dholak / Musical Percussion Instruments", "MUSICAL_INSTRUMENTS", ["Amroha", "Dhanaura", "Hasanpur", "Gajraula", "Joya"], 244221),
        ("126", "Auraiya", "RURAL", 83.0, "TIER_4", "Desi Cow Ghee (Dairy Clarified Butter) & Plastic Auxiliaries", "DAIRY_PLASTICS", ["Auraiya", "Bidhuna", "Ajitmal", "Achhalda", "Bhagyanagar", "Sahar"], 206122),
        ("127", "Ayodhya", "SEMI_URBAN", 86.0, "TIER_2", "Jaggery (Gud) Production & Religious Wooden/Brass Handicrafts", "AGRO_HANDICRAFTS", ["Ayodhya", "Faizabad", "Bikapur", "Rudauli", "Milkipur", "Sohawal", "Pura Bazar"], 224001),
        ("128", "Azamgarh", "RURAL", 91.5, "TIER_3", "Nizamabad Black Clay Pottery & Mubarakpur Silk Sarees", "POTTERY_HANDLOOM", ["Azamgarh", "Mubarakpur", "Nizamabad", "Sagri", "Phoolpur", "Lalganj", "Mehnagar", "Bilariyaganj"], 276001),
        ("129", "Baghpat", "RURAL", 78.9, "TIER_3", "Khekra Home Furnishings, Cotton Handloom & Sugarcane Jaggery", "HANDLOOM_AGRO", ["Baghpat", "Baraut", "Khekra", "Pilana", "Chhaprauli", "Binauli"], 250609),
        ("130", "Bahraich", "RURAL", 91.8, "TIER_4", "Wheat Stalk Handcrafts & Mentha Essential Oil Distillation", "HANDICRAFTS_AGRO", ["Bahraich", "Nanpara", "Mahasi", "Kaiserganj", "Payagpur", "Jarwal", "Mihinpurwa"], 271801),
        ("131", "Ballia", "RURAL", 90.7, "TIER_3", "Bindi Manufacturing & Surha Tal Organic Rice Milling", "HANDICRAFTS_AGRO", ["Ballia", "Bansdih", "Bairia", "Rasra", "Sikanderpur", "Belthara Road", "Garwar"], 277001),
        ("132", "Balrampur", "RURAL", 92.3, "TIER_5", "Kala Namak Rice (Buddha Rice G.I.) & Pulses Processing", "AGRO_PROCESSING", ["Balrampur", "Tulsipur", "Utraula", "Gaindas Bujurg", "Pachperwa", "Gasari"], 271201),
        ("133", "Banda", "RURAL", 84.7, "TIER_4", "Shajar Semi-Precious Stone Craft & Bundelkhand Pulses", "MINERAL_AGRO", ["Banda", "Atarra", "Baberu", "Naraini", "Tindwari", "Mahuva", "Bisanda"], 210001),
        ("134", "Barabanki", "RURAL", 89.9, "TIER_3", "Handloom Scarves, Stoles & Mentha Arvensis Oil Crystallization", "HANDLOOM_AGRO", ["Barabanki (Nawabganj)", "Fatehpur", "Ramnagar", "Haidergarh", "Rudauli", "Sirauli Ghauspur", "Dariyabad"], 225001),
        ("135", "Bareilly", "SEMI_URBAN", 65.1, "TIER_2", "Zari-Zardozi Embroidery, Bamboo-Cane Furniture & Surma", "HANDICRAFTS", ["Bareilly", "Aonla", "Faridpur", "Nawabganj", "Baheri", "Meerganj", "Bithri Chainpur", "Kyara"], 243001),
        ("136", "Basti", "RURAL", 94.4, "TIER_4", "Wood Carving Handicrafts, Vinegar Processing & Kala Namak Rice", "WOOD_AGRO", ["Basti", "Harraiya", "Bhanpur", "Rudhauli", "Kaptanganj", "Saltaua Gopalpur", "Gaur"], 272001),
        ("137", "Bhadohi", "RURAL", 85.2, "TIER_3", "Bhadohi Hand-Knotted Woolen Carpets & Durries (G.I.)", "TEXTILES_CARPETS", ["Gyanpur", "Bhadohi", "Aurai", "Suriyawan", "Deegh"], 221401),
        ("138", "Bijnor", "RURAL", 74.9, "TIER_3", "Nagina Wooden Carvings & Sugarcane Jaggery / Khandsari", "WOOD_AGRO", ["Bijnor", "Chandpur", "Dhampur", "Nagina", "Najibabad", "Kiratpur", "Noorpur", "Haldaur"], 246701),
        ("139", "Budaun", "RURAL", 80.2, "TIER_4", "Zari-Zardozi Craft & Mentha Peppermint Oil Distillation", "HANDICRAFTS_AGRO", ["Budaun", "Bilsi", "Bisauli", "Dataganj", "Sahaswan", "Ujhani", "Wazirganj", "Islamnagar"], 243601),
        ("140", "Bulandshahr", "RURAL", 75.2, "TIER_2", "Khurja Ceramic Pottery / Sanitaryware & Ceramic Insulators", "CERAMICS", ["Bulandshahr", "Khurja", "Anupshahr", "Debai", "Shikarpur", "Siana", "Sikandrabad", "Gulaothi"], 203001),
        ("141", "Chandauli", "RURAL", 87.6, "TIER_4", "Black Rice (Chak-Hao) Processing & Zari Zardozi Work", "AGRO_HANDICRAFTS", ["Chandauli", "Chakia", "Sakaldiha", "Mughalsarai (Pt. Deen Dayal Upadhyaya Nagar)", "Naugarh"], 232104),
        ("142", "Chitrakoot", "RURAL", 90.3, "TIER_5", "Chitrakoot Wooden Lacquer Toys & Amla Fruit Processing", "TOYS_AGRO", ["Karwi", "Mau", "Manikpur", "Rajapur", "Pahari", "Ramnagar"], 210205),
        ("143", "Deoria", "RURAL", 89.8, "TIER_3", "Decorative Brass Bells & Chili / Sugarcane Processing", "HANDICRAFTS_AGRO", ["Deoria", "Salempur", "Bhatpar Rani", "Rudrapur", "Barhaj", "Bhaluani", "Lar", "Gauri Bazar"], 274001),
        ("144", "Etah", "RURAL", 84.8, "TIER_4", "Jalesar Brass Ghungroo & Metal Bells (G.I.) / Chicory", "BRASSWARE_AGRO", ["Etah", "Jalesar", "Aliganj", "Nidhauli Kalan", "Sakit", "Jaithara", "Awagarh"], 207001),
        ("145", "Etawah", "RURAL", 76.8, "TIER_3", "Jaswantnagar Textile Tailoring & Desi Cow Ghee Processing", "TEXTILES_DAIRY", ["Etawah", "Jaswantnagar", "Bharthana", "Saifai", "Chakarnagar", "Takha", "Basrehar"], 206001),
        ("146", "Farrukhabad", "RURAL", 77.8, "TIER_3", "Zari-Zardozi Embroidery & Wooden Handblock Textile Printing", "TEXTILES_HANDICRAFT", ["Fatehgarh (Farrukhabad)", "Kaimganj", "Amritpur", "Kamalganj", "Mohammadabad", "Nawabganj"], 209601),
        ("147", "Fatehpur", "RURAL", 87.7, "TIER_4", "Bedsheets / Curtains Hand Printing & Lentil Dal Processing", "HANDLOOM_AGRO", ["Fatehpur", "Bindki", "Khaga", "Haswa", "Bahua", "Airayan", "Malwan", "Teliyani"], 212601),
        ("148", "Firozabad", "SEMI_URBAN", 66.6, "TIER_2", "Glass Bangles, Decorative Crystal Glassware & Chandeliers", "GLASSWARE", ["Firozabad", "Shikohabad", "Sirasaganj", "Tundla", "Jasrana", "Narkhi", "Eka"], 283203),
        ("149", "Gautam Buddha Nagar", "METROPOLITAN", 40.9, "TIER_1", "Readymade Apparels, Consumer Electronics & IT / Data Centers", "ELECTRONICS_APPAREL", ["Noida", "Greater Noida (Dadri)", "Jewar", "Dankaur", "Bisrakh"], 201301),
        ("150", "Ghaziabad", "METROPOLITAN", 32.6, "TIER_1", "Engineering Machine Tools, Electric Motors & Industrial Plastics", "ENGINEERING", ["Ghaziabad", "Modinagar", "Loni", "Muradnagar", "Bhojpur", "Razapur"], 201001),
        ("151", "Ghazipur", "RURAL", 92.5, "TIER_3", "Jute Wall Hangings & Jute Diversified Bags / Rosewater", "JUTE_AGRO", ["Ghazipur", "Mohammadabad", "Zamania", "Saidpur", "Jakhania", "Kasimabad", "Sevrai"], 233001),
        ("152", "Gonda", "RURAL", 93.5, "TIER_4", "Dal Milling (Arhar / Gram) & Sugarcane Jaggery", "AGRO_PROCESSING", ["Gonda", "Colonelganj", "Tarabganj", "Mankapur", "Katra Bazar", "Haldharpur", "Paraspur"], 271001),
        ("153", "Gorakhpur", "SEMI_URBAN", 81.2, "TIER_1", "Gorakhpur Terracotta Craft (G.I.) & Readymade Garments", "HANDICRAFTS_TEXTILES", ["Gorakhpur", "Sahjanwa", "Campierganj", "Chauri Chaura", "Bansgaon", "Khajni", "Pipraich", "Gola"], 273001),
        ("154", "Hamirpur", "RURAL", 81.0, "TIER_4", "Handmade Leather Mojari Shoes & Desi Gram (Chana) Milling", "LEATHER_AGRO", ["Hamirpur", "Rath", "Maudaha", "Sarila", "Kurara", "Muskara", "Gohand"], 210301),
        ("155", "Hapur", "SEMI_URBAN", 60.1, "TIER_2", "Handloom Home Textiles, Bedsheets & Mustard Oil Processing", "HANDLOOM_AGRO", ["Hapur", "Garhmukteshwar", "Dhaulana", "Simbhaoli"], 245101),
        ("156", "Hardoi", "RURAL", 87.0, "TIER_3", "Handloom Durries, Sandila Laddu Confectionery & Agro Seeds", "HANDLOOM_FOOD", ["Hardoi", "Sandila", "Bilgram", "Shahabad", "Sawayajpur", "Mallawan", "Kachhauna"], 241001),
        ("157", "Hathras", "RURAL", 78.4, "TIER_3", "Hathras Asafoetida (Hing) Compounding & Brass Hardware", "FOOD_SPICES", ["Hathras", "Sadabad", "Sasni", "Sikandra Rao", "Mursan", "Sahpau"], 204101),
        ("158", "Jalaun", "RURAL", 75.3, "TIER_4", "Kalpi Handmade Paper & Cardboard Packaging Products", "HANDMADE_PAPER", ["Orai", "Kalpi", "Jalaun", "Konch", "Madhogarh", "Nadigaon", "Dakore"], 285001),
        ("159", "Jaunpur", "RURAL", 92.3, "TIER_3", "Woolen Carpet Durries & Attar (Perfume / Rosewater) Distillation", "CARPETS_PERFUME", ["Jaunpur", "Shahganj", "Machhlishahr", "Badlapur", "Mariahu", "Kerakat", "Sujanganj"], 222001),
        ("160", "Jhansi", "SEMI_URBAN", 58.3, "TIER_2", "Soft Toys Manufacturing & High-Tensile Heavy Engineering Fasteners", "TOYS_ENGINEERING", ["Jhansi", "Mauranipur", "Moth", "Garautha", "Babina", "Gursarai", "Chirgaon"], 284001),
        ("161", "Kannauj", "RURAL", 83.1, "TIER_3", "Kannauj Natural Rose Attar / Perfumes & Essential Oils", "PERFUMERY", ["Kannauj", "Chhibramau", "Tirwa", "Gursahaiganj", "Talgram", "Haseran"], 209725),
        ("162", "Kanpur Dehat", "RURAL", 90.2, "TIER_3", "Aluminium Utensils & Plastic Injection Molded Products", "METAL_PLASTICS", ["Akbarpur", "Bhognipur", "Derapur", "Rasulabad", "Sikandra", "Maitha", "Sarbankhera"], 209101),
        ("163", "Kanpur Nagar", "METROPOLITAN", 34.2, "TIER_1", "Finished Leather Saddlery / Footwear, Detergents & Defence Textiles", "LEATHER_CHEMICALS", ["Kanpur Urban", "Bilhaur", "Ghatampur", "Sarsaul", "Kalyanpur", "Chaubepur", "Bidhnu"], 208001),
        ("164", "Kasganj", "RURAL", 79.9, "TIER_4", "Zari-Zardozi Artisanal Embroidery & Groundnut Processing", "HANDICRAFTS_AGRO", ["Kasganj", "Ganjdundwara", "Patiyali", "Sahawar", "Soron", "Sidhpura"], 207123),
        ("165", "Kaushambi", "RURAL", 92.2, "TIER_4", "Allahabad Surkha Guava Cultivation & Banana Chips", "AGRO_PROCESSING", ["Manjhanpur", "Sirathu", "Chail", "Chail", "Mooratganj", "Kada", "Sarsawan"], 212207),
        ("166", "Kheri", "RURAL", 88.5, "TIER_3", "Tribal Tharu Embroidery & Sugarcane Jaggery / Banana Fibre", "HANDICRAFTS_AGRO", ["Lakhimpur", "Gola Gokaran Nath", "Mohammadi", "Nighasan", "Palia Kalan", "Dhaurahra", "Mitauli"], 262701),
        ("167", "Kushinagar", "RURAL", 95.3, "TIER_4", "Banana Fibre Crafts & Buddha Buddhist Heritage Brass Bells", "FIBRE_HANDICRAFTS", ["Padrauna", "Hata", "Tamkuhi Raj", "Kasya (Kushinagar)", "Kaptanganj", "Fazilnagar", "Dudhai"], 274304),
        ("168", "Lalitpur", "RURAL", 85.6, "TIER_4", "Zari Silk Sarees & Bundelkhand Granite Rock Slabs", "HANDLOOM_MINERAL", ["Lalitpur", "Talbehat", "Mehroni", "Madaora", "Jakhaura", "Birdha", "Bar"], 284003),
        ("169", "Lucknow", "METROPOLITAN", 33.8, "TIER_1", "Chikan Hand Embroidery & Zardozi Needlecraft (G.I.)", "TEXTILES_HANDICRAFTS", ["Lucknow", "Malihabad", "Bakshi Ka Talab", "Mohanlalganj", "Sarojini Nagar", "Kakori", "Gosainganj"], 226001),
        ("170", "Maharajganj", "RURAL", 95.0, "TIER_5", "Teak Wood Carpentry & Kalanamak Aromatic Rice Processing", "WOOD_AGRO", ["Maharajganj", "Nautanwa", "Nichlaul", "Pharenda", "Siswa", "Paniyara", "Brijmanganj"], 273303),
        ("171", "Mahoba", "RURAL", 78.8, "TIER_4", "Gora Stone Carving Handicrafts (G.I.) & Mahoba Betel Leaf", "HANDICRAFTS_AGRO", ["Mahoba", "Charkhari", "Kulpahar", "Kabrai", "Panwari", "Jaitpur"], 210427),
        ("172", "Mainpuri", "RURAL", 84.6, "TIER_4", "Tarkashi Brass Wire Wood Inlay Craft & Desi Ghee", "HANDICRAFTS_DAIRY", ["Mainpuri", "Bhongaon", "Karhal", "Kishni", "Kuraoli", "Ghiror", "Bewar"], 205001),
        ("173", "Mathura", "SEMI_URBAN", 70.3, "TIER_2", "Mathura Peda Sweets & Brass Temple Idols / Sanitary Fittings", "FOOD_BRASSWARE", ["Mathura", "Vrindavan", "Chhata", "Mant", "Goverdhan", "Farah", "Nandgaon", "Barsana"], 281001),
        ("174", "Mau", "RURAL", 77.3, "TIER_3", "Mau Powerloom / Handloom Jacquard Textile Fabrics", "TEXTILES", ["Mau (Maunath Bhanjan)", "Muhammadabad Gohna", "Ghosi", "Madhuban", "Kopaganj", "Doharighat"], 275101),
        ("175", "Meerut", "SEMI_URBAN", 48.9, "TIER_1", "Sports Goods (Cricket Bats, Footballs) & Brass Musical Band Spares", "SPORTS_INSTRUMENTS", ["Meerut", "Mawana", "Sardhana", "Hastinapur", "Daurala", "Janikhurd", "Rohata", "Machhra"], 250001),
        ("176", "Mirzapur", "RURAL", 86.0, "TIER_3", "Handmade Woolen Carpets, Durries & Brass Utensils", "CARPETS_BRASSWARE", ["Mirzapur", "Chunar", "Marihan", "Lalganj", "City Block", "Pahari", "Kon", "Majhawan"], 231001),
        ("177", "Moradabad", "SEMI_URBAN", 67.0, "TIER_1", "Moradabad Brass Metal Handicrafts (Peetal Nagari G.I.)", "BRASSWARE", ["Moradabad", "Bilari", "Kanth", "Thakurdwara", "Kundarki", "Munda Pandey", "Dilari"], 244001),
        ("178", "Muzaffarnagar", "SEMI_URBAN", 71.2, "TIER_2", "Sugarcane Organic Jaggery (Gur G.I.) & Steel Rolling Mills", "AGRO_STEEL", ["Muzaffarnagar", "Budhana", "Jansath", "Khatauli", "Shahpur", "Purqazi", "Charthawal", "Baghra"], 251001),
        ("179", "Pilibhit", "RURAL", 82.2, "TIER_3", "Bamboo Wooden Flutes (Bansuri) & Basmati Rice Milling", "MUSICAL_INSTRUMENTS_AGRO", ["Pilibhit", "Bisalpur", "Puranpur", "Barkhera", "Amaria", "Bilsanda", "Marori"], 262001),
        ("180", "Pratapgarh", "RURAL", 94.5, "TIER_3", "Pratapgarh Aonla (Indian Gooseberry G.I.) Pulp & Murabba", "AGRO_PROCESSING", ["Pratapgarh (Bela)", "Kunda", "Patti", "Lalganj", "Raniganj", "Kala Kankar", "Babaganj"], 230001),
        ("181", "Prayagraj", "METROPOLITAN", 75.2, "TIER_1", "Moonj Grass Crafts, Allahabad Surkha Guava & Agro Food", "HANDICRAFTS_AGRO", ["Prayagraj (Allahabad)", "Phulpur", "Soraon", "Handia", "Karchana", "Bara", "Meja", "Koraon"], 211001),
        ("182", "Rae Bareli", "RURAL", 90.1, "TIER_3", "Wood Carvings, Modern Rail Coach Spares & Mentha Oil", "WOOD_ENGINEERING", ["Rae Bareli", "Lalganj", "Dalmau", "Salon", "Tiloi", "Bachhrawan", "Maharajganj", "Sareni"], 229001),
        ("183", "Rampur", "SEMI_URBAN", 74.8, "TIER_3", "Rampur Patchwork / Applique Handcrafts & Mentha Oil Extraction", "HANDICRAFTS_AGRO", ["Rampur", "Bilaspur", "Milak", "Shahabad", "Swar", "Saidnagar", "Chamraua"], 244901),
        ("184", "Saharanpur", "SEMI_URBAN", 69.8, "TIER_2", "Sheesham Wood Carving Furniture (G.I.) & Paper Mills", "WOOD_HANDICRAFTS", ["Saharanpur", "Deoband", "Nakur", "Behat", "Rampur Maniharan", "Gangoh", "Sarsawa"], 247001),
        ("185", "Sambhal", "RURAL", 82.5, "TIER_3", "Handmade Bone and Horn Handicraft Buttons / Combs", "HANDICRAFTS", ["Sambhal", "Chandausi", "Gunnaur", "Bahjoi", "Pawansa", "Asmoli", "Rajpura"], 244302),
        ("186", "Sant Kabir Nagar", "RURAL", 92.4, "TIER_4", "Bakhira Brass & Bell Metal Utensils / Handloom Powerloom", "BRASSWARE_HANDLOOM", ["Khalilabad", "Mehdawal", "Dhanghata", "Semariyawan", "Baghnagar", "Belhar Kala"], 272175),
        ("187", "Shahjahanpur", "RURAL", 80.2, "TIER_3", "Zari-Zardozi Embroidery & Sugarcane Byproducts / Rice Mills", "HANDICRAFTS_AGRO", ["Shahjahanpur", "Tilhar", "Jalalabad", "Powayan", "Kanth", "Nigohi", "Madnapur", "Khutar"], 242001),
        ("188", "Shamli", "RURAL", 71.3, "TIER_3", "Iron Rim Wheels / Axles & Sugarcane Jaggery Production", "ENGINEERING_AGRO", ["Shamli", "Kairana", "Thana Bhawan", "Unn", "Kandhla", "Jinjhana"], 247776),
        ("189", "Shravasti", "RURAL", 96.5, "TIER_6", "Tribal Tharu Embroidery & Kala Namak Rice Cultivation", "HANDICRAFTS_AGRO", ["Bhinqa", "Ikauna", "Jamunaha", "Hariharpur Rani", "Sirsiya"], 271831),
        ("190", "Siddharthnagar", "RURAL", 93.8, "TIER_4", "Kala Namak Rice Processing (Buddha Scented Rice G.I.)", "AGRO_PROCESSING", ["Naugarh (Siddharthnagar)", "Bansi", "Itwa", "Domariyaganj", "Shohratgarh", "Birdpur", "Uska Bazar"], 272207),
        ("191", "Sitapur", "RURAL", 88.2, "TIER_3", "Sitapur Cotton Durries & Mentha Distillation / Sugar Mills", "HANDLOOM_AGRO", ["Sitapur", "Biswan", "Mahmoodabad", "Laharpur", "Sidhauli", "Misrikh", "Khairabad", "Hargaon"], 261001),
        ("192", "Sonbhadra", "RURAL", 83.1, "TIER_4", "Handmade Woolen Carpets, Coal Power Auxiliaries & Agate Stone", "CARPETS_MINERAL", ["Robertsganj (Sonbhadra)", "Duddhi", "Ghorawal", "Obra", "Myorpur", "Chopan", "Babhani"], 231216),
        ("193", "Sultanpur", "RURAL", 94.7, "TIER_4", "Moonj Grass Crafts & Mint Essential Oil Extraction", "HANDICRAFTS_AGRO", ["Sultanpur", "Kadipur", "Jaisinghpur", "Lambhua", "Kurebhar", "Dubaldhan", "Dostpur"], 228001),
        ("194", "Unnao", "RURAL", 82.9, "TIER_3", "Zari-Zardozi Embroidery, Leather Tanning & Agro Flour Mills", "LEATHER_HANDICRAFTS", ["Unnao", "Safipur", "Purwa", "Bangarmau", "Hasanganj", "Bighapur", "Nawabganj", "Miyanganj"], 209801),
        ("195", "Varanasi", "METROPOLITAN", 56.6, "TIER_1", "Banarasi Pure Silk Sarees, Pink Meenakari & Wooden Toys", "SILK_HANDICRAFTS", ["Varanasi", "Pindra", "Rajatalab", "Arajiline", "Kashi Vidyapeeth", "Harahua", "Sewapuri", "Cholapur"], 221001)
    ]
    up_districts = [format_district(code, name, urb, rur, tier, odop, cat, "Middle / Upper Gangetic Plains Region (Zone V/VI)", "UPPCL Rural / Urban Feeder", blks, [f"{name} Rural", f"{blks[0]} GP"], pin) for code, name, urb, rur, tier, odop, cat, blks, pin in up_names]
    states.append({"stateCode": "09", "stateName": "Uttar Pradesh", "territoryType": "STATE", "totalDistricts": 75, "districts": up_districts})

    # 2. RAJASTHAN (50)
    rj_names = [
        ("086", "Ajmer", "SEMI_URBAN", 59.9, "TIER_2", "Kishangarh Marble Slabs, Rose Gulkand & Gota Patti", "MINERAL_AGRO_TEXTILE", ["Ajmer", "Kishangarh", "Beawar", "Nasirabad", "Peeplu", "Arai"], 305001),
        ("087", "Alwar", "SEMI_URBAN", 82.2, "TIER_2", "Alwar Milk Cake (Mawa) & Mustard Oil / Auto Parts", "DAIRY_ENGINEERING", ["Alwar", "Bhiwadi", "Tijara", "Ramgarh", "Rajgarh", "Thanagazi"], 301001),
        ("745", "Anupgarh", "RURAL", 82.0, "TIER_4", "Kinnu Citrus Fruits & Mustard Seed Processing", "AGRO_PROCESSING", ["Anupgarh", "Suratgarh", "Raisingh Nagar", "Gharsana", "Vijaynagar"], 335701),
        ("746", "Balotra", "SEMI_URBAN", 68.0, "TIER_3", "Poplin Cotton Hand Processing & Block Printing / Salt", "TEXTILES_MINERAL", ["Balotra", "Siwana", "Baytoo", "Pachpadra", "Sindhari"], 344022),
        ("088", "Banswara", "RURAL", 92.9, "TIER_4", "Tribal Bamboo Crafts, Teak Wood & Maize Processing", "FOREST_AGRO", ["Banswara", "Garhi", "Ghatol", "Kushalgarh", "Bagidora", "Sajjangarh"], 327001),
        ("089", "Baran", "RURAL", 78.8, "TIER_4", "Garlic (Lahsun) Paste & Coriander Value Addition", "AGRO_PROCESSING", ["Baran", "Antah", "Atru", "Chhabra", "Kishanganj", "Shahbad"], 325205),
        ("090", "Barmer", "RURAL", 93.0, "TIER_3", "Barmer Applique Embroidery, Isabgol & Crude Oil Auxiliaries", "HANDICRAFTS_AGRO", ["Barmer", "Chohtan", "Gudamalani", "Sheo", "Ramsar", "Dhorimanna"], 344001),
        ("747", "Beawar", "SEMI_URBAN", 62.0, "TIER_3", "Beawar Tilpatti Sweets & Woolen Carpet Yarn Spinning", "FOOD_TEXTILES", ["Beawar", "Masuda", "Jawaja", "Raipur", "Jaitaran"], 305901),
        ("091", "Bharatpur", "SEMI_URBAN", 80.6, "TIER_2", "Mustard Oil Expelling Mills & Bansi Paharpur Sandstone", "AGRO_MINERAL", ["Bharatpur", "Bayana", "Deeg", "Kaman", "Nagar", "Kumher", "Rupbas"], 321001),
        ("092", "Bhilwara", "SEMI_URBAN", 78.7, "TIER_2", "Poly-Viscose Suiting Fabrics & Bhilwara Phad Folk Art", "TEXTILES_HANDICRAFTS", ["Bhilwara", "Shahpura", "Mandal", "Mandalgarh", "Asind", "Jahazpur", "Kotri"], 311001),
        ("093", "Bikaner", "SEMI_URBAN", 66.1, "TIER_2", "Bikaneri Bhujia-Rasgulla (G.I.), Camel Wool & Ceramic Clay", "FOOD_HANDICRAFTS", ["Bikaner", "Nokha", "Lunkaransar", "Kolayat", "Khajuwala", "Dungargarh"], 334001),
        ("094", "Bundi", "RURAL", 80.0, "TIER_3", "Basmati Rice Parboiling Mills & Bundi Miniature Paintings", "AGRO_HANDICRAFTS", ["Bundi", "Keshoraipatan", "Nainwa", "Hindoli", "Talera", "Indergarh"], 323001),
        ("095", "Chittorgarh", "RURAL", 81.6, "TIER_3", "Akola Dabu Handblock Indigo Printing & Cement Raw Mix", "TEXTILES_MINERAL", ["Chittorgarh", "Begun", "Kapasan", "Nimbahera", "Rawatbhata", "Rashmi"], 312001),
        ("096", "Churu", "RURAL", 71.7, "TIER_3", "Sandalwood Carvings, Groundnut Expelling & Guargum", "WOOD_AGRO", ["Churu", "Ratangarh", "Sardarshahar", "Sujangarh", "Rajgarh (Sadulpur)", "Taranagar"], 331001),
        ("097", "Dausa", "RURAL", 87.7, "TIER_4", "Dausa Stone Carvings (Sikandra) & Handwoven Durries", "HANDICRAFTS", ["Dausa", "Bandikui", "Lalsot", "Mahwa", "Sikrai", "Baswa", "Lawain"], 303303),
        ("748", "Deeg", "RURAL", 84.0, "TIER_4", "Stone Carving & Mustard Oil Expelling", "HANDICRAFTS_AGRO", ["Deeg", "Kaman", "Nagar", "Pahadi", "Januther"], 321203),
        ("749", "Didwana-Kuchaman", "RURAL", 76.0, "TIER_3", "Kuchaman Salt Works & Makrana White Marble Craft", "MINERAL_HANDICRAFTS", ["Didwana", "Kuchaman City", "Nawa", "Ladnun", "Parbatsar", "Makrana"], 341508),
        ("750", "Dudu", "RURAL", 89.0, "TIER_4", "Gram Milling & Mojari Leather Footwear", "AGRO_LEATHER", ["Dudu", "Mozmabad", "Phagi"], 303008),
        ("098", "Dholpur", "RURAL", 79.5, "TIER_4", "Dholpur Red Sandstone & Dairy Milk Sweets", "MINERAL_DAIRY", ["Dholpur", "Bari", "Baseri", "Rajakhera", "Saipau", "Sarmathura"], 328001),
        ("099", "Dungarpur", "RURAL", 93.6, "TIER_5", "Green Serpentine Marble Carving & Organic Ginger", "HANDICRAFTS_AGRO", ["Dungarpur", "Sagwara", "Aspur", "Chikhli", "Simalwara", "Bichhiwara"], 314001),
        ("751", "Gangapur City", "RURAL", 79.0, "TIER_3", "Kheer Mohan Sweets & Sesame Seed Processing", "FOOD_AGRO", ["Gangapur City", "Bamanwas", "Wazirpur", "Toda Bhim"], 322201),
        ("100", "Hanumangarh", "RURAL", 80.2, "TIER_3", "Narma Cotton Baling, Mustard Oil & Wheat Milling", "AGRO_PROCESSING", ["Hanumangarh", "Nohar", "Bhadra", "Pilibanga", "Sangaria", "Rawatsar", "Tibbi"], 335512),
        ("752", "Jaipur Rural", "RURAL", 82.0, "TIER_2", "Bagru Vegetable Dye Block Prints & Dairy Milk Processing", "TEXTILES_DAIRY", ["Chomu", "Amer", "Jamwa Ramgarh", "Bassi", "Chaksu", "Kotkhawda", "Jobner"], 303702),
        ("101", "Jaipur Urban", "METROPOLITAN", 10.0, "TIER_1", "Gemstone Cutting, Blue Pottery (G.I.), Jewellery & IT", "GEMS_HANDICRAFTS", ["Jaipur City", "Sanganer", "Jhotwara", "Mansarovar", "Vidhyadhar Nagar"], 302001),
        ("102", "Jaisalmer", "RURAL", 86.7, "TIER_4", "Yellow Sandstone Slabs & Desert Woolen Blankets / Solar", "MINERAL_SOLAR", ["Jaisalmer", "Pokaran", "Fatehgarh", "Sam", "Bhaniyana"], 345001),
        ("103", "Jalore", "RURAL", 91.7, "TIER_4", "Jalore Granite Polishing & Isabgol (Psyllium Husk) Processing", "MINERAL_AGRO", ["Jalore", "Bhinmal", "Sanchore", "Ahore", "Sayla", "Bagoda"], 343001),
        ("104", "Jhalawar", "RURAL", 83.7, "TIER_3", "Jhalawar Mandarin Oranges (Nagpur Variety) & Kota Stone", "AGRO_MINERAL", ["Jhalawar", "Jhalrapatan", "Aklera", "Pirawa", "Khanpur", "Manohar Thana"], 326001),
        ("105", "Jhunjhunu", "RURAL", 77.1, "TIER_3", "Copper Metal Craft, Wood Carvings & Pulses Processing", "HANDICRAFTS_AGRO", ["Jhunjhunu", "Khetri", "Nawalgarh", "Chirawa", "Buhana", "Surajgarh", "Udaipurwati"], 333001),
        ("753", "Jodhpur Rural", "RURAL", 78.0, "TIER_2", "Salawas Dhurries & Red Chilli Mathania Processing", "HANDLOOM_AGRO", ["Luni", "Bilara", "Bhopalgarh", "Osian", "Balesar", "Shergarh", "Baori"], 342001),
        ("106", "Jodhpur Urban", "METROPOLITAN", 12.0, "TIER_1", "Handicrafts Wooden / Iron Furniture & Bandhani Tie-Dye", "FURNITURE_TEXTILE", ["Jodhpur North", "Jodhpur South"], 342001),
        ("107", "Karauli", "RURAL", 85.0, "TIER_4", "Karauli Sandstone & Wooden Toy Figurines / Sesame", "MINERAL_HANDICRAFTS", ["Karauli", "Hindaun", "Todabhim", "Sapotra", "Mandrail", "Nadoti"], 322241),
        ("754", "Kekri", "RURAL", 82.0, "TIER_4", "Mustard Oil Expelling & Handloom Weaving", "AGRO_HANDLOOM", ["Kekri", "Sarwar", "Bhinai", "Todaraisingh", "Sawai"], 305404),
        ("755", "Khairthal-Tijara", "SEMI_URBAN", 52.0, "TIER_2", "Automobile Assembly Components & Mustard Oil", "ENGINEERING_AGRO", ["Tijara", "Kishangarh Bas", "Kotkasim", "Mundawar"], 301404),
        ("108", "Kota", "SEMI_URBAN", 39.7, "TIER_1", "Kota Doria Handloom Sarees (G.I.) & Kota Limestone Slabs", "HANDLOOM_MINERAL", ["Kota", "Ladpura", "Sangod", "Digod", "Pipalda", "Ramganj Mandi", "Chechat"], 324001),
        ("756", "Kotputli-Behror", "SEMI_URBAN", 68.0, "TIER_2", "Neemrana Japanese Zone Electronics & Lime Calcination", "ELECTRONICS_MINERAL", ["Kotputli", "Behror", "Neemrana", "Bansur", "Paota", "Viratnagar"], 303108),
        ("109", "Nagaur", "RURAL", 80.7, "TIER_3", "Nagauri Methi (Fenugreek G.I.) & Makrana Marble Slabs", "SPICES_MINERAL", ["Nagaur", "Merta", "Degana", "Jayal", "Riyan Badi", "Mundwa"], 341001),
        ("757", "Neem Ka Thana", "RURAL", 78.0, "TIER_3", "Copper Craft & Calcite Mineral Grinding", "MINERAL_HANDICRAFTS", ["Neem Ka Thana", "Sri Madhopur", "Khandela", "Patan"], 332713),
        ("110", "Pali", "RURAL", 77.4, "TIER_2", "Pali Cotton Processing Dyeing & Sojat Mehndi (Henna G.I.)", "AGRO_TEXTILES", ["Pali", "Sojat", "Marwar Junction", "Bali", "Sumerpur", "Desuri", "Rohat", "Rani", "Jaitaran"], 306401),
        ("758", "Phalodi", "RURAL", 84.0, "TIER_4", "Salt Extraction Mills & Solar Power Generation Spares", "MINERAL_SOLAR", ["Phalodi", "Lohawat", "Bap", "Aau", "Dechu"], 342301),
        ("111", "Pratapgarh", "RURAL", 91.7, "TIER_5", "Thewa Gold Foil Glass Jewelry (G.I.) & Garlic Processing", "JEWELLERY_AGRO", ["Pratapgarh", "Arnod", "Chhoti Sadri", "Dhariawad", "Peepalkhoont"], 312605),
        ("112", "Rajsamand", "RURAL", 84.1, "TIER_3", "Nathdwara Pichwai Paintings & Rajnagar White Marble", "HANDICRAFTS_MINERAL", ["Rajsamand", "Nathdwara", "Kumbhalgarh", "Amet", "Railmagra", "Bhim", "Deogarh"], 313324),
        ("759", "Salumbar", "RURAL", 92.0, "TIER_5", "Tribal Woodcraft & Minor Forest Honey / Mahua", "FOREST_HANDICRAFTS", ["Salumbar", "Sarada", "Semari", "Jhadol", "Lasadiya"], 313106),
        ("760", "Sanchore", "RURAL", 89.0, "TIER_4", "Kankrej Cow Dairy Ghee & Isabgol Processing", "DAIRY_AGRO", ["Sanchore", "Chitalwana", "Bagoda", "Raniwara"], 343041),
        ("113", "Sawai Madhopur", "RURAL", 80.2, "TIER_3", "Guava (Amrood) Value Addition & Ranthambore Wildlife Souvenirs", "AGRO_HANDICRAFTS", ["Sawai Madhopur", "Gangapur City", "Bonli", "Bamanwas", "Chauth Ka Barwara", "Khandar"], 322001),
        ("761", "Shahpura", "RURAL", 86.0, "TIER_4", "Phad Painting Art & Cotton Ginning", "HANDICRAFTS_AGRO", ["Shahpura", "Jahazpur", "Kotri", "Banera"], 311404),
        ("114", "Sikar", "SEMI_URBAN", 76.3, "TIER_2", "Shekhawati Wood Carvings & Onion Seed / Flour Milling", "WOOD_AGRO", ["Sikar", "Fatehpur", "Lachhmangarh", "Danta Ramgarh", "Dhod", "Pipad"], 332001),
        ("115", "Sirohi", "RURAL", 79.9, "TIER_3", "Sirohi Traditional Swords / Steel Blades & Fennel (Saunf)", "METALS_SPICES", ["Sirohi", "Abu Road", "Mount Abu", "Sheoganj", "Pindwara", "Reodar"], 307001),
        ("116", "Sri Ganganagar", "SEMI_URBAN", 72.8, "TIER_2", "Kinnow Citrus Processing, Cotton Ginning & Mustard Oil", "AGRO_PROCESSING", ["Sri Ganganagar", "Karanpur", "Padampur", "Sadulshahar", "Suratgarh"], 335001),
        ("117", "Tonk", "RURAL", 77.6, "TIER_3", "Tonk Handmade Woolen Felt Namda & Mustard Oil Expelling", "HANDICRAFTS_AGRO", ["Tonk", "Niwai", "Malpura", "Deoli", "Uniara", "Todaraisingh", "Peeplu"], 304001),
        ("118", "Udaipur", "SEMI_URBAN", 80.2, "TIER_1", "Green Marble Handicrafts, Miniature Paintings & Zinc Refinement", "MINERAL_HANDICRAFTS", ["Girwa (Udaipur)", "Mavli", "Vallabhnagar", "Salumbar", "Kherwara", "Jhadol", "Gogunda", "Kotra", "Sarada", "Rishabhdeo", "Badgaon"], 313001)
    ]
    rj_districts = [format_district(code, name, urb, rur, tier, odop, cat, "Western Dry Region / Trans-Gangetic (Zone XIV/VI)", "JVVNL / AVVNL / JdVVNL Feeder", blks, [f"{name} Rural", f"{blks[0]} GP"], pin) for code, name, urb, rur, tier, odop, cat, blks, pin in rj_names]
    states.append({"stateCode": "08", "stateName": "Rajasthan", "territoryType": "STATE", "totalDistricts": 50, "districts": rj_districts})

    # 3. PUNJAB (23)
    pb_names = [
        ("024", "Amritsar", "SEMI_URBAN", 46.4, "TIER_1", "Amritsari Papad-Warian, Phulkari Embroidery & Woolen Shawls", "FOOD_HANDICRAFTS", ["Amritsar I", "Amritsar II", "Ajnala", "Majitha", "Rayya", "Chogawan", "Attari", "Jandiala Guru"], 143001),
        ("025", "Barnala", "RURAL", 68.0, "TIER_3", "Tractor Combine Harvesters & Cotton Spinning / Weaving", "ENGINEERING_TEXTILES", ["Barnala", "Mehal Kalan", "Sehna"], 148101),
        ("026", "Bathinda", "SEMI_URBAN", 64.0, "TIER_2", "Thermal Engineering Spares, Raw Cotton Baling & Petrochemicals", "AGRO_CHEMICALS", ["Bathinda", "Talwandi Sabo", "Rampura Phul", "Maur", "Goniana", "Nathana", "Bhagta Bhaika", "Sangat"], 151001),
        ("027", "Faridkot", "RURAL", 64.9, "TIER_3", "Harvester Combine Parts & Kinnow Citrus Processing", "ENGINEERING_AGRO", ["Faridkot", "Kotkapura", "Jaitu"], 151203),
        ("028", "Fatehgarh Sahib", "RURAL", 69.2, "TIER_3", "Mandi Gobindgarh Steel Re-rolling & Rice Milling", "STEEL_AGRO", ["Fatehgarh Sahib", "Amloh", "Bassi Pathana", "Khamanon", "Khera"], 140406),
        ("029", "Fazilka", "RURAL", 78.9, "TIER_3", "Kinnow Fruit Waxing / Packaging & Cotton Ginning", "AGRO_PROCESSING", ["Fazilka", "Abohar", "Jalalabad", "Khuian Sarwar", "Arniwala Sheikh Subhan"], 152123),
        ("030", "Ferozepur", "RURAL", 71.9, "TIER_3", "Paddy Parboiling & Agricultural Implement Fabrication", "AGRO_ENGINEERING", ["Ferozepur", "Zira", "Ghuruharsahai", "Mamdot", "Makhu"], 152002),
        ("031", "Gurdaspur", "RURAL", 71.3, "TIER_3", "Sugarcane Jaggery & Batala Machine Tools / Cast Iron Foundries", "AGRO_ENGINEERING", ["Gurdaspur", "Batala", "Dera Baba Nanak", "Dhariwal", "Dinanagar", "Fatehgarh Churian", "Kahnuwan", "Kalanaur"], 143521),
        ("032", "Hoshiarpur", "RURAL", 78.9, "TIER_2", "Wooden Inlay Craft, Citrus Processing & Tractor Implements", "WOOD_AGRO", ["Hoshiarpur", "Dasuya", "Mukerian", "Garhshankar", "Mahilpur", "Bhunga", "Talwara", "Hajipur"], 146001),
        ("033", "Jalandhar", "SEMI_URBAN", 46.9, "TIER_1", "Sports Goods (Inflatable Balls, Bats) & Leather Footwear", "SPORTS_LEATHER", ["Jalandhar I", "Jalandhar II", "Nakodar", "Phillaur", "Shahkot", "Bhogpur", "Goraya", "Adampur", "Nurmahal", "Rurka Kalan"], 144001),
        ("034", "Kapurthala", "SEMI_URBAN", 65.2, "TIER_2", "Railway Passenger Coaches Auxiliaries & Basmati Rice", "ENGINEERING_AGRO", ["Kapurthala", "Phagwara", "Sultanpur Lodhi", "Bholath", "Nadala", "Dhilwan"], 144601),
        ("035", "Ludhiana", "METROPOLITAN", 40.8, "TIER_1", "Bicycles & Parts, Woolen Knitwear Garments & Machine Tools", "ENGINEERING_TEXTILES", ["Ludhiana East", "Ludhiana West", "Khanna", "Jagraon", "Samrala", "Payal", "Raikot", "Doraha", "Dehlon", "Pakhowal", "Machhiwara", "Sidhwan Bet"], 141001),
        ("762", "Malerkotla", "SEMI_URBAN", 60.0, "TIER_3", "Vegetable Seed Nursery & Metal Badge / Hand Embroidery", "AGRO_HANDICRAFTS", ["Malerkotla", "Amargarh", "Ahmedgarh"], 148023),
        ("036", "Mansa", "RURAL", 78.8, "TIER_4", "Cotton Ginning & Mustard Oil / Combine Harvester Spares", "AGRO_ENGINEERING", ["Mansa", "Budhlada", "Sardulgarh", "Bhikhi", "Jhunir"], 151505),
        ("037", "Moga", "RURAL", 77.2, "TIER_3", "Dairy Milk Products (Nestle Hub) & Agricultural Threshers", "DAIRY_ENGINEERING", ["Moga", "Baghapurana", "Nihal Singh Wala", "Dharamkot", "Kot-ise-Khan"], 142001),
        ("038", "Muktsar", "RURAL", 72.0, "TIER_3", "Muktsari Punjabi Jutti (Leather) & Cotton Baling", "LEATHER_AGRO", ["Sri Muktsar Sahib", "Malout", "Gidderbaha", "Lambi"], 152026),
        ("039", "Pathankot", "SEMI_URBAN", 55.4, "TIER_3", "Stone Crushing, Lychee Processing & Defence Logistics", "MINERAL_AGRO", ["Pathankot", "Dhar Kalan", "Narot Jaimal Singh", "Sujanpur", "Gharota"], 145001),
        ("040", "Patiala", "SEMI_URBAN", 59.7, "TIER_1", "Patiala Shahi Punjabi Salwar Suits, Paranda & Dairy Engineering", "TEXTILES_ENGINEERING", ["Patiala", "Nabha", "Rajpura", "Samana", "Patran", "Ghanaur", "Sanour", "Bhadson"], 147001),
        ("041", "Rupnagar", "RURAL", 71.9, "TIER_3", "Tractor Auxiliaries, Wood Pulp & Basmati Rice", "ENGINEERING_AGRO", ["Rupnagar (Ropar)", "Anandpur Sahib", "Chamkaur Sahib", "Morinda", "Nurpur Bedi"], 140001),
        ("042", "Sahibzada Ajit Singh Nagar", "METROPOLITAN", 45.2, "TIER_1", "Information Technology, Biotech & Precision Automotive Parts", "IT_ENGINEERING", ["Mohali (SAS Nagar)", "Kharar", "Dera Bassi", "Majri"], 160055),
        ("043", "Shahid Bhagat Singh Nagar", "RURAL", 79.5, "TIER_3", "Khatkar Kalan Wood Inlay & Rice Parboiling", "WOOD_AGRO", ["Nawanshahr", "Banga", "Balachaur", "Aur", "Saroya"], 144514),
        ("044", "Sangrur", "RURAL", 68.8, "TIER_2", "Agro Implements, Chemical Fertilizers & Paddy Milling", "ENGINEERING_CHEMICALS", ["Sangrur", "Sunam", "Dhuri", "Lehragaga", "Moonak", "Bhawanigarh", "Dirba"], 148001),
        ("045", "Tarn Taran", "RURAL", 87.3, "TIER_4", "Basmati Paddy Milling & Handloom Woolen Blankets", "AGRO_HANDLOOM", ["Tarn Taran", "Patti", "Khadur Sahib", "Bhikiwind", "Chohla Sahib", "Naushehra Pannuan", "Gandiswind", "Valtoha"], 143401)
    ]
    pb_districts = [format_district(code, name, urb, rur, tier, odop, cat, "Trans-Gangetic Plains Region (Zone VI)", "PSPCL Agro / Industrial Feeder", blks, [f"{name} Rural", f"{blks[0]} GP"], pin) for code, name, urb, rur, tier, odop, cat, blks, pin in pb_names]
    states.append({"stateCode": "03", "stateName": "Punjab", "territoryType": "STATE", "totalDistricts": 23, "districts": pb_districts})

    # 4. HARYANA (22)
    hr_names = [
        ("064", "Ambala", "SEMI_URBAN", 55.6, "TIER_2", "Scientific & Laboratory Glassware / Instruments & Mixers", "SCIENTIFIC_ENGINEERING", ["Ambala I", "Ambala II", "Barara", "Naraingarh", "Saha", "Shahzadpur"], 134003),
        ("065", "Bhiwani", "RURAL", 80.3, "TIER_3", "Textile Weaving, Boxing Gear & Guar Gum Extraction", "TEXTILES_SPORTS", ["Bhiwani", "Tosham", "Siwani", "Bawani Khera", "Loharu", "Behal", "Kairu"], 127021),
        ("066", "Charkhi Dadri", "RURAL", 88.0, "TIER_4", "Limestone Stone Crushing & Mustard Oil Processing", "MINERAL_AGRO", ["Charkhi Dadri", "Badhra", "Jhanjhar", "Bond Kalan"], 127306),
        ("067", "Faridabad", "METROPOLITAN", 20.5, "TIER_1", "Automotive Tractors, Home Appliances (Refrigerators) & Henna", "AUTO_APPLIANCES", ["Faridabad", "Ballabgarh", "Tigaon"], 121001),
        ("068", "Fatehabad", "RURAL", 80.9, "TIER_3", "Cotton Ginning & Kinnow Fruit Waxing / Cold Storage", "AGRO_PROCESSING", ["Fatehabad", "Tohana", "Ratia", "Bhattu Kalan", "Bhuna", "Jakhal"], 125050),
        ("069", "Gurugram", "METROPOLITAN", 31.2, "TIER_1", "Information Technology, Auto Manufacturing & Medical Devices", "IT_AUTO_DEVICES", ["Gurugram", "Manesar", "Sohna", "Farrukhnagar", "Pataudi"], 122001),
        ("070", "Hisar", "SEMI_URBAN", 68.3, "TIER_2", "Galvanized Steel Pipes, Stainless Steel & Buffalo Dairy Feed", "STEEL_DAIRY", ["Hisar I", "Hisar II", "Hansi", "Barwala", "Narnaund", "Adampur", "Ukrana", "Agroha"], 125001),
        ("071", "Jhajjar", "RURAL", 74.6, "TIER_3", "Bahadurgarh Sanitaryware Footwear & Ceramic Glaze Tiles", "FOOTWEAR_CERAMICS", ["Jhajjar", "Bahadurgarh", "Beri", "Badli", "Matenhail", "Salhawas"], 124103),
        ("072", "Jind", "RURAL", 77.1, "TIER_3", "Murrah Buffalo Dairy Breeding / Milk Products & Poultry", "DAIRY_POULTRY", ["Jind", "Narwana", "Safidon", "Julana", "Uchana", "Alewa", "Pilu Khera"], 126102),
        ("073", "Kaithal", "RURAL", 78.0, "TIER_3", "Basmati Rice Parboiling Mills & Agricultural Implements", "AGRO_PROCESSING", ["Kaithal", "Guhla", "Pundri", "Kalayat", "Rajound", "Siwan"], 136027),
        ("074", "Karnal", "SEMI_URBAN", 69.8, "TIER_2", "Basmati Rice Processing (Rice Bowl) & Dairy Research Tech", "AGRO_DAIRY", ["Karnal", "Gharaunda", "Assandh", "Nilokheri", "Indri", "Kunjpura", "Munak", "Nissing"], 132001),
        ("075", "Kurukshetra", "RURAL", 71.1, "TIER_3", "Paddy Milling, Honey Processing & Tourism Souvenirs", "AGRO_FOOD", ["Thanesar (Kurukshetra)", "Pehowa", "Shahbad", "Ladwa", "Babain", "Ismailabad"], 136118),
        ("076", "Mahendragarh", "RURAL", 85.5, "TIER_4", "Mustard Oil Expelling & Marble / Slate Stone Slabs", "AGRO_MINERAL", ["Narnaul", "Mahendragarh", "Kanina", "Ateli", "Nangal Chaudhry", "Satnali"], 123001),
        ("077", "Nuh", "RURAL", 88.6, "TIER_5", "Tomato Paste Processing, Onion Storage & Leather Work", "AGRO_LEATHER", ["Nuh", "Tauru", "Ferozepur Jhirka", "Punhana", "Nagina", "Pinangwan"], 122107),
        ("078", "Palwal", "RURAL", 77.3, "TIER_3", "Agro Implements, Light Commercial Vehicle Spares & Jaggery", "ENGINEERING_AGRO", ["Palwal", "Hodal", "Hathin", "Hassanpur"], 121102),
        ("079", "Panchkula", "SEMI_URBAN", 44.2, "TIER_2", "Pharmaceutical Formulations, Electronics & Plywood", "PHARMA_ELECTRONICS", ["Panchkula", "Kalka", "Pinjore", "Raipur Rani", "Morni (Hill)"], 134109),
        ("080", "Panipat", "SEMI_URBAN", 53.9, "TIER_1", "Textile Shoddy Yarn, Mink Blankets, Handloom Durries & Carpets", "TEXTILES", ["Panipat", "Samalkha", "Israna", "Madlauda", "Bapoli", "Sanauli Khurd"], 132103),
        ("081", "Rewari", "SEMI_URBAN", 74.1, "TIER_2", "Traditional Brass Sheet Metal Utensils & Auto Ancillaries", "BRASSWARE_AUTO", ["Rewari", "Bawal", "Kosli", "Dharuhera", "Jatusana", "Khol", "Nahar"], 123401),
        ("082", "Rohtak", "SEMI_URBAN", 57.9, "TIER_1", "Rohtak Rewari Sweets, Fasteners & Nut-Bolt Manufacturing", "FOOD_ENGINEERING", ["Rohtak", "Meham", "Sampla", "Kalanaur", "Lakhan Majra"], 124001),
        ("083", "Sirsa", "RURAL", 75.4, "TIER_3", "Raw Cotton Baling, Kinnow Grading & Mustard Oil Mills", "AGRO_PROCESSING", ["Sirsa", "Dabwali", "Rania", "Ellenabad", "Odhan", "Baragudha", "Nathusari Chopta"], 125055),
        ("084", "Sonipat", "SEMI_URBAN", 68.7, "TIER_2", "Stainless Steel Utensils, Rubber Hoses & Food Processing Park", "STEEL_FOOD", ["Sonipat", "Ganaur", "Gohana", "Kharkhoda", "Rai", "Mundlana"], 131001),
        ("085", "Yamunanagar", "SEMI_URBAN", 61.1, "TIER_2", "Plywood / Timber Processing, Sugar Mills & Metal Fabrication", "WOOD_ENGINEERING", ["Yamunanagar", "Jagadhri", "Chhachhrauli", "Bilaspur", "Radaur", "Sadhaura", "Saraswati Nagar"], 135001)
    ]
    hr_districts = [format_district(code, name, urb, rur, tier, odop, cat, "Trans-Gangetic Plains Region (Zone VI)", "UHBVN / DHBVN Feeder", blks, [f"{name} Rural", f"{blks[0]} GP"], pin) for code, name, urb, rur, tier, odop, cat, blks, pin in hr_names]
    states.append({"stateCode": "06", "stateName": "Haryana", "territoryType": "STATE", "totalDistricts": 22, "districts": hr_districts})

    # 5. HIMACHAL PRADESH (12)
    hp_names = [
        ("015", "Bilaspur", "RURAL", 93.4, "TIER_4", "Gobind Sagar Dam Freshwater Fish Culture & Cement Minerals", "FISHERIES_MINERAL", ["Bilaspur Sadar", "Ghumarwin", "Jhandutta", "Shri Naina Devi Ji"], 174001),
        ("016", "Chamba", "RURAL", 93.0, "TIER_5", "Chamba Rumal (Hand Embroidered Silk G.I.) & Chamba Chukh Chilli", "HANDICRAFTS_SPICES", ["Chamba", "Bharmour", "Dalhousie", "Salooni", "Chowari", "Pangi (Tribal)", "Tissa (Churah)"], 176310),
        ("017", "Hamirpur", "RURAL", 93.1, "TIER_4", "Sericulture Silk Reeling & Citrus Fruit Processing", "SERICULTURE_AGRO", ["Hamirpur", "Nadaun", "Barsar", "Bhoranj", "Sujanpur Tira", "Bijhari"], 177001),
        ("018", "Kangra", "RURAL", 94.3, "TIER_3", "Kangra Orthodox Orthodox Tea (G.I.) & Kangra Miniature Paintings", "TEA_HANDICRAFTS", ["Dharamshala", "Palampur", "Kangra", "Nurpur", "Dehra Gopipur", "Jawali", "Baijnath", "Shahpur", "Indora", "Fatehpur", "Nagrota Bagwan", "Rait", "Sulha", "Bhawarna", "Panchrukhi"], 176215),
        ("019", "Kinnaur", "RURAL", 100.0, "TIER_5", "Kinnauri Royal Apples & Chilgoza Pine Nuts (G.I.)", "HORTICULTURE_NUTS", ["Reckong Peo (Kalpa)", "Pooh", "Nichar", "Sangla", "Moorang", "Hangrang"], 172107),
        ("020", "Kullu", "RURAL", 90.5, "TIER_4", "Kullu Woolen Shawls (G.I.), Royal Delicious Apples & Trout Fish", "HANDLOOM_HORTICULTURE", ["Kullu", "Manali", "Banjar", "Anni", "Nirmand", "Naggar"], 175101),
        ("021", "Lahaul and Spiti", "RURAL", 100.0, "TIER_6", "Sea Buckthorn Berry Extract, Seed Potatoes & Handknit Socks", "AGRO_HANDLOOM", ["Keylong (Lahaul)", "Kaza (Spiti)", "Udaipur"], 175132),
        ("022", "Mandi", "RURAL", 93.7, "TIER_3", "Sepu Badi Food Processing & Metal Idols (Mohra)", "FOOD_HANDICRAFTS", ["Mandi Sadar", "Sundernagar", "Sarkaghat", "Jogindernagar", "Karsog", "Gohar", "Chachyot", "Dharampur", "Padhar", "Balh", "Gopalpur"], 175001),
        ("023", "Shimla", "SEMI_URBAN", 75.3, "TIER_2", "Shimla Royal Apples Processing & Wooden Carved Souvenirs", "HORTICULTURE_WOOD", ["Shimla Urban", "Shimla Rural", "Rampur Bushahr", "Rohru", "Theog", "Jubbal", "Kotkhai", "Chopal", "Kumarsain", "Nankhari", "Mashobra", "Basantpur"], 171001),
        ("012", "Sirmaur", "RURAL", 89.2, "TIER_3", "Paonta Sahib Ginger Processing & Stone Carving / Limestone", "AGRO_MINERAL", ["Nahan", "Paonta Sahib", "Rajgarh", "Sangrah", "Shillai", "Pachhad"], 173001),
        ("013", "Solan", "SEMI_URBAN", 82.4, "TIER_2", "Button Mushrooms (Mushroom City), Tomatoes & Baddi Pharma", "AGRO_PHARMA", ["Solan", "Nalagarh", "Kasauli", "Kandaghat", "Dharampur", "Kunihar"], 173212),
        ("014", "Una", "RURAL", 91.4, "TIER_3", "Potato Seed Cultivation, Citrus Pulping & Light Engineering", "AGRO_ENGINEERING", ["Una", "Amb", "Haroli", "Bangana", "Gagret"], 174303)
    ]
    hp_districts = [format_district(code, name, urb, rur, tier, odop, cat, "Western Himalayan Region (Zone I)", "HPSEBL Hill Feeder", blks, [f"{name} Rural", f"{blks[0]} GP"], pin) for code, name, urb, rur, tier, odop, cat, blks, pin in hp_names]
    states.append({"stateCode": "02", "stateName": "Himachal Pradesh", "territoryType": "STATE", "totalDistricts": 12, "districts": hp_districts})

    # 6. UTTARAKHAND (13)
    uk_names = [
        ("046", "Almora", "RURAL", 89.9, "TIER_4", "Bal Mithai Milk Sweet & Tamta Brass-Copper Metal Craft", "FOOD_HANDICRAFTS", ["Almora", "Ranikhet", "Bhikiyasain", "Dwarahat", "Chaukhutiya", "Sult", "Someshwar", "Hawalbagh", "Dhauladevi", "Lamgara", "Tarikhet"], 263601),
        ("047", "Bageshwar", "RURAL", 96.5, "TIER_5", "Copper Utensils & Ringal Bamboo Baskets / Mandua Flour", "HANDICRAFTS_AGRO", ["Bageshwar", "Kapkot", "Garur"], 263642),
        ("048", "Chamoli", "RURAL", 84.8, "TIER_5", "Chamoli Woolen Tweed, Ringal Craft & High Altitude Honey", "HANDLOOM_FOREST", ["Gopeshwar (Chamoli)", "Joshimath", "Karnaprayag", "Gairsain", "Tharali", "Dasholi", "Pokhari", "Ghat", "Dewal"], 246401),
        ("049", "Champawat", "RURAL", 85.2, "TIER_5", "Tejpatta (Bay Leaf G.I.), Iron Blacksmithy & Lohaghat Spices", "SPICES_METALS", ["Champawat", "Lohaghat", "Pati", "Barakot"], 262523),
        ("050", "Dehradun", "METROPOLITAN", 44.1, "TIER_1", "Dehradun Basmati Rice (G.I.), Bakery Confectionery & IT/Forestry", "AGRO_IT", ["Dehradun", "Rishikesh", "Vikasnagar", "Chakrata", "Kalsi", "Doiwala", "Sahaspur", "Raipur"], 248001),
        ("051", "Haridwar", "SEMI_URBAN", 63.3, "TIER_1", "Ayurvedic Herbal Formulations (Patanjali / BHEL) & Brass Idols", "AYURVEDA_HANDICRAFTS", ["Haridwar", "Roorkee", "Laksar", "Bhagwanpur", "Bahadrabad", "Narsan", "Khanpur"], 249401),
        ("052", "Nainital", "SEMI_URBAN", 61.1, "TIER_2", "Haldwani Agro Mandi, Wooden Lacquer Candles & Peach / Plum", "HORTICULTURE_CANDLES", ["Nainital", "Haldwani", "Ramnagar", "Bhimtal", "Dhari", "Betalghat", "Kotabagh", "Okhalkanda"], 263001),
        ("053", "Pauri Garhwal", "RURAL", 83.5, "TIER_4", "Finger Millet (Koda / Ragi) & Hill Citrus (Malta) Processing", "AGRO_PROCESSING", ["Pauri", "Kotdwar", "Srinagar", "Lansdowne", "Thalisain", "Ekeshwar", "Dugadda", "Rikhnikhal", "Kaljikhal", "Pabo", "Khirsu", "Nainidanda", "Pokhra", "Bironkhal", "Yamkeshwar"], 246001),
        ("054", "Pithoragarh", "RURAL", 85.7, "TIER_5", "Munsyari White Kidney Beans (Rajma G.I.) & Woolen Carpets", "AGRO_HANDLOOM", ["Pithoragarh", "Dharchula", "Didihat", "Munsyari", "Gangolihat", "Berinag", "Kanalichhina", "Munakot"], 262501),
        ("055", "Rudraprayag", "RURAL", 95.8, "TIER_5", "Kedarnath Herbal Incense & Chaulai (Amaranth) Processing", "HERBAL_AGRO", ["Rudraprayag", "Ukhimath", "Jakholi", "Augustmuni"], 246171),
        ("056", "Tehri Garhwal", "RURAL", 88.6, "TIER_4", "Tehri Hydro Turbine Spares & Ginger / Red Rice Value Addition", "ENGINEERING_AGRO", ["New Tehri", "Narendra Nagar", "Chamba", "Pratapnagar", "Devprayag", "Ghansali", "Jakhnidhar", "Kirtinagar", "Thauldhar", "Bhilangana"], 249001),
        ("057", "Udham Singh Nagar", "SEMI_URBAN", 64.4, "TIER_2", "Pantnagar Auto Industrial Cluster & Sugarcane Jaggery / Rice", "AUTO_AGRO", ["Rudrapur", "Kashipur", "Kichha", "Sitarganj", "Khatima", "Bazpur", "Gadarpur"], 263153),
        ("058", "Uttarkashi", "RURAL", 92.6, "TIER_5", "Harsil Royal Apples, Red Kidney Beans (Rajma) & Woolen Shawls", "HORTICULTURE_HANDLOOM", ["Uttarkashi", "Bhatwari (Harsil)", "Barkot", "Purola", "Mori", "Dunda", "Chinyalisaur", "Naugaon"], 249193)
    ]
    uk_districts = [format_district(code, name, urb, rur, tier, odop, cat, "Western Himalayan Region (Zone I)", "UPCL Hill Grid Feeder", blks, [f"{name} Rural", f"{blks[0]} GP"], pin) for code, name, urb, rur, tier, odop, cat, blks, pin in uk_names]
    states.append({"stateCode": "05", "stateName": "Uttarakhand", "territoryType": "STATE", "totalDistricts": 13, "districts": uk_districts})

    # 7. JAMMU AND KASHMIR (20)
    jk_names = [
        ("001", "Anantnag", "RURAL", 73.8, "TIER_3", "Kashmir Willow Cricket Bats, Trout Fish & Walnut Woodcraft", "SPORTS_WOOD", ["Anantnag", "Bijbehara", "Dooru", "Kokernag", "Pahalgam", "Shangus", "Achabal", "Qazigund"], 192101),
        ("002", "Bandipora", "RURAL", 85.0, "TIER_4", "Wular Lake Dried Fish, Handknit Woolens & Black Cumin", "FISHERIES_SPICES", ["Bandipora", "Sumbal", "Gurez (Border)"], 193502),
        ("003", "Baramulla", "RURAL", 81.9, "TIER_3", "Kashmir Delicious Red Apples & Handmade Paper Mache Art", "HORTICULTURE_HANDICRAFTS", ["Baramulla", "Sopore", "Pattan", "Uri", "Tangmarg (Gulmarg)", "Rafiabad", "Kunzer", "Wagoora"], 193101),
        ("004", "Budgam", "RURAL", 87.0, "TIER_3", "Kashmiri Kani Shawls (G.I.), Pottery & Fresh Sweet Cherries", "HANDLOOM_HORTICULTURE", ["Budgam", "Beerwah", "Chadoora", "Khansahib", "Magam", "B.K. Pora", "Narbal", "Surasyar"], 191111),
        ("005", "Doda", "RURAL", 92.0, "TIER_5", "Bhaderwah Purple Lavender Essential Oil & Rajmash", "AROMATICS_AGRO", ["Doda", "Bhaderwah", "Gandoh (Bhalessa)", "Thathri", "Assar", "Marmat", "Khellani"], 182202),
        ("006", "Ganderbal", "RURAL", 84.2, "TIER_4", "Sindh Valley Fresh Trout Fish & Kashmiri Wicker Willow Baskets", "FISHERIES_HANDICRAFTS", ["Ganderbal", "Kangan", "Lar", "Wakor", "Gund"], 191201),
        ("007", "Jammu", "METROPOLITAN", 50.0, "TIER_1", "R.S. Pura Basmati Rice (G.I.), Jammu Rajma & Precision Metal", "AGRO_ENGINEERING", ["Jammu Urban", "R.S. Pura", "Akhnoor", "Bishnah", "Bahu", "Marh", "Bhalwal", "Khour", "Dansal"], 180001),
        ("008", "Kathua", "SEMI_URBAN", 85.4, "TIER_2", "Basohli Miniature Paintings (G.I.), Pashmina & Industrial Chenab", "HANDICRAFTS_TEXTILES", ["Kathua", "Hiranagar", "Basohli", "Billawar", "Bani", "Barnoti", "Marheen", "Dingha Amb"], 184101),
        ("009", "Kishtwar", "RURAL", 93.0, "TIER_5", "Kishtwar Saffron (Kesar), Sapphire Gemstones & Walnuts", "SPICES_MINERAL", ["Kishtwar", "Paddar (Sapphire Valley)", "Marwah", "Warwan", "Chhatroo", "Nagseni"], 182204),
        ("010", "Kulgam", "RURAL", 81.0, "TIER_4", "Kulgam Apple Grading & Kashmiri Wooden Furniture", "HORTICULTURE_WOOD", ["Kulgam", "Devsar", "DH Pora", "Frisal", "Qaimoh", "Behibagh"], 192231),
        ("011", "Kupwara", "RURAL", 88.0, "TIER_4", "Walnut Shelling / Processing & Kashmiri Red Honey", "NUTS_FOREST", ["Kupwara", "Handwara", "Karnah (Tangdhar)", "Sogam (Lolab)", "Trehgam", "Langate", "Kralpora"], 193222),
        ("012", "Poonch", "RURAL", 91.9, "TIER_5", "Poonch Apple Orchards & Woolen Namdas / Walnut Kernel", "HORTICULTURE_HANDICRAFTS", ["Poonch (Haveli)", "Mandi", "Mendhar", "Surankote", "Balakote"], 185101),
        ("013", "Pulwama", "RURAL", 85.6, "TIER_3", "Pampore Kashmiri Saffron (Kong G.I.) & Almond Processing", "SPICES_NUTS", ["Pulwama", "Pampore", "Tral", "Awantipora", "Litter", "Kakapora", "Shadimarg"], 192301),
        ("014", "Rajouri", "RURAL", 91.9, "TIER_4", "Chikri Wood Craft of Thannamandi (G.I.) & Dairy Mawa", "WOOD_DAIRY", ["Rajouri", "Nowshera", "Sunderbani", "Thannamandi", "Kalakote", "Kotranka (Budhal)", "Darhal", "Manjakote"], 185131),
        ("015", "Ramban", "RURAL", 95.8, "TIER_5", "Anardana (Wild Pomegranate Seeds) & Sulai Honey (G.I.)", "SPICES_HONEY", ["Ramban", "Banihal", "Batote", "Gool", "Ukhral", "Ramsoo"], 182144),
        ("016", "Reasi", "RURAL", 91.4, "TIER_4", "Mata Vaishno Devi Religious Brass Handicrafts & Lithium Auxiliaries", "HANDICRAFTS_MINERAL", ["Reasi", "Katra", "Mahore", "Pouni", "Arnas", "Jirad"], 182311),
        ("017", "Samba", "SEMI_URBAN", 83.2, "TIER_2", "Samba Calico Block Prints & Industrial Pharmaceuticals / Agro", "TEXTILES_PHARMA", ["Samba", "Vijaypur", "Ghagwal", "Ramgarh", "Purmandal", "Bari Brahmana"], 184121),
        ("018", "Shopian", "RURAL", 93.9, "TIER_4", "Shopian Grade-A Delicious Apples (Apple Bowl) & Walnuts", "HORTICULTURE", ["Shopian", "Zainapora", "Keller", "Imamsahib", "Hermain"], 192303),
        ("019", "Srinagar", "METROPOLITAN", 1.7, "TIER_1", "Pashmina Hand-Spun Shawls, Sozni Needlework & Kashmiri Carpets", "HANDLOOM_CARPETS", ["Srinagar North", "Srinagar South", "Eidgah", "Khanyar", "Batmaloo"], 190001),
        ("020", "Udhampur", "SEMI_URBAN", 80.5, "TIER_3", "Kalari Traditional Cheese (G.I.) & Pine Resin / Defence Spares", "DAIRY_FOREST", ["Udhampur", "Ramnagar", "Chenani", "Majalta", "Basantgarh", "Ghordi", "Tikri"], 182101)
    ]
    jk_districts = [format_district(code, name, urb, rur, tier, odop, cat, "Western Himalayan Region (Zone I)", "JKPDD / JPDCL / KPDCL Feeder", blks, [f"{name} Rural", f"{blks[0]} GP"], pin) for code, name, urb, rur, tier, odop, cat, blks, pin in jk_names]
    states.append({"stateCode": "01", "stateName": "Jammu and Kashmir", "territoryType": "UNION_TERRITORY", "totalDistricts": 20, "districts": jk_districts})

    # 8. LADAKH (2)
    ladakh_names = [
        ("009", "Kargil", "RURAL", 89.0, "TIER_5", "Raktsey Karpo Apricot Kernel Oil & Pashmina Wool Processing", "HORTICULTURE_TEXTILES", ["Kargil", "Zanskar", "Drass (Second Coldest Inhabited)", "Sankoo", "Shakar Chiktan", "Taisuru"], 194103),
        ("010", "Leh", "RURAL", 76.0, "TIER_4", "Ladakhi Sea Buckthorn (Leh Berry G.I.) & Changthangi Pashmina Raw Fiber", "AGRO_HANDLOOM", ["Leh", "Nubra (Diskit)", "Khaltsi", "Nyoma (Changthang)", "Durbuk", "Kharu", "Saspol"], 194101)
    ]
    ladakh_districts = [format_district(code, name, urb, rur, tier, odop, cat, "Western Himalayan Region (Zone I)", "Ladakh Power Development Dept Solar-Microhydel Grid", blks, [f"{name} Rural", f"{blks[0]} GP"], pin) for code, name, urb, rur, tier, odop, cat, blks, pin in ladakh_names]
    states.append({"stateCode": "37", "stateName": "Ladakh", "territoryType": "UNION_TERRITORY", "totalDistricts": 2, "districts": ladakh_districts})

    # 9. DELHI (11)
    delhi_names = [
        ("085", "Central Delhi", "METROPOLITAN", 0.0, "TIER_1", "Garment Wholesaling, Readymade Apparel & Electricals", "APPAREL_ELECTRICAL", ["Kotwali", "Civil Lines", "Karol Bagh"], 110005),
        ("086", "East Delhi", "METROPOLITAN", 0.0, "TIER_1", "Readymade Garments & Light Plastic Molded Goods", "TEXTILES_PLASTICS", ["Gandhi Nagar", "Preet Vihar", "Mayur Vihar"], 110092),
        ("087", "New Delhi", "METROPOLITAN", 0.0, "TIER_1", "Handicraft Emporiums, IT Services & Professional Tech", "HANDICRAFTS_IT", ["Chanakyapuri", "Connaught Place", "Vasant Vihar"], 110001),
        ("088", "North Delhi", "METROPOLITAN", 2.0, "TIER_1", "Stainless Steel Utensils & Plastic Polymer Molding", "STEEL_PLASTICS", ["Alipur", "Narela", "Model Town"], 110040),
        ("089", "North East Delhi", "METROPOLITAN", 0.0, "TIER_1", "Auto Fasteners, Readymade Garments & Hardware", "ENGINEERING_TEXTILES", ["Seelampur", "Shahdara", "Karawal Nagar"], 110053),
        ("090", "North West Delhi", "METROPOLITAN", 6.0, "TIER_1", "PVC Cable Extrusion & Polyhouse Floriculture Fringe", "PLASTICS_AGRO", ["Kanjhawala", "Saraswati Vihar", "Rohini"], 110081),
        ("091", "Shahdara", "METROPOLITAN", 0.0, "TIER_1", "Die Casting, Light Engineering & Handloom Powerloom", "ENGINEERING_TEXTILES", ["Shahdara", "Seemapuri", "Vivek Vihar"], 110032),
        ("092", "South Delhi", "METROPOLITAN", 0.5, "TIER_1", "Apparel Design Export, Fashion Jewellery & Software", "APPAREL_GEMS", ["Saket", "Hauz Khas", "Mehrauli"], 110017),
        ("093", "South East Delhi", "METROPOLITAN", 0.0, "TIER_1", "Leather Footwear Goods, Printing & Precision Spares", "LEATHER_PRINTING", ["Defence Colony", "Kalkaji", "Sarita Vihar"], 110024),
        ("094", "South West Delhi", "METROPOLITAN", 5.0, "TIER_1", "Aviation Logistics, Precision Fabrication & Mushroom", "LOGISTICS_ENGINEERING", ["Dwarka", "Najafgarh", "Kapashera"], 110075),
        ("095", "West Delhi", "METROPOLITAN", 0.0, "TIER_1", "Packaging Machinery, Paper Box Corrugation & Electronics", "PACKAGING_ENGINEERING", ["Patel Nagar", "Punjabi Bagh", "Rajouri Garden"], 110027)
    ]
    delhi_districts = [format_district(code, name, urb, rur, tier, odop, cat, "Trans-Gangetic Plains Region (Zone VI)", "BSES / TPDDL Metro Priority Grid (24x7)", blks, [f"{name} Zone", f"{blks[0]} Area"], pin) for code, name, urb, rur, tier, odop, cat, blks, pin in delhi_names]
    states.append({"stateCode": "07", "stateName": "Delhi", "territoryType": "UNION_TERRITORY", "totalDistricts": 11, "districts": delhi_districts})

    # 10. CHANDIGARH (1)
    ch_districts = [
        format_district("046", "Chandigarh", "METROPOLITAN", 2.8, "TIER_1", "Precision Tractor Engineering Components & IT Services", "ENGINEERING_IT", "Trans-Gangetic Plains Region (Zone VI)", "Chandigarh Electricity Department 24x7 Smart Grid", ["Chandigarh Urban", "Manimajra"], ["Manimajra Rural", "Daria Village GP", "Behlana Rural"], 160017)
    ]
    states.append({"stateCode": "04", "stateName": "Chandigarh", "territoryType": "UNION_TERRITORY", "totalDistricts": 1, "districts": ch_districts})

    return states
