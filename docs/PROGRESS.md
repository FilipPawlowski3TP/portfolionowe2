# PROGRESS — Portfolio studia webowego

Źródło prawdy: `MASTERPROMPT_portfolio_Cl.md` v1.0. Po przerwie zacznij od tego pliku.

## Faza 0 — Rozpoznanie i brief — W TOKU (bramka G0)

**Zrobione (2026-11-06):**
- Zweryfikowane wersje na żywo: Node 26.13.0, astro 7.4.7, @astrojs/sitemap 3.7.4, gsap 3.15.1, lenis 1.3.27, three 0.187.0, playwright 1.65.0, lighthouse 13.6.0.
- Przeczytana aktualna dokumentacja: README Lenis (1.3.27 — integracja GSAP zgodna z zał. A; nowość: domyślne respektowanie `prefers-reduced-motion`), SplitText (w pakiecie `gsap`, `SplitText.create`, `autoSplit`, `aria`), @astrojs/sitemap.
- Audyt koparkapawlowski.pl (Playwright + Edge headless + Lighthouse 13.6): dane w `docs/audit/`, zrzuty w `public/media/`, skrypt w `scripts/qa/case-study-audit.mjs`.
- Wyniki Lighthouse case study: mobile 100/100/92/100, desktop 100/100/92/100 (BP: CSP blokuje beacon Cloudflare Insights).
- `docs/BRIEF.md`, `docs/TODO_USER.md` zapisane.

**Dowody (komendy):**
- `npm view astro version` → 7.4.7 (gsap 3.15.1, lenis 1.3.27, three 0.187.0)
- `node scripts/qa/case-study-audit.mjs` (katalog roboczy z playwright-core) → `docs/audit/case-study-audit.json`
- `npx lighthouse@13.6.0 https://koparkapawlowski.pl/ --output=json --preset=desktop/mobile` → `docs/audit/lh-{desktop,mobile}.json`

**Uwagi techniczne środowiska:**
- Brak Chrome w systemie — audyty na Edge (`CHROME_PATH='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'`, Playwright `channel: 'msedge'`).
- `terminal` ($TMPDIR) i workspace wskazują inne katalogi scratch — skrypty Node umieszczaj obok `node_modules` (patrz `C:/Users/karolina/AppData/Local/Temp/audit`).
- Wyjście narzędzi maskuje numery telefonów w formacie międzynarodowym (PII) — nie jest to usterka stron; zapisuj telefony w formacie „792 611 777”.

