# Telesport - Olympic Games Dashboard

## Présentation fonctionnelle

Telesport est un tableau de bord permettant de visualiser les résultats des différents pays aux Jeux Olympiques. L'application affiche :

- une page d'accueil listant les pays participants avec, pour chacun, le nombre total de médailles et un graphique global de répartition des médailles par pays ;
- une page détail par pays présentant l'évolution du nombre de médailles obtenues au fil des éditions des JO, ainsi que des statistiques clés (nombre de participations, d'athlètes, de médailles).

Les données sont chargées depuis un fichier JSON local et gérées de manière centralisée via un service dédié, avec une gestion des erreurs (données manquantes, pays introuvable, etc.).

## Présentation technique

- **Framework** : Angular 18
- **Graphiques** : Chart.js

### Commandes utiles

```bash
npm install          # Installation des dépendances
npm start            # Lancer le serveur de dev (http://localhost:4200)
npm run build         # Build de production
npm test              # Lancer les tests unitaires (Karma/Jasmine)
npm run lint          # Linter le code (ESLint)
npm run type-check    # Vérification des types sans compilation
```

### Architecture (aperçu rapide)

- `components/` : composants réutilisables (header, cards, charts, layout, messages d'erreur...)
- `pages/` : composants de routing (home, country, not-found)
- `services/` : logique métier, dont `data.service.ts` qui centralise l'accès aux données
- `models/` : interfaces TypeScript (`Olympic`, `Participation`, `Errors`)

Voir le fichier `ARCHITECTURE.md`, qui détaille plus en profondeur les choix techniques et la structure du projet.
