## Voyage dans un plugin
//@ [] 00:45


Le plugin `mermaid` s'utilise en introduisant une section *mermaid* dans le markdown.


<div class="side-by-side" style="margin-top:3vh;width:70vw">
<div style="flex:1">
<p><em>Le code</em></p>

<pre>
```mermaid
graph TD
    A[Enter Chart Definition] --> B(Preview)
    B --> C{decide}
    C --> D[Keep]
    C --> E[Edit Definition]
    E --> B
    D --> F[Save Image and Code]
    F --> B
```
</pre>
</div>
<div style="flex:1">
<p><em>Le rendu</em></p>

```mermaid
graph TD
    A[Enter Chart Definition] --> B(Preview)
    B --> C{decide}
    C --> D[Keep]
    C --> E[Edit Definition]
    E --> B
    D --> F[Save Image and Code]
    F --> B

```

</div>
</div>

Voyons comment le plugin génère le rendu...
