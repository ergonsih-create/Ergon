"""
Part 4: Eastern & North-Eastern States
- Bihar (38)
- Jharkhand (24)
- West Bengal (23)
- Odisha (30)
- Assam (35)
- Arunachal Pradesh (26)
- Manipur (16)
- Meghalaya (12)
- Mizoram (11)
- Nagaland (16)
- Sikkim (6)
- Tripura (8)
Total: 245 districts
"""

def get_east_northeast_data(format_district):
    states = []

    # 1. BIHAR (38)
    br_names = [
        ("196", "Araria", "RURAL", 94.0, "TIER_4", "Jute Yarn Spinning & Twine Bags / Makhana Cultivation", "JUTE_AGRO", ["Araria", "Forbesganj", "Jokihat", "Raniganj", "Kursakatta", "Sikti", "Palasi", "Bhargama", "Narpatganj"], 854311),
        ("197", "Arwal", "RURAL", 92.6, "TIER_5", "Paddy Milling & Handloom Weaving / Stone Carving", "AGRO_HANDLOOM", ["Arwal", "Kaler", "Karpi", "Kurtha", "Sonbhadra Banshi Suryapur"], 804401),
        ("198", "Aurangabad", "RURAL", 90.7, "TIER_4", "Strawberry Cultivation & Bundelkhand-type Stone Ware / Rice", "HORTICULTURE_AGRO", ["Aurangabad", "Daudnagar", "Obra", "Goh", "Rafiganj", "Barun", "Nabinagar", "Kutumba", "Madanpur", "Deo", "Haspura"], 824101),
        ("199", "Banka", "RURAL", 96.5, "TIER_4", "Katarani Scented Rice Milling (G.I.) & Tussar Silk Weaving", "AGRO_SERICULTURE", ["Banka", "Amarpur", "Katoria", "Bounsi", "Chandan", "Belhar", "Dhuraiya", "Fullidumar", "Rajaun", "Shambhuganj", "Barahat"], 813102),
        ("200", "Begusarai", "SEMI_URBAN", 80.8, "TIER_2", "Petrochemical Refining Auxiliaries & Red Banana Processing", "CHEMICALS_AGRO", ["Begusarai", "Barauni", "Teghra", "Bakhri", "Ballia", "Sahebpur Kamal", "Cheria Bariarpur", "Birpur", "Bhagwanpur", "Matihani", "Shamho", "Garhpura", "Chhorahi", "Naokothi", "Mansurchak", "Dandari"], 851101),
        ("201", "Bhagalpur", "SEMI_URBAN", 80.2, "TIER_2", "Bhagalpuri Silk (Tussar Silk Sarees G.I.) & Zardalu Mango", "SILK_HORTICULTURE", ["Bhagalpur", "Nathnagar", "Sultanganj", "Kahalgaon", "Pirpainti", "Colgong", "Bihpur", "Naugachia", "Gopalpur", "Kharik", "Narayanpur", "Ismailpur", "Rangra Chowk", "Sabour", "Goradih", "Jagdishpur", "Sanhaula"], 812001),
        ("202", "Bhojpur", "RURAL", 85.7, "TIER_3", "Udwantnagar Belgrami Sweet & Son River Fine Sand / Agro", "FOOD_MINERAL", ["Ara (Bhojpur)", "Jagdishpur", "Piro", "Bihiya", "Koilwar", "Sandesh", "Sahar", "Barhara", "Garhani", "Tarari", "Shahpur", "Charpokhari", "Udwantnagar", "Agiaon"], 802301),
        ("203", "Buxar", "RURAL", 91.0, "TIER_3", "Batisa Sweets & Basmati-type Rice Parboiling Mills", "FOOD_AGRO", ["Buxar", "Dumraon", "Itarhi", "Rajpur", "Chaugain", "Kesath", "Nawanagar", "Brahmpur", "Simri", "Chakki", "Chausa"], 802101),
        ("204", "Darbhanga", "SEMI_URBAN", 90.3, "TIER_2", "Mithila Makhana (Foxnut G.I.), Sikki Grass Craft & Mango", "AGRO_HANDICRAFTS", ["Darbhanga", "Benipur", "Baheri", "Biraul", "Jale", "Keoti", "Singhwara", "Hayaghat", "Alinagar", "Manigachhi", "Ghanshyampur", "Hanumannagar", "Bahadurpur", "Kusheshwar Asthan", "Kusheshwar Asthan East", "Kiratpur", "Gaura Bauram", "Tardih"], 846001),
        ("205", "East Champaran", "RURAL", 92.1, "TIER_3", "Motihari Mother of Pearl Buttons & Sugarcane Jaggery", "HANDICRAFTS_AGRO", ["Motihari", "Raxaul", "Chakia", "Dhaka", "Areraj", "Pakridayal", "Sugauli", "Kesaria", "Madhuban", "Adapur", "Patahi", "Phenhara", "Piprakothi", "Turkaulia", "Harsidhi", "Kotwa", "Paharpur", "Sangrampur", "Tetaria", "Banjaria", "Chiraiya", "Ghorasahan", "Bankatwa", "Kalyanpur", "Mehsi", "Ramgarhwa", "Rampurwa"], 845401),
        ("206", "Gaya", "SEMI_URBAN", 86.8, "TIER_2", "Gaya Tilkut & Anarsa Sweets, Stone Carving & Handlooms", "FOOD_HANDICRAFTS", ["Gaya Town", "Bodh Gaya", "Manpur", "Tekari", "Sherghati", "Imamganj", "Barachatti", "Fatehpur", "Wazirganj", "Atri", "Neemchak Bathani", "Khizirsarai", "Belaganj", "Gurua", "Paraiya", "Tikari", "Mohanpur", "Dobhi", "Dumaria", "Bankey Bazar", "Amas", "Tan Kuppa", "Guraru", "Bishunganj"], 823001),
        ("207", "Gopalganj", "RURAL", 93.6, "TIER_3", "Sugarcane Molasses / Jaggery & Brass Metal Artifacts", "AGRO_BRASSWARE", ["Gopalganj", "Hathua", "Mirganj", "Barauli", "Baikunthpur", "Sidhwalia", "Thawe", "Uchkagaon", "Katiya", "Bhorey", "Bijaipur", "Kuchaikote", "Panchdeori", "Manjha"], 841428),
        ("208", "Jamui", "RURAL", 91.7, "TIER_4", "Bamboo Craft Baskets & Minor Forest Tendu / Mahua Honey", "FOREST_HANDICRAFTS", ["Jamui", "Jhajha", "Chakai", "Sono", "Gidhaur", "Khaira", "Barhat", "Laxmipur", "Sikandra", "Islamnagar Aliganj"], 811307),
        ("209", "Jehanabad", "RURAL", 88.0, "TIER_4", "Paddy Milling & Traditional Bamboo / Wood Furniture", "AGRO_WOOD", ["Jehanabad", "Makhdumpur", "Kako", "Ghoshi", "Ratni Faridpur", "Hulashganj", "Modanganj"], 804408),
        ("210", "Kaimur", "RURAL", 95.9, "TIER_4", "Basmati Rice Parboiling Mills & Stone Slabs / Lime", "AGRO_MINERAL", ["Bhabua", "Mohania", "Chainpur", "Chand", "Kudra", "Ramgarh", "Bhagwanpur", "Durgawati", "Adhaura", "Rampur", "Nuon"], 821101),
        ("211", "Katihar", "SEMI_URBAN", 91.1, "TIER_3", "Jute Twine / Gunny Bags & Makhana Processing / Maize", "JUTE_AGRO", ["Katihar", "Barsoi", "Manihari", "Korha", "Falka", "Sameli", "Kursela", "Amdabad", "Pranpur", "Mansahi", "Hasanganj", "Dandkhora", "Kadwa", "Azamnagar", "Balrampur"], 854105),
        ("212", "Khagaria", "RURAL", 94.8, "TIER_4", "Maize (Corn) Starch Extraction & Banana Fibre Crafts", "AGRO_FIBRE", ["Khagaria", "Gogri Jamalpur", "Parbatta", "Mansi", "Alauli", "Chautham", "Beldaur"], 851204),
        ("213", "Kishanganj", "RURAL", 90.4, "TIER_4", "Kishanganj Orthodox & CTC Tea & Pineapple Value Addition", "AGRO_PLANTATION", ["Kishanganj", "Bahadurganj", "Thakurganj", "Pothia", "Dighalbank", "Kochadhaman", "Terhagachh"], 855107),
        ("214", "Lakhisarai", "RURAL", 85.7, "TIER_4", "Sindoor (Vermilion) Manufacture & Lentil Dal Processing", "CHEMICALS_AGRO", ["Lakhisarai", "Barahiya", "Surajgarha", "Pipariya", "Halsi", "Ramgarh Chowk", "Chanan"], 811311),
        ("215", "Madhepura", "RURAL", 95.6, "TIER_4", "Electric Locomotive Assembly Spares & High-Starch Maize", "ENGINEERING_AGRO", ["Madhepura", "Murliganj", "Singheshwar", "Bihariganj", "Alamnagar", "Puraini", "Chausa", "Kumarkhand", "Gwalpara", "Shankarpur", "Gamhariya"], 852113),
        ("216", "Madhubani", "RURAL", 96.4, "TIER_3", "Madhubani (Mithila) Folk Painting (G.I.) & Foxnut (Makhana)", "HANDICRAFTS_AGRO", ["Madhubani", "Jhanjharpur", "Benipatti", "Jainagar", "Phulparas", "Pandaul", "Rajnagar", "Khajauli", "Babubarhi", "Kaluahi", "Harlakhi", "Madhwapur", "Basopatti", "Ladania", "Laukaha", "Laukahi", "Andhrathari", "Ghoghardiha", "Lakhnaur", "Bisfi", "Rahika"], 847211),
        ("217", "Munger", "SEMI_URBAN", 72.2, "TIER_3", "Gun / Ordnance Engineering Auxiliaries & ITC Tobacco / Silk", "ENGINEERING_AGRO", ["Munger", "Jamalpur", "Kharagpur (Haveli)", "Tarapur", "Bariarpur", "Dharhara", "Asarganj", "Sangrampur", "Tetia Bamber"], 811201),
        ("218", "Muzaffarpur", "SEMI_URBAN", 90.1, "TIER_1", "Shahi Lychee (G.I.) Juice & Lahathi (Lac Bangle) Craft", "HORTICULTURE_HANDICRAFTS", ["Muzaffarpur (Musahri)", "Kanti", "Motipur", "Sahebganj", "Paroo", "Saraiya", "Marwan", "Minapur", "Bochahan", "Gaighat", "Katra", "Aurai", "Sakra", "Muraul", "Kudni", "Bandra"], 842001),
        ("219", "Nalanda", "SEMI_URBAN", 84.1, "TIER_2", "Silao Khaja Sweet (G.I.), Bawan Buti Handloom & Heritage Souvenirs", "FOOD_HANDLOOM", ["Bihar Sharif (Nalanda)", "Rajgir", "Hilsa", "Islampur", "Silao", "Giriak", "Noorsarai", "Chandi", "Rahui", "Asthawan", "Harnaut", "Ekangarsarai", "Ben", "Nagarnausa", "Karai Parsurai", "Parwalpur", "Katrisarai", "Bind", "Sarmera", "Tharthari"], 803101),
        ("220", "Nawada", "RURAL", 90.3, "TIER_4", "Magahi Paan (Betel Leaf G.I.) & Silk Weaving (Kadirganj)", "AGRO_HANDLOOM", ["Nawada", "Rajauli", "Hisua", "Pakribarawan", "Warisaliganj", "Kadirganj", "Akbarpur", "Gobindpur", "Meskaur", "Sirdala", "Rajauli", "Roh", "Kashichak", "Nardiganj"], 805110),
        ("221", "Patna", "METROPOLITAN", 56.9, "TIER_1", "Readymade Garments, Food Processing, Plastics & IT Hub", "TEXTILES_FOOD_IT", ["Patna Sadar", "Danapur", "Phulwari Sharif", "Fatwah", "Bakhtiarpur", "Barh", "Mokama", "Bihta", "Maner", "Masaurhi", "Paliganj", "Bikram", "Naubatpur", "Sampatchak", "Punpun", "Dhanarua", "Pandarak", "Ghoswari", "Belchhi", "Athmalgola", "Dulhin Bazar"], 800001),
        ("222", "Purnia", "SEMI_URBAN", 89.6, "TIER_2", "Jute Spinning Mill Products, Maize Starch & Makhana Trading", "JUTE_AGRO", ["Purnia", "Kasba", "Banmankhi", "Dhamdaha", "Rupauli", "Bhawanipur", "Baisi", "Amour", "Baisa", "Dagarua", "Jalalgarh", "Krityanand Nagar", "Srinagar", "Barhara Kothi"], 854301),
        ("223", "Rohtas", "RURAL", 85.5, "TIER_3", "Son Valley Basmati Rice Milling & Cement Limestone / Quarry", "AGRO_MINERAL", ["Sasaram", "Dehri on Sone", "Bikramganj", "Nokha", "Kargahar", "Kochas", "Chenari", "Sheosagar", "Tilouthu", "Rohtas", "Nauhatta", "Suryapura", "Dawath", "Karakat", "Sanjhauli", "Rajpur", "Dinara", "Nasriganj", "Akorhi Gola"], 821115),
        ("224", "Saharsa", "RURAL", 91.8, "TIER_3", "Makhana Grading / Flaking & Maize Starch Processing", "AGRO_PROCESSING", ["Saharsa", "Simri Bakhtiarpur", "Saur Bazar", "Kahra", "Mahishi", "Nauhatta", "Salkhua", "Banma Ithari", "Patarghat", "Sonbarsa"], 852201),
        ("225", "Samastipur", "RURAL", 96.5, "TIER_3", "Tobacco Processing, Turmeric Powder & Dairy Products", "AGRO_DAIRY", ["Samastipur", "Dalsinghsarai", "Rosera", "Pusa (Agri Research)", "Tajpur", "Shahpur Patori", "Mohiuddinagar", "Vidyapatinagar", "Sarairanjan", "Kalyanpur", "Warisnagar", "Khanpur", "Bibhutipur", "Singhia", "Hasanpur", "Bithan", "Shivaji Nagar", "Ujiarpur", "Morwa"], 848101),
        ("226", "Saran", "SEMI_URBAN", 91.1, "TIER_2", "Marhaura Rail Engine Engineering & Chapra Jaggery", "ENGINEERING_AGRO", ["Chhapra (Saran)", "Marhaura", "Sonpur", "Garkha", "Dighwara", "Parsa", "Taraiya", "Baniyapur", "Jalalpur", "Panapur", "Ishupur", "Mashrakh", "Maker", "Dariapur", "Amnour", "Rivilganj", "Manjhi", "Ekma", "Lahladpur", "Nagra"], 841301),
        ("227", "Sheikhpura", "RURAL", 82.9, "TIER_4", "Onion Storage / Dehydration & Stone Quarry Slabs", "AGRO_MINERAL", ["Sheikhpura", "Barbigha", "Ghatkusumbha", "Chewara", "Ariari", "Shekhopur Sarai"], 811105),
        ("228", "Sheohar", "RURAL", 95.7, "TIER_5", "Bamboo Cane Crafts & Sugarcane Jaggery Production", "FOREST_AGRO", ["Sheohar", "Dumri Katsari", "Piprahi", "Purnahiya", "Tariyani"], 843329),
        ("229", "Sitamarhi", "RURAL", 94.4, "TIER_3", "Sitamarhi Lac Bangles & Garlic / Sugarcane Processing", "HANDICRAFTS_AGRO", ["Sitamarhi", "Bairgania", "Pupri", "Belsand", "Dumra", "Riga", "Majorganj", "Sonbarsa", "Parihar", "Sursand", "Bathnaha", "Nanpur", "Bajpatti", "Charaut", "Bokhra", "Suppi", "Parsauni", "Runni Saidpur"], 843302),
        ("230", "Siwan", "RURAL", 95.5, "TIER_3", "Terracotta Clay Pottery & Wood Furniture / Brass Metal", "POTTERY_WOOD", ["Siwan", "Maharajganj", "Mairwa", "Darauli", "Raghunathpur", "Andar", "Hussainganj", "Barharia", "Goreakothi", "Basantpur", "Bhagwanpur Hat", "Pachrukhi", "Ziradei", "Nautan", "Guthani", "Hasanpura", "Lakri Nabiganj", "Siswan"], 841226),
        ("231", "Supaul", "RURAL", 95.3, "TIER_4", "Makhana Cultivation & Bamboo Cane Furniture / River Fish", "AGRO_HANDICRAFTS", ["Supaul", "Birpur", "Triveniganj", "Nirmali", "Raghopur", "Pipra", "Saraigarh Bhaptiyahi", "Kishanpur", "Marauna", "Chhatapur", "Basantpur"], 852131),
        ("232", "Vaishali", "RURAL", 93.3, "TIER_2", "Hajipur Chiniya Banana, Shahi Lychee & Plastic Moldings", "HORTICULTURE_PLASTICS", ["Hajipur", "Mahnar", "Mahua", "Lalganj", "Vaishali", "Bidupur", "Desri", "Sahdei Buzurg", "Jandaha", "Patedhi Belsar", "Bhagwanpur", "Goraul", "Chehrakala", "Raghopur", "Patepur"], 844101),
        ("233", "West Champaran", "RURAL", 90.0, "TIER_3", "Bettiah Textile Weaving & Marcha Rice (G.I.) / Sugarcane", "TEXTILES_AGRO", ["Bettiah", "Bagaha", "Narkatiaganj", "Ramnagar", "Chanpatia", "Lauriya", "Majhaulia", "Bairia", "Nautan", "Jogapatti", "Gaunaha", "Mainatand", "Sikta", "Thakaraha", "Bhitaha", "Madhubani", "Piprasi"], 845438)
    ]
    br_districts = [format_district(code, name, urb, rur, tier, odop, cat, "Middle Gangetic Plains Region (Zone IV)", "NBPDCL / SBPDCL Rural Feeder", blks, [f"{name} Rural", f"{blks[0]} GP"], pin) for code, name, urb, rur, tier, odop, cat, blks, pin in br_names]
    states.append({"stateCode": "10", "stateName": "Bihar", "territoryType": "STATE", "totalDistricts": 38, "districts": br_districts})

    # 2. JHARKHAND (24)
    jh_names = [
        ("346", "Bokaro", "SEMI_URBAN", 52.3, "TIER_2", "Steel Secondary Products, Refractory Clay & Tussar Silk", "STEEL_TEXTILES", ["Bokaro Steel City (Chas)", "Bermo", "Chandankiyari", "Gumia", "Jaridih", "Kasmar", "Nawadih", "Peterwar", "Chandrapura"], 827001),
        ("347", "Chatra", "RURAL", 94.0, "TIER_5", "Minor Forest Produce (Mahua / Lac) & Tomato Puree", "FOREST_AGRO", ["Chatra", "Hunterganj", "Pratappur", "Itkhori", "Tandwa", "Simaria", "Gidhaur", "Kanhachatti", "Lawalong", "Pathalgada", "Mayurhand", "Kunda"], 825401),
        ("348", "Deoghar", "SEMI_URBAN", 82.8, "TIER_3", "Peda Milk Sweet Confectionery & Brass Religious Bells", "FOOD_HANDICRAFTS", ["Deoghar", "Madhupur", "Sarath", "Karon", "Mohanpur", "Devipur", "Palojori", "Sarwan", "Sonaraithari", "Margomunda"], 814112),
        ("349", "Dhanbad", "METROPOLITAN", 41.9, "TIER_1", "Coal Mining Equipment Fabrication, Coke Derivatives & Flyash Bricks", "ENGINEERING_MINERAL", ["Dhanbad", "Jharia", "Sindri", "Katras", "Nirsa", "Baghmara", "Govindpur", "Tundi", "Topchanchi", "Baliapur", "Kaliasole", "Egarkund"], 826001),
        ("350", "Dumka", "RURAL", 93.2, "TIER_4", "Tussar Silk Reeling / Weaving & Peda Sweet / Terracotta", "SERICULTURE_FOOD", ["Dumka", "Jama", "Jarmundi", "Kathikund", "Gopikandar", "Ranishwar", "Shikaripara", "Saraiyahat", "Masalia", "Ramgarh"], 814101),
        ("351", "East Singhbhum", "METROPOLITAN", 32.2, "TIER_1", "Tata Steel Automotives, Copper Wire Rods & Tribal Paintings", "STEEL_ENGINEERING", ["Jamshedpur (Golmuri)", "Ghatshila", "Musabani", "Baharagora", "Chakulia", "Dhalbhumgarh", "Potka", "Patamda", "Boram", "Dumaria", "Gudabanda"], 831001),
        ("352", "Garhwa", "RURAL", 94.7, "TIER_5", "Raw Lac Processing, Tendu Leaves & Sesame Oil Expelling", "FOREST_AGRO", ["Garhwa", "Nagar Untari (Shri Banshidhar Nagar)", "Ranka", "Meral", "Bhandaria", "Bhawnathpur", "Chiniya", "Dandai", "Dhurki", "Kandi", "Kharaundhi", "Majhiaon", "Ramkanda", "Ramna", "Sagma", "Barwadih"], 822114),
        ("353", "Giridih", "RURAL", 86.8, "TIER_3", "Mica Flakes Insulators, Steel Re-rolling & Mahua Processing", "MINERAL_FOREST", ["Giridih", "Dhanwar", "Bagodar", "Dumri", "Bengabad", "Birni", "Deori", "Gandey", "Gawan", "Jamua", "Pirtand (Parasnath)", "Sariya", "Tisri"], 815301),
        ("354", "Godda", "RURAL", 95.1, "TIER_4", "Tussar Silk Cocoon Rearing & Thermal Energy Auxiliaries", "SERICULTURE_ENERGY", ["Godda", "Mahagama", "Pathargama", "Poraiyahat", "Sundarpahari", "Boarijor", "Meherma", "Thakurgangti"], 814133),
        ("355", "Gumla", "RURAL", 93.6, "TIER_5", "Minor Forest Honey, Chironji Seeds & Ragi (Finger Millet)", "FOREST_AGRO", ["Gumla", "Chainpur", "Bishunpur", "Raidih", "Palkot", "Basia", "Kamdara", "Sisai", "Ghaghra", "Bharno", "Albert Ekka (Jari)", "Dumri"], 835207),
        ("356", "Hazaribagh", "SEMI_URBAN", 84.1, "TIER_2", "Sohrai & Khovar Tribal Mural Paintings (G.I.) & Coal Mining", "HANDICRAFTS_MINERAL", ["Hazaribagh (Sadar)", "Barhi", "Barkagaon", "Chauparan", "Churchu", "Daru", "Ichak", "Keredari", "Padma", "Katkamsandi", "Katkamdag", "Tati Jhariya", "Bishnugarh"], 825301),
        ("357", "Jamtara", "RURAL", 90.4, "TIER_4", "Kaju (Cashew) Processing & Handloom Cotton Weaving", "AGRO_HANDLOOM", ["Jamtara", "Mihijam (Chittaranjan Locos)", "Kundhit", "Nala", "Narayanpur", "Fatehpur", "Karmatar"], 815351),
        ("358", "Khunti", "RURAL", 91.5, "TIER_5", "Lac Processing / Shellac (G.I.) & Organic Dragon Fruit", "FOREST_HORTICULTURE", ["Khunti", "Murhu", "Torpa", "Rania", "Karra", "Arki"], 835210),
        ("359", "Koderma", "RURAL", 80.3, "TIER_3", "Mica Scrap Processing, Quartz Slabs & Peda Confectionery", "MINERAL_FOOD", ["Koderma", "Jhumri Telaiya", "Jainagar", "Markacho", "Satgawan", "Chandwara"], 825410),
        ("360", "Latehar", "RURAL", 92.8, "TIER_5", "Bamboo Cane Artifacts, Mahua Forest Produce & Bauxite", "FOREST_MINERAL", ["Latehar", "Chandwa", "Balumath", "Barwadih", "Garu (Betla)", "Mahuadanr", "Manika", "Bariyatu", "Herhanj"], 829206),
        ("361", "Lohardaga", "RURAL", 87.6, "TIER_5", "Bauxite Calcining Auxiliaries & Green Pea Processing", "MINERAL_AGRO", ["Lohardaga", "Kisko", "Senha", "Bhandra", "Kuru", "Peshrar", "Kairo"], 835302),
        ("362", "Pakur", "RURAL", 92.5, "TIER_5", "Black Stone Chips Crushing & Santhal Tribal Jute Craft", "MINERAL_HANDICRAFTS", ["Pakur", "Hiranpur", "Littipara", "Amrapara", "Pakuria", "Maheshpur"], 816107),
        ("363", "Palamu", "RURAL", 88.4, "TIER_3", "Lentil Dal Milling & Bamboo Craft / Dolomite Extraction", "AGRO_MINERAL", ["Daltonganj (Medininagar)", "Bishrampur", "Chhatarpur", "Hussainabad", "Hariharganj", "Lesliganj", "Panki", "Satbarwa", "Pandu", "Utari Road", "Nawa Bazar", "Paton", "Pipra", "Tarhasi"], 822101),
        ("364", "Ramgarh", "SEMI_URBAN", 55.9, "TIER_3", "Refractory Glass Bottles, Steel Sponges & Coal Byproducts", "GLASS_STEEL", ["Ramgarh", "Patratu", "Gola", "Mandu", "Chitarpur", "Dulmi"], 829122),
        ("365", "Ranchi", "METROPOLITAN", 56.9, "TIER_1", "Heavy Machine Tools (HEC), Lac Derivatives, Organic Ragi & IT", "ENGINEERING_FOREST_IT", ["Ranchi Urban", "Kanke", "Namkum", "Ratu", "Ormanjhi", "Angara", "Bero", "Bundu", "Tamar", "Sonahatu", "Silli", "Mandar", "Chanho", "Burmu", "Khelari", "Lapung", "Itki", "Nagri"], 834001),
        ("366", "Sahibganj", "RURAL", 86.8, "TIER_4", "Ganga River Multi-Modal Logistics & China Clay Processing", "LOGISTICS_MINERAL", ["Sahibganj", "Rajmahal", "Barharwa", "Borio", "Mandro", "Taljhari", "Pathna", "Barhait", "Udhwa"], 816109),
        ("367", "Seraikela Kharsawan", "SEMI_URBAN", 74.4, "TIER_2", "Chhau Dance Masks (G.I.) & Adityapur Auto Components", "HANDICRAFTS_AUTO", ["Seraikela", "Adityapur (Gamharia)", "Kharsawan", "Chandil", "Chowka", "Nimdih", "Ichagarh", "Kukru", "Rajnagar", "Kuchai"], 833219),
        ("368", "Simdega", "RURAL", 92.9, "TIER_5", "Wooden Hockey Sticks, Lac Bangles & Organic Millets", "SPORTS_FOREST", ["Simdega", "Kolebira", "Bano", "Jaldega", "Kurdeg", "Thethaitangar", "Bolba", "Pakartanr", "Kersai", "Bansjor"], 835223),
        ("369", "West Singhbhum", "RURAL", 85.2, "TIER_4", "Tussar Silk Cocoon Production & Iron Ore Mining Auxiliaries", "SERICULTURE_MINERAL", ["Chaibasa", "Chakradharpur", "Noamundi", "Gua", "Kiriburu", "Jagannathpur", "Manoharpur", "Jhinkpani", "Khuntpani", "Tonto", "Kumardungi", "Tantnagar", "Majhgaon", "Gudri", "Sonua", "Goilkera"], 833201)
    ]
    jh_districts = [format_district(code, name, urb, rur, tier, odop, cat, "Eastern Plateau and Hills Region (Zone VII)", "JBVNL Rural Feeder", blks, [f"{name} Rural", f"{blks[0]} GP"], pin) for code, name, urb, rur, tier, odop, cat, blks, pin in jh_names]
    states.append({"stateCode": "20", "stateName": "Jharkhand", "territoryType": "STATE", "totalDistricts": 24, "districts": jh_districts})

    # 3. WEST BENGAL (23)
    wb_names = [
        ("318", "Alipurduar", "RURAL", 79.4, "TIER_4", "Dooars CTC Orthodox Tea Processing & Timber Wood", "TEA_WOOD", ["Alipurduar I", "Alipurduar II", "Falakata", "Kalchini", "Kumargram", "Madarihat-Birpara"], 736121),
        ("319", "Bankura", "RURAL", 91.7, "TIER_3", "Bankura Terracotta Horse (G.I.) & Baluchari Pure Silk Sarees", "POTTERY_HANDLOOM", ["Bankura I", "Bankura II", "Bishnupur", "Sonamukhi", "Joypur", "Kotulpur", "Patrasayer", "Khatra", "Ranibandh", "Raipur", "Simlapal", "Taldangra", "Onda", "Chhatna", "Gangajalghati", "Mejia", "Saltora", "Barjora", "Indpur", "Hirbandh", "Sarenga", "Indas"], 722101),
        ("320", "Birbhum", "RURAL", 87.2, "TIER_3", "Santiniketan Leather Goods (G.I.) & Kantha Stitch Embroidery", "LEATHER_HANDICRAFTS", ["Suri I", "Suri II", "Bolpur (Santiniketan)", "Rampurhat I", "Rampurhat II", "Sainthia", "Dubrajpur", "Illambazar", "Labpur", "Nanoor", "Mayureswar I", "Mayureswar II", "Murarai I", "Murarai II", "Nalhati I", "Nalhati II", "Khoyrasol", "Rajnagar", "Mohammad Bazar"], 731101),
        ("321", "Cooch Behar", "RURAL", 89.7, "TIER_4", "Shitalpati Handwoven Mats (G.I.) & Tobacco / Pineapple", "HANDICRAFTS_AGRO", ["Cooch Behar I", "Cooch Behar II", "Dinhata I", "Dinhata II", "Mathabhanga I", "Mathabhanga II", "Mekhliganj", "Haldibari", "Tufanganj I", "Tufanganj II", "Sitalkuchi", "Sitai"], 736101),
        ("322", "Dakshin Dinajpur", "RURAL", 85.9, "TIER_4", "Tulaipanji Aromatic Rice (G.I.) & Kushmandi Wooden Masks", "AGRO_WOOD", ["Balurghat", "Hili", "Kumarganj", "Gangarampur", "Bansihari", "Harirampur", "Kushmandi", "Tapan"], 733101),
        ("323", "Darjeeling", "SEMI_URBAN", 60.6, "TIER_2", "Darjeeling Orthodox Black Tea (G.I. Champagne of Teas)", "TEA", ["Darjeeling-Pulbazar", "Kurseong", "Mirik", "Rangli Rangliot", "Jorebunglow Sukhiapokhri", "Gorubathan", "Sukna"], 734101),
        ("324", "Hooghly", "SEMI_URBAN", 61.4, "TIER_2", "Jute Spinning Mill Products, Potato Cold Chain & Zari Work", "JUTE_AGRO", ["Chinsurah-Mogra", "Chandannagar", "Serampore-Uttarpara", "Arambagh", "Singur", "Tarakeswar", "Haripal", "Dhanekhali", "Pandua", "Balagarh", "Polba-Dadpur", "Jangipara", "Pursurah", "Khanakul I", "Khanakul II", "Goghat I", "Goghat II"], 712101),
        ("325", "Howrah", "METROPOLITAN", 36.7, "TIER_1", "Foundry Light Engineering Castings, Zari Embroidery & Coir", "ENGINEERING_TEXTILES", ["Howrah (Bally-Jagachha)", "Sankrail", "Domjur", "Panchla", "Uluberia I", "Uluberia II", "Bagnan I", "Bagnan II", "Amta I", "Amta II", "Udaynarayanpur", "Shyampur I", "Shyampur II"], 711101),
        ("326", "Jalpaiguri", "SEMI_URBAN", 72.9, "TIER_3", "Dooars Tea Blending, Plywood & Ginger Processing", "TEA_WOOD", ["Jalpaiguri", "Malbazar", "Dhupguri", "Maynaguri", "Rajganj", "Matiali", "Nagrakata", "Banarhat", "Kranti"], 735101),
        ("327", "Jhargram", "RURAL", 95.5, "TIER_5", "Sal Leaf Plate Making, Sabai Grass Rope Crafts & Honey", "FOREST_HANDICRAFTS", ["Jhargram", "Binpur I", "Binpur II", "Gopiballavpur I", "Gopiballavpur II", "Jamboni", "Nayagram", "Sankrail"], 721507),
        ("328", "Kalimpong", "RURAL", 77.2, "TIER_4", "Large Cardamom, Cymbidium Orchids & Dalle Khursani Chilli", "SPICES_HORTICULTURE", ["Kalimpong I", "Kalimpong II", "Gorubathan", "Lava"], 734301),
        ("329", "Kolkata", "METROPOLITAN", 0.0, "TIER_1", "Information Technology, Gems & Jewellery & Port Logistics", "IT_GEMS_LOGISTICS", ["Kolkata North", "Kolkata South", "Kolkata Central", "Port Area"], 700001),
        ("330", "Malda", "RURAL", 86.2, "TIER_2", "Malda Fazli / Himsagar Mangoes & Mulberry Raw Silk Reeling", "HORTICULTURE_SILK", ["English Bazar (Malda)", "Old Malda", "Habibpur", "Gazole", "Chanchal I", "Chanchal II", "Harischandrapur I", "Harischandrapur II", "Ratua I", "Ratua II", "Manikchak", "Kaliachak I", "Kaliachak II", "Kaliachak III"], 732101),
        ("331", "Murshidabad", "RURAL", 86.7, "TIER_2", "Murshidabad Silk Sarees, Brass Metal Utensils & Jute Mills", "SILK_BRASSWARE", ["Berhampore", "Jiaganj (Murshidabad)", "Lalgola", "Bhagabangola I", "Bhagabangola II", "Hariharpara", "Jalangi", "Domkal", "Raninagar I", "Raninagar II", "Kandi", "Khargram", "Burwan", "Bharatpur I", "Bharatpur II", "Nababganj", "Suti I", "Suti II", "Raghunathganj I", "Raghunathganj II", "Samserganj", "Farakka"], 742101),
        ("332", "Nadia", "SEMI_URBAN", 72.2, "TIER_2", "Shantipur / Phulia Handloom Tangail Cotton Sarees (G.I.)", "HANDLOOM", ["Krishnanagar I", "Krishnanagar II", "Shantipur", "Ranaghat I", "Ranaghat II", "Chakdaha", "Kalyani", "Haringhata", "Nakashipara", "Chapra", "Kaliganj", "Tehatta I", "Tehatta II", "Karimpur I", "Karimpur II", "Nabadwip", "Hanskhali"], 741101),
        ("333", "North 24 Parganas", "METROPOLITAN", 42.7, "TIER_1", "Marine Brackishwater Tiger Prawns, Jute Packaging & IT Sector V", "FISHERIES_JUTE_IT", ["Barasat I", "Barasat II", "Bidhannagar (Salt Lake)", "Rajarhat", "Barrackpore I", "Barrackpore II", "Basirhat I", "Basirhat II", "Baduria", "Deganga", "Habra I", "Habra II", "Gaighata", "Bongaon", "Bagdah", "Haroa", "Minakhan", "Hasnabad", "Hingalganj", "Sandeshkhali I", "Sandeshkhali II"], 700124),
        ("334", "Paschim Bardhaman", "SEMI_URBAN", 20.1, "TIER_1", "Asansol-Durgapur Heavy Steel Fabrication, Refractory & Alloy", "STEEL_ENGINEERING", ["Durgapur-Faridpur", "Kanksa", "Andal", "Pandabeswar", "Raniganj", "Jamuria", "Barabani", "Salanpur"], 713216),
        ("335", "Paschim Medinipur", "RURAL", 87.8, "TIER_3", "Madurkathi Reed Mats (G.I.) & Cashew Nut Shelling / Paddy", "HANDICRAFTS_AGRO", ["Midnapore (Medinipur)", "Kharagpur I", "Kharagpur II", "Debra", "Pingla (Pattachitra)", "Sabang", "Narayangarh", "Dantan I", "Dantan II", "Mohanpur", "Keshiary", "Garhbeta I", "Garhbeta II", "Garhbeta III", "Salboni", "Keshpur", "Chandrakona I", "Chandrakona II", "Ghatal", "Daspur I", "Daspur II"], 721101),
        ("336", "Purba Bardhaman", "RURAL", 84.8, "TIER_2", "Gobindobhog Aromatic Rice Milling (G.I.) & Bardhaman Sitabhog", "AGRO_FOOD", ["Burdwan I", "Burdwan II", "Katwa I", "Katwa II", "Kalna I", "Kalna II", "Memari I", "Memari II", "Ausgram I", "Ausgram II", "Bhatar", "Galsi I", "Galsi II", "Khandaghosh", "Raina I", "Raina II", "Jamalpur", "Monteswar", "Purbasthali I", "Purbasthali II", "Mongalkote", "Ketugram I", "Ketugram II"], 713101),
        ("337", "Purba Medinipur", "RURAL", 88.4, "TIER_2", "Marine Pomfret / Hilsa Seafood Export & Haldia Petrochemicals", "FISHERIES_CHEMICALS", ["Tamluk", "Haldia (Sutahata)", "Mahisadal", "Nandigram I", "Nandigram II", "Contai (Kanthi) I", "Contai II", "Contai III", "Egra I", "Egra II", "Ramnagar I (Digha)", "Ramnagar II", "Panskura", "Kolaghat", "Moyna", "Chandipur", "Bhagabanpur I", "Bhagabanpur II", "Khejuri I", "Khejuri II", "Patashpur I", "Patashpur II"], 721636),
        ("338", "Purulia", "RURAL", 87.3, "TIER_4", "Chhau Dance Lacquer Masks (G.I.) & Tussar Silk Cultivation", "HANDICRAFTS_SERICULTURE", ["Purulia I", "Purulia II", "Balarampur", "Baghmundi", "Jhalda I", "Jhalda II", "Arsha", "Joypur", "Manbazar I", "Manbazar II", "Barabazar", "Bandwan", "Kashipur", "Hura", "Puncha", "Para", "Raghunathpur I", "Raghunathpur II", "Neturia", "Santuri"], 723101),
        ("339", "South 24 Parganas", "SEMI_URBAN", 74.4, "TIER_2", "Sundarbans Wild Mangrove Honey & Marine Shrimp Farming", "HONEY_FISHERIES", ["Alipore (Thakurpukur)", "Budge Budge I", "Budge Budge II", "Bishnupur I", "Bishnupur II", "Sonarpur", "Baruipur", "Bhangar I", "Bhangar II", "Canning I", "Canning II", "Joynagar I", "Joynagar II", "Kultali", "Basanti", "Gosaba", "Diamond Harbour I", "Diamond Harbour II", "Falta (SEZ)", "Kulpi", "Kakdwip", "Namkhana", "Patharpratima", "Sagar (Island)", "Mandirbazar", "Mathurapur I", "Mathurapur II", "Magrahat I", "Magrahat II"], 700027),
        ("340", "Uttar Dinajpur", "RURAL", 87.9, "TIER_4", "Tulaipanji Rice Milling & Raiganj Jute Products / Tea", "AGRO_JUTE", ["Raiganj", "Hemtabad", "Kaliaganj", "Itahar", "Islampur", "Chopra", "Goalpokhar I", "Goalpokhar II", "Karandighi"], 733134)
    ]
    wb_districts = [format_district(code, name, urb, rur, tier, odop, cat, "Lower Gangetic Plains Region (Zone III)", "WBSEDCL Rural Feeder", blks, [f"{name} Rural", f"{blks[0]} GP"], pin) for code, name, urb, rur, tier, odop, cat, blks, pin in wb_names]
    states.append({"stateCode": "19", "stateName": "West Bengal", "territoryType": "STATE", "totalDistricts": 23, "districts": wb_districts})

    # 4. ODISHA (30)
    od_names = [
        ("341", "Angul", "SEMI_URBAN", 83.9, "TIER_3", "Aluminium Utensils Fabrication & Brass Work of Kantilo", "ALUMINIUM_BRASS", ["Angul", "Talcher", "Chhendipada", "Pallahara", "Athmallik", "Banarpal", "Kishorenagar", "Kaniha"], 759122),
        ("342", "Balangir", "RURAL", 88.0, "TIER_4", "Sambalpuri Bomkai Handloom Weaving & Cotton Baling", "HANDLOOM_AGRO", ["Balangir", "Patnagarh", "Titilagarh", "Kantabanji", "Saintala", "Belpada", "Deogaon", "Gudvella", "Khaprakhol", "Loisingha", "Muribahal", "Puintala", "Turekela", "Bangomunda"], 767001),
        ("343", "Balasore", "SEMI_URBAN", 89.1, "TIER_3", "Marine Seafood Processing, Coir Rope & Stone Utensils", "FISHERIES_HANDICRAFTS", ["Balasore Sadar", "Remuna", "Basta", "Jaleswar", "Bhograi", "Baliapal", "Soro", "Simulia", "Nilagiri", "Oupada", "Khaira", "Bahanaga"], 756001),
        ("344", "Bargarh", "RURAL", 89.9, "TIER_3", "Sambalpuri Handloom Ikat Sarees (G.I.) & Paddy Milling", "HANDLOOM_AGRO", ["Bargarh", "Barpali", "Attabira", "Bhatli", "Bheden", "Sohela", "Ambabhona", "Bijepur", "Gaisilet", "Jharbandh", "Padampur", "Paikmal", "Rajborasambar"], 768028),
        ("345", "Bhadrak", "RURAL", 87.7, "TIER_3", "Freshwater Aquaculture Prawn Processing & Brass Idols", "FISHERIES_BRASS", ["Bhadrak", "Basudevpur", "Chandbali", "Dhamnagar", "Bonth", "Bhandaripokhari", "Tihidi"], 756100),
        ("346", "Boudh", "RURAL", 95.3, "TIER_5", "Handloom Cotton Fabrics & Minor Forest Mahua / Tendu", "HANDLOOM_FOREST", ["Boudh", "Harbhanga", "Kantamal"], 762014),
        ("347", "Cuttack", "SEMI_URBAN", 72.0, "TIER_1", "Cuttack Silver Filigree (Tarakasi G.I.) & Horn Handicrafts", "JEWELLERY_HANDICRAFTS", ["Cuttack Sadar", "Choudwar", "Baranga", "Athagarh", "Tigiria", "Badamba", "Narasinghpur", "Banki", "Banki-Dampada", "Salepur", "Mahanga", "Nischintakoili", "Niali", "Kantapada", "Tangi-Choudwar"], 753001),
        ("348", "Deogarh", "RURAL", 92.8, "TIER_5", "Raw Honey & Forest Minor Produce / Paddy Parboiling", "FOREST_AGRO", ["Deogarh (Debagarh)", "Barkote", "Reamal"], 768108),
        ("349", "Dhenkanal", "RURAL", 89.5, "TIER_3", "Dokra Brass Metal Casting & Bell Metal Ware of Bhuban", "HANDICRAFTS", ["Dhenkanal Sadar", "Bhuban", "Gondia", "Kamakhyanagar", "Kankadahad", "Hindol", "Odapada", "Parjang"], 759001),
        ("350", "Gajapati", "RURAL", 87.8, "TIER_5", "Soura Tribal Paintings (Idital) & Pineapple / Cashew", "HANDICRAFTS_AGRO", ["Paralakhemundi", "Kashinagar", "Mohana", "R.Udayagiri", "Gumma", "Nuagada", "Rayagada"], 761200),
        ("351", "Ganjam", "SEMI_URBAN", 78.2, "TIER_2", "Kewda Flower Attar Essence (G.I.), Brass Fish & Berhampur Silk", "PERFUMERY_SILK", ["Berhampur", "Chhatrapur", "Hinjilicut", "Bhanjanagar", "Aska (Sugar)", "Bellaguntha", "Buguda", "Ganjam", "Chikiti", "Digapahandi", "Sanakhemundi", "Purushottampur", "Polasara", "Khalikote", "Kabisuryanagar", "Surada", "Dharakote", "Jagannathprasad", "Rangeilunda", "Patrapur", "Sheragada", "Kukudakhandi"], 760001),
        ("352", "Jagatsinghpur", "RURAL", 89.8, "TIER_3", "Paradeep Port Seafood Exports & Golden Grass Crafts", "FISHERIES_HANDICRAFTS", ["Jagatsinghpur", "Paradeep (Kujang)", "Erasama", "Balikuda", "Naugaon", "Biridi", "Raghunathpur", "Tirtol"], 754103),
        ("353", "Jajpur", "SEMI_URBAN", 92.6, "TIER_2", "Tussar Silk Weaving of Gopalpur & Kalinganagar Steel", "SERICULTURE_STEEL", ["Jajpur Town", "Jajpur Road (Vyasanagar)", "Binjharpur", "Bari", "Korei", "Sukinda (Chromite)", "Danagadi", "Dharmasala", "Rasulpur", "Badachana"], 755001),
        ("354", "Jharsuguda", "SEMI_URBAN", 60.1, "TIER_2", "Aluminium Wire Rods, Brass Bell Metal & Thermal Spares", "ALUMINIUM_ENGINEERING", ["Jharsuguda", "Brajarajnagar", "Belpahar", "Lakhanpur", "Kolabira", "Laikera", "Kirmira"], 768201),
        ("355", "Kalahandi", "RURAL", 92.3, "TIER_4", "Habaspuri Cotton Sarees (G.I.) & Cotton Baling / Rice", "HANDLOOM_AGRO", ["Bhawanipatna", "Dharamgarh", "Junagarh", "Kesinga", "Jaipatna", "Golamunda", "Koksara", "Karlamunda", "Lanjigarh", "Madanpur Rampur", "Narla", "Kalampur", "Thuamul Rampur"], 766001),
        ("356", "Kandhamal", "RURAL", 90.0, "TIER_5", "Kandhamal Haldi (Organic Turmeric G.I.) & Spices / Coffee", "SPICES_AGRO", ["Phulbani", "G.Udayagiri", "Baliguda", "Daringbadi (Kashmir of Odisha)", "K.Nuagaon", "Kotagarh", "Tikabali", "Chakapada", "Khajuripada", "Phiringia", "Raikia", "Tumudibandha"], 762001),
        ("357", "Kendrapara", "RURAL", 94.2, "TIER_3", "Golden Grass (Kaincha Crafts G.I.) & Prawn Cold Chain", "HANDICRAFTS_FISHERIES", ["Kendrapara", "Pattamundai", "Aul", "Rajkanika", "Rajnagar (Bhitarkanika)", "Derabish", "Garadpur", "Mahakalapada", "Marsaghai"], 754211),
        ("358", "Kendujhar", "RURAL", 86.0, "TIER_3", "Keonjhar Badi (Sun-Dried Lentil Nuggets) & Iron Mining Spares", "FOOD_MINERAL", ["Keonjhar (Kendujhar)", "Barbil", "Joda", "Champua", "Anandapur", "Ghasipura", "Hatadihi", "Harichandanpur", "Ghatgaon (Tarini)", "Patana", "Saharpada", "Banspal", "Jhumpura", "Telkoi"], 758001),
        ("359", "Khordha", "METROPOLITAN", 51.9, "TIER_1", "Applique Work of Pipili, Stone Sculptures & IT Hub", "HANDICRAFTS_IT", ["Bhubaneswar", "Khordha", "Jatni", "Pipili", "Begunia", "Bolagarh", "Banapur", "Chilika", "Tangi", "Balianta", "Balipatna"], 751001),
        ("360", "Koraput", "RURAL", 83.6, "TIER_4", "Koraput Organic Arabica Coffee, Ginger & Tribal Millets", "AGRO_PLANTATION", ["Koraput", "Jeypore", "Sunabeda (Aero HAL)", "Damanjodi (NALCO)", "Kotpad (Handloom G.I.)", "Semiliguda", "Pottangi", "Kundura", "Boipariguda", "Borigumma", "Dasamantapur", "Laxmipur", "Bandhugaon", "Narayanpatna"], 764020),
        ("361", "Malkangiri", "RURAL", 92.0, "TIER_6", "Bonda Tribal Weaving, Finger Millets (Mandia) & Fish", "AGRO_HANDLOOM", ["Malkangiri", "Mathili", "Kalimela", "Korukonda", "Kudumulu Gumma", "Podia", "Chitrakonda (Swabhiman Anchal)"], 764045),
        ("362", "Mayurbhanj", "RURAL", 92.3, "TIER_4", "Mayurbhanj Sabai Grass Crafts, Dokra Art & Honey", "HANDICRAFTS_FOREST", ["Baripada", "Rairangpur", "Karanjia", "Udala", "Betnoti", "Badasahi", "Bangriposi", "Kuliana", "Morada", "Rasgovindpur", "Saraskana", "Suliapada", "Samakhunta", "Shamakhunta", "Tiring", "Bahalda", "Jamda", "Kusumi", "Bijatala", "Raruan", "Sukruli", "Jashipur", "Khunta", "Gopabandhunagar", "Kaptipada"], 757001),
        ("363", "Nabarangpur", "RURAL", 93.0, "TIER_5", "Lac Lacquer Craft & Maize / Cashew Nut Processing", "HANDICRAFTS_AGRO", ["Nabarangpur", "Umerkote", "Raighar", "Jharigam", "Chandahandi", "Dabugam", "Paparahandi", "Kosagumuda", "Nandahandi", "Tentulikhunti"], 764059),
        ("364", "Nayagarh", "RURAL", 91.0, "TIER_4", "Nayagarh Chenna Poda (Baked Cheese Sweet G.I.) & Brassware", "FOOD_BRASSWARE", ["Nayagarh", "Khandapada (Kantilo)", "Daspalla", "Ranpur", "Odagaon", "Nuagaon", "Gania", "Bhapur"], 752069),
        ("365", "Nuapada", "RURAL", 94.0, "TIER_5", "Minor Forest Produce (Mahua, Lac) & Cotton Processing", "FOREST_AGRO", ["Nuapada", "Khariar", "Komna", "Boden", "Sinapali"], 766105),
        ("366", "Puri", "SEMI_URBAN", 84.3, "TIER_2", "Raghurajpur Pattachitra Paintings (G.I.) & Coir Crafts", "HANDICRAFTS_COIR", ["Puri", "Pipili", "Satyabadi (Sakshigopal)", "Nimapada", "Gop", "Kakatpur", "Astaranga", "Delanga", "Kanas", "Brahmagiri", "Krushnaprasad (Chilika)"], 752001),
        ("367", "Rayagada", "RURAL", 84.8, "TIER_5", "Dongria Kondh Shawls (Kapdaganda G.I.) & Paper Mill Pulp", "HANDLOOM_WOOD", ["Rayagada", "Gunupur", "Bissam Cuttack", "Muniguda", "Padmapur", "Gudari", "Kashipur", "Kolnara", "Kalyansinghpur", "Ramanaguda", "Chandrapur"], 765001),
        ("368", "Sambalpur", "SEMI_URBAN", 70.4, "TIER_2", "Sambalpuri Tie & Dye Ikat Textiles (G.I.) & Engineering", "TEXTILES_ENGINEERING", ["Sambalpur", "Rengali", "Burla (Hirakud)", "Kuchinda", "Redhakhol", "Jujomura", "Maneswar", "Dhankauda", "Jamankira", "Bamra"], 768001),
        ("369", "Subarnapur", "RURAL", 91.8, "TIER_4", "Sonepuri Silk & Terracotta Red Clay Crafts", "SILK_HANDICRAFTS", ["Sonepur (Subarnapur)", "Birmaharajpur", "Ullunda", "Binka", "Dunguripali", "Tarva"], 767017),
        ("370", "Sundargarh", "SEMI_URBAN", 64.7, "TIER_2", "Rourkela Steel Plant Secondary Fabrication & Tribal Lac", "STEEL_ENGINEERING", ["Rourkela (Panposh)", "Sundargarh", "Rajgangpur", "Biramitrapur", "Bonai", "Kutra", "Bargaon", "Subdega", "Balishankara", "Hemgir", "Lephripara", "Tangarpali", "Koida", "Lahunipara", "Gurpang", "Nuagaon", "Bisra", "Lathikata"], 770001)
    ]
    od_districts = [format_district(code, name, urb, rur, tier, odop, cat, "East Coast Plains and Hills Region (Zone XI)", "TPCODL / TPNODL / TPSODL / TPWODL Feeder", blks, [f"{name} Rural", f"{blks[0]} GP"], pin) for code, name, urb, rur, tier, odop, cat, blks, pin in od_names]
    states.append({"stateCode": "21", "stateName": "Odisha", "territoryType": "STATE", "totalDistricts": 30, "districts": od_districts})

    # 5. ASSAM (35)
    as_names = [
        ("278", "Bajali", "RURAL", 91.0, "TIER_4", "Traditional Brass Metal Works & Handloom Mustard Oil", "BRASSWARE_AGRO", ["Pathsala", "Bajali", "Bhowanipur", "Sarupeta"], 781325),
        ("279", "Baksa", "RURAL", 98.7, "TIER_5", "Bodo Handwoven Dokhona Textiles & Organic Lemon", "HANDLOOM_HORTICULTURE", ["Mushalpur", "Barama", "Tamulpur", "Goreswar", "Jalah", "Baganpara", "Dhamdhama"], 781372),
        ("280", "Barpeta", "RURAL", 91.3, "TIER_4", "Sarthebari Bell Metal Handicrafts (G.I.) & Mustard Oil", "BRASSWARE_AGRO", ["Barpeta", "Sarthebari", "Howly", "Bhabanipur", "Chenga", "Mandia", "Gobarhana", "Rupshi"], 781301),
        ("281", "Biswanath", "RURAL", 90.0, "TIER_4", "Biswanath CTC Tea & Organic Turmeric / Dairy", "TEA_AGRO", ["Biswanath Chariali", "Gohpur", "Helem", "Behali", "Chaiduar", "Baghmara"], 784176),
        ("282", "Bongaigaon", "SEMI_URBAN", 85.1, "TIER_3", "Petrochemical Derivatives & Brass Bell Metal Ware", "CHEMICALS_HANDICRAFTS", ["Bongaigaon", "Abhayapuri", "Boitamari", "Srijangram", "Dangtol", "Manikpur"], 783380),
        ("283", "Cachar", "SEMI_URBAN", 81.8, "TIER_2", "Silchar Tea Blending, Sitalpati Bamboo Mats & Rice Mills", "TEA_HANDICRAFTS", ["Silchar", "Lakhipur", "Sonai", "Katigorah", "Borkhola", "Udarbond", "Salchapra", "Binnakandi"], 788001),
        ("284", "Charaideo", "RURAL", 92.0, "TIER_4", "Orthodox Black Tea Processing & Historical Eco-Tourism", "TEA_ECOTOURISM", ["Sonari", "Mahmora", "Sapekhati", "Charaideo"], 785690),
        ("285", "Chirang", "RURAL", 92.7, "TIER_5", "Kaji Nemu (Assam Lemon G.I.) & Bodo Handloom Weaving", "HORTICULTURE_HANDLOOM", ["Kajalgaon", "Bijni", "Sidli", "Borobazar"], 783385),
        ("286", "Darrang", "RURAL", 94.0, "TIER_4", "Mustard Seed Oil Extraction & Jute Fiber Processing", "AGRO_PROCESSING", ["Mangaldai", "Kharupetia", "Sipajhar", "Dalgaon", "Kalaigaon", "Pub-Mangaldai"], 784125),
        ("287", "Dhemaji", "RURAL", 93.0, "TIER_5", "Muga Golden Silk Reeling & Mustard / Sticky Rice", "SERICULTURE_AGRO", ["Dhemaji", "Jonai", "Silapathar", "Gogamukh", "Sissiborgaon", "Bordoloni", "Machkhowa"], 787057),
        ("288", "Dhubri", "RURAL", 89.6, "TIER_4", "Terracotta Pottery of Asharikandi (G.I.) & Jute Products", "POTTERY_JUTE", ["Dhubri", "Gauripur", "Golakganj", "Bilasipara", "Chapar", "Agomoni", "Mahamaya"], 783301),
        ("289", "Dibrugarh", "SEMI_URBAN", 81.6, "TIER_2", "CTC & Orthodox Tea Manufacturing & Natural Gas / Petrochem", "TEA_CHEMICALS", ["Dibrugarh", "Naharkatia", "Chabua", "Tingkhong", "Moran", "Barbaruah", "Khowang"], 786001),
        ("290", "Dima Hasao", "RURAL", 68.4, "TIER_5", "Ginger Processing & Dimasa Traditional Handloom Textiles", "SPICES_HANDLOOM", ["Haflong", "Maibang", "Umrangso", "Mahur", "Diyungbra", "Harangajao"], 788819),
        ("291", "Goalpara", "RURAL", 86.3, "TIER_4", "Assam Banana Products & Bamboo Utility Basketry", "AGRO_FOREST", ["Goalpara", "Dudhnoi", "Matia", "Balijana", "Lakhipur", "Rangjuli", "Kharmuza"], 783101),
        ("292", "Golaghat", "RURAL", 90.8, "TIER_3", "Kaziranga Organic Tea, Sugarcane Molasses & Numaligarh Poly", "TEA_CHEMICALS", ["Golaghat", "Bokakhat", "Sarupathar", "Dergaon", "Morongi", "Kakodonga", "Gamariguri"], 785621),
        ("293", "Hailakandi", "RURAL", 92.7, "TIER_4", "Arecanut Processing & Shitalpati Cane Craft / Tea", "AGRO_HANDICRAFTS", ["Hailakandi", "Algapur", "Lala", "Katlicherra", "South Hailakandi"], 788151),
        ("294", "Hojai", "RURAL", 85.0, "TIER_3", "Agarwood Oil (Oud Essential Oil) Distillation & Sugarcane", "AROMATICS_AGRO", ["Hojai", "Doboka", "Lanka", "Dhalpukhuri", "Lumding"], 782435),
        ("295", "Jorhat", "SEMI_URBAN", 79.9, "TIER_2", "Muga Silk Spinning, Tea Research Blends & Majuli Masks", "SERICULTURE_TEA", ["Jorhat", "Mariani", "Titabar", "Teok", "Kaliapani", "North West Jorhat", "Baghchung"], 785001),
        ("296", "Kamrup Metropolitan", "METROPOLITAN", 17.3, "TIER_1", "Information Technology, Assam Silk Textiles & Engineering", "IT_TEXTILES_ENGINEERING", ["Guwahati", "Dispur", "Chandrapur", "Sonapur", "Azara"], 781001),
        ("297", "Kamrup Rural", "RURAL", 90.6, "TIER_3", "Sualkuchi Silk Weaving (Manchester of Assam G.I.) & Brass", "SILK_HANDLOOM", ["Amingaon", "Sualkuchi", "Hajo", "Rangia", "Chaygaon", "Boko", "Kamalpur", "Palasbari", "Bezera"], 781031),
        ("298", "Karbi Anglong", "RURAL", 88.2, "TIER_5", "Organic Karbi Ginger (G.I.) & Traditional Karbi Textiles", "SPICES_HANDLOOM", ["Diphu", "Bokajan", "Howraghat", "Manja", "Rongmongwe", "Lumbajong", "Samelangso"], 782460),
        ("299", "Karimganj", "RURAL", 91.0, "TIER_4", "Shitalpati Water Reed Mats & Rubber Latex Processing", "HANDICRAFTS_RUBBER", ["Karimganj", "Badarpur", "Patharkandi", "Ramkrishna Nagar", "South Karimganj", "North Karimganj"], 788710),
        ("300", "Kokrajhar", "RURAL", 93.8, "TIER_4", "Bodo Traditional Handloom Weaving & Bamboo Shoot Processing", "HANDLOOM_AGRO", ["Kokrajhar", "Gossaigaon", "Dotma", "Kachugaon", "Titaguri", "Hatidhura"], 783370),
        ("301", "Lakhimpur", "RURAL", 91.2, "TIER_4", "Eri Silk (Ahimsa Silk) Spinning & Kaji Nemu Citrus Juice", "SERICULTURE_HORTICULTURE", ["North Lakhimpur", "Dhakuakhana", "Bihpuria", "Narayanpur", "Nowboicha", "Ghilamara", "Karunabari"], 787001),
        ("302", "Majuli", "RURAL", 100.0, "TIER_5", "Majuli Heritage Bamboo Masks & Organic Komal Saul Rice", "HANDICRAFTS_AGRO", ["Garamur (Majuli)", "Kamalabari", "Jengraimukh", "Ujoni Majuli"], 785104),
        ("303", "Morigaon", "RURAL", 92.3, "TIER_4", "Tiwaship Handloom Weaving & Freshwater Fish Breeding", "HANDLOOM_FISHERIES", ["Morigaon", "Jagiroad (Paper/Dry Fish)", "Laharighat", "Bhuragaon", "Mayong (Magic Heritage)", "Kapili"], 782105),
        ("304", "Nagaon", "SEMI_URBAN", 87.0, "TIER_2", "Nagaon Jute Mills Products, Mustard Seed & Tea Blending", "JUTE_AGRO", ["Nagaon", "Kaliabor", "Raha", "Samaguri", "Batadrava", "Dhing", "Rupahihat", "Pakhimoria", "Barhampur"], 782001),
        ("305", "Nalbari", "RURAL", 89.4, "TIER_4", "Nalbari Jaapi (Traditional Conical Bamboo Hat) & Bell Metal", "HANDICRAFTS", ["Nalbari", "Tihu", "Barkshetri", "Paschim Nalbari", "Barbhag", "Pub Nalbari", "Madupur"], 781335),
        ("306", "Sivasagar", "SEMI_URBAN", 90.4, "TIER_3", "Crude Oil Engineering Ancillaries & Muga Raw Silk Weaving", "ENGINEERING_SILK", ["Sivasagar", "Nazira", "Amguri", "Demow", "Gaurisagar"], 785640),
        ("307", "Sonitpur", "SEMI_URBAN", 85.0, "TIER_2", "Tezpur Litchi (G.I.), CTC Tea Processing & Citrus Juice", "HORTICULTURE_TEA", ["Tezpur", "Dhekiajuli", "Rangapara", "Borangabari", "Gabharu", "Naduar", "Balipara"], 784001),
        ("308", "South Salmara-Mankachar", "RURAL", 96.0, "TIER_5", "Jute Craft & Mustard Seed Oil Processing", "JUTE_AGRO", ["Hatsingimari", "Mankachar", "South Salmara", "Fekamari"], 783135),
        ("763", "Tamulpur", "RURAL", 97.0, "TIER_5", "Betel Nut (Tamul) Processing & Handloom Fabrics", "AGRO_HANDLOOM", ["Tamulpur", "Goreswar", "Nagrijuli", "Kumarikata"], 781367),
        ("309", "Tinsukia", "SEMI_URBAN", 80.1, "TIER_2", "Digboi Petrochemical Refining, Plywood & Organic Tea", "CHEMICALS_WOOD_TEA", ["Tinsukia", "Digboi", "Margherita", "Doomdooma", "Sadiya", "Kakopathar", "Guijan"], 786125),
        ("310", "Udalguri", "RURAL", 95.5, "TIER_5", "Organic CTC Tea & Bodo Traditional Handwoven Shawls", "TEA_HANDLOOM", ["Udalguri", "Tangla", "Rowta", "Bhergaon", "Kalaigaon", "Mazbat", "Harisinga"], 784509),
        ("311", "West Karbi Anglong", "RURAL", 94.0, "TIER_5", "Organic Karbi Ginger, Turmeric & Broom Grass Products", "SPICES_AGRO", ["Hamren", "Donkamukam", "Baithalangso", "Chinthong", "Socheng"], 782486)
    ]
    as_districts = [format_district(code, name, urb, rur, tier, odop, cat, "Eastern Himalayan Region (Zone II)", "APDCL Rural / Urban Feeder", blks, [f"{name} Rural", f"{blks[0]} GP"], pin) for code, name, urb, rur, tier, odop, cat, blks, pin in as_names]
    states.append({"stateCode": "18", "stateName": "Assam", "territoryType": "STATE", "totalDistricts": 35, "districts": as_districts})

    # 6. ARUNACHAL PRADESH (26)
    ar_names = [
        ("230", "Anjaw", "RURAL", 95.8, "TIER_5", "Large Cardamom & Kiwi Fruit Processing / Wild Honey", "AGRO_HORTICULTURE", ["Hawai", "Hayuliang", "Manchal", "Chaglagam", "Walong"], 792104),
        ("231", "Changlang", "RURAL", 86.4, "TIER_4", "Tea & Arecanut Processing / Bamboo Crafts", "AGRO_FOREST", ["Changlang", "Miao", "Jairampur", "Bordumsa", "Diyun"], 792120),
        ("232", "Dibang Valley", "RURAL", 94.2, "TIER_6", "Mishmi Teeta (Coptis Teeta) & Organic Kiwi", "MEDICINAL_AGRO", ["Anini", "Etalin", "Anelih", "Kronli", "Mipi"], 792101),
        ("233", "East Kameng", "RURAL", 82.5, "TIER_5", "Orange & Ginger Processing / Cane Baskets", "HORTICULTURE", ["Seppa", "Chayang Tajo", "Bameng", "Pakke Kessang", "Sawa"], 790102),
        ("234", "East Siang", "RURAL", 72.3, "TIER_4", "Pasighat Citrus Mandarins & Ginger / Rice Milling", "AGRO_PROCESSING", ["Pasighat", "Mebo", "Ruksin", "Sille-Oyan", "Bilat"], 791102),
        ("718", "Kamle", "RURAL", 92.0, "TIER_5", "Large Cardamom & Wild Forest Honey", "AGRO_FOREST", ["Raga", "Dollungmukh", "Puchigeko", "Giba", "Kamporijo"], 791120),
        ("719", "Kra Daadi", "RURAL", 94.0, "TIER_6", "Organic Millets & Traditional Nyishi Handloom", "HANDLOOM_AGRO", ["Palin", "Jamin", "Chambang", "Gangte", "Tali"], 791118),
        ("235", "Kurung Kumey", "RURAL", 95.0, "TIER_6", "Handwoven Traditional Textiles & Large Cardamom", "HANDLOOM", ["Koloriang", "Nyapin", "Sangram", "Damin", "Sarli"], 791118),
        ("720", "Leparada", "RURAL", 88.0, "TIER_5", "Basar Large Cardamom & Organic Pineapples", "AGRO_PROCESSING", ["Basar", "Tirbin", "Daring", "Sago"], 791101),
        ("236", "Lohit", "RURAL", 78.0, "TIER_4", "Mustard Oil Extraction & Tezu Ginger Products", "AGRO_PROCESSING", ["Tezu", "Sunpura", "Wakro", "Alubari"], 792001),
        ("662", "Longding", "RURAL", 89.0, "TIER_5", "Wancho Wood Carvings & Large Cardamom / Millet Wine", "HANDICRAFTS", ["Longding", "Kanubari", "Pangchao", "Wakka", "Pumao"], 792131),
        ("237", "Lower Dibang Valley", "RURAL", 75.0, "TIER_4", "Organic Ginger, Mustard & Mustard Oil Processing", "AGRO_PROCESSING", ["Roing", "Dambuk", "Hunli", "Koronu", "Desali"], 792110),
        ("721", "Lower Siang", "RURAL", 86.0, "TIER_5", "Orange Orchards & Pineapple Pulp Extraction", "HORTICULTURE", ["Likabali", "Gensi", "Kangku", "Nari-Koyu"], 791125),
        ("238", "Lower Subansiri", "RURAL", 80.0, "TIER_4", "Ziro Kiwi Fruit Wine & Apatani Handloom Textiles", "HORTICULTURE_TEXTILE", ["Ziro", "Yachuli", "Pistana", "Old Ziro", "Talo"], 791120),
        ("663", "Namsai", "RURAL", 79.0, "TIER_4", "Khamti Sticky Rice & Tea / Bamboo Products", "AGRO_PROCESSING", ["Namsai", "Chongkham", "Mahadevpur", "Piyong", "Lathao"], 792103),
        ("722", "Pakke Kessang", "RURAL", 91.0, "TIER_5", "Organic Ginger & Eco-Tourism / Cane Furniture", "AGRO_ECOTOURISM", ["Lemmi", "Pakke Kessang", "Seijosa", "Dissing Passo", "Pizirang"], 790103),
        ("239", "Papum Pare", "SEMI_URBAN", 52.0, "TIER_3", "Bamboo Shoot Value Addition, Bakery & Food Processing", "AGRO_PROCESSING", ["Yupia", "Naharlagun", "Doimukh", "Balijan", "Sagalee"], 791112),
        ("723", "Shi Yomi", "RURAL", 94.0, "TIER_6", "Apple Orchards, Walnut & Memba Traditional Weaving", "HORTICULTURE", ["Tato", "Mechuka", "Pidi", "Monigong"], 791003),
        ("664", "Siang", "RURAL", 90.0, "TIER_5", "Organic Oranges & Large Cardamom Processing", "HORTICULTURE", ["Boleng", "Pangin", "Rumgong", "Kaying", "Jembing"], 791102),
        ("240", "Tawang", "RURAL", 76.0, "TIER_4", "Monpa Handmade Paper (Mon Shugu) & Woolen Carpets", "HANDICRAFTS", ["Tawang", "Jang", "Lumla", "Zemithang", "Mukto"], 790104),
        ("241", "Tirap", "RURAL", 84.0, "TIER_5", "Nocte Beadwork Jewelry & Black Pepper / Tea", "HANDICRAFTS_AGRO", ["Khonsa", "Deomali", "Namsang", "Dadam", "Lazu"], 792128),
        ("242", "Upper Siang", "RURAL", 92.0, "TIER_5", "Orange Juice Extracts & High Altitude Honey", "AGRO_PROCESSING", ["Yingkiong", "Mariyang", "Tuting", "Geku", "Katan"], 791002),
        ("243", "Upper Subansiri", "RURAL", 88.0, "TIER_5", "Tagin Handloom Weaving & Ginger Powder Processing", "HANDLOOM_AGRO", ["Daporijo", "Dumporijo", "Gite Ripa", "Puchigeko", "Taliha"], 791122),
        ("244", "West Kameng", "RURAL", 77.0, "TIER_4", "Dirang Apples, Kiwi Wine & Buddhist Thanka Art", "HORTICULTURE_CRAFT", ["Bomdila", "Dirang", "Rupa", "Singchung", "Kalaktang"], 790101),
        ("245", "West Siang", "RURAL", 79.0, "TIER_4", "Pineapple Juice Processing & Galo Woven Ponge", "AGRO_HANDLOOM", ["Aalo", "Kamba", "Liromoba", "Darak", "Yomcha"], 791001),
        ("724", "Itanagar Capital Complex", "URBAN", 15.0, "TIER_3", "Ethnic Apparel Design, Food Packaging & Printing", "TEXTILE_FOOD", ["Itanagar", "Naharlagun", "Banderdewa"], 791111)
    ]
    ar_districts = [format_district(code, name, urb, rur, tier, odop, cat, "Eastern Himalayan Region (Zone II)", "Department of Power Arunachal Feeder", blks, [f"{name} Rural", f"{blks[0]} GP"], pin) for code, name, urb, rur, tier, odop, cat, blks, pin in ar_names]
    states.append({"stateCode": "12", "stateName": "Arunachal Pradesh", "territoryType": "STATE", "totalDistricts": 26, "districts": ar_districts})

    # 7. MANIPUR (16)
    mn_names = [
        ("254", "Bishnupur", "RURAL", 62.7, "TIER_4", "Loktak Lake Freshwater Smoked Fish & Kauna Reed Craft", "FISHERIES_HANDICRAFTS", ["Bishnupur", "Moirang", "Nambol"], 795126),
        ("255", "Chandel", "RURAL", 86.8, "TIER_5", "Organic Ginger, Turmeric & Anal Naga Handwoven Shawls", "SPICES_HANDLOOM", ["Chandel", "Machi", "Tengnoupal"], 795127),
        ("256", "Churachandpur", "RURAL", 74.5, "TIER_4", "Ginger Processing, Pineapple Value Addition & Chin Shawls", "AGRO_HANDLOOM", ["Churachandpur", "Singngat", "Thanlon", "Tipaimukh", "Samulamlan", "Henglep"], 795128),
        ("257", "Imphal East", "SEMI_URBAN", 59.9, "TIER_2", "Kouna Grass Mat Weaving & Manipuri Black Rice (Chak-Hao)", "HANDICRAFTS_AGRO", ["Porompat", "Sawombung", "Keirao Bitra"], 795005),
        ("258", "Imphal West", "METROPOLITAN", 37.8, "TIER_2", "Chak-Hao Black Aromatic Rice (G.I.) & Handloom Phanek", "AGRO_HANDLOOM", ["Lamphelpat", "Patsoi", "Wangoi", "Lamsang"], 795004),
        ("764", "Jiribam", "RURAL", 65.0, "TIER_4", "Ginger Processing & Rubber Processing / Bamboo Shoot", "AGRO_RUBBER", ["Jiribam", "Borobekra"], 795116),
        ("765", "Kakching", "SEMI_URBAN", 63.0, "TIER_3", "Paddy Milling & Blacksmith Agriculture Implements", "AGRO_METALS", ["Kakching", "Waikhong"], 795103),
        ("766", "Kamjong", "RURAL", 94.0, "TIER_6", "King Chilli (U-Morok) & Tangkhul Naga Traditional Weaving", "SPICES_HANDLOOM", ["Kamjong", "Sahamphung", "Kasom Khullen", "Phungyar"], 795145),
        ("767", "Kangpokpi", "RURAL", 88.0, "TIER_5", "Large Cardamom & Organic Turmeric / Dairy Products", "SPICES_DAIRY", ["Kangpokpi", "Saikul", "Saitu Gamphazol", "Champhai", "Kangchup Geljang"], 795129),
        ("768", "Noney", "RURAL", 92.0, "TIER_5", "Orange Juice Processing & Bamboo Cane Furniture", "HORTICULTURE_FOREST", ["Noney (Longmai)", "Nungba", "Khoupum", "Haochong"], 795159),
        ("769", "Pherzawl", "RURAL", 95.0, "TIER_6", "Organic Ginger & King Chilli Processing", "SPICES", ["Pherzawl", "Thanlon", "Parbung", "Vangai"], 795143),
        ("259", "Senapati", "RURAL", 98.2, "TIER_5", "Mao Naga Organic Potato, Kiwi & Handloom Textiles", "AGRO_HANDLOOM", ["Senapati", "Mao-Maram", "Paomata", "Purul", "Willong"], 795106),
        ("260", "Tamenglong", "RURAL", 85.0, "TIER_5", "Tamenglong Mandarin Oranges (G.I.) & Bamboo Crafts", "HORTICULTURE_FOREST", ["Tamenglong", "Tamei", "Tousem", "Khongsang"], 795141),
        ("770", "Tengnoupal", "RURAL", 82.0, "TIER_5", "Moreh Border Trade Logistics & Wood Carving Handicrafts", "LOGISTICS_HANDICRAFTS", ["Tengnoupal", "Moreh (Border)", "Machi"], 795131),
        ("261", "Thoubal", "SEMI_URBAN", 64.9, "TIER_3", "Handloom Silk/Cotton Weaving & Fresh Pineapple Processing", "HANDLOOM_HORTICULTURE", ["Thoubal", "Lilong", "Kakching"], 795138),
        ("262", "Ukhrul", "RURAL", 85.6, "TIER_4", "Kachai Lemon (G.I.), Sirarakhong Hathei Chilli & Black Pottery", "HORTICULTURE_POTTERY", ["Ukhrul", "Chingai", "Lungchong Meiphai", "Khangkhui"], 795142)
    ]
    mn_districts = [format_district(code, name, urb, rur, tier, odop, cat, "Eastern Himalayan Region (Zone II)", "MSPDCL Rural Feeder", blks, [f"{name} Rural", f"{blks[0]} GP"], pin) for code, name, urb, rur, tier, odop, cat, blks, pin in mn_names]
    states.append({"stateCode": "14", "stateName": "Manipur", "territoryType": "STATE", "totalDistricts": 16, "districts": mn_districts})

    # 8. MEGHALAYA (12)
    ml_names = [
        ("263", "East Garo Hills", "RURAL", 86.0, "TIER_5", "Arecanut Processing, Black Pepper & Pineapple Canning", "AGRO_PROCESSING", ["Williamnagar", "Samanda", "Songsak", "Dambo Rongjeng"], 794111),
        ("771", "Eastern West Khasi Hills", "RURAL", 92.0, "TIER_5", "Organic Ginger Processing & Handwoven Khasi Woolens", "SPICES_HANDLOOM", ["Mairang", "Mawthadraishan"], 793120),
        ("264", "East Jaintia Hills", "RURAL", 90.0, "TIER_5", "Khasi Mandarin Orange & Minor Forest Cinnamon / Coal", "HORTICULTURE_MINERAL", ["Khliehriat", "Saipung"], 793200),
        ("265", "East Khasi Hills", "SEMI_URBAN", 55.6, "TIER_2", "Sohra (Cherrapunji) Honey, Khasi Mandarins & IT/Tourism", "HONEY_HORTICULTURE", ["Shillong", "Mawkynrew", "Mawphlang", "Mylliem", "Pynursla", "Shella Bholaganj (Sohra)", "Mawryngkneng", "Mawsynram", "Khatarshnong Laitkroh"], 793001),
        ("266", "North Garo Hills", "RURAL", 93.0, "TIER_5", "Garo Traditional Handloom (Dakmanda) & Banana Products", "HANDLOOM_AGRO", ["Resubelpara", "Bajengdoba", "Kharkutta"], 794108),
        ("267", "Ri Bhoi", "RURAL", 90.2, "TIER_4", "Eri Silk (Ryndia G.I. Natural Dye) & Organic Ginger / Pineapple", "SERICULTURE_SPICES", ["Nongpoh", "Umling", "Umsning", "Bhoirymbong"], 793102),
        ("268", "South Garo Hills", "RURAL", 91.0, "TIER_6", "Cashew Processing & Jackfruit Chips / Coal Mining", "AGRO_MINERAL", ["Baghmara", "Rongara", "Gasuapara", "Chokpot"], 794102),
        ("269", "South West Garo Hills", "RURAL", 94.0, "TIER_5", "Organic Turmeric & Arecanut Value Addition", "SPICES_AGRO", ["Ampati", "Betasing", "Zikzak"], 794115),
        ("270", "South West Khasi Hills", "RURAL", 96.0, "TIER_5", "Mawkyrwat Honey, Black Pepper & Bay Leaf (Tejpatta)", "HONEY_SPICES", ["Mawkyrwat", "Ranikor"], 793114),
        ("271", "West Garo Hills", "SEMI_URBAN", 88.4, "TIER_4", "Garo Cashew Processing & Tura Wood Carving / Spices", "AGRO_WOOD", ["Tura", "Rongram", "Dalu", "Gambegre", "Tikrikilla", "Selsella", "Demdema"], 794001),
        ("272", "West Jaintia Hills", "RURAL", 91.0, "TIER_4", "Lakadong Organic Turmeric (Highest Curcumin G.I.)", "SPICES", ["Jowai", "Thadlaskein", "Laskein", "Amlarem"], 793150),
        ("273", "West Khasi Hills", "RURAL", 88.8, "TIER_5", "Nongstoin Traditional Pottery & Organic Ginger / Potato", "POTTERY_AGRO", ["Nongstoin", "Mawshynrut", "Rongjeng"], 793119)
    ]
    ml_districts = [format_district(code, name, urb, rur, tier, odop, cat, "Eastern Himalayan Region (Zone II)", "MePDCL Hill Feeder", blks, [f"{name} Rural", f"{blks[0]} GP"], pin) for code, name, urb, rur, tier, odop, cat, blks, pin in ml_names]
    states.append({"stateCode": "17", "stateName": "Meghalaya", "territoryType": "STATE", "totalDistricts": 12, "districts": ml_districts})

    # 9. MIZORAM (11)
    mz_names = [
        ("246", "Aizawl", "METROPOLITAN", 22.5, "TIER_2", "Mizo Traditional Puan Handloom Weaving & Ginger Powder", "HANDLOOM_SPICES", ["Aizawl", "Tlangnuam", "Darlawn", "Thingsulthliah", "Aibawk"], 796001),
        ("247", "Champhai", "RURAL", 78.0, "TIER_4", "Champhai Grape Wine (Mizo Grape G.I.) & Rice Milling", "HORTICULTURE_AGRO", ["Champhai", "Khawbung", "Ngopa"], 796321),
        ("772", "Hnahthial", "RURAL", 82.0, "TIER_5", "Organic Ginger & Bamboo Handicrafts", "SPICES_FOREST", ["Hnahthial", "South Vanlaiphai"], 796571),
        ("773", "Khawzawl", "RURAL", 85.0, "TIER_5", "Passion Fruit Processing & Traditional Handloom", "HORTICULTURE_HANDLOOM", ["Khawzawl", "Biate"], 796310),
        ("248", "Kolasib", "SEMI_URBAN", 52.0, "TIER_4", "Arecanut Value Addition, Giant Turmeric & Rubber", "AGRO_RUBBER", ["Kolasib", "Bilkhawthlir", "Thingdawl"], 796081),
        ("249", "Lawngtlai", "RURAL", 82.0, "TIER_5", "Lai & Chakma Traditional Textiles & Organic Turmeric", "HANDLOOM_SPICES", ["Lawngtlai", "Chawngte", "Sangau", "Bungtlang South"], 796891),
        ("250", "Lunglei", "SEMI_URBAN", 57.0, "TIER_3", "Mizo Chilli (Bird's Eye G.I.) & Bamboo Cane Furniture", "SPICES_FOREST", ["Lunglei", "Hnahthial", "Lungsen", "Bunghmun"], 796701),
        ("251", "Mamit", "RURAL", 82.8, "TIER_5", "Turmeric Powder Extraction & Dragon Fruit / Betel Leaf", "SPICES_HORTICULTURE", ["Mamit", "Reiek", "Zawlnuam", "West Phaileng"], 796441),
        ("774", "Saitual", "RURAL", 84.0, "TIER_5", "Mandarin Orange Juice Pulping & Ginger Value Addition", "HORTICULTURE_SPICES", ["Saitual", "Ngopa", "Phullen"], 796261),
        ("252", "Serchhip", "SEMI_URBAN", 50.7, "TIER_4", "Thenzawl Handloom Weaving Cluster & Cabbage Cultivation", "HANDLOOM_AGRO", ["Serchhip", "Thenzawl", "East Lungdar"], 796181),
        ("253", "Siaha", "RURAL", 65.0, "TIER_5", "Mara Traditional Handloom (Chawngte) & Large Cardamom", "HANDLOOM_SPICES", ["Siaha", "Tipa (Tuipang)"], 796901)
    ]
    mz_districts = [format_district(code, name, urb, rur, tier, odop, cat, "Eastern Himalayan Region (Zone II)", "Power & Electricity Dept Mizoram Feeder", blks, [f"{name} Rural", f"{blks[0]} GP"], pin) for code, name, urb, rur, tier, odop, cat, blks, pin in mz_names]
    states.append({"stateCode": "15", "stateName": "Mizoram", "territoryType": "STATE", "totalDistricts": 11, "districts": mz_districts})

    # 10. NAGALAND (16)
    nl_names = [
        ("775", "Chumoukedima", "SEMI_URBAN", 45.0, "TIER_3", "Naga Handloom Weaving & Bamboo Cane Furniture Park", "HANDLOOM_FOREST", ["Chumoukedima", "Medziphema", "Dhansiripar"], 797103),
        ("274", "Dimapur", "METROPOLITAN", 27.0, "TIER_2", "Naga King Chilli (Naga Mircha G.I.), Organic Pineapple & Meat", "SPICES_FOOD", ["Dimapur", "Niuland", "Kuhuboto"], 797112),
        ("275", "Kiphire", "RURAL", 78.0, "TIER_5", "Soyabean / Kholar (Nagaland Kidney Bean) & Apple", "AGRO_PROCESSING", ["Kiphire", "Pungro", "Seyochung", "Sitimi"], 798611),
        ("276", "Kohima", "SEMI_URBAN", 54.8, "TIER_2", "Angami Naga Traditional Shawls, Terracotta & Organic Honey", "HANDLOOM_HONEY", ["Kohima", "Jakhama", "Sechu-Zubza", "Tseminyu", "Chiephobozou"], 797001),
        ("277", "Longleng", "RURAL", 85.0, "TIER_6", "Phom Naga Wood Carving & Large Cardamom / Ginger", "WOOD_SPICES", ["Longleng", "Tamlu", "Yongnyah", "Sakshi"], 798625),
        ("278", "Mokokchung", "SEMI_URBAN", 71.0, "TIER_3", "Ao Naga Handloom Textiles & Organic Coffee Plantation", "HANDLOOM_PLANTATION", ["Mokokchung", "Changtongya", "Mangkolemba", "Tuli", "Ongpangkong", "Kobulong"], 798601),
        ("279", "Mon", "RURAL", 86.0, "TIER_5", "Konyak Naga Wood Carvings & Large Cardamom / Black Tea", "WOOD_TEA", ["Mon", "Aboi", "Tizit", "Tobu", "Naganimora", "Phomching", "Chen"], 798621),
        ("776", "Niuland", "RURAL", 88.0, "TIER_4", "Organic Ginger Processing & Honey Extraction", "SPICES_HONEY", ["Niuland", "Aghunaqa", "Nihokhu"], 797109),
        ("777", "Noklak", "RURAL", 92.0, "TIER_6", "Khiamniungan Cane Craft & Handspun Nettle Fibre Weaving", "FOREST_HANDLOOM", ["Noklak", "Thonoknyu", "Panso", "Nokhu"], 798626),
        ("280", "Peren", "RURAL", 85.0, "TIER_5", "Zeliangrong Naga Handloom, Kiwi & Organic Ginger", "HANDLOOM_HORTICULTURE", ["Peren", "Jalukie", "Tening", "Nsong", "Ahthibung"], 797110),
        ("281", "Phek", "RURAL", 85.8, "TIER_4", "Chakhesang Naga Shawls (G.I.), Kiwi Fruit & Terrace Rice", "HANDLOOM_AGRO", ["Phek", "Pfutsero", "Meluri", "Chozuba", "Chizami", "Chetheba"], 797107),
        ("778", "Shamator", "RURAL", 90.0, "TIER_6", "Yimkhiung Naga Shawls & Large Cardamom / Honey", "HANDLOOM_SPICES", ["Shamator", "Chessore", "Mangko"], 798612),
        ("779", "Tseminyu", "RURAL", 86.0, "TIER_4", "Rengma Naga Handloom Textiles & Organic Soyabean", "HANDLOOM_AGRO", ["Tseminyu", "Tsogin"], 797109),
        ("282", "Tuensang", "RURAL", 81.0, "TIER_5", "Chang Naga Traditional Shawls & Soyabean Value Addition", "HANDLOOM_AGRO", ["Tuensang", "Longkhim", "Noksen", "Chare"], 798612),
        ("283", "Wokha", "SEMI_URBAN", 79.0, "TIER_3", "Lotha Naga Handloom & Organic Passion Fruit / Fish", "HANDLOOM_HORTICULTURE", ["Wokha", "Bhandari", "Sanis", "Ralan", "Wozhuro"], 797111),
        ("284", "Zunheboto", "RURAL", 81.0, "TIER_4", "Sumi Naga Traditional Shawls & Soya Bean (Axone G.I.)", "HANDLOOM_FOOD", ["Zunheboto", "Aghunato", "Satakha", "Akuluto", "Suruhuto", "Pugboto"], 798620)
    ]
    nl_districts = [format_district(code, name, urb, rur, tier, odop, cat, "Eastern Himalayan Region (Zone II)", "Department of Power Nagaland Feeder", blks, [f"{name} Rural", f"{blks[0]} GP"], pin) for code, name, urb, rur, tier, odop, cat, blks, pin in nl_names]
    states.append({"stateCode": "13", "stateName": "Nagaland", "territoryType": "STATE", "totalDistricts": 16, "districts": nl_districts})

    # 11. SIKKIM (6)
    sk_names = [
        ("224", "Gangtok", "SEMI_URBAN", 56.8, "TIER_2", "Temi Orthodox Sikkim Tea & Sikkimese Lepcha Handloom", "TEA_HANDLOOM", ["Gangtok", "Ranka", "Khamdong", "Rakdong Tintek"], 737101),
        ("225", "Gyalshing", "RURAL", 95.0, "TIER_4", "Sikkim Large Cardamom & Himalayan Trout Fish Culture", "SPICES_FISHERIES", ["Gyalshing", "Yuksom", "Dentam", "Hee Martam"], 737111),
        ("226", "Mangan", "RURAL", 93.0, "TIER_5", "Large Cardamom (Highest Quality G.I.) & Apple Orchards", "SPICES_HORTICULTURE", ["Mangan", "Chungthang", "Dzongu (Lepcha Reserve)", "Kabi"], 737116),
        ("227", "Namchi", "SEMI_URBAN", 85.6, "TIER_3", "Temi Tea Processing & Dalle Khursani Round Chilli (G.I.)", "TEA_SPICES", ["Namchi", "Ravangla", "Jorethang", "Sikip", "Namthang"], 737126),
        ("780", "Pakyong", "RURAL", 82.0, "TIER_3", "Ginger Processing, Cymbidium Orchids & Aviation Logistics", "SPICES_FLORICULTURE", ["Pakyong", "Rhenock", "Duga", "Parakha", "Regu"], 737106),
        ("781", "Soreng", "RURAL", 92.0, "TIER_4", "Organic Ginger & Citrus Mandarin Juice", "SPICES_HORTICULTURE", ["Soreng", "Chumbong", "Daramdin", "Mangalbaria"], 737121)
    ]
    sk_districts = [format_district(code, name, urb, rur, tier, odop, cat, "Eastern Himalayan Region (Zone II)", "Power Department Sikkim Hydro Grid", blks, [f"{name} Rural", f"{blks[0]} GP"], pin) for code, name, urb, rur, tier, odop, cat, blks, pin in sk_names]
    states.append({"stateCode": "11", "stateName": "Sikkim", "territoryType": "STATE", "totalDistricts": 6, "districts": sk_districts})

    # 12. TRIPURA (8)
    tr_names = [
        ("270", "Dhalai", "RURAL", 89.3, "TIER_4", "Queen Pineapple Value Addition & Rubber Processing", "HORTICULTURE_RUBBER", ["Ambassa", "Kamalpur", "Gandacherra", "Manu", "Chawmanu", "Salema", "Dumburnagar"], 799289),
        ("271", "Gomati", "RURAL", 81.0, "TIER_3", "Tripureswari Temple Brass Artifacts & Dairy Products", "HANDICRAFTS_DAIRY", ["Udaipur (Gomati)", "Amarpur", "Karbook", "Matabari", "Kakraban", "Ompi", "Silachari"], 799120),
        ("272", "Khowai", "RURAL", 86.0, "TIER_4", "Bamboo Cane Handicrafts & Rubber Sheet Processing", "FOREST_RUBBER", ["Khowai", "Teliamura", "Padmabil", "Kalyanpur", "Tulashikhar", "Mungiacompost"], 799201),
        ("273", "North Tripura", "RURAL", 82.8, "TIER_4", "Organic Betel Nut & Tripuri Traditional Rignai Textiles", "AGRO_HANDLOOM", ["Dharmanagar", "Kanchanpur", "Panisagar", "Kadamtala", "Damcherra", "Dasda", "Jampui Hills (Oranges)"], 799250),
        ("274", "Sepahijala", "RURAL", 86.4, "TIER_3", "Queen Pineapple Processing (G.I.) & Cashew Processing", "HORTICULTURE_AGRO", ["Bishramganj", "Sonamura", "Bishalgarh", "Boxanagar", "Kathalia", "Charilam", "Jampuijala", "Mohanbhog"], 799103),
        ("275", "South Tripura", "RURAL", 85.0, "TIER_3", "Mushroom Cultivation & Rubber Smoked Sheets", "AGRO_RUBBER", ["Belonia", "Sabroom (Border SEZ)", "Santirbazar", "Rajnagar", "Hrishyamukh", "Jolaibari", "Satchand", "Rupaichhari"], 799155),
        ("276", "Unakoti", "RURAL", 81.0, "TIER_4", "Unakoti Stone Carving Souvenirs & Citrus Lemon Value Addition", "HANDICRAFTS_HORTICULTURE", ["Kailashahar", "Kumarghat", "Gournagar", "Chandipur", "Pecharthal"], 799277),
        ("277", "West Tripura", "METROPOLITAN", 45.8, "TIER_2", "Bamboo Crafts / Furniture, CTC Tea & Agartala IT Hub", "FOREST_TEA_IT", ["Agartala Sadar", "Jirania", "Mohanpur", "Dukli", "Mandwi", "Hezamara", "Lefunga", "Belbari"], 799001)
    ]
    tr_districts = [format_district(code, name, urb, rur, tier, odop, cat, "Eastern Himalayan Region (Zone II)", "TSECL Rural / Urban Feeder", blks, [f"{name} Rural", f"{blks[0]} GP"], pin) for code, name, urb, rur, tier, odop, cat, blks, pin in tr_names]
    states.append({"stateCode": "16", "stateName": "Tripura", "territoryType": "STATE", "totalDistricts": 8, "districts": tr_districts})

    return states
