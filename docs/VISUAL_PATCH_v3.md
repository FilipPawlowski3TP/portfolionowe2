# VISUAL PATCH v3 — kinetyczny hero, ciemna sekcja ze zmieniającym się słowem, lista realizacji

**Dla:** Hermes Agent + MiMo-V2.6-Pro. **Język rozmowy:** polski. **Kod, commity, nazwy plików:** angielski.

**Status dokumentów.** Ten patch **zastępuje** w VISUAL_RESET_v2 wszystko, co dotyczy: miniatury realizacji w hero, rozwijania okna, przewijania zrzutu strony oraz sekcji „Realizacja (fakty)”. **Nadal obowiązują** z v2: tokeny kolorów i typografia (sekcja 4), zasady „zero fałszu / zero AI slop” (sekcja 3), test układu (sekcja 9), format raportu (sekcja 10) oraz zasady z MASTERPROMPT v1 (5, 12–17, 19–21). Przełącznik jasny/ciemny **nie** jest w zakresie.

---

## 0. Zasady pracy

1. `git commit` obecnego stanu i nowa gałąź `visual-patch-v3`.
2. **Wolno edytować tylko:** `src/components/*`, `src/styles/*`, `src/scripts/*`, `src/pages/index.astro`, `src/data/site.ts` (pola z sekcji 6), `public/media/*` (usuwanie i podmiana), `docs/*`. **Nie ruszaj:** `functions/`, `public/_headers`, stron prawnych, `SeoHead`, JSON-LD, sitemapy. Zacznij od `ls src/components src/scripts` i czytaj **tylko** pliki, które zmieniasz.
3. **Maks. 2 rundy poprawek na krok.** Po każdym kroku jedna mozaika zrzutów, potem raport (≤ 15 linii, format z v2 sekcja 10).
4. Zatrzymaj się na `[BRAMKA]` i czekaj na zgodę użytkownika.
5. Przed użyciem API GSAP/ScrollTrigger/SplitText/Lenis sprawdź aktualne docs. Nie zgaduj.
6. Zapisz w `docs/PROGRESS.md` licznik zużycia przed i po każdym kroku.
7. Nie deklaruj sukcesu bez dowodu.

## 1. Co się zmienia (decyzje użytkownika)

- **Usuwamy** wyróżnienie projektu Koparki w hero: miniaturę, ramkę rozwijającą się na ekran, przewijanie zrzutu strony, pigułkę „Zobacz na żywo”, blok „Problem / Co zrobiłem / Technologia i wyniki” (żargon: CSP, HSTS, LCP). Usuń też zbędne duże zrzuty z `public/media/` i kod, który ich używał.
- **Zostaje** cała estetyka: jasne tło, gigantyczna typografia, zdanie przewodnie „zapalane” słowami ze scrollem, numerowane wiersze oferty, proces ze sticky nagłówkiem, FAQ, kontakt.
- **Dodajemy:** (a) kinetyczny hero, (b) ciemną, przypiętą sekcję „Robię strony dla …” ze zmieniającym się słowem, (c) listę realizacji z podglądem przy najechaniu, która skaluje się do wielu projektów.

**Kolejność strony (zgodna z nawigacją):** Hero → ciemna sekcja ze słowem → zdanie przewodnie → **Realizacje** → Oferta → Proces → FAQ → Kontakt → Stopka. Nawigacja: **Realizacje · Oferta · Proces · FAQ** + przycisk **Napisz**.

## 2. Poprawki błędów (zrób w Kroku 1)

