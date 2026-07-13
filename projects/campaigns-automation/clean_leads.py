import csv
import os
import re

RAW_CSV_PATH = r"D:\Restaurant_Campaign\test_restaurant.csv"
CLEAN_CSV_PATH = r"D:\Restaurant_Campaign\test_restaurant_clean.csv"
BACKUP_CSV_PATH = r"D:\Restaurant_Campaign\test_restaurant_raw_backup.csv"

# Comprehensive blacklist of generic names, roles, departments, or filler words
GENERIC_NAME_BLACKLIST = {
    "owner", "manager", "marketing", "catering", "info", "admin", "contact", 
    "team", "staff", "sales", "support", "hello", "general", "reservations", 
    "bookings", "service", "events", "comments", "information", "orders", 
    "press", "%20hello", "partnerships", "customerservice", "feedback", 
    "generalmanager", "concierge", "rsvp", "help", "business owner", 
    "restaurant", "host", "traiteur", "corporate", "billing", "office", 
    "ciao", "jobs", "careers", "web", "website", "customer", "inquiry", 
    "inquiries", "user", "recipient", "filler", "example", "subject", 
    "booking", "comments", "eventsinfo", "guest", "guestservices", "orders", 
    "help", "everyone", "anybody", "details", "contactus", "mail", "salesforce"
}

# Suffixes that indicate the name is actually a business/restaurant name rather than a person
BUSINESS_SUFFIX_REGEX = re.compile(
    r"(grill|restaurant|cafe|bistro|catering|pizza|seafood|sunset|hotel|house|diner|"
    r"coffee|baking|bakery|tavern|lounge|bar|kitchen|shack|smokehouse|brewery|eats|"
    r"hospitality|group|collective|noodle|roastery|gelati|supper|eatery|tapas|bbq|"
    r"beach|resort|cantina|pub|inn|donut|bagel|roaster|roasters|steakhouse|deli|social)",
    re.IGNORECASE
)

def clean_first_name(name, email, company):
    if not name:
        return "there"
    
    name = name.strip()
    
    # 1. Check blacklist words (case-insensitive)
    if name.lower() in GENERIC_NAME_BLACKLIST:
        return "there"
    
    # 2. Check for URL/email characters, percent-encoding, digits or special symbols
    if any(char in name for char in ["@", ".", "+", "%", "/", "<", ">", "_", "|", "*"]):
        return "there"
    if any(char.isdigit() for char in name):
        return "there"
    
    # 3. Check length constraints (too short or too long)
    if len(name) < 2 or len(name) > 15:
        return "there"
    
    # 4. Check if the name matches the company name or ends with restaurant keywords
    if BUSINESS_SUFFIX_REGEX.search(name):
        return "there"
    if name.lower() in company.lower() and len(name) > 4:
        # Avoid names like "Lapicanagrillmiami" when restaurant is "Lapicanagrill"
        return "there"
        
    # 5. Check if it's the username part of the email address (e.g. suztoorestaurant@gmail.com -> suztoorestaurant)
    username = email.split('@')[0] if '@' in email else ""
    if username and name.lower() == username.lower():
        # If the username is a person name like "lauren", it's fine. But if it's long or generic, it's not.
        if len(name) > 10 or BUSINESS_SUFFIX_REGEX.search(name):
            return "there"
            
    # Return formatted name (Title Case)
    return name.title()

# Jammed words that can appear in the middle of a string
STANDARD_WORDS = [
    "Restaurant", "Smokehouse", "Seafoods", "Seafood", "Catering", "Supper", 
    "Eatery", "Market", "Bistro", "Pizza", "Hotel", "House", "Diner", "Coffee", 
    "Bakery", "Tavern", "Lounge", "Grill", "Shack", "Brewery", "Tapas", "Beach", 
    "Resort", "Steak", "Angel", "Bros", "Crab", "Stone", "Dulce", "Orsay", 
    "Bar", "Pub", "Inn", "Deli", "Eats", "BBQ", "Bbq", "TLV", "Tlv", "By",
    "Pelican", "Rusty", "Sunset", "Gourmet", "Salad", "Salads"
]

# State codes or company abbreviations that should only be split when they are at the end of the string
SUFFIX_WORDS = [
    "Miami", "Tampa", "Orlando", "Seattle", "Houston", "Dallas", "Galveston", 
    "Fort Worth", "Austin", "ATL", "Atl", "SD", "Sd", "FL", "Fl", "VA", "Va", 
    "NC", "Nc", "TN", "Tn", "OH", "Oh", "CO", "Co", "AZ", "Az", "NV", "Nv", "GA", "Ga"
]

