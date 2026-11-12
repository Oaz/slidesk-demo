# slidesk-demo

Some examples to show what you can do with [SliDesk](https://slidesk.github.io/slidesk), the Markdown-first talk engine.

This repository holds the demo deck **« Des présentations interactives avec SliDesk »** presented [Capitole du Libre 2026](https://capitoledulibre.org).

## What it demonstrates

- **Audience interaction.** The audience joins a virtual keypad through a QR code and answers live, with connection and vote counters on stage
- **SliDesk essentials.** Markdown syntax, deck file organisation, speaker notes, exports and imports
- **Plugins.** QR codes, maths, music scores (abcjs), 3D models (model-viewer), webcam, Mermaid diagrams, and a walkthrough for writing your own plugin
- **Live data with Plotly.** Simple, dynamic, refreshed and incremental charts, plus a live timer, all driven from `plotly` code blocks
- **Use Case.** Serious game for a large audience in an amphitheater.

## Repository structure

```text
├── main.md          # entry point: configuration block + !include(slides)
├── slides/          # one file per slide, numbered; one folder per chapter
├── assets/
│   ├── styles/      # slides.css, transitions.css
│   ├── code/        # keypad.js, interaction.js, graphs.js, timer.js
│   ├── templates/   # title.html, chapter.html (blueimp-tmpl)
│   ├── media/       # images
│   └── fonts/       # Libertinus Serif
├── components/      # SliDesk components
├── plugins/         # deck-local SliDesk plugins
├── themes/          # deck theme
├── slidesk.toml     # deck configuration (keypad, webcam, ...)
└── scripts/         # server-side deployment helper
```

## Prerequisites

The deck runs on its own, but the **audience interaction part** needs a running [audience-keypad](https://github.com/Barrejadis/audience-keypad) server: it serves the virtual keypads the audience opens through the QR codes and aggregates their answers. It is a dependency-free PHP application (PHP ≥ 8.1 with APCu and GMP); see its README for installation and configuration.

## Run it locally

```bash
# serve the deck at http://localhost:1337
bunx slidesk slidesk-demo

# build a static export
bunx slidesk save slidesk-demo
```

See the [SliDesk documentation](https://slidesk.github.io/slidesk) for other installation options (npm, Homebrew).

## License

[AGPL-3.0](LICENSE)
