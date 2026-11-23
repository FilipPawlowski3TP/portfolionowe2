# MASTERPROMPT v1.0 — Portfolio studia webowego (one-page, kinowe WebGL)

**Wykonawca:** Hermes Agent + MiMo-V2.6-Pro
**Język rozmowy z użytkownikiem:** polski
**Język kodu, nazw plików, commitów, komentarzy w kodzie:** angielski
**Język treści widocznych na stronie:** polski (pl-PL)
**Stan wiedzy o narzędziach:** listopad 2026 (patrz sekcja 7 — wersje zawsze weryfikuj na żywo)

---

## 0. Jak używać tego dokumentu

1. To jedyne źródło prawdy dla projektu. Na początku **każdej fazy** przeczytaj ponownie sekcje 1–5 oraz sekcję danej fazy (sekcja 18).
2. **Hierarchia priorytetów** przy konflikcie: bezpieczeństwo i prawo > dostępność i wydajność > SEO > czytelność i konwersja > design > efekty animacyjne. Efekt, który łamie budżet wydajności albo dostępność, ustępuje — zawsze.
3. Oznaczenia w dokumencie:
   - `{{ZMIENNA}}` — wartość, którą trzeba uzupełnić (sekcja 3).
   - `[ZAŁOŻENIE]` — moja propozycja do potwierdzenia przez użytkownika, nie fakt.
   - `[BRAMKA]` — zatrzymaj się i poczekaj na zatwierdzenie użytkownika.
   - `[KRYTERIUM]` — warunek, który musisz zmierzyć i udowodnić, żeby uznać fazę za skończoną.
4. **Nie ufaj pamięci co do API bibliotek.** Przed użyciem Astro, GSAP, Lenis, Three.js sprawdź aktualną dokumentację (oficjalne docs, README pakietu, MCP z dokumentacją typu Context7, jeśli dostępny) oraz `npm view <pakiet> version`. Ta sama zasada dotyczy przepisów prawnych.
5. **Nie deklaruj, że coś działa, dopóki tego nie uruchomiłeś.** Każde twierdzenie w raporcie ma mieć dowód: komendę i jej wynik, zrzut ekranu albo liczbę z pomiaru.

---

## 1. Rola i misja

Jesteś zintegrowanym zespołem: **art director + senior creative developer + technical SEO + QA**. Budujesz jednostronicowe portfolio **{{MARKA}}** — studia, które robi strony internetowe na zamówienie dla małych i lokalnych firm.

Ta strona jest wizytówką właściciela. Ma robić trzy rzeczy jednocześnie:

1. **Zachwycić wizualnie** — kinowa, żywa, technologiczna, z płynnym scrollem i animowanym światem 3D (inspiracja zasadami: motionsites.ai, strona GTA VI od Rockstar).
2. **Nie przytłoczyć zwykłego klienta** — „pan Kowalski” ma od razu zrozumieć: co robię, dla kogo, ile to trwa mniej więcej i jak się ze mną skontaktować. Efekty służą narracji, nie odwrotnie.
3. **Być dowodem kompetencji technicznych** — szybka, dostępna, dobrze widoczna w Google, zgodna z polskim prawem. Strona sama jest portfolio: jej wyniki w Lighthouse i jakość kodu są argumentem sprzedażowym.

**Krytyczne napięcie, które musisz rozwiązać:** mocne WebGL kontra szybkość i SEO. Rozwiązanie jest zamknięte w tej architekturze: **treść i SEO żyją w czystym HTML, a scena 3D to warstwa dodatkowa ładowana po pierwszym renderze, z automatycznymi trybami awaryjnymi** (sekcja 11).

---

## 2. Kontekst biznesowy i odbiorca

- **Właściciel:** freelancer zaczynający działalność. Oferta: strony na zamówienie dla lokalnych firm usługowych, rzemieślników, małych firm.
- **Odbiorca strony:** osoba nietechniczna, często na telefonie, często z konkretnym problemem („nie mam strony”, „mam starą stronę, której nikt nie widzi”). Czyta szybko, szuka zaufania i prostego kontaktu.
- **Jedyne case study na start:** `https://koparkapawlowski.pl/` — strona firmy z usługami minikoparką (przygotowana przez właściciela). Fakty o niej pobierz sam w Fazie 0 (sekcja 9, akt IV). Nie wymyślaj żadnych liczb ani wyników.
- **Główne cele konwersji (w tej kolejności):** (1) kliknięcie „Zadzwoń” / „Napisz”, (2) wysłanie formularza, (3) przewinięcie do realizacji.
- **Inspiracje — zasady, nie zasoby.** Wolno przejąć *zasadę* (scroll steruje sceną, kinowy rytm, głębia, duża typografia). **Zakaz** kopiowania układu, tekstów, grafik, nazw, marki czy kodu z motionsites.ai, Rockstar/GTA VI lub jakiejkolwiek innej strony.

---

## 3. Zmienne do uzupełnienia

Agent w Fazie 0 sprawdza, które wartości są puste, i dopytuje użytkownika **jedną zbiorczą wiadomością**. Pola niekrytyczne wypełnij widocznym placeholderem `TODO_NAZWA` i dopisz do `docs/TODO_USER.md`. **Skrypt `scripts/check-placeholders.mjs` musi wywalać build produkcyjny**, jeśli w `dist/` został jakikolwiek `TODO_` lub `{{`.

| Zmienna | Opis | Krytyczna? |
|---|---|---|
| `{{MARKA}}` | Nazwa studia / handle; jeśli brak logo — zaprojektuj prosty wordmark | tak |
| `{{OSOBA}}` | Imię i nazwisko osoby prowadzącej | tak |
| `{{FORMA_PRAWNA}}` | JDG / inna / dopiero rejestracja (wpływa na dane w stopce i polityce) | tak |
| `{{NIP}}`, `{{REGON}}` | Dane firmy do stopki i polityki prywatności (REGON opcjonalny) | tak (dla NIP) |
| `{{ADRES_FIRMY}}` | Adres do publikacji (może być adres do doręczeń) | tak |
| `{{EMAIL}}`, `{{TELEFON}}` | Publiczne dane kontaktowe | tak |
| `{{DOMENA}}` | Docelowa domena (kanonicznie: z `www` czy bez — wybierz jedną) | nie (placeholder) |
| `{{LOKALIZACJA_DZIALANIA}}` | Miasto / region / cała Polska — steruje lokalnym SEO | tak |
| `{{ZAKRES_USLUG}}` | `[ZAŁOŻENIE]`: 1) strona-wizytówka (one-page), 2) strona firmowa wielostronicowa z SEO lokalnym, 3) landing page pod kampanię, 4) opieka po wdrożeniu (hosting, zmiany, kopie, aktualizacje), 5) odświeżenie istniejącej strony | tak |
| `{{CENNIK_MODEL}}` | `[ZAŁOŻENIE]`: wycena indywidualna po rozmowie (bez publikowania cen). Alternatywa: „od X zł” | nie |
| `{{CZAS_REALIZACJI}}` | Typowy czas realizacji — tylko jeśli właściciel potwierdzi | nie |
| `{{PRZEWAGI}}` | 3–4 przewagi, które właściciel może uczciwie obronić (np. własność strony po stronie klienta, szybkość, brak ukrytych kosztów) | tak |
| `{{SOCIAL}}` | Linki do profili (opcjonalnie) | nie |
| `{{GBP}}` | Czy istnieje Google Business Profile | nie |
| `{{ANALITYKA}}` | Domyślnie **brak**. Jeśli ma być: tylko bezcookiesowa (Cloudflare Web Analytics / Plausible / Umami) — i aktualizacja polityk | nie |
| `{{FORMA_ZWRACANIA}}` | Domyślnie „Ty” (spójnie z tonem strony taty) | nie |
| `{{CASE_STUDY_ZGODA}}` | Zgoda klienta na prezentację realizacji. Dla koparkapawlowski.pl: potwierdzona (strona dla rodziny) — przy kolejnych klientach zawsze pytaj | tak |

---

## 4. Decyzje zamknięte (nie renegocjuj)

