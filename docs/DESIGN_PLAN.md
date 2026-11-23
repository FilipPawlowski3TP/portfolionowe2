# DESIGN_PLAN — Portfolio studia webowego (Faza 1)

**Data:** 2026-11-06 · **Źródło prawdy:** MASTERPROMPT sekcje 8–10 · **Ustalenia G0:** `docs/BRIEF.md`, `docs/TODO_USER.md`

## 0. Decyzje z G0 wpływające na design

- **Brak telefonu w publicznych danych** → CTA „Zadzwoń” znika; główną akcją jest **„Napisz”** (formularz + e-mail). Konwersja: (1) Napisz, (2) wyślij formularz, (3) przewiń do realizacji.
- **Brak danych firmowych (NIP/adres/forma prawna)** → stopka: marka + imię i nazwisko + e-mail + linki do polityk. Polityki opisują osobę fizyczną (do weryfikacji prawnika).
- **Marka: „Pawłowski Studio”** (decyzja G1, 2026-11-06). Wordmark do zaprojektowania (logo brak).
- **Obszar:** cała Polska, z wzmocnieniem lokalnym Wrocław (słowa kluczowe: „strony internetowe” + Wrocław).
- **Zakres usług:** strony na zamówienie (wizytówka / firmowa wielostronicowa / landing / opieka po wdrożeniu — potwierdzone G1), bez odświeżania istniejących stron.
- **Case study:** Koparki Pawłowski w pełnej formule (link „na żywo”), fakty wyłącznie z audytu `docs/BRIEF.md` sekcja 5.

## 1. Tokeny

### 1.1. Paleta (kontrasty policzone, WCAG AA — tekst ≥ 4,5:1)

| Token | Hex | Rola | Kontrast do tła bazowego |
|---|---|---|---|
| `--c-night-950` | `#070B18` | tło bazowe (noc) | — |
| `--c-night-900` | `#0B1226` | tło sekcji / karty | — |
| `--c-night-700` | `#18223D` | powierzchnie, linie mocne | — |
| `--c-dawn-400` | `#FF8A5B` | akcent ciepły: CTA, świt (`uGrade`) | 8,45:1 na tle — AA ✓ |
| `--c-dawn-200` | `#FFC9A3` | ciepły jasny (detale świtu, hover) | 13,21:1 ✓ |
| `--c-ice-300` | `#8FD3FF` | akcent chłodny: linie blueprint, fokus | 12,08:1 ✓ |
| `--c-ink-100` | `#F2F0EA` | tekst podstawowy | 17,22:1 ✓ |
| `--c-ink-300` | `#A9B1C6` | tekst drugorzędny | 9,15:1 ✓ |

**Reguła kontrastu przycisków:** `--c-dawn-400` TŁO → tekst `--c-night-950` (8,45:1). Biały tekst na `#FF8A5B` = 2,04:1 — **zakazany**. Przycisk secondary: kontur `--c-ink-300`, tekst `--c-ink-100`.
Zasada z 8.2 utrzymana: dwa akcenty o rozdzielonych rolach (ciepły = akcja/świt, chłodny = struktura/blueprint). Uzasadnienie narracyjne palety: „noc → świt” — ciemne granaty nocy rozjaśniają się do ciepłego bursztynu świtu w Akcie VII.

### 1.2. Tokeny dodatkowe

- **Odstępy** (skala 4 px): `--sp-1: 0.25rem … --sp-16: 4rem`, sekcje pionowo `clamp(4rem, 10vh, 8rem)`.
- **Promień:** jeden — `--radius: 2px` (charakter „techniczny”, nie miękki SaaS; przyciski i karty prostokątne z subtelnym 2 px).
- **Linie:** `--line: 1px solid color-mix(in oklab, var(--c-ice-300) 22%, transparent)`.
- **Kontener:** `--w-content: 72rem`, `--w-text: 40rem` (linia < 75 znaków).
- **Scrimy pod tekstem nad sceną:** `linear-gradient(...)` z `--c-night-950`, bez `backdrop-filter` na dużych powierzchniach.

