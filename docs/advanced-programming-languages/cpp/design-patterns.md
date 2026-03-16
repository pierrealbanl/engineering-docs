---
id: design-patterns
title: 2. Comprendre et implémenter des design patterns
---

# Comprendre et implémenter des design patterns

> Un design pattern est une façon d’organiser le code pour résoudre un problème de manière claire, maintenable et efficace. Il aide notamment à structurer le code de manière cohérente et à éviter de réinventer des solutions déjà connues.

## 2.1. Le Factory Pattern

Le **Factory Pattern** est un design pattern dont l’objectif est de créer des objets sans exposer leur logique de création au reste du programme. Plutôt que d’instancier directement des objets avec new, on confie cette responsabilité à une factory. Nous allons l’illustrer à travers un exemple concret.

```cpp title="VehicleFactory.hpp"
#ifndef VEHICLE_FACTORY_HPP
#define VEHICLE_FACTORY_HPP

#include <functional>
#include <map>
#include <memory>
#include "IVehicle.hpp"

class VehicleFactory {
public:
    VehicleFactory();
    std::unique_ptr<IVehicle> create(const std::string &key, Color color);
private:
    std::map<std::string, std::function<std::unique_ptr<IVehicle>(Color)>> _map;
};

#endif
```

```cpp title="VehicleFactory.cpp"
#include "VehicleFactory.hpp"
#include <memory>
#include "VehicleA.hpp"
#include "VehicleB.hpp"

VehicleFactory::VehicleFactory() {
    /**
     * `std::make_unique` sert à créer un objet alloué dynamiquement
     * et à le placer directement dans un `std::unique_ptr`.
     *
     * `std::unique_ptr` possède un objet dynamique et gère automatiquement sa destruction.
     */
    _map["vA"] = [](Color c) {
        return std::make_unique<VehicleA>(c);
    };

    _map["vB"] = [](Color c) {
        return std::make_unique<VehicleB>(c);
    };
}

std::unique_ptr<IVehicle> VehicleFactory::create(const std::string &key, const Color color) {
    const auto it = _map.find(key);

    if (it == _map.end())
        return nullptr;
    return it->second(color);
}
```

```cpp title="main.cpp"
#include "VehicleFactory.hpp"

int main() {
    VehicleFactory vehicleFactory;
    const std::unique_ptr<IVehicle> vA = vehicleFactory.create("vA", Color::Red);
    const std::unique_ptr<IVehicle> vB = vehicleFactory.create("vB", Color::White);

    vA->displayFuelType();
    vB->displayFuelType();
}
```

On utilise une map qui associe une clé (string) à une fonction capable de créer un `IVehicle`.
Dans le constructeur de la factory, on enregistre les différentes clés possibles avec leur fonction de création (lambdas).
La méthode `create(...)` vérifie si la clé existe et, si oui, appelle la fonction correspondante pour créer et retourner un `std::unique_ptr<IVehicle>`.
