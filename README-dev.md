# Documentation de dev Monitoring <!-- omit in toc -->

- [Tests frontend](#tests-frontend)
  - [Architecture pour implémenter cypress dans Monitoring](#architecture-pour-implémenter-cypress-dans-monitoring)
  - [Lancement des tests depuis environement GeoNature](#lancement-des-tests-depuis-environement-geonature)

## Tests frontend

### Architecture pour implémenter cypress dans Monitoring

Pour pouvoir réaliser les test frontend en s'appuyant sur la config cypress de l'environnement GeoNature. Il faut au préalable créer un dossier cypress à la racine du module monitoring et également ajouter un fichier `tsconfig.json` à la racine du dossier frontend du module monitoring.

```sh

frontend
├── frontend/angular.json
├── frontend/app
├── frontend/assets
├── frontend/cypress
├── frontend/cypress/fixtures
    └── frontend/cypress/fixtures/moduleconfig.json
├── frontend/cypress/integration
│   ├── frontend/cypress/integration/monitoring-home-page.spec.js
│   └── frontend/cypress/integration/monitoring-page.spec.js
└── frontend/cypress/support
    └── frontend/cypress/support/commands.js
├── frontend/package.json
├── frontend/package-lock.json
└── frontend/tsconfig.json

```

### Lancement des tests depuis environement GeoNature

Au préalable il faut ajouter la ligne suivante dans le fichier `frontend/cypress/support/index.ts` pour étendre les `commands` existantes dans GeoNature afin d'ajouter les `commands` propres au module Monitoring.

```ts
import '../../external_modules/monitorings/cypress/support/commands'
```

Une fois les tests mis en place et les commands créées, et la modification du fichier `frontend/cypress/support/index.ts` on peut alors lancer les tests depuis l'environnemnt de GeoNature en appliquant les commandes suivantes:

```sh

cd /path/geonature/frontend
nvm use
npx cypress open --config integrationFolder=/path/geoanture/frontend/external_modules/monitorings/cypress/integration

```
