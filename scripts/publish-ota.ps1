$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$distPath = Join-Path $root "dist"
$otaFilesDir = Join-Path $root "ota-server\updates\files"
$latestJsonPath = Join-Path $root "ota-server\updates\latest.json"

if (-not (Test-Path $distPath)) {
    Write-Error "dist/ introuvable. Lance 'npm run build' avant."
    exit 1
}

if (-not (Test-Path $otaFilesDir)) {
    New-Item -ItemType Directory -Path $otaFilesDir -Force | Out-Null
}

$currentVersion = "0.0.0"
if (Test-Path $latestJsonPath) {
    $currentVersion = (Get-Content $latestJsonPath | ConvertFrom-Json).version
}
$parts = $currentVersion.Split(".")
$newVersion = "$($parts[0]).$($parts[1]).$([int]$parts[2] + 1)"

$zipFileName = "app-$newVersion.zip"
$zipPath = Join-Path $otaFilesDir $zipFileName

# Both Compress-Archive and ZipFile.CreateFromDirectory write backslash path
# separators into the zip's LOCAL FILE HEADERS on Windows (even though the
# central directory correctly uses forward slashes, which is why tools like
# `unzip -l` or Python's zipfile.namelist() look fine but Android's streaming
# ZipInputStream, which reads local headers, rejects the entries). Build the
# archive entry-by-entry instead, passing explicit forward-slash names so both
# the local header and the central directory agree.
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$zipStream = [System.IO.File]::Open($zipPath, [System.IO.FileMode]::Create)
$archive = New-Object System.IO.Compression.ZipArchive($zipStream, [System.IO.Compression.ZipArchiveMode]::Create)
try {
    Get-ChildItem -Path $distPath -Recurse -File | ForEach-Object {
        $relativePath = $_.FullName.Substring($distPath.Length + 1) -replace '\\', '/'
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $_.FullName, $relativePath, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
    }
} finally {
    $archive.Dispose()
    $zipStream.Dispose()
}

$latest = @{ version = $newVersion; file = $zipFileName } | ConvertTo-Json
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($latestJsonPath, $latest, $utf8NoBom)

Write-Host "Bundle publie : $zipFileName (version $newVersion)"
Write-Host "Etape suivante : commit + push le repo frontend (dossier ota-server/) pour deployer sur Railway."
