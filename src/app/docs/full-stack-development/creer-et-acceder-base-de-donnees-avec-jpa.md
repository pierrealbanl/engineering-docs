---
title: 2. Créer et accéder à une base de données avec JPA
sidebar_label: 2. Créer et accéder à une base de données avec JPA
sidebar_position: 2
---

# Créer et accéder à une base de données avec JPA

## 2.1. Bases de l’ORM, JPA et Hibernate

L’ORM et JPA sont des techniques largement utilisées dans le développement logiciel pour gérer les bases de données relationnelles. Elles permettent de travailler avec des objets plutôt que d’écrire des requêtes SQL complexes, ce qui est plus naturel pour les développeurs Java.

De cette manière, l’ORM et JPA peuvent accélérer le processus de développement en réduisant le temps consacré à l’écriture et au débogage du code SQL. De nombreuses implémentations de JPA peuvent également générer automatiquement un schéma de base de données à partir des classes d’entités Java. En résumé :

- **Object-Relational Mapping (ORM)** est une technique qui permet de récupérer et de manipuler une base de données en utilisant une approche de programmation orientée objet. L’ORM est particulièrement adapté aux programmeurs, car il repose sur des concepts orientés objet plutôt que sur les structures propres aux bases de données. Il accélère également le développement et réduit la quantité de code source. L’ORM est en grande partie indépendant des bases de données, et les développeurs n’ont donc pas à se préoccuper des instructions SQL spécifiques à chaque fournisseur.
- **Jakarta Persistence API (JPA)**, anciennement Java Persistence API, fournit un mécanisme de mapping objet-relationnel aux développeurs Java. Une entité JPA est une classe Java qui représente la structure d’une table de base de données. Les champs d’une classe d’entité représentent les colonnes de cette table.
- **Hibernate** est l’implémentation JPA basée sur Java la plus populaire et est utilisée par défaut dans Spring Boot. Hibernate est un produit mature et largement utilisé dans les applications à grande échelle.

## 2.2. Création des classes d’entités

Une classe d’entité est une simple classe Java annotée avec l’annotation `@Entity` de JPA. Les classes d’entités utilisent les conventions standard de nommage JavaBean et disposent de méthodes getter et setter appropriées. Les champs de la classe ont une visibilité `private`.

JPA crée une table dans la base de données portant le même nom que la classe lorsque l’application est initialisée. L’annotation `@Table` appliquée à la classe d’entité permet d’attribuer un autre nom à cette table.

### 2.2.1. Ajout des dépendances JPA et H2

Au début de cette documentation, la base de données H2 sera utilisée. Il s’agit d’une base de données embarquée pouvant fonctionner directement en mémoire. Afin d’utiliser JPA dans l’application, les dépendances nécessaires doivent être ajoutées dans le fichier `build.gradle` :

```
dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-webmvc'
	implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    developmentOnly 'org.springframework.boot:spring-boot-h2console'
    runtimeOnly 'com.h2database:h2'
}
```

- La première dépendance, `spring-boot-starter-web`, fournit les fonctionnalités nécessaires au développement d’une application web avec Spring Boot. 
- La seconde dépendance, `spring-boot-starter-data-jpa`, ajoute le support de Spring Data JPA et permet ainsi d’utiliser JPA pour l’accès et la gestion des données dans l’application.
- La troisième dépendance, `spring-boot-h2console`, permet d’activer l’interface web pour consulter la base H2 et exécuter des requêtes SQL. La configuration developmentOnly réserve cette dépendance au développement.
- La quatrième dépendance, `com.h2database:h2`, fournit le moteur de base de données H2 et son pilote JDBC. La configuration runtimeOnly indique que cette dépendance est nécessaire à l’exécution de l’application, mais pas à la compilation du code.

:::warning
Dans la barre latérale droite d’IntelliJ, cliquer sur l’icône Gradle pour ouvrir la fenêtre Gradle. Dans la barre d’outils de cette fenêtre, cliquer sur _Sync All Gradle Projects_ afin de synchroniser les projets Gradle et de prendre en compte les nouvelles dépendances.

