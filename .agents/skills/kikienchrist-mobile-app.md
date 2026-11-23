---
name: kikienchrist-mobile-app
description: "Application Mobile (PWA → React Native/Expo iOS/Android) — Push Notifications, Offline-First, Store Deployment, Deep Linking, Analytics, RevenueCat, Synchronisation Web"
version: "1.0"
---

# Skill: kikienchrist-mobile-app

## Objectif
Lancer une **application mobile native (iOS + Android)** depuis la base PWA Astro existante — Réutiliser 80% du code (Design System, Composants, Logique), ajouter capacités natives (Push, Offline, Biométrique, Store), monétiser via RevenueCat, mesurer avec analytics unifié.

---

## 1. Stratégie : PWA → Native Progressive Enhancement

| Phase | Approche | Technologie | Partage Code | Durée | Investissement |
|-------|----------|-------------|--------------|-------|----------------|
| **Phase 0 (Actuel)** | **PWA Optimale** | Astro + Service Worker (Workbox) + Manifest | 100% Web | - | Inclus |
| **Phase 1 (3-6 mois)** | **Hybride (Capacitor)** | Astro + Capacitor + Ionic/Capacitor Plugins | 90% Web + 10% Native | 3-6 mois | ~15-25k€ |
| **Phase 2 (6-12 mois)** | **React Native / Expo** | Expo (Expo Router) + Shared Monorepo (Nx/Turborepo) | 60-70% (UI Kit, Hooks, Types, API, Store) | 6-12 mois | ~50-100k€ |
| **Phase 3 (12+ mois)** | **Native Optimisé** | React Native (New Architecture) + Modules Natifs (Swift/Kotlin) | 50% (Core) + 50% (Platform-specific) | Continue | Équipe dédiée |

> **Recommandation** : **Phase 1 → Phase 2** — Capacitor pour validation marché (Store, Push, Offline) rapide, puis migration Expo pour performance/UX native supérieure.

---

## 2. Architecture Monorepo (Nx / Turborepo)

```
kikienchrist-monorepo/
├── apps/
│   ├── web/                    # Astro (Site actuel → PWA)
│   │   ├── src/
│   │   ├── astro.config.mjs
│   │   └── package.json
│   ├── mobile/                 # Expo (React Native)
│   │   ├── app/                # Expo Router (File-based routing)
│   │   ├── src/
│   │   │   ├── components/     # Composants RN spécifiques
│   │   │   ├── hooks/          # Hooks RN (usePush, useBiometric, etc.)
│   │   │   ├── navigation/     # Navigation native (Expo Router)
│   │   │   ├── native/         # Modules natifs (Swift/Kotlin)
│   │   │   └── utils/
│   │   ├── app.config.ts       # Config Expo (Bundle ID, Permissions, Plugins)
│   │   ├── eas.json            # EAS Build config
│   │   └── package.json
│   └── admin/                  # Dashboard admin (Next.js/Remix) — Optionnel
│
├── packages/
│   ├── ui/                     # **Design System Partagé** (React + RN compatible)
│   │   ├── src/
│   │   │   ├── primitives/     # Box, Text, Button, Input, Card, Badge, Avatar
│   │   │   ├── tokens/         # Design Tokens (Colors, Spacing, Typography, Shadows) — Style Dictionary
│   │   │   ├── patterns/       # BookCard, HeroFan, NewsletterForm, LanguageSwitcher
│   │   │   ├── hooks/          # useTheme, useLocale, useBreakpoint, useColorScheme
│   │   │   └── index.ts
│   │   ├── package.json        # Exports: "react", "react-native"
│   │   └── tailwind.config.ts  # Partagé (NativeWind / Tailwind RN)
│   │
│   ├── core/                   # **Logique Métier Partagée** (TypeScript pur)
│   │   ├── src/
│   │   │   ├── api/            # Client API (TanStack Query / RTK Query) — Endpoints, Types
│   │   │   ├── auth/           # Auth state machine (XState) + Tokens + Biometric
│   │   │   ├── books/          # Book types, helpers, purchase logic
│   │   │   ├── content/        # Translations loader, Content types, SEO helpers
│   │   │   ├── i18n/           # i18n core (formats, plurals, RTL) — ICU MessageFormat
│   │   │   ├── notifications/  # Push types, Local notifications, Deep link handlers
│   │   │   ├── offline/        # Offline queue, Sync engine, Conflict resolution
│   │   │   ├── purchases/      # RevenueCat wrapper, Entitlements, Restore logic
│   │   │   ├── analytics/      # Event types, Unified tracker (Web + Native)
│   │   │   └── storage/        # Secure storage (MMKV/Keychain/Keystore), Cache
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── config/                 # **Configuration Partagée**
│   │   ├── env.ts              # Validation Zod (Web + Native)
│   │   ├── constants.ts        # URLs, Endpoints, Feature flags keys
│   │   ├── design-tokens.ts    # Source unique vérité (Style Dictionary → CSS + RN)
│   │   └── feature-flags.ts    # Flag definitions + Default values
│   │
│   └── testing/                # **Tests Partagés**
│       ├── jest-preset.ts
│       ├── rtl-preset.tsx
│       ├── detox-preset.ts
│       └── storybook-preset.ts
│
├── tools/
│   ├── generators/             # Nx generators (Component, Screen, Feature)
│   ├── scripts/                # Build, Sync, Deploy, Release scripts
│   └── ci/                     # GitHub Actions workflows partagés
│
├── nx.json / turbo.json
├── package.json                # Workspaces + Scripts root
├── tsconfig.base.json
└── README.md
```

