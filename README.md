# Cockpit RNF

Application du Responsable National de Formation — Tapissiers.

Ce dépôt public contient uniquement **l’enveloppe technique** du cockpit. Les listes nominatives, coordonnées, données de stages privées et autres informations internes ne sont pas stockées ici.

Version courante : **v0.17**.

La PWA vérifie automatiquement les mises à jour publiées dans ce dépôt. Les données privées sont chargées séparément sur l’appareil et restent hors de ce dépôt.

## Observatoire métier

Accessible depuis une tuile de l'accueil. Il permet de consulter les ressources validées, de préparer une proposition par courriel au RNF, et de trier localement les propositions reçues. La bibliothèque partagée lit `observatoire-publications.json` : la mise en ligne d'une sélection nécessite la mise à jour explicite de ce fichier. L'espace RNF local n'est pas un contrôle d'accès ni une synchronisation multi-utilisateur. Ne pas stocker de données personnelles dans le JSON public.