def split_jammed_words(text):
    if not text:
        return text
        
    cleaned = text.strip()
    
    # 1. Split standard jammed words (can be anywhere except the very start)
    for word in STANDARD_WORDS:
        pattern = re.compile(rf"(?i)(?<!\s)(?<!^){word}")
        replacement = f" {word.title() if word.lower() not in ['bbq', 'tlv'] else word.upper()}"
        cleaned = pattern.sub(replacement, cleaned)
        
    # 2. Split suffix words (only at the end of the string)
    for word in SUFFIX_WORDS:
        pattern = re.compile(rf"(?i)(?<!\s){word}$")
        replacement = f" {word.upper() if len(word) <= 3 else word.title()}"
        cleaned = pattern.sub(replacement, cleaned)
        
    return cleaned.strip()

# A comprehensive map of manual cleanups for jammed/improper company names in the dataset
CUSTOM_COMPANY_FIXES = {
    "bbistromiami": "B Bistro Miami",
    "hibachigrillmiami": "Hibachi Grill Miami",
    "mojitogrill": "Mojito Grill",
    "lapicanagrill": "Lapicana Grill",
    "suztoorestaurant": "Suztoo Restaurant",
    "cafedulce": "Cafe Dulce",
    "versaillesrestaurant": "Versailles Restaurant",
    "joesstonecrab": "Joes Stone Crab",
    "mandolinmiami": "Mandolin Miami",
    "abbaletlv": "Abba TLV",
    "columbiarestaurant": "Columbia Restaurant",
    "oliviafl": "Olivia FL",
    "therustypelicantampa": "The Rusty Pelican Tampa",
    "foxbrosbbq": "Fox Bros BBQ",
    "heirloommarketbbq": "Heirloom Market BBQ",
    "avivabykameel": "Aviva by Kameel",
    "auburnangel": "Auburn Angel",
    "lazybettyatl": "Lazy Betty ATL",
    "animaesd": "Animae SD",
    "addisondelmar": "Addison Del Mar",
    "mitchsseafood": "Mitch's Seafood",
    "pointlomaseafoods": "Point Loma Seafoods",
    "winebargeorge": "Wine Bar George",
    "kayaorlando": "Kaya Orlando",
    "grumpysrestaurantco": "Grumpy's Restaurant Co",
    "restaurantorsay": "Restaurant Orsay",
    "doubletrouble": "Double Trouble",
    "houstonwatchcompany": "Houston Watch Company",
    "mamazulmexicangrill": "Mamazul Mexican Grill",
    "sushisuzuki": "Sushi Suzuki",
    "skybowlcafe": "Skybowl Cafe",
    "simplysoulfulcafe": "Simply Soulful Cafe",
    "midniteramen": "Midnite Ramen",
    "dripdripcoffeehouse": "Drip Drip Coffee House",
    "sundayscoffee": "Sundays Coffee",
    "sebiskitchen": "Sebi's Kitchen",
    "thebuzzcafe": "The Buzz Cafe",
    "fremontcoffeecompany": "Fremont Coffee Company",
    "irwinsbakeryandcoffeehouse": "Irwin's Bakery And Coffee House",
    "sevenmarketcafe": "Seven Market & Cafe",
    "centralcafe": "Central Cafe",
    "kanomsaicafe": "Kanom Sai Cafe",
    "volunteerparkcafepantry": "Volunteer Park Cafe & Pantry",
    "ponoranch": "Pono Ranch",
    "postpikebarcafe": "Post Pike Bar & Cafe",
    "smokingmonkeypizza": "Smoking Monkey Pizza",
    "skycoffeebuenosaires": "Sky Coffee Buenos Aires",
    "thaihouse": "Thai House",
    "panthercoffee": "Panther Coffee",
    "madbutcher": "Mad Butcher",
    "grails": "Grails",
    "thecorner": "The Corner",
    "lasantataqueria": "La Santa Taqueria",
    "tacosatarantadosbrickell": "Tacos Atarantados",
    "sipsiprumbar": "Sipsip Rum Bar",
    "macondocoffeeroasters": "Macondo Coffee Roasters",
    "freeholdmiami": "Freehold Miami",
    "shawynwood": "Sha Wynwood",
    "cotemiami": "Cote",
    "lacoladagourmet": "La Colada Gourmet",
    "elpubrestaurant": "El Pub Restaurant",
    "elreydelasfritas": "El Rey de las Fritas",
    "elatlacatl": "El Atlacatl",
    "miamarket": "Mia Market",
    "petitemaman": "Petite Maman",
    "salonibymeraki": "Saloni By Meraki",
    "hometownbarbecue": "Hometown Barbecue",
    "ithinksheis": "I Think She Is",
    "lukeslobster": "Luke's Lobster",
    "lafayettemiami": "Lafayette Miami",
    "oldlisbon": "Old Lisbon",
    "candelabarbrickell": "Candela Bar Brickell",
    "midtownboba": "Midtown Boba",
    "cortaditocoffeehouse": "Cortadito Coffee House",
    "maraburestaurant": "Marabu Restaurant",
    "saltyflamerestaurant": "Salty Flame",
    "sushikong": "Sushi Kong",
    "bayshoreclubbargrill": "Bayshore Club Bar & Grill",
    "paperfishsushi": "Paperfish Sushi",
    "elcristo": "El Cristo",
    "coralhouseitalianrestaurant": "Coral House",
    "thericebox": "The Rice Box",
    "birraporetti's": "Birraporetti's",
    "piola": "Piola",
    "brasa'ssteakhouse": "Brasa's Steakhouse",
    "tacosagogo": "Tacos A Go Go",
    "christianstailgate": "Christian's Tailgate",
    "barnabyscafe": "Barnaby's Cafe",
    "frankspizza": "Frank's Pizza",
    "bollowoodfiredpizza": "Bollo Woodfired Pizza",
    "table7bistro": "Table 7 Bistro",
    "moontowerinn": "Moon Tower Inn",
    "siphoncoffee": "Siphon Coffee",
    "continentalclub": "Continental Club",
    "winnies": "Winnie's",
    "perbacco": "Perbacco",
    "deans": "Dean's",
    "notsuoh": "Notsuoh",
    "themoonshiners": "The Moonshiners",
    "b&bbutchers": "B&B Butchers",
    "pappasbrossteakhouse": "Pappas Bros. Steakhouse",
    "bohemeos": "Bohemeo's",
    "irmassouthwestgrill": "Irma's Southwest Grill",
    "themarigoldclub": "The Marigold Club",
    "fabianslatinflavors": "Fabian's Latin Flavors",
    "maisonpuchabistro": "Maison Pucha Bistro",
    "toutsuite": "Tout Suite",
    "courtstreet": "Court Street",
    "stonewallinn": "Stonewall Inn",
    "bubo": "Bubo",
    "littlealley": "Little Alley",
    "swifthibernianlounge": "Swift Hibernian Lounge",
    "mothers": "Mother's",
    "hardrockcafe": "Hard Rock Cafe",
    "freemans": "Freemans",
    "ticktockdiner": "Tick Tock Diner",
    "juniors": "Junior's",
    "thinkcoffee": "Think Coffee",
    "monkmcginns": "Monk McGinns",
    "amelias": "Amelia's",
    "smithwollensky": "Smith & Wollensky",
    "clintonstbakingcompany": "Clinton St. Baking Company",
    "carnegiediner&cafe": "Carnegie Diner & Cafe",
    "bakeri": "Bakeri",
    "pera": "Pera",
    "ammosestiatorio": "Ammos Estiatorio",
    "maman": "Maman",
    "tonys": "Tony's",
    "russiantearoom": "Russian Tea Room",
    "lighthorsetavern": "Light Horse Tavern",
    "barbianchi": "Bar Bianchi",
    "fortyfour": "Forty Four",
    "sushistar": "Sushi Star",
    "shmone": "Shmone",
    "churosthai": "Chu Ros Thai",
    "thelexingtonsocial": "The Lexington Social",
    "thelambsclub": "The Lambs Club",
    "theplaywright": "The Playwright",
    "thecrossbar": "The Crossbar",
    "landmarktavern": "Landmark Tavern",
    "laut": "Laut",
    "rustique": "Rustique",
    "pasqualejones": "Pasquale Jones",
    "missfavela": "Miss Favela",
    "mercato": "Mercato",
    "thewest": "The West",
    "vinniespizzeria": "Vinnies Pizzeria",
    "lovekoreanbbq": "LOVE Korean BBQ",
    "thesmith": "The Smith",
    "trattoriailgusto": "Trattoria iL Gusto",
    "sabaspizza": "Saba's Pizza",
    "bite": "Bite",
    "thechurchilltavern": "The Churchill Tavern",
    "bohemianspiritrestaurant": "Bohemian Spirit Restaurant",
    "787coffee": "787 Coffee",
    "sweetleaf": "Sweetleaf",
    "delmonicos": "Delmonico's",
    "harrys": "Harry's",
    "josephsristorante": "Joseph's Ristorante",
    "amoryamargo": "Amor y Amargo",
    "mokaco": "Moka & Co",
    "villagesquarepizza": "Village Square Pizza",
    "namkeen": "Namkeen",
    "kettl": "Kettl",
    "calexico": "Calexico",
    "eldergreene": "Elder Greene",
    "thelaurels": "The Laurels",
    "gennaro": "Gennaro",
    "barnjoonomad": "Barn Joo Nomad",
    "birchcoffee": "Birch Coffee",
    "joecoffeecompany": "Joe Coffee Company",
    "stkildacoffee": "St Kilda Coffee",
    "junglebird": "Jungle Bird",
    "shaffers": "Shaffer’s",
    "themollyweepub": "The Molly Wee Pub",
    "thedonutpub": "The Donut Pub",
    "dallasbbq": "Dallas BBQ",
    "viand": "Viand",
    "qanoon": "Qanoon",
    "oldecity": "Olde City",
    "taralluccievino": "Tarallucci e Vino",
    "oslocoffeeroasters": "Oslo Coffee Roasters",
    "barneygreengrass": "Barney Greengrass",
    "goldenunicorn": "Golden Unicorn",
    "paulsdaburgerjoint": "Paul's Da Burger Joint",
    "recette": "Recette",
    "xingfutang": "Xing Fu Tang",
    "clockworkbar": "Clockwork Bar",
    "txikito": "Txikito",
    "riverpark": "Riverpark",
    "portsaid": "Port Sa'id",
    "garicolumbus": "Gari Columbus",
    "tacqueria86": "Taqueria 86",
    "konacoffeeroasters": "Kona Coffee Roasters",
    "thegrid": "The GRID",
    "cafehabibti": "Cafe Habibti",
    "felixroastingco": "Felix Roasting Co.",
    "hags": "Hags",
    "notasbitter": "Not As Bitter",
    "barveloce": "Bar Veloce",
    "princeteahouse": "Prince Tea House",
    "timhowan": "Tim Ho Wan",
    "leons": "Leon's",
    "maxbrenner": "Max Brenner",
    "phoenixbar": "Phoenix Bar",
    "manuela": "Manuela",
    "santotaco": "Santo Taco",
    "champerssocialclub": "Champers Social Club",
    "upsidepizza": "Upside Pizza",
    "jackswifefreda": "Jack’s Wife Freda",
    "kolkatachaico": "Kolkata Chai Co",
    "grandstreetsocial": "Grand Street Social",
    "rintintin": "Rintintin",
    "thaidiner": "Thai Diner",
    "niagara": "Niagara",
    "chachamatcha": "Cha Cha Matcha",
    "kollectiv": "Kollectiv",
    "senzagluten": "Senza Gluten",
    "marumi": "Marumi",
    "thebitterend": "The Bitter End",
    "shooshoonolita": "Shoo Shoo Nolita",
    "bibliothequecafewinebar": "Bibliotheque Cafe & Wine Bar",
    "paintnpour": "Paint 'N Pour",
    "russdaughterscafe": "Russ & Daughters Cafe",
    "twodoorsdown": "Two Doors Down",
    "tsurutontan": "TsuruTonTan",
    "hutchwaldo": "Hutch + Waldo",
    "julius": "Julius",
    "taureau": "Taureau",
    "dailyprovisions": "Daily Provisions",
    "ueki": "Ueki",
    "bedfordstudio": "Bedford Studio",
    "aireancientbaths": "Aire Ancient Baths",
    "pepolino": "Pepolino",
    "sodaclub": "Soda Club",
    "serafinaludlow": "Serafina Ludlow",
    "bakeculture": "Bake Culture",
    "wogies": "Wogies",
    "empellontaqueria": "Empellon Taqueria",
    "cowgirl": "Cowgirl",
    "antons": "Anton's",
    "cubbyhole": "Cubbyhole",
    "kungfutea": "Kung Fu Tea",
    "bobbyvanssteakhouse": "Bobby Van's Steakhouse",
    "chaoticgood": "Chaotic Good",
    "handynasty": "Han Dynasty",
    "dublinhouse": "Dublin House",
    "miriam": "Miriam",
    "elea": "Elea",
    "redfarm": "RedFarm",
    "chelsearistoranteitaliano": "Chelsea Ristorante Italiano",
    "rosieogradyssaloon": "Rosie O'Grady's Saloon",
    "motorino": "Motorino",
    "smac": "S'Mac",
    "saomai": "Sao Mai",
    "rosemarys": "Rosemary's",
    "hillcountrybarbecuemarket": "Hill Country Barbecue Market",
    "pizzaacasa": "Pizza a Casa",
    "44x": "44 & X",
    "themarshal": "The Marshal",
    "greybarrestaurant": "Grey Bar & Restaurant",
    "theponybar": "The Pony Bar",
    "theanchoredinn": "The Anchored Inn",
    "waterwheat": "Water & Wheat",
    "beerauthority": "Beer Authority",
    "ellensstardustdiner": "Ellen's Stardust Diner",
    "storehouse": "Storehouse",
    "subject": "Subject",
    "2ndfloorbaressen": "2nd Floor Bar & Essen",
    "thetippler": "The Tippler",
    "oijimi": "Oiji Mi",
    "gothamcoffeeroasters": "Gotham Coffee Roasters",
    "sullivanstreetbakery": "Sullivan Street Bakery",
    "pennsylvania6": "Pennsylvania 6",
    "sendo": "Sendo",
    "luckincoffee": "Luckin Coffee",
    "langeletto": "L'Angeletto",
    "watchhouse": "WatchHouse",
    "sevensins": "Seven Sins",
    "thebrokenshaker": "The Broken Shaker",
    "dogbone": "Dog & Bone",
    "buddys": "Buddy's",
    "streettaco": "Street Taco",
    "songenapule": "Song’ E Napule",
    "norma": "Norma",
    "devocion": "Devocion",
    "turnmill": "Turnmill",
    "estiatoriomilos": "Estiatorio Milos",
    "astrorestaurant": "Astro Restaurant",
    "phdterrace": "PHD Terrace",
    "thaichaikitchen": "Thai Chai Kitchen",
    "bcdtofuhouse": "BCD Tofu House",
    "slatecafe": "Slate Cafe",
    "mediumrare": "Medium Rare",
    "cinicocoffeecompany": "Cinico Coffee Company",
    "harrycipriani": "Harry Cipriani",
    "yezoisankaya": "Yezo Isankaya",
    "tensaiudonhouse": "Tensai Udon House",
    "zaraterrace": "Zara Terrace",
    "yakinikutoraji": "Yakiniku TORAJI",
    "gongcha": "Gong Cha",
    "yakitoritorishin": "Yakitori Torishin",
    "alfies": "Alfie's",
    "cocofreshteajuice": "CoCo Fresh Tea & Juice",
    "margaritaville": "Margaritaville",
    "guisteakhouse": "Gui Steakhouse",
}