Puis vérifier que la dépendance a bien été chargée, en cherchant dans la section _Dependencies_ de la fenêtre Gradle ou dans _Project > External Libraries_, à gauche de l’écran.
:::

### 2.2.2. Création du package `domain` et de l’entité `Car`

Une fois la dépendance ajoutée, créer un nouveau package nommé `domain` dans `src/main/java/com.XXX.XXX/`. À l’intérieur de ce package, créer ensuite une nouvelle classe Java nommée `Car` :

```java
package com.example.demo.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Car {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;

    private String brand, model, color, registrationNumber;

    private int modelYear, price;
}
```

### 2.2.3. Gestion de la clé primaire

Chaque entité JPA doit disposer d’un identifiant unique. La clé primaire est définie à l’aide de l’annotation `@Id`. L’annotation `@GeneratedValue` indique que l’identifiant est généré automatiquement par la base de données. On peut également définir la stratégie de génération de la clé. Le type `AUTO` signifie que le fournisseur JPA choisit automatiquement la stratégie la plus adaptée à la base de données utilisée. C’est aussi le type de génération utilisé par défaut. Il est également possible de créer une clé primaire composite en annotant plusieurs attributs avec l’annotation `@Id`.

### 2.2.4. Personnalisation des colonnes

Les colonnes de la base de données sont nommées, par défaut, selon les conventions de nommage des attributs de la classe. L’annotation `@Column` permet d’appliquer une autre convention de nommage, de définir la longueur de la colonne et d’indiquer si celle-ci peut accepter une valeur `null`. Le code suivant montre un exemple d’utilisation de cette annotation :

```java
package com.example.demo.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Car {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;

    @Column(name = "registration_number", nullable = false, length = 20)
    private String registrationNumber;
}
```

### 2.2.5. Ajout des constructeurs, getters et setters

Enfin, il faut ajouter à la classe d’entité les getters, les setters, un constructeur par défaut ainsi que des constructeurs avec paramètres. Le champ `ID` n’a pas besoin d’être ajouté au constructeur, car sa valeur est générée automatiquement.

```java
package com.example.demo.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Car {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;

    private String brand, model, color, registrationNumber;

    private int modelYear, price;

    public Car() {}

    public Car(String brand, String model, String color, String registrationNumber, int modelYear, int price) {
        this.brand = brand;
        this.model = model;
        this.color = color;
        this.registrationNumber = registrationNumber;
        this.modelYear = modelYear;
        this.price = price;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public int getModelYear() {
        return modelYear;
    }

    public void setModelYear(int modelYear) {
        this.modelYear = modelYear;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }
}
```

### 2.2.6. Configuration de la base de données H2

Il est également nécessaire d’ajouter de nouvelles propriétés dans le fichier `application.properties`. Celles-ci permettent d’afficher les instructions SQL dans la console et de définir l’URL de la source de données. Dans le fichier `application.properties`, ajouter les deux lignes suivantes :

```
spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.show-sql=true
```

La table `car` est désormais créée automatiquement dans la base de données lors du lancement de l’application. À ce stade, les instructions SQL utilisées pour créer la table peuvent être consultées dans la console :

```
Hibernate: drop table if exists car cascade 
Hibernate: drop sequence if exists car_seq
Hibernate: create sequence car_seq start with 1 increment by 50
Hibernate: create table car (model_year integer not null, price integer not null, id bigint not null, brand varchar(255), color varchar(255), model varchar(255), registration_number varchar(255), primary key (id))
```

La base de données H2 propose une console web permettant d’explorer la base de données et d’exécuter des requêtes SQL. Pour activer cette console, il est nécessaire d’ajouter les lignes suivantes dans le fichier `application.properties` :

```
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

- La première ligne active la console H2. 
- La seconde définit son chemin d’accès.

La console H2 est accessible après le démarrage de l’application, à l’adresse suivante dans un navigateur : `localhost:8080/h2-console`.

Dans la fenêtre de connexion, renseigner les paramètres suivants :

- JDBC URL : `jdbc:h2:mem:testdb`
- Password : laisser le champ vide

Cliquer ensuite sur le bouton `Connect` afin d’accéder à la console H2.