### Partage Code Réel (Exemples)

```typescript
// packages/ui/src/primitives/Button.tsx — Composant UNIQUE Web + Native
import { Pressable, Text, StyleSheet } from 'react-native';
import { Slot } from '@radix-ui/react-slot'; // Web only
import { styled, css } from 'styled-components'; // ou NativeWind/Tailwind

// Détection plateforme
const isWeb = typeof document !== 'undefined';

export const Button = ({ children, variant = 'primary', size = 'md', href, onPress, ...props }) => {
  // Web: <a> ou <button> — Native: <Pressable>
  const Component = isWeb && href ? 'a' : Pressable;
  
  return (
    <Component
      {...(isWeb && href ? { href } : { onPress })}
      style={[
        styles.base,
        styles[variant],
        styles[size],
        !isWeb && styles.nativeTouch, // Ripple effect native
        props.style
      ]}
      {...props}
    >
      <Text style={styles.text}>{children}</Text>
    </Component>
  );
};

// packages/core/src/api/client.ts — Client API UNIQUE
import { createTRPCReact } from '@trpc/react-query'; // ou TanStack Query + OpenAPI

export const api = createTRPCReact<AppRouter>();

// packages/core/src/i18n/index.ts — i18n UNIQUE (ICU MessageFormat)
import { createI18n } from '@lingui/core'; // ou formatjs/intl-messageformat
import { messages as fr } from './locales/fr/messages';
import { messages as en } from './locales/en/messages';
// ... 9 langues

export const i18n = createI18n({ locale: 'fr', messages: { fr, en, ... } });
```

---

## 3. Fonctionnalités Natives Clés (Phase 1+2)

### 3.1 Push Notifications (Expo Push / Firebase FCM / OneSignal)
| Type | Déclencheur | Payload | Deep Link | Opt-in |
|------|-------------|---------|-----------|--------|
| **Nouvel Épisode Podcast** | Publication RSS | `{ episodeId, title, guest }` | `app://podcast/{{episodeId}}` | Topic `podcast` |
| **Nouvel Article Blog** | Publication CMS | `{ postId, title, category }` | `app://blog/{{postId}}` | Topic `blog` |
| **Nouvelle Vidéo** | Upload YouTube | `{ videoId, title, platform }` | `app://video/{{videoId}}` | Topic `video` |
| **Promo Livre** | Lancement / Soldes | `{ bookId, discount, expiresAt }` | `app://books/{{bookId}}` | Topic `offers` |
| **Prière / Verset Quotidien** | Cron 7h locale | `{ verse, reference, date }` | `app://prayer` | Topic `daily` (Default ON) |
| **Réponse Commentaire** | Webhook Backend | `{ threadId, author, preview }` | `app://community/{{threadId}}` | Auto (si abonné fil) |
| **Abandon Panier** | 24h après ajout | `{ bookId, format, cartUrl }` | `app://checkout` | Topic `offers` |
| **Anniversaire / Milestone** | Date utilisateur | `{ milestone, reward }` | `app://profile` | Topic `personal` |