| Obszar | Decyzja |
|---|---|
| Framework | **Astro** (najnowsza stabilna; w chwili pisania 7.x — zweryfikuj), `output: 'static'`, TypeScript `strict` |
| Style | **Czysty CSS**: custom properties jako tokeny, `@layer`, `clamp()` do typografii. **Bez Tailwind** (pełna kontrola nad animowanym markupem, mniejszy output) |
| Animacje DOM | **GSAP** (pakiet `gsap` zawiera wszystkie wtyczki — ScrollTrigger, SplitText, Flip, DrawSVG itd. są od 2025 darmowe, także komercyjnie) |
| Płynny scroll | **Lenis** (pakiet `lenis`), zsynchronizowany z GSAP ScrollTrigger |
| 3D | **Three.js** + własne shadery GLSL, ładowany **dynamicznie po pierwszym renderze**. Bez React Three Fiber (nie ma Reacta) |
| Struktura | **One-page** + strony techniczne: polityka prywatności, polityka cookies, 404 |
| Siła efektów | **Mocna** (kinowe WebGL), ale z trzema poziomami jakości (tiery) i fallbackami |
| Język | Tylko polski (`<html lang="pl">`) |
| Motyw | Tylko ciemny (`color-scheme: dark`) — to decyzja artystyczna, kontrast musi i tak spełniać WCAG AA |
| Hosting (domyślnie) | **Cloudflare Pages** (statyczny, edge w UE, Pages Functions do formularza, Turnstile) |
| Nawigacja między stronami | Zwykłe linki. **Bez ClientRouter / Barba.js**. Płynne przejścia legal↔home przez CSS `@view-transition { navigation: auto; }` jako progressive enhancement |
| Czcionki | Self-hosted (zero zapytań do Google Fonts — to też sprawa RODO) |

---

## 5. Zasady pracy agenta

**Rygor**
- R-01. Pracuj fazami (sekcja 18). Nie przeskakuj. Każda faza kończy się `[KRYTERIUM]` z dowodami.
- R-02. Utrzymuj `docs/PROGRESS.md` (co zrobione, co dalej, decyzje, komendy build/test). Po przerwie lub utracie kontekstu zacznij od jego przeczytania.
- R-03. Commit po każdym sensownym kroku (`git init` w Fazie 2). Format: Conventional Commits po angielsku (`feat:`, `fix:`, `perf:`, `docs:`).
- R-04. Nie przepisuj hurtowo działających plików. Edytuj punktowo.
- R-05. Gdy API jest niepewne — sprawdź dokumentację. Nie zgaduj. Nie kopiuj kodu z pamięci bez weryfikacji z wersją w `package.json`.
- R-06. Każda zależność musi mieć uzasadnienie w `docs/DEPENDENCIES.md` (po co, rozmiar gzip). Lista dozwolonych: sekcja 7.

**Uczciwość treści**
- R-07. **Zakaz zmyślania:** klientów, opinii, logotypów, liczb, lat doświadczenia, nagród, wyników. Jeśli czegoś nie ma — slot „Kolejne realizacje wkrótce” albo pominięcie sekcji.
- R-08. Fakty o koparkapawlowski.pl pochodzą z **własnego audytu** (Playwright + Lighthouse), nie z domysłów. Prezentuj tylko to, co zmierzyłeś lub zobaczyłeś.
- R-09. Treści prawne to **projekt do weryfikacji przez prawnika**. Zapisz to w `docs/LEGAL_DRAFT_NOTES.md` i w raporcie końcowym (nie na publicznej stronie).

**Komunikacja**
- R-10. Po każdej fazie wyślij użytkownikowi raport (≤ 15 linii): zrobione, dowody, problemy, następny krok.
- R-11. Pytaj tylko wtedy, gdy jesteś zablokowany. Jedno pytanie zbiorcze zamiast wielu małych.
- R-12. Jeśli Twoje narzędzia nie pozwalają „widzieć” obrazów, nie udawaj oceny wizualnej: opisz pomiary DOM/CSS i poproś użytkownika o ocenę zrzutów. (MiMo-V2.6-Pro przyjmuje obrazy — jeśli Hermes przekazuje screenshoty, używaj ich do autokrytyki.)

**Pamięć Hermesa (opcjonalnie, po Fazie 9)**
- R-13. Zapisz w pamięci: ścieżkę projektu, komendy build/test/QA, decyzje z sekcji 4. Rozważ utworzenie własnego skilla `portfolio-qa` z powtarzalnym procesem QA z sekcji 19.

---

## 6. Skille i narzędzia

Poniżej wybór z listy użytkownika (50 pozycji) oraz dodatki spoza niej. **Jeśli dany skill nie jest dostępny w Hermesie — zastosuj zasadę z opisu ręcznie**, nie blokuj się.

### 6.1. Rdzeń (używaj aktywnie)

| Grupa skilli | Rola w projekcie | Fazy |
|---|---|---|
| **Frontend Design** | Plan designu: tokeny, typografia, layout, autokrytyka przeciw „generycznemu” wyglądowi | 1, 3 |
| **UI UX Pro Max** | Dobór palety, par fontowych, komponentów; sprawdzenie kontrastów | 1 |
| **Visual Storytelling** + **Cinematic Web Animations** | Narracja „noc → świt” i rytm scrolla | 1, 4, 5 |
| **Motion Principles** (+ **Emil Design Engineering**) | Naturalne easingi, mikrointerakcje, dopracowanie detali | 4, 8 |
| **GSAP Core + ScrollTrigger + Timeline** | Sekwencje i animacje sterowane scrollem. Preferuj oficjalne skille GSAP (repo `greensock/gsap-skills`: `gsap-core`, `gsap-scrolltrigger`, `gsap-plugins`) zamiast nieoficjalnych | 4 |
| **Lenis** | Płynny scroll + integracja z GSAP (załącznik A) | 4 |
| **Three.js + WebGL + GLSL Shaders** | Scena 3D, shadery, cząsteczki, mockupy urządzeń | 5 |
| **Text Reveal Animations** | Odsłanianie nagłówków (SplitText z `autoSplit`, z zachowaniem `aria-label`) | 4 |
| **Fluid Typography** + **Responsive Design** | `clamp()`, siatka, testy breakpointów | 3 |
| **Accessibility** | WCAG 2.2 AA, klawiatura, `prefers-reduced-motion` | 3, 4, 8 |
| **Performance Optimization** | Budżety, lazy-load, obrazy, fonty, CWV | wszystkie |
| **Playwright** + **Screenshot QA** | Macierz zrzutów, audyt cookies/requestów, testy fallbacków | 8 |
| **Impeccable** | Końcowy przegląd jakości wizualnej | 8 |

### 6.2. Warunkowe (tylko jeśli dają realną wartość i mieszczą się w budżecie)

| Skill | Kiedy |
|---|---|
| **Awwwards Design** | Tylko jako poziom odniesienia przy Fazie 1. Nie kopiuj wzorców, nie przesadzaj z ozdobnikami |
| **3D Product Showcase** | Mockup laptopa i telefonu w akcie IV |
| **SVG Animation** (GSAP DrawSVG) | Linie „rysunku technicznego” w hero i w procesie |
| **Particle Effects** | Wyłącznie jako instancjonowane cząsteczki wewnątrz sceny Three.js |
| **Parallax Effects** | Subtelnie, wewnątrz sceny i przy mockupach |
| **WebGL Distortion Effects** | Hover na zrzucie case study — tylko Tier 2 i tylko jeśli budżet pozwala |
| **Custom Cursor** | Opcjonalnie, desktop (`hover: hover` + `pointer: fine`), nigdy nie ukrywaj natywnego kursora w polach formularza. Lepszy zamiennik: wskaźnik wpływa na światło w scenie |
| **Extract Design System** | Do opisania systemu wizualnego koparkapawlowski.pl w case study |
| **Web Design Inspiration** | Faza 1 — krótka analiza, bez kopiowania |
| **GOATED UI** | Wyłącznie bank pomysłów. Nie wklejaj receptur hurtowo (spójność i wydajność) |

### 6.3. Pomijamy (i dlaczego)

Framer Motion, React Three Fiber (brak Reacta) · Barba.js, Page Transitions (one-page; wystarczy CSS view transitions) · Anime.js (dubluje GSAP) · Lottie, Rive (brak materiałów, dodatkowy runtime) · PixiJS, Babylon.js, Spline (ciężkie runtime’y, dubluje Three.js) · Horizontal Scroll (niepotrzebny w tej narracji) · Prototype, Hallmark, Web Artifacts Builder, Image to UI, Image to Code, Animation Vocabulary (inne zastosowania).

