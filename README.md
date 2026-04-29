# Adizrak — Dormitory Gate Tracker

A React Native (Expo) mobile app that lets dormitory residents log their exits and returns by scanning a time-rotating QR code displayed at each gate.

---

## Features

- **QR-based gate check-in/out** — scan the gate's rotating QR code to log exits and returns
- **Live status** — home screen shows whether the resident is currently inside or outside the dorm
- **Trip history** — filterable log of all exits and returns grouped by date
- **Multi-language UI** — English, Italian, Farsi (fa), and Arabic (ar) with full RTL layout support
- **Offline-first** — all data stored locally via AsyncStorage; no backend required

---

## Screens

| Screen | Description |
|---|---|
| **Login** | First-time setup: enter full name and room number |
| **Home** | Live status, Exit / Return action buttons, history shortcut |
| **Scan** | Camera view to scan the gate QR code |
| **Confirm** | Review trip details (gate, time, resident) before confirming |
| **History** | Chronological log of past trips with All / Exits / Returns filter |

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli` or use `npx expo`)
- For physical device: **Expo Go** app ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- For simulators: Xcode (iOS) or Android Studio (Android)

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

After running `npm start`, an Expo QR code appears in the terminal:

- **Physical device** — scan the QR with Expo Go
- **iOS Simulator** — press `i`
- **Android Emulator** — press `a`
- **Web browser** — press `w`

Or use the platform-specific shortcuts directly:

```bash
npm run ios      # iOS Simulator (macOS only)
npm run android  # Android Emulator
npm run web      # Browser
```

---

## QR Code Validation

The app validates gate QR codes using a time-based rotating PIN algorithm:

- Each gate QR payload contains: `{ g: gateName, s: timeSlot, p: pin }`
- A new PIN is generated every **30 seconds** from `GATE_SECRET + slot + gateName`
- The app accepts codes within ±1 slot (~90 seconds) to tolerate clock drift

The gate QR display page must use the same `GATE_SECRET` (`ADIZRAK-2025`) and algorithm.

---

## Project Structure

```
adisurc/
├── App.tsx                    # Entry point, font loading, providers
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── AZBar.tsx          # Navigation header bar
│   │   ├── AZBtn.tsx          # Primary / gold / ghost button
│   │   ├── LangChip.tsx       # Language selector chip
│   │   ├── LangPickerModal.tsx# Language picker modal
│   │   └── StepBar.tsx        # 2-step progress indicator
│   ├── context/
│   │   └── AppContext.tsx     # Global state: user, trips, language
│   ├── i18n/
│   │   └── index.ts           # Translations: en, it, fa, ar
│   ├── navigation/
│   │   └── RootNavigator.tsx  # Stack navigator (Login → Home → Scan → Confirm → History)
│   ├── screens/               # Screen components
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── ScanScreen.tsx
│   │   ├── ConfirmScreen.tsx
│   │   └── HistoryScreen.tsx
│   ├── storage/
│   │   └── index.ts           # AsyncStorage helpers
│   ├── theme/
│   │   └── index.ts           # Color palette and font helpers
│   ├── types/
│   │   └── index.ts           # TypeScript types and interfaces
│   └── utils/
│       ├── format.ts          # Date/time formatters
│       └── qrValidation.ts    # Gate QR PIN validation logic
```

---

## Tech Stack

| Library | Version | Purpose |
|---|---|---|
| Expo | ~54.0.0 | Build toolchain & native APIs |
| React Native | 0.81.5 | UI framework |
| React Navigation | ^6 | Screen navigation |
| expo-camera | ~17.0.10 | QR code scanning |
| AsyncStorage | 2.2.0 | Local persistence |
| react-native-svg | 15.12.1 | Custom icons |
| TypeScript | ^5.3 | Type safety |

Fonts: **Plus Jakarta Sans** (LTR), **Vazirmatn** (Farsi), **Noto Naskh Arabic** (Arabic)

---

## Languages

| Code | Language | Direction |
|---|---|---|
| `en` | English | LTR |
| `it` | Italiano | LTR |
| `fa` | فارسی | RTL |
| `ar` | العربية | RTL |

The language can be changed at any time from the home screen or login screen via the language chip.
