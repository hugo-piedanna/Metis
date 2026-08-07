# Metis — Backend

API NestJS de [Metis](../README.md), l’app de gestion de stocks domestiques.

## Stack

- NestJS + TypeORM
- PostgreSQL 16
- Winston (logging)

## Ressources

| Route                         | Rôle                                              |
| ----------------------------- | ------------------------------------------------- |
| `/categories`                 | Grouper les produits                              |
| `/products`                   | Fiches produits (food / equipment) + totaux       |
| `/products/:id/stocks`        | Lignes de stock (qty + unité + expiration?)       |
| `/units`                      | Catalogue d’unités (lecture seule, seed)          |
| `/docs`                       | Swagger / OpenAPI                                 |

## Démarrage local

Préférer Docker Compose depuis la racine du monorepo (voir le [README principal](../README.md)) :

```bash
cp ../.env.exemple ../.env
docker compose up --build
```

Ou hors Docker, depuis ce dossier :

```bash
npm install
npm run start:dev
```

L’API écoute sur le port défini dans `.env` (`BACKEND_PORT`, défaut typique `3000`).

## Scripts utiles

```bash
npm run start:dev   # watch mode
npm run build
npm run lint
npm run test
```
