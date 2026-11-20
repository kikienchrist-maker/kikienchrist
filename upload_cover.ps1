# Upload cover to Payhip via their API
# Prerequisites: You need your Payhip API key (Settings > API)
# Replace YOUR_API_KEY below

$apiKey = "YOUR_API_KEY"  # REPLACE THIS
$productId = "gps0X"       # The Face of God English product
$imagePath = "C:\Users\Admin\Desktop\COUVERTURES\VISAGE DE DIEU\EN\frontcover.jpg.jpg"

if (-not (Test-Path $imagePath)) {
    Write-Error "Image not found at $imagePath"
    exit 1
}

$bytes = [System.IO.File]::ReadAllBytes($imagePath)
$base64 = [Convert]::ToBase64String($bytes)
$dataUri = "data:image/jpeg;base64,$base64"

# Payhip API endpoint for updating product cover
# Note: Payhip's public API may not support cover upload directly
# This is a best-effort attempt based on common patterns

$headers = @{
    "Authorization" = "Bearer $apiKey"
    "Content-Type" = "application/json"
}

$body = @{
    cover_image = $dataUri
} | ConvertTo-Json -Depth 3

try {
    $response = Invoke-RestMethod -Method POST -Uri "https://api.payhip.com/v1/products/$productId" -Headers $headers -Body $body
    Write-Host "Success! Response:" $response
} catch {
    Write-Error "Upload failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        Write-Error "Response: $($reader.ReadToEnd())"
    }
}