// cli/generate.ts — Generate Command (schema-org-master)
// Génère JSON-LD pour un type donné

import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { SchemaOrg, createKikiBook, KIKI_BOOKS_FR, KIKI_BOOK_HOOKS, KIKI_BOOK_BENEFITS } from '../index';
import type { BookInput, OfferInput, OrganizationInput } from '../types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateCommand = new Command('generate')
  .description('Generate JSON-LD for a Schema.org type')
  .argument('<type>', 'Schema type to generate (Book, Product, Organization, WebSite, BreadcrumbList, FAQPage, Article, Offer, Review, Person, VideoObject, AudioObject, Course, Event)')
  .option('-d, --data <json>', 'Input data as JSON string')
  .option('-f, --file <path>', 'Input data from JSON file')
  .option('-l, --lang <code>', 'Language code (fr, en, es, pt, it, de, nl, pl, ar, ru, zh, hi)', 'fr')
  .option('-o, --output <path>', 'Output file (default: stdout)')
  .option('--pretty', 'Pretty print JSON', true)
  .option('--strict', 'Strict Schema.org context (no Kiki extensions)', false)
  .action(async (type: string, options) => {
    try {
      let inputData: any = {};

      // Charger données depuis fichier ou JSON string
      if (options.file) {
        const fileContent = await fs.readFile(options.file, 'utf-8');
        inputData = JSON.parse(fileContent);
      } else if (options.data) {
        inputData = JSON.parse(options.data);
      }

      // Ajouter langue
      inputData.inLanguage = options.lang;

      let result: any;

      // Génération selon type
      switch (type.toLowerCase()) {
        case 'book':
        case 'kikibook':
          result = generateBook(inputData, options);
          break;
        case 'product':
          result = SchemaOrg.product(inputData).build();
          break;
        case 'organization':
        case 'org':
          result = SchemaOrg.organization(inputData).build();
          break;
        case 'website':
        case 'webSite':
          result = SchemaOrg.website(inputData).build();
          break;
        case 'breadcrumblist':
        case 'breadcrumb':
          result = SchemaOrg.breadcrumb(inputData).build();
          break;
        case 'faqpage':
        case 'faq':
          result = SchemaOrg.faq(inputData).build();
          break;
        case 'article':
        case 'blogposting':
          result = SchemaOrg.article(inputData).build();
          break;
        case 'offer':
          result = SchemaOrg.offer(inputData).build();
          break;
        case 'review':
          result = SchemaOrg.review(inputData).build();
          break;
        case 'person':
          result = SchemaOrg.person(inputData).build();
          break;
        case 'videoobject':
        case 'video':
          result = SchemaOrg.video(inputData).build();
          break;
        case 'audioobject':
        case 'audiobook':
        case 'audio':
          result = SchemaOrg.audiobook(inputData).build();
          break;
        case 'course':
          result = SchemaOrg.course(inputData).build();
          break;
        case 'event':
          result = SchemaOrg.event(inputData).build();
          break;
        case 'allbooks':
        case 'kiki-books':
          result = generateAllKikiBooks(options.lang);
          break;
        default:
          throw new Error(`Unknown type: ${type}. Use --help for available types.`);
      }

      // Sérialiser
      const { stringifyJsonLd, createContext } = await import('../context');
      const context = options.strict ? createStrictContext(options.lang) : createContext(options.lang);
      const output = stringifyJsonLd({ '@context': context, ...result }, { pretty: options.pretty });

      // Écrire sortie
      if (options.output) {
        await fs.writeFile(options.output, output, 'utf-8');
        console.log(chalk.green(`✅ Generated ${type} → ${options.output}`));
      } else {
        console.log(output);
      }
    } catch (error) {
      console.error(chalk.red('❌ Generation failed:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Helper: générer livre Kiki
function generateBook(input: any, options: any) {
  // Si kikiBookNumber fourni, utiliser helper complet
  if (input.kikiBookNumber && KIKI_BOOKS_FR[input.kikiBookNumber as keyof typeof KIKI_BOOKS_FR]) {
    const base = KIKI_BOOKS_FR[input.kikiBookNumber];
    return createKikiBook({
      ...base,
      ...input,
      kikiBookNumber: input.kikiBookNumber,
      kikiHook: input.kikiHook || KIKI_BOOK_HOOKS[input.kikiBookNumber],
      kikiBenefits: input.kikiBenefits || KIKI_BOOK_BENEFITS[input.kikiBookNumber],
    }).build();
  }

  // Sinon builder générique
  return SchemaOrg.book(input).build();
}

// Helper: générer les 4 livres
function generateAllKikiBooks(lang: string) {
  const books = Object.keys(KIKI_BOOKS_FR).map(num => {
    const n = parseInt(num) as 1 | 2 | 3 | 4;
    const base = KIKI_BOOKS_FR[n];
    return createKikiBook({
      ...base,
      inLanguage: lang,
      kikiBookNumber: n,
      kikiHook: KIKI_BOOK_HOOKS[n],
      kikiBenefits: KIKI_BOOK_BENEFITS[n],
    }).build();
  });

  // Retourner @graph avec tous les livres
  return {
    '@graph': books,
  };
}

// Helper pour strict context
function createStrictContext(lang: string) {
  return {
    '@vocab': 'https://schema.org/',
    '@language': lang,
  };
}