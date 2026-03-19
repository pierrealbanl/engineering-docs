---
id: shared-dynamic-libraries
title: 3. Les bibliothèques dynamiques partagées
---

> Une bibliothèque dynamique partagée (`.so` sous Linux) est un fichier contenant du code compilé qui est chargé au moment de l’exécution et partagé entre plusieurs programmes.

Il existe deux façons d’utiliser une bibliothèque dynamique partagée : soit au moment de la compilation, soit directement pendant l’exécution du programme.

Dans le premier cas, on parle de liaison “automatique”. On indique simplement au compilateur que le programme dépend d’une bibliothèque, et le système se charge de la charger tout seul quand le programme démarre.

```
g++ main.cpp -L. -lmathlib -o main
```

Ici, le programme est lié à la bibliothèque lors de la compilation, et il la trouvera automatiquement à l’exécution.

Dans le second cas, la bibliothèque est chargée “manuellement” pendant l’exécution. C’est le programme lui-même qui décide quand et comment charger la bibliothèque. Pour ça, on utilise libdl, qui fournit des fonctions comme `dlopen` (charger la bibliothèque), `dlsym` (accéder aux fonctions) et `dlclose` (la fermer).

```
g++ main.cpp -ldl
```

Ce mode est utile par exemple pour les plugins ou quand on veut charger des fonctionnalités à la demande.

## 3.1. Le problème du name mangling et sa solution

**Le name mangling** est un mécanisme en C++ où le compilateur : **modifie le nom des fonctions pour y inclure des informations sur leurs paramètres**

```cpp
/* Même nom, fonctions différentes => surcharge
 * Mais au niveau machine, deux fonctions ne peuvent pas avoir le même nom.
 * Solution : le compilateur change les noms.
 */

int add(int a, int b); => _Z3addii
double add(double a, double b); => _Z3adddd
```

En C++, le nom des fonctions est modifié par le compilateur à cause du name mangling, ce qui produit des symboles avec des noms complexes et difficiles à lire.

Certaines bibliothèques, comme `libdl`, et en particulier la fonction `dlsym`, ont besoin du nom exact du symbole pour pouvoir retrouver une fonction dans une bibliothèque partagée.

Or, à cause du mangling, le nom réel ne correspond plus au nom écrit dans le code. Pour remédier à cela, il faut utiliser : `extern "C"`

```cpp
extern "C" {
    int func() {
        // ...
    }
}
```
