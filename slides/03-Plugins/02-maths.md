## Des formules mathématiques
//@ [] 00:45

Le plugin `maths` rend le LaTeX avec KaTeX, embarqué dans la présentation

<div class="side-by-side" style="margin-top:3vh">
<div style="flex:1">

<p><em>Le code</em></p>

```markdown
$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$

$$n! \sim \sqrt{2\pi n}\left(\frac{n}{e}\right)^n$$
```

</div>
<div style="flex:1">

<p><em>Le rendu</em></p>

$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$

$$n! \sim \sqrt{2\pi n}\left(\frac{n}{e}\right)^n$$
</div>
</div>

/*
Le plugin maths embarque KaTeX : les formules se rendent hors ligne, dans la vue présentateur comme dans les exports PDF et PPTX.

Trois écritures : un bloc math, qui garde les antislashs tels quels (matrices, tableaux…), $$…$$ pour une formule dans le texte, et `$…$` en code inline au milieu d'une phrase.

Un $ isolé, un prix par exemple, reste tranquille.
*/
