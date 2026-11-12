## Des données incrémentales
//@ [] 01:00

En combinant *state* et *repeat*, la courbe se construit sous vos yeux :

<div class="side-by-side" style="margin-top:3vh">
<div style="flex:1">

<pre>
```plotly
function(state) {
  const taille = 20;
  if (!state.x) {
    state.x = [1];
    state.y = [Math.random()];
  } else {
    state.x.push(state.x.at(-1) + 1);
    state.y.push(Math.random());
    state.x = state.x.slice(-taille);
    state.y = state.y.slice(-taille);
  }
  return { data: [{ x:state.x, y:state.y }],
    repeat: 500, state };
}
```
</pre>

</div>
<div style="flex:1">

```plotly
function(state) {
  const taille = 20;
  if (!state.x) {
    state.x = [1];
    state.y = [Math.random()];
  } else {
    state.x.push(state.x.at(-1) + 1);
    state.y.push(Math.random());
    state.x = state.x.slice(-taille);
    state.y = state.y.slice(-taille);
  }
  return { data: [{ x:state.x, y:state.y }],
    repeat: 500, state };
}
```

</div>
</div>

/*
Le plugin mémorise l'objet state du bloc entre deux rafraîchissements : c'est lui qui porte la mémoire du graphe.

À chaque tour, le code ajoute un point et garde une fenêtre glissante des 30 dernières valeurs.

Le graphe s'anime donc tout seul, sans que la diapositive ne soit rechargée.
*/