1. **Skip link** „Przejdź do treści”: ukryty wizualnie, widoczny dopiero po fokusie klawiaturą (wzorzec `visually-hidden` + `:focus`).
2. **Napis w stopce** „Pawłowski Studio” nie może być ucięty po bokach: `white-space: nowrap`, rozmiar liczony tak, żeby mieścił się w szerokości okna (np. `font-size` z `cqw`/`vw`), przycięcie **tylko** od dołu. Zero poziomego scrolla.
3. **Zegar** w nagłówku: format `Wrocław, 20:36` (bez dnia tygodnia), kolor `--mute`, 15 px, kontrast ≥ 4,5:1.
4. **Rozmiary tekstu:** treść ≥ 18 px, podpisy ≥ 14 px i kontrast ≥ 4,5:1. Dotyczy zwłaszcza opisów oferty, „Czego potrzebuję od Ciebie” (≥ 16 px), FAQ.
5. **Hero:** dwa przyciski „Zadzwoń” (`tel:` z `site.ts`) i „Napisz”.
6. **Wiersz oferty 03:** po najechaniu nic nie może być przycięte ani przesunięte poza wiersz.
7. **Duże ekrany:** kontener `max-width: min(1760px, 92vw)`, boczny padding `clamp(20px, 5.5vw, 120px)`, typografia rośnie z `clamp()` do 2560 px szerokości. Test przy 2560×1440 nie może pokazywać „wąskiej kolumny”.

## 3. Hero (D1) — układ

- Nagłówek, 3 linie, każda w osobnym `<span data-hero-line style="display:block">` wewnątrz jednego `<h1>`: „Strony internetowe,” / „po których klient” / „dzwoni.” Rozmiar `clamp(52px, 8.6vw, 168px)`, interlinia 0,92, tracking −0,045em, Bricolage Grotesque 800.
- Pod nim (`data-hero-sub`): akapit (max 480 px) + przyciski „Zadzwoń” (główny, tło `--ink`) i „Napisz” (obrys).
- Lewy dół: `Najnowsza realizacja: Koparki Pawłowski ↗` (link do `#realizacje`, 15 px, `--mute`, nazwa 600 i podkreślona). Prawy dół: `Przewiń ↓`.
- Nagłówek strony 72 px: marka po lewej, zegar pośrodku, nawigacja po prawej.
- **Intro (≤ 1,2 s):** linie H1 wjeżdżają z maski (SplitText `mask: 'lines'` albo ręczne wrappery z `overflow:hidden`), `expo.out`, stagger 0,08; reszta delikatny fade. H1 nie czeka na JS dłużej niż 100 ms.

## 4. Kinetyczny hero i „kurtyna” (D2)

Hero zajmuje 100 vh i jest przypięte, a ciemna sekcja wjeżdża na nie od dołu (efekt kurtyny). Wzorzec (zweryfikuj API w docs):

```ts
const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line]');
gsap.timeline({
  defaults: { ease: 'none' },
  scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top',
    pin: true, pinSpacing: false, scrub: true, invalidateOnRefresh: true },
})
  .to(lines[0], { x: () => innerWidth * -0.18, opacity: 0.5 }, 0)
  .to(lines[1], { x: () => innerWidth * 0.17,  opacity: 0.32 }, 0)
  .to(lines[2], { x: () => innerWidth * -0.11, opacity: 0.18 }, 0)
  .to('[data-hero-sub]', { y: -40, opacity: 0, duration: 0.4 }, 0);

// górne rogi ciemnej sekcji: 40px -> 0, gdy dojeżdża do góry ekranu
gsap.fromTo('[data-night]',
  { borderTopLeftRadius: 40, borderTopRightRadius: 40 },
  { borderTopLeftRadius: 0, borderTopRightRadius: 0, ease: 'none',
    scrollTrigger: { trigger: '[data-night]', start: 'top bottom', end: 'top top', scrub: true } });
```

Wymagania: hero `position: relative; z-index: 1`; ciemna sekcja `z-index: 2`, od początku z zaokrąglonymi górnymi rogami (40 px). Brak skoku przy odpięciu.

## 5. Ciemna sekcja ze słowem (D3)

**Markup (jeden wrapper do pinu, drugi do przełączania motywu nagłówka):**
```html
<section data-night-wrap>
  <div data-night> <!-- tło --ink, tekst --paper; to ten element jest przypięty -->
    <h2 class="slot-label">Robię strony dla</h2>
    <div class="slot" aria-hidden="true"><div data-slot-stack>
      <span data-slot-word>hydraulików</span> … </div></div>
    <ul class="sr-only"> <!-- pełna lista dla czytników i dla trybu bez ruchu --> </ul>
    <p data-slot-counter>01 / 07</p> <a data-slot-cta href="#kontakt">Napisz do mnie</a>
  </div>
</section>
```

