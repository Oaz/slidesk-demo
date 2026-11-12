## Des données qui évoluent
//@ [] 00:40

En renvoyant *repeat*, le bloc est ré-évalué en boucle :

<div class="side-by-side" style="margin-top:3vh">
<div style="flex:1">

<pre>
```plotly
{
   data: [{
       x: [1, 2, 3, 4],
       y: [Math.random(), Math.random(),
           Math.random(), Math.random()],
       type: 'scatter'
   }],
   layout: { width: 600, height: 500 },
   repeat: 500  // rafraîchi toutes les 500 ms
}
```
</pre>

</div>
<div style="flex:1">

```plotly
{
   data: [{
       x: [1, 2, 3, 4],
       y: [Math.random(), Math.random(),
           Math.random(), Math.random()],
       type: 'scatter'
   }],
   layout: { width: 700, height: 500 },
   repeat: 500  // rafraîchi toutes les 500 ms
}
```

</div>
</div>

/*
En renvoyant repeat, on demande au plugin de rejouer tout le code à intervalle régulier : ici, toutes les 500 millisecondes.

Ce ne sont que des nombres aléatoires : le graphe bouge tout seul, sans recharger la diapositive.

Le rafraîchissement s'arrête proprement quand on quitte la diapositive.
*/
