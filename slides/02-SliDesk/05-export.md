## Exporter et partager
//@ [] 01:00

```sh
slidesk export ma-presentation         # ma-presentation.pdf
slidesk export -t pptx ma-presentation # ma-presentation.pptx
slidesk save -t public ma-presentation # un site statique
slidesk link host ma-presentation      # en ligne pendant 72 h
```

PDF, PowerPoint, un site statique pour GitHub ou GitLab Pages, ou un hébergement sur [slidesk.link](https://slidesk.link).

!image(assets/media/screenshots/slidesk-link.png, Partage d'une présentation sur slidesk.link, 800)

/*
Tout ce qu'on écrit en Markdown ressort ailleurs.

slidesk export produit un PDF vectoriel au texte sélectionnable, ou un PowerPoint avec les notes du présentateur dans le panneau dédié.

slidesk save génère un site statique prêt pour GitHub ou GitLab Pages : c'est exactement ce que fait cette présentation.

Et slidesk link host met le talk en ligne sur slidesk.link pendant 72 heures, avec la vue du public et celle du présentateur : pratique pour répéter ou animer une session à distance.
*/