### 6.4. Dodatki spoza listy

| Narzędzie | Po co |
|---|---|
| **Dokumentacja na żywo** (Context7 MCP albo `web_fetch` oficjalnych docs) | Aktualne API Astro 7 / GSAP / Lenis / Three.js zamiast pamięci |
| **Lighthouse (CLI)** + **axe-core** (`@axe-core/playwright`) | Mierzalne wyniki wydajności, SEO, dostępności |
| **ffmpeg**, **sharp** | Kompresja zasobów, generowanie OG-image i poster-frame |
| **gltf-transform** | Tylko jeśli pojawi się model glTF (Draco/meshopt, KTX2) — domyślnie scena jest proceduralna, bez modeli |
| **Walidator schema.org / Rich Results Test** | Weryfikacja JSON-LD (wynik poproś potwierdzić użytkownika, jeśli nie masz dostępu do sieci) |

---

## 7. Architektura techniczna

### 7.1. Zależności

**Produkcyjne (dozwolone):** `astro`, `@astrojs/sitemap`, `gsap`, `lenis`, `three`, dwa fonty variable z `@fontsource-variable/*` (albo wbudowana obsługa fontów w Astro, jeśli jest w aktualnej stabilnej — sprawdź docs).
**Deweloperskie:** `typescript`, `@astrojs/check`, `@types/three`, `playwright`, `@axe-core/playwright`, `lighthouse`, `prettier` + `prettier-plugin-astro`.
**Shadery:** importuj jako `?raw` (Vite) — bez dodatkowych pluginów.

**Zakazane:** jQuery, Tailwind, React/Vue/Svelte (bez powodu), Locomotive Scroll, ScrollMagic, AOS, animate.css, Barba.js, jakiekolwiek skrypty/style/fonty ładowane z CDN w runtime, trackery i piksele reklamowe, osadzenia YouTube/Maps.

### 7.2. Struktura katalogów

```
/
├─ astro.config.mjs
├─ package.json
├─ tsconfig.json
├─ README.md
├─ docs/
│  ├─ BRIEF.md              # zmienne + decyzje (Faza 0)
│  ├─ DESIGN_PLAN.md        # tokeny, ASCII wireframe, storyboard sceny, motion spec (Faza 1)
│  ├─ SEO_PLAN.md
│  ├─ LEGAL_DRAFT_NOTES.md  # co zawierają dokumenty prawne, na jakich danych, co sprawdzić z prawnikiem
│  ├─ DEPENDENCIES.md
│  ├─ TODO_USER.md          # rzeczy do uzupełnienia przez właściciela
│  ├─ PROGRESS.md
│  ├─ QA_REPORT.md
│  └─ DEPLOY.md
├─ functions/api/contact.ts # Cloudflare Pages Function (formularz)
├─ public/
│  ├─ _headers  _redirects
│  ├─ robots.txt  llms.txt (opcjonalnie)  site.webmanifest
│  ├─ favicon.svg  favicon-32.png  apple-touch-icon.png
│  ├─ og/og-default.jpg     # 1200×630
│  └─ media/                # zrzuty case study (webp/avif), poster-frame
├─ scripts/
│  ├─ check-placeholders.mjs
│  └─ qa/ (screenshots.mjs, a11y.mjs, lighthouse.mjs, storage-audit.mjs, frame-times.mjs)
└─ src/
   ├─ data/site.ts          # JEDNO źródło prawdy: NAP, teksty sekcji, FAQ, linki
   ├─ layouts/ (Base.astro, Legal.astro)
   ├─ components/ (Header, Hero, Offer, Process, CaseStudy, Standard, Faq, Contact, Footer, SeoHead, JsonLd, T.astro)
   ├─ pages/ (index.astro, polityka-prywatnosci.astro, polityka-cookies.astro, 404.astro)
   ├─ scripts/
   │  ├─ boot.ts            # wejście: wykrycie tieru, inicjalizacja warstw
   │  ├─ motion/ (smooth-scroll.ts, reveals.ts, sections.ts, menu.ts, form.ts)
   │  └─ webgl/ (tier.ts, scene.ts, acts.ts, particles.ts, devices.ts, adaptive.ts, shaders/*.glsl)
   ├─ styles/ (tokens.css, base.css, layout.css, components.css, motion.css, legal.css)
   └─ utils/ (typo.ts — polskie nierozdzielne spacje; seo.ts)
```

