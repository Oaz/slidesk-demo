## Voyage dans un plugin : le manifeste
//@ [] 00:45

La seule pièce obligatoire d'un plugin SliDesk est un manifeste `plugin.json`.

<p><em>plugins/@gouz__mermaid/plugin.json</em></p>

```json
{
  "addStyles": ["plugins/@gouz__mermaid/mermaid.css"],
  "addScripts": ["plugins/@gouz__mermaid/mermaid.min.js", "plugins/@gouz__mermaid/plugin.js"],
  "onSlideChange": "window.slidesk.mermaidChange();",
  "files": ["mermaid.css", "mermaid.min.js", "plugin.js"],
  "tags": ["mermaid", "presentation", "diagram"]
}
```

- `addStyles` et `addScripts` : les feuilles de style et les scripts injectés dans la présentation
- `onSlideChange` : le code exécuté à chaque changement de slide
- `tags` : les mots-clés pour le hub

/*
Un plugin SliDesk, c'est d'abord un manifeste : un simple plugin.json, aucune ligne de code obligatoire.

addStyles et addScripts annoncent ce qui doit être injecté dans la page : ici la CSS d'habillage, la librairie Mermaid minifiée, puis le script du plugin. L'ordre compte : la librairie se charge avant notre code.

onSlideChange est un hook : SliDesk exécute cette chaîne à chaque slide affichée, c'est elle qui déclenchera le rendu des diagrammes.

files liste les fichiers embarqués avec le plugin, et tags sert au hub pour la recherche.
*/
