import requests
from bs4 import BeautifulSoup
import re
import urllib.parse
import time
import csv
import os
import random
import argparse
import sys
import io

# Force UTF-8 encoding for standard output and error to prevent CP1252 encoding crashes on Windows
if sys.platform.startswith('win'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Config target niches
NICHES_CONFIG = {
    "Restaurant": {
        "keywords": ["restaurant", "cafe", "bistro", "grill", "eatery", "diner", "pizzeria", "bakery", "taco", "sushi"],
        "blocklist": [
            'mcdonalds', 'subway', 'starbucks', 'burger king', 'taco bell', 'wendys', 'dunkin', 
            'dominos', 'pizza hut', 'kfc', 'chick-fil-a', 'panera', 'chipotle', 'sonic', 'applebees', 
            'chilis', 'olive garden', 'buffalo wild wings', 'outback', 'red lobster', 'texas roadhouse', 
            'ihop', 'dennys', 'cracker barrel', 'tgif', 'ruby tuesday', 'hooters', 'five guys', 
            'panda express', 'qdoba', 'hardees', 'carls jr', 'whataburger', 'shake shack'
        ],
        "output_file": "D:\\Restaurant_Campaign\\test_restaurant.csv"
    },
    "Lodging": {
        "keywords": ["inn", "bed and breakfast", "motel", "lodge", "boutique hotel", "guesthouse", "resort", "hotel"],
        "blocklist": [
            'marriott', 'hilton', 'holiday inn', 'sheraton', 'westin', 'hyatt', 'best western',
            'wyndham', 'choice hotels', 'quality inn', 'super 8', 'motel 6', 'ramada', 'days inn',
            'la quinta', 'laquinta', 'hampton', 'comfort inn', 'econo lodge', 'red roof', 'ritz', 
            'four seasons', 'ihg', 'radisson', 'travelodge', 'extended stay', 'holidayinn',
            'courtyard', 'crowne plaza', 'doubletree', 'fairfield', 'springhill', 'towneplace', 
            'residence inn', 'embassy suites', 'homewood suites', 'tru by hilton'
        ],
        "output_file": "D:\\Restaurant_Campaign\\test_lodging.csv"
    }
}

# Target cities configuration across FL, CA, and GA
CITIES = [
    {"city": "Miami", "state": "FL"},
    {"city": "Tampa", "state": "FL"},
    {"city": "Orlando", "state": "FL"},
    {"city": "Jacksonville", "state": "FL"},
    {"city": "Tallahassee", "state": "FL"},
    {"city": "Fort Lauderdale", "state": "FL"},
    {"city": "Atlanta", "state": "GA"},
    {"city": "Savannah", "state": "GA"},
    {"city": "Augusta", "state": "GA"},
    {"city": "Columbus", "state": "GA"},
    {"city": "Los Angeles", "state": "CA"},
    {"city": "San Diego", "state": "CA"},
    {"city": "San Francisco", "state": "CA"},
    {"city": "San Jose", "state": "CA"},
    {"city": "Sacramento", "state": "CA"},
    {"city": "Fresno", "state": "CA"},
    {"city": "Oakland", "state": "CA"},
    {"city": "Long Beach", "state": "CA"}
]

SENT_DB_PATH = "D:\\Restaurant_Campaign\\campaign_sent_database.csv"
BOUNCE_FILE_PATH = "D:\\Restaurant_Campaign\\bounced_emails.txt"

DIRECTORY_BLOCKLIST = [
    'yahoo.com', 'google.com', 'bing.com', 'booking.com', 'tripadvisor.com', 'yelp.com',
    'expedia.com', 'hotels.com', 'yellowpages.com', 'facebook.com', 'instagram.com',
    'youtube.com', 'linkedin.com', 'pinterest.com', 'reddit.com', 'usatoday.com',
    'wikipedia.org', 'foursquare.com', 'mapquest.com', 'local.yahoo.com', 'kayak.com',
    'trivago.com', 'airbnb.com', 'vrbo.com', 'wix.com', 'wordpress.com', 'weebly.com', 
    'squarespace.com', 'opentable.com', 'resy.com', 'grubhub.com', 'doordash.com', 'ubereats.com'
]

USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
]