def clean_company_name(company):
    if not company:
        return "your restaurant"
        
    # Decode HTML entities
    company = re.sub(r"&amp;", "&", company, flags=re.IGNORECASE)
    company = re.sub(r"&lt;", "<", company, flags=re.IGNORECASE)
    company = re.sub(r"&gt;", ">", company, flags=re.IGNORECASE)
    company = company.strip()
    
    # 1. Check for manual custom fixes
    lookup_key = re.sub(r"[^a-zA-Z0-9&]", "", company).lower()
    if lookup_key in CUSTOM_COMPANY_FIXES:
        return CUSTOM_COMPANY_FIXES[lookup_key]
        
    # 2. Split jammed words first to make splitting and stripping easier
    company = split_jammed_words(company)
    
    # 3. Strip trailing zipcodes/locations in parentheses
    company = re.sub(r"\s*\([^)]*\)\s*$", "", company).strip()
    
    # 4. Remove trailing locations separated by commas (including zip/parentheses)
    company = re.sub(r",\s*(Unknown|\w+(?:\s+\w+)?)\s*\(\d+\)$", "", company, flags=re.IGNORECASE).strip()
    company = re.sub(r",\s*(Unknown|Miami Beach|Miami|Seattle|Houston|Tampa|Jacksonville|Orlando|San Diego|Hoboken|New York|Brooklyn|Austin|Galveston|San Antonio|Fort Worth)\s*$", "", company, flags=re.IGNORECASE).strip()
    
    # 5. Split on common separators if they contain location info
    if " | " in company:
        parts = company.split(" | ")
        if len(parts[0]) > 2:
            company = parts[0].strip()
    elif " - " in company:
        parts = company.split(" - ")
        if len(parts[0]) > 2:
            company = parts[0].strip()
            
    # 6. Correct casing if fully lowercase/uppercase
    if company.islower() or company.isupper():
        company = company.title()
        
    # 7. Fix common acronyms and formatting
    company = re.sub(r"\bBbq\b", "BBQ", company, flags=re.IGNORECASE)
    company = re.sub(r"\bTlv\b", "TLV", company, flags=re.IGNORECASE)
    company = re.sub(r"\bB&b\b", "B&B", company, flags=re.IGNORECASE)
    company = re.sub(r"\bCafé\b", "Cafe", company, flags=re.IGNORECASE) 
    company = re.sub(r"^\s*\{|\}\s*$", "", company) 
    
    # Double check formatting and empty values
    company = company.strip()
    if not company or company.lower() in ["unknown", "your restaurant", "restaurant"]:
        return "your restaurant"
        
    return company

