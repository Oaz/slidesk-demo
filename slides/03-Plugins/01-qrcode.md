## Un QR code en une ligne
//@ [] 01:00

Le plugin `qrcode` transforme une div en QR code

<div class="side-by-side" style="margin-top:3vh">
<div style="flex:1">

<p><em>Le code</em></p>

```html
<div class="sd-qrcode"
     data-url="https://olivier.azeau.com"
     style="width: 500px"></div>
```

</div>
<div style="flex:1">

<p><em>Le rendu</em></p>

<div class="sd-qrcode" data-url="https://olivier.azeau.com" style="width: 500px"></div>

</div>
</div>

/*
Le plugin qrcode lit l'attribut data-url et dessine le QR code en SVG dès le chargement de la page : pas d'image à générer, si l'URL change, le code suit.

On l'a déjà utilisé au chapitre 1 pour se connecter à la partie interactive.

L'attribut data-icon ajoute une icône au centre du code, avec un niveau de correction plus élevé pour rester lisible.
*/
