/**
 * Glossaire contextualisé pour préserver termes théologiques, noms propres, références bibliques
 * Organisé par contexte d'utilisation
 */

export const GLOSSARY: Record<string, Record<string, string>> = {
  // ──────────────────────────────────────────────
  // Noms propres (garder tel quel)
  // ──────────────────────────────────────────────
  names: {
    'Jésus': 'Jésus',
    'Jésus-Christ': 'Jésus-Christ',
    'Christ': 'Christ',
    'Dieu': 'Dieu',
    'Seigneur': 'Seigneur',
    'Père': 'Père',
    'Saint-Esprit': 'Saint-Esprit',
    'Esprit Saint': 'Esprit Saint',
    'Saint Esprit': 'Saint Esprit',
    'Marie': 'Marie',
    'Joseph': 'Joseph',
    'Jean': 'Jean',
    'Pierre': 'Pierre',
    'Paul': 'Paul',
    'Apôtre Paul': 'Apôtre Paul',
    'Moïse': 'Moïse',
    'David': 'David',
    'Salomon': 'Salomon',
    'Élie': 'Élie',
    'Ézéchiel': 'Ézéchiel',
    'Daniel': 'Daniel',
    'Isaïe': 'Isaïe',
    'Jérémie': 'Jérémie',
    'Abraham': 'Abraham',
    'Isaac': 'Isaac',
    'Jacob': 'Jacob',
    'Noé': 'Noé',
    'Adam': 'Adam',
    'Ève': 'Ève',
    'Satan': 'Satan',
    'Lucifer': 'Lucifer',
    'Michel': 'Michel',
    'Gabriel': 'Gabriel',
    'Raphaël': 'Raphaël',
  },

  // ──────────────────────────────────────────────
  // Livres bibliques (format standard)
  // ──────────────────────────────────────────────
  bible_books: {
    'Genèse': 'Genèse',
    'Exode': 'Exode',
    'Lévitique': 'Lévitique',
    'Nombres': 'Nombres',
    'Deutéronome': 'Deutéronome',
    'Josué': 'Josué',
    'Juges': 'Juges',
    'Ruth': 'Ruth',
    '1 Samuel': '1 Samuel',
    '2 Samuel': '2 Samuel',
    '1 Rois': '1 Rois',
    '2 Rois': '2 Rois',
    '1 Chroniques': '1 Chroniques',
    '2 Chroniques': '2 Chroniques',
    'Esdras': 'Esdras',
    'Néhémie': 'Néhémie',
    'Esther': 'Esther',
    'Job': 'Job',
    'Psaumes': 'Psaumes',
    'Proverbes': 'Proverbes',
    'Ecclésiaste': 'Ecclésiaste',
    'Cantique des Cantiques': 'Cantique des Cantiques',
    'Isaïe': 'Isaïe',
    'Jérémie': 'Jérémie',
    'Lamentations': 'Lamentations',
    'Ézéchiel': 'Ézéchiel',
    'Daniel': 'Daniel',
    'Osée': 'Osée',
    'Joël': 'Joël',
    'Amos': 'Amos',
    'Abdias': 'Abdias',
    'Jonas': 'Jonas',
    'Michée': 'Michée',
    'Nahum': 'Nahum',
    'Habacuc': 'Habacuc',
    'Sophonie': 'Sophonie',
    'Aggée': 'Aggée',
    'Zacharie': 'Zacharie',
    'Malachie': 'Malachie',
    'Matthieu': 'Matthieu',
    'Marc': 'Marc',
    'Luc': 'Luc',
    'Jean': 'Jean',
    'Actes': 'Actes',
    'Romains': 'Romains',
    '1 Corinthiens': '1 Corinthiens',
    '2 Corinthiens': '2 Corinthiens',
    'Galates': 'Galates',
    'Éphésiens': 'Éphésiens',
    'Philippiens': 'Philippiens',
    'Colossiens': 'Colossiens',
    '1 Thessaloniciens': '1 Thessaloniciens',
    '2 Thessaloniciens': '2 Thessaloniciens',
    '1 Timothée': '1 Timothée',
    '2 Timothée': '2 Timothée',
    'Tite': 'Tite',
    'Philémon': 'Philémon',
    'Hébreux': 'Hébreux',
    'Jacques': 'Jacques',
    '1 Pierre': '1 Pierre',
    '2 Pierre': '2 Pierre',
    '1 Jean': '1 Jean',
    '2 Jean': '2 Jean',
    '3 Jean': '3 Jean',
    'Jude': 'Jude',
    'Apocalypse': 'Apocalypse',
  },

  // ──────────────────────────────────────────────
  // Termes théologiques clés (traduction standardisée)
  // ──────────────────────────────────────────────
  theology: {
    'salut': 'salut',
    'rédemption': 'rédemption',
    'justification': 'justification',
    'sanctification': 'sanctification',
    'grâce': 'grâce',
    'foi': 'foi',
    'repentance': 'repentance',
    'conversion': 'conversion',
    'nouvelle naissance': 'nouvelle naissance',
    'régénération': 'régénération',
    'adoption': 'adoption',
    'élection': 'élection',
    'prédestination': 'prédestination',
    'glorification': 'glorification',
    'trinité': 'trinité',
    'incarnation': 'incarnation',
    'résurrection': 'résurrection',
    'ascension': 'ascension',
    'pentecôte': 'pentecôte',
    'baptême': 'baptême',
    'cène': 'cène',
    'sainte cène': 'sainte cène',
    'communion': 'communion',
    'église': 'église',
    'corps de Christ': 'corps de Christ',
    'épouse de Christ': 'épouse de Christ',
    'royaume de Dieu': 'royaume de Dieu',
    'royaume des cieux': 'royaume des cieux',
    'vie éternelle': 'vie éternelle',
    'jugement dernier': 'jugement dernier',
    'enfer': 'enfer',
    'paradis': 'paradis',
    'ciel': 'ciel',
    'prière': 'prière',
    'intercession': 'intercession',
    'adoration': 'adoration',
    'louange': 'louange',
    'jeûne': 'jeûne',
    'dîme': 'dîme',
    'offrande': 'offrande',
    'ministère': 'ministère',
    'appel': 'appel',
    'onction': 'onction',
    'dons spirituels': 'dons spirituels',
    'fruit de l\'Esprit': 'fruit de l\'Esprit',
    'armure de Dieu': 'armure de Dieu',
    'guerre spirituelle': 'guerre spirituelle',
    'délivrance': 'délivrance',
    'guérison': 'guérison',
    'miracles': 'miracles',
    'prophétie': 'prophétie',
    'discernement': 'discernement',
    'sagesse': 'sagesse',
    'connaissance': 'connaissance',
    'intelligence': 'intelligence',
    'conseil': 'conseil',
    'force': 'force',
    'crainte de Dieu': 'crainte de Dieu',
    'piété': 'piété',
  },

  // ──────────────────────────────────────────────
  // Références bibliques (format standard)
  // ──────────────────────────────────────────────
  bible_refs: {
    'Jean 3:16': 'Jean 3:16',
    'Jean 10:27': 'Jean 10:27',
    'Romains 8:28': 'Romains 8:28',
    'Philippiens 4:6-7': 'Philippiens 4:6-7',
    'Éphésiens 6:10-18': 'Éphésiens 6:10-18',
    '1 Jean 1:9': '1 Jean 1:9',
    '2 Timothée 3:16': '2 Timothée 3:16',
    'Hébreux 4:12': 'Hébreux 4:12',
    'Psaume 23': 'Psaume 23',
    'Psaume 91': 'Psaume 91',
    'Proverbes 3:5-6': 'Proverbes 3:5-6',
    'Jérémie 29:11': 'Jérémie 29:11',
    'Ésaïe 40:31': 'Ésaïe 40:31',
    'Matthieu 6:9-13': 'Matthieu 6:9-13',
    'Matthieu 28:19-20': 'Matthieu 28:19-20',
    'Actes 1:8': 'Actes 1:8',
    'Galates 5:22-23': 'Galates 5:22-23',
    '1 Corinthiens 13': '1 Corinthiens 13',
    'Romains 12:1-2': 'Romains 12:1-2',
  },

  // ──────────────────────────────────────────────
  // UI/Navigation (traduction standardisée)
  // ──────────────────────────────────────────────
  ui: {
    'Accueil': 'Accueil',
    'Blog': 'Blog',
    'Livres': 'Livres',
    'Contact': 'Contact',
    'Partenaires': 'Partenaires',
    'Mentions légales': 'Mentions légales',
    'Confidentialité': 'Confidentialité',
    'Cookies': 'Cookies',
    'CGV': 'CGV',
    'Accessibilité': 'Accessibilité',
    'Rechercher': 'Rechercher',
    'Langue': 'Langue',
    'S\'abonner': 'S\'abonner',
    'Newsletter': 'Newsletter',
    'Email': 'Email',
    'Envoyer': 'Envoyer',
    'Lire la suite': 'Lire la suite',
    'Articles similaires': 'Articles similaires',
    'Catégories': 'Catégories',
    'Tags': 'Tags',
    'Série': 'Série',
    'Temps de lecture': 'Temps de lecture',
    'Partager': 'Partager',
    'Précédent': 'Précédent',
    'Suivant': 'Suivant',
    'Page': 'Page',
    'sur': 'sur',
    'Aucun article': 'Aucun article',
    'Filtrer': 'Filtrer',
    'Effacer les filtres': 'Effacer les filtres',
  },
};

/**
 * Aplatit le glossaire pour utilisation dans les providers
 */
export function getFlatGlossary(): Record<string, string> {
  const flat: Record<string, string> = {};
  for (const category of Object.values(GLOSSARY)) {
    Object.assign(flat, category);
  }
  return flat;
}

/**
 * Obtient les entrées de glossaire pour un contexte donné
 */
export function getGlossaryForContext(context: string): Record<string, string> {
  return GLOSSARY[context] || {};
}

/**
 * Vérifie si un terme est dans le glossaire (ne pas traduire)
 */
export function isGlossaryTerm(term: string): boolean {
  const flat = getFlatGlossary();
  return term in flat;
}

/**
 * Obtient la traduction glossaire d'un terme
 */
export function getGlossaryTranslation(term: string): string | undefined {
  const flat = getFlatGlossary();
  return flat[term];
}