def load_excluded_emails():
    excluded = set()
    if os.path.exists(SENT_DB_PATH):
        try:
            with open(SENT_DB_PATH, 'r', encoding='utf-8', errors='ignore') as f:
                reader = csv.DictReader(f)
                if reader.fieldnames and 'RecipientEmail' in reader.fieldnames:
                    for row in reader:
                        email = row['RecipientEmail']
                        if email:
                            excluded.add(email.strip().lower())
                else:
                    f.seek(0)
                    for line in f:
                        parts = line.strip().split(',')
                        for p in parts:
                            if '@' in p and '.' in p:
                                excluded.add(p.strip().lower())
            print(f"Loaded {len(excluded)} sent emails to exclude.")
        except Exception as e:
            print(f"Warning: Could not read sent database: {e}")
            
    if os.path.exists(BOUNCE_FILE_PATH):
        try:
            bounces_count = 0
            with open(BOUNCE_FILE_PATH, 'r', encoding='utf-8', errors='ignore') as f:
                for line in f:
                    email = line.strip().lower()
                    if email and '@' in email and '.' in email:
                        excluded.add(email)
                        bounces_count += 1
            print(f"Loaded {bounces_count} bounced emails to exclude.")
        except Exception as e:
            print(f"Warning: Could not read bounce list: {e}")
            
    return excluded

def search_ddg(query, session):
    print(f"Searching DuckDuckGo for: {query}")
    results = []
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}"
    headers = {
        'User-Agent': random.choice(USER_AGENTS),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://duckduckgo.com/',
    }
    try:
        res = session.get(url, headers=headers, timeout=12)
        if res.status_code == 200:
            soup = BeautifulSoup(res.text, 'html.parser')
            for a in soup.find_all('a', href=True):
                href = a['href']
                if 'uddg=' in href:
                    parsed = urllib.parse.urlparse(href)
                    real_url = urllib.parse.parse_qs(parsed.query).get('uddg', [None])[0]
                    if real_url:
                        results.append(real_url)
                elif href.startswith('http') and not any(x in href for x in ['duckduckgo.com', 'yahoo.com', 'google.com']):
                    results.append(href)
        else:
            print(f"      [WARNING] DDG returned status {res.status_code}")
    except Exception as e:
        print(f"      [ERROR] DDG request failed: {e}")
    return list(set(results))

def search_aol(query, session):
    print(f"Searching AOL for: {query}")
    results = []
    url = f"https://search.aol.com/aol/search?q={urllib.parse.quote(query)}"
    headers = {
        'User-Agent': random.choice(USER_AGENTS),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://search.aol.com/',
    }
    try:
        res = session.get(url, headers=headers, timeout=12)
        if res.status_code == 200:
            soup = BeautifulSoup(res.text, 'html.parser')
            for a in soup.find_all('a', href=True):
                href = a['href']
                if 'r.search.yahoo.com' in href:
                    match = re.search(r'/RU=([^/]+)', href)
                    if match:
                        real_url = urllib.parse.unquote(match.group(1))
                        results.append(real_url)
                elif href.startswith('http') and not any(x in href for x in ['aol.com', 'yahoo.com', 'google.com']):
                    results.append(href)
        else:
            print(f"      [WARNING] AOL returned status {res.status_code}")
    except Exception as e:
        print(f"      [ERROR] AOL request failed: {e}")
    return list(set(results))

def search_ask(query, session):
    print(f"Searching Ask.com for: {query}")
    results = []
    url = f"https://www.ask.com/web?q={urllib.parse.quote(query)}"
    headers = {
        'User-Agent': random.choice(USER_AGENTS),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.ask.com/',
    }
    try:
        res = session.get(url, headers=headers, timeout=12)
        if res.status_code == 200:
            soup = BeautifulSoup(res.text, 'html.parser')
            for a in soup.find_all('a', href=True):
                href = a['href']
                if href.startswith('http') and not any(x in href for x in ['ask.com', 'google.com', 'microsoft.com']):
                    results.append(href)
        else:
            print(f"      [WARNING] Ask returned status {res.status_code}")
    except Exception as e:
        print(f"      [ERROR] Ask request failed: {e}")
    return list(set(results))

def search_web(query, session):
    results = search_ddg(query, session)
    if results:
        return results
    results = search_aol(query, session)
    if results:
        return results
    results = search_ask(query, session)
    return results

def clean_domain(url):
    try:
        parsed_url = urllib.parse.urlparse(url)
        domain = parsed_url.netloc.lower()
        if domain.startswith('www.'):
            domain = domain[4:]
        return domain
    except:
        return ""

def is_chain(name, url, blocklist):
    full_text = f"{name} {url}".lower()
    for chain in blocklist:
        if chain in full_text:
            return True
    return False

