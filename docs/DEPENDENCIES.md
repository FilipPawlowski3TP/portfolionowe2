# DEPENDENCIES — uzasadnienia i rozmiary (MASTERPROMPT 7.1, R-06)

Stan: 2026-11-06 (Faza 2). Rozmiary: gzip z plików dystrybucyjnych pakietów; fonty: woff2 (już skompresowane).

## Produkcyjne

| Pakiet | Wersja | Po co | Rozmiar (gzip) |
|---|---|---|---|
| `astro` | 7.4.7 | framework static build (SSG), obrazy, fonty, sitemap | narzędzie build-time (0 B runtime) |
| `@astrojs/sitemap` | 3.7.4 | generowanie sitemapy | build-time |
| `gsap` | 3.15.1 | animacje DOM: core + ScrollTrigger + SplitText (w pakiecie, darmowe komercyjnie) | gsap.min 28,4 KB + ScrollTrigger.min 18 KB + SplitText.min 3,7 KB ≈ **50 KB** (ładowane po pierwszym renderze) |
| `lenis` | 1.3.27 | płynny scroll zsynchronizowany z GSAP ScrollTrigger | lenis.min **5,4 KB** |
| `three` | 0.187.0 | scena WebGL (siatka blueprint, cząsteczki, mockupy) — **dynamiczny import** po pierwszym renderze; tree-shaken | cel ≤ 200 KB gzip dla używanego podzbioru — **zmierzę w Fazie 5** (build analyze) |

## Fonty (self-hosted, Astro Fonts API — `fontProviders.local()`)

| Plik | Krój | Zakres | Rozmiar |
|---|---|---|---|
| `src/assets/fonts/pawlowski-display.woff2` | Bricolage Grotesque (display, wght 500–800) | latin + latin-ext (PL), interpunkcja, strzałki | **39 KB** |
| `src/assets/fonts/pawlowski-text.woff2` | Instrument Sans (text, wght 400–700) | jw. | **30,7 KB** |
| | | **Razem** | **69,7 KB** (cel MASTERPROMPT: ≤60 KB — odchylenie +9,7 KB; alternatywa: węższe zakresy wght kosztem swobody typograficznej) |

**Proces subsetu (powtarzalny):** źródła — pełne TTF variable z repo `google/fonts` (`ofl/bricolagegrotesque`, `ofl/instrumentsans`); krok 1: `python -m fontTools.varLib.instancer` (pin osi: Bricolage `opsz=32 wdth=100`, zakres `wght=500:800`; Instrument `wdth=100`, `wght=400:700`); krok 2: `python -m fontTools.subset` (`--unicodes=U+0000-00FF,U+0100-02BA,U+2000-206F,U+20AC,U+2122,U+2190-2199,U+2212,U+FEFF,U+FFFD --layout-features=kern,liga,calt,ccmp,locl,mark,mkmk --no-hinting --flavor=woff2`). Wymaga `fonttools` + `brotli` (dev-time, Python).

## Deweloperskie (nie trafiają do produkcji)

| Pakiet | Wersja | Po co |
|---|---|---|
| `typescript` | ^5.9 (TS 7.x świadomi celowo pominięty — brak pewności kompatybilności z @astrojs/check) | typy, `strict` |
| `@astrojs/check` | 0.9.12 | walidacja .astro/TS |
| `@types/three` | 0.187.0 | typy Three.js |
| `playwright` | 1.65.0 | skrypty QA (zrzuty, a11y, audyt storage) — na systemowym Edge (`channel: 'msedge'`), bez pobierania Chromium (`PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`) |
| `@axe-core/playwright` | 4.14.0 | testy dostępności (WCAG) |
| `lighthouse` | 13.6.0 | pomiary wydajności/SEO (Edge jako Chrome via `CHROME_PATH`) |
| `prettier` + `prettier-plugin-astro` | 3.9.x / 1.1.2 | formatowanie |

## Świadomie niezainstalowane (zakazane, MASTERPROMPT 7.1)

jQuery, Tailwind, React/Vue/Svelte, Locomotive Scroll, ScrollMagic, AOS, animate.css, Barba.js, Lottie/Rive, PixiJS/Babylon/Spline, Anime.js, CDN-y w runtime, trackery. Zero zapytań do domen zewnętrznych w runtime (fonty self-hosted przez Astro Fonts API — pobierane w buildzie, serwowane z własnej domeny).
