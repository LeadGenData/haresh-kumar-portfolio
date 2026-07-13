# sync_sent_from_outlook.ps1
# Scans Sent Items across ALL Outlook accounts from the past 14 days,
# extracts sent email addresses, cross-references with GSheets,
# and uploads/updates leads directly from Outlook sent logs.
# Added timeouts to prevent GSheets API from hanging indefinitely.

$Url = "https://script.google.com/macros/s/AKfycby9uH6uVHE6090gmKyqBfvEvc2Q0PD2J2J9nWxl0qqoA6yZFX9_aObsfeePVuf8Snzgow/exec"
$Password = "bdl2024admin"

Write-Host "=== STARTING DIRECT OUTLOOK SENT MAIL SYNC ===" -ForegroundColor Cyan

# Load local bounced emails list to skip them
$bouncesCSV = "D:\Restaurant_Campaign\campaign_bounces_database.csv"
$bouncedMap = @{}
if (Test-Path $bouncesCSV) {
    $bouncedList = Import-Csv -Path $bouncesCSV
    foreach ($b in $bouncedList) {
        $be = ($b.RecipientEmail + "").Trim().ToLower()
        if ($be) {
            $bouncedMap[$be] = $true
        }
    }
}
Write-Host "Loaded $($bouncedMap.Count) unique bounced emails into local filter."

# Load CRM database
Write-Host "`nFetching current CRM database..." -ForegroundColor Yellow
$BodyGetAll = @{ action = "getAll"; key = $Password } | ConvertTo-Json
try {
    $res = Invoke-RestMethod -Uri $Url -Method Post -Body $BodyGetAll -ContentType "text/plain" -TimeoutSec 30
    $leads = $res.leads
    Write-Host "Loaded $($leads.Count) leads from Leads tab."
} catch {
    Write-Host "[ERROR] Could not fetch leads from CRM database: $_" -ForegroundColor Red
    exit 1
}

# Create a lookup map of existing emails
$existingEmails = @{}
foreach ($l in $leads) {
    $e = ($l.email + "").Trim().ToLower()
    if ($e) {
        $existingEmails[$e] = $l
    }
}

# Parse test_restaurant_clean.csv for details lookup
$restaurantCSV = "D:\Restaurant_Campaign\test_restaurant_clean.csv"
$leadLookup = @{}
if (Test-Path $restaurantCSV) {
    $restaurantList = Import-Csv -Path $restaurantCSV
    foreach ($r in $restaurantList) {
        $re = ($r."Email Address" + "").Trim().ToLower()
        if ($re) {
            $leadLookup[$re] = @{
                Name = $r."First Name"
                Business = $r."Company Name"
                City = $r."City"
            }
        }
    }
    Write-Host "`nLoaded $($leadLookup.Count) restaurant details for lookup." -ForegroundColor Gray
}

# Connect to Outlook
try {
    $outlook = New-Object -ComObject Outlook.Application
    $ns = $outlook.GetNamespace('MAPI')
} catch {
    Write-Host "[ERROR] Cannot open Outlook. Make sure Outlook is running." -ForegroundColor Red
    exit 1
}

$cutoffDate = (Get-Date).AddDays(-14)
Write-Host "`nScanning Sent Items from the past 14 days (cutoff: $($cutoffDate.ToString('yyyy-MM-dd HH:mm:ss')))..." -ForegroundColor Yellow

$addedLeads = 0
$updatedLeads = 0
$skippedLeads = 0
$skippedBounces = 0
$processedEmails = @{}