### 7.3. Konfiguracja Astro (szkic — zweryfikuj z docs aktualnej wersji)

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://{{DOMENA}}',
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
});
```

Zasady:
- Skrypty w `.astro` pisz jako moduły; ciężkie rzeczy (Three.js) importuj **dynamicznie**: `const { startScene } = await import('./webgl/scene');`.
- Obrazy przez `astro:assets` (AVIF/WebP, `srcset`, `width`/`height` zawsze podane, `loading="lazy"` poza hero, `fetchpriority="high"` tylko dla elementu LCP).
- Jedna spójna forma adresów (ze slashem na końcu), canonical zgodny z faktycznym adresem. Przekierowanie 301 `www` ↔ apex w `_redirects`/ustawieniach hostingu.

---

## 8. Design

### 8.1. Kierunek artystyczny: „Noc → świt”

Narracja wizualna = narracja sprzedażowa: **pomysł (noc, szkic) → budowa → premiera (świt)**. Kolor, światło i gęstość sceny płynnie zmieniają się wraz ze scrollem. To jest **jedyna „głośna” rzecz** na stronie (zasada: wydaj odwagę w jednym miejscu — reszta spokojna i zdyscyplinowana). Typografia, układ i komponenty pozostają powściągliwe.

Motyw „rysunku technicznego” (linie wymiarowe, siatka blueprint) nawiązuje do estetyki case study i podkreśla, że to rzemiosło, nie szablon.

### 8.2. Tokeny — punkt wyjścia (kandydat, nie dogmat)

Sprawdź kontrasty (WCAG AA: tekst ≥ 4,5:1, duży ≥ 3:1) i **zrecenzuj paletę przeciw typowym „znakom rozpoznawczym” generowanych stron** (sekcja 8.5). Jeśli wygląda generycznie — zmień i uzasadnij.

```css
:root {
  --c-night-950: #070B18;   /* tło bazowe, noc */
  --c-night-900: #0B1226;
  --c-night-700: #18223D;   /* powierzchnie */
  --c-dawn-400:  #FF8A5B;   /* akcent główny: CTA, światło świtu */
  --c-dawn-200:  #FFC9A3;
  --c-ice-300:   #8FD3FF;   /* akcent pomocniczy: linie blueprint, fokus */
  --c-ink-100:   #F2F0EA;   /* tekst podstawowy */
  --c-ink-300:   #A9B1C6;   /* tekst drugorzędny (sprawdź kontrast!) */
  color-scheme: dark;
}
```

Zasady: maks. dwa akcenty o jasno rozdzielonych rolach (ciepły = akcja/świt, chłodny = struktura/blueprint). Reszta to skala neutralna.

### 8.3. Typografia

- Dwie rodziny maks.: **display** (charakter, nagłówki) + **tekst** (czytelny, neutralny). Kandydaci do sprawdzenia: display — Bricolage Grotesque, Unbounded, Syne; tekst — Figtree, Instrument Sans, Onest, Albert Sans. Unikaj najczęściej nadużywanych domyślnych wyborów.
- **Obowiązkowo zweryfikuj polskie znaki** (subset `latin` + `latin-ext`): wyrenderuj „Zażółć gęślą jaźń. ĄĆĘŁŃÓŚŹŻ” w obu fontach i obejrzyj zrzut.
- Self-hosting, `woff2`, `font-display: swap`, preload **tylko** fontu nagłówka z hero. Cel: ≤ 2 pliki, ≤ ~60 KB łącznie.
- Skala płynna `clamp()`, długość linii < 75 znaków, `text-wrap: balance` w nagłówkach, `text-wrap: pretty` w akapitach, `hyphens: auto` w tekście (z `lang="pl"`).
- **Polska typografia:** nierozdzielna spacja po jednoliterowych spójnikach i przyimkach (i, o, u, w, z, a), przed „zł”, „t”, jednostkami; cudzysłowy „…”; półpauza/pauza zgodnie z regułami. Zaimplementuj `typo()` w `utils/typo.ts` i komponent `<T>`; stosuj do całej treści z `site.ts`.

### 8.4. Układ i komponenty

- Mobile-first. Breakpointy testowe: 360, 390, 768, 1024, 1280, 1440, 1920. Kontener z maks. szerokością dla ultrawide.
- Cele dotykowe ≥ 44×44 px. Odstępy z tokenów. Jeden promień zaokrągleń dobrany do hierarchii (nie „ten sam wszędzie”).
- Tekst zawsze w DOM, **nad** canvasem; czytelność zapewniają gradientowe „scrimy” (nie ciężkie `backdrop-filter` na dużych powierzchniach).
- **Wymagane w Fazie 1:** ASCII wireframe każdej sekcji (desktop + mobile) i porównanie 2–3 koncepcji układu hero.

### 8.5. Czego unikać (typowe „znaki rozpoznawcze” generowanych stron)

- Jasno-kremowe tło z szeryfem i terakotowym akcentem; **czarne tło z jednym jaskrawym akcentem w stylu „acid”** (nasza paleta ma być uzasadniona narracją noc→świt, nie modą).
- Siatka identycznych zaokrąglonych kart z tym samym cieniem; gradientowe „plamy” jako ozdoba.
- Rozstrzelone WIELKIE LITERY nad każdym nagłówkiem; etykiety „SŁOWO — fragment”; ciągi „A · B · C”; strzałka „→” przy każdym linku; monospace do drobnych etykiet z przyzwyczajenia.
- Akcentowanie jednego słowa w nagłówku kursywą/kolorem jako reguła.
- Numeracja 01/02/03 tam, gdzie treść nie jest sekwencją (w procesie — wolno).
- Fade-up na każdej sekcji i hover na każdej karcie. Ruch niewywołany przez użytkownika stosuj oszczędnie; jedna orkiestrowana sekwencja wejścia + ruch wynikający ze scrolla.

---

## 9. Storyboard strony (one-page)

Każda sekcja ma: cel, treść, układ, ruch DOM, stan sceny 3D, fallback. Wszystkie sekcje mają semantyczny HTML i są w pełni czytelne bez JS i bez WebGL.

**Nagłówek (sticky)** — wordmark, kotwice (Oferta, Proces, Realizacje, FAQ, Kontakt), przycisk „Zadzwoń” (`tel:`) i „Napisz”. Menu mobilne: `<button aria-expanded>`, `inert` na reszcie strony, Esc zamyka, Lenis `stop()` przy otwartym menu.

**Akt I — Hero („Szkic”)**
- Cel: w 5 sekund zrozumieć *co* i *dla kogo* + dać CTA.
- Treść: jedno `<h1>` (≤ 9 słów, naturalnie zawiera frazę „strony internetowe” + korzyść; propozycje do dopracowania: „Strony internetowe dla firm, po których klient dzwoni” / „Tworzę strony, dzięki którym klienci znajdują Twoją firmę”), 1–2 zdania wsparcia, CTA główne „Zadzwoń” + drugorzędne „Zobacz realizację”.
- Scena: noc, perspektywiczna siatka blueprint, powoli dryfujące cząsteczki „pyłu”, delikatny paralaks od wskaźnika.
- Ruch: jedna orkiestrowana sekwencja ≤ 1,2 s (scena wjeżdża z czerni → linie się rysują → H1 odsłania się maską linii). Start ≤ 100 ms po pierwszym renderze. **Element LCP (H1 lub poster) nie może czekać na JS ani WebGL.**
- Fallback: statyczny gradient CSS + SVG blueprint; H1 widoczny od razu.

**Akt II — Oferta („Konstrukcja”)**
- Treść: 4–5 usług z `{{ZAKRES_USLUG}}`, każda: nazwa po ludzku, jedno zdanie „co dostajesz”, dla kogo.
- Scena: panele wireframe „wypełniają się” materiałem w miarę wejścia kart; kamera powoli się zbliża.
- Układ: nie jednakowa siatka identycznych kart — hierarchia (jedna usługa wiodąca większa).
- Cena: według `{{CENNIK_MODEL}}`; domyślnie „Wycena po krótkiej rozmowie”.

**Akt III — Proces („Droga”)** — rzeczywista sekwencja, więc numeracja uzasadniona
- 4 kroki: **Rozmowa → Projekt i akceptacja → Budowa → Start i opieka**. Pod każdym: co robię i czego ode mnie potrzeba (prostym językiem). Czas — tylko jeśli `{{CZAS_REALIZACJI}}` potwierdzony.
- Scena: kamera przelatuje przez 4 „bramy” po krzywej (CatmullRom), sekcja przypięta (`pin`) na ≤ 3 wysokości ekranu na desktopie; na mobile krócej lub bez pinu.
- Fallback: pionowa lista kroków.

**Akt IV — Realizacje („Premiera”)**
- Treść: studium przypadku **Koparki Pawłowski** w formule problem → co zrobiono → efekt. Fakty wyłącznie z audytu w Fazie 0: zakres strony (struktura, sekcje, SEO lokalne, CTA telefoniczne), technologia, zmierzone wyniki (Lighthouse), nazwa i link. Przycisk „Zobacz stronę na żywo” (`target="_blank" rel="noopener"`). Obok slot „Kolejne realizacje wkrótce” — uczciwie, bez fikcyjnych projektów.
- Scena: trójwymiarowy laptop i telefon (proste geometrie, `RoundedBoxGeometry`) z teksturami = **własne zrzuty** strony (webp, nie hotlinkuj obrazów z cudzej domeny), przechylają się od scrolla i wskaźnika.
- Fallback: te same zrzuty w ramkach CSS.

**Akt V — Standard („Jakość”)** — „Co dostajesz w każdej stronie”
- 4 przewagi z `{{PRZEWAGI}}` w języku korzyści: ładuje się szybko, dobrze wygląda na telefonie, da się ją znaleźć w Google, zgodna z RODO/cookies. Tłumacz po ludzku (nie „SEO”, tylko „żeby klienci znajdowali Cię w Google”; nie „hosting”, tylko „serwer, na którym stoi strona”).
- Scena: uspokaja się, cząsteczki zwalniają.

**Akt VI — FAQ**
- 6–8 pytań (ile to kosztuje, ile trwa, co muszę przygotować, kto jest właścicielem strony, co z domeną i serwerem, co po wdrożeniu, czy strona będzie w Google, czy dostanę zmiany po oddaniu). `<details>/<summary>` (natywnie dostępne, treść w DOM). Odpowiedzi tylko takie, które właściciel potwierdzi.
- Dane strukturalne FAQ: opcjonalnie (rich results dla FAQ są w Google mocno ograniczone) — nie wprowadzaj niezgodności między JSON-LD a treścią widoczną.

**Akt VII — Kontakt („Start”)**
- Scena: świt — ciepłe światło, spokojna scena. Formularz (sekcja 17), telefon i e-mail jako duże, klikalne CTA, godziny kontaktu jeśli podane.
- Stopka: dane usługodawcy (nazwa, adres, NIP, e-mail, telefon), linki do polityki prywatności i cookies, rok i nazwa marki.

**Długość scrolla:** ok. 7–9 wysokości ekranu na desktopie; krócej na mobile. Zero „scroll-jackingu” — natywny kierunek i tempo scrolla zawsze zachowane, brak blokowania kółka.

---

## 10. System ruchu (GSAP + Lenis)

- **Jedna pętla animacji.** `gsap.ticker` napędza Lenis **i** render WebGL (`gsap.ticker.add(renderScene)`). Żadnych dodatkowych `requestAnimationFrame`.
- **Integracja Lenis + ScrollTrigger:** załącznik A (zgodna z aktualnym README Lenis; sprawdź opcje w docs).
- Animuj wyłącznie `transform`, `opacity`, `clip-path` i uniformy shaderów. Nigdy `top/left/width/height/margin`.
- `will-change` dodawaj tylko na czas animacji. Czyść instancje: `gsap.context()` / `revert()`; wzorzec `gsap.matchMedia()` do rozgałęzień (reduced motion, szerokość).
- **Stany początkowe tylko przez JS-owy klasę** `html.js` i tylko w `@media (prefers-reduced-motion: no-preference)`. Bez JS treść jest widoczna. Awaryjny timeout (3 s): jeśli skrypty nie wystartowały, dodaj klasę odsłaniającą wszystko.
- **Bez preloadera.** Scena jest proceduralna, nic ciężkiego do „ładowania”.
- Tokeny ruchu: 3 easingi i 4 czasy trwania w `tokens.css` + odpowiedniki GSAP (np. `power3.out`, `expo.out`, `power2.inOut`). Używaj ich konsekwentnie.
- SplitText: z `autoSplit: true`, zachowaj dostępność (pełny tekst dla czytników), reveal tylko dla kluczowych nagłówków — akapity prosty fade.
- Po `document.fonts.ready` i załadowaniu obrazów: `ScrollTrigger.refresh()`. Ustaw `invalidateOnRefresh` tam, gdzie wartości zależą od rozmiaru.
- Kotwice: `lenis.scrollTo(target, { offset: -headerHeight })`, aktualizacja hasha, przeniesienie fokusu na nagłówek sekcji (`tabindex="-1"`). `scroll-padding-top` w CSS jako zabezpieczenie.
- `prefers-reduced-motion: reduce`: Lenis wyłączony, brak pinów i parallaxu, sceny statyczne, przejścia ≤ 150 ms (sam fade).

---

## 11. System WebGL (tiery, budżety, adaptacja)

### 11.1. Architektura
- **Jeden** stały canvas (`position: fixed; inset: 0; z-index` pod treścią, `pointer-events: none`, `aria-hidden="true"`) i **jedna** scena sterowana postępem scrolla (`sceneState`: `progress`, `act`, `grade`, `pointer`). Sekcje przez ScrollTrigger (`scrub`) aktualizują `sceneState`; render czyta stan i wygładza go (lerp).
- Inicjalizacja **po** pierwszym renderze: `load` → `requestIdleCallback` (timeout 1500 ms) → `import('./webgl/scene')`. Crossfade z gradientowego fallbacku CSS (≈ 400 ms), który wygląda jak pierwsza klatka sceny — bez „mignięcia”.
- Scena proceduralna: shadery siatki blueprint, instancjonowane cząsteczki, proste geometrie mockupów. Teksturę/GLB dodawaj tylko, gdy bez nich się nie da (wtedy glTF-transform: meshopt/Draco, tekstury KTX2).
- Kolor „noc → świt” jako uniform `uGrade` interpolowany wg scrolla — spójnie z tokenami CSS.

### 11.2. Tiery

| Tier | Kiedy | Co działa |
|---|---|---|
| **0 — statyczny** | `prefers-reduced-motion`, `saveData`, brak WebGL2/WebGL, awaria kontekstu, po automatycznym zejściu z tieru 1 | Brak canvasu i brak Lenis. Gradient CSS + SVG blueprint + zrzuty w ramkach; proste przejścia CSS. Pełna treść i nawigacja |
| **1 — lekki** | Słabszy sprzęt (mało rdzeni/pamięci, dotyk + niska moc), spadek FPS | Canvas z uproszczonym shaderem, ≤ 600 cząsteczek, DPR 1, bez postprocessingu; GSAP reveals na DOM |
| **2 — pełny** | Dobry sprzęt desktop/mobile | Pełna scena, cząsteczki, paralaks wskaźnika, mockupy 3D z teksturami |

Wykrywanie startowe (szkic w załączniku B): `matchMedia` (reduced motion, `pointer: coarse`), `navigator.connection?.saveData`, `hardwareConcurrency`, `deviceMemory` (jeśli dostępne — nie ma go w Safari/Firefox, używaj rozsądnych wartości domyślnych), test `getContext('webgl2')`.

### 11.3. Budżety i zasady
- DPR: Tier 2 desktop ≤ 1,75; Tier 2 mobile ≤ 1,25; Tier 1 = 1.
- Wywołania rysowania ≤ 40, trójkąty ≤ 150 k, cząsteczki ≤ 3500 (desktop T2) / 1500 (mobile T2) / 600 (T1). Tekstury ≤ 4 × (max 2048 px), `anisotropy` ≤ 4, `colorSpace = SRGBColorSpace` dla zrzutów.
- Bez ciężkiego postprocessingu na mobile. Ziarno/vignette jako lekka nakładka CSS (mały kafelek webp), nie przepustka shaderowa.
- **Render na żądanie:** ~60 FPS przez 1,5 s po ostatnim scrollu/ruchu wskaźnika, potem ambient 30 FPS (albo stop, jeśli scena jest statyczna). Pauza na `document.hidden`.
- **Adaptacja na żywo:** po starcie zbierz ~90 klatek; jeśli p95 czasu klatki > 22 ms → zmniejsz DPR (krok 0,25 do min. 1,0) → zmniejsz cząsteczki → zejdź o tier. **Nie awansuj** automatycznie w trakcie sesji (unikaj migotania).
- Obsłuż `webglcontextlost` (`preventDefault`) i `webglcontextrestored` (odbuduj albo zejdź do Tier 0). Sprzątaj: `dispose()` geometrii, materiałów, tekstur, renderera.
- Resize: `ResizeObserver` z debouncingiem; na mobile ignoruj zmiany samej wysokości < 120 px (pasek adresu), żeby scena nie „skakała”.
- Wskaźnik: tylko dla `pointer: fine`, wygładzony; na dotyku wyłączony.
- Shadery: GLSL ES 3.00, komentarze po angielsku, uniformy `uTime, uProgress, uPointer, uRes, uGrade`. Unikaj gałęzi i dużych pętli w fragment shaderze.
- Bez tekstu w canvasie. Całość treści — w DOM.
- Flagi debug (`window.__SCENE_DEBUG__`, ustawianie postępu sceny do zrzutów) **tylko** gdy `import.meta.env.DEV` albo `PUBLIC_QA=1` przy buildzie testowym; w produkcji ich nie ma.

### 11.4. Opcjonalnie (nice-to-have, Faza 8+)
Nagraj krótką pętlę rzeczywistej sceny (Playwright → klatki → ffmpeg) jako poster/wideo dla Tier 0/1: `muted playsinline`, ≤ 1,2 MB, bez autoplay dla `reduced-motion` i `saveData` (wtedy tylko obraz).

---

## 12. Treści i copywriting (PL)

- Ton: ludzki, konkretny, ciepły, bez żargonu. Forma `{{FORMA_ZWRACANIA}}` (domyślnie „Ty”). Zdania krótkie. Rzeczowniki konkretne.
- **Zakazane frazy:** „innowacyjne rozwiązania”, „kompleksowa oferta”, „dynamiczny rozwój”, „indywidualne podejście” (bez dowodu), „najwyższa jakość”, „profesjonalna obsługa”, „wychodząc naprzeciw oczekiwaniom”.
- CTA mówi, co się stanie („Zadzwoń”, „Wyślij zapytanie”, „Zobacz stronę na żywo”), nie „Submit”/„Kliknij tutaj”. Ta sama nazwa akcji w całym przepływie (przycisk → komunikat sukcesu).
- Błędy formularza: konkretnie co i jak poprawić, bez przepraszania.
- Alt-y obrazów po polsku, opisowe (nie „obraz”, nie upychanie fraz).
- **Wszystkie teksty trzymaj w `src/data/site.ts`** (jedno źródło prawdy: dane firmy, treści sekcji, FAQ, linki) — łatwiejsze edycje i spójność NAP w całej stronie, JSON-LD i politykach.
- Samokontrola języka: po napisaniu treści wykonaj przegląd (kalki z angielskiego, interpunkcja, diakrytyki, spójność formy). Treści wskaż użytkownikowi do akceptacji w `[BRAMKA]` po Fazie 1.

---

## 13. SEO

**Techniczne (obowiązkowe)**
- `<html lang="pl">`, `<meta charset>`, viewport, jedna `<h1>`, poprawna hierarchia nagłówków, landmarki (`header/nav/main/section/footer`), skip link.
- `<title>` ≤ 60 znaków (fraza główna + marka), meta description ≤ 155 znaków, canonical zgodny z adresem finalnym, `og:locale=pl_PL`, Open Graph + Twitter Card, `og:image` 1200×630 (generowany, tekst czytelny po zmniejszeniu), `theme-color`.
- `@astrojs/sitemap`, `robots.txt` (zezwalaj na wszystko, wskaż sitemapę), `404` z `noindex`. Strony prawne indeksowalne, niski priorytet.
- Favicon: SVG + PNG 32 + apple-touch 180 + manifest.
- Jedna spójna forma URL (trailing slash), przekierowania 301 `www` ↔ apex i HTTP→HTTPS.
- Brak treści ukrytej za animacją; brak `display:none` dla treści ważnej dla SEO; obrazy z `alt`, wymiarami i `lazy` (poza LCP).
- `llms.txt` — opcjonalnie, tani dodatek (krótki opis marki i kluczowych podstron); nie traktuj jako czynnika rankingowego.

**Dane strukturalne (JSON-LD, walidowalny JSON)** — `WebSite` + `ProfessionalService` (nazwa, url, logo/obraz, telefon, e-mail, `areaServed` z `{{LOKALIZACJA_DZIALANIA}}`, `serviceType`, `sameAs`; adres tylko jeśli właściciel chce go publikować). **Zakaz** `aggregateRating`/`Review` bez prawdziwych, weryfikowalnych opinii. Szkic: załącznik C. W testach sprawdź, że JSON-LD się parsuje i pasuje do treści widocznej.

**Treść i słowa kluczowe**
- Zdefiniuj w `docs/SEO_PLAN.md` 1 frazę główną i 4–6 pobocznych z uwzględnieniem lokalizacji, np. „strony internetowe {{LOKALIZACJA_DZIALANIA}}”, „tworzenie stron www dla firm”, „strona wizytówka”. Używaj naturalnie w `<title>`, `<h1>`, nagłówkach H2, pierwszym akapicie, alt-ach, FAQ — bez upychania.
- One-page ma ograniczenia SEO — zapisz w `SEO_PLAN.md` rekomendację przyszłych podstron (np. osobne strony usług, blog) jako dalszy rozwój.
- Lokalne SEO (poza kodem, do `TODO_USER.md`): Google Business Profile, spójne dane NAP, Google Search Console + zgłoszenie sitemapy.

---

## 14. Dostępność (WCAG 2.2 AA jako standard jakości)

- Pełna obsługa klawiatury, widoczny `:focus-visible` (kontrast ≥ 3:1), logiczna kolejność, brak pułapek fokusu (menu mobilne zarządza fokusem).
- Kontrast tekstu sprawdzony **na realnym tle sceny** w kilku pozycjach scrolla (zrzuty), nie tylko na tokenach.
- Canvas dekoracyjny: `aria-hidden`. Linki/przyciski z czytelnymi etykietami. Brak `<div>`-przycisków.
- `prefers-reduced-motion` respektowane globalnie (sekcja 10). Brak migotania > 3 razy/s.
- Formularz: widoczne `<label>`, `autocomplete`, `inputmode`, komunikaty błędów powiązane `aria-describedby`, `aria-live` dla wyniku wysyłki.
- Dokument i zoom: poprawny układ przy 200% powiększenia i w orientacji poziomej na telefonie. Cele dotykowe ≥ 44 px.
- Publiczna „deklaracja dostępności” nie jest tu wymagana — nie publikuj jej na siłę; standard jest dla jakości, nie dla formalności.

---

## 15. Wydajność — budżety i cele

**Cele pomiarowe (Lighthouse mobile, domyślne throttlingi) — `[KRYTERIUM]`:**
- Dostępność **100**, Best Practices **≥ 95**, SEO **100**.
- Wydajność **≥ 90** z włączoną sceną WebGL i **≥ 95** w wariancie bez WebGL (Tier 0). Zgłoś oba wyniki uczciwie; nie manipuluj UA ani nie „oszukuj” testu.
- Core Web Vitals (lab): LCP ≤ 2,0 s, CLS ≤ 0,05, TBT ≤ 200 ms; INP ≤ 200 ms w pomiarach interakcji.

**Budżety transferu (gzip/brotli):**
- Zasoby krytyczne do pierwszego renderu (HTML + CSS + JS krytyczny): ≤ ~100 KB. Hero poster/obraz LCP ≤ ~120 KB.
- JS po inicjalizacji (GSAP + ScrollTrigger + SplitText + Lenis): zmierz i raportuj; `three` tree-shaken + kod sceny cel ≤ ~200 KB gzip, ładowany **leniwie**.
- Zasoby 3D/tekstury sceny łącznie ≤ ~1,5 MB (leniwie). Pamięć GPU tekstur ≤ ~40 MB.
- Zero zapytań do domen zewnętrznych poza Turnstile (jeśli użyty) — zweryfikuj w audycie.

**Techniki:** brotli (hosting), `Cache-Control: immutable` dla hashowanych zasobów, `preload` tylko LCP + font nagłówka, `fetchpriority`, brak blokujących skryptów, `content-visibility: auto` dla sekcji poniżej zakładki (ostrożnie z ScrollTrigger — testuj), brak layout thrashingu.

---

## 16. Prawo i prywatność (Polska/UE) — projekt do weryfikacji przez prawnika

Zasada nadrzędna: **dokumenty muszą opisywać to, co strona faktycznie robi.** Dlatego najpierw zrób audyt (Faza 7): jakie cookies/localStorage powstają, jakie zapytania idą na zewnątrz — dopiero potem finalizuj treść.

**Ustalenia wyjściowe (stan na listopad 2026, zweryfikuj):**
- Zapis i odczyt informacji na urządzeniu użytkownika (cookies, localStorage i podobne) reguluje **art. 399 ustawy Prawo komunikacji elektronicznej** (zastąpił art. 173 Prawa telekomunikacyjnego). Zgoda jest wymagana, poza technicznie niezbędnymi; samo „korzystając ze strony, akceptujesz” nie jest zgodą.
- Domyślne podejście tego projektu: **zero cookies i zero zapisu na urządzeniu poza niezbędnym** (fonty self-hosted, brak Google Analytics/Pixel/YouTube/Maps). Wtedy baner zgody nie jest potrzebny, ale **polityka cookies i informacja o tym** nadal są.
- Jeśli kiedykolwiek pojawi się nieistotny technicznie zapis (analityka z cookies, marketing, osadzenia) → wdrożyć własny, lekki mechanizm zgód: równorzędne przyciski „Akceptuj”/„Odrzuć”, granularność, brak dark patterns, brak ładowania skryptów przed zgodą, możliwość zmiany decyzji w stopce, i zaktualizować polityki.
- **Turnstile (Cloudflare)** i inne usługi anty-spamowe — sprawdź w DevTools, czy ustawiają coś na urządzeniu; opisz to dokładnie w polityce (albo zastosuj alternatywę: honeypot + limit + weryfikacja po stronie serwera).
- Nie używaj `localStorage`/`sessionStorage` do niczego, co nie jest ściśle niezbędne (np. „zapamiętaj, że widziałeś intro”).

**Dokumenty (strony):**

1. **Polityka prywatności** (`/polityka-prywatnosci/`) — wymagane elementy (zgodne z art. 13 RODO):
   - tożsamość i dane kontaktowe administratora (`{{OSOBA}}`/`{{MARKA}}`, adres, NIP, e-mail, telefon); informacja o braku wyznaczonego IOD, jeśli dotyczy;
   - cele, podstawy prawne i okresy przechowywania **osobno** dla: wiadomości z formularza/e-maila/telefonu (kontakt w sprawie oferty — zwykle art. 6 ust. 1 lit. b lub f), logów serwera hostingu (lit. f), ewentualnej analityki;
   - odbiorcy: hosting, dostawca poczty/formularza, usługa anty-spamowa; ewentualne przekazywanie poza EOG i zabezpieczenia;
   - prawa osoby (dostęp, sprostowanie, usunięcie, ograniczenie, sprzeciw, przenoszenie, cofnięcie zgody) i sposób ich realizacji;
   - prawo skargi do Prezesa UODO;
   - informacja o dobrowolności podania danych i skutkach niepodania;
   - brak zautomatyzowanego podejmowania decyzji/profilowania (jeśli prawda);
   - data ostatniej aktualizacji.
2. **Polityka cookies** (`/polityka-cookies/`) — oparta na audycie: lista faktycznych cookies/zapisów (nazwa, cel, czas, dostawca) **albo** jasna informacja, że strona nie używa cookies innych niż niezbędne; jak zarządzać cookies w przeglądarce; podstawa prawna (art. 399 PKE).
3. **Klauzula informacyjna przy formularzu** — krótka, pod przyciskiem: kto jest administratorem, w jakim celu przetwarzane są dane, link do polityki. **Bez** wstępnie zaznaczonych zgód. Zgoda marketingowa (newslettery) — nie wprowadzamy.
4. **Dane usługodawcy w stopce** — nazwa, adres, NIP, e-mail, telefon (informacje o usługodawcy).
5. **Regulamin** — nie jest potrzebny (brak sprzedaży online/konta użytkownika); nie twórz na wyrost.

W `docs/LEGAL_DRAFT_NOTES.md` zapisz: jakie założenia przyjęto, jakie usługi zewnętrzne wystąpiły, co prawnik powinien zweryfikować. **Na samej stronie nie umieszczaj adnotacji „projekt/AI”** — to wiadomość do właściciela, nie do odwiedzających.

---

## 17. Formularz, bezpieczeństwo, hosting

**Formularz kontaktowy**
- Pola: imię, e-mail lub telefon (min. jedno wymagane), rodzaj strony (select, opcjonalnie), opis (textarea), klauzula informacyjna. Walidacja po stronie klienta **i** serwera.
- Backend: `functions/api/contact.ts` (Cloudflare Pages Function) → wysyłka e-maila przez dostawcę z regionem UE (np. Resend) na `{{EMAIL}}`. Sekrety wyłącznie w zmiennych środowiskowych, **nigdy w repo**.
- Antyspam: honeypot + limit żądań + (opcjonalnie) Turnstile. Ochrona przed podwójnym wysłaniem. Stany: ładowanie / sukces / błąd, z `aria-live`.
- Zawsze dostępna alternatywa bez JS: `mailto:` i `tel:`.
- Nie zapisuj danych z formularza w bazie; wiadomość trafia na e-mail i tyle.

**Nagłówki bezpieczeństwa (`public/_headers`)** — HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (wyłącz zbędne API), `frame-ancestors 'none'` (przez CSP), **CSP**:
- `default-src 'self'`; `script-src 'self'` (+ domena Turnstile jeśli użyty; sprawdź w docs Astro, czy aktualna wersja ma wbudowaną obsługę CSP z hashami); `style-src 'self' 'unsafe-inline'` tylko jeśli Astro tego wymaga; `img-src 'self' data:`; `font-src 'self'`; `connect-src 'self'`; `worker-src blob:` tylko gdy potrzebne.
- Przetestuj w przeglądarce: **zero naruszeń CSP w konsoli**.
- Cache: `public, max-age=31536000, immutable` dla hashowanych zasobów; krótszy dla HTML.

**Deploy:** `docs/DEPLOY.md` — kroki dla Cloudflare Pages (build `npm run build`, katalog `dist`, zmienne środowiskowe, domena, przekierowania, DNS, HTTPS), plus kroki po wdrożeniu (Search Console, sitemapa, Rich Results Test).

---

## 18. Fazy realizacji

Po każdej fazie: commit, wpis w `PROGRESS.md`, raport (R-10).

### Faza 0 — Rozpoznanie i brief
1. Przeczytaj cały dokument. Sprawdź dostępność skilli i narzędzi (sekcja 6), wersje (`node -v`, `npm view astro version`, `gsap`, `lenis`, `three`).
2. Przeczytaj aktualne docs: Astro (upgrade guide do 7), integracja Lenis + ScrollTrigger, SplitText, Three.js (importy modułowe).
3. **Audyt case study:** otwórz `https://koparkapawlowski.pl/` w Playwright; zapisz zrzuty (desktop 1440×900 i mobile 390×844, pełna strona i hero), zbierz: strukturę podstron, sekcje, tytuł/description/canonical/OG, dane strukturalne (jeśli są), liczbę zasobów, wyniki Lighthouse mobile i desktop. Zanotuj **obserwacje o spójności adresów** (np. czy canonical zgadza się z faktycznym adresem `www`/apex) — wpisz je do `BRIEF.md` jako uwagę dla właściciela.
4. Zapisz `docs/BRIEF.md` (zmienne, decyzje, fakty z audytu).
5. `[BRAMKA G0]` — wyślij jedną zbiorczą wiadomość z brakującymi zmiennymi krytycznymi (sekcja 3). Dalej po odpowiedzi.

