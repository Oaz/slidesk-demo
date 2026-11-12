## Un objet 3D manipulable
//@ [] 01:00

Le couple plugin+composant `modelviewer` affiche un objet 3D qu'on tourne à la main

<div class="side-by-side" style="margin-top:3vh;width:92vw">
<div style="flex:1">

<p><em>Le code</em></p>

<pre style="font-size:1.3vw"><code>&#33;modelviewer(/assets/media/croix-occitane.glb)</code></pre>

</div>
<div style="flex:1">

<p><em>Le rendu</em></p>

!modelviewer(/assets/media/croix-occitane.glb)

</div>
</div>

/*
Le plugin modelviewer charge le runtime model-viewer et le composant !modelviewer insère l'objet 3D dans la slide, ici une croix occitane gardée avec les assets du talk.

L'objet tourne tout seul ; à la souris ou au doigt, on le manipule librement, zoom compris.
*/
