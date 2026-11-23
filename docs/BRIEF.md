# BRIEF — Portfolio studia webowego (Faza 0)

**Data audytu:** 2026-11-06 · **Narzędzia:** Playwright 1.65.0 (headless Edge, `playwright-core` + `channel: 'msedge'`), Lighthouse 13.6.0 (`CHROME_PATH` = msedge.exe), curl
**Źródło prawdy:** `MASTERPROMPT_portfolio_Cl.md` v1.0

---

## 1. Zweryfikowane wersje narzędzi (na żywo, `npm view`)

| Narzędzie | Wersja | Uwagi |
|---|---|---|
| Node.js | 26.13.0 | npm 11.20.0 |
| astro | 7.4.7 | potwierdza założenie MASTERPROMPT (7.x stabilna) |
| @astrojs/sitemap | 3.7.4 | `filter()` działa jak w szkicu |
| gsap | 3.15.1 | ScrollTrigger, SplitText i Flip w pakiecie `gsap` — darmowe także komercyjnie |
| lenis | 1.3.27 | |
| three | 0.187.0 | |
| playwright | 1.65.0 | audyt na systemowym Edge (brak Chrome w systemie) |
| lighthouse | 13.6.0 | |

**Ustalenia z aktualnej dokumentacji (nie z pamięci):**
- **Lenis 1.3.27** (README): integracja z GSAP ScrollTrigger dokładnie jak w załączniku A MASTERPROMPT (`lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add((time) => lenis.raf(time * 1000))` + `gsap.ticker.lagSmoothing(0)`). `autoRaf` domyślnie `false` — potwierdzone. Nowość od MASTERPROMPT: Lenis **domyślnie respektuje `prefers-reduced-motion`** (wygładzanie wyłączone, `lerp` wymuszony na 1; dostępne `lenis.prefersReducedMotion` i opcja `respectReducedMotion`). Opcja `anchors` obsługuje kotwice (z offsetem).
- **SplitText** w pakiecie `gsap` (3.15.x): API `SplitText.create(el, { type, mask: 'lines', autoSplit: true, onSplit })`, domyślna obsługa `aria` dla czytników; ostrzeżenie producenta: przy dzieleniu `<h1>` wymagane poprawne title/description i `aria: 'auto'`.
- **@astrojs/sitemap**: konfiguracja `filter(page)` zgodna ze szkicem.

## 2. Dostępność skilli (sekcja 6 MASTERPROMPT)

W Hermesie niedostępne (stosuję zasady ręcznie, bez blokowania prac): Frontend Design, UI UX Pro Max, Visual Storytelling, Cinematic Web Animations, Motion Principles, Emil Design Engineering, skille GSAP/Lenis/Three.js, Text Reveal, Fluid Typography, Responsive Design, Accessibility, Performance Optimization, Playwright, Screenshot QA, Impeccable, Awwwards Design, 3D Product Showcase, SVG Animation, Particle Effects, Parallax, WebGL Distortion, Custom Cursor, Extract Design System, Web Design Inspiration, GOATED UI.
Dostępne i wykorzystywane: `frontend-site-build` (konwencje budowy produkcyjnej — stack różny: Astro zamiast React/Tailwind), `spike` (eksperymenty WebGL), `dogfood` (QA eksploracyjne), `requesting-code-review` (przegląd przed finalizacją), `systematic-debugging`, `test-driven-development`, `grounded-citations` (zasada dowodzenia twierdzeń).

## 3. Zmienne (sekcja 3) — stan po G0 (2026-11-06, odpowiedzi właściciela)

| Zmienna | Wartość / decyzja |
|---|---|
| `{{MARKA}}` | **roboczo „Kreska Studio”** (brak pomysłu właściciela — zaproponowałem; do potwierdzenia w G1; alternatywy: Szkic Studio, Pawłowski Studio). Wordmark zaprojektuję (logo brak) |
| `{{OSOBA}}` | **Filip Pawłowski** |
| `{{FORMA_PRAWNA}}`, `{{NIP}}`, `{{REGON}}`, `{{ADRES_FIRMY}}` | **brak — właściciel nie prowadzi jeszcze działalności (plan: umowa o dzieło); danych firmowych NIE publikować** — stopka i polityki bez NIP/adresu; uwaga dla prawnika w `LEGAL_DRAFT_NOTES.md` |
| `{{EMAIL}}` | **filip.pawlowski71@gmail.com** |
| `{{TELEFON}}` | **brak publicznego telefonu (decyzja właściciela)** → CTA „Zadzwoń” usunięte; główną akcją jest „Napisz” |
| `{{LOKALIZACJA_DZIALANIA}}` | **cała Polska**, ze wzmocnieniem lokalnym **Wrocław** (miejsce zamieszkania — łatwiej o spotkania/umowy) |
| `{{ZAKRES_USLUG}}` | strony internetowe na zamówienie, charakter indywidualny; **bez odświeżania istniejących stron**; opieka po wdrożeniu — do potwierdzenia (G1) |
| `{{PRZEWAGI}}` | nie wskazane — proponuję 4 w copy decku do potwierdzenia w G1 (szybkość, mobile-first, widoczność w Google, własność strony) |
| `{{CASE_STUDY_ZGODA}}` | **TAK — prezentować z linkiem do strony na żywo** |
| `{{DOMENA}}`, `{{CENNIK_MODEL}}`, `{{CZAS_REALIZACJI}}`, `{{SOCIAL}}`, `{{GBP}}`, `{{ANALITYKA}}`, `{{FORMA_ZWRACANIA}}` | brak / domyślne: bez analityki, „Ty”, wycena indywidualna; `TODO_DOMENA` w kodzie |

