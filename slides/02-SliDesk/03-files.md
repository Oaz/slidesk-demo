## On peut découper en plusieurs fichiers
//@ [] 01:00

Un seul `!include(slides)` charge un dossier entier, dans l'ordre :

```text
slidesk-demo/
├── main.md                  ← !include(slides)
├── slides/
│   ├── 00-title.md
│   ├── 01-Interactivité/
│   │   ├── 00-chapter.md
│   │   └── 01-connexion.md
│   ├── 02-SliDesk/
│   │   ├── 00-chapter.md
│   │   └── …
│   └── 07-questions.md
└── slidesk.toml
```

Cette présentation est construite exactement ainsi.

/*
Le point d'entrée, main.md, contient la configuration du talk puis un unique !include(slides).

Cet include parcourt le dossier slides/ dans l'ordre alphabétique, récursivement : le découpage est libre, une slide par fichier, un dossier par chapitre, et les numéros de fichiers donnent l'ordre.

C'est exactement la structure de la présentation que vous regardez : chaque chapitre est un dossier, chaque slide un fichier Markdown.
*/
