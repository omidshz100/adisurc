# Adisurc — Project Report
**Author:** Omid Shojaeian Zanjani  
**Date:** April 2026  
**Status:** MVP Complete — Pitched to Stakeholders

---

## 1. What Is This Project

Adisurc (branded as **Adizrak**) is a mobile app for managing dormitory gate access. It replaces the traditional paper logbook and shared pen system with a digital, contactless, QR-based solution.

Residents use their own smartphone to scan a time-rotating QR code displayed at the gate. Each scan logs their exit or return digitally, verifies their physical presence at the gate, and syncs the data to a central server when internet is available.

---

## 2. The Problem It Solves

The current system in the dormitory uses a paper logbook and a shared pen at the gate. This creates three real problems:

1. **Hygiene risk** — all residents share the same pen (especially relevant post-COVID)
2. **Slow access** — creates queues, requires staff presence, manual signing
3. **No management visibility** — no real-time data on who is inside or outside

---

## 3. The Solution — Three-Layer Architecture

The app is designed as a **hybrid system** with three layers of resilience:

| Layer | Condition | Behaviour |
|---|---|---|
| Online | Internet available | Data syncs to central server in real time |
| Offline | No internet | App works locally, syncs when connection returns |
| Print | No power or internet | System generates high-quality printed reports as paper backup |

This means the dormitory **never loses tracking capability** regardless of infrastructure conditions.

---

## 4. Tech Stack

| Technology | Purpose |
|---|---|
| React Native + Expo | Cross-platform mobile app (iOS & Android) |
| TypeScript | Type safety throughout the codebase |
| AsyncStorage | Local offline data persistence |
| React Navigation | Screen navigation stack |
| expo-camera | QR code scanning |
| react-native-svg | Custom icons and animations |
| Intl API | Locale-aware date, time, and number formatting |
| Plus Jakarta Sans | LTR font (EN, IT) |
| Vazirmatn | Farsi font |
| Noto Naskh Arabic | Arabic font |

---

## 5. App Screens

| Screen | File | Description |
|---|---|---|
| Login | `LoginScreen.tsx` | First-time setup — resident enters full name and room number |
| Home | `HomeScreen.tsx` | Live status, live clock, pulsing indicator, Exit/Return actions |
| Profile | `ProfileScreen.tsx` | Edit name and room number, logout |
| Scan | `ScanScreen.tsx` | Camera opens to scan the rotating gate QR code |
| Confirm | `ConfirmScreen.tsx` | Review gate, time, and name before confirming the trip |
| History | `HistoryScreen.tsx` | Full chronological log filtered by All / Exits / Returns |

---

## 6. Features Built During This Session

### Profile Screen (new)
- Created `ProfileScreen.tsx` from scratch
- Avatar display with initials
- Editable name and room number fields
- Save changes button — updates AsyncStorage and navigates back
- Logout button — clears all user data and returns to Login screen
- Avatar on HomeScreen made tappable to navigate to Profile
- Added to `RootNavigator.tsx` and `RootStackParamList`

### Live Date (fixed)
- Date was previously hardcoded in i18n strings (e.g. `'TUESDAY, APR 22'`)
- Replaced with `formatDate(lang)` function using `Intl.DateTimeFormat`
- Now reads from the device clock and formats correctly per language:
  - EN → `TUESDAY, APR 29`
  - IT → `MARTEDÌ, 29 APR`
  - FA → Persian Solar Hijri calendar (e.g. `سه‌شنبه، ۹ اردیبهشت`)
  - AR → Gregorian in Arabic script (e.g. `الثلاثاء، ٢٩ أبريل`)

### Live Clock with Seconds
- Added `formatClock(date, lang)` using `Intl.DateTimeFormat` with `hourCycle: 'h23'`
- Updates every second via `setInterval` with cleanup on unmount
- Displays below the date in the top strip
- Native digits for FA (۲۲:۳۳:۴۷) and AR (٢٢:٣٣:٤٧)

### Pulsing Status Indicator
- The plain dot on the status card was replaced with an animated `PulseDot` component
- A ring animates outward from the dot, scales 1× → 3.2×, fades from 0.55 opacity to 0
- Loops every 1.4 seconds using `Animated.loop` with `useNativeDriver: true`
- Gold pulse when resident is in dorm, red pulse when outside

### Logout Fix
- `AppContext.setUser(null)` previously did not remove data from AsyncStorage
- Fixed to call `removeUser()` when null is passed — now fully clears stored user

### i18n Additions
- Added `profileTitle`, `saveChanges`, `logout` to all 4 languages (EN, IT, FA, AR)
- Removed hardcoded `date` field from all translations

---

## 7. Project Structure

