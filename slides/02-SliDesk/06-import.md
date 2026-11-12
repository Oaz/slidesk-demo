## On démarre de zéro ou d'une présentation existante
//@ [] 01:00

```sh
slidesk create ma-presentation            # partir de zéro
slidesk import deck.pptx                   # depuis un PowerPoint
slidesk import "https://docs.google.com/presentation/d/…"  # depuis Google Slides
slidesk import slides.md -t slidev        # depuis Slidev
slidesk import index.html -t revealjs      # depuis reveal.js
```

PowerPoint, Google Slides, Slidev et reveal.js deviennent des présentations SliDesk.

/*
slidesk create génère l'ossature d'un nouveau talk : le fichier principal, un dossier slides/, un thème et un premier template. En une commande, on obtient une présentation qui tourne.

Pas besoin de repartir d'une page blanche : slidesk import convertit un deck existant en Markdown éditable. Titres, listes, tableaux, liens, notes et images passent dans le monde SliDesk ; seule la mise en page n'est pas reproduite, c'est le thème qui prend le relais.

Ça marche depuis PowerPoint, Google Slides, Slidev ou reveal.js, avec détection automatique du format.
*/
