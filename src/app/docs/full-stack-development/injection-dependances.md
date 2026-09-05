---
title: 1. L'injection de dépendances
sidebar_label: 1. L'injection de dépendances
sidebar_position: 1
---

# L'injection de dépendances

**L’injection de dépendances** (DI — Dependency Injection) est une technique de développement logiciel qui permet de créer des objets qui dépendent d’autres objets. Elle facilite les interactions entre les classes tout en permettant de garder les classes indépendantes les unes des autres.

Il existe trois types de classes dans l’injection de dépendances :

- La dépendance (aussi appelée service dans la littérature sur la DI) est une classe qui peut être utilisée.
- Le client est une classe qui utilise la dépendance.
- L’injecteur transmet ou fournit la dépendance (le service) à la classe dépendante (le client).

## 1.1. Le principe du faible couplage

L’injection de dépendances permet de rendre les classes moins dépendantes les unes des autres. Cela signifie que la création des dépendances du client est séparée du comportement du client, ce qui facilite les tests unitaires.

### 1.1.1. Sans injection de dépendances

Dans le code suivant, il n’y a pas d’injection de dépendances, car la classe cliente `Car` crée elle-même un objet de la classe de service :

```java
public class Car {
  private Engine engine;

  public Car() {
    engine = new DieselEngine();
  }
}
```

Ici, `Car` fait deux choses : elle crée elle-même son moteur avec `new DieselEngine()`, et elle utilise ce moteur dans son comportement. Donc `Car` est fortement liée à `DieselEngine`.

### 1.1.2. Avec injection de dépendances

Dans le code suivant, l’objet de service n’est pas créé directement dans la classe cliente. Il est transmis comme paramètre au constructeur de la classe :

```java
public class Car {
  private Engine engine;

  public Car(Engine engine) {
    this.engine = engine;
  }
}
```

Ici, `Car` ne crée plus le moteur. Elle dit simplement : "Donne-moi un `Engine`, et moi je saurai l’utiliser."

La création est faite ailleurs :

```java
Engine engine = new DieselEngine();
Car car = new Car(engine);
```

## 1.2. Utilisation d’une interface et des mocks pour les tests

La dépendance peut aussi être déclarée sous forme d'interface. La classe cliente dépend alors du contrat et non d'une implémentation précise, ce qui permet de lui fournir n'importe quelle implémentation, y compris un mock lors des tests :

```java
public interface Engine {
  void start();
}
```

```java
public class DieselEngine implements Engine {
  @Override
  public void start() {
    // Démarrage d'un moteur diesel
  }
}
```

```java
public class Car {
  private Engine engine;

  public Car(Engine engine) {
    this.engine = engine;
  }

  public void startCar() {
    engine.start();
  }
}
```

```java
Engine engineMock = mock(Engine.class);
Car car = new Car(engineMock);

car.startCar();
verify(engineMock).start();
```

Ici, le mock remplace temporairement le vrai moteur.

## 1.3. Les différents types d’injection de dépendances

En résumé, dans le premier exemple, `Car` décide elle-même de créer son `Engine` avec `new DieselEngine()`. Dans le deuxième, `Car` reçoit son `Engine` depuis l’extérieur : c’est le principe de l’injection de dépendances.

Il existe différents types d’injection de dépendances ; deux sont présentés ici :

- Injection par constructeur (Constructor injection) : les dépendances sont transmises au constructeur de la classe cliente. Un exemple d’injection par constructeur a déjà été montré dans le code précédent de la classe `Car`. L’injection par constructeur est recommandée pour les dépendances obligatoires. Toutes les dépendances sont fournies via le constructeur de la classe, et un objet ne peut pas être créé sans ses dépendances requises.
- Injection par setter (Setter injection) : les dépendances sont fournies à travers des méthodes setter. Le code suivant montre un exemple :

```java
public class Car { 
  private Engine engine; 

  public void setEngine(Engine engine) { 
    this.engine = engine;
  } 
}
```

Ici, la dépendance est désormais transmise au setter en tant qu’argument. L’injection par setter est plus flexible, car les objets peuvent être créés sans avoir immédiatement toutes leurs dépendances. Cette approche permet donc d’avoir des dépendances optionnelles.

## 1.4. Avantages de l’injection de dépendances

L’injection de dépendances réduit les dépendances directes dans le code, le rend plus réutilisable et améliore sa testabilité. Les bases de l’injection de dépendances étant désormais présentées, la suite explique son utilisation dans Spring Boot.

## 1.5. Utilisation de l’injection de dépendances dans Spring Boot

Dans le framework Spring, l’injection de dépendances est réalisée grâce au Spring `ApplicationContext`.

L’`ApplicationContext` est responsable de la création et de la gestion des objets, appelés **beans**, ainsi que de leurs dépendances.

Spring Boot analyse les classes de l’application et enregistre comme beans Spring celles qui utilisent certaines annotations (`@Service`, `@Repository`, `@Controller`, etc.). Ces beans peuvent ensuite être injectés à l’aide de l’injection de dépendances.

### 1.5.1. Injection par constructeur

Les dépendances sont injectées via un constructeur. C’est la méthode la plus recommandée, car elle garantit que toutes les dépendances nécessaires sont disponibles lors de la création de l’objet.

L’accès à une base de données pour effectuer certaines opérations est un besoin courant. Dans Spring Boot, des classes de type repository remplissent ce rôle. Une classe repository peut être injectée à l’aide de l’injection par constructeur, puis ses méthodes peuvent être utilisées comme dans l’exemple ci-dessous :

```java
// Injection par constructeur
@Service
public class CarService {
  private final CarRepository carRepository;

  public CarService(CarRepository carRepository) {
    this.carRepository = carRepository;
  }

  // Récupérer toutes les voitures depuis la base de données
  public List<Car> findAllCars() {
    return carRepository.findAll();
  }
}
```

:::info
`@Service` n'est pas nécessaire à la compréhension de l'injection par constructeur.
:::

Avec un seul constructeur, ce qui est le cas courant, l’annotation `@Autowired` est inutile : depuis Spring 4.3, Spring utilise automatiquement l’unique constructeur disponible. En revanche, si une classe possède plusieurs constructeurs, cette annotation permet de définir celui à utiliser pour l’injection de dépendances :

```java
// Constructeur à utiliser pour l'injection de dépendances
@Autowired
public CarService(CarRepository carRepository) {
  this.carRepository = carRepository;
}
```

:::info
`@Autowired` est une étiquette que Spring lit pour savoir où injecter.
:::

### 1.5.2. L'injection par setter

Les dépendances sont injectées au moyen de méthodes setter annotées `@Autowired`. Cette forme se rencontre encore dans du code ancien, mais elle est rare : dans le code Spring moderne, le constructeur est la pratique établie.

```java
@Service
public class CarService {
  private CarRepository carRepository;

  @Autowired
  public void setCarRepository(CarRepository carRepository) {
    this.carRepository = carRepository;
  }
}
```

Un défaut est d'ailleurs visible ci-dessus : le champ ne peut pas être déclaré `final`. En Java, un champ `final` doit être assigné au plus tard à la fin du constructeur, or un setter s'exécute après la construction. L'ajouter empêche donc la compilation :

```java
private final CarRepository carRepository;

@Autowired
public void setCarRepository(CarRepository carRepository) {
  this.carRepository = carRepository; // erreur : cannot assign a value to final variable
}
```

La dépendance reste donc modifiable à tout moment, alors que le constructeur permet de la figer une fois pour toutes.
