## La webcam par-dessus les slides
//@ [] 00:45

Le plugin `webcam` superpose le flux de la webcam à la présentation

<div class="side-by-side" style="margin-top:3vh">
<div style="flex:1">

<p><em>Le code</em></p>

```html
<video autoplay="true" id="webcam"></video>
```

```toml
WEBCAM = "++WEBCAM++"
```

</div>
<div style="flex:1">

<p><em>Le rendu</em></p>

<p><i class="fa-solid fa-video fa-3x"></i></p>

<p>
<button style="padding:0.4em 1em;border-radius:0.4vw;cursor:pointer" onclick="window.slidesk.webcam()"><i class="fa-solid fa-clapperboard"></i>&nbsp;Basculer la webcam</button>
</p>

</div>
</div>

/*
Le plugin webcam injecte une balise video et la range hors écran : elle ne s'affiche que quand on la demande, ici dans un coin de l'écran.

Le label WEBCAM, dans la configuration du talk, choisit la caméra quand plusieurs sont branchées ; navigator.mediaDevices.enumerateDevices() les liste toutes.

Le bouton appelle window.slidesk.webcam() : la vidéo glisse dans le coin de la présentation, un nouvel appel la fait disparaître. Pratique pour une démo en direct sans quitter le talk.
*/