### 1.3. Tokeny ruchu (`tokens.css` + odpowiedniki GSAP)

| Token CSS | Wartość | GSAP |
|---|---|---|
| `--e-out` | `cubic-bezier(.22,1,.36,1)` | `power3.out` |
| `--e-expo` | `cubic-bezier(.16,1,.3,1)` | `expo.out` |
| `--e-inout` | `cubic-bezier(.65,0,.35,1)` | `power2.inOut` |
| `--d-fast / --d-base / --d-slow / --d-scene` | 150 / 300 / 600 / 1200 ms | — |

## 2. Typografia

- **Display: Bricolage Grotesque** (variable, wght 200–800) — grotesk z charakterem (nieregularne detale, ciasny interlinia w dużych rozmiarach); nie jest domyślnym wyborem stron generowanych (Inter/Sora/Manrope), dobrze znosi kinowe nagłówki.
- **Tekst: Instrument Sans** (variable, wght 400–700) — neutralny, czytelny, wysoki x-height; wspiera `text-wrap: pretty`.
- Odrzucone: Unbounded (zbyt „gamingowy” dla pana Kowalskiego), Syne (słaba czytelność w tekście), Figtree (bardzo popularny na stronach AI), Albert Sans (bez wyrazu), Onest (zbyt podobny do Instrument Sans) — **Onest zostaje jako plan B**, gdyby Instrument Sans wypadł źle w teście.
- **Rozmiary plików (fontsource variable):** Bricolage latin 41,3 KB + latin-ext 18,7 KB; Instrument Sans latin 30 KB + latin-ext 11,1 KB → łącznie **~101 KB**. Cel ≤ 60 KB osiągniemy w Fazie 2 subsetem (`pyftsubset`, scalenie latin+latin-ext w 1 plik na krój) — fallback: 4 pliki i raport z odchyleniem budżetu.
- **Polskie znaki:** wszystkie kandydatki mają subset `latin-ext` (potwierdzone w plikach `@fontsource-variable/*/files/*latin-ext*.woff2`); render testu „Zażółć gęślą jaźń. ĄĆĘŁŃÓŚŹŻ” → `docs/audit/font-test.png`. **Wynik weryfikacji wizualnej (2026-11-06): ZALICZONY** — Bricolage Grotesque i Instrument Sans (oraz Onest) renderują pełen zestaw diakrytyków bez tofu i podmian glifów; cudzysłowy „…” i pauzy poprawne; trzy widocznie różne kroje potwierdzają wczytanie webfontów (nie fallback). Zrzut: `docs/audit/font-test.png`.
- **Skala płynna:** `--fs-hero: clamp(2.6rem, 1.2rem + 6vw, 6.5rem)`; H2 `clamp(2rem, 1.2rem + 3vw, 3.5rem)`; tekst `clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)`.
- `text-wrap: balance` w nagłówkach, `text-wrap: pretty` w akapitach, `hyphens: auto` w dłuższym tekście (`lang="pl"`).
- Preload: wyłącznie font display użyty w hero (po subsecie). `font-display: swap`.
- **Polska typografia:** `utils/typo.ts` + komponent `<T>` — spacje nierozdzielne po jednoliterowych przyimkach/spójnikach (i, o, u, w, z, a), przed „zł”, „t”, jednostkami; cudzysłowy „…”. Teksty w `site.ts` trzymamy czytelne (zwykłe spacje), `typo()` stosuje NBSP przy renderze.

## 3. Koncepcja układu hero — 3 warianty

**Wariant A — „Siatka i zdanie”:** H1 w lewej kolumnie, prawa połowa to czysta scena (siatka blueprint + pył). Nadtytuł techniczny nad H1, CTA pod nim. Zalety: czytelność, dużo sceny. Ryzyko: bezpieczny, „landing z hero po lewej”.