```
adisurc/
├── index.html                  ← Landing page (trilingual)
├── gate.html                   ← Gate QR display page
├── logo.png                    ← Official app logo
├── screenshots/                ← All 6 app screenshots
│   ├── login.png
│   ├── home.png
│   ├── profile.png
│   ├── scan.png
│   ├── confirm.png
│   └── history.png
├── App.tsx                     ← Entry point, font loading, providers
└── src/
    ├── components/
    │   ├── AZBar.tsx            ← Navigation header bar
    │   ├── AZBtn.tsx            ← Button component (primary/gold/ghost/danger)
    │   ├── LangChip.tsx         ← Language selector chip
    │   ├── LangPickerModal.tsx  ← Language picker modal
    │   └── StepBar.tsx          ← 2-step progress indicator
    ├── context/
    │   └── AppContext.tsx       ← Global state: user, trips, language
    ├── i18n/
    │   └── index.ts             ← Translations: EN, IT, FA, AR
    ├── navigation/
    │   └── RootNavigator.tsx    ← Stack navigator
    ├── screens/
    │   ├── LoginScreen.tsx
    │   ├── HomeScreen.tsx
    │   ├── ProfileScreen.tsx    ← New
    │   ├── ScanScreen.tsx
    │   ├── ConfirmScreen.tsx
    │   └── HistoryScreen.tsx
    ├── storage/
    │   └── index.ts             ← AsyncStorage helpers
    ├── theme/
    │   └── index.ts             ← Colors (#1B2B4B navy, #C9A84C gold, #F8F6F1 bg)
    ├── types/
    │   └── index.ts             ← TypeScript types and interfaces
    └── utils/
        ├── format.ts            ← formatDate, formatClock, formatTime, formatGroupLabel
        └── qrValidation.ts     ← Gate QR PIN validation logic
```

---

## 8. Landing Page (index.html)

A single self-contained HTML file built for stakeholder presentation. No framework, no build step.

**Sections:**
1. Nav — logo, Gate Display link, language switcher
2. Hero — logo, badge, headline, CTA button
3. Problem — 3 cards (hygiene, slow access, no visibility)
4. How it works — 3-step vertical flow
5. YouTube demo video embed
6. Three-layer resilience — dark navy section (online / offline / print)
7. Features — 6 cards with icons
8. Comparison table — paper logbook vs Adisurc
9. Screenshots — all 6 app screens in a grid
10. CTA — email contact button
11. Footer

**Languages:** Italian (default), English, Farsi (RTL)  
**Font:** Plus Jakarta Sans (LTR) + Vazirmatn (Farsi)  
**Animations:** Intersection Observer scroll fade-up on all sections

---

## 9. Gate Display (gate.html)

A separate HTML page designed to be displayed on a screen or tablet at the dormitory gate.

**Features:**
- Live rotating QR code — refreshes every 30 seconds
- Countdown ring showing seconds until next code
- Live clock (HH:MM:SS)
- Same QR validation algorithm as the mobile app (`GATE_SECRET + slot + gateName`)
- Preloads next QR image before swap — no flicker
- Graceful error state if internet is unavailable
- Real logo displayed in the header

**URL on GitHub Pages:** `https://omidshz100.github.io/adisurc/gate.html`

---

## 10. Language Support

| Code | Language | Direction | Calendar |
|---|---|---|---|
| `en` | English | LTR | Gregorian |
| `it` | Italiano | LTR | Gregorian |
| `fa` | فارسی | RTL | Solar Hijri (Persian) |
| `ar` | العربية | RTL | Gregorian (Arabic script) |

---

## 11. QR Validation Logic

The gate QR code uses a time-based rotating PIN:

```
slot = floor(Date.now() / 30000)
pin  = simpleHash(GATE_SECRET + ':' + slot + ':' + GATE_NAME)
payload = { g: GATE_NAME, s: slot, p: pin }
```

The app accepts codes within ±1 slot (~90 seconds window) to handle clock drift. The same secret (`ADIZRAK-2025`) must be used in both `gate.html` and `src/utils/qrValidation.ts`.

---

## 12. Repository & Deployment

| Item | URL |
|---|---|
| GitHub Repository | https://github.com/omidshz100/adisurc |
| Landing Page (GitHub Pages) | https://omidshz100.github.io/adisurc/ |
| Gate Display | https://omidshz100.github.io/adisurc/gate.html |
| YouTube Demo | https://www.youtube.com/watch?v=UYvjT55a1sI |
| Contact | omidfreelance100@gmail.com |

---

## 13. Commit History

| Commit | Description |
|---|---|
| `7db2815` | Add gate display page and nav link to landing page |
| `12041dc` | Add YouTube demo video to landing page |
| `b4749b2` | Rename landing.html to index.html for GitHub Pages |
| `ebef712` | Add logo to landing page nav and hero section |
| `d2133eb` | Add YouTube video embed section to landing page |
| `8aa99b4` | Add trilingual landing page (IT, EN, FA) |
| `a46a3b6` | Add app screenshots for all 6 screens |
| `6617d4a` | Add screenshots section and update README |
| `971f365` | Ignore .DS_Store and remove from tracking |
| `241d3f3` | Add profile screen, live clock/date, pulsing status indicator |
| `73da278` | README completed |
| `5f379e8` | Initial app development |

---

## 14. What Was Sent to Stakeholders

- **Email** sent to Adisurc management introducing the MVP
- **YouTube video** walkthrough of the full app flow
- **Landing page** with trilingual description (IT, EN, FA)
- **Live gate demo** accessible via the landing page nav

---

## 15. Next Steps (After Stakeholder Feedback)

- [ ] Server integration — connect app to REST API backend (backend almost ready)
- [ ] Auto-sync queue — retry failed API calls when internet is restored
- [ ] Admin dashboard — web panel for management to view all residents live
- [ ] Print report generation — PDF export of daily/weekly access logs
- [ ] Push notifications — alert when a resident has been outside too long
- [ ] APK build — distribute to Android residents via direct download link
- [ ] App Store / Google Play — if stakeholders approve full rollout
