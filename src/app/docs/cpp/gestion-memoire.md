---
title: 2. Gestion de la mémoire et pointeurs
sidebar_label: 2. Gestion de la mémoire et pointeurs
sidebar_position: 2
---

# Gestion de la mémoire et pointeurs

En C++, la gestion de la mémoire est un aspect fondamental du langage. Lorsqu'un objet est alloué dynamiquement (avec `new`), il faut s'assurer qu'il sera correctement libéré (avec `delete`). Oublier de libérer la mémoire provoque une fuite mémoire, et libérer deux fois la même mémoire provoque un comportement indéfini.

Pour éviter ces problèmes, le C++ moderne propose des smart pointers qui gèrent automatiquement la durée de vie des objets alloués dynamiquement.

## 2.1. La possession exclusive : unique pointer

> **Un unique pointer** `std::unique_ptr<T>` est un smart pointer qui possède exclusivement l'objet vers lequel il pointe. Lorsqu'il est détruit (par exemple en sortant de sa portée), l'objet pointé est automatiquement libéré.

Un unique pointer ne peut pas être copié, car cela signifierait que deux pointeurs possèdent le même objet. En revanche, il peut être déplacé (transféré) vers un autre unique pointer via `std::move(...)`.

```cpp title="main.cpp"
#include <iostream>
#include <memory>

#include "TextDocument.hpp"

int main() {
    // Crée un unique_ptr qui possède un objet TextDocument
    std::unique_ptr<TextDocument> document = std::make_unique<TextDocument>(ThemeColor::Red);
    document->showDocumentType();

    // Transfert de possession : `document` ne possède plus rien après cette ligne
    std::unique_ptr<TextDocument> transferredDocument = std::move(document);

    // `document` est maintenant nullptr
    if (!document)
        std::cout << "document ne possède plus rien" << std::endl;

    // `transferredDocument` possède désormais l'objet
    transferredDocument->showDocumentType();

    // L'objet est automatiquement détruit à la fin du scope
}
```

:::info
`std::make_unique<T>(args)` est la façon recommandée de créer un unique pointer.
:::

### 2.1.1. Utilisation avec le polymorphisme

On peut stocker un pointeur vers une sous-classe dans un unique pointer de type parent :

```cpp title="main.cpp"
#include <memory>

#include "TextDocument.hpp"
#include "ImageDocument.hpp"

int main() {
    // Le type réel est TextDocument, mais le pointeur est de type IDocument
    std::unique_ptr<IDocument> document = std::make_unique<TextDocument>(ThemeColor::Red);
    document->showDocumentType();

    // On peut réassigner vers un autre type dérivé
    document = std::make_unique<ImageDocument>(ThemeColor::White);
    document->showDocumentType();
}
```

### 2.1.2. Passer un unique pointer en paramètre

Passer un unique pointer par valeur à une fonction transfère la possession à cette fonction. L'appelant perd alors l'accès à l'objet :

```cpp title="main.cpp"
void process(std::unique_ptr<IDocument> document) {
    document->showDocumentType();
    // `document` est détruit à la fin de la fonction
}

int main() {
    std::unique_ptr<TextDocument> document = std::make_unique<TextDocument>(ThemeColor::Red);

    // std::move est obligatoire : on transfère explicitement la possession
    process(std::move(document));

    // `document` est maintenant nullptr
}
```

:::warning
Si une fonction a seulement besoin d'utiliser l'objet sans en prendre possession, il ne faut pas passer un unique pointer. On passe plutôt une référence ou un pointeur brut (voir section 2.2).
:::

## 2.2. Non-owning : pointeur brut vs référence

Tous les accès à un objet ne nécessitent pas d'en posséder la mémoire. Lorsqu'une fonction a seulement besoin de lire ou modifier un objet sans en gérer la durée de vie, on utilise un accès non-owning : soit une référence, soit un pointeur brut.

> Un accès non-owning signifie que l'on accède à un objet sans être responsable de sa destruction. On ne fait qu'observer ou utiliser l'objet, quelqu'un d'autre s'occupe de sa durée de vie.

### 2.2.1. La référence

> Une référence est un alias vers un objet existant. Elle ne peut pas être nulle et doit être initialisée à sa déclaration. Elle ne peut pas être réassignée vers un autre objet.

La référence est le choix par défaut pour un accès non-owning :

```cpp title="main.cpp"
// `const` : la fonction observe l'objet sans le modifier
void display(const IDocument &document) {
    document.showDocumentType();
}

// Sans `const` : la fonction peut modifier l'objet
void changeTheme(IDocument &document) {
    document.updateThemeColor(ThemeColor::Black);
}

int main() {
    std::unique_ptr<TextDocument> document = std::make_unique<TextDocument>(ThemeColor::Red);

    display(*document);
    changeTheme(*document);
}
```

### 2.2.2. Le pointeur brut (raw pointer)

> Un pointeur brut est une variable qui contient l'adresse mémoire d'un objet. Contrairement à une référence, il peut être `nullptr` (ne pointer vers rien) et peut être réassigné.

En C++ moderne, un pointeur brut utilisé comme accès non-owning signifie *"je pointe vers un objet, mais je n'en suis pas responsable"*. On l'utilise à la place d'une référence lorsque la valeur `nullptr` a un sens (paramètre optionnel) :

```cpp title="main.cpp"
// Le paramètre `logger` est optionnel : il peut être nullptr
void process(IDocument &document, Logger *logger) {
    if (logger)
        logger->log("Processing document...");
    document.showDocumentType();
}

int main() {
    std::unique_ptr<TextDocument> document = std::make_unique<TextDocument>(ThemeColor::Red);

    // Appel sans logger
    process(*document, nullptr);
}
```

### 2.2.3. Référence ou pointeur brut : comment choisir

La règle est simple :

- Référence : quand l'objet est toujours présent (pas de cas `nullptr`). C'est le choix par défaut.
- Pointeur brut : quand l'objet est optionnel (peut être `nullptr`).