def extract_emails_from_html(html):
    soup = BeautifulSoup(html, 'html.parser')
    emails = []
    
    for a in soup.find_all('a', href=True):
        href = a['href']
        if href.startswith('mailto:'):
            email = href.replace('mailto:', '').split('?')[0].strip().lower()
            if email and '@' in email and '.' in email:
                emails.append(email)
                    
    regex_emails = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}', html)
    for email in regex_emails:
        email = email.lower().strip()
        emails.append(email)
            
    valid_emails = []
    for email in set(emails):
        email_clean = email.strip().lower()
        if any(email_clean.endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.css', '.js', '.pdf', '.ico']):
            continue
        if any(x in email_clean for x in ['wix', 'wordpress', 'domain', 'support', 'webmaster', 'developer', 'design', 'designer', 'privacy', 'noreply', 'no-reply', 'example.com', 'website.com', 'mystore.com', 'sentry.io', 'myloaninsurance.co', 'impallari', 'anapbm', 'font', 'theme', 'template', '<', '>', ' ', 'coord', 'latitude', 'longitude']):
            continue
        if re.search(r'^[0-9a-f]{32}@', email_clean) or re.search(r'@\d+\.\d+', email_clean):
            continue
        if '@' in email_clean and '.' in email_clean:
            valid_emails.append(email_clean)
            
    return list(set(valid_emails))

def search_personal_email(company_name, city, state, session):
    queries = [
        f'"{company_name}" "{city}, {state}" "gmail.com"',
        f'"{company_name}" "{city}, {state}" owner email'
    ]
    emails = []
    for query in queries:
        html_content = ""
        url = f"https://www.ask.com/web?q={urllib.parse.quote(query)}"
        headers = {
            'User-Agent': random.choice(USER_AGENTS),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Referer': 'https://www.ask.com/',
        }
        try:
            time.sleep(random.uniform(0.5, 1.2))
            res = session.get(url, headers=headers, timeout=8)
            if res.status_code == 200:
                html_content = res.text
        except:
            pass
            
        if html_content:
            regex_emails = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}', html_content)
            for email in regex_emails:
                email_clean = email.lower().strip()
                if any(email_clean.endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.css', '.js', '.pdf', '.ico']):
                    continue
                if any(x in email_clean for x in ['wix', 'wordpress', 'domain', 'support', 'webmaster', 'developer', 'design', 'designer', 'privacy', 'noreply', 'no-reply', 'example.com', 'website.com', 'mystore.com', 'sentry.io', 'myloaninsurance.co', 'impallari', 'anapbm', 'font', 'theme', 'template', '<', '>', ' ', 'coord', 'latitude', 'longitude', 'ask.com', 'google', 'bing', 'yahoo']):
                    continue
                if re.search(r'^[0-9a-f]{32}@', email_clean) or re.search(r'@\d+\.\d+', email_clean):
                    continue
                emails.append(email_clean)
                
    # Prioritize popular personal inbox providers
    personal = [e for e in set(emails) if any(x in e for x in ['gmail.com', 'yahoo.com', 'hotmail.com', 'aol.com', 'outlook.com'])]
    if personal:
        return list(set(personal))
    return list(set(emails))

def scrape_restaurant_emails(url, company_name, city, state, session):
    # 1. Look up personal emails using advanced search query snippets first
    emails = search_personal_email(company_name, city, state, session)
    personal_emails = [e for e in emails if any(x in e for x in ['gmail.com', 'yahoo.com', 'hotmail.com', 'aol.com', 'outlook.com'])]
    
    if personal_emails:
        print(f"      [FOUND PERSONAL EMAIL VIA SERP] {personal_emails[0]}")
        return personal_emails
        
    # 2. Fallback: Crawl the website homepage & contact subpages
    headers = {
        'User-Agent': random.choice(USER_AGENTS),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
    }
    try:
        res = session.get(url, headers=headers, timeout=10)
        if res.status_code == 200:
            web_emails = extract_emails_from_html(res.text)
            emails.extend(web_emails)
            
            if len(web_emails) == 0:
                soup = BeautifulSoup(res.text, 'html.parser')
                contact_links = []
                for a in soup.find_all('a', href=True):
                    href = a['href'].lower()
                    text = a.get_text().lower()
                    if 'contact' in href or 'contact' in text or 'about' in href or 'about' in text:
                        full_link = urllib.parse.urljoin(url, a['href'])
                        contact_links.append(full_link)
                
                for subpage in list(set(contact_links))[:2]:
                    try:
                        time.sleep(1)
                        sub_res = session.get(subpage, headers=headers, timeout=8)
                        if sub_res.status_code == 200:
                            emails.extend(extract_emails_from_html(sub_res.text))
                    except:
                        pass
    except:
        pass
        
    return list(set(emails))

def push_lead_to_sheets(first_name, email, company, city, state, niche, session):
    url = 'https://script.google.com/macros/s/AKfycby9uH6uVHE6090gmKyqBfvEvc2Q0PD2J2J9nWxl0qqoA6yZFX9_aObsfeePVuf8Snzgow/exec'
    
    lead_data = {
        "company": company,
        "contact": first_name if first_name != "Owner" else "Business Owner",
        "email": email,
        "title": "Owner",
        "niche": niche,
        "status": "New",
        "city": city,
        "state": state,
        "timezone": "EST" if state in ["FL", "GA"] else "PST" if state == "CA" else "CST",
        "followUpDate": "",
        "lastContacted": "",
        "lastSender": "",
        "followUpCount": 0,
        "pitchSent": False,
        "notes": f"Scraped automatically via search dorks. Target City: {city}, {state}.",
        "dealStage": "New",
        "dealValue": 0
    }
    
    payload = {
        "action": "addLead",
        "key": "bdl2024admin",
        "lead": lead_data
    }
    
    try:
        res = session.post(url, json=payload, headers={'Content-Type': 'application/json'}, timeout=15)
        if res.status_code == 200:
            print(f"      [CRM SYNC SUCCESS] Lead synced to Google Sheets CRM!")
        else:
            print(f"      [CRM SYNC WARNING] Failed to sync to Google Sheets CRM (Status: {res.status_code})")
    except Exception as e:
        print(f"      [CRM SYNC ERROR] Could not contact Google Sheets CRM: {e}")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--niche', type=str, default='Restaurant', choices=['Restaurant', 'Lodging'])
    args = parser.parse_args()
    
    niche = args.niche
    config = NICHES_CONFIG[niche]
    
    print(f"=== BDL Connected Lead Extractor Started ===")
    print(f"Targeting Niche: {niche}")
    print(f"Output File: {config['output_file']}")
    
    excluded_emails = load_excluded_emails()
    
    # Overwrite targeted csv with a fresh batch
    csv_file = open(config['output_file'], 'w', newline='', encoding='utf-8')
    writer = csv.writer(csv_file)
    writer.writerow(["First Name", "Email Address", "Company Name", "City"])
        
    leads_found = 0
    scraped_domains = []
    session = requests.Session()
    
    # Shuffle cities to get a random mix across FL, GA, and CA
    shuffled_cities = list(CITIES)
    random.shuffle(shuffled_cities)
    
    for c_obj in shuffled_cities:
        city = c_obj["city"]
        state = c_obj["state"]
        city_str = f"{city}, {state}"
        
        print(f"\nProcessing target city: {city_str}...")
        
        city_urls = []
        # Query search engine using keywords
        for term in config['keywords'][:4]: # run first 4 main keywords
            query = f'{term} "{city_str}" contact'
            urls = search_web(query, session)
            city_urls.extend(urls)
            
            # De-duplicate & filter
            unique_candidates = []
            for u in set(city_urls):
                domain = clean_domain(u)
                if not domain or domain in scraped_domains or any(x in domain for x in DIRECTORY_BLOCKLIST):
                    continue
                unique_candidates.append(u)
                
            if len(unique_candidates) >= 20:
                break
            time.sleep(random.uniform(2.0, 4.0))
            
        candidate_urls = []
        for url in set(city_urls):
            domain = clean_domain(url)
            if not domain or domain in scraped_domains or any(x in domain for x in DIRECTORY_BLOCKLIST):
                continue
            candidate_urls.append(url)
            
        print(f"Found {len(candidate_urls)} candidate URLs for {city_str}.")
        
        for url in candidate_urls:
            domain = clean_domain(url)
            scraped_domains.append(domain)
            
            company_raw = domain.split('.')[0]
            company_name = company_raw.replace('-', ' ').title()
            
            if is_chain(company_name, url, config['blocklist']):
                continue
                
            print(f"   Crawling {company_name} ({domain}) ...")
            emails = scrape_restaurant_emails(url, company_name, city, state, session)
            
            valid_emails = [e for e in emails if e not in excluded_emails]
            
            if len(valid_emails) > 0:
                target_email = valid_emails[0]
                
                # Extract first name from email prefix or default to Owner
                first_name = target_email.split('@')[0].split('.')[0].split('_')[0].split('-')[0].capitalize()
                if len(first_name) < 3 or first_name.lower() in ['info', 'contact', 'reservations', 'bookings', 'office', 'admin', 'hello', 'stay', 'welcome', 'manager', 'frontdesk', 'desk', 'restaurant', 'cafe', 'bistro', 'hotel', 'inn']:
                    first_name = "Owner"
                
                # Write to local CSV
                writer.writerow([first_name, target_email, company_name, city])
                csv_file.flush()
                
                leads_found += 1
                print(f"      [LEAD FOUND] {first_name} | {target_email} | {company_name} | {city} (#{leads_found})")
                
                # Sync to Google Sheets CRM
                push_lead_to_sheets(first_name, target_email, company_name, city, state, niche, session)
                
                excluded_emails.add(target_email)
                
                if leads_found >= 600:
                    print("\n🎉 Success! Reached the target limit of 600 leads.")
                    break
            
            time.sleep(random.uniform(2.0, 4.0))
            
        if leads_found >= 600:
            break
            
    csv_file.close()
    print(f"\n=== Scraper Finished! Added {leads_found} new leads to {config['output_file']} ===")

if __name__ == "__main__":
    main()