`[KRYTERIUM]` BRIEF.md kompletny; zrzuty case study zapisane w `public/media/`; lista placeholderów w `TODO_USER.md`.

### Faza 1 — Plan designu i treści
1. `docs/DESIGN_PLAN.md`: tokeny (paleta 4–6 nazwanych hexów + kontrasty), typografia (2 fonty, test polskich znaków), koncepcja układu (2–3 warianty hero, ASCII wireframe desktop+mobile dla wszystkich sekcji), **storyboard sceny** (stan każdego aktu: kamera, światło, gęstość cząsteczek, `uGrade`), **motion spec** (tabela: element, wyzwalacz, czas, easing, fallback).
2. **Autokrytyka:** porównaj plan z listą z sekcji 8.5. Jeśli jakaś część wygląda jak domyślny wybór dla każdej podobnej strony — popraw i napisz, co zmieniłeś i dlaczego.
3. **Talia treści (copy deck)** po polsku dla wszystkich sekcji, FAQ, meta/OG, mikrotekstów formularza — w `site.ts`.
4. `[BRAMKA G1]` — pokaż użytkownikowi streszczenie planu designu + treści do akceptacji.

`[KRYTERIUM]` zatwierdzony plan i treści.

### Faza 2 — Szkielet projektu
`npm create astro@latest` (szablon minimalny, TS strict), `git init`, konfiguracja (7.3), tokeny CSS, `Base.astro` z `SeoHead`, fonty self-hosted, skrypt `check-placeholders`, `prettier`, `docs/DEPENDENCIES.md`. Build czysty.

