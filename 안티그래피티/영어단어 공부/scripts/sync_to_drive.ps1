# ==========================================================================
#  GOOGLE DRIVE AND GITHUB AUTOMATED SYNC SCRIPT
# ==========================================================================

param (
    [string]$DriveFolder = ""
)

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  6000 English Vocab App - Drive & GitHub Sync" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

$projectDir = Split-Path -Parent $PSScriptRoot
Set-Location -Path $projectDir

# 1. Git Status & Auto Commit
Write-Host "`n[1/2] Checking Git Status for GitHub (https://github.com/chorogiqqq/english)..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host "New changes detected. Staging and committing..." -ForegroundColor Green
    git add .
    git commit -m "Auto-sync: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
} else {
    Write-Host "Git working directory is clean." -ForegroundColor Green
}

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

# 2. Google Drive Sync
Write-Host "`n[2/2] Checking Google Drive Backup Location..." -ForegroundColor Yellow

$possibleDrivePaths = @(
    $DriveFolder,
    "G:\My Drive\EnglishVocab6000",
    "G:\내 드라이브\EnglishVocab6000",
    "$env:USERPROFILE\Google Drive\EnglishVocab6000",
    "$env:USERPROFILE\OneDrive\EnglishVocab6000",
    "$env:USERPROFILE\Desktop\GoogleDrive_Backup"
)

$targetDrivePath = $null
foreach ($path in $possibleDrivePaths) {
    if ($path -and (Test-Path (Split-Path $path -Parent))) {
        $targetDrivePath = $path
        break
    }
}

if (-not $targetDrivePath) {
    $targetDrivePath = "$env:USERPROFILE\Desktop\GoogleDrive_Backup"
}

if (-not (Test-Path $targetDrivePath)) {
    New-Item -ItemType Directory -Force -Path $targetDrivePath | Out-Null
}

Write-Host "Copying latest project backup files to: $targetDrivePath" -ForegroundColor Green
Copy-Item -Path "$projectDir\*" -Destination $targetDrivePath -Recurse -Force -Exclude ".git"

Write-Host "`n✅ Sync completed successfully!" -ForegroundColor Cyan
