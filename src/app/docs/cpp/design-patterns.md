---
title: 3. Comprendre et implémenter des design patterns
sidebar_label: 3. Comprendre et implémenter des design patterns
sidebar_position: 3
---

# Comprendre et implémenter des design patterns

> Un design pattern est une façon d’organiser le code pour résoudre un problème de manière claire, maintenable et efficace. Il aide notamment à structurer le code de manière cohérente et à éviter de réinventer des solutions déjà connues.

## 3.1. Le Factory Pattern

Le **Factory Pattern** est un design pattern dont l’objectif est de créer des objets sans exposer leur logique de création au reste du programme. Plutôt que d’instancier directement des objets avec new, on confie cette responsabilité à une factory. L’exemple suivant illustre ce fonctionnement.

```cpp title="DocumentFactory.hpp"
#ifndef DOCUMENT_FACTORY_HPP
#define DOCUMENT_FACTORY_HPP

#include <functional>
#include <map>
#include <memory>
#include <string>

#include "IDocument.hpp"

class DocumentFactory {
public:
    DocumentFactory();
    std::unique_ptr<IDocument> build(const std::string &key, ThemeColor themeColor);
private:
    std::map<std::string, std::function<std::unique_ptr<IDocument>(ThemeColor)>> _builders;
};

#endif
```

```cpp title="DocumentFactory.cpp"
#include <memory>
#include <string>

#include "DocumentFactory.hpp"
#include "TextDocument.hpp"
#include "ImageDocument.hpp"

DocumentFactory::DocumentFactory() {
    /**
     * `std::make_unique` sert à créer un objet alloué dynamiquement
     * et à le placer directement dans un `std::unique_ptr`.
     *
     * `std::unique_ptr` possède un objet dynamique et gère automatiquement sa destruction.
     */
    _builders["textDocument"] = [](ThemeColor c) {
        return std::make_unique<TextDocument>(c);
    };

    _builders["imageDocument"] = [](ThemeColor c) {
        return std::make_unique<ImageDocument>(c);
    };
}

std::unique_ptr<IDocument> DocumentFactory::build(const std::string &key, const ThemeColor themeColor) {
    const auto it = _builders.find(key);

    if (it == _builders.end())
        return nullptr;
    return it->second(themeColor);
}
```

```cpp title="main.cpp"
#include "DocumentFactory.hpp"

int main() {
    DocumentFactory documentFactory;
    const std::unique_ptr<IDocument> textDocument = documentFactory.build("textDocument", ThemeColor::Red);
    const std::unique_ptr<IDocument> imageDocument = documentFactory.build("imageDocument", ThemeColor::White);

    textDocument->showDocumentType();
    imageDocument->showDocumentType();
}
```

On utilise une map qui associe une clé (string) à une fonction capable de créer un `IDocument`.
Dans le constructeur de la factory, on enregistre les différentes clés possibles avec leur fonction de création (lambdas).
La méthode `build(...)` vérifie si la clé existe et, si oui, appelle la fonction correspondante pour créer et retourner un `std::unique_ptr<IDocument>`.
