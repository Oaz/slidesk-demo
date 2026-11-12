## Des usages à imaginer .[timer-code]
//@ [] 00:40

Un dernier exemple : avec `state` et la date, on fabrique un chronomètre :

<div class="side-by-side" style="margin-top:3vh;width:90vw">
<div style="flex:1">

<pre>
```plotly
function(state) {
    const duree = 30000; // 30 secondes
    if (!state.depart) {
        state.depart = Date.now();
    }
    const ecoule = Math.min(Date.now() - state.depart, duree);
    return {
        data: [
            { x: [ecoule], y: [''],
              type: 'bar', orientation: 'h',
              text: [Math.round((duree - ecoule) / 1000)],
              textposition: 'inside',
              textfont: { color: 'white' } },
            { x: [duree - ecoule], y: [''],
              type: 'bar', orientation: 'h' }
        ],
        layout: { barmode: 'stack',
                  showlegend: false,
                  height: 250,
                  xaxis: { visible: false } },
        repeat: 200, state
    };
}
```
</pre>

</div>
<div style="flex:1">

```plotly
function(state) {
    const duree = 30000; // 30 secondes
    if (!state.depart) {
        state.depart = Date.now();
    }
    const ecoule = Math.min(
        Date.now() - state.depart, duree);
    return {
        data: [
            { x: [ecoule], y: [''],
              type: 'bar', orientation: 'h',
              text: [Math.round(
                (duree - ecoule) / 1000)],
              textposition: 'inside',
              textfont: { color: 'white' } },
            { x: [duree - ecoule], y: [''],
              type: 'bar', orientation: 'h' }
        ],
        layout: { barmode: 'stack',
                  showlegend: false,
                  height: 250,
                  xaxis: { visible: false } },
        repeat: 200, state
    };
}
```

</div>
</div>

/*
Un usage à imaginer pour finir : un chronomètre de 20 secondes.

L'état mémorise l'heure de départ ; à chaque rafraîchissement, le code calcule le temps écoulé et dessine une barre qui se vide, avec le décompte au milieu.

Les mêmes briques — code évalué à l'affichage, état, rafraîchissement — ont fait tourner la démo du chapitre 1 : jauges de connexion, votes en direct, carte des départements, jeu.

Il ne reste qu'à imaginer les vôtres.
*/