**Architecture** :
```
Backend (Netlify Function / Node) → Expo Push API / FCM → Device
  │
  ├─▶ Token Management : Expo Push Token stocké en DB (user.push_token) + Sync à chaque login
  ├─▶ Topics : Abonnement/Désabonnement via API (User Preferences)
  ├─▶ Rich Notifications : Image (Couverture livre), Actions (Lire, Plus tard, Désabonner)
  ├─▶ Analytics : Delivery → Open → Action → Conversion (RevenueCat + GA4)
  └─▶ Fallback : Email (si push désactivé/échoué) → MailerLite
```

### 3.2 Offline-First (MMKV + TanStack Query + Background Sync)
| Donnée | Stratégie Cache | TTL | Sync |
|--------|-----------------|-----|------|
| **Traductions (translations.json)** | **Bundle initial** (Inclus dans binaire) + Update OTA | ∞ (Versionné) | OTA (Expo Updates) + Background fetch |
| **Livres (Métadonnées, URLs)** | MMKV (Persistant) | 30 jours | Background fetch (WiFi + Charging) |
| **Articles Blog (Lu/Récents)** | MMKV + TanStack Query Cache | 7 jours | Stale-while-revalidate |
| **Épisodes Podcast (Métadonnées)** | MMKV | 30 jours | Background fetch |
| **Progression Lecture (Livres)** | **Secure Storage** (MMKV encrypted) | ∞ | **Immédiat** (Optimistic) → Sync Background |
| **Préférences Utilisateur** | Secure Storage | ∞ | Immédiat |
| **Contenu Téléchargé (PDF, Audio, Vidéo)** | FileSystem (Expo FileSystem) | Manuel (User gère) | N/A (Local only) |
| **Queue Actions Offline** | MMKV (Array sérialisé) | ∞ | **Au retour online** (Retry exponentiel) |

**Moteur Sync** (`packages/core/src/offline/sync-engine.ts`) :
```typescript
// Queue d'actions : { id, type: 'purchase'|'progress'|'preference', payload, timestamp, retries }
// Stratégie : 
// 1. Priorité : Achats > Progression > Préférences > Analytics
// 2. Conflits : Last-write-wins (Timestamp serveur) + Merge intelligent (Progression = max(local, server))
// 3. Retry : Exponentiel (1m, 5m, 15m, 1h, 6h) + Dead letter queue après 24h
// 4. Idempotence : Clé unique par action (userId + type + entityId + timestamp)
```

### 3.3 Authentification Biométrique + Passkeys (WebAuthn)
| Méthode | Web | iOS | Android | Usage |
|---------|-----|-----|---------|-------|
| **Face ID / Touch ID** | ❌ | ✅ (LocalAuthentication) | ✅ (BiometricPrompt) | Déverrouillage app, Paiement, Données sensibles |
| **Passkeys (WebAuthn)** | ✅ (Conditional UI) | ✅ (iCloud Keychain) | ✅ (Google Password Manager) | **Connexion sans mot de passe** (Primary) |
| **Magic Link Email** | ✅ | ✅ | ✅ | Fallback, Récupération |
| **Social (Google/Apple/GitHub)** | ✅ | ✅ | ✅ | Inscription rapide |
| **Email/Mot de passe** | ✅ | ✅ | ✅ | Legacy / Entreprise |

**Flux Passkeys (Recommandé Primary)** :
1. Inscription → Création Passkey (Attestation) → Stockage Clé Publique (Serveur) + Privée (Device/Cloud Sync)
2. Connexion → Demande Attestation (Challenge) → Signature Clé Privée (Biometrique/Device) → Vérification Serveur
3. **Avantages** : Phishing-resistant, Pas de mot de passe, Sync cross-device (iCloud/Google), Standard FIDO2

