YOG’N MOOV · MES PREMIERS PAS EN POLE DANCE

CONTENU
- index.html : l’application (design, coches, combos, progrès)
- figures.js : TES figures, tes niveaux, tes combos, tes conseils et ton lexique des grips (le seul fichier à modifier)
- manifest.webmanifest, sw.js, icons/ : installation sur l’écran d’accueil et fonctionnement hors connexion

AJOUTER OU MODIFIER DES FIGURES, DES NIVEAUX, DES COMBOS
1. Ouvre figures.js dans un éditeur de texte (ou sur GitHub : clique sur le fichier, puis sur le crayon).
2. Pour ajouter une figure : écris son nom entre guillemets dans la liste du niveau, suivi d’une virgule. Exemple : "Ma nouvelle figure",
3. Pour ajouter un niveau : copie un bloc entre accolades { ... }, change id (unique, sans accent), court, nom et la liste des figures.
4. Pour ajouter un combo : ajoute une ligne ["Nom du combo",["figure 1","figure 2"]], avec les noms exactement comme dans les listes.
5. Conseils et lexique : même principe, une ligne ["titre","texte"] par conseil ou par grip.
6. Enregistre (sur GitHub : « Commit changes »). Les élèves voient la mise à jour à leur prochaine ouverture avec internet.

À SAVOIR
- Chaque nom de figure ne doit apparaître qu’une seule fois.
- La progression est suivie par le nom de la figure : déplacer une figure d’un niveau à un autre ne fait rien perdre, mais la renommer remet son suivi à zéro pour les élèves.
- Une virgule oubliée ou un guillemet en trop peut faire planter la page : après une modification, ouvre le lien pour vérifier.
- Un combo dont un nom ne correspond à aucune figure n’est simplement pas affiché.

MISE EN LIGNE SUR GITHUB PAGES
1. Décompresse le ZIP.
2. Dans le dépôt GitHub destiné à l’application, ajoute tous les fichiers et le dossier icons à la racine.
3. Dans Settings > Pages, active le déploiement depuis la branche principale (main), dossier /(root).
4. Attends l’adresse HTTPS publiée par GitHub Pages, puis teste le lien sur un téléphone.

INSTALLATION
- Android/Chrome : ouvrir le lien puis menu ⋮ > Installer l’application ou Ajouter à l’écran d’accueil.
- iPhone/Safari : ouvrir le lien, toucher Partager, puis Sur l’écran d’accueil.

IMPORTANT
La progression est enregistrée localement sur le téléphone de l’élève. Elle n’est ni synchronisée entre appareils ni visible par l’enseignante. Si l’élève efface les données du navigateur, sa progression peut être perdue.
Les figures et les niveaux sont indicatifs : à valider par l’enseignante avant commercialisation. Les figures aériennes ne s’apprennent qu’avec un encadrement adapté.