## 4. Decyzje zamknięte

Bez zmian względem sekcji 4 MASTERPROMPT (Astro static TS strict, czysty CSS, GSAP + Lenis, Three.js lazy, one-page + strony prawne, ciemny motyw, Cloudflare Pages, self-hosted fonty, brak ClientRouter). Do weryfikacji w Fazie 2: czy Astro 7.4.x ma wbudowaną obsługę fontów (jeśli nie — `@fontsource-variable/*`).

## 5. Audyt case study: koparkapawlowski.pl (fakty zmierzone)

**Surowe dane:** `docs/audit/case-study-audit.json` (Playwright, desktop 1440×900 + mobile 390×844), `docs/audit/lh-mobile.json`, `docs/audit/lh-desktop.json`.
**Zrzuty:** `public/media/case-{desktop,mobile}-{hero,full}.png`.
**Skrypt:** `scripts/qa/case-study-audit.mjs` (powtarzalny audyt).

### 5.1. Struktura serwisu (11 unikalnych podstron, multi-page)

| Podstrona | Tytuł `<title>` |
|---|---|
| `/` | Usługi minikoparką Wrocław — wykopy, fundamenty, niwelacja \| Koparki Pawłowski |
| `/uslugi/` | Usługi minikoparką Wrocław — wykopy, fundamenty, korytowanie \| Koparki Pawłowski |
| `/uslugi/wykopy-pod-fundamenty/` | Kopanie fundamentów minikoparką Wrocław — wykopy pod fundamenty \| Koparki Pawłowski |
| `/uslugi/wykopy-pod-instalacje/` | Wykopy pod kanalizacje i instalacje Wrocław — wykopy liniowe \| Koparki Pawłowski |
| `/uslugi/korytowanie-pod-kostke/` | Korytowanie pod kostkę brukową Wrocław — przygotowanie podłoża \| Koparki Pawłowski |
| `/uslugi/niwelacja-terenu/` | Równanie terenu i niwelacja działki Wrocław \| Koparki Pawłowski |
| `/realizacje/` | Realizacje — minikoparka przy pracy \| Koparki Pawłowski Wrocław |
| `/obszar-dzialania/` | Obszar działania — Wrocław i okolice \| Koparki Pawłowski |
| `/o-firmie/` | O firmie — Koparki Pawłowski \| Usługi minikoparką Wrocław |
| `/kontakt/` | Kontakt \| Koparki Pawłowski — usługi minikoparką Wrocław |
| `/polityka-prywatnosci/` | Polityka prywatności \| Koparki Pawłowski |

### 5.2. Meta i SEO strony głównej

- `lang="pl"`; title **78 znaków** (powyżej zalecanych 60 — obserwacja dla właściciela); description **195 znaków** (powyżej 155).
- canonical → `https://www.koparkapawlowski.pl/` (wersja `www`), `og:url` zgodny; `og:image` = `/images/og-image.jpg`; `og:locale=pl_PL`; `twitter:card=summary_large_image`; `theme-color: #211c17` (ciepły ciemny brąz).
- Brak meta `robots`; jeden `<h1>` („Wykopy i prace ziemne minikoparką we Wrocławiu”), poprawna hierarchia H2/H3, landmarki `header/nav/main/footer` + skip link (`#tresc`).
- **JSON-LD (2 bloki):** `HomeAndConstructionBusiness` (NAP: Wrocław, tel, e-mail, `areaServed: Wrocław`, godziny otwarcia Pn–Pt 07:30–20:30, Sob 08:00–18:30) + `FAQPage` (6 pytań i odpowiedzi).
- Obrazy: 4× WebP (`lazy`, opisowe polskie alt-y). Linki: 30 (same wewnętrzne + `tel:` ×7 + `mailto:` ×2), zero linków zewnętrznych.

### 5.3. Zasoby i technologia

- **8 żądań, ~74 KB transferu**: 2× CSS (`/_astro/index.*.hash.css` — strona zbudowana w **Astro**), 1× mały JS nagłówka (`Header.astro_...js`, 520 B), 2× fonty **Archivo variable** self-hosted (latin ~35 KB + latin-ext ~33 KB), favicon.svg, beacon Cloudflare Insights.
- Hosting: **Cloudflare** (CF-Cache-Status, NEL/Report-To).
- **Cookies: brak** (context.cookies() puste w obu przebiegach). Zapytania zewnętrzne: tylko `static.cloudflareinsights.com`.
- **Nagłówki bezpieczeństwa:** HSTS, CSP (`default-src 'self'`, `frame-ancestors 'none'` itd.), `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options: DENY`.
- **Uwaga:** własna CSP strony **blokuje beacon Cloudflare Insights** → 1 błąd w konsoli („violates … script-src 'self'”), pomiar ruchu de facto nie działa.

