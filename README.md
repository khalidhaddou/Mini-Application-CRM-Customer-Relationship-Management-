# CRM - Application de Gestion de la Relation Client (Admin & Employé)

## Objectif du Projet
Ce projet consiste en une mini application CRM (Customer Relationship Management) permettant de relier une entreprise à ses employés via une interface web sécurisée. L'application inclut deux espaces distincts : un espace pour les administrateurs et un autre pour les employés.

---

## Technologies utilisées

- **Back-end** : Laravel
- **Front-end** : React.js

---

## Prérequis

Avant de commencer, assurez-vous que vous avez installé les outils suivants sur votre machine :

- **PHP** (version 8.0 ou supérieure)
- **Composer** : [Installer Composer](https://getcomposer.org/)
- **Node.js** (version 14 ou supérieure)
- **npm** ou **yarn**
- **Git** : [Télécharger Git](https://git-scm.com/)

---

## Installation

### Étape 1 : Cloner le dépôt

Clonez le projet GitHub dans le répertoire de votre choix :

```bash
git clone https://github.com/khalidhaddou/Mini-Application-CRM-Customer-Relationship-Management-.git


### Étape 2 : Configuration du Back-End (Laravel)

Installer les dépendances PHP avec Composer :
Dans le répertoire du projet, exécutez la commande suivante pour installer les dépendances du back-end (Laravel) :
composer install
Exécuter les migrations :
Appliquez les migrations pour créer les tables nécessaires dans la base de données :
php artisan migrate
Exécuter les Seeders :
php artisan db:seed


Étape 3 : Configuration du Front-End (React.js)
Naviguer dans le répertoire client : dans un sous-dossier  mini-crm_Frontend,
Installer les dépendances JavaScript :
Installez les dépendances nécessaires avec npm
npm install


Étape 4 : Lancer l'application
Lancer le serveur back-end :
Revenez au répertoire principal du projet et lancez le serveur Laravel :
php artisan serve
Cela démarrera l'application Laravel à l'adresse http://localhost:8000.
Lancer le serveur front-end :
Dans le répertoire mini-crm_Frontend, exécutez la commande suivante pour démarrer l'application React en mode développement :
Cela démarrera l'application React à l'adresse http://localhost:3000.


Test de l'application
Connexion en tant qu'Administrateur
Après avoir exécuté les étapes précédentes, vous pouvez vous connecter à l'application en utilisant les informations suivantes :
Email : admin@example.com
Mot de passe : password

Cela vous permettra d'accéder à l'espace administrateur et de tester les fonctionnalités réservées à cet espace.


Connexion en tant qu'Employé
Un employé peut se connecter en utilisant les informations suivantes après avoir validé l'invitation par email :
Email : employee2@example.com
Mot de passe : password

Cela vous permettra de tester l'espace employé avec des fonctionnalités limitées à la gestion de son profil et l'affichage des informations de l'entreprise et des collègues.