### 3.4 Achats In-App & Abonnements (RevenueCat)
| Produit | Type | Prix | Plateforme | Gestion |
|---------|------|------|------------|---------|
| **Livre Numérique (PDF/ePub)** | Consommable (Non-rénouvelable) | 4.99-14.99€ | iOS (App Store) + Android (Play Store) | RevenueCat Entitlement `book_{{bookId}}` |
| **Abonnement "Kiki Plus"** | Rénouvelable (Mensuel/Annuel) | 4.99€/mois / 49.99€/an | iOS + Android | Entitlement `kiki_plus` |
| **Pack "4 Livres"** | Non-consommable | 39.99€ | iOS + Android | Entitlement `bundle_4books` |
| **Don / Soutien** | Consommable (Tip) | 1.99€ / 4.99€ / 9.99€ | iOS + Android | Entitlement `supporter` (Badge) |

**RevenueCat Setup** :
- **Offres** : Configurées dans Dashboard RC (Packages, Paywalls, Experiments)
- **Paywalls** : Remote Config (JSON) → Affichage dynamique natif (Pas de store update pour changer prix/offre)
- **Webhooks** : `RC_WEBHOOK_URL` → Netlify Function → Sync Entitlements DB + Email confirmation + Analytics
- **Restoration** : `Purchases.restorePurchases()` → Sync → UI mise à jour
- **Server-side Receipt Validation** : Auto (RC) — Sécurisé

### 3.5 Deep Linking & Universal Links
| Lien | Schema | iOS (Universal Link) | Android (App Link) | Web Fallback |
|------|--------|----------------------|---------------------|--------------|
| **Livre** | `app://books/{{bookId}}` | `https://kikienchrist.app/books/{{bookId}}` | `https://kikienchrist.app/books/{{bookId}}` | `/{{lang}}/books/{{bookId}}` |
| **Podcast** | `app://podcast/{{episodeId}}` | `https://kikienchrist.app/podcast/{{episodeId}}` | ... | `/{{lang}}/podcast/{{episodeId}}` |
| **Blog** | `app://blog/{{postId}}` | ... | ... | `/{{lang}}/blog/{{postId}}` |
| **Communauté** | `app://community/{{threadId}}` | ... | ... | `/{{lang}}/community/{{threadId}}` |
| **Profil** | `app://profile` | ... | ... | `/{{lang}}/profile` |
| **Checkout** | `app://checkout?book={{bookId}}&format={{format}}` | ... | ... | `/{{lang}}/checkout?...` |
| **Partage** | `app://share?content={{type}}&id={{id}}&ref={{userId}}` | ... | ... | `/{{lang}}/share?...` |

**Configuration** :
- `apple-app-site-association` + `assetlinks.json` hébergés sur `https://kikienchrist.app/.well-known/`
- Expo `app.config.ts` → `ios.associatedDomains`, `android.intentFilters`
- Gestionnaire centralisé `packages/core/src/notifications/deep-link-handler.ts`

---

## 4. Analytics Unifié (Web + Mobile)

### Événements Standards (Schema Partagé `packages/core/src/analytics/events.ts`)
```typescript
// Base commune
interface BaseEvent {
  event: string;
  timestamp: number;
  session_id: string;
  user_id?: string;
  anonymous_id: string;
  platform: 'web' | 'ios' | 'android';
  app_version: string;
  locale: string;
  properties: Record<string, unknown>;
}

// Événements clés
type AppEvent =
  | { event: 'app_open'; properties: { cold_start: boolean; referrer?: string } }
  | { event: 'screen_view'; properties: { screen_name: string; previous_screen?: string } }
  | { event: 'book_view'; properties: { book_id: string; format: 'paper'|'ebook'|'audio'; source: string } }
  | { event: 'purchase_initiated'; properties: { book_id: string; format: string; price: number; currency: string } }
  | { event: 'purchase_completed'; properties: { book_id: string; format: string; price: number; currency: string; transaction_id: string; platform: 'web'|'ios'|'android'|'revenuecat' } }
  | { event: 'push_received'; properties: { campaign_id: string; topic: string } }
  | { event: 'push_opened'; properties: { campaign_id: string; topic: string; deep_link: string } }
  | { event: 'offline_action_queued'; properties: { action_type: string; entity_id: string } }
  | { event: 'offline_sync_completed'; properties: { synced_count: number; failed_count: number } }
  | { event: 'biometric_auth'; properties: { success: boolean; method: 'faceid'|'touchid'|'passkey'|'biometric_prompt' } }
  | { event: 'language_changed'; properties: { from: string; to: string } }
  | { event: 'theme_changed'; properties: { from: 'light'|'dark'|'system'; to: 'light'|'dark'|'system' } };
```

