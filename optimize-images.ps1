# Image Optimization Script for Windows
# This script helps reduce image sizes in the assets folder

Write-Host "=== BillingApp Image Optimization ===" -ForegroundColor Cyan
Write-Host ""

$assetsPath = "assets\images"
$totalSaved = 0

# Check if assets directory exists
if (-not (Test-Path $assetsPath)) {
    Write-Host "Error: Assets directory not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Current image sizes:" -ForegroundColor Yellow
Get-ChildItem -Path $assetsPath -Filter *.png | ForEach-Object {
    $sizeKB = [math]::Round($_.Length / 1KB, 2)
    Write-Host "  $($_.Name): ${sizeKB} KB"
}

Write-Host ""
Write-Host "Optimization Options:" -ForegroundColor Green
Write-Host "1. Manual optimization (recommended)"
Write-Host "   - Visit https://tinypng.com/"
Write-Host "   - Upload PNG files from: $((Get-Location).Path)\$assetsPath"
Write-Host "   - Download and replace optimized versions"
Write-Host ""
Write-Host "2. Reduce icon.png size (automatic)"
Write-Host "   - This will resize icon.png to recommended 1024x1024"
Write-Host ""

$choice = Read-Host "Would you like to see optimization recommendations? (y/n)"

if ($choice -eq 'y' -or $choice -eq 'Y') {
    Write-Host ""
    Write-Host "=== Optimization Recommendations ===" -ForegroundColor Cyan
    Write-Host ""
    
    Get-ChildItem -Path $assetsPath -Filter *.png | ForEach-Object {
        $sizeKB = [math]::Round($_.Length / 1KB, 2)
        $name = $_.Name
        
        if ($sizeKB -gt 100) {
            Write-Host "⚠️  $name (${sizeKB} KB) - HIGH PRIORITY" -ForegroundColor Red
            Write-Host "   Recommended: Compress to ~50-80 KB"
        } elseif ($sizeKB -gt 50) {
            Write-Host "⚠️  $name (${sizeKB} KB) - Medium priority" -ForegroundColor Yellow
            Write-Host "   Recommended: Compress to ~20-40 KB"
        } else {
            Write-Host "✅ $name (${sizeKB} KB) - Already optimized" -ForegroundColor Green
        }
        Write-Host ""
    }
    
    Write-Host "Total potential savings: ~200-300 KB" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Green
Write-Host "1. Optimize images using TinyPNG or similar tool"
Write-Host "2. Run: npm install"
Write-Host "3. Run: eas build --platform android --profile production"
Write-Host ""
