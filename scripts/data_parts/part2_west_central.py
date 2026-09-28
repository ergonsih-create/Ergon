"""
Part 2: Western & Central India
- Maharashtra (36)
- Gujarat (33)
- Goa (2)
- Dadra and Nagar Haveli and Daman and Diu (3)
- Madhya Pradesh (55)
- Chhattisgarh (33)
Total: 162 districts
"""

def get_west_central_data(format_district):
    states = []

    # 1. MAHARASHTRA (36)
    mh_names = [
        ("460", "Ahmednagar", "RURAL", 79.9, "TIER_2", "Sugarcane Processing, Dairy Products & Shirdi Guava", "AGRO_PROCESSING", ["Ahmednagar", "Rahata", "Sangamner", "Kopargaon", "Shrirampur", "Nevasa", "Shevgaon", "Pathardi", "Parner", "Akole", "Jamkhed", "Karjat", "Shrigonda", "Rahuri"], 414001),
        ("461", "Akola", "SEMI_URBAN", 60.3, "TIER_3", "Raw Cotton Ginning & Pulses / Dal Mill Processing", "AGRO_PROCESSING", ["Akola", "Akot", "Telhara", "Balapur", "Patur", "Murtizapur", "Barshitakli"], 444001),
        ("462", "Amravati", "SEMI_URBAN", 64.1, "TIER_2", "Nagpur Mandarin Oranges & Cotton Textile Spinners", "AGRO_TEXTILES", ["Amravati", "Achalpur", "Chandurbazar", "Morshi", "Warud", "Daryapur", "Anjangaon Surji", "Dharni", "Chikhaldara", "Nandgaon Khandeshwar", "Chandur Railway", "Dhamangaon Railway", "Tiosa", "Bhatkuli"], 444601),
        ("733", "Chhatrapati Sambhajinagar", "SEMI_URBAN", 56.2, "TIER_1", "Himroo Shawls, Paithani Sarees & Automobile Engineering", "TEXTILES_ENGINEERING", ["Aurangabad", "Paithan", "Gangapur", "Vaijapur", "Kannad", "Khuldabad", "Sillod", "Soegaon", "Phulambri"], 431001),
        ("464", "Beed", "RURAL", 80.1, "TIER_3", "Custard Apple (Sitaphal) Pulping & Sugarcane Harvesting Services", "AGRO_PROCESSING", ["Beed", "Georai", "Majalgaon", "Ambejogai", "Kaij", "Parli", "Ashti", "Patoda", "Shirur Kasar", "Wadwani", "Dharur"], 431122),
        ("465", "Bhandara", "RURAL", 80.5, "TIER_4", "Brass Metal Utensils & Chinnor Aromatic Rice Processing", "HANDICRAFTS_AGRO", ["Bhandara", "Tumsar", "Mohadi", "Pauni", "Sakoli", "Lakhani", "Lakhandur"], 441904),
        ("466", "Buldhana", "RURAL", 78.8, "TIER_3", "Soyabean Oil Crushing & Lonar Guava / Citrus Processing", "AGRO_PROCESSING", ["Buldhana", "Chikhli", "Deolgaon Raja", "Jalgaon Jamod", "Khamgaon", "Malkapur", "Mehkar", "Motala", "Nandura", "Sangrampur", "Shegaon", "Sindkhed Raja"], 443001),
        ("467", "Chandrapur", "SEMI_URBAN", 64.8, "TIER_3", "Coal Energy, Cement Minerals & Bamboo Furniture", "MINERAL_FOREST", ["Chandrapur", "Ballarpur", "Bhadravati", "Warora", "Chimur", "Nagbhid", "Bramhapuri", "Sindewahi", "Mul", "Pombhurna", "Gondpipri", "Korpurna", "Rajura", "Jiwati", "Sawali"], 442401),
        ("468", "Dhule", "RURAL", 72.2, "TIER_3", "Chilli Powder Processing & Groundnut Oil Expelling", "AGRO_PROCESSING", ["Dhule", "Sakri", "Shirpur", "Sindkheda"], 424001),
        ("469", "Gadchiroli", "RURAL", 89.0, "TIER_5", "Tussar Silk Weaving & Forest Minor Produce (Mahua/Tendu)", "SERICULTURE_FOREST", ["Gadchiroli", "Armori", "Chamorshi", "Dhanora", "Kurkheda", "Korchi", "Desaiganj", "Aheri", "Etapalli", "Bhamragad", "Sironcha", "Mulchera"], 442605),
        ("470", "Gondia", "RURAL", 82.9, "TIER_4", "Rice Milling & Forest Lac / Tendu Leaf Processing", "AGRO_FOREST", ["Gondia", "Tirora", "Goregaon", "Arjuni Morgaon", "Deori", "Amgaon", "Salekasa", "Sadak Arjuni"], 441601),
        ("471", "Hingoli", "RURAL", 84.8, "TIER_4", "Turmeric Processing & Soyabean Value Addition", "AGRO_PROCESSING", ["Hingoli", "Kalamnuri", "Basmath", "Aundha Nagnath", "Sengaon"], 431513),
        ("472", "Jalgaon", "SEMI_URBAN", 68.3, "TIER_2", "Jalgaon Banana Pulp & Drip Irrigation Equipment Manufacturing", "AGRO_ENGINEERING", ["Jalgaon", "Bhusawal", "Chalisgaon", "Jamner", "Pachora", "Raver", "Yawal", "Erandol", "Dharangaon", "Amalner", "Parola", "Chopda", "Muktainagar", "Bodwad", "Bhadgaon"], 425001),
        ("473", "Jalna", "RURAL", 80.7, "TIER_3", "Sweet Orange (Mosambi) Processing & Steel Re-rolling", "AGRO_MINERAL", ["Jalna", "Ambad", "Bhokardan", "Jafrabad", "Partur", "Ghansawangi", "Mantha", "Badnapur"], 431203),
        ("474", "Kolhapur", "SEMI_URBAN", 68.3, "TIER_2", "Kolhapuri Leather Chappals, Jaggery & Foundry Castings", "LEATHER_AGRO", ["Karvir", "Kagal", "Hatkanangle", "Shirol", "Panhala", "Shahuwadi", "Radhanagari", "Gaganbawda", "Bhudargad", "Ajara", "Gadhinglaj", "Chandgad"], 416003),
        ("475", "Latur", "SEMI_URBAN", 74.5, "TIER_2", "Soyabean Oil Mills, Pulse Processing & Coach Factory Spares", "AGRO_ENGINEERING", ["Latur", "Ausa", "Nilanga", "Udgir", "Ahmedpur", "Chakur", "Renapur", "Deoni", "Shirur Anantpal", "Jalkot"], 413512),
        ("476", "Mumbai City", "METROPOLITAN", 0.0, "TIER_1", "Financial Technology, Gems & Jewellery & Port Logistics", "FINTECH_GEMS", ["Mumbai Colaba", "Mumbai Fort", "Mumbai Dadar"], 400001),
        ("477", "Mumbai Suburban", "METROPOLITAN", 0.0, "TIER_1", "Information Technology, Media & Light Precision Engineering", "IT_MEDIA", ["Andheri", "Borivali", "Kurla"], 400051),
        ("478", "Nagpur", "METROPOLITAN", 31.7, "TIER_1", "Nagpur Oranges (G.I.), Defence Aerostructures & IT Services", "AGRO_AEROSPACE", ["Nagpur Urban", "Nagpur Rural", "Kamptee", "Hingna", "Katol", "Narkhed", "Savner", "Kalameshwar", "Ramtek", "Parseoni", "Mouda", "Umred", "Kuhi", "Bhiwapur"], 440001),
        ("479", "Nanded", "SEMI_URBAN", 72.8, "TIER_3", "Turmeric Processing & Cotton Ginning / Seed Crushing", "AGRO_PROCESSING", ["Nanded", "Biloli", "Mukhed", "Kandhar", "Loha", "Hadgaon", "Bhokar", "Deglur", "Kinwat", "Mudkhed", "Himayatnagar", "Mahoor", "Umri", "Naigaon", "Dharmabad", "Ardhapur"], 431601),
        ("480", "Nandurbar", "RURAL", 83.3, "TIER_5", "Red Chilli Powder & Tribal Mahua Flower / Bamboo Products", "AGRO_FOREST", ["Nandurbar", "Navapur", "Shahada", "Taloda", "Akkalkuwa", "Akrani (Dhadgaon)"], 425412),
        ("481", "Nashik", "SEMI_URBAN", 57.5, "TIER_1", "Nashik Valley Wine Grapes, Fresh Onions & Auto Ancillaries", "AGRO_ENGINEERING", ["Nashik", "Niphad", "Sinnar", "Dindori", "Igatpuri", "Trimbakeshwar", "Kalwan", "Baglan (Satana)", "Malegaon", "Chandwad", "Deola", "Surgana", "Peth", "Yeola"], 422001),
        ("734", "Dharashiv", "RURAL", 83.0, "TIER_4", "Osmanabadi Goat Meat / Dairy & Solar Power Equipment", "LIVESTOCK_SOLAR", ["Osmanabad", "Tuljapur", "Omerga", "Lohara", "Kalamb", "Bhoom", "Paranda", "Washi"], 413501),
        ("483", "Palghar", "SEMI_URBAN", 52.0, "TIER_2", "Dahanu Gholvad Chikoo (Sapodilla) & Warli Tribal Paintings", "AGRO_HANDICRAFTS", ["Palghar", "Dahanu", "Talasari", "Jawhar", "Mokhada", "Vada", "Vikramgad", "Vasai"], 401404),
        ("484", "Parbhani", "RURAL", 69.0, "TIER_3", "Soyabean Oil Expelling & Cotton Ginning / Tur Processing", "AGRO_PROCESSING", ["Parbhani", "Gangakhed", "Pathri", "Jintur", "Manwath", "Palam", "Purna", "Sailu", "Sonpeth"], 431401),
        ("485", "Pune", "METROPOLITAN", 39.1, "TIER_1", "Automotive Assembly, IT Solutions & Junnar Floriculture", "AUTO_IT_AGRO", ["Haveli (Pune)", "Khed", "Ambegaon", "Junnar", "Shirur", "Daund", "Indapur", "Baramati", "Purandar", "Bhor", "Velhe", "Mulshi", "Maval"], 411001),
        ("486", "Raigad", "SEMI_URBAN", 63.2, "TIER_2", "Alphonso Mango & Marine Fisheries / Coastal Salt", "AGRO_FISHERIES", ["Alibag", "Pen", "Panvel", "Uran", "Karjat", "Khalapur", "Mangaon", "Roha", "Sudhagad", "Tala", "Mahad", "Poladpur", "Shrivardhan", "Mhasla", "Murud"], 402201),
        ("487", "Ratnagiri", "RURAL", 83.7, "TIER_3", "Ratnagiri Alphonso Mango Pulp & Marine Fish Freezing", "AGRO_FISHERIES", ["Ratnagiri", "Chiplun", "Khed", "Guhagar", "Dapoli", "Mandangad", "Sangameshwar", "Lanja", "Rajapur"], 415612),
        ("488", "Sangli", "SEMI_URBAN", 74.5, "TIER_2", "Sangli Turmeric Powders, Raisin Processing & Sugar Mills", "AGRO_PROCESSING", ["Miraj (Sangli)", "Tasgaon", "Khanapur (Vita)", "Atpadi", "Jat", "Kavathe Mahankal", "Walwa (Islampur)", "Shirala", "Kadegaon", "Palus"], 416416),
        ("489", "Satara", "RURAL", 81.0, "TIER_2", "Mahabaleshwar Strawberries & Satara Ginger / Kandepuri", "HORTICULTURE_AGRO", ["Satara", "Karad", "Wai", "Mahabaleshwar", "Patan", "Jaoli", "Koregaon", "Khatav", "Man", "Phaltan", "Khandala"], 415001),
        ("490", "Sindhudurg", "RURAL", 87.4, "TIER_4", "Sindhudurg Cashew Processing & Kokum Fruit Products", "AGRO_PROCESSING", ["Kudal", "Sawantwadi", "Malvan", "Vengurla", "Kankavli", "Devgad", "Vaibhavwadi", "Dodamarg"], 416510),
        ("491", "Solapur", "SEMI_URBAN", 67.6, "TIER_2", "Solapur Jacquard Chaddars / Towels & Pomegranate", "TEXTILES_AGRO", ["Solapur North", "Solapur South", "Barshi", "Akkalkot", "Mohol", "Pandharpur", "Madha", "Karmala", "Sangola", "Malshiras", "Mangalwedha"], 413001),
        ("492", "Thane", "METROPOLITAN", 23.1, "TIER_1", "Chemical Formulation, Precision Plastics & Warehousing", "CHEMICALS_LOGISTICS", ["Thane", "Kalyan", "Murbad", "Bhiwandi", "Shahapur"], 400601),
        ("493", "Wardha", "RURAL", 67.5, "TIER_3", "Sewagram Khadi Handspinning & Wardha Cotton Ginning", "HANDLOOM_AGRO", ["Wardha", "Deoli", "Seloo", "Arvi", "Ashti", "Karanja", "Hinganghat", "Samudrapur"], 442001),
        ("494", "Washim", "RURAL", 82.3, "TIER_4", "Soyabean Crushing & Tur Dal Milling / Organic Cotton", "AGRO_PROCESSING", ["Washim", "Risod", "Malegaon", "Mangrulpir", "Karanja", "Manora"], 444505),
        ("495", "Yavatmal", "RURAL", 78.4, "TIER_3", "Raw Cotton Baling, Wood Carving & Soyabean Oil Mills", "AGRO_PROCESSING", ["Yavatmal", "Pusad", "Umarkhed", "Digras", "Darwha", "Arni", "Ghatanji", "Kelapur (Pandharkawada)", "Ralegaon", "Kalamb", "Babhulgaon", "Wani", "Maregaon", "Zari Jamani", "Ner", "Mahagaon"], 445001)
    ]
    mh_districts = [format_district(code, name, urb, rur, tier, odop, cat, "Western Plateau and Hills Region (Zone IX)", "MSEDCL Agro / Industrial Feeder", blks, [f"{name} Rural", f"{blks[0]} GP"], pin) for code, name, urb, rur, tier, odop, cat, blks, pin in mh_names]
    states.append({"stateCode": "27", "stateName": "Maharashtra", "territoryType": "STATE", "totalDistricts": 36, "districts": mh_districts})

    # 2. GUJARAT (33)
    gj_names = [
        ("438", "Ahmedabad", "METROPOLITAN", 16.0, "TIER_1", "Cotton Denim Fabrics, Pharmaceutical Formulations & IT", "TEXTILES_PHARMA", ["Ahmedabad City", "Daskroi", "Sanand", "Bavla", "Dholka", "Dhandhuka", "Viramgam", "Mandal", "Detroj-Rampura"], 380001),
        ("439", "Amreli", "RURAL", 74.4, "TIER_3", "Groundnut Oil Expelling & Sesame Seed Cleaning", "AGRO_PROCESSING", ["Amreli", "Babra", "Dhari", "Khambha", "Kunkavav Vadia", "Lathi", "Lilia", "Rajula", "Savarkundla", "Jafrabad", "Bagasara"], 365601),
        ("440", "Anand", "SEMI_URBAN", 69.7, "TIER_2", "Amul Cooperative Dairy Products & Banana Processing", "DAIRY_AGRO", ["Anand", "Anklav", "Borsad", "Khambhat", "Petlad", "Sojitra", "Tarapur", "Umreth"], 388001),
        ("441", "Aravalli", "RURAL", 88.0, "TIER_4", "Modasa Groundnut & Potato Cold Storage / Seed Potato", "AGRO_PROCESSING", ["Modasa", "Bayad", "Bhiloda", "Dhansura", "Malpur", "Meghraj"], 383315),
        ("442", "Banaskantha", "RURAL", 86.7, "TIER_3", "Deesa Potatoes, Pomegranate (Bhagwa) & Banas Dairy", "AGRO_DAIRY", ["Palanpur", "Deesa", "Dhanera", "Danta", "Vadgam", "Kankrej", "Deodar", "Bhabhar", "Tharad", "Vav", "Lakhani", "Suigam", "Amirgadh"], 385001),
        ("443", "Bharuch", "SEMI_URBAN", 66.1, "TIER_2", "Dahej Chemical Formulations & Cotton Ginning / Salt", "CHEMICALS_AGRO", ["Bharuch", "Ankleshwar", "Jambusar", "Hansot", "Amod", "Vagra", "Jhagadia", "Valia", "Netrang"], 392001),
        ("444", "Bhavnagar", "SEMI_URBAN", 59.2, "TIER_2", "Dehydrated Onions & Garlic / Alang Ship Breaking Castings", "AGRO_ENGINEERING", ["Bhavnagar", "Sihor", "Palitana", "Talaja", "Mahuva", "Gariadhar", "Umrala", "Vallabhipur", "Ghogha", "Jesar"], 364001),
        ("445", "Botad", "RURAL", 67.8, "TIER_4", "Cotton Baling & Gadhada Guava / Diamond Polishing", "AGRO_GEMS", ["Botad", "Gadhada", "Barwala", "Ranpur"], 364710),
        ("446", "Chhotaudepur", "RURAL", 93.5, "TIER_5", "Pithora Tribal Paintings & Dolomite Mineral Processing", "HANDICRAFTS_MINERAL", ["Chhotaudepur", "Bodeli", "Jetpur Pavi", "Kavant", "Nasvadi", "Sankheda"], 391165),
        ("447", "Dahod", "RURAL", 91.0, "TIER_4", "Tribal Lac Bangle Craft & Maize Starch Processing", "HANDICRAFTS_AGRO", ["Dahod", "Jhalod", "Devgadh Baria", "Garbada", "Limkheda", "Fatepura", "Dhanpur", "Sanjeli", "Singvad"], 389151),
        ("448", "Dang", "RURAL", 89.2, "TIER_6", "Nagali (Ragi / Finger Millet) Processing & Bamboo Crafts", "AGRO_FOREST", ["Ahwa", "Waghai", "Subir"], 394710),
        ("449", "Devbhumi Dwarka", "RURAL", 72.8, "TIER_3", "Bauxite Calcining & Marine Fisheries / Groundnut", "MINERAL_FISHERIES", ["Khambhalia", "Dwarka", "Kalyanpur", "Bhanvad"], 361305),
        ("450", "Gandhinagar", "SEMI_URBAN", 56.9, "TIER_2", "GIFT City FinTech, Kalol Petro-Equipment & Guava", "FINTECH_AGRO", ["Gandhinagar", "Kalol", "Dehgam", "Mansa"], 382010),
        ("451", "Gir Somnath", "RURAL", 72.4, "TIER_3", "Gir Kesar Mango & Veraval Marine Seafood Processing", "HORTICULTURE_FISHERIES", ["Veraval", "Talala", "Sutrapada", "Kodhinar", "Una", "Gir Gadhada"], 362265),
        ("452", "Jamnagar", "SEMI_URBAN", 55.0, "TIER_2", "Brass Precision Parts, Petroleum Refining & Bandhani Tie-Dye", "ENGINEERING_TEXTILES", ["Jamnagar", "Lalpur", "Kalavad", "Jamjodhpur", "Jodiya", "Dhrol"], 361001),
        ("453", "Junagadh", "SEMI_URBAN", 71.0, "TIER_3", "Gir Kesar Mango, Groundnut Oil & Sesame Seeds", "AGRO_PROCESSING", ["Junagadh", "Keshod", "Malia Hatina", "Manavadar", "Mangrol", "Mendarda", "Visavadar", "Vanthali", "Bhesan"], 362001),
        ("454", "Kheda", "RURAL", 77.2, "TIER_3", "Nadiad Snacks / Farsan & Tobacco Curing / Rice Milling", "FOOD_AGRO", ["Nadiad", "Kheda", "Kapadvanj", "Kathlal", "Mahudha", "Matar", "Mehmedabad", "Thasra", "Galteshwar", "Vaso"], 387001),
        ("455", "Kutch", "RURAL", 65.2, "TIER_2", "Kutch Ajrakh Block Prints, Rogan Art & Salt Harvesting", "HANDICRAFTS_MINERAL", ["Bhuj", "Anjar", "Gandhidham", "Mundra", "Mandvi", "Nakhatrana", "Abdasa", "Lakhpat", "Rapar", "Bhachau"], 370001),
        ("456", "Mahisagar", "RURAL", 91.0, "TIER_4", "Groundnut Oil Expelling & Maize Processing", "AGRO_PROCESSING", ["Lunawada", "Santrampur", "Balasinor", "Kadana", "Khanpur", "Virpur"], 389230),
        ("457", "Mehsana", "SEMI_URBAN", 74.7, "TIER_2", "Cumin & Fennel (Jeera / Saunf) Spice Mandi & Dudhsagar Dairy", "SPICES_DAIRY", ["Mehsana", "Kadi", "Unjha", "Visnagar", "Vadnagar", "Kheralu", "Satlasana", "Vijapur", "Becharaji", "Jotana"], 384001),
        ("458", "Morbi", "SEMI_URBAN", 48.0, "TIER_2", "Ceramic Vitrified Tiles, Wall Clocks & Paper Mills", "CERAMICS_ENGINEERING", ["Morbi", "Wankaner", "Halvad", "Tankara", "Maliya"], 363641),
        ("459", "Narmada", "RURAL", 89.5, "TIER_5", "Banana Fibre Products & Tribal Eco-Tourism / Bamboo", "AGRO_ECOTOURISM", ["Rajpipla (Nandod)", "Dediyapada", "Tilakwada", "Garudeshwar", "Sagbara"], 393145),
        ("436", "Navsari", "SEMI_URBAN", 50.8, "TIER_2", "Chikoo Value Addition, Diamond Cutting & Sugar Mills", "AGRO_GEMS", ["Navsari", "Jalalpore", "Gandevi", "Chikhli", "Vansda", "Khergam"], 396445),
        ("437", "Panchmahal", "RURAL", 86.0, "TIER_3", "Halol Automotive Ancillaries & Godhra Maize Processing", "ENGINEERING_AGRO", ["Godhra", "Halol", "Kalol", "Ghoghamba", "Shehera", "Morwa Hadaf", "Jambughoda"], 389001),
        ("435", "Patan", "RURAL", 79.1, "TIER_3", "Patan Double Ikat Patola Silk Sarees & Solar Power Equipment", "HANDLOOM_SOLAR", ["Patan", "Sidhpur", "Chanasma", "Harij", "Sami", "Radhanpur", "Santalpur", "Saraswati", "Shankheshwar"], 384265),
        ("434", "Porbandar", "SEMI_URBAN", 51.2, "TIER_3", "Marine Seafood Freezing & Soda Ash / Limestone Extraction", "FISHERIES_CHEMICALS", ["Porbandar", "Ranavav", "Kutiyana"], 360575),
        ("433", "Rajkot", "METROPOLITAN", 41.8, "TIER_1", "Diesel Engines, CNC Machine Tools & Silver Ornaments", "ENGINEERING_GEMS", ["Rajkot", "Gondal", "Jetpur", "Jasdan", "Dhoraji", "Upleta", "Kotda Sangani", "Lodhika", "Paddhari", "Vinchhiya", "Jamkandorna"], 360001),
        ("432", "Sabarkantha", "RURAL", 85.0, "TIER_3", "Himatnagar Ceramic Sanitaryware & Sabar Dairy Milk Products", "CERAMICS_DAIRY", ["Himatnagar", "Idar", "Khedbrahma", "Prantij", "Talod", "Vadali", "Poshina", "Vijaynagar"], 383001),
        ("431", "Surat", "METROPOLITAN", 20.3, "TIER_1", "Diamond Cutting / Polishing, Synthetic Silk Fabrics & Zari", "GEMS_TEXTILES", ["Surat City", "Chorasi", "Olpad", "Kamrej", "Bardoli", "Mahuva", "Mandvi", "Mangrol", "Umarpada", "Palsana"], 395001),
        ("430", "Surendranagar", "RURAL", 71.7, "TIER_3", "Ceramic Glaze Frits, Cotton Baling & Salt Pan Crystallization", "CERAMICS_AGRO", ["Wadhwan", "Surendranagar", "Dhrangadhra", "Halvad", "Limbdi", "Chotila", "Sayla", "Muli", "Dasada (Patdi)", "Chuda", "Thangadh"], 363001),
        ("429", "Tapi", "RURAL", 90.1, "TIER_5", "Papaya Processing & Tribal Bamboo Craft / Sugar Mills", "AGRO_HANDICRAFTS", ["Vyara", "Songadh", "Valod", "Nizar", "Uchchhal", "Kukarmunda", "Dolvan"], 394650),
        ("428", "Vadodara", "METROPOLITAN", 50.4, "TIER_1", "Heavy Electrical Engineering (Transformers) & Petrochemicals", "ENGINEERING_CHEMICALS", ["Vadodara", "Padra", "Karjan", "Dabhoi", "Waghodia", "Savli", "Desar", "Sinor"], 390001),
        ("427", "Valsad", "SEMI_URBAN", 62.7, "TIER_2", "Valsad Alphonso Mango Pulp & Chemical / Paper Packaging", "AGRO_PACKAGING", ["Valsad", "Pardi", "Vapi", "Umbergaon", "Dharampur", "Kaprada"], 396001)
    ]
    gj_districts = [format_district(code, name, urb, rur, tier, odop, cat, "Gujarat Plains and Hills Region (Zone XIII)", "UGVCL / DGVCL / PGVCL / MGVCL Feeder", blks, [f"{name} Rural", f"{blks[0]} GP"], pin) for code, name, urb, rur, tier, odop, cat, blks, pin in gj_names]
    states.append({"stateCode": "24", "stateName": "Gujarat", "territoryType": "STATE", "totalDistricts": 33, "districts": gj_districts})

    # 3. GOA (2)
    goa_names = [
        ("551", "North Goa", "SEMI_URBAN", 39.9, "TIER_2", "Cashew Feni Distillation & Marine Fish Processing / Hospitality", "AGRO_FISHERIES", ["Tiswadi (Panaji)", "Bardez (Mapusa)", "Pernem", "Bicholim", "Sattari (Valpoi)"], 403001),
        ("552", "South Goa", "SEMI_URBAN", 35.6, "TIER_2", "Coconut Jaggery, Marine Fisheries & Handicrafts (Coir/Brate)", "AGRO_FISHERIES", ["Salcete (Margao)", "Mormugao (Vasco)", "Ponda", "Quepem", "Sanguem", "Canacona", "Dharbandora"], 403601)
    ]
    goa_districts = [format_district(code, name, urb, rur, tier, odop, cat, "West Coast Plains and Ghats Region (Zone XII)", "Goa Electricity Department Feeder", blks, [f"{name} Rural", f"{blks[0]} GP"], pin) for code, name, urb, rur, tier, odop, cat, blks, pin in goa_names]
    states.append({"stateCode": "30", "stateName": "Goa", "territoryType": "STATE", "totalDistricts": 2, "districts": goa_districts})

    # 4. DADRA AND NAGAR HAVELI AND DAMAN AND DIU (3)
    dnh_names = [
        ("463", "Dadra and Nagar Haveli", "SEMI_URBAN", 53.3, "TIER_3", "Textile Weaving, Plastic Extrusion & Warli Folk Art", "TEXTILES_HANDICRAFTS", ["Silvassa", "Khanvel"], 396230),
        ("464", "Daman", "URBAN", 18.0, "TIER_2", "Precision Engineering Plastics & Marine Fish Cold Chain", "ENGINEERING_FISHERIES", ["Daman"], 396210),
        ("465", "Diu", "SEMI_URBAN", 48.0, "TIER_3", "Marine Seafood Drying & Tourism Handicrafts", "FISHERIES_HANDICRAFTS", ["Diu"], 362520)
    ]
    dnh_districts = [format_district(code, name, urb, rur, tier, odop, cat, "Gujarat Plains and Hills Region (Zone XIII)", "DNH Power Distribution Feeder", blks, [f"{name} Rural", f"{blks[0]} GP"], pin) for code, name, urb, rur, tier, odop, cat, blks, pin in dnh_names]
    states.append({"stateCode": "26", "stateName": "Dadra and Nagar Haveli and Daman and Diu", "territoryType": "UNION_TERRITORY", "totalDistricts": 3, "districts": dnh_districts})

    # 5. MADHYA PRADESH (55)
    mp_names = [
        ("390", "Agar Malwa", "RURAL", 79.5, "TIER_4", "Orange Juice Pulping & Red Chilli Processing", "AGRO_PROCESSING", ["Agar", "Badod", "Susner", "Nalkheda"], 465441),
        ("391", "Alirajpur", "RURAL", 92.2, "TIER_5", "Noorjahan Mango Cultivation & Bhil Pithora Art / Mahua", "HORTICULTURE_CRAFT", ["Alirajpur", "Jobat", "Sondwa", "Bhabra", "Katthiwada", "Udaygarh"], 457887),
        ("392", "Anuppur", "RURAL", 71.8, "TIER_4", "Kodo-Kutki Minor Millets & Thermal Power Coal Machinery", "AGRO_MINERAL", ["Anuppur", "Kotma", "Jaithari", "Pushprajgarh (Amarkantak)"], 484224),
        ("393", "Ashoknagar", "RURAL", 82.0, "TIER_4", "Chanderi Silk Sarees & Sharbati Wheat Flour Milling", "HANDLOOM_AGRO", ["Ashoknagar", "Chanderi", "Isagarh", "Mungawali", "Shadora"], 473331),
        ("394", "Balaghat", "RURAL", 85.6, "TIER_4", "Balaghat Chinnor Rice (G.I.) & Manganese Ore Processing", "AGRO_MINERAL", ["Balaghat", "Waraseoni", "Baihar", "Katangi", "Lalburra", "Lanji", "Paraswada", "Khairlanji", "Tirodi", "Birsa"], 481001),
        ("395", "Barwani", "RURAL", 85.3, "TIER_4", "Ginger Processing & Nimar Raw Cotton Baling", "AGRO_PROCESSING", ["Barwani", "Sendhwa", "Pansemal", "Rajpur", "Niwali", "Thikri", "Pati"], 451551),
        ("396", "Betul", "RURAL", 80.4, "TIER_3", "Teak Wood Furniture & Organic Soyabean / Jaggery", "WOOD_AGRO", ["Betul", "Multai", "Amla", "Bhainsdehi", "Shahpur", "Chicholi", "Ghoradongri", "Athner", "Prabhat Pattan", "Bhimpur"], 460001),
        ("397", "Bhind", "RURAL", 74.6, "TIER_3", "Mustard Oil Expelling & Pure Buffalo Milk Mawa / Sweets", "AGRO_DAIRY", ["Bhind", "Ater", "Mehgaon", "Gohad", "Lahar", "Roun", "Mihona"], 477001),
        ("398", "Bhopal", "METROPOLITAN", 19.1, "TIER_1", "Zardozi Hand Embroidery, Heavy Electricals (BHEL) & IT", "HANDICRAFTS_ENGINEERING", ["Bhopal Urban", "Berasia", "Phanda"], 462001),
        ("399", "Burhanpur", "SEMI_URBAN", 65.4, "TIER_3", "Burhanpuri Banana Value Addition & Textile Powerloom Cloth", "AGRO_TEXTILES", ["Burhanpur", "Khaknar", "Nepanagar"], 450331),
        ("400", "Chhatarpur", "RURAL", 77.4, "TIER_3", "Betel Leaf (Paan) & Granite Stone Carving / Khajuraho Tourism", "AGRO_HANDICRAFTS", ["Chhatarpur", "Nowgong", "Rajnagar (Khajuraho)", "Bijawar", "Bada Malhera", "Laundi", "Gaurihar", "Bakswaha"], 471001),
        ("401", "Chhindwara", "RURAL", 75.8, "TIER_3", "Orange Pulp Extraction, Potato Processing & Garlic Powder", "AGRO_PROCESSING", ["Chhindwara", "Sausar", "Pandhurna", "Parasia", "Amarwara", "Chourai", "Jamai", "Tamia", "Harrai", "Mohkhed", "Bichhua"], 480001),
        ("402", "Damoh", "RURAL", 80.2, "TIER_4", "Gram (Chana Dal) Processing & Brass Utensils", "AGRO_HANDICRAFTS", ["Damoh", "Hatta", "Patharia", "Batiyagarh", "Jabera", "Patera", "Tendukheda"], 470661),
        ("403", "Datia", "RURAL", 76.8, "TIER_4", "Sugarcane Jaggery & Peetambara Peeth Religious Brassware", "AGRO_HANDICRAFTS", ["Datia", "Seondha", "Bhander", "Indergarh"], 475661),
        ("404", "Dewas", "SEMI_URBAN", 71.3, "TIER_2", "Soyabean Oil Processing, Bank Note Printing Auxiliaries & Auto", "AGRO_ENGINEERING", ["Dewas", "Sonkatch", "Bagli", "Kannod", "Khategaon", "Tonk Khurd"], 455001),
        ("405", "Dhar", "RURAL", 81.1, "TIER_3", "Bagh Hand Block Print Textiles & Pithampur Auto Cluster", "TEXTILES_ENGINEERING", ["Dhar", "Badnawar", "Sardarpur", "Kukshi", "Manawar", "Gandhwani", "Dharampuri", "Nisarpur", "Tirla", "Dahi", "Nalchha", "Bagh", "Umarban"], 454001),
        ("406", "Dindori", "RURAL", 95.4, "TIER_6", "Baiga Tribal Kodo-Kutki Millets & Gond Tribal Painting", "AGRO_HANDICRAFTS", ["Dindori", "Shahpura", "Mehandwani", "Samnapur", "Bajag", "Karanjiya", "Amapur"], 481880),
        ("407", "Guna", "RURAL", 75.0, "TIER_3", "Coriander (Dhaniya) Seed Processing & Fertilizer Auxiliaries", "AGRO_PROCESSING", ["Guna", "Raghogarh", "Chachoura", "Kumbhraj", "Aron", "Bamori"], 473001),
        ("408", "Gwalior", "METROPOLITAN", 37.3, "TIER_1", "Sandstone Carvings, Textile Suiting & Defence Battery Spares", "HANDICRAFTS_ENGINEERING", ["Gwalior", "Dabra", "Bhitarwar", "Morar", "Ghatigaon"], 474001),
        ("409", "Harda", "RURAL", 79.3, "TIER_4", "Sharbati Wheat Processing & High-Yield Soyabean Seed", "AGRO_PROCESSING", ["Harda", "Khirkiya", "Timarni", "Handia", "Sirali"], 461331),
        ("410", "Narmadapuram", "RURAL", 68.6, "TIER_3", "Teak Wood Craft, Soyabean Extraction & Silk Weaving", "WOOD_AGRO", ["Hoshangabad", "Itarsi", "Pipariya", "Sohagpur", "Babai", "Seoni Malwa", "Bankhedi"], 461001),
        ("411", "Indore", "METROPOLITAN", 25.9, "TIER_1", "Readymade Garments, Namkeen Confectionery, Pharma & IT", "TEXTILES_FOOD_PHARMA", ["Indore Urban", "Indore Rural", "Mhow (Dr. Ambedkar Nagar)", "Sanwer", "Depalpur", "Hatod"], 452001),
        ("412", "Jabalpur", "METROPOLITAN", 41.5, "TIER_1", "Green Pea (Matar) Freezing, Readymade Garments & Defence Ordnance", "AGRO_TEXTILES", ["Jabalpur", "Panagar", "Sihora", "Patan", "Shahpura", "Kundam", "Majholi"], 482001),
        ("413", "Jhabua", "RURAL", 91.0, "TIER_5", "Kadaknath Black Chicken Meat & Bhil Tribal Beadwork / Dolls", "POULTRY_CRAFT", ["Jhabua", "Thandla", "Petlawad", "Ranapur", "Meghnagar", "Rama"], 457661),
        ("414", "Katni", "SEMI_URBAN", 78.8, "TIER_3", "Limestone Calcination, Marble Slabs & Dal Milling", "MINERAL_AGRO", ["Katni", "Murwara", "Vijayraghavgarh", "Bahoriband", "Dheemerkheda", "Rithi", "Badwara", "Barhi"], 483501),
        ("415", "Khandwa", "RURAL", 74.7, "TIER_3", "Nimar Cotton Ginning & Onion Dehydration / Hydro Power Spares", "AGRO_ENGINEERING", ["Khandwa", "Pandhana", "Punasa", "Harsud", "Chhaigaon Makhan", "Baladi", "Khalwa"], 450001),
        ("416", "Khargone", "RURAL", 84.0, "TIER_3", "Maheshwari Handloom Silk Sarees & Bedia Red Chilli Mandi", "HANDLOOM_AGRO", ["Khargone", "Maheshwar", "Barwaha", "Kasrawad", "Bhikangaon", "Segaon", "Gogawan", "Bhagwanpura", "Ziranya"], 451001),
        ("735", "Maihar", "RURAL", 85.0, "TIER_4", "Maihar Musical Instruments & Cement Limestone Processing", "HANDICRAFTS_MINERAL", ["Maihar", "Amarpatan", "Ramnagar"], 485771),
        ("417", "Mandla", "RURAL", 87.5, "TIER_5", "Kodo-Kutki Millets & Gond Tribal Bell Metal (Dhokra) Crafts", "AGRO_HANDICRAFTS", ["Mandla", "Nainpur", "Bichhiya", "Niwas", "Ghughri", "Mohgaon", "Bijadandi", "Narayanganj", "Mawai"], 481661),
        ("418", "Mandsaur", "RURAL", 79.4, "TIER_3", "Garlic (Lahsun) Paste / Flakes & Opium Alkaloids Extraction", "AGRO_PROCESSING", ["Mandsaur", "Malhargarh", "Sitamau", "Garoth", "Bhanpura", "Suwasra", "Daloda"], 458001),
        ("736", "Mauganj", "RURAL", 89.0, "TIER_5", "Tur Dal Milling & Betel Nut (Supari) Wooden Toys", "AGRO_HANDICRAFTS", ["Mauganj", "Hanumana", "Naigarhi"], 486331),
        ("419", "Morena", "SEMI_URBAN", 76.0, "TIER_3", "Morena Gajak (Sesame Jaggery) & Mustard Oil Expelling", "FOOD_AGRO", ["Morena", "Ambah", "Porsa", "Joura", "Sabalgarh", "Kailaras", "PaharGarh"], 476001),
        ("420", "Narsinghpur", "RURAL", 81.1, "TIER_3", "Gadarwara Sugarcane Jaggery & Tur Dal Processing", "AGRO_PROCESSING", ["Narsinghpur", "Gadarwara", "Gotegaon", "Kareli", "Tendukheda"], 487001),
        ("421", "Neemuch", "RURAL", 70.4, "TIER_3", "Ashwagandha / Isabgol Medicinal Herbs & Garlic Processing", "MEDICINAL_AGRO", ["Neemuch", "Jawad", "Manasa", "Singoli", "Jiran"], 458441),
        ("737", "Niwari", "RURAL", 82.0, "TIER_4", "Orchha Heritage Stone Carving & Ginger Value Addition", "HANDICRAFTS_AGRO", ["Niwari", "Orchha", "Prithvipur", "Taricharkalan"], 472442),
        ("738", "Pandhurna", "RURAL", 78.0, "TIER_4", "Mandarin Orange Processing & Cotton Baling", "AGRO_PROCESSING", ["Pandhurna", "Sausar"], 480334),
        ("422", "Panna", "RURAL", 86.7, "TIER_4", "Aonla (Indian Gooseberry) Products & Diamond / Stone Carving", "AGRO_MINERAL", ["Panna", "Ajaigarh", "Gunnor", "Pawai", "Shahnagar", "Devendranagar", "Amanganj"], 488001),
        ("423", "Raisen", "RURAL", 78.0, "TIER_3", "Mandideep Industrial Engineering & Basmati Rice Milling", "ENGINEERING_AGRO", ["Raisen", "Goharganj (Mandideep)", "Bareli", "Begamganj", "Silwani", "Gairatganj", "Udaipura", "Badi"], 464551),
        ("424", "Rajgarh", "RURAL", 81.9, "TIER_4", "Coriander Value Addition & Orange Pulping", "AGRO_PROCESSING", ["Rajgarh", "Biaora", "Narsinghgarh", "Sarangpur", "Khilchipur", "Jirapur", "Pachore"], 465661),
        ("425", "Ratlam", "SEMI_URBAN", 70.1, "TIER_2", "Ratlam Sev Namkeen (G.I.), Gold Ornaments & Garlic Mandi", "FOOD_JEWELLERY", ["Ratlam", "Jaora", "Sailana", "Alot", "Piploda", "Bajna", "Rawti"], 457001),
        ("426", "Rewa", "SEMI_URBAN", 83.9, "TIER_3", "Sundarja Mango Pulp & Rewa Betel Nut (Supari) Art", "AGRO_HANDICRAFTS", ["Rewa", "Gurh", "Mauganj", "Teonthar", "Sirmaur", "Semariya", "Mangawan", "Jawa", "Hanumana", "Raipur Karchuliyan"], 486001),
        ("427", "Sagar", "SEMI_URBAN", 70.2, "TIER_2", "Sagar Chana Dal Processing & Agarbatti / Bidi Handrolling", "AGRO_HANDICRAFTS", ["Sagar", "Bina", "Khurai", "Rahatgarh", "Banda", "Rehli", "Deori", "Shahgarh", "Malthone", "Jaisinagar"], 470001),
        ("428", "Satna", "SEMI_URBAN", 78.7, "TIER_2", "Satna Cement Raw Material Auxiliaries & Flour Milling", "MINERAL_AGRO", ["Satna", "Nagod", "Raghurajnagar", "Uchehara", "Rampur Baghelan", "Kothi", "Birsinghpur", "Majhgawan"], 485001),
        ("429", "Sehore", "RURAL", 81.1, "TIER_3", "Sharbati Wheat Processing & Wooden Lacquer Toys of Budhni", "AGRO_TOYS", ["Sehore", "Ashta", "Ichhawar", "Budhni", "Nasrullaganj (Bhairunda)", "Shyampur", "Rehti"], 466001),
        ("430", "Seoni", "RURAL", 88.1, "TIER_4", "Jeeraphool Aromatic Rice Milling & Teak Wood Carpentry", "AGRO_WOOD", ["Seoni", "Barghat", "Lakhnadon", "Keolari", "Chhapara", "Ghansore", "Kurai", "Dhanora"], 480661),
        ("431", "Shahdol", "RURAL", 79.4, "TIER_3", "Mahua Flower Products & Paper Mills / Coal Auxiliaries", "FOREST_AGRO", ["Shahdol (Sohagpur)", "Beohari", "Jaisinghnagar", "Gohparu", "Jaitpur", "Burhar"], 484001),
        ("432", "Shajapur", "RURAL", 80.7, "TIER_4", "Fresh Onion Flakes / Dehydration & Soyabean Oil Mills", "AGRO_PROCESSING", ["Shajapur", "Shujalpur", "Kalapipal", "Mohan Barodia", "Polay Kalan"], 465001),
        ("433", "Sheopur", "RURAL", 84.4, "TIER_5", "Guava Value Addition & Traditional Wooden Pipes / Toys", "AGRO_HANDICRAFTS", ["Sheopur", "Vijaypur", "Karahal", "Badoda", "Beerpur"], 476337),
        ("434", "Shivpuri", "RURAL", 82.9, "TIER_3", "Groundnut Oil Expelling & Chanderi Border Weaving / Stone", "AGRO_HANDLOOM", ["Shivpuri", "Kolaras", "Karera", "Pohari", "Pichhore", "Narwar", "Badarwas", "Khaniyadhana"], 473551),
        ("435", "Sidhi", "RURAL", 91.6, "TIER_5", "Kodo-Kutki Millets & Handwoven Panja Dhurries", "AGRO_HANDLOOM", ["Sidhi", "Gopadbanas", "Churhat", "Rampur Naikin", "Majhauli", "Kusmi", "Sihawal"], 486661),
        ("436", "Singrauli", "SEMI_URBAN", 80.7, "TIER_3", "Thermal Power Machinery Spares & Coal Byproducts", "ENGINEERING_MINERAL", ["Waidhan (Singrauli)", "Deosar", "Chitrangi", "Mada", "Sarai"], 486889),
        ("437", "Tikamgarh", "RURAL", 82.7, "TIER_4", "Ginger Processing & Brass Metal Bells / Utensils", "AGRO_HANDICRAFTS", ["Tikamgarh", "Baldeogarh", "Jatara", "Palera", "Kharagpur", "Mohangarh", "Niwari"], 472001),
        ("438", "Ujjain", "SEMI_URBAN", 60.8, "TIER_1", "Bhairavgarh Batik Handblock Prints & Wheat / Poha Milling", "TEXTILES_FOOD", ["Ujjain", "Nagda", "Khachrod", "Mahidpur", "Tarana", "Badnagar", "Ghatiya"], 456001),
        ("439", "Umaria", "RURAL", 82.5, "TIER_5", "Mahua Ladoos / Honey & Bandhavgarh Tribal Souvenirs", "FOREST_HANDICRAFTS", ["Umaria (Bandhavgarh)", "Manpur", "Pali", "Karkeli", "Chandia", "Nowrozabad"], 484661),
        ("440", "Vidisha", "RURAL", 76.7, "TIER_3", "Sharbati Wheat Processing & Pulse Milling (Dal)", "AGRO_PROCESSING", ["Vidisha", "Basoda (Ganj Basoda)", "Kurwai", "Sironj", "Lateri", "Nateran", "Gyaraspur", "Gulabganj"], 464001)
    ]
    mp_districts = [format_district(code, name, urb, rur, tier, odop, cat, "Central Plateau and Hills Region (Zone VIII)", "MPPKVVCL / MPMKVVCL / MPPoKVVCL Feeder", blks, [f"{name} Rural", f"{blks[0]} GP"], pin) for code, name, urb, rur, tier, odop, cat, blks, pin in mp_names]
    states.append({"stateCode": "23", "stateName": "Madhya Pradesh", "territoryType": "STATE", "totalDistricts": 55, "districts": mp_districts})

    # 6. CHHATTISGARH (33)
    cg_names = [
        ("374", "Balod", "RURAL", 88.0, "TIER_4", "Rice Milling & Sugarcane Jaggery / Iron Ore Mining Spares", "AGRO_MINERAL", ["Balod", "Dondi", "Dondi Luhara", "Gunderdehi", "Gurur"], 491226),
        ("375", "Baloda Bazar", "RURAL", 87.0, "TIER_4", "Cement Concrete Products & Paddy Parboiling", "MINERAL_AGRO", ["Baloda Bazar", "Bhatapara", "Kasdol", "Palari", "Simga", "Bilaigarh"], 493332),
        ("376", "Balrampur", "RURAL", 95.0, "TIER_5", "Tuar Dal Milling & Tribal Minor Forest Honey", "AGRO_FOREST", ["Balrampur", "Ramanujganj", "Rajpur", "Kusmi", "Shankargarh", "Wadrafnagar"], 497220),
        ("377", "Bastar", "RURAL", 86.0, "TIER_4", "Bastar Dhokra Bell Metal Craft, Terracotta & Kaju", "HANDICRAFTS_AGRO", ["Jagdalpur", "Bastanar", "Bakawand", "Darba", "Lohandiguda", "Tokapal", "Bastanar"], 494001),
        ("378", "Bemetara", "RURAL", 89.0, "TIER_4", "Papaya Cultivation & Gram (Chana) Pulse Processing", "AGRO_PROCESSING", ["Bemetara", "Berla", "Nawagarh", "Saja", "Thanakhamria"], 491335),
        ("379", "Bijapur", "RURAL", 88.4, "TIER_6", "Chironji (Char) Processing & Mahua Value Addition", "FOREST_PRODUCE", ["Bijapur", "Bhopalpatnam", "Bhairamgarh", "Usur"], 494444),
        ("380", "Bilaspur", "SEMI_URBAN", 65.0, "TIER_2", "Kosa Silk Handloom Weaving & Thermal Engineering Spares", "HANDLOOM_ENGINEERING", ["Bilaspur", "Kota", "Takhatpur", "Bilha", "Masturi"], 495001),
        ("381", "Dantewada", "RURAL", 82.0, "TIER_5", "Tribal Wood Carving, Tendu Leaf & Iron Ore Auxiliaries", "HANDICRAFTS_MINERAL", ["Dantewada", "Geedam", "Kattekanar", "Kuakonda"], 494449),
        ("382", "Dhamtari", "RURAL", 81.0, "TIER_3", "Fine Nagri Dubraj Aromatic Rice Milling & Forest Produce", "AGRO_PROCESSING", ["Dhamtari", "Kurud", "Nagri", "Magarlod"], 493773),
        ("383", "Durg", "METROPOLITAN", 35.8, "TIER_1", "Bhilai Steel Fabrication, Refractory Bricks & Chemicals", "ENGINEERING_MINERAL", ["Durg", "Dhamdha", "Patan", "Bhilai"], 491001),
        ("384", "Gariaband", "RURAL", 91.0, "TIER_5", "Lac Cultivation & Minor Forest Produce Processing", "FOREST_PRODUCE", ["Gariaband", "Chhura", "Fingeshwar", "Mainpur", "Deobhog"], 493889),
        ("739", "Gaurela-Pendra-Marwahi", "RURAL", 90.0, "TIER_5", "Mahua Flower Syrup & Forest Honey / Wild Herbs", "FOREST_PRODUCE", ["Gaurela", "Pendra", "Marwahi"], 495119),
        ("385", "Janjgir-Champa", "RURAL", 86.0, "TIER_3", "Champa Kosa Silk Weaving & Thermal Power Spares", "HANDLOOM_ENGINEERING", ["Janjgir", "Champa", "Akaltara", "Baloda", "Nawagarh", "Pamgarh"], 495668),
        ("386", "Jashpur", "RURAL", 91.0, "TIER_5", "Tea Plantation Processing & Organic Cashew / Cardamom", "AGRO_PLANTATION", ["Jashpur", "Kunkuri", "Bagicha", "Manora", "Duldula", "Kansabel", "Farsabahar", "Pathalgaon"], 496331),
        ("387", "Kabirdham", "RURAL", 89.0, "TIER_4", "Sugarcane Molasses / Jaggery & Rice Bran Oil", "AGRO_PROCESSING", ["Kawardha", "Bodla", "Pandariya", "Sahaspur Lohara"], 491995),
        ("388", "Kanker", "RURAL", 89.7, "TIER_5", "Custard Apple Pulping & Wrought Iron Tribal Handicrafts", "AGRO_HANDICRAFTS", ["Kanker", "Antagarh", "Bhanupratappur", "Charama", "Koyalibeda", "Narharpur", "Durgukondal"], 494334),
        ("740", "Khairagarh-Chhuikhadan-Gandai", "RURAL", 86.0, "TIER_4", "Classical Musical Instruments & Paddy Processing", "HANDICRAFTS_AGRO", ["Khairagarh", "Chhuikhadan", "Gandai"], 491441),
        ("389", "Kondagaon", "RURAL", 90.0, "TIER_5", "Bell Metal Dhokra Art & Cashew Nut Processing", "HANDICRAFTS_AGRO", ["Kondagaon", "Keshkal", "Baderajpur", "Makdi", "Pharasgaon"], 494226),
        ("390", "Korba", "SEMI_URBAN", 63.0, "TIER_2", "Aluminium Wire Rods, Coal Mining Parts & Tussar Silk", "MINERAL_TEXTILES", ["Korba", "Katghora", "Pali", "Kartala", "Poundi-Uproda"], 495677),
        ("391", "Koriya", "RURAL", 68.0, "TIER_4", "Tomato Puree & Coal Derivatives / Minor Forest Honey", "AGRO_MINERAL", ["Baikunthpur", "Sonhat"], 497335),
        ("392", "Mahasamund", "RURAL", 88.0, "TIER_4", "Paddy Milling & Terracotta Pottery / Bell Metal", "AGRO_HANDICRAFTS", ["Mahasamund", "Bagbahra", "Basna", "Pithora", "Saraipali"], 493445),
        ("741", "Manendragarh-Chirmiri-Bharatpur", "RURAL", 72.0, "TIER_4", "Coal Mining Fabrication & Forest Herbal Medicines", "MINERAL_MEDICINAL", ["Manendragarh", "Chirmiri", "Bharatpur", "Khadgawan"], 497442),
        ("742", "Mohla-Manpur-Ambagarh Chowki", "RURAL", 92.0, "TIER_5", "Tribal Bamboo Crafts & Tendu Leaf Collection", "FOREST_CRAFT", ["Mohla", "Manpur", "Ambagarh Chowki"], 491666),
        ("393", "Mungeli", "RURAL", 90.0, "TIER_4", "Gram Dal Milling & Paddy Parboiling Units", "AGRO_PROCESSING", ["Mungeli", "Lormi", "Pathariya"], 495334),
        ("394", "Narayanpur", "RURAL", 84.0, "TIER_6", "Wrought Iron Crafts & Minor Forest Tamarind Processing", "HANDICRAFTS_FOREST", ["Narayanpur", "Orchha (Abujhmad)"], 494661),
        ("395", "Raigarh", "SEMI_URBAN", 83.0, "TIER_2", "Sponge Iron Rolling Mills, Dhokra Metal Craft & Tussar Silk", "METAL_HANDLOOM", ["Raigarh", "Kharsia", "Gharghoda", "Tamnar", "Lailunga", "Pussore", "Dharamjaigarh"], 496001),
        ("396", "Raipur", "METROPOLITAN", 32.0, "TIER_1", "Steel Re-rolling, Gems & Jewellery, Food Processing & IT", "STEEL_FOOD_IT", ["Raipur Urban", "Dharsiwa", "Arang", "Abhanpur", "Tilda Newra"], 492001),
        ("397", "Rajnandgaon", "SEMI_URBAN", 82.0, "TIER_3", "Raw Rice Export Milling & Plastic Extrusion Molded Goods", "AGRO_PLASTICS", ["Rajnandgaon", "Dongargaon", "Dongargarh", "Chhuria"], 491441),
        ("743", "Sakti", "RURAL", 88.0, "TIER_4", "Kosa Silk Yarn Spinning & Fine Paddy Processing", "HANDLOOM_AGRO", ["Sakti", "Dabhra", "Malkharoda", "Jaijaipur"], 495689),
        ("744", "Sarangarh-Bilaigarh", "RURAL", 89.0, "TIER_4", "Paddy Milling & Terracotta Clay Roofing Tiles", "AGRO_HANDICRAFTS", ["Sarangarh", "Bilaigarh", "Baramkela"], 496445),
        ("398", "Sukma", "RURAL", 89.0, "TIER_6", "Minor Forest Produce (Mahua, Harra, Baheda) & Tamarind", "FOREST_PRODUCE", ["Sukma", "Konta", "Chhindgarh"], 494111),
        ("399", "Surajpur", "RURAL", 91.0, "TIER_4", "Soyabean Oil & Sugarcane Jaggery / Coal Auxiliaries", "AGRO_MINERAL", ["Surajpur", "Bhaiyathan", "Pratappur", "Premnagar", "Ramanujnagar", "Odegi"], 497229),
        ("400", "Surguja", "RURAL", 90.0, "TIER_4", "Jeeraphool Aromatic Rice & Ambikapur Potato / Lychee", "AGRO_PROCESSING", ["Ambikapur", "Sitapur", "Lundra", "Mainpat", "Batauli", "Lakhanpur", "Udaipur"], 497001)
    ]
    cg_districts = [format_district(code, name, urb, rur, tier, odop, cat, "Eastern Plateau and Hills Region (Zone VII)", "CSPDCL Rural / Industrial Feeder", blks, [f"{name} Rural", f"{blks[0]} GP"], pin) for code, name, urb, rur, tier, odop, cat, blks, pin in cg_names]
    states.append({"stateCode": "22", "stateName": "Chhattisgarh", "territoryType": "STATE", "totalDistricts": 33, "districts": cg_districts})

    return states
