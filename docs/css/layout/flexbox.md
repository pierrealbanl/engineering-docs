---
id: flexbox
title: 1.1. Flexbox
---

# Flexbox

**Flexbox _Flexible Box Layout_** est un modèle de mise en page permettant d’organiser, d’aligner et de répartir des éléments dans un conteneur, en s’appuyant sur un axe principal (défini ici comme horizontal, en ligne) et un axe secondaire (vertical, en colonne), avec un contrôle précis de l’espace et de l’alignement.

Pour activer ce modèle, il faut définir `display: flex` sur un élément. Ses enfants directs deviennent alors des éléments enfants, pouvant être manipulés via les propriétés suivantes :

![Diagram](../../../assets/flexbox.png)

## 1.1.1. `flex-direction`

La propriété `flex-direction` détermine la direction de l’axe principal dans un conteneur flex, c’est-à-dire le sens dans lequel les éléments enfants sont alignés :

```css
.container {
    display: flex;
    flex-direction: row; /* row ou column */
}
```

### 1.1.1.1. `row`

> Disposition horizontale (éléments alignés de gauche à droite)

### 1.1.1.2. `column`

> Disposition verticale (éléments alignés de haut en bas)

## 1.1.2. `align-items`

La propriété `align-items` contrôle la position des éléments enfants sur l’axe secondaire d’un conteneur flex, déterminé par `flex-direction` :

```css
.eg__container {
    display: flex;
    flex-direction: row;
    align-items: flex-start; /* flex-start, flex-end, center ou stretch */
    /* 
     * `min-height: 100vh` garantit un espace suffisant pour observer l’alignement. 
     * Sans hauteur disponible, aucun décalage visuel ne peut apparaître.
     */
    min-height: 100vh;
}
```

### 1.1.2.1. `flex-start`

> Aligne les éléments au début de l’axe secondaire (en haut si `flex-direction: row`, à gauche si `flex-direction: column`).

### 1.1.2.2. `flex-end`

> Aligne les éléments à la fin de l’axe secondaire (en bas si `flex-direction: row`, à droite si `flex-direction: column`).

### 1.1.2.3. `center`

> Centre les éléments sur l’axe secondaire.

### 1.1.2.4. `stretch`

> Étire les éléments pour remplir le conteneur sur l’axe secondaire (valeur par défaut, si aucune taille n’est définie sur cet axe).

## 1.1.3. `justify-content`

## 1.1.4. `align-content`
