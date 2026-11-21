
/* ====== TES FIGURES, TES NIVEAUX ET TES COMBOS ======
   Ajouter une figure : écris son nom entre guillemets dans la liste du niveau, suivi d’une virgule.
   Ajouter un niveau : copie un bloc entre accolades { ... }, change id (unique, sans accent), court, nom et la liste.
   Chaque nom de figure ne doit apparaître qu’une seule fois : la progression est suivie par le nom.
   Déplacer une figure d’un niveau à un autre ne fait rien perdre ; la renommer remet son suivi à zéro. */
const NIVEAUX=[
{
  id:"n1", court:"Niveau 1", nom:"Niveau 1 · Initiation",
  figures:[
    "Marche", "Step around", "Pirouette", "Demi pirouette", "Arch", "Pole squat", "Straddle pose", "Diamant", "Front hook", "Back hook", "Fireman", "Fireman knee", "Seat", "Seat jambes tendues", "Planche", "Climb", "Crucifix", "Basic invert", "Crucifix inverse", "Écureuil", "Tinkerbell", "Pencil handstand", "Back step around", "Basic pyramide", "Basic hold"
  ]
},
{
  id:"n2", court:"Niveau 2", nom:"Niveau 2 · Débutant",
  figures:[
    "Side front hook", "Betty boop", "Push up", "Sword", "Baby snake", "Open V", "Chaise", "Boomerang", "Carrousel", "Fan kick", "Layout", "Layout variation ciseaux", "Layout une jambe pliée", "Inside leg / Scorpio", "Outside leg / Gemini", "Wrist sit / Hello boy", "Side spin", "Cradle", "Jamila", "Skater", "Stargazer", "Viva", "Flow bow and arrow", "Pivot intérieur", "Pivot extérieur"
  ]
},
{
  id:"n3", court:"Niveau 3", nom:"Niveau 3 · Débutant inter",
  figures:[
    "Angel", "Reverse angel", "Attitude", "Attitude crochet de genou", "Reverse attitude", "Pike", "Ice skater", "Bird", "Dragonfly", "Martini", "Cross knee", "Double cross knee", "Cross ankle", "Ballerina", "Butterfly", "Daphné", "Sad girl", "Superman", "Ankle climb", "Sailor", "Snowflake", "Flamingo", "Inside planche", "Chaise jambe tendue", "Reverse grab leg"
  ]
},
{
  id:"n4", court:"Niveau 4", nom:"Niveau 4 · Intermédiaire",
  figures:[
    "Jade", "Cupid", "Iguana", "Butterfly extended", "Brass monkey", "Basic flag", "Viva split", "Viva prise coude", "Teddy", "Sleeping flamingo", "Flying flamingo", "Inverted flamingo", "Queen", "Triangle knot", "Helix", "Tulipe", "Vortex", "Baby Valentine", "Artemis", "Flatline", "Pencil spin", "Fish", "Dragonfly ciseau", "Caterpillar", "Archer"
  ]
}
];
/* Combos : ["Nom du combo", ["figure 1","figure 2","figure 3"]] — les noms doivent être identiques à ceux des listes ci-dessus. */
const COMBOS=[
["Premiers pas",["Marche","Step around","Front hook","Back hook"]],
["Autour de la barre",["Marche","Step around","Front hook","Side front hook","Pirouette","Climb","Seat"]],
["Montée et serpent",["Marche","Step around","Climb","Seat jambes tendues","Baby snake"]],
["Tour et attitude",["Marche","Step around","Front hook","Demi pirouette","Reverse attitude"]],
["La valse du pompier",["Marche","Front hook","Pirouette","Step around","Fireman","Fireman knee","Demi pirouette"]],
["Va-et-vient en V",["Step around","Open V","Outside leg / Gemini","Viva","Outside leg / Gemini","Open V"]],
["La grimpeuse",["Climb","Open V","Outside leg / Gemini","Crucifix inverse"]],
["Du genou au crucifix",["Marche","Fireman knee","Climb","Crucifix"]],
["Première inversion",["Marche","Step around","Basic invert","Crucifix inverse"]],
["Aller-retour inversé",["Basic invert","Open V","Basic invert"]],
["Le papillon",["Open V","Outside leg / Gemini","Butterfly"]],
["Chaise et attitude",["Marche","Step around","Chaise","Attitude","Demi pirouette","Reverse attitude"]],
["Le flamant inversé",["Open V","Outside leg / Gemini","Pike","Inverted flamingo"]]
];
const CONSEILS=[
["Bien s’échauffer avant de s’entraîner","Échauffe-toi toujours avant de t’entraîner : poignets, jambes, et l’échauffement vu en cours. Cela réchauffe le corps et aide à accrocher."],
["Tiens chaque figure 3 secondes","Pense à tenir chaque figure 3 secondes pour bien la contrôler."],
["Statique pour la force","Entraîne-toi en statique (tenir les figures) pour développer ta force."],
["Spin pour la fluidité","Entraîne-toi en spin (figures en rotation autour de la barre) pour gagner en fluidité."],
["Boire suffisamment","Bois assez d’eau dans la journée : l’hydratation du corps compte pour l’adhérence."],
["Crème et peau","Mets de la crème sur le corps, mais ni la veille ni le jour de la séance. Une peau trop sèche ou trop grasse fait glisser."],
["Nettoyer la barre","Avant chaque séance, essuie la barre avec un chiffon microfibre et de l’alcool isopropylique ou de l’eau froide."],
["Mains qui transpirent","Lave-toi les mains à l’eau froide, sans savon gras ni crème. Des gants spéciaux pole peuvent aussi aider."],
["Chauffer la barre","Une barre froide fait glisser : réchauffe-la avant de t’entraîner."],
["Tenue adaptée","Laisse plus de peau en contact avec la barre et évite les vêtements amples ou en coton."],
["Les produits de grip","Évite d’en mettre trop et les gels très collants : ils t’empêchent de développer ta force."],
["Développer ta force","Fais des suspensions à la barre, des pressions avec une balle antistress, des montées de corde ou de serviette."],
["S’entraîner parfois sans aide","Pratique de temps en temps sans produit de grip pour développer ta force naturelle."],
["Si tu glisses","Ce n’est pas un échec : c’est un signal de ton corps. Regarde d’abord ta préparation avant de te décourager."]
];
/* Lexique des grips : ["Nom","Description"] — les noms varient selon les écoles, à adapter à ton enseignement. */
const LEXIQUE=[
["Forearm brace grip","Un avant-bras est appuyé sur la barre."],
["Full bracket grip","Une main haute, l’autre main bien basse, index orienté vers le bas."],
["Double cup grip","Les deux mains en cup (pouce vers le bas)."],
["Elbow grip","Prise dans le coude."],
["Twisted grip","La main haute est tournée (twistée), la main basse a les doigts vers le bas."],
["Reverse full bracket grip","Comme le full bracket grip, mais dos à la barre au lieu d’être face à elle."],
["Half bracket grip","Une main haute, l’autre au niveau de la poitrine."],
["Stronghold grip (normal grip)","Les deux mains l’une au-dessus de l’autre, pouces vers le haut. C’est la traction verticale, l’un des grips les plus utilisés."]
];
/* Lexique des termes : ["Mot","Définition"] */
const TERMES=[
["Spins","Figures où le corps tourne autour de la barre."],
["Tricks","Figures acrobatiques sur la barre."],
["Transitions","Petits mouvements dansés qui relient les figures entre elles."],
["Combos","Enchaînements de spins et de tricks."],
["Splits","Figures en grand écart sur la barre."],
["Drops","On relâche les prises d’un coup et on se stoppe net, souvent près du sol."],
["Static dynamic","Enchaînement dynamique sur barre fixe, en gardant la rotation du corps le plus longtemps possible."],
["Pole kisses","Les bleus et les brûlures après l’entraînement."]
];
/* ====== fin ====== */
