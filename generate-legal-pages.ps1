$langs = @('en','es','pt','de','it','nl','pl','ar','ru','zh','hi')
$srcDir = "src/content/legalPages"

Get-ChildItem "$srcDir/*-fr.md" | ForEach-Object {
    $src = $_
    $content = Get-Content $src.FullName -Raw
    foreach ($lg in $langs) {
        $newContent = $content -replace 'lang: "fr"', "lang: `"$lg`""
        $newName = $src.BaseName -replace '-fr$', "-$lg" + $src.Extension
        Set-Content -Path "$srcDir/$newName" -Value $newContent
        Write-Host "Created: $newName"
    }
}

Write-Host "Done! Total files: $(Get-ChildItem $srcDir/*.md).Count"