### Destinations
| Destination | Web | Mobile | Config |
|-------------|-----|--------|--------|
| **GA4** | ✅ (gtag.js) | ✅ (Firebase Analytics + Measurement Protocol) | `packages/core/src/analytics/providers/ga4.ts` |
| **Amplitude / Mixpanel** | ✅ | ✅ (SDKs natifs) | Identify + Track unifié |
| **RevenueCat** | ❌ | ✅ (Auto via SDK) | Achats, Abonnements, Trials |
| **Sentry** | ✅ | ✅ (Expo Sentry + Native) | Errors, Performance, Traces |
| **Data Lake (Custom)** | ✅ (Netlify Function) | ✅ (Direct HTTP / Batch) | `analytics_events` table |

---

## 5. Déploiement & Stores (EAS / Fastlane)

### Expo Application Services (EAS) — Build & Submit
```yaml
# eas.json
{
  "cli": { "version": ">= 5.0" },
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" },
    "preview": { "distribution": "internal", "ios": { "simulator": true } },
    "production": { "autoIncrement": true, "cache": { "key": "v1" } }
  },
  "submit": {
    "production": {
      "ios": { "appleId": "team@kikienchrist.com", "ascAppId": "123456789" },
      "android": { "serviceAccountKeyPath": "./google-play-key.json", "track": "production" }
    }
  }
}
```

### Processus Release (Mensuel → Bi-hebdo)
```
1. Feature Branch → PR → CI (Tests + Lint + Typecheck + Build Preview)
2. Merge main → GitHub Action "Release" déclenché
3. EAS Build Production (iOS + Android) — ~15-20 min
4. TestFlight / Play Console Internal Testing → QA (30 min)
5. Promote → TestFlight Beta / Play Closed Testing (5% users)
6. Monitor (Sentry, RevenueCat, Analytics) — 24-48h
7. Rollout progressif (10% → 50% → 100%) via Play Console / App Store Connect
8. Tag Git `v{major}.{minor}.{patch}` + Release Notes (Auto-générées depuis Conventional Commits)
```

### Mises à Jour OTA (Expo Updates) — Sans Store Review
- **Corrections bugs mineurs** : `expo publish --branch production` → Disponible au prochain démarrage app
- **Nouvelles traductions/contenu** : OTA quotidien (Cron) → `translations.json` mis à jour sans rebuild
- **Feature Flags** : Edge Config → Changement instantané
- **Limite** : Pas de code natif modifié (Pas de nouveau plugin, pas de `app.config.ts` changé)

---

## 6. Budget & Ressources (Estimation)

| Poste | Phase 1 (Capacitor 3-6m) | Phase 2 (Expo 6-12m) | Phase 3 (Native 12m+) |
|-------|---------------------------|----------------------|------------------------|
| **Développement** | 1 Dev React Native (Freelance 30€/h × 40h/sem × 12 sem = ~15k€) | 2 Dev RN (1 Senior, 1 Mid) + 1 Dev Web (Partage) = ~80k€ | Équipe 4-5 (Mobile Lead, 2 Senior, 1 Mid, 1 QA) = ~250k€/an |
| **Design** | Adaptation existante (5k€) | Design System RN + Motion + Platform specific = 15k€ | Design Lead + 2 Designers = 80k€/an |
| **EAS Build/Submit** | Gratuit (Plan Free) / 29$/mois (Pro) | 29-99$/mois | 99-299$/mois |
| **RevenueCat** | Gratuit < 10k$ revenu / 1% après | 1% revenu (Stripe fees séparés) | Négocié volume |
| **Push (Expo/FCM/OneSignal)** | Gratuit (Expo) / 100$/mois (OneSignal) | 100-500$/mois | Négocié |
| **Stores** | 25$ (Google Play) + 99$/an (Apple) | Inclus | Inclus |
| **Tests Devices** | 2-3 devices physiques (500€) | Device farm (Bitrise/BrowserStack) 200$/mois | Device lab dédié |
| **Total Estimé** | **~20-30k€** | **~100-150k€** | **~350-500k€/an** |

