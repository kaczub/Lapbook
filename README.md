# Prawa człowieka — interaktywny lapbook + wersja A4

Statyczna strona (HTML + CSS + JS, bez build stepu) przygotowana pod **GitHub Pages**. Zawiera krótki lapbook online oraz dwustronną kartę A4 do druku.

## Podgląd lokalny

Otwórz `index.html` w przeglądarce albo uruchom lokalny serwer:

```bash
cd lapbook-site
python3 -m http.server 8000
```

- lapbook online: `http://localhost:8000`
- wersja A4: `http://localhost:8000/a4.html`
- PDF do druku: `lapbook-a4.pdf`

## Publikacja na GitHub Pages

1. Utwórz repozytorium, np. `Lapbook`.
2. Wgraj **zawartość** folderu `lapbook-site/` do głównego katalogu repozytorium (czyli `index.html` ma być w root).
3. Wejdź w **Settings → Pages**.
4. Wybierz **Deploy from a branch**, branch `main`, folder `/root`, kliknij **Save**.
5. Strona będzie pod adresem:

```text
https://TWOJ-LOGIN.github.io/Lapbook/
```

## Struktura

```text
lapbook-site/
├── index.html       # lapbook online
├── styles.css       # wygląd lapbooka, responsywność, druk
├── script.js        # karty, oś czasu, zakładki, scenariusz, quiz
├── a4.html          # dwustronna karta A4
├── a4.css           # układ A4 pod druk
├── lapbook-a4.pdf   # gotowy PDF A4 (2 strony)
├── timeline-a4.html # oś czasu: 4 karty na A4
├── timeline-a4.css  # układ osi czasu pod druk
├── timeline-a4.pdf  # gotowy PDF: 4 × 1/4 A4
├── favicon.svg
└── README.md
```

## Co jest interaktywne w wersji online?

- **8 kart praw** — kliknij lub naciśnij Enter/Spację, żeby odwrócić.
- **Oś czasu** — kliknij wydarzenie, żeby rozwinąć opis.
- **Zakładki** — dokumenty i instytucje; obsługa strzałkami na klawiaturze.
- **Scenariusz** — wybór reakcji na cyberprzemoc z informacją zwrotną.
- **Quiz** — 5 pytań, wynik i możliwość powtórki.
- **Druk** — użyj Ctrl/Cmd+P; wersja print pokazuje treść kart i wszystkie zakładki.

## Wersja A4

`a4.html` to osobna, dwustronna karta do druku:

- strona 1: definicja, cechy, historia, 8 praw, polskie ślady,
- strona 2: dokumenty i instytucje, naruszenia i ochrona, quiz, słowniczek, prawa ucznia, źródła.

PDF generowany przez Chrome:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=lapbook-a4.pdf \
  http://localhost:8000/a4.html
```

### Oś czasu A4 (4 karty)

`timeline-a4.pdf` to jedna strona A4 z **czterema identycznymi kartami** — każda zajmuje 1/4 strony (A6). Wystarczy wydrukować w 100% i rozciąć po liniach.

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=timeline-a4.pdf \
  http://localhost:8000/timeline-a4.html
```

## Dostosowanie

- Kolory lapbooka: zmienne CSS na początku `styles.css` (`:root`).
- Kolory i układ A4: `a4.css`.
- Treść kart: `index.html`, sekcja `<!-- KARTY -->`.
- Pytania quizu: tablica `quizQuestions` w `script.js`.
- Źródła: sekcja `<!-- ŹRÓDŁA -->` w `index.html`.

## Uwagi

- Strona korzysta z Google Fonts (Fraunces, Inter, JetBrains Mono). Jeśli potrzebujesz wersji w pełni offline, podmień link na lokalne pliki fontów.
- Nie ma żadnych zależności JS ani procesu budowania — GitHub Pages obsłuży to od razu.
- Treść jest skróconą wersją materiału z plików `lapbook_prawa_czlowieka.md` i `karty_do_canvy.md`.
