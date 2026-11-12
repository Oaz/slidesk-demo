## Voyage dans un plugin : les fichiers
//@ [] 00:45

Le plugin `mermaid` complet tient dans cinq fichiers :

<div class="side-by-side" style="margin-top:3vh">
<div style="flex:1">

<p><em>plugins/@gouz__mermaid/</em></p>

```text
README.md
mermaid.css
mermaid.min.js
plugin.js
plugin.json
```

</div>
<div style="flex:1">

- `plugin.json` : le manifeste, seule pièce obligatoire
- `plugin.js` : le code du plugin, chargé comme un script
- `mermaid.min.js` : la librairie Mermaid, minifiée, qui fait tout le travail
- `mermaid.css` : l'habillage des diagrammes
- `README.md` : la doc, affichée sur le hub

</div>
</div>

/*
Le dossier du plugin tient sur un écran : le manifeste, notre script, la librairie Mermaid minifiée (2,5 Mo, c'est elle qui fait tout le travail), une petite CSS pour habiller les diagrammes, et un README.

Seul plugin.json est obligatoire : les autres fichiers ne sont là que parce que le manifeste les référence.

Le README sert de fiche sur le hub, avec les tags pour la recherche. À ce stade, un plugin n'a plus rien de mystérieux : un dossier, une déclaration, un peu de code.
*/