**Wariant B — „Środek kinowy”:** wielkie H1 na środku ekranu, scena pełnoekranowa z scrimem, CTA pod tekstem. Ryzyko: **wygląda jak domyślne hero każdej kinowej strony** (punkt 8.5) — odradzam.

**Wariant C — „Tytułówka rysunku” (REKOMENDACJA):** hero zaprojektowane jak arkusz rysunku technicznego: cienka ramka blueprint z metadanymi w rogach (PROJEKT / SKALA / ROK), H1 wewnątrz ramki po lewej, pod nim **linia wymiarowa** z opisem („5 sekund — tyle masz, żeby klient zrozumiał, co robisz”), scena 3D za ramką. Spójny z motywem „blueprint” i z estetyką case study, ale to inna kompozycja niż strona klienta (tam schemat wykopu po prawej, tu cały hero jako arkusz). Wyróżnik vs. generyczne strony = silny.

**Decyzja:** wariant C z układem tekstu z A (lewa kolumna). Mobile: ramka zostaje, metadane w rogach maleją do 2 pól, linia wymiarowa pionowa po prawej stronie H1.

## 4. ASCII wireframe — desktop (1280+)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ⬒ KRESKA STUDIO      Oferta  Proces  Realizacje  FAQ          [ NAPISZ ]     │ ← sticky, blur scrim
├──────────────────────────────────────────────────────────────────────────────┤
│ ┌─ PROJEKT: STRONA, KTÓRA PRACUJE ────────── SKALA 1:1 ─────── ROK 2026 ─┐  │
│ │                                                                        │  │
│ │  Strony internetowe,                                                    │  │ ← H1 (Bricolage, ~64–104 px)
│ │  po których klienci do Ciebie piszą                                     │  │
│ │  ├──────────── 5 sekund na pierwsze wrażenie ─────────────┤             │  │ ← linia wymiarowa (SVG)
│ │                                                                        │  │
│ │  Projektuję i buduję strony dla małych firm i usługodawców.            │  │ ← lead (Instrument Sans)
│ │  Bez szablonów i technicznego żargonu — za to szybkie i czytelne.       │  │
│ │  [ NAPISZ DO MNIA ]   [ ZOBACZ REALIZACJĘ → ]                          │  │
│ │                                                                        │  │
│ │                 ·  ·        ·   (scena: siatka blueprint, pył)   ·     │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────────────────────┤
│ CO DLA CIEBIE ZROBIĘ                                            [OFERTA]    │
│ ┌────────────────────────────────────┐ ┌───────────────┐ ┌───────────────┐  │
│ │  STRONA FIRMOWA                    │ │ WIZYTÓWKA     │ │ LANDING PAGE  │  │ ← karta wiodąca 2× szersza
│ │  (wielostronicowa)                 │ │ (one-page)    │ │ (kampania)    │  │
│ │  Kilka podstron, osobne strony     │ │ Wszystko na   │ │ Jedna strona, │  │
│ │  usług, miejsce na SEO lokalne…    │ │ jednej stronie│ │ jedno działanie│ │
│ │  [ Porozmawiajmy ]                 │ └───────────────┘ └───────────────┘  │
│ └────────────────────────────────────┘                                       │
│   Wycena indywidualna po krótkiej rozmowie.                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│ JAK WYGLĄDA WSPÓŁPRACA                                          [PROCES]    │
│  ① Rozmowa ──→ ② Projekt i akceptacja ──→ ③ Budowa ──→ ④ Start i opieka    │ ← pin ≤ 3 vh (desktop)
│  (kamera przelatuje przez 4 bramy; kroki odsłanianye na scenie)              │
│  Pod każdym: co robię / czego potrzebuję od Ciebie                           │
├──────────────────────────────────────────────────────────────────────────────┤
│ REALIZACJA — KOPARKI PAWŁOWSKI                                  [PREMIERA]  │
│ ┌────────────────────────────────────────┐  Problem → co zrobiono → efekt   │
│ │   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄  (laptop 3D) │  „Wydajność 100/100 w Lighthouse │
│ │   █ zrzut strony na żywo █             │   mobile i desktop…”             │
│ │   ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀              │  [ ZOBACZ STRONĘ NA ŻYWO ↗ ]     │
│ │        ▄▄▄▄▄▄▄▄  (telefon 3D)          │  Kolejne realizacje wkrótce.     │
│ └────────────────────────────────────────┘                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│ CO DOSTAJESZ W KAŻDEJ STRONIE                                  [STANDARD]   │
│  Szybkość   ·   Telefon przede wszystkim   ·   Widoczność w Google   ·   …   │ ← 4 przewagi, spokojnie
├──────────────────────────────────────────────────────────────────────────────┤
│ NAJCZĘSTSZE PYTANIA                                                [FAQ]    │
│  ▸ Ile kosztuje zrobienie strony?                                            │ ← details/summary
│  ▸ Ile trwa realizacja?                                                      │
│  ▸ … (7 pytań)                                                               │
├──────────────────────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────────────────────────┐  │
│ │  ZRÓBMY PIERWSZY KROK                                (świt, uGrade 1) │  │
│ │  Opisz krótko firmę i czego potrzebujesz.                              │  │
│ │  [formularz: imię | e-mail | select | opis]        filip.pawlowski71@… │  │
│ │  [ WYŚLIJ ZAPYTANIE ]   klauzula informacyjna                          │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│  ⬒ KRESKA STUDIO · Filip Pawłowski · e-mail · Polityka prywatności · © 2026 │ ← stopka
└──────────────────────────────────────────────────────────────────────────────┘
```

## 5. ASCII wireframe — mobile (360–390)

```
┌────────────────────────────┐
│ ⬒ KRESKA          [ ☰ ]    │ ← hamburger: aria-expanded, inert na reszcie
├────────────────────────────┤
│ ┌─ PROJEKT ───── ROK 2026 ┐│
│ │                          ││
│ │ Strony internetowe,      ││ ← H1 clamp ~2,6–3,2 rem
│ │ po których klienci       ││
│ │ do Ciebie piszą          ││
│ │                          ││
│ │ Projektuję i buduję…     ││
│ │ [ NAPISZ DO MNIA ]       ││ ← CTA full-width, min. 44 px
│ │ [ ZOBACZ REALIZACJĘ ]    ││
│ │      · · (scena) · ·     ││ ← scena pod tekstem (krótszy kadr)
│ └──────────────────────────┘│
├────────────────────────────┤
│ CO DLA CIEBIE ZROBIĘ       │
│ ┌──────────────────────────┐│
│ │ STRONA FIRMOWA (wiodąca) ││ ← karty pionowo, wiodąca pierwsza
│ └──────────────────────────┘│
│ ┌─────────┐ ┌─────────────┐ │
│ │WIZYTÓWKA│ │LANDING PAGE │ │ ← 2 mniejsze
│ └─────────┘ └─────────────┘ │
├────────────────────────────┤
│ JAK WYGLĄDA WSPÓŁPRACA     │
│ ① Rozmowa                  │ ← bez pinu na mobile (lub ≤1 vh)
│   co robię / czego trzeba  │
│ ② Projekt i akceptacja     │
│ ③ Budowa                   │
│ ④ Start i opieka           │
├────────────────────────────┤
│ REALIZACJA                 │
│ ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄           │
│ █ zrzut: laptop/telefon █  │ ← mockupy w ramkach CSS (fallback)
│ ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀           │
│ Problem / co zrobiono /    │
│ efekt                      │
│ [ ZOBACZ STRONĘ NA ŻYWO ]  │
├────────────────────────────┤
│ CO DOSTAJESZ… (4 bloki)    │
├────────────────────────────┤
│ FAQ ▸ ▸ ▸ (7 pytań)        │
├────────────────────────────┤
│ ZRÓBMY PIERWSZY KROK       │
│ [ formularz ]              │
│ e-mail (duży, klikalny)    │
├────────────────────────────┤
│ ⬒ KRESKA · e-mail ·        │
│ Polityki · © 2026          │
└────────────────────────────┘
```

Breakpointy testowe: 360, 390, 768, 1024, 1280, 1440, 1920. Długość scrolla: desktop ~7–9 vh, mobile ~9–11 vh (krótsze sekcje, karty pionowo).

## 6. Storyboard sceny WebGL (stan każdego aktu)

Wspólna: jeden canvas fixed, `sceneState = { progress, act, grade, pointer }`; kolor „noc → świt” = uniform `uGrade` 0→1; render z pętli `gsap.ticker`.

| Akt | Sekcja | Kamera | Światło / kolor (`uGrade`) | Cząsteczki | Uwagi |
|---|---|---|---|---|---|
| I | Hero | wysoko, lekko pochylona, rytmiczna siatka w perspektywie | noc, `uGrade 0.00–0.08`, granat + ledwie ciepły poblask | ~2500 (T2 desktop), dryf w górę | paralaks od wskaźnika (T2); linie siatki „rysują się” na wejściu |
| II | Oferta | opada bliżej siatki, delikatny pitch | `0.08–0.20`, pierwsze ciepło na horyzoncie | ~2200, wolniej | panele wireframe „wypełniają się” materiałem przy wejściu kart |
| III | Proces | przelot przez 4 „bramy” po krzywej CatmullRom (scrub) | `0.20–0.45`, przejście zimne → neutralne | ~1800, strumień wzdłuż drogi | pin ≤ 3 vh desktop; mobile bez pinu |
| IV | Realizacje | stabilna, lekki obrót; mockupy (laptop + telefon, `RoundedBoxGeometry`) w centrum | `0.45–0.62`, światło boczne, tekstury ze zrzutów | ~1200, cicho | tekstury: własne zrzuty (webp, `SRGBColorSpace`), przechył od scrolla + wskaźnika |
| V | Standard | powolny odjazd, mockupy poza kadrem | `0.62–0.75`, cieplej | ~800, zwalniają | scena „uspokaja się” |
| VI | FAQ | prawie statyczna | `0.75–0.88` | ~600, ambient | render na żądanie |
| VII | Kontakt | horyzont, wschód słońca (ciepły punkt świetlny) | `0.88–1.00`, świt: `--c-dawn-400`/`--c-dawn-200` | ~400, niemal nieruchome | stan końcowy = pierwsza klatka fallbacku CSS dla Tier 0 |

**Fallback Tier 0/1:** statyczny gradient CSS odpowiadający klatkom aktów + SVG blueprint; sekcja IV bez mockupów 3D — te same zrzuty w ramkach CSS.

## 7. Motion spec

| Element | Wyzwalacz | Czas | Easing | Fallback / uwagi |
|---|---|---|---|---|
| Sekwencja wejścia hero (scena z czerni → linie → H1) | `load` + pierwszy render, start ≤ 100 ms | ≤ 1,2 s łącznie | `expo.out` | bez JS: H1 widoczny od razu; LCP nie czeka na JS/WebGL |
| H1 — odsłonięcie maską linii | po sekwencji wejścia | 0,9 s | `expo.out` | SplitText `autoSplit`, `mask: 'lines'`, `aria: 'auto'`; reduced-motion: brak |
| Nagłówki H2 sekcji | wejście w viewport (ScrollTrigger) | 0,6 s | `power3.out` | tylko kluczowe nagłówki; akapity: prosty fade 0,3 s |
| Karty oferty (stagger) | wejście sekcji | 0,6 s + stagger 0,08 | `power3.out` | reduced-motion: bez staggeru |
| Proces — pin + przejście przez bramy | scrub przez sekcję | proporcjonalnie do scrolla | `power2.inOut` wewnątrz scrub | mobile: bez pinu; Tier 0: pionowa lista |
| Mockupy w Realizacjach | scrub + pointer (T2) | ciągły lerp 0,08 | linear (lerp) | Tier 0/1: statyczne zrzuty w ramkach |
| Hover kart / linków | `:hover` (pointer: fine) | 150 ms | `--e-out` | dotyk: `:active` |
| Menu mobilne | klik / Esc | 300 ms | `--e-inout` | `aria-expanded`, `inert` na stronie, Lenis `stop()` |
| Kotwice (`lenis.scrollTo`) | klik w nawigacji | ~0,8 s | wg Lenis | offset: `-headerHeight`; `scroll-padding-top` w CSS; fokus na nagłówek sekcji |
| Formularz — stany | submit | — | — | `aria-live`; sukces/błąd bez przesunięć layoutu (CLS 0) |
| Przejście legal ↔ home | nawigacja | CSS | `@view-transition { navigation: auto; }` | progressive enhancement |
| Pauza sceny | `document.hidden`, brak ruchu 1,5 s | — | — | 60 FPS → ambient 30 FPS → stop |

Reduced motion (globalnie): Lenis wyłączony, brak pinów/parallaxu, sceny statyczne (Tier 0), przejścia ≤ 150 ms (sam fade), SplitText bez maski.

## 8. Autokrytyka względem listy 8.5 („znaki rozpoznawcze stron generowanych”)

| Znak | Nasza odpowiedź |
|---|---|
| Kremowe tło + szeryf + terakota | Nie — ciemny motyw „noc → świt”, brak szeryfów; paleta uzasadniona narracją |
| Czarne tło + „acid” akcent | Nie — akcent ciepły, wyprowadzony ze świtu (`uGrade`), nie neon; sprawdzone kontrasty |
| Siatka identycznych kart z tym samym cieniem | Nie — karta wiodąca oferty 2× szersza, proces jako sekwencja bram (nie karty), zero cieni (linie 1 px) |
| Gradientowe plamy jako ozdoba | Nie — ozdobniki to siatka blueprint, linie wymiarowe i cząsteczki (narracja rzemiosła) |
| Rozstrzelone WIELKIE LITERY nad każdym nagłówkiem | Nie — nadtytuły tylko w hero (metryki rysunku) i jako etykiety aktów w narracji sceny; bez łańcuchów „A · B · C” i strzałek „→” przy każdym linku |
| Etykiety „SŁOWO — fragment”, monospace z przyzwyczajenia | Ograniczone — monospace wyłącznie w elemencie „rysunek techniczny” (metryki, linie wymiarowe), nie jako uniwersalny styl etykiet |
| Akcentowanie jednego słowa kursywą/kolorem jako reguła | Nie stosujemy |
| Numeracja 01/02/03 wszędzie | Tylko w procesie (prawdziwa sekwencja) |
| Fade-up na każdej sekcji, hover na każdej karcie | Nie — jedna orkiestrowana sekwencja wejścia + ruch ze scrolla; hover tylko na kartach oferty i linkach |
| **Ryzyko własne:** hero „z ramką rysunku” może wyglądać na gimmick, jeśli linie wymiarowe będą puste | Linie wymiarowe niosą treść („5 sekund na pierwsze wrażenie”) — sprawdzić w G2 na zrzutach |

**Uwaga odrębności od case study:** strona Koparki Pawłowski też używa estetyki rysunku technicznego. Portfolio celowo nie kopiuje jej rozwiązań (inna kompozycja hero, inna paleta: noc/granat vs krem/terakota, brak numeracji nad sekcjami poza procesem). Spójne pozostaje wyłącznie *pojęcie* rzemiosła technicznego.

## 9. Storyboard → Faza 5 (dokumentacja robocza)

Scena proceduralna (bez modeli GLB): siatka blueprint = shader GLSL ES 3.00 (`uTime, uProgress, uPointer, uRes, uGrade`), cząsteczki `THREE.Points` (instancjonowane), mockupy: `RoundedBoxGeometry` + tekstury ze zrzutów case study (`public/media/`). Budżety i tiery wg MASTERPROMPT 11.2–11.3.
