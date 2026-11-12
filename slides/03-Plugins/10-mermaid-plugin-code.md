## Voyage dans un plugin : le code
//@ [] 01:00

Le code du plugin `mermaid` tient en quelques lignes :

<div class="side-by-side" style="margin-top:3vh">
<div style="flex:1">

<p><em>plugins/@gouz__mermaid/plugin.js</em></p>

```js
mermaid.initialize({
  theme: 'base',
  startOnLoad: false
});

window.slidesk.mermaidChange = () => {
  mermaid.run({
    querySelector: '.sd-current .language-mermaid'
  });
};
```

</div>
<div style="flex:1">

- au chargement : `mermaid.initialize` fixe le thème, et `startOnLoad: false` empêche tout dessin automatique
- à chaque slide : `mermaidChange` appelle `mermaid.run` sur les blocs de code `mermaid`
- `.sd-current` : le sélecteur ne cible que la slide affichée

</div>
</div>

/*
Le code du plugin tient en quelques lignes : d'abord l'initialisation de Mermaid, avec le thème base, et surtout startOnLoad à false : on ne veut pas que la librairie dessine tout seule.

On expose ensuite window.slidesk.mermaidChange, la fonction que le manifeste appelle via onSlideChange à chaque changement de slide.

mermaid.run cherche alors les blocs de code mermaid de la slide courante : le sélecteur .sd-current .language-mermaid ne vise que la slide affichée, donc seuls les diagrammes visibles sont rendus, et revenir en arrière redessine le bon diagramme.

La boucle est complète : le manifeste déclare, le hook déclenche, la librairie dessine.
*/
