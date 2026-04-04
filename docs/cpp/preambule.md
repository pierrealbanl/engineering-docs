---
id: preambule
title: Préambule
---

# Préambule

Le CPP est un langage de programmation compilé et hautement performant, conçu comme une évolution du langage C. Il introduit des abstractions de haut niveau tout en conservant un contrôle précis des ressources matérielles et des performances. L’objectif du CPP est de permettre à la fois la programmation bas niveau, à l’image du C, et la programmation haut niveau structurée, sans compromis sur l’efficacité ni sur la rapidité d’exécution.

La différence fondamentale entre le C et le CPP **réside dans leur paradigme de programmation.** Le C repose sur une approche **procédurale**, centrée sur les fonctions et les structures de données, tandis que le CPP est **un langage multiparadigme. Il intègre la programmation procédurale héritée du C, la programmation orientée objet, ainsi que des concepts issus de la programmation fonctionnelle.**

### Transition du C vers le CPP

Pour la manipulation des chaînes de caractères, l’approche est différente. En C++, on n’utilise plus `char *` pour gérer les chaînes, mais le type `std::string` fourni par la bibliothèque standard. Celui-ci gère automatiquement la mémoire, la taille de la chaîne et les opérations courantes (concaténation, comparaison, accès aux caractères), ce qui évite les erreurs classiques comme les débordements de mémoire.

De la même manière, pour l’affichage en sortie standard, on n’utilise plus `printf`, mais la bibliothèque `<iostream>` avec `std::cout`, qui repose sur un système de flux typé et mieux intégré au langage C++.

```cpp
#include <iostream>
#include <string>

// Exemple simple de manipulation de chaînes en C++
int main() {
    std::string str = "Hello"; // Chaîne de caractères C++ : mémoire gérée automatiquement, taille dynamique
    str += " World!"; // Concaténation (équivalent fonctionnel de strcat en C)
    const char* p = str.c_str(); // Donne un accès en lecture seule au contenu de la chaîne au format C (char*)

    std::cout << p << std::endl; // Affichage sur la sortie standard via un flux
}
```

À noter que `<<` est l’opérateur d’insertion dans un flux. Il permet d’envoyer des données vers un flux de sortie, ici `std::cout`. L’instruction `std::cout << p << std::endl;` insère donc le contenu pointé par p dans le flux de sortie standard, puis ajoute un saut de ligne.
