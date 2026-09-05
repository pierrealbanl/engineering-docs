---
title: Préambule
sidebar_label: Préambule
sidebar_position: 0
---

# Préambule

Cette section s’adresse aux personnes souhaitant apprendre le développement full stack, en commençant par Spring Boot, puis en poursuivant avec React. Cette documentation s’appuie sur l’ouvrage de Juha Hinkula, intitulé *Full Stack Development with Spring Boot 3 and React*. Les exemples proposés reposent sur cet ouvrage, ce qui explique leurs éventuelles différences avec ceux de la documentation C++. Les notions fondamentales de Java ne sont pas abordées en détail ; la documentation C++ fournit toutefois les bases nécessaires à la compréhension de cette section.

## Création et configuration d’un projet Spring Boot avec Gradle

Commencer par ouvrir [https://start.spring.io/](https://start.spring.io/), un outil web permettant de générer facilement un projet Spring Boot. Les paramètres par défaut affichés dans la partie gauche peuvent être conservés. Les champs **Group**, **Artifact** et **Package name** peuvent toutefois être adaptés au projet.
Dans la partie droite, ajouter ensuite les deux dépendances utiles au développement full stack : **Spring Web** et **Spring Boot DevTools**.

:::info
Une notion importante à connaître est Gradle. Gradle est un **outil d’automatisation de build** principalement utilisé pour les projets Java et Android. Il permet notamment de **compiler le code, gérer les dépendances, exécuter les tests et générer l’application** à partir d’un fichier de configuration comme `build.gradle`.

Il existe d’autres outils de build, comme Maven, mais cette section se concentre uniquement sur Gradle.
:::

Après la génération du projet, ouvrir le dossier avec IntelliJ. En cas d’échec du build Gradle, ouvrir l’engrenage **Paramètres** en haut à droite, puis accéder à **Project Structure**. Sélectionner ensuite **SDK**, cliquer sur **Download JDK...** et choisir la **version 17** avec **Eclipse Temurin** comme fournisseur. Après l’installation du JDK, relancer le build Gradle. Si le problème persiste, une IA peut aider à l’identifier et à le résoudre.

## Structure d’une application Spring Boot et annotations principales

Dans la classe principale d’une application Spring Boot, on retrouve généralement la structure suivante :

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

}
```

La principale différence avec Java réside dans l’utilisation des annotations. La première, présente dans le fichier principal de l’application, est `@SpringBootApplication`.

| Annotation                 | Description                                                                                                                                                                                                                                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@EnableAutoConfiguration` | Active la configuration automatique de Spring Boot afin que le projet soit configuré automatiquement en fonction de ses dépendances. Par exemple, si la dépendance `spring-boot-starter-web` est présente, Spring Boot considère le projet comme une application web et configure l’application en conséquence. |
| `@ComponentScan`           | Active l’analyse des composants Spring afin de détecter tous les composants de l’application.                                                                                                                                                                                                                       |
| `@Configuration`           | Définit une classe pouvant être utilisée comme source de définitions de beans.                                                                                                                                                                                                                                      |

## Logs et résolution de problèmes

La journalisation permet de surveiller le déroulement de l’application et constitue un bon moyen d’identifier les erreurs inattendues dans le code. Le package de démarrage Spring Boot fournit Logback, utilisable pour la journalisation sans aucune configuration. L’exemple de code suivant montre comment utiliser la journalisation. Logback utilise comme interface native **Simple Logging Facade for Java, SLF4J**.

```java
package com.example.demo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

	private static final Logger logger = LoggerFactory.getLogger(DemoApplication.class);
	
	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
		logger.info("Application started");
	}

}
```