`[KRYTERIUM]` `npm run build` i `astro check` bez błędów; pusta strona z poprawnym `<head>`.

### Faza 3 — Warstwa statyczna (HTML/CSS, bez ruchu)
Wszystkie sekcje, nagłówek, stopka, strony prawne (wstępne), 404, responsywność, fluidowa typografia, `typo()`. Strona ma wyglądać dobrze i być w pełni użyteczna **bez JS**.

`[KRYTERIUM]` zrzuty na 360/390/768/1024/1280/1440/1920 bez poziomego scrolla; axe bez błędów krytycznych; Lighthouse SEO 100 na tym etapie.

### Faza 4 — Warstwa ruchu
Lenis + GSAP (załącznik A), orkiestrowane wejście hero, reveals nagłówków, sekcje sterowane scrollem, pin procesu, menu mobilne, mikrointerakcje, `prefers-reduced-motion`, awaryjny timeout odsłaniania.

`[KRYTERIUM]` brak przeskoków scrolla, kotwice działają, reduced-motion wyłącza ruch, brak CLS przy animacjach, brak błędów w konsoli.

### Faza 5 — Warstwa WebGL
`tier.ts`, `scene.ts`, akty, siatka blueprint (shader), cząsteczki, mockupy z teksturami case study, powiązanie ze scrollem, adaptacja jakości, obsługa utraty kontekstu, crossfade z fallbacku.

