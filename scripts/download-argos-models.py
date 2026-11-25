#!/usr/bin/env python3
"""
Telecharge les modeles Argos Translate pour LibreTranslate
Paires FR <-> 10 autres langues
"""
import argostranslate.package
import argostranslate.translate

# Codes de langues Argos
LANG_CODES = {
    'fr': 'fr',
    'en': 'en',
    'es': 'es',
    'pt': 'pt',
    'it': 'it',
    'de': 'de',
    'nl': 'nl',
    'pl': 'pl',
    'ar': 'ar',
    'ru': 'ru',
    'zh': 'zh',
    'hi': 'hi'
}

# Paires FR <-> AUTRE (bidirectionnel)
PAIRS = [
    ('fr', 'en'), ('en', 'fr'),
    ('fr', 'es'), ('es', 'fr'),
    ('fr', 'pt'), ('pt', 'fr'),
    ('fr', 'it'), ('it', 'fr'),
    ('fr', 'de'), ('de', 'fr'),
    ('fr', 'nl'), ('nl', 'fr'),
    ('fr', 'pl'), ('pl', 'fr'),
    ('fr', 'ar'), ('ar', 'fr'),
    ('fr', 'ru'), ('ru', 'fr'),
    ('fr', 'zh'), ('zh', 'fr'),
    ('fr', 'hi'), ('hi', 'fr'),
]

def main():
    print("Mise a jour de l'index des packages Argos...")
    argostranslate.package.update_package_index()
    
    available = argostranslate.package.get_available_packages()
    print(f"{len(available)} packages disponibles")
    
    installed = argostranslate.package.get_installed_packages()
    installed_codes = {(p.from_code, p.to_code) for p in installed}
    print(f"{len(installed)} packages deja installes: {installed_codes}")
    
    for from_code, to_code in PAIRS:
        if (from_code, to_code) in installed_codes:
            print(f"  [SKIP] {from_code}->{to_code} : deja installe")
            continue
        
        # Trouver le package
        pkg = None
        for p in available:
            if p.from_code == from_code and p.to_code == to_code:
                pkg = p
                break
        
        if pkg is None:
            print(f"  [NOT FOUND] {from_code}->{to_code} : package non trouve")
            continue
        
        print(f"  [DOWNLOAD] {from_code}->{to_code}...")
        try:
            pkg.install()
            print(f"  [OK] {from_code}->{to_code} : installe")
        except Exception as e:
            print(f"  [ERROR] {from_code}->{to_code} : erreur - {e}")

    print("\nTermine !")
    
    # Verifier
    installed = argostranslate.package.get_installed_packages()
    print(f"\nPackages installes ({len(installed)}):")
    for p in sorted(installed, key=lambda x: (x.from_code, x.to_code)):
        print(f"   {p.from_code} -> {p.to_code}")

if __name__ == '__main__':
    main()