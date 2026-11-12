## Une partition qui se joue
//@ [] 01:00

Le plugin `abcjs` dessine une partition depuis la notation ABC, et la joue

<div class="side-by-side" style="margin-top:3vh;width:92vw">
<div style="flex:1">

<p><em>Le code</em></p>

```html
<textarea data-abc>
T:Se Canta
L:1/4
K:Bb
F | B B d/c/ | B B B/c/ | d2 d |
c2 c/d/ | e2 e | d d B/d/ | c2 F | B2 |]
</textarea>
```

</div>
<div style="flex:1">

<p><em>Le rendu</em></p>

<textarea data-abc style="display:none">
T:Se Canta
L:1/4
K:Bb
F | B B d/c/ | B B B/c/ | d2 d |
c2 c/d/ | e2 e | d d B/d/ | c2 F | B2 |]
</textarea>

<p style="text-align:center">
<button style="padding:0.4em 1em;border-radius:0.4vw;cursor:pointer" onclick="window.slidesk.playSound()"><i class="fa-solid fa-play"></i>&nbsp;Écouter</button>
</p>

</div>
</div>

/*
Le plugin abcjs lit une notation ABC dans un textarea : à l'arrivée sur la slide, la partition est dessinée en SVG et le son est préparé par un synthétiseur.

Le bouton Écouter lance la lecture : un curseur rouge suit les notes en temps réel.

La notation tient en quelques lignes : numéro, titre, métrique, durée de référence, tonalité, puis les notes (la référence complète est sur abcnotation.com).
*/
