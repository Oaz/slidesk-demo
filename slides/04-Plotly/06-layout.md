## Un layout configurable
//@ [] 00:30

Le code peut aussi renvoyer un objet `data` + `layout` :

<div class="side-by-side" style="margin-top:3vh;width:70vw">
<div style="flex:1">

<pre>
```plotly
{
  data: [{
    x: ['Pommes', 'Oranges', 'Raisins'],
    y: [20, 15, 25],
    type: 'bar',
    marker: { color: ['#FF6384', '#36A2EB', '#FFCE56'] }
  }],
  layout: {
    title: { text: 'Ventes de fruits' },
    xaxis: { title: { text: 'Fruit' } },
    yaxis: { title: { text: 'Quantité' } },
    height: 500
  }
}
```
</pre>

</div>
<div style="flex:1">

```plotly
{
    data: [{
        x: ['Pommes', 'Oranges', 'Raisins'],
        y: [20, 15, 25],
        type: 'bar',
        marker: {
            color: ['#FF6384', '#36A2EB', '#FFCE56']
        }
    }],
    layout: {
        title: { text: 'Ventes de fruits' },
        xaxis: { title: { text: 'Fruit' } },
        yaxis: { title: { text: 'Quantité' } },
        height: 500
    }
}
```

</div>
</div>

/*
Le plugin fusionne le layout renvoyé sur ses valeurs par défaut : on ne précise que ce que l'on veut changer.

Ici : un titre, des libellés d'axes, une couleur par barre et une hauteur sur mesure.

C'est le même graphe en barres, mais la mise en page devient nôtre.
*/