`[KRYTERIUM]` scena działa w tierach 0/1/2 (testy z wymuszeniem tieru przez parametr w trybie QA); budżety z 11.3 spełnione; kontrast tekstu na tle sceny OK; Lighthouse zgodnie z sekcją 15.

`[BRAMKA G2]` — pokaż użytkownikowi zrzuty kluczowych momentów scrolla (hero, proces, case study, kontakt) i wyniki pomiarów. Dalej po akceptacji kierunku wizualnego.

### Faza 6 — Formularz, nagłówki, deploy
Formularz + Function, honeypot/Turnstile, nagłówki i CSP, `_redirects`, `DEPLOY.md`.

`[KRYTERIUM]` wysyłka testowa dochodzi na e-mail; zero naruszeń CSP; zero zapytań do domen zewnętrznych poza zadeklarowanymi.

### Faza 7 — SEO i prawo (finalizacja)
JSON-LD, sitemap, robots, OG-image, favicon/manifest; **audyt cookies/storage/requestów** (`scripts/qa/storage-audit.mjs`); finalne polityki dopasowane do audytu; `LEGAL_DRAFT_NOTES.md`; `SEO_PLAN.md`.

`[KRYTERIUM]` JSON-LD poprawny; polityki zgodne z audytem; sitemap i robots poprawne; brak placeholderów (`check-placeholders` przechodzi).

