# QA REPORT — VISUAL PATCH v3 (Krok 4)

Data: 2026-11-23 · gałąź `visual-patch-v3` · komit: „feat: VISUAL PATCH v3 Krok 4"
Preview: `npx astro preview --host 127.0.0.1 --port 4321` (build przez `npx astro build` — `npm run build`
celowo failuje na `TODO_DOMENA`, patrz „Placeholdery" niżej).

## Test układu (v2 §9 + v3: 2560, słowa, wordmark, skip link)
| Trasa | Wynik | Pary |
|---|---|---|
| `/` | **PASS** | 28 016 |
| `/faq/` | **PASS** | 6 000 |
| `/kontakt/` | **PASS** | 8 085 |

- Szerokości 360 / 390 / 768 / 1280 / 1440 / 1920 / 2560 × scroll 0/25/50/75/100%.
- 0 kolizji tekstów, 0 elementów poza `0..innerWidth`, 0 poziomego scrolla.
- Metodologia v3: recty przycięte do viewportu + widoczność mierzona w punkcie
  nakładki (przezroczysty tekst na wierzchu = kolizja; nieprzezroczysty panel —
  kurtyna §4 / sticky header — przykrywa, nie liczymy). Linie hero celowo
  oddalają się ±18% szerokości (§4) — zwolnione z testu „poza ekranem".
- Wordmark stopki mieści się w oknie (0 px ponad) — przycięcie tylko od dołu (§2.2).
- Skip link niewidoczny bez fokusu (§2.1).

## axe (serious/critical)
| Trasa | Wynik |
|---|---|
| `/`, `/faq/`, `/kontakt/` | **0** (kontrast ≥ 4,5:1 zaliczony) |

Uwaga: próg „zgaszonych" słów zdania przewodniego podniesiony 0,16 → 0,6
(blend nad `--paper` daje ~4,8:1); efekt zapalania ze scrollem bez zmian.

## Lighthouse (mobile, throttling symulowany)
- Performance **98** · Accessibility **100** · Best Practices **100** · SEO **100**
- FCP 1,2 s · LCP 2,3 s · TBT 80 ms · CLS 0,00 (pierwszy przebieg: 1,4 s / 50 ms —
  zmienność throttlingu między przebiegami; progi patcha: A11y 100 ✓, SEO 100 ✓,
  BP ≥ 95 ✓, Perf ≥ 95 ✓)
- Raport surowy: `docs/qa/visual-patch-v3/lighthouse-mobile.json`.

## Cookies i żądania zewnętrzne (audyt vs v1)
- Originy: tylko `http://127.0.0.1:4321` (fonty i media self-hosted) — **0 żądań zewnętrznych**.
- `cookies: 0`, `document.cookie: ""` — brak zmian względem v1.

## Placeholdery (`npm run placeholders`)
- `TODO_` występuje wyłącznie jako **`TODO_DOMENA`** (astro.config, site.ts → canonical,
  sitemapy) — świadoma blokada do czasu rejestracji domeny (decyzja właściciela
  2026-11-17: „Domeny narazie nie ma"). Po podmianie domeny `npm run build` przechodzi.

## Anty-slop (v2 §11)
- 0: gradientów, `backdrop-filter`, `blur()`, `text-transform`, `mix-blend`, marquee,
  animowanych SVG-ikon.
- 1 SVG w kodzie: linia wiersza oferty (`offer-row__line`, `<line>` rysowany na hover) —
  dozwolony wyjątek v2 §11.
- Cień: wyłącznie karta podglądu realizacji (§6 — „cień" wprost w specyfikacji).
- Ruch w whitelist §7: `transform`, `opacity`, `border-radius` (kurtyna — jeden element),
  `clip-path` (maski linii).

## Krok 3 — dowody interakcji (§6)
- Hover (fine pointer): karta podglądu `opacity: 1`, `translate(743px, 399px) rotate(-3deg)`,
  `src = case-desktop-thumb.webp` (27 KB) — podąża za kursorem (`gsap.quickTo`).
- Fokus klawiaturą: ta sama karta w stałym miejscu przy wierszu (`opacity: 1`).
- Dotyk/mobile: miniatura statyczna 300×190 pod nazwą (`display: block`), bez hovera.
- Zdanie przewodnie: słowa `0.6 → 1` scrubowane scrollem („zapalane").
- 0 błędów konsoli (desktop/mobile). Zrzut: `docs/qa/visual-patch-v3/k3-hover.png`.

## Odstępstwa od patcha (za decyzjami właściciela, 2026-11-23)
1. Ciemna sekcja „Robię strony dla…" (§5) — **usunięta** („Nie podoba mi się ona").
2. Strona **nie jest już single-page**: `/faq/` i `/kontakt/` to osobne podstrony;
   nawigacja `/​#realizacje · /​#oferta · /​#proces · /faq/` + „Napisz" → `/kontakt/`.
3. Pin/snap słów i przełączanie motywu nagłówka (§5) — odpadły razem z sekcją;
   kurtyną §4 jest teraz cały blok treści po hero (`.after-hero`).