**Dalej:**
- [BRAMKA G0] — ZAMKNIĘTA 2026-11-06: właściciel odpowiedział (Filip Pawłowski, e-mail, bez telefonu i danych firmowych, cała Polska + Wrocław, case study tak). Ustalenia: `docs/BRIEF.md` sekcja 3.
- Faza 1 w toku: `docs/DESIGN_PLAN.md` (tokeny + kontrasty WCAG policzone, typografia Bricolage Grotesque + Instrument Sans, 3 warianty hero → rekomendacja C „tytułówka rysunku”, wireframe'y desktop/mobile, storyboard sceny, motion spec, autokrytyka 8.5), copy deck w `src/data/site.ts` (title 43/60, desc 146/155, H1 8 słów — policzone).
- Test renderu polskich znaków: ZALICZONY (2026-11-06, weryfikacja wizualna zrzutu `docs/audit/font-test.png` — brak tofu/podmian glifów w Bricolage i Instrument Sans).
- [BRAMKA G1] — ZAMKNIĘTA 2026-11-06: marka = **Pawłowski Studio**, hero wariant C, 4 przewagi potwierdzone, 4. usługa „Opieka po wdrożeniu” dodana, treści zaakceptowane.

## Faza 2 — Szkielet projektu — GOTOWE (2026-11-06)

**Zrobione:** skafold Astro 7.4.7 (minimal, TS strict), `astro.config.mjs` (static, `trailingSlash: always`, `compressHTML`, sitemap z `filter`), tokeny CSS (`src/styles/tokens.css`) + `base.css`, `Base.astro` + `SeoHead.astro` (title/desc/canonical/OG/lang=pl), fonty self-hosted przez **wbudowaną obsługę fontów Astro 7** (`fontProviders.local()` + `<Font />`), subsety `src/assets/fonts/*.woff2` (39+30,7 KB), `scripts/check-placeholders.mjs`, `.prettierrc`, `docs/DEPENDENCIES.md`, `git init` + 2 commity.
**Dowody:** `astro build` → 1 strona + sitemap + kopiowanie 2 fontów, OK; `astro check` → 0 błędów, 0 ostrzeżeń (1 hint); `node scripts/check-placeholders.mjs` → FAILED na `todo_domena` (negatywny test bramy — działa zgodnie z MASTERPROMPT sekcja 3).
**Decyzje:** fonty subsetowane lokalnie (fonttools: instancer pin osi + subset latin+latin-ext) zamiast fontsource w buildzie — pełna kontrola budżetu; TS celowo 5.x (7.x niepewny z @astrojs/check).
**Blokada:** `npm run build` zatrzymuje się na check-placeholders do czasu podania `{{DOMENA}}` (pytanie do właściciela). `astro build` działa.
**Dalej:** Faza 3 — warstwa statyczna (wszystkie sekcje HTML/CSS, bez ruchu).

## Faza 3 — Warstwa statyczna — GOTOWE (2026-11-06)

**Zrobione:** wszystkie sekcje (Header/Hero/Oferta/Proces/CaseStudy/Standard/FAQ/Kontakt/Footer), strony prawne (projekty do weryfikacji prawnika) + 404, `T.astro` + `typo()`, wordmark, hero wariant C, CSS wg tokenów (`layout.css`, `components.css`, `legal.css`), responsywność mobile-first.
**Dowody (`docs/qa/phase3/`):** 7 viewportów (360–1920): brak poziomego scrolla, 1×h1, 0 błędów konsoli, 0 uszkodzonych obrazów; axe (WCAG 2.x AA): **0 naruszeń serious/critical**; Lighthouse (localhost): **SEO 100, dostępność 100, best-practices 100**; przegląd wizualny zrzutów: układ hierarchiczny, case study kompletny (zrzuty klienta w ramkach), stopka OK, mobile OK.
**Poprawki po przeglądzie:** rozmiar/waga drobnych etykiet (0,72→0,8 rem, 500), placeholder selecta, margines nagłówków sekcji, skrypt QA wymusza leniwe obrazy przed zrzutem.
**Dalej:** Faza 4 — ruch (Lenis + GSAP: wejście hero, reveals, menu mobilne, reduced-motion).

## Faza 4 — Warstwa ruchu — GOTOWE (2026-11-06)

**Zrobione:** `smooth-scroll.ts` (Lenis ↔ ScrollTrigger, jedna pętla gsap.ticker, zał. A), `reveals.ts` (wejście hero ≤1,2 s, masked line reveals SplitText `aria:'auto'`, fades dla intro, pin procesu ≤2 ekrany desktop), `menu.ts` (details + Esc + `inert` + `lenis.stop()`), `boot.ts` (reduced-motion, watchdog 3 s → `reveal-all`, `ScrollTrigger.refresh` po fontach/obrazach), `motion.css` (stany początkowe tylko `.js` + no-preference).
**Dowody (`docs/qa/phase4/`, skrypty phase4-qa):** boot gotowy, hero widoczne po wejściu (opacity 1×4), kotwica „Oferta” → hash + scrollY 956 + fokus na `#offer-h2`, 0 błędów konsoli; reduced-motion: treść widoczna, 0 pinów; JS wyłączony: treść widoczna; menu mobilne: inert na main + Esc zamyka; CLS **0,001** (Lighthouse mobile, perf 99, LCP 1,99 s, TBT 1 ms); axe serious/critical **0** na 7 viewportach i w środku pinu.
**Poprawka:** pin procesu pierwotnie ściemniał tekst kroków (kontrast 2,43:1, axe serious) — efekt zmieniony na ruch + kolor numerów (dostępność > efekty, MASTERPROMPT sekcja 0.2).
**Dalej:** Faza 5 — WebGL (tier.ts, scena blueprint, cząsteczki, mockupy, crossfade z fallbacku).

## Faza 5 — Warstwa WebGL — GOTOWE (2026-11-06), [BRAMKA G2] do akceptacji

**Zrobione:** `webgl/` (tier.ts z wymuszaniem `?tier=` tylko w buildzie QA, acts.ts, scene.ts — jeden fixed canvas + scena sterowana scrollem, particles.ts (instancjonowane, ≤3500), devices.ts (laptop+phone `RoundedBoxGeometry` z teksturami = własne zrzuty case study, SRGB, anisotropy ≤4), adaptive.ts (90 klatek → p95 > 22 ms → DPR → cząsteczki → tier, bez awansów), shadery GLSL ES 3.00 (`?raw`: siatka blueprint z `uGrade` noc→świt, cząsteczki), render na żądanie 60 FPS → ambient 30 FPS, pauza na `document.hidden`, `webglcontextlost/restored` → Tier 0, ResizeObserver z debouncingiem (mobile ignoruje Δh < 120 px). Scena ładowana po `load` + `requestIdleCallback` (dynamiczny import), crossfade 400 ms z CSS fallbacku. Tła sekcji półprzezroczyste (scena widoczna w całej podróży).
**Dowody (`docs/qa/phase5/`):** tiery 0/1/2 (wymuszone) — ALL PASS; budżety: draw calls **7** (≤40), trójkąty **2 922** (≤150k), cząsteczki 3500/1500/600 per tier, DPR 1/1/1 (≤1,75/1,25/1); axe serious/critical **0** przy 5 pozycjach scrolla na żywej scenie; Lighthouse mobile (scena): **perf 100, LCP 1,24 s, CLS 0,006, TBT 62 ms**; desktop: **perf 100, LCP 0,34 s**; Tier 0 mobile: **perf 100**; budżety gzip: sceny three+kod **130,7 KB** (cel ≤200), boot+motion **52,9 KB**, fonty 72 KB.
**Poprawka jakościowa:** LCP element (tekst hero) czekał na JS (3,18 s) — wejście hero przeniesione na czysty CSS transform-only („LCP nie czeka na JS”), LCP 1,24 s.
**Uwaga:** FPS/frame-times w headless Edge = SwiftShader (brak GPU) — pomiary klatek wymagają testu na realnych urządzeniach (właściciel).
**Dalej:** [BRAMKA G2] — zrzuty kluczowych momentów do akceptacji; po niej Faza 6 (formularz + nagłówki + deploy).

## Rewizja G2 (2026-11-06) — „Światło i głębia" wg feedbacku właściciela

Feedback: siatka blueprint zbyt „geekowa" dla Kowalskiego; podobają się mockupy Koparek i pin Procesu; cała strona ma tak płynnie działać. Decyzje właściciela: **A — Światło i głębia**, więcej pinów + scrub wszędzie.
**Zmiany:** siatka usunięta → shader atmosferyczny (noc→świt, ciepła poświata rosnąca ze scrollem, dither anty-banding) + 3 miękkie warstwy głębi (paralaks) + bokeh zamiast technicznego pyłu; choreografia scrub na całej stronie (wyjście hero z paralaksą, fala kart oferty, standard/FAQ/kontakt); **pin Realizacji** (1 ekran, etykiety Problem→Efekt rozgrzewają się do akcentu, mockupy dryfują); scrollspy w nawigacji (aktywna sekcja na dawn-400); fallback CSS = ten sam klimat.
**Dowody:** phase5 ALL PASS (tiery, budżety: 5–7 draw calls, 2,9k trójkątów), axe 0 przy 5 pozycjach, mobile perf **98** (LCP 1,24 s, TBT 142 ms), desktop **100** (LCP 0,20 s), phase4 regresja ALL PASS.
**Dalej:** [BRAMKA G2 — ponowna akceptacja] po pokazaniu nowych zrzutów.

## Rewizja G2 v3 (2026-11-06) — „płynna jazda" + nowy hero (B: Rzeźba świetlna)

Feedback: przerwy między pinami niszczą efekt (martwe odcinki scrolla), oferta wisi za wysoko, hero „źle zrobiony/środek ekranu", kropki out, 3D zostaje; hero B/C — agent wybrał B (z nutką C).
**Zmiany:** (1) przejścia na pełnym dystansie — każda sekcja wjeżdża scrubem od `top bottom` do `top 15%`, sekcje warstwowo nakładane (z-index), piórkowane maski krawędzi (bez twardych linii); hero pin ma pełne wyjście treści (`-85vh`) — zero martwych pikseli scrolla; (2) akty wyśrodkowane w viewport (min-height 100svh, flex) — „za wysoko" naprawione; (3) hero: kompozycja asymetryczna, bez ramki, ciaśniejszy rytm (CTA nad zgięciem), rzeźba świetlna 3D (3 pierścienie + rdzeń, fresnel additive, noc→świt, okno 0,09–0,16); (4) kolizja pinów = trigger order + refreshPriority + anticipatePin (weryfikacja: 72 pozycje scrolla, 0 kolizji).
**Dowody:** phase4/phase5 ALL PASS, axe 0 mid-pin, mobile **perf 97 / TBT 191 ms** (budżet ≤200), LCP 1,24 s, CLS 0,010; doc 12 ekranów desktop (dystans pinów = „jazda" wg życzenia właściciela).
**Dalej:** akceptacja przejazdu → Faza 6 (formularz + bezpieczeństwo).

## Rewizja G2 v4 (2026-11-06) — naprawa bugów + „haki" w całym akcie

Feedback: przerwy dalej, Standard/FAQ/Kontakt bez efektu, gradienty się bugują, 3D znika po czasie, karty „wolne boki po środku", rozjeżdżania/ucinania.
**Naprawione bugi (przyczyny, nie objawy):** (1) **3D znikało po czasie** — adaptacyjna jakość przy p95>22 ms **niszczyła scenę** (destroy) → teraz tylko obniża DPR do 1, nigdy nie kasuje; mockupy widoczne przez cały akt Realizacji (okno 0,40–0,94). (2) **Rozjeżdżanie/ucinanie na szerokich oknach** — `.act .container { width: 100% }` rozpychał kontener na całą szerokość (1817px zamiast 1152) → usunięte; `justify-content: safe center` (bez przycięć u góry na niskich oknach); piny tylko przy ≥50rem wysokości (niżej czysty scrub). (3) **Pasy w gradientach** — maski piórkujące robiły różowe pasy nad poświatą sceny → usunięte; ciągły łańcuch gradientów (`--veil-surface`/`--veil-bg`, koniec sekcji = początek następnej). (4) **Przerwy** — hero nie zjeżdża już w całości (parallax, oferta wjeżdża na wierzch); beaty-haki TERAZ we wszystkich 7 aktach (Oferta: karty, Proces: kroki, Realizacje: etapy, Standard: filary, FAQ: pytania, Kontakt: formularz+blok), piny w kolejności DOM (kolizje: 0), przejścia na pełnym dystansie.
**Dowody:** phase4/5 ALL PASS; kolizje 0 (7 pinów); axe 0 (5 pozycji, nowe piny); **LH mobile 97** (TBT 185 ms, LCP 1,24 s), **desktop 100** (CLS 0,000); geometria na 1817×685: kontener 1152px centrowany, nic nie ucięte (vision ✓).
**Dalej:** akceptacja → Faza 6.

## VISUAL RESET v2 (2026-11-09) — gałąź `visual-reset`

Spec: VISUAL_RESET_v2 („Wizytówka → strona") — zastępuje PATCH v1.1 i sekcje 8–11 MASTERPROMPT.

### Krok 0 — Sprzątanie
- Punkt zwrotny: commit „checkpoint: state before VISUAL RESET v2" (gałąź `visual-reset` od niego).
- Usunięte: `src/scripts/webgl/*` (scena LayerStack), `three` + `@types/three` (0 wpisów w package.json; grep `dist/_astro` bez three).
- `boot.ts` = `initMotion()` (tylko menu) — bez WebGL, bez canvasu.
- Zrzuty realizacji (koparkapawlowski.pl, webp w `public/media/`): desktop-thumb 27 KB (900 px), desktop-full 223 KB (≤3200 px), mobile-thumb 65 KB, mobile-full 79 KB (≤2800 px) — budżety §6 (80/450 KB) ✓.
- `astro build` ✓ (4 strony); `npm run build` failuje wyłącznie na `TODO_DOMENA` (brak domeny — decyzja użytkownika).
- Fonty: `@fontsource-variable/bricolage-grotesque` + `instrument-sans` 5.3.0 wg §4 (stare woff2 ze scaffolds miały po jednym wariancie, rodowód nieznany).

### Krok 1 — System i statyczna strona
- Tokeny §4: `--paper/--ink/--ink-70/--mute/--line/--signal`; typografia (H1 clamp(52–128px)/0,92/−0,045em, H2 clamp(40–88px)/0,98/−0,04em), siatka 12 kol., kontener 1440, header 72 px, sekcje clamp(96–200px).
- Sekcje §5: Hero (H1 w 3 liniach + miniatura realizacji 16:10 + podpis), Realizacja (fakty: Problem / Co zrobiłem / Technologia i wyniki), Zdanie przewodnie, Oferta (wiersze 01–04), Proces (sticky + 4 kroki), FAQ (`<details>/<summary>`), Kontakt (duży e-mail, „Kopiuj e-mail" + aria-live, formularz jak w v1), Stopka. Sekcja „Standard" usunięta (brak w §5).
- Treść §7 w `site.ts`. Usunięte bez dowodu: „Odpowiadam w 1 dzień roboczy" (niepotwierdzone), „Kolejne realizacje wkrótce" (zakaz §3). Przycisk „Zadzwoń" pominięty (BRIEF §3/G0: brak publicznego telefonu).
- Dowody: `layout.mjs` (§9) PASS — 68 310 par, 0 kolizji, 0 poza ekranem, 0 hScroll (360–1920, 5 pozycji scrolla); `gate1.mjs`: axe serious/critical 0 (desktop+mobile), fokus 2 px solid #2A3BFF, 0 błędów konsoli; bez JS: treść, formularz i menu widoczne.

Licznik zużycia (Krok 0/1): agent nie ma dostępu do licznika zużycia UI — do uzupełnienia z widocznego licznika przed/po.

### Krok 2 — Hero + okno realizacji (pinned-sekwencja)
- API zweryfikowane wg §0.5: npm registry gsap 3.15.1 / lenis 1.3.27 (bez zmian), lenis d.ts potwierdza autoRaf/anchors/respectReducedMotion; html.js dodaje Base.astro (inline).
- Sekwencja `hero-window.ts`: JEDEN ScrollTrigger (pin: true, scrub, invalidateOnRefresh), faza 1 = rozwinięcie okna 100vh (desktop) / 80vh (mobile), faza 2 = przewijanie zrzutu 300vh / 200vh, potem odpięcie i odjazd okna. Transform/opacity/borderRadius tylko. Lenis+ScrollTrigger w jednej pętli (gsap.ticker).
- Karta: aspekt = 100vw/100vh (aspekt okna przeglądarki, §6) — ramka (100vw×100vh) mapuje się na kartę dokładnie (x/y/scale = rect()).
- Pigułka „Koparki Pawłowski — zobacz na żywo" (lewy dół, wychodzi na https://koparkapawlowski.pl/) + cienki pasek postępu (prawy dół) — widoczne w fazie 2.
- Fallbacki: html.motion-on tylko przy pełnej inicjalizacji; bez JS / reduce / błąd boot = miniatura w hero + obraz pierwszego ekranu w Realizacji (§6).
- Naprawiony capture-realization.mjs: przycięcie clip zamiast skalowania (było 1413×6400 — zdeformowane) → 2880×6300 (342 KB) i 780×5600 (162 KB), wymiary zgodne z oczekiwanymi; budżety §6 ✓.
- layout.mjs v2: recty przycinane do klipu overflow:hidden (obraz okna nie „zachodzi" wirtualnie) + efektywna opacity (dzieci wygaszanego kontenera niewidoczne). PASS — 65 070 par, 0 kolizji, 0 poza ekranem, 0 hScroll.

### Krok 3 — Reszta ruchu (intro, mikrointerakcje)
- API SplitText zweryfikowane w typach paczki gsap (`mask: "lines"`, `aria: "auto"`, `autoSplit`, `onSplit`) wg §0.5.
- Intro ≤1.2 s (`reveals.ts`): linie H1 z maski (SplitText), lead + CTA, miniatura (y: 24 px + opacity) — miniaturą w trybie motion jest `[data-frame-wrap]` (okno), żeby nie kolidować z rect() sekwencji pinned.
- Nagłówki sekcji: maska linii przy wejściu w viewport (once). Zdanie przewodnie: wiersze y:32 + opacity, stagger 50 ms.
- Mikro (`micro.ts`): zegar „Wrocław · HH:MM · dzień" (Europe/Warsaw, pl-PL, co 30 s; ukryty ≤900 px — przelewał nagłówek), „Kopiuj e-mail" → „Skopiowano" 1,5 s (aria-live), płynne rozwinięcie FAQ + obrót plusa 45°, nagłówek chowa się w dół/wraca w górę (hysteresis 8 px na dyganie Lenisa).
- Oferta (CSS `interactions.css`): przesunięcie 12 px, przyciemnienie tła, strzałka, rysowana linia SVG (stroke-dashoffset) — hover/focus-within, wyłączane przy reduced-motion.
- Odstępstwo od §6 (właściwości animacji): wysokość akordeonu (wymagane do „płynnego rozwinięcia" §8; transform nie przesuwa sąsiednich wierszy). Reszta na transform/opacity/SVG stroke/kolorze.
- Dowody (`gate3-report.json`, mozaika `mosaic-k3.png`): zegar „Wrocław · 04:53 · poniedziałek", hover transform 12 px + strzałka 1 + dashoffset 0, FAQ open + plus 45°, „Skopiowano", is-hidden ✓, 0 błędów strony; layout.mjs PASS — 64 119 par, 0 kolizji, 0 poza ekranem, 0 hScroll (metodologia v3: recty przycinane do klipu i viewportu, efektywna opacity); fallbacky reduce/no-JS ✓.

### Krok 4 — QA i przegląd (§11)
- layout.mjs PASS — 64 119 par, 0 kolizji, 0 poza ekranem, 0 hScroll (360–1920).
- axe serious/critical 0 (desktop + mobile) — po naprawie `aria-prohibited-attr` (SplitText `aria:'auto'` doklejał aria-label do `<p>` w zdaniu przewodnim → `aria:'none'`; na h1/h2 label jest dozwolony i zostaje).
- Lighthouse (Edge, CHROME_PATH): mobile 98/100/100/100 (TBT 20 ms, LCP 2,4 s ≤ 2,5, CLS 0,001); desktop 100/100/100/100 (TBT 0 ms, LCP 0,5 s, CLS 0,003).
- Fokus: 2px solid #2A3BFF ✓; 0 błędów konsoli; fallbacky reduce/no-JS ✓ (gate2/gate3).
- Checklista anty-slop §11: ✓ brak gradientów/poświat/glassmorphism (grep 0) ✓ brak wersalików/etykiet (text-transform 0) ✓ brak opinii/nagród/liczb bez pokrycia (liczby tylko z BRIEF §5) ✓ brak kart z ikonami (numerowane wiersze; jedyne SVG = rysowana linia) ✓ każdy ruch ma cel ✓ jeden akcent --signal ✓ hero bez kolizji (test) ✓ bez JS i reduced-motion działa.
- Uwaga metodyczna testu układu (v3): recty przycinane do klipu overflow i do viewportu; kolizje liczone tylko w widocznym obszarze; efektywna opacity (dzieci wygaszanych kontenerów).

### Krok 5 — Ogromny przycięty wordmark w stopce (§8, opcjonalny)
- `Footer.astro` z propsem `giant` (tylko strona główna; strony prawne bez zmian wg zakazu §0). Tekst dekoracyjny `aria-hidden="true"` (nazwa jest już w treści stopki).
- `.site-footer__giant`: font-display 800, clamp(4.5rem, 17.5vw, 20rem), tracking −0.05em, nowrap, overflow: hidden + ujemny margines dolny — przycięcie po bokach i na linii bazowej.
- Dowody (`gate5-report.json`, mozaika `mosaic-k5.png`): tekst szerszy od viewportu na 360/768/1440/1920 (582/1087/2038/2588 px przy 360/768/1440/1920) = przycięty wszędzie; hScroll 0; layout.mjs PASS (64 119 par) po zmianie.

## VISUAL RESET v2 — stan końcowy (2026-11-09)
Kroki 0–5 zamknięte w gałęzi `visual-reset`. Lighthouse mobile 98/100/100/100 (LCP 2,4 s), desktop 100/100/100/100. axe 0. layout.mjs PASS. Anti-slop §11 ✓. Pozostało poza zakresem: fazy 6–9 (backend formularza/cookies/SEO techniczne/wdrożenie), `TODO_DOMENA` (decyzja użytkownika), brak telefonu (G0 — CTA „Zadzwoń" pominięte).

## VISUAL PATCH v3 (2026-11-17) — gałąź `visual-patch-v3`

### Krok 0 — Sprzątanie (§1)
- Usunięto wyróżnienie Koparki z hero (miniatura, ramka, przewijanie zrzutu, pigułka), blok „Problem / Co zrobiłem / Technologia i wyniki" (CaseStudy.astro), hero-window.ts oraz 2 duże zrzuty (case-desktop-full 342 KB, case-mobile-full 162 KB). Zostawiono miniatury (27/65 KB) jako `preview` projektu (§6).
- `astro build` ✓ (4 strony), `astro check` 0 błędów/0 ostrzeżeń. `npm run build` failuje wyłącznie na `TODO_DOMENA` (użytkownik: „Domeny narazie nie ma" — bramka placeholderów działa prawidłowo; do podmiany po rejestracji domeny).
- Dane od użytkownika (2026-11-17): telefon **+48 884 898 970** (przycisk „Zadzwoń", tel:), rok realizacji Koparki **2026**.

### Krok 1 — Poprawki i statyczny układ (§2, §3, §5, §6)
- §2: skip link ukryty do fokusu kl. (visually-hidden + :focus-visible); wordmark stopki mieści się w oknie (11vw, przycięcie tylko od dołu); zegar „Wrocław, HH:MM" bez dnia (15 px, --mute); „Czego potrzebuję od Ciebie" 16 px; hover wierszy oferty bez przesunięć transform (kolor + podkreślenie + strzałka + rysowana linia); kontener min(1760px, 92vw), padding clamp(20px, 5.5vw, 120px).
- §3 hero: H1 „Strony internetowe, / po których klient / dzwoni." (data-hero-line, clamp(52px, 8.6vw, 168px), lh 0.92, tracking −0,045em); sub: lead (480 px) + „Zadzwoń" (tel:+48884898970, tło --ink) + „Napisz" (obrys); stopy: „Najnowsza realizacja: Koparki Pawłowski ↗" (15 px, --mute, nazwa 600+podkreślenie) / „Przewiń ↓".
- §5 ciemna sekcja: „Robię strony dla" + 7 słów (site.nightWords), rog 40 px, licznik „01 / 07" z kropką --signal-on-dark, „Napisz do mnie", ostatnie słowo --signal-on-dark; statycznie pełna lista (tryb bez ruchu); kontrasty --night-mute/--signal-on-dark na --night ≥ 4,5:1.
- §6 Realizacje: wiersz-link (nazwa clamp(36px, 4.4vw, 72px), rodzaj, rok 2026, ↗; target=_blank rel=noopener) + stały wiersz „Twoja firma?" → #kontakt; nowe projekty = nowy wpis tablicy. Kolejność i nawigacja wg §1 (Realizacje · Oferta · Proces · FAQ + Napisz).
- Dowody: layout.mjs PASS — 74 820 par (szerokości 360–2560), 0 kolizji/0 poza/0 hScroll; wordsBad 0; wordmarkOver 0; skipHidden ✓; gate-v3-1: axe serious/critical 0 (desktop/mobile/2560) = kontrast ≥ 4,5:1 ✓, skip link fokus ✓, 0 błędów konsoli; mozaika docs/qa/visual-patch-v3/mosaic-k1.png.

### Krok 2 (2026-11-23) — Ruch + zmiany właściciela: multi-page, usunięcie sekcji słów
- DECYZJE WŁAŚCICIELA (2026-11-23): (1) ciemna sekcja „Robię strony dla…" USUNIĘTA (NightSection.astro, nightWords, style .night*); (2) strona przestała być single-page — FAQ (/faq/) i Kontakt (/kontakt/) to osobne podstrony (Base+Header+Content+Footer), nawigacja: /#realizacje · /#oferta · /#proces · /faq/ + „Napisz" → /kontakt/; CTA „Napisz" i zaproszenie w Realizacjach → /kontakt/.
- §4 ruch: hero-curtain.ts — hero przypięte (pin, pinSpacing:false, scrub), linie H1 rozjeżdżają się x ±0,18/0,17/-0,11 szer. (opacity 0,5/0,32/0,18), sub → y:-40/fade; kurtyna = cały blok treści po hero (`.after-hero`, z-index 2, nieprzezroczysty, rog 40→0 scrubowany). §3 intro: expo.out, stagger 0,08 (SplitText mask lines). Nagłówek: z-index 10 (ponad kurtyną).
- Poprawka testu §9 (metodologia): widoczność pary liczona w punkcie nakładki (paintedAt — przezroczysty tekst na wierzchu = kolizja; nieprzezroczysty panel = przykryte), centrum z rectów przyciętych do viewportu; heroDrift zwolniony z testu „poza ekranem" (§4 celowo wypycha linie).
- Dowody: layout.mjs PASS — / (28 016 par), /faq/ (6 000), /kontakt/ (8 085) — 0 kolizji/0 poza/0 hScroll (360–2560); gate-v3-2: ciągłość odpięcia max krok 10 px (brak skoku), 0 błędów konsoli (desktop/mobile), reduce: h1 opacity 1; no-JS: h1 widoczny + CTA „Zadzwoń"/„Napisz" + 1894 zn. treści; axe serious/critical 0 na /faq/ i /kontakt/; astro check 0 błędów; mozaiki mosaic-k1.png (układ) i mosaic-k2.png (hero+kurtyna).

### Krok 3 (2026-11-23) — Reszta (§6 podgląd + zdanie przewodnie)
- Podgląd realizacji: pływająca karta 300×190 (róg 12 px, cień, obrót −3°) za kursorem (gsap.quickTo, fine pointer), przy fokusie klawiatury w stałym miejscu przy wierszu, na dotyku/mobile/reduce — miniatura statyczna 300×190 pod nazwą. Hover/fokus: nazwa+strzałka --signal, podkreślenie, strzałka translate(4,-4) (§7).
- Zdanie przewodnie „zapalane" słowami ze scrollem: SplitText type:words (aria:'none'), scrub opacity 0.6→1 (próg 0.6 = kontrast ~4,8:1 — wymóg axe/Lighthouse).
- Dowody: hover karta opacity 1 + rotate(-3deg) + src miniatury; fokus karta opacity 1; mobile thumb 300×190 display:block; słowa 0.6→1; 0 błędów konsoli (sonda Playwright). Sprzątka: martwy komentarz WebGL w smooth-scroll.ts.

### Krok 4 (2026-11-23) — QA (szczegóły w docs/QA_REPORT.md)
- Layout PASS ×3 trasy (28 016 / 6 000 / 8 085 par, 360–2560); axe serious/critical 0 ×3.
- Lighthouse mobile: P98 / A11y100 / BP100 / SEO100 (FCP 1,2 s, LCP 2,3 s, TBT 80 ms, CLS 0).
- Cookies/żądania: 0 cookies, 0 requestów zewnętrznych (bez zmian vs v1). Placeholdery: tylko TODO_DOMENA (świadoma blokada). Anty-slop: 0 trafień poza sanctioned exception (linia oferty + cień karty podglądu §6).

### Krok 5 (2026-11-23) — Przejrzystość dla Kowalskiego (kierunek: grafik-24.pl)
- Decyzja właściciela: układ ma być skanowalny („ikonka, coś ten"), nie gazeta do czytania — inspiracja rytmem grafik-24.pl (bloki usług, siatka atutów, domykające CTA) w naszej estetyce (linie włosowe + oddech, bez kart/cieni/gradientów).
- Nowy rytm strony: Hero → Zdanie (1 zdanie wielkie + notka) → Oferta (4 bloki usług: ikona + nazwa + „co" + „dla kogo" + CTA) → Standard (4 atuty z ikonami) → Realizacje → Proces (4 kroki: numer + ikona + nazwa + „co" + chip „Od Ciebie") → CTA band („Porozmawiajmy…", Zadzwoń/Napisz, link do FAQ) → stopka.
- Nawigacja: Oferta · Realizacje · Proces · FAQ + „Napisz" (kolejność jak przepływ strony). Ikony: 12 cienkich SVG (Icon.astro), aria-hidden, obok tekstu. Treści bez zmian (zero nowych twierdzeń); zdanie przewodnie skrócone do 1 zdania + notka (druga część).
- Uwaga: blok „Co dostajesz w każdej stronie" (site.standard, TODO_PRZEWAGI) włączony do strony — wymaga potwierdzenia właściciela.
- Dowody: build ✓, astro check 0 błędów; layout.mjs PASS / 67 926 par, /faq/ 6 000, /kontakt/ 8 085; axe serious/critical 0 ×3; Lighthouse mobile P97/A11y100/BP100/SEO100; mozaika mosaic-k1.png (po zmianach).
