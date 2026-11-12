# SliDesk Plugin: maths

This plugin renders LaTeX formulas in your slides with [KaTeX](https://katex.org), bundled with the plugin: it works offline.

A formula in a block:

````
```math
\begin{pmatrix} a & b \\ c & d \end{pmatrix} \, x_{1}
```
````

or between `$$`, for a formula without `\\`, `\,`, `\{`… (Markdown would eat these backslashes):

```
$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$
```

A formula in the text, as inline code between `$`:

```
The famous `$E = mc^2$`.
```

A single `$` in the text is left alone, so prices like $5 stay as they are. The speaker view shows the formulas too, and so do the PDF and PPTX exports.

KaTeX is under the MIT license, see `KATEX_LICENSE`.
