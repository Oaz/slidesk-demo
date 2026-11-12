## Des données dynamiques
//@ [] 01:00

Le bloc peut être une fonction asynchrone, le plugin attend son résultat :

<div class="side-by-side" style="margin-top:3vh;width:70vw">
<div style="flex:1">

<pre>
```plotly
async function() {
    const todos = await (await fetch(
        'https://jsonplaceholder.typicode.com/todos')).json();
    const terminé = todos.filter(t => t.completed).length;
    return {
        data: [{
            values: [terminé, todos.length - terminé],
            labels: ['Terminé', 'À faire'],
            type: 'pie', textinfo: 'label+percent'
        }],
        layout: { width: 600, height: 500 }
    };
}
```
</pre>

</div>
<div style="flex:1">

```plotly
async function() {
    const todos = await (await fetch(
        'https://jsonplaceholder.typicode.com/todos')).json();
    const terminé = todos.filter(t => t.completed).length;
    return {
        data: [{
            values: [terminé, todos.length - terminé],
            labels: ['Terminé', 'À faire'],
            type: 'pie', textinfo: 'label+percent'
        }],
        layout: { width: 600, height: 500 }
    };
}
```

</div>
</div>

/*
À l'affichage de la diapositive, le plugin évalue la fonction, attend la promesse et dessine le résultat.

Ici, on interroge une API publique de démonstration (jsonplaceholder), on compte les todos terminés, et on affiche la répartition en camembert.

Le même mécanisme afficherait les résultats d'un vote en direct : il suffirait de changer l'URL interrogée.
*/