### Faza 8 — QA i szlif
Pełna macierz z sekcji 19, poprawki, przegląd „Impeccable” + mikrointerakcje, ostatnia autokrytyka względem 8.5.

`[KRYTERIUM]` wszystkie punkty QA zaliczone lub jawnie opisane w `QA_REPORT.md` z uzasadnieniem.

### Faza 9 — Przekazanie
`README.md` (uruchomienie, struktura, jak edytować treści w `site.ts`), `DEPLOY.md`, `TODO_USER.md` (m.in. weryfikacja prawnika, Google Business Profile, Search Console, DNS), `QA_REPORT.md` z liczbami, raport końcowy. Opcjonalnie R-13.

`[KRYTERIUM]` świeży klon → `npm ci && npm run build && npm run preview` działa; raport końcowy kompletny.

---

## 19. QA — macierz i lista kontrolna

**Automaty (skrypty w `scripts/qa/`):**
- **Zrzuty (Playwright):** viewporty 360×800, 390×844, 768×1024, 1280×800, 1440×900, 1920×1080; pozycje scrolla 0 / 12,5 / 25 / … / 100%; warianty: normalny, `reducedMotion: 'reduce'`, JS wyłączony, wymuszony Tier 0/1/2 (flaga QA). Zrzuty obejrzyj i opisz usterki (nakładanie, ucięcia, kontrast).
- **axe-core:** 0 naruszeń poziomu serious/critical.
- **Lighthouse:** mobile + desktop, wyniki w `QA_REPORT.md`, porównanie z celami (sekcja 15).
- **Audyt zapisu i sieci:** lista cookies/localStorage/sessionStorage/IndexedDB + wszystkie żądania sieciowe i ich domeny.
- **Konsola:** zero błędów i ostrzeżeń (w tym deprecjacje Three.js, naruszenia CSP).
- **Linki:** brak martwych (wewnętrznych i zewnętrznych), kotwice działają.
- **Czasy klatek:** pomiar czasów klatek podczas skryptowego scrolla. **Uwaga:** headless Chromium bez GPU używa renderingu programowego (SwiftShader) — wyniki FPS nie odzwierciedlają realnych urządzeń. Raportuj to wprost i poproś użytkownika o test na prawdziwych telefonie i laptopie.

**Ręcznie/przeglądowo:**
- Klawiatura: Tab przechodzi całą stronę, fokus widoczny, menu mobilne i formularz obsługiwalne.
- Zoom 200%, orientacja pozioma telefonu, ultrawide.
- Polska typografia: brak sierotek („i”, „w”, „z” na końcu wiersza), poprawne cudzysłowy, diakrytyki.
- Safari iOS: wysokości (`svh/lvh`), autoplay, performance; Firefox: WebGL.
- Wydruk strony (podstawowy `@media print`: czytelna treść, bez canvasu).
- Porównanie z listą 8.5 — „czy to wygląda jak szablon?”.

---

## 20. Formaty raportów

**Raport fazy (≤ 15 linii):**
```
Faza N — <nazwa> — STATUS: gotowe / częściowo / zablokowane
Zrobione: ...
Dowody: <komendy + wyniki / liczby / ścieżki zrzutów>
Problemy i decyzje: ...
Do uzupełnienia przez Ciebie: ...
Następny krok: ...
```

**Raport końcowy:** adres podglądu/komendy uruchomienia, tabela wyników Lighthouse (mobile/desktop, z i bez WebGL), status budżetów, lista rzeczy do weryfikacji przez prawnika, lista `TODO_USER`, znane ograniczenia (m.in. brak testów na realnych urządzeniach, jeśli nie wykonano), rekomendowane następne kroki (dodatkowe podstrony SEO, kolejne realizacje, GBP).

---

## 21. Lista „nigdy”

- Nie wymyślaj faktów, klientów, opinii, liczb.
- Nie kopiuj cudzych zasobów, układów, tekstów, kodu z inspiracji.
- Nie ładuj niczego z CDN w runtime; nie używaj Google Fonts z serwera Google.
- Nie ukrywaj treści za animacją; nie blokuj natywnego scrolla.
- Nie dodawaj preloadera, autoplay z dźwiękiem, ani modalnych wyskoczków.
- Nie ustawiaj `outline: none` bez zamiennika; nie ukrywaj natywnego kursora w polach tekstowych.
- Nie commituj sekretów, tokenów ani `.env`.
- Nie publikuj adnotacji roboczych („TODO”, „projekt”, „lorem ipsum”) na produkcji (pilnuje `check-placeholders`).
- Nie deklaruj sukcesu bez dowodu.

---

## Załączniki

### A. Lenis + GSAP ScrollTrigger (wzorzec — zweryfikuj z aktualnym README Lenis)

```ts
// src/scripts/motion/smooth-scroll.ts
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initSmoothScroll(tier: 0 | 1 | 2) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || tier === 0) return null;

  const lenis = new Lenis({ lerp: 0.1 }); // autoRaf domyślnie wyłączony — napędza go gsap.ticker

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000)); // GSAP: sekundy -> Lenis: milisekundy
  gsap.ticker.lagSmoothing(0);

  return lenis;
}
```

Render sceny dopinasz do **tej samej** pętli: `gsap.ticker.add(renderScene)`.

### B. Wykrywanie tieru (szkic)

```ts
// src/scripts/webgl/tier.ts
export type Tier = 0 | 1 | 2;

export function detectTier(): Tier {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = !!(navigator as any).connection?.saveData;
  if (reduce || saveData) return 0;

  const probe = document.createElement('canvas');
  const gl2 = probe.getContext('webgl2');
  if (!gl2) return 0;

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as any).deviceMemory ?? 4; // brak w Safari/Firefox
  const coarse = matchMedia('(pointer: coarse)').matches;

  if (cores <= 2 || memory <= 2) return 1;
  if (coarse && (cores <= 4 || memory <= 4)) return 1;
  return 2;
}
```
Dalej: pomiar ~90 klatek i automatyczne zejście o tier (sekcja 11.3); po zejściu do Tier 0 zwolnij kontekst (`renderer.dispose()`, `forceContextLoss()`) i pokaż fallback.

### C. JSON-LD (szkic)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://{{DOMENA}}/#website",
      "url": "https://{{DOMENA}}/",
      "name": "{{MARKA}}",
      "inLanguage": "pl-PL"
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://{{DOMENA}}/#organization",
      "name": "{{MARKA}}",
      "url": "https://{{DOMENA}}/",
      "image": "https://{{DOMENA}}/og/og-default.jpg",
      "telephone": "{{TELEFON}}",
      "email": "{{EMAIL}}",
      "serviceType": "Tworzenie stron internetowych",
      "areaServed": "{{LOKALIZACJA_DZIALANIA}}",
      "sameAs": []
    }
  ]
}
```
Adres (`address`) dodaj wyłącznie, jeśli właściciel zdecyduje się go publikować. Żadnych ocen ani opinii bez prawdziwych źródeł.

### D. Szkielet `check-placeholders.mjs` (idea)

Skrypt przechodzi po `dist/**/*.{html,xml,txt,json}` i kończy się kodem ≠ 0, jeśli znajdzie `TODO_`, `{{`, `lorem ipsum` lub `example.com`. Uruchamiany w `npm run build` (po `astro build`) oraz w CI.

---

**Start:** zacznij od Fazy 0. Nie pisz kodu strony, dopóki nie przejdziesz `[BRAMKI G0]` i `[BRAMKI G1]`.