**Słowa (7):** hydraulików, elektryków, mechaników, fryzjerów, gabinetów, restauracji, **Twojej firmy.** (to cele oferty, nie obietnica, że już dla nich robiłem; lista edytowalna w `site.ts`).

**Wygląd:** etykieta „Robię strony dla” 44 px `--night-mute`; słowo `clamp(48px, 11vw, 176px)`, Bricolage 800, tracking −0,05em, obok aktywnego słowa widać sąsiednie przy 14% krycia; każde słowo mieści się w szerokości (test!). Ostatnie słowo w kolorze `--signal-on-dark`. Licznik `03 / 07` z kropką `--signal-on-dark`; na końcu zamiast „Przewiń dalej ↓” pojawia się przycisk „Napisz do mnie”.

**Ruch (pin + zmiana słowa):**
```ts
const words = gsap.utils.toArray<HTMLElement>('[data-slot-word]');
const n = words.length, lineH = () => words[0].offsetHeight;
const setActive = (i: number) => {
  words.forEach((w, k) => w.classList.toggle('is-active', k === i));
  counter.textContent = `${String(i + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
  night.classList.toggle('is-final', i === n - 1);
};
ScrollTrigger.create({
  trigger: '[data-night]', start: 'top top', end: () => '+=' + (n - 1) * innerHeight * 0.7,
  pin: true, scrub: 0.4, invalidateOnRefresh: true,
  snap: { snapTo: 1 / (n - 1), duration: { min: 0.2, max: 0.5 }, ease: 'power2.inOut' },
  animation: gsap.to('[data-slot-stack]', { y: () => -(n - 1) * lineH(), ease: 'none' }),
  onUpdate: (self) => setActive(Math.round(self.progress * (n - 1))),
});
```

**Nagłówek zmienia motyw nad ciemną sekcją** (trigger na wrapperze, nie na przypiętym elemencie):
```ts
ScrollTrigger.create({ trigger: '[data-night-wrap]', start: 'top 36px', end: 'bottom 36px',
  onToggle: (s) => (header.dataset.theme = s.isActive ? 'dark' : 'light') });
```
CSS: `header[data-theme='dark']` → tekst `--paper`, zegar `--night-mute`, przycisk „Napisz” odwrócony (tło `--paper`, tekst `--ink`); przejście 0,25 s.

**Tokeny dodatkowe:**
```css
--night: #101114; --night-ink: #F1F1ED; --night-mute: #A9ABB3; --signal-on-dark: #8A95FF;
```
(kontrasty ≥ 4,5:1 na `--night`; sprawdź).

**Tryb bez ruchu i bez JS:** brak pinu, brak zmiany słowa; wszystkie słowa widoczne jako pionowa lista dużej czcionki (pełne krycie), przycisk „Napisz do mnie” widoczny.

## 6. Realizacje: lista z podglądem (D4) i treści

**Dane w `site.ts`:** tablica `projects: { name, type, year, url, preview }[]`. Dziś jeden element: `Koparki Pawłowski`, `Strona firmowa`, rok (potwierdzony przez użytkownika), `https://koparkapawlowski.pl/`, `preview`: miniatura ≤ 80 KB. **Nowe projekty = nowy element tablicy, bez zmiany układu.**

**Układ:** H2 „Realizacje” (`clamp(48px, 6.2vw, 104px)`), pod nim lista `<ul>` wierszy-linków: nazwa (duża, Bricolage 800, `clamp(36px, 4.4vw, 72px)`), rodzaj, rok, strzałka ↗; linie rozdzielające `--line`. Ostatni wiersz zawsze to zaproszenie: **„Twoja firma?”** (kolor `--mute`) z linkiem „Napisz do mnie ↗” do `#kontakt`. Link wiersza otwiera stronę projektu (`target="_blank" rel="noopener"`).

**Hover (tylko `(hover: hover) and (pointer: fine)`):** nazwa i strzałka w `--signal`, podgląd (karta ~300×190 px, zaokrąglenie 12 px, cień, obrót −3°) podąża za kursorem przez `gsap.quickTo`, `position: fixed`, `pointer-events: none`, `aria-hidden`. Fokus klawiaturą: ten sam podgląd w stałym miejscu przy wierszu. Dotyk/mobile: miniatura widoczna na stałe pod nazwą, bez hovera.

**Treść bez zmian względem v2 (sekcja 7):** H1, podtytuł, zdanie przewodnie, kontakt. **Usuń** z `site.ts` i komponentów pola bloku „Problem / Co zrobiłem / Technologia i wyniki”. Nie dodawaj żadnych liczb, wyników ani żargonu. Opisy oferty/procesu przeczytaj i **usuń żargon** (CSP, HSTS, LCP, Lighthouse itp.), jeśli się tam pojawia.

## 7. Dostępność i wydajność (obowiązkowe)

- `prefers-reduced-motion: reduce`: bez Lenisa, bez pinów i kurtyny, bez kinetyki; hero statyczne, sekcja słowa jako lista, lista realizacji z miniaturą na stałe.
- Bez JS: cała treść widoczna (hero, lista słów, realizacje). `html.js` dodawany dopiero po starcie skryptów; awaryjny timeout 3 s odsłania wszystko.
- Ruch tylko `transform`, `opacity`, `border-radius` (jeden element) i `clip-path`. Jedna pętla ticker: GSAP + Lenis (jak w v2).
- Fokus widoczny (obrys 2 px `--signal`, odstęp 3 px; na ciemnej sekcji `--signal-on-dark`).
- Hover i fokus nie mogą jedynie koloru zmieniać (zmień też podkreślenie/strzałkę).

## 8. Kroki

### Krok 0 — Sprzątanie
Gałąź, usunięcie kodu i plików wg sekcji 1 (w tym zbędnych zrzutów), `npm run build` i `astro check` bez błędów.

### Krok 1 — Poprawki i statyczny układ
Sekcje 2, 3 (bez ruchu), 5 (statyczna lista słów w ciemnej sekcji z zaokrąglonymi górnymi rogami), 6 (statyczna lista realizacji), kolejność sekcji i nawigacja. Test układu z v2 sekcja 9 dodatkowo dla szerokości **2560** i test mieszczenia słów (`scrollWidth` kontenera ≤ jego szerokości dla każdego słowa).
`[KRYTERIUM]` mozaika 1440×900, 390×844 i 2560×1440; zero nakładek i poziomego scrolla; kontrast ≥ 4,5:1; skip link niewidoczny bez fokusu.
`[BRAMKA G1]` pokaż mozaikę.

### Krok 2 — Ruch główny
Intro, kinetyczny hero i kurtyna (sekcja 4), sekcja słowa z pinem i snapem (sekcja 5), przełączanie motywu nagłówka.
`[KRYTERIUM]` zrzuty w stanach: hero 0%, 50%, 100% (kurtyna), słowo 1, 3, 7 z 7; brak skoku przy odpięciu; nagłówek czytelny nad ciemną i jasną sekcją; `prefers-reduced-motion` i brak JS działają.
`[BRAMKA G2]` pokaż mozaikę.

### Krok 3 — Reszta
Podgląd przy najechaniu na listę realizacji, zdanie przewodnie, wiersze oferty (naprawa 03), proces, FAQ, stopka (naprawa napisu), kontakt.
`[KRYTERIUM]` brak błędów w konsoli; hover/fokus/dotyk działają zgodnie z sekcją 6.

### Krok 4 — QA
Test układu (v2 sekcja 9), axe (0 serious/critical), Lighthouse mobile (A11y 100, SEO 100, Best Practices ≥ 95, Performance ≥ 95; zgłoś wyniki), audyt cookies/żądań zewnętrznych bez zmian względem v1, `check-placeholders`, lista „anty-slop” z v2 sekcja 11.
`[KRYTERIUM]` wszystko zaliczone lub opisane w `docs/QA_REPORT.md`.