---

## 7. Checklist Lancement Mobile (Phase 1 → Phase 2)

### Phase 1 : Capacitor (MVP Store)
- [ ] PWA Score Lighthouse ≥ 90 (PWA audit)
- [ ] Capacitor installé + Config iOS/Android
- [ ] Plugins : Push (Firebase), Biometric, Secure Storage, Haptics, Status Bar, Splash Screen
- [ ] Build iOS (Xcode) + Android (Gradle) → TestFlight / Play Internal
- [ ] Push Notifications fonctionnelles (Token → Backend → Device)
- [ ] Offline : Translations bundle + Cache pages visitées + Queue actions
- [ ] Deep Links (Universal Links / App Links) configurés + testés
- [ ] RevenueCat SDK + Produits configurés + Paywall testé
- [ ] Analytics (GA4 + Amplitude) événements unifiés web/mobile
- [ ] Sentry (Error + Performance) configuré
- [ ] Store Listing (Screenshots, Description, Mots-clés, Vidéo promo, Politique confidentialité)
- [ ] Soumission App Store + Play Store → Approbation
- [ ] Post-Launch : Monitoring crash-free rate > 99.5%, ANR < 0.5%

### Phase 2 : Expo (Native Proper)
- [ ] Monorepo Nx/Turbo configuré + Packages partagés (ui, core, config)
- [ ] Design System `packages/ui` compatible React Native (NativeWind / Styled Components RN)
- [ ] Navigation Expo Router (File-based, Type-safe, Deep linking natif)
- [ ] i18n ICU MessageFormat + 9 langues bundle + OTA updates
- [ ] Offline-First complet (MMKV, Sync Engine, Conflict Resolution, Background Fetch)
- [ ] Passkeys (WebAuthn) + Biometric (Expo LocalAuthentication)
- [ ] Push Rich (Images, Actions, Topics) + In-App Message Center
- [ ] RevenueCat Paywalls Remote Config + A/B Tests (RC Experiments)
- [ ] Performance : Hermes (JS Engine) + New Architecture (Fabric/TurboModules) + Bundle splitting
- [ ] Accessibility : VoiceOver / TalkBack complet + Test utilisateurs handicap
- [ ] CI/CD : EAS Build + Maestro/E2E (Detox) + Visual Regression (Chromatic) + Store Submit Auto
- [ ] Feature Flags (LaunchDarkly/Edge Config) evaluation natif
- [ ] Analytics unifié (Schema partagé, User ID cross-platform, Session stitching)

---

## 8. Synchronisation Web ↔ Mobile (Source de Vérité Unique)

| Donnée | Source | Sync Web → Mobile | Sync Mobile → Web |
|--------|--------|-------------------|-------------------|
| **Contenu (Traductions, Livres, Blog, Podcast)** | **Web (Git/CMS)** | OTA Updates (Expo) + Background Fetch (Quotidien) | ❌ (Read-only) |
| **Utilisateur (Profil, Préférences, Rôles)** | **Auth (Clerk/DB)** | Temps réel (Webhooks → Push silent → Refresh) | Temps réel (API → Webhooks) |
| **Progression Lecture** | **Mobile (Primary)** | ❌ | Immédiat (Optimistic) → Web UI temps réel |
| **Achats / Abonnements** | **RevenueCat (Source)** | Webhooks RC → Web DB + Mobile SDK | Webhooks RC → Mobile SDK + Web DB |
| **Push Tokens / Préférences Notifs** | **Mobile (Primary)** | ❌ | API → DB (User preferences) |
| **Analytics Events** | **Les Deux** | Batch HTTP → Data Lake | Batch HTTP → Data Lake |
| **Feature Flags** | **Edge Config (Source)** | Evaluation Edge (Middleware) | Evaluation Client (SDK) + Polling |

---

*Skill créé le 2025-11-20. Mobile App = extension naturelle — Partage 60-90% code, Offline-first, Push intelligent, RevenueCat, Deep linking, Analytics unifié, Monorepo Nx, Déploiement EAS, OTA updates.*