foreach ($store in $ns.Stores) {
    $storeName = $store.DisplayName
    try {
        $sentFolder = $store.GetDefaultFolder(5) # olFolderSentMail = 5
        $items = $sentFolder.Items
        $items.Sort("[SentOn]", $true) # Newest first
        
        $checked = 0
        $hits = 0
        
        foreach ($item in $items) {
            # Safely get SentOn time
            try {
                if ($item.SentOn -lt $cutoffDate) { break }
            } catch {
                continue
            }
            
            $checked++
            
            # Extract recipient email address
            $recipientEmail = ""
            $recipientName = ""
            try {
                if ($item.Recipients.Count -gt 0) {
                    $recip = $item.Recipients.Item(1)
                    $recipientEmail = ($recip.Address + "").Trim().ToLower()
                    $recipientName = ($recip.Name + "").Trim()
                }
            } catch {
                continue
            }
            
            if (-not $recipientEmail -or -not ($recipientEmail -match '@')) { continue }
            if ($processedEmails.ContainsKey($recipientEmail)) { continue }
            $processedEmails[$recipientEmail] = $true
            
            # Ignore self-sends or internal test domains
            if ($recipientEmail -like "*@bluedatalabs.com" -or $recipientEmail -like "*@dataconnectmail.com" -or $recipientEmail -like "*jamescluster35*") {
                continue
            }
            
            # Skip if lead is in the bounced list
            if ($bouncedMap.ContainsKey($recipientEmail)) {
                $skippedBounces++
                continue
            }
            
            $hits++
            
            # Check if email is already in CRM Leads
            if ($existingEmails.ContainsKey($recipientEmail)) {
                $lead = $existingEmails[$recipientEmail]
                $isAlreadyPitched = ($lead.pitchSent -eq $true -or $lead.pitchSent -eq "TRUE" -or $lead.pitchSent -eq "true" -or $lead.dealStage -eq "Pitched" -or $lead.status -eq "Pitched")
                
                if (-not $isAlreadyPitched) {
                    Write-Host "  [$storeName] Updating existing lead to Pitched: $recipientEmail..." -ForegroundColor Cyan
                    
                    $changes = @{
                        pitchSent = $true
                        status = "Pitched"
                        lastContacted = $item.SentOn.ToString("yyyy-MM-dd HH:mm:ss")
                        lastSender = $storeName
                    }
                    
                    $BodyUpdate = @{
                        action = "updateLead"
                        id = $lead.id
                        changes = $changes
                        tab = "Leads"
                        key = $Password
                    } | ConvertTo-Json
                    
                    try {
                        $updRes = Invoke-RestMethod -Uri $Url -Method Post -Body $BodyUpdate -ContentType "text/plain" -TimeoutSec 20
                        if ($updRes.success) {
                            $updatedLeads++
                            $lead.pitchSent = $true
                            $lead.status = "Pitched"
                        }
                    } catch {
                        Write-Host "    [WARNING] Timeout or connection error updating $recipientEmail. Skipping." -ForegroundColor Yellow
                    }
                    Start-Sleep -Milliseconds 200
                } else {
                    $skippedLeads++
                }
            } else {
                # Add as a new lead
                # Lookup details (name, company) from test_restaurant_clean.csv
                $details = $leadLookup[$recipientEmail]
                
                $name = if ($details) { $details.Name } else { 
                    # Fallback to name from Outlook if it doesn't look like a raw email address
                    if ($recipientName -and $recipientName -notmatch '@') { $recipientName } else { "Owner" }
                }
                
                $business = if ($details) { $details.Business } else {
                    # If Outlook display name has something like "B Bistro Miami", use it
                    if ($recipientName -and $recipientName -notmatch '@' -and $recipientName -ne $name) { $recipientName } else { "Restaurant" }
                }
                
                $city = if ($details) { $details.City } else { "Miami" }
                
                Write-Host "  [$storeName] Uploading new sent lead: $recipientEmail ($business)..." -ForegroundColor Green
                
                $newLead = @{
                    email = $recipientEmail
                    name = $name
                    business = $business
                    city = $city
                    niche = "restaurant"
                    status = "Pitched"
                    pitchSent = $true
                    outreachLog = @(
                        @{
                            date = $item.SentOn.ToString("yyyy-MM-dd HH:mm:ss")
                            type = "Email Outreach"
                            detail = "Pitched directly via Outlook from $storeName"
                        }
                    )
                }
                
                $BodyAdd = @{
                    action = "addLead"
                    lead = $newLead
                    key = $Password
                } | ConvertTo-Json
                
                try {
                    $addRes = Invoke-RestMethod -Uri $Url -Method Post -Body $BodyAdd -ContentType "text/plain" -TimeoutSec 20
                    if ($addRes.success) {
                        $addedLeads++
                        $existingEmails[$recipientEmail] = $newLead
                    }
                } catch {
                    Write-Host "    [WARNING] Timeout or connection error adding $recipientEmail. Skipping." -ForegroundColor Yellow
                }
                Start-Sleep -Milliseconds 250
            }
        }
        
        Write-Host "[$storeName] Checked $checked sent items - found $hits campaign dispatches"
    } catch {
        Write-Host "[SKIP] Store $($store.DisplayName): $_" -ForegroundColor Gray
    }
}

Write-Host "`n=== DIRECT OUTLOOK SYNC SUMMARY ===" -ForegroundColor Cyan
Write-Host "New leads added to CRM:     $addedLeads" -ForegroundColor Green
Write-Host "Existing leads updated:      $updatedLeads" -ForegroundColor Cyan
Write-Host "Leads already set correctly:  $skippedLeads" -ForegroundColor Gray
Write-Host "Bounced leads skipped:       $skippedBounces" -ForegroundColor Red
Write-Host "===================================="