def clean_city(city):
    if not city:
        return "your area"
    
    city = city.strip()
    
    # Strip zipcode in parentheses if present, e.g. "Miami Beach (90210)" -> "Miami Beach"
    city = re.sub(r"\s*\([^)]*\)\s*$", "", city).strip()
    
    if not city or city.lower() in ["unknown", "your local area", "your area"]:
        return "your area"
        
    return city.title()

def main():
    print("=== Lead Cleaning Script ===")
    
    if not os.path.exists(RAW_CSV_PATH):
        print(f"Error: {RAW_CSV_PATH} not found.")
        return
        
    # Read raw leads
    leads = []
    with open(RAW_CSV_PATH, 'r', encoding='utf-8', errors='ignore') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        for row in reader:
            leads.append(row)
            
    print(f"Loaded {len(leads)} leads from raw CSV.")
    
    # Clean leads
    cleaned_leads = []
    seen_emails = set()
    duplicates_count = 0
    invalid_count = 0
    
    for lead in leads:
        first_name = lead.get('First Name', '').strip()
        email = lead.get('Email Address', '').strip()
        company = lead.get('Company Name', '').strip()
        city = lead.get('City', '').strip()
        
        # Validate email
        email_lower = email.lower()
        if not email_lower or '@' not in email_lower or '.' not in email_lower:
            invalid_count += 1
            continue
            
        # Skip invalid/test domains
        if any(d in email_lower for d in ["example.com", "website.com", "domain.com", "email.com"]):
            invalid_count += 1
            continue
            
        # Deduplicate
        if email_lower in seen_emails:
            duplicates_count += 1
            continue
        seen_emails.add(email_lower)
        
        # Clean fields
        clean_company = clean_company_name(company)
        clean_name = clean_first_name(first_name, email, clean_company)
        clean_city_name = clean_city(city)
        
        cleaned_leads.append({
            'First Name': clean_name,
            'Email Address': email,
            'Company Name': clean_company,
            'City': clean_city_name
        })
        
    print(f"Skipped {duplicates_count} duplicate emails.")
    print(f"Skipped {invalid_count} invalid/placeholder emails.")
    print(f"Remaining clean leads: {len(cleaned_leads)}")
    
    # Backup original raw leads
    import shutil
    try:
        shutil.copyfile(RAW_CSV_PATH, BACKUP_CSV_PATH)
        print(f"Backed up original leads to {BACKUP_CSV_PATH}")
    except Exception as e:
        print(f"Warning: Could not create backup: {e}")
        
    # Write to clean file
    with open(CLEAN_CSV_PATH, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['First Name', 'Email Address', 'Company Name', 'City'])
        writer.writeheader()
        writer.writerows(cleaned_leads)
        
    print(f"Cleaned leads written to {CLEAN_CSV_PATH}.")
    
    # Overwrite original raw file with clean data
    try:
        shutil.copyfile(CLEAN_CSV_PATH, RAW_CSV_PATH)
        print(f"Successfully overwrote raw lead file {RAW_CSV_PATH} with cleaned data.")
    except Exception as e:
        print(f"Error: Could not overwrite raw lead file: {e}")
    
    # Print sample of the cleaning results
    print("\n--- SAMPLE OF CLEANED LEADS ---")
    for i, lead in enumerate(cleaned_leads[:15]):
        print(f"{i+1}. Greeting: Hi {lead['First Name']}, Company: {lead['Company Name']} in {lead['City']}, Email: {lead['Email Address']}")

if __name__ == "__main__":
    main()
