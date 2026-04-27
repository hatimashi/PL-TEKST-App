# PL-TEKST-App

> Mobilny kalkulator zapisu słownego kwot — aplikacja React Native / Expo dla Android i iOS.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](CHANGELOG.md)
[![Expo](https://img.shields.io/badge/Expo-SDK-blue.svg)](https://expo.dev)
[![API](https://img.shields.io/badge/API-Railway-blueviolet.svg)](https://pl-tekst-production.up.railway.app/docs)

---

## Opis

**PL-TEKST-App** to mobilna aplikacja będąca rozszerzeniem projektu [PL-TEKST](https://github.com/hatimashi/PL-TEKST). Zamienia kwoty pieniężne na poprawny zapis słowny w języku polskim — z obsługą walut PLN, EUR, USD i GBP.

Aplikacja komunikuje się z publicznym API dostępnym pod adresem:
**https://pl-tekst-production.up.railway.app**

---

## Funkcje

- Zamiana kwoty na zapis słowny w czasie rzeczywistym
- Dwa formaty zapisu:
  - **Standardowy** — np. Tysiąc złotych (67/100 groszy)
  - **Faktura / umowa** — np. Tysiąc złotych i sześćdziesiąt siedem groszy
- Obsługa walut PLN, EUR, USD, GBP
- Kopiowanie wyniku do schowka
- Obsługa błędów i walidacja danych

---

## Instalacja i uruchomienie

### Wymagania
- Node.js 18+
- Expo Go na telefonie ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Kroki

```bash
git clone https://github.com/hatimashi/PL-TEKST-App.git
cd PL-TEKST-App
npm install
npx expo install expo-clipboard
npx expo start
```

Zeskanuj QR kod aplikacją **Expo Go** na telefonie.

---

## Powiązane projekty

| Projekt | Opis | Link |
|---|---|---|
| PL-TEKST | Funkcje VBA dla Excel + REST API | [github.com/hatimashi/PL-TEKST](https://github.com/hatimashi/PL-TEKST) |
| Kalkulator online | Wersja webowa na primestep.pl | [primestep.pl/excel-polish-text-from-value](https://primestep.pl/excel-polish-text-from-value/) |
| API | Publiczne REST API | [pl-tekst-production.up.railway.app](https://pl-tekst-production.up.railway.app) |

---

## Licencja

[MIT](LICENSE) — używaj swobodnie, także komercyjnie.

---

## English summary

**PL-TEKST-App** is a mobile application built with React Native / Expo that converts monetary amounts to Polish words. Supports PLN, EUR, USD and GBP currencies. Uses the public PL-TEKST REST API as backend.