### 5.4. Lighthouse (2026-11-06, throttling domyślny)

| Kategoria | Mobile | Desktop |
|---|---|---|
| Performance | **100** | **100** |
| Accessibility | **100** | **100** |
| Best Practices | 92 | 92 |
| SEO | **100** | **100** |
| LCP / CLS / TBT | 1,5 s / 0,002 / 0 ms | 0,4 s / 0,001 / 0 ms |

Best Practices 92 = błędy w konsoli (zablokowany beacon Cloudflare) + wpisy w panelu Issues. Strona bez JavaScriptowego ciężaru, bez frameworka klienckiego.

### 5.5. Spójność adresów (obserwacje dla właściciela)

- `https://koparkapawlowski.pl/` → 200, `https://www.koparkapawlowski.pl/` → 200 — **brak przekierowania 301 między apex a `www`**; canonical wskazuje `www`, więc duplikacja jest zgłoszona Google, ale bez 301 serwer nadaje obu wersjom rangę.
- `http://koparkapawlowski.pl/` → przekierowanie do `https://koparkapawlowski.pl/` (HSTS +301) — poprawnie.
- Linki wewnętrzne i zasoby używają **apex** (`koparkapawlowski.pl`), podczas gdy canonical/`og:url`/JSON-LD wskazują **www** — niespójność do wyprostowania (rekomendacja: 301 apex→www lub odwrotnie + ujednolicenie).
- Tytuł/description przekraczają zalecane limity długości.

## 6. Profil wizualny case study (opis zrzutów `public/media/`)

- **Kolory:** tło kremowe `#f4efe6` (sekcje jaśniejsze `#ebe3d4`), sekcje ciemne `#211c17`, akcent terakota `#ab4d26` (logo: `#8f3f1f`), tekst `#211c17` / ciepły szary `#5d554a`, linie `#a89b86`/`#d8cfc0`.
- **Typografia:** bezszeryfowy grotesk (nagłówki bold, ciasny interlinia; font: Archivo variable wg audytu zasobów) + monospace WERSALIKI z rozstrzeleniem w mikro-etykietach („— 01 — USŁUGI”, „SPRZĘT”, tagline).
- **Układ (desktop):** header z CTA telefonu → hero (H1 + schemat technicznego przekroju wykopu w ramce + pasek 3 kafli) → „01 Usługi” (lista 01–04 z separatorami) → ciemny blok „Od telefonu do gotowej pracy” (4 kroki) → „02 Sprzęt” (tekst + duże zdjęcie) → „03 Realizacje” (galeria 3 kart) → „04 Obszar działania” + tabela godzin → „05 FAQ” (akordeon, 6×) → ciemny blok CTA → stopka (3 kolumny w ramkach, © 2026).
- **Komponenty:** zero zaokrągleń, płasko (bez cieni), struktura z linii 1 px i ramek; przycisk primary = pełny terakotowy prostokąt z monospace WERSALIKAMI, secondary = kontur; motyw „blueprint/rysunku technicznego” (wymiary, numeracja sekcji, nawiasy narożnikowe).
- **Charakter:** rzemieślniczo-techniczny, „blueprint/industrial minimalizm” — ciepła paleta papierowa + terakota, konkret, telefon jako główne CTA.
- **Usterki na zrzutach = artefakty przechwytywania, nie strony:** puste kadry po lazy-loadowanych zdjęciach w zrzutach pełnostronicowych (nie zdążyły się załadować przy `fullPage`), powtórzenia sticky headera i ucięcie `case-mobile-full.png` — typowe artefakty pełnostronicowego zrzutu. Brak realnych nachodzeń/ucięć layoutu.
- **Wniosek dla Aktu IV:** strona właścicielka sama używa estetyki rysunku technicznego — nasz motyw „blueprint” w portfolio jest z nią spójny i można to uczciwie wykorzystać w narracji case study („spójna identyfikacja”), bez kopiowania jej układu.

## 7. Wnioski dla projektu portfolio

1. Właściciel buduje strony w Astro, na Cloudflare, z dbałością o nagłówki i RODO (cookies zero, polityka prywatności jest). To spójne z deklarowanymi przewagami — case study można oprzeć na faktach z tego audytu.
2. Materiał do Aktu IV: 11 podstron, SEO lokalne (4 podstrony usług), CTA telefoniczne ×7, wyniki Lighthouse 100/100/92/100, zero cookies, ~74 KB transferu, CSP.
3. Słabe punkty do wytknięcia (uczciwie, jako rekomendacje): brak 301 www↔apex, title/description za długie, martwy beacon analityki.
