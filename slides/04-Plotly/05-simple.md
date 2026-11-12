## Un simple graphe
//@ [] 00:45

Le plugin `plotly` évalue le code d'un bloc et affiche le graphe :

<div class="side-by-side" style="margin-top:3vh">
<div style="flex:1">

<pre>
```plotly
{
    data: [{
        x: [1, 2, 3, 4, 5],
        y: [1, 4, 9, 16, 25],
        type: 'scatter',
        mode: 'lines+markers'
    }]
}
```
</pre>

</div>
<div style="flex:1">

```plotly
{
    data: [{
        x: [1, 2, 3, 4, 5],
        y: [1, 4, 9, 16, 25],
        type: 'scatter',
        mode: 'lines+markers'
    }],
    layout: { height: 500 }
}
```

</div>
</div>

/*
Un bloc plotly contient du JavaScript : ici, les traces du graphe et un layout minimal qui fixe la hauteur.

À l'arrivée sur la diapositive, le plugin évalue le code et dessine le graphe à la place, avec une mise en page par défaut taillée pour la salle : grandes polices, pas de barre d'outils.

À gauche le code, à droite son rendu : c'est exactement le même bloc.
*/
