# Architecture du projet

Ce document décrit l'organisation du dossier `src/app/`, le rôle des composants et du service de données. Il complète le [README.md](README.md).

## Arborescence

```
src/app/
  ├── components/        # éléments visuels réutilisables, sans logique métier
  │     ├── header/
  │     ├── back-link/
  │     ├── card/
  │     ├── stat-card/
  │     ├── chart/
  │     ├── dashboard-layout/
  │     └── error-message/
  ├── pages/              # écrans complets, associés à une route
  │     ├── home/
  │     ├── country/
  │     └── not-found/
  ├── services/           # accès aux données et logique transverse
  │     ├── data.service.ts
  │     └── navigation.service.ts
  ├── models/             # interfaces TypeScript
  │     ├── Olympic.ts
  │     ├── Participation.ts
  │     └── Errors.ts
  ├── app.component.ts
  ├── app.routes.ts
  └── app.config.ts
```

Tous les composants sont des **standalone components** (pas de `NgModule`), déclarant leurs propres dépendances via `imports`.

## Les composants

| Composant | Rôle |
|---|---|
| `HeaderComponent` | Bandeau de titre affiché sur toutes les pages (via `app.component.html`) |
| `BackLinkComponent` | Lien de retour, s'appuie sur `NavigationService` pour revenir en arrière intelligemment |
| `CardComponent` | Pattern visuel "carte" (padding/bordure), avec variante `filled` |
| `StatCardComponent` | Bloc "chiffre clé" (titre + valeur), construit sur `CardComponent` |
| `DashboardLayoutComponent` | Structure commune d'une page dashboard (titre + zone de contenu) |
| `ChartComponent` | Encapsule Chart.js ; affiche un graphique `pie` ou `line` selon les `@Input()` reçus (labels, data, couleurs...) et émet un événement `pointClick` au clic sur un point/segment |
| `ErrorMessageComponent` | Affiche un message d'erreur formaté |

Les pages (`HomeComponent`, `CountryComponent`, `NotFoundComponent`) assemblent ces composants et consomment `DataService` : elles portent la logique propre à l'écran (calcul des totaux, navigation), sans dupliquer le HTML/CSS générique.

## Le service `DataService`

`src/app/services/data.service.ts` est le point d'accès unique aux données des Jeux Olympiques :

- fourni en `providedIn: 'root'` → **singleton**, une seule instance pour toute l'app ;
- charge les données une seule fois via `HttpClient.get<Olympic[]>()` et les met en cache avec `shareReplay(1)` (l'appel HTTP n'est donc pas refait à chaque navigation entre `home` et `country`) ;
- transforme les erreurs HTTP en `OlympicDataError` (voir `models/Errors.ts`), propagée aux pages qui l'affichent via `ErrorMessageComponent` ;
- expose les données typées (`Observable<Olympic[]>`) via `getOlympics()`.

`NavigationService` est un service secondaire, dédié à la gestion du bouton "retour" (historique de navigation interne à l'app).

## Préparation à une future connexion back-end

`DataService` est le seul point de contact avec la source de données, dont l'URL est centralisée dans `environment.ts` (actuellement `./assets/mock/olympic.json`). Le jour où cette source devient une API REST réelle, seule cette URL change : les modèles, les pages et les composants n'ont pas besoin d'être modifiés, puisqu'ils ne dépendent que de l'interface `Observable<Olympic[]>` exposée par le service.  
Il faudra faire attention à bien distinguer l'URL de production (dans `environment.production.ts`) et celle de développement (`environment.ts`).

## Conventions du projet

- **Pas de `any`** : toute donnée manipulée doit être typée (interface de `models/`, ou type explicite). Le compilateur doit rester un vrai garde-fou ; un `any` fait perdre ce bénéfice sans prévenir.
- **Nomenclature des commits** : `type: Description`, en français, description commençant par une majuscule. Types utilisés dans ce projet : `feat` (nouvelle fonctionnalité), `refactor` (réorganisation sans changement de comportement), `tests`, `chore` (outillage/config), `docs`. Un commit = un sujet cohérent (éviter de mélanger un refacto et une feature dans le même commit).
- **Avant de committer** :
  1. `npm run lint` — corriger les erreurs remontées (pas de `--fix` aveugle sans relire le diff) ;
  2. `npm run type-check` — aucune erreur TypeScript ;
  3. `npm test` — les tests existants passent, et toute nouvelle logique métier est couverte ;
  4. relire son propre diff (`git diff`) : vérifier l'absence de `console.log` de debug, de code commenté, de TODO oublié.
- **Composants** : garder les composants de `components/` "dumb" (pilotés uniquement par leurs `@Input()`/`@Output()`, sans dépendance à un service) ; la logique métier reste dans les `pages/` et les `services/`.
- **Accès aux données** : toujours passer par `DataService` (ou un futur service dédié), jamais d'appel `HttpClient` direct dans un composant de page.
