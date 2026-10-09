# Write once, read everywhere: PreTeXt colloquium slides

The Math & CS colloquium talk (Fall 2026) as a PreTeXt reveal.js slideshow.

## Build and view

```sh
pip install -r requirements.txt     # or open the folder in a PreTeXt Codespace
pretext build talk
pretext view talk                   # opens output/talk/talk.html
```

If `prefig` is not installed, build with `pretext build talk --no-generate`: the one
PreFigure diagram (LORAN) is already in `generated-assets/prefigure/`, copied from the
MATH 13 repository.

Navigation is linear: → and ← (or Space) step through every slide. Esc shows all slides
as a grid, so you can click to jump to any demo or skip a code walkthrough.

## Layout

```
source/talk.ptx                  the slideshow: title page plus one xi:include per part
source/docinfo.ptx               LaTeX macros
source/sections/
  sec-why-pretext.ptx            what PreTeXt is; one exercise, two renderings
  sec-math13.ptx                 MATH 13: photos, cross-references, five live figures,
                                 GeoGebra, Desmos, Manim, PreFigure
  sec-math14.ptx                 MATH 14: the wall, the course map, skeletal notes,
                                 Check me, exercise types, the tutor, feedback, report
  sec-build-math53.ptx           the build pipeline; Camino; the syllabus; the link desk;
                                 the Posting Desks (replay and comparison); MATH 53 Sage
                                 cells and demos
  sec-closing.ptx                lessons, try it, thank you
  sec-appendix.ptx               project anatomy, zero to a live book, markup at a glance
assets/                          the books' own figure pages, videos, photos, screenshots,
                                 the two desk replays (link-desk.html,
                                 posting-desk-replay.html), and talk.css (the deck's look)
generated-assets/                the PreFigure diagram, and one qrcode stub per interactive
publication/publication.ptx      theme, CSS, linear navigation, responsive interactives
```

Speaker notes are the XML comments just above each slide.

## The "How it's coded" slides

After each demo, a run of slides walks through how it is coded, one step per slide.
Each shows the real code from the course repositories as a `<program>` with
`highlight-lines` marking the lines that step is about. Long files are cut to a window
around those lines, marked with `…`. To skip a walkthrough while presenting, press Esc
and click the next demo.

## Differences from the hand-built HTML deck

- **Live here**: the books' own figure pages (Plotly, Three.js, the MATH 53 demo), the
  polar-rose script and slate, GeoGebra (material `xzdc5jpq`), Desmos (`7b85e78f17`),
  the videos, the Sage cells (they run on the SageMathCell server; evaluate them in order),
  and the PreFigure diagram with its keyboard explorer.
- **Replays here too**: the link desk (click a zone to find it on the page) and the
  Posting Desk replay (both desks and the Claude chat) are the same pages as in the HTML
  deck, as `<interactive>`s; nothing is posted from them.
- **Screenshots here**: knowls, Check me, the exercise types, the tutor, and the feedback
  form. PreTeXt's reveal.js output prints cross-references as plain text and does not
  render exercises, so these slides show the books.
- **GeoGebra** keeps the book's fixed-size frame (its applet does not resize with the
  page). `talk.css` enlarges it with `zoom` on wide screens; adjust there if needed.

## Two CSS workarounds in assets/talk.css

- Prism's line-highlight plugin measures lines while a slide is hidden, which fails in
  reveal.js. The rules at the end of `talk.css` place each highlight from its
  `data-start` attribute instead (code line height 1.45em, top padding 0.7em).
- Part dividers are the title-only slides PreTeXt writes for each `<section>`; the CSS
  paints them wine.
