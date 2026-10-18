import { Parcel, LeafSample, WeatherScenario } from '../types/agri';

// Crisp SVG data URIs for instant leaf vision testing
const svgTomatoBlight = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <radialGradient id="leafGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#4ade80" />
      <stop offset="70%" stop-color="#15803d" />
      <stop offset="100%" stop-color="#14532d" />
    </radialGradient>
    <radialGradient id="blight1" cx="40%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#451a03" />
      <stop offset="60%" stop-color="#78350f" />
      <stop offset="85%" stop-color="#ca8a04" />
      <stop offset="100%" stop-color="transparent" />
    </radialGradient>
    <filter id="mildewSpore">
      <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="3" result="noise"/>
      <feColorMatrix type="matrix" values="1 0 0 0 0.9  0 1 0 0 0.9  0 0 1 0 0.9  0 0 0 0.6 0"/>
      <feBlend mode="multiply" in="SourceGraphic" in2="noise"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="#0c0a09" />
  <!-- Stem -->
  <path d="M 200 280 Q 195 210 190 140" stroke="#166534" stroke-width="8" stroke-linecap="round" fill="none"/>
  <!-- Main Leaf Blade -->
  <path d="M 190 140 C 130 90, 80 130, 70 170 C 60 210, 110 240, 185 220 C 190 220, 195 180, 190 140 Z" fill="url(#leafGrad)" />
  <path d="M 190 140 C 250 90, 310 120, 320 165 C 330 210, 270 245, 195 225 C 190 225, 195 180, 190 140 Z" fill="url(#leafGrad)" />
  <path d="M 190 140 C 140 40, 180 20, 190 10 C 200 20, 240 40, 190 140 Z" fill="url(#leafGrad)" />
  <!-- Primary Veins -->
  <path d="M 190 140 Q 185 80 190 20" stroke="#86efac" stroke-width="2.5" fill="none" opacity="0.6"/>
  <path d="M 190 160 Q 130 165 90 180" stroke="#86efac" stroke-width="2" fill="none" opacity="0.5"/>
  <path d="M 190 160 Q 250 165 295 175" stroke="#86efac" stroke-width="2" fill="none" opacity="0.5"/>
  <!-- Phytophthora Late Blight Lesions -->
  <ellipse cx="140" cy="165" rx="36" ry="24" fill="url(#blight1)" />
  <ellipse cx="260" cy="180" rx="30" ry="28" fill="url(#blight1)" />
  <ellipse cx="190" cy="70" rx="20" ry="22" fill="url(#blight1)" />
  <!-- Sporulating White Mildew Rings -->
  <circle cx="145" cy="168" r="14" fill="#f8fafc" opacity="0.45" filter="url(#mildewSpore)"/>
  <circle cx="265" cy="182" r="12" fill="#f8fafc" opacity="0.4" filter="url(#mildewSpore)"/>
  <!-- Water soak halos -->
  <ellipse cx="120" cy="180" rx="14" ry="10" fill="#a16207" opacity="0.7"/>
  <!-- Caption tag -->
  <text x="14" y="28" fill="#fbbf24" font-family="monospace" font-size="12" font-weight="bold">SAMPLE #1: Phytophthora infestans (Mildiou)</text>
</svg>
`)}`;

const svgGrapeMildew = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <radialGradient id="grapeLeaf" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#22c55e" />
      <stop offset="80%" stop-color="#15803d" />
      <stop offset="100%" stop-color="#052e16" />
    </radialGradient>
    <filter id="powderyDust">
      <feTurbulence type="fractalNoise" baseFrequency="0.2" numOctaves="4" result="dust"/>
      <feColorMatrix type="matrix" values="1 0 0 0 0.95  0 1 0 0 0.95  0 0 1 0 0.95  0 0 0 0.75 0"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="#0c0a09" />
  <!-- Petiole -->
  <path d="M 200 270 Q 200 210 195 180" stroke="#713f12" stroke-width="7" stroke-linecap="round" fill="none"/>
  <!-- Palmate Grapevine Leaf (5-lobed) -->
  <path d="M 195 180 
           C 140 210, 80 190, 70 140 
           C 60 90, 110 70, 130 65 
           C 150 60, 150 30, 200 20 
           C 250 30, 250 60, 270 65 
           C 290 70, 340 90, 330 140 
           C 320 190, 260 210, 205 180 Z" fill="url(#grapeLeaf)"/>
  <!-- Palmate Veins -->
  <path d="M 200 180 L 200 30" stroke="#bbf7d0" stroke-width="3" opacity="0.6"/>
  <path d="M 200 180 L 120 70" stroke="#bbf7d0" stroke-width="2.5" opacity="0.5"/>
  <path d="M 200 180 L 280 70" stroke="#bbf7d0" stroke-width="2.5" opacity="0.5"/>
  <path d="M 200 180 L 80 140" stroke="#bbf7d0" stroke-width="2" opacity="0.5"/>
  <path d="M 200 180 L 320 140" stroke="#bbf7d0" stroke-width="2" opacity="0.5"/>
  <!-- Powdery Mildew White Flour Patches -->
  <ellipse cx="170" cy="110" rx="35" ry="25" fill="#f1f5f9" opacity="0.65" filter="url(#powderyDust)"/>
  <ellipse cx="230" cy="125" rx="40" ry="30" fill="#f1f5f9" opacity="0.7" filter="url(#powderyDust)"/>
  <ellipse cx="140" cy="145" rx="25" ry="20" fill="#f1f5f9" opacity="0.55" filter="url(#powderyDust)"/>
  <text x="14" y="28" fill="#e2e8f0" font-family="monospace" font-size="12" font-weight="bold">SAMPLE #2: Erysiphe necator (Oïdium de la Vigne)</text>
</svg>
`)}`;

const svgWheatRust = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <linearGradient id="wheatBlade" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#15803d" />
      <stop offset="50%" stop-color="#4ade80" />
      <stop offset="100%" stop-color="#166534" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#0c0a09" />
  <!-- Elongated wheat leaf blades -->
  <path d="M 120 290 Q 150 150 250 20 Q 230 150 140 290 Z" fill="url(#wheatBlade)"/>
  <path d="M 180 290 Q 200 130 330 40 Q 280 150 210 290 Z" fill="url(#wheatBlade)" opacity="0.85"/>
  <!-- Parallel Venation -->
  <path d="M 130 290 Q 155 150 245 25" stroke="#86efac" stroke-width="1.5" opacity="0.6" fill="none"/>
  <!-- Stripe Rust Pustules in linear stripes -->
  <g fill="#ea580c">
    <!-- Stripe 1 -->
    <rect x="175" y="140" width="5" height="12" rx="2"/>
    <rect x="178" y="156" width="5" height="10" rx="2"/>
    <rect x="180" y="170" width="6" height="14" rx="2"/>
    <rect x="183" y="190" width="5" height="11" rx="2"/>
    <!-- Stripe 2 -->
    <rect x="188" y="120" width="5" height="14" rx="2" fill="#f97316"/>
    <rect x="191" y="138" width="6" height="15" rx="2" fill="#f97316"/>
    <rect x="195" y="158" width="5" height="12" rx="2" fill="#f97316"/>
    <rect x="198" y="175" width="5" height="13" rx="2" fill="#f97316"/>
    <!-- Stripe 3 -->
    <rect x="202" y="105" width="5" height="12" rx="2"/>
    <rect x="205" y="122" width="6" height="16" rx="2"/>
    <rect x="209" y="144" width="5" height="11" rx="2"/>
  </g>
  <text x="14" y="28" fill="#fb923c" font-family="monospace" font-size="12" font-weight="bold">SAMPLE #3: Puccinia striiformis (Rouille Jaune du Blé)</text>
</svg>
`)}`;

const svgHealthyLeaf = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <radialGradient id="lushGreen" cx="45%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#4ade80" />
      <stop offset="40%" stop-color="#22c55e" />
      <stop offset="85%" stop-color="#15803d" />
      <stop offset="100%" stop-color="#14532d" />
    </radialGradient>
    <linearGradient id="gloss" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#0c0a09" />
  <path d="M 200 270 Q 200 200 195 160" stroke="#166534" stroke-width="7" stroke-linecap="round" fill="none"/>
  <!-- Vigorous healthy elliptical leaf -->
  <path d="M 195 160 C 100 150, 80 80, 195 20 C 310 80, 290 150, 195 160 Z" fill="url(#lushGreen)"/>
  <!-- Gloss reflection -->
  <path d="M 195 160 C 130 145, 120 90, 195 30 C 230 70, 220 130, 195 160 Z" fill="url(#gloss)"/>
  <!-- Clean Healthy Veins -->
  <path d="M 195 155 L 195 25" stroke="#bbf7d0" stroke-width="3" opacity="0.7"/>
  <path d="M 195 120 Q 150 110 125 100" stroke="#86efac" stroke-width="1.8" opacity="0.6"/>
  <path d="M 195 120 Q 240 110 265 100" stroke="#86efac" stroke-width="1.8" opacity="0.6"/>
  <path d="M 195 80 Q 160 70 140 60" stroke="#86efac" stroke-width="1.8" opacity="0.6"/>
  <path d="M 195 80 Q 230 70 250 60" stroke="#86efac" stroke-width="1.8" opacity="0.6"/>
  <text x="14" y="28" fill="#4ade80" font-family="monospace" font-size="12" font-weight="bold">SAMPLE #4: Feuillage Vigoureux Sain (Indice SPAD 46.2)</text>
</svg>
`)}`;

const svgNitrogenChlorosis = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <radialGradient id="chloroticGrad" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="40%" stop-color="#facc15" />
      <stop offset="75%" stop-color="#84cc16" />
      <stop offset="100%" stop-color="#15803d" />
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="#0c0a09" />
  <path d="M 200 270 Q 200 200 195 160" stroke="#713f12" stroke-width="6" stroke-linecap="round" fill="none"/>
  <!-- Chlorotic leaf (pale yellowish-green, yellow tips) -->
  <path d="M 195 160 C 100 150, 80 80, 195 20 C 310 80, 290 150, 195 160 Z" fill="url(#chloroticGrad)"/>
  <!-- Prominent darker green veins standing out against yellow tissue -->
  <path d="M 195 155 L 195 25" stroke="#15803d" stroke-width="3" opacity="0.8"/>
  <path d="M 195 125 Q 150 115 125 105" stroke="#16a34a" stroke-width="2" opacity="0.75"/>
  <path d="M 195 125 Q 240 115 265 105" stroke="#16a34a" stroke-width="2" opacity="0.75"/>
  <path d="M 195 85 Q 160 75 140 65" stroke="#16a34a" stroke-width="2" opacity="0.75"/>
  <path d="M 195 85 Q 230 75 250 65" stroke="#16a34a" stroke-width="2" opacity="0.75"/>
  <!-- Necrotic crisp dry leaf edge -->
  <path d="M 195 20 Q 205 35 195 45" stroke="#a16207" stroke-width="2" fill="none"/>
  <text x="14" y="28" fill="#facc15" font-family="monospace" font-size="12" font-weight="bold">SAMPLE #5: Carence en Azote (Chlorose Internervaire)</text>
</svg>
`)}`;

export const LEAF_SAMPLES: LeafSample[] = [
  {
    id: 'sample-tomato-blight',
    title: 'Tomate de plein champ — Mildiou foliaire',
    crop: 'Tomate (Solanum lycopersicum)',
    category: 'Pathogène Fongique / Oomycète',
    description: 'Taches brunes huileuses avec sporulation blanchâtre en face inférieure sous forte hygrométrie.',
    imageUri: svgTomatoBlight,
    defaultDiagnosis: {
      healthStatus: 'DISEASED',
      primaryDiagnosis: 'Mildiou de la Tomate (Phytophthora infestans)',
      pathogenType: 'FUNGAL',
      confidence: 96,
      severity: 'HIGH',
      symptomsIdentified: [
        'Taches foliaires nécrotiques brunes huileuses à marges diffuses',
        'Feutrage mycélien blanc argenté en face inférieure',
        'Risque de descente du mycélium sur les bouquets floraux et fruits verts',
      ],
      probableCauses: [
        'Hygrométrie nocturne continue > 90% pendant 8 heures',
        'Températures douces (18-21°C) très favorables au cycle sporulatoire',
        'Humectation foliaire persistante due à une aspersion mal positionnée',
      ],
      organicTreatment:
        'Pulvérisation préventive / de contact à base d\'hydroxyde de cuivre homologué bio (15-20 g/hL de cuivre métal) complété de Bicarbonate de potassium (3 kg/ha).',
      conventionalTreatment:
        'Application ciblée d\'un anti-mildiou pénétrant (mandipropamide ou cyazofamide).',
      culturalActions: [
        'Éliminer et incinérer immédiatement les folioles nécrosées',
        'Ébourgeonner et aérer la base du rang pour stimuler le flux d\'air',
        'Désinfecter les outils de taille à l\'alcool 70°',
      ],
      irrigationImpact:
        'STOPP IMMEDIAT DE L\'ASPERSION : Basculer à 100% sur le goutte-à-goutte enterré. Ne jamais arroser au crépuscule pour laisser sécher le feuillage avant la nuit.',
      summaryReasoning:
        'Foyer de mildiou actif en phase d\'expansion. La gestion stricte de l\'irrigation et l\'arrêt de tout mouillage des feuilles sont indispensables pour stopper la contagion.',
      urgencyLevel: 'IMMEDIATE',
    },
  },
  {
    id: 'sample-grape-mildew',
    title: 'Vigne Syrah — Oïdium foliaire',
    crop: 'Vigne cépage Syrah (Vitis vinifera)',
    category: 'Champignon Ascomycète',
    description: 'Voile blanc farineux sur limbe, crispation des marges foliaires et odeur de moisissure.',
    imageUri: svgGrapeMildew,
    defaultDiagnosis: {
      healthStatus: 'DISEASED',
      primaryDiagnosis: 'Oïdium de la Vigne (Erysiphe necator)',
      pathogenType: 'FUNGAL',
      confidence: 93,
      severity: 'MODERATE',
      symptomsIdentified: [
        'Voile poussiéreux blanchâtre/farineux caractéristique',
        'Gaufrure et crispation vers le haut des jeunes feuilles',
        'Risque de perforation et d\'éclatement des baies',
      ],
      probableCauses: [
        'Alternance de journées chaudes (22-26°C) et ombrage au cœur de la souche',
        'Microclimat confiné dans les zones d\'entrecœurs vigoureux',
      ],
      organicTreatment:
        'Poudrage de soufre sublimé ventilé (25 kg/ha) ou pulvérisation de soufre mouillable micronisé (6-8 kg/ha) en fin de journée.',
      culturalActions: [
        'Effeuillage raisonné de la face est/nord de la zone des grappes',
        'Rognage régulier pour limiter l\'entassement de la végétation',
      ],
      irrigationImpact:
        'L\'oïdium prolifère sans eau liquide : maintenir le goutte-à-goutte régulé pour éviter un dessèchement foliaire qui fragiliserait la cuticule.',
      summaryReasoning:
        'Présence confirmée d\'Erysiphe necator au stade sensible de fin floraison. Traitement soufré préventif recommandé sans délai.',
      urgencyLevel: 'WITHIN_48H',
    },
  },
  {
    id: 'sample-wheat-rust',
    title: 'Blé dur d\'hiver — Rouille jaune',
    crop: 'Blé Dur (Triticum durum)',
    category: 'Parasite Obligatoire des Céréales',
    description: 'Pustules jaunes orangées disposées en lignes parallèles le long des nervures.',
    imageUri: svgWheatRust,
    defaultDiagnosis: {
      healthStatus: 'EARLY_STRESS',
      primaryDiagnosis: 'Rouille Jaune du Blé (Puccinia striiformis)',
      pathogenType: 'FUNGAL',
      confidence: 91,
      severity: 'MODERATE',
      symptomsIdentified: [
        'Pustules rectilignes en chapelet jaune-orangé',
        'Ralentissement de l\'activité photosynthétique de l\'épi et de la F1',
      ],
      probableCauses: [
        'Brouillards matinaux et rosée froide (8-14°C)',
        'Contamination par spores aéroportées venant de foyers méridionaux',
      ],
      organicTreatment:
        'Stimulateurs de Défense Naturelle (SDN) à base d\'extraits d\'algues brunes et laminarine.',
      conventionalTreatment:
        'Fongicide triazole ou strobilurine au seuil d\'intervention Arvalis (présence sur 1 feuille sur 10).',
      culturalActions: [
        'Éviter le fractionnement excessif d\'azote ammoniacal',
        'Choix de variétés résistantes (notes GEVES >= 7) pour les prochains semis',
      ],
      irrigationImpact:
        'Programmer les passages de rampe/enrouleur entre minuit et 5h pour ne pas prolonger la rosée matinale.',
      summaryReasoning:
        'Attaque débutante sur étages inférieurs. Un arrosage bien cadencé préservera le remplissage du grain sans disséminer les spores.',
      urgencyLevel: 'WITHIN_48H',
    },
  },
  {
    id: 'sample-healthy-leaf',
    title: 'Canopée Saine — Vigueur Optimale',
    crop: 'Pommier / Maraîchage',
    category: 'Végétation Optimale',
    description: 'Limbe d\'un vert profond régulier, turgescence parfaite, absence de sporulation ou nécrose.',
    imageUri: svgHealthyLeaf,
    defaultDiagnosis: {
      healthStatus: 'HEALTHY',
      primaryDiagnosis: 'Canopée Foliaire Saine & Vigueur Optimale',
      pathogenType: 'NONE',
      confidence: 98,
      severity: 'LOW',
      symptomsIdentified: [
        'Tissu épidermique intact, vert brillant homogène',
        'Excellente turgescence cellulaire sans signe de flétrissement',
        'Absence totale de lésions, ponctuations ou sporulations',
      ],
      probableCauses: [
        'Équilibre hydrique et nutritionnel optimal dans le profil racinaire',
        'Bonne gestion du calendrier d\'arrosage prédictif',
      ],
      organicTreatment: 'Aucun traitement phytosanitaire curatif requis. Poursuivre le monitoring de routine.',
      culturalActions: ['Maintenir le paillage de surface et la surveillance des pièges à phéromones.'],
      irrigationImpact: 'Poursuivre la consigne d\'irrigation de maintien selon le bilan évapotranspiratoire ET0.',
      summaryReasoning: 'Culture en excellente santé photosynthétique. Les paramètres de sol et météo sont en symbiose.',
      urgencyLevel: 'MONITOR',
    },
  },
  {
    id: 'sample-nitrogen-deficiency',
    title: 'Culture maraîchère — Carence Azotée (Chlorose)',
    crop: 'Cultures Maraîchères & Maïs',
    category: 'Trouble Abiotique Nutritionnel',
    description: 'Décoloration jaune uniforme des feuilles basses avec nervures restant légèrement plus vertes.',
    imageUri: svgNitrogenChlorosis,
    defaultDiagnosis: {
      healthStatus: 'DEFICIENCY',
      primaryDiagnosis: 'Carence en Azote (Chlorose Minérale Abiotique)',
      pathogenType: 'NUTRITIONAL',
      confidence: 94,
      severity: 'MODERATE',
      symptomsIdentified: [
        'Jaunissement progressif centripète débutant par les feuilles âgées',
        'Chute de la teneur en chlorophylle (SPAD < 28)',
        'Réduction de la surface d\'assimilation foliaire',
      ],
      probableCauses: [
        'Lessivage des nitrates après fortes pluies ou arrosages trop intenses',
        'Blocage de l\'assimilation par température froide du sol (< 12°C)',
      ],
      organicTreatment:
        'Fertigation avec hydrolysat de protéines végétales bio ou purin d\'ortie fermenté riche en azote soluble immédiatement assimilable.',
      culturalActions: [
        'Analyse de sol pour ajuster le plan de fumure',
        'Implantation d\'un engrais vert de légumineuses (trèfle, vesce) en interculture',
      ],
      irrigationImpact:
        'Réduire les volumes d\'arrosage unitaire : l\'excès de drainage profond lessive l\'azote hors de la zone racinaire.',
      summaryReasoning:
        'Diagnostic nutritionnel net. L\'apport d\'azote par fertigation au goutte-à-goutte est préconisé avec réduction des doses d\'eau drainantes.',
      urgencyLevel: 'WITHIN_48H',
    },
  },
];

export const INITIAL_PARCELS: Parcel[] = [
  {
    id: 'parcel-nord-tomates',
    name: 'Parcelle Nord — Tomates Plein Champ',
    cropName: 'Tomate de plein champ',
    variety: 'Marmande & Roma Bio',
    areaHectares: 3.4,
    soilType: 'Argilo-limoneux profond',
    growthStageBBCH: 'BBCH 71',
    stageName: 'Nouaison des premiers fruits',
    irrigationType: 'DRIP',
    sector: 'Secteur A1 - Nord',
    kcCoefficient: 1.15,
    valveStatus: 'CLOSED',
    lastWateringDate: 'Hier à 22:15 (14 mm)',
    healthScore: 78,
    soil: {
      depth10cm: 26,
      depth30cm: 34,
      depth60cm: 49,
      temp10cm: 22.8,
      temp30cm: 19.4,
      ec: 1.4,
      ph: 6.8,
      nitrogen: 38,
      phosphorus: 26,
      potassium: 195,
      fieldCapacity: 52,
      wiltingPoint: 22,
    },
    weather: {
      ambientTemp: 28.4,
      airHumidity: 54,
      solarRadiation: 780,
      windSpeed: 14,
      windDirection: 'S-SO',
      rainLast24h: 0,
      rainForecast24h: 0,
      rainForecast72h: 2.5,
      et0: 5.6,
      vaporPressureDeficit: 1.75,
    },
  },
  {
    id: 'parcel-est-ble',
    name: 'Parcelle Est — Blé Dur d\'Hiver',
    cropName: 'Blé dur d\'hiver',
    variety: 'Anvergur (Qualité Pastière)',
    areaHectares: 18.2,
    soilType: 'Limoneux-sableux drainant',
    growthStageBBCH: 'BBCH 55',
    stageName: 'Mi-épiaison (Émergence des épillets)',
    irrigationType: 'PIVOT_SPRINKLER',
    sector: 'Secteur B3 - Est',
    kcCoefficient: 1.05,
    valveStatus: 'CLOSED',
    lastWateringDate: 'Il y a 3 jours (22 mm)',
    healthScore: 88,
    soil: {
      depth10cm: 31,
      depth30cm: 42,
      depth60cm: 54,
      temp10cm: 20.2,
      temp30cm: 18.1,
      ec: 0.9,
      ph: 7.2,
      nitrogen: 45,
      phosphorus: 32,
      potassium: 160,
      fieldCapacity: 48,
      wiltingPoint: 19,
    },
    weather: {
      ambientTemp: 26.1,
      airHumidity: 58,
      solarRadiation: 710,
      windSpeed: 19,
      windDirection: 'O-NO',
      rainLast24h: 0,
      rainForecast24h: 1.2,
      rainForecast72h: 8.0,
      et0: 4.9,
      vaporPressureDeficit: 1.42,
    },
  },
  {
    id: 'parcel-coteau-syrah',
    name: 'Coteau Sud — Vigne Syrah AOP',
    cropName: 'Vigne cépage Syrah',
    variety: 'Syrah clone 470',
    areaHectares: 6.8,
    soilType: 'Caillouteux schisteux très filtrant',
    growthStageBBCH: 'BBCH 68',
    stageName: 'Fin de floraison (Chute des capuchons)',
    irrigationType: 'DRIP',
    sector: 'Secteur C2 - Coteau',
    kcCoefficient: 0.65,
    valveStatus: 'CLOSED',
    lastWateringDate: 'Il y a 5 jours (8 mm)',
    healthScore: 92,
    soil: {
      depth10cm: 22,
      depth30cm: 29,
      depth60cm: 38,
      temp10cm: 25.1,
      temp30cm: 21.6,
      ec: 0.6,
      ph: 6.4,
      nitrogen: 24,
      phosphorus: 18,
      potassium: 145,
      fieldCapacity: 38,
      wiltingPoint: 14,
    },
    weather: {
      ambientTemp: 30.2,
      airHumidity: 42,
      solarRadiation: 840,
      windSpeed: 11,
      windDirection: 'SE',
      rainLast24h: 0,
      rainForecast24h: 0,
      rainForecast72h: 0,
      et0: 6.1,
      vaporPressureDeficit: 2.35,
    },
  },
  {
    id: 'parcel-ouest-verger',
    name: 'Verger Ouest — Pommiers Golden',
    cropName: 'Pommier de table',
    variety: 'Golden Delicious & Gala',
    areaHectares: 5.0,
    soilType: 'Argilo-sableux profond',
    growthStageBBCH: 'BBCH 74',
    stageName: 'Grossissement des fruits (T-calibre 40mm)',
    irrigationType: 'MICRO_SPRAY',
    sector: 'Secteur D1 - Verger',
    kcCoefficient: 0.95,
    valveStatus: 'CLOSED',
    lastWateringDate: 'Avant-hier (16 mm)',
    healthScore: 84,
    soil: {
      depth10cm: 36,
      depth30cm: 44,
      depth60cm: 58,
      temp10cm: 21.0,
      temp30cm: 18.7,
      ec: 1.1,
      ph: 6.9,
      nitrogen: 34,
      phosphorus: 28,
      potassium: 210,
      fieldCapacity: 50,
      wiltingPoint: 20,
    },
    weather: {
      ambientTemp: 27.0,
      airHumidity: 60,
      solarRadiation: 720,
      windSpeed: 8,
      windDirection: 'N',
      rainLast24h: 0,
      rainForecast24h: 0.5,
      rainForecast72h: 4.0,
      et0: 5.1,
      vaporPressureDeficit: 1.55,
    },
  },
];

export const SCENARIO_PRESETS: Record<WeatherScenario, {
  nameFr: string;
  nameEn: string;
  descriptionFr: string;
  descriptionEn: string;
  soilDelta: { depth10cm: number; depth30cm: number; depth60cm: number; temp10cm: number };
  weatherDelta: { ambientTemp: number; airHumidity: number; solarRadiation: number; rainForecast24h: number; et0: number };
}> = {
  standard: {
    nameFr: 'Conditions Normales de Saison',
    nameEn: 'Standard Seasonal Weather',
    descriptionFr: 'Climat tempéré régulier, évapotranspiration normale, réserve hydrique stable.',
    descriptionEn: 'Temperate regular weather, normal ET0, stable moisture reserve.',
    soilDelta: { depth10cm: 32, depth30cm: 40, depth60cm: 50, temp10cm: 22 },
    weatherDelta: { ambientTemp: 26, airHumidity: 55, solarRadiation: 720, rainForecast24h: 0, et0: 5.2 },
  },
  drought_heatwave: {
    nameFr: 'Alerte Canicule & Sécheresse',
    nameEn: 'Heatwave & Drought Stress Alert',
    descriptionFr: '35°C, air sec à 28%, forte évapotranspiration (ET0 7.8 mm/j). Sol en déficit critique.',
    descriptionEn: '35°C, dry air 28%, high ET0 (7.8 mm/day). Soil entering severe hydric stress.',
    soilDelta: { depth10cm: 16, depth30cm: 24, depth60cm: 35, temp10cm: 31.5 },
    weatherDelta: { ambientTemp: 35.8, airHumidity: 28, solarRadiation: 960, rainForecast24h: 0, et0: 7.9 },
  },
  heavy_rain: {
    nameFr: 'Épisode Pluvieux Torrentiel',
    nameEn: 'Heavy Rainfall & Water Saturation',
    descriptionFr: 'Pluie de 45 mm reçue, sol saturé (risque d\'asphyxie racinaire). Vannes bloquées.',
    descriptionEn: '45 mm rain received, saturated soil horizon (root hypoxia risk). All valves locked closed.',
    soilDelta: { depth10cm: 68, depth30cm: 65, depth60cm: 72, temp10cm: 18.2 },
    weatherDelta: { ambientTemp: 19.5, airHumidity: 94, solarRadiation: 240, rainForecast24h: 18, et0: 1.8 },
  },
  mildew_high_humidity: {
    nameFr: 'Alerte Cryptogamique (Mildiou)',
    nameEn: 'High Fungal / Mildew Risk Alert',
    descriptionFr: 'Air saturé d\'humidité (92%), rosée persistante, température douce 21°C. Alerte sporulation.',
    descriptionEn: 'Saturated air (92%), prolonged leaf wetness, 21°C. Maximum spore germination risk.',
    soilDelta: { depth10cm: 42, depth30cm: 46, depth60cm: 52, temp10cm: 20.8 },
    weatherDelta: { ambientTemp: 21.4, airHumidity: 93, solarRadiation: 420, rainForecast24h: 4.5, et0: 3.1 },
  },
};

export const INITIAL_ALERTS: import('../types/agri').FarmerAlert[] = [
  {
    id: 'alert-1',
    parcelId: 'parcel-nord-tomates',
    parcelName: 'Parcelle Nord — Tomates Plein Champ',
    category: 'DROUGHT',
    severity: 'CRITICAL',
    title: 'Sol trop sec : Déficit hydrique racinaire critique',
    description: 'La sonde capacitive à 30 cm est descendue à 26%, sous le seuil d\'alerte de la Réserve Facilement Utilisable (RFU). Risque de chute prématurée des boutons floraux.',
    recommendedAction: 'Déclencher immédiatement une irrigation goutte-à-goutte de 16 mm (220 min)',
    timestamp: 'Il y a 18 min',
    isRead: false,
    isResolved: false,
    relatedValue: 'Humidité 30cm: 26% (Seuil: 30%)',
  },
  {
    id: 'alert-2',
    parcelId: 'parcel-nord-tomates',
    parcelName: 'Parcelle Nord — Tomates Plein Champ',
    category: 'DISEASE',
    severity: 'CRITICAL',
    title: 'Suspicion de Mildiou foliaire (Phytophthora infestans)',
    description: 'Conditions cryptogamiques maximales détectées : hygrométrie relative > 90% pendant 7h cumulées et température douce (19°C). Taches foliaires suspectes signalées.',
    recommendedAction: 'Interdiction stricte de l\'arrosage par aspersion ; appliquer Bouillie Bordelaise ou Bicarbonate sous 24h',
    timestamp: 'Il y a 45 min',
    isRead: false,
    isResolved: false,
    relatedValue: 'Indice risque: 88/100',
  },
  {
    id: 'alert-3',
    parcelId: 'parcel-coteau-syrah',
    parcelName: 'Coteau Sud — Vigne Syrah AOP',
    category: 'DISEASE',
    severity: 'WARNING',
    title: 'Suspicion d\'Oïdium naissant sur feuillage',
    description: 'Alternance de chaleur et micro-climat confiné dans les entrecœurs. Dépôt farineux blanc visible.',
    recommendedAction: 'Programmer un poudrage de soufre sublimé ou effeuillage de la zone des grappes',
    timestamp: 'Il y a 2 h',
    isRead: true,
    isResolved: false,
    relatedValue: 'Sévérité: Modérée',
  },
  {
    id: 'alert-4',
    parcelId: 'parcel-est-ble',
    parcelName: 'Parcelle Est — Blé Dur d\'Hiver',
    category: 'TEMPERATURE',
    severity: 'WARNING',
    title: 'Pic de chaleur & Évapotranspiration élevée (ET0 5.6 mm/j)',
    description: 'Vent du sud à 19 km/h combiné à une température de 28°C accélérant le dessèchement de l\'horizon supérieur.',
    recommendedAction: 'Surveiller la baisse de réserve à 30cm avant fin de journée',
    timestamp: 'Hier à 16:30',
    isRead: true,
    isResolved: true,
    relatedValue: 'ET0: 5.6 mm/jour',
  },
];

export const INITIAL_RECORDS: import('../types/agri').HistoricalRecord[] = [
  {
    id: 'rec-1',
    timestamp: 'Aujourd\'hui 09:45',
    parcelId: 'parcel-nord-tomates',
    parcelName: 'Parcelle Nord — Tomates Plein Champ',
    type: 'DISEASE',
    title: 'Diagnostic Foliaire IA : Mildiou de la Tomate',
    summary: 'Identification par Gemini 3.8 Flash avec 96% de certitude. Taches huileuses brunes avec sporulation inférieure blanche.',
    details: {
      diseaseDiagnosis: 'Phytophthora infestans (Mildiou)',
      pathogenType: 'FUNGAL',
      confidence: 96,
      severity: 'HIGH',
      notes: 'Consigne transmise : couper immédiatement l\'aspersion et basculer sur goutte-à-goutte souterrain.',
    },
  },
  {
    id: 'rec-2',
    timestamp: 'Hier à 22:15',
    parcelId: 'parcel-nord-tomates',
    parcelName: 'Parcelle Nord — Tomates Plein Champ',
    type: 'IRRIGATION',
    title: 'Irrigation Goutte-à-goutte Programmée',
    summary: 'Déclenchement nocturne automatique pour compenser l\'ET0 de 5.6 mm.',
    details: {
      irrigationVolumeMm: 14,
      durationMinutes: 196,
      operator: 'AI_AGENT',
      notes: 'Apport de 38 m³ d\'eau sans dérive éolienne. Humidité racinaire restaurée de 26% à 34%.',
    },
  },
  {
    id: 'rec-3',
    timestamp: 'Hier à 14:00',
    parcelId: 'parcel-est-ble',
    parcelName: 'Parcelle Est — Blé Dur d\'Hiver',
    type: 'MEASUREMENT',
    title: 'Relevé Automatique Sondes Capacitives Sol FDR',
    summary: 'Profil tri-profondeur stable. Conductivité électrique optimale sans lessivage.',
    details: {
      soilMoisture10: 31,
      soilMoisture30: 42,
      soilMoisture60: 54,
      soilTemp: 20.2,
      airTemp: 26.1,
      et0: 4.9,
    },
  },
  {
    id: 'rec-4',
    timestamp: 'Il y a 2 jours',
    parcelId: 'parcel-coteau-syrah',
    parcelName: 'Coteau Sud — Vigne Syrah AOP',
    type: 'FIELD_NOTE',
    title: 'Tour de plaine & Contrôle manuel de nouaison',
    summary: 'Observation visuelle de l\'exploitant : chute normale des capuchons floraux, pas de coulure constatée.',
    details: {
      operator: 'FARMER',
      notes: 'Sol caillouteux très filtrant, bon état végétatif. Les pièges à cicadelles sont restés sous le seuil d\'intervention.',
    },
  },
  {
    id: 'rec-5',
    timestamp: 'Il y a 3 jours',
    parcelId: 'parcel-est-ble',
    parcelName: 'Parcelle Est — Blé Dur d\'Hiver',
    type: 'IRRIGATION',
    title: 'Tour d\'eau Pivot Rampe 180m',
    summary: 'Irrigation de soutien au stade mi-épiaison (BBCH 55).',
    details: {
      irrigationVolumeMm: 22,
      durationMinutes: 280,
      operator: 'FARMER',
      notes: 'Passage de nuit pour préserver la turgescence de la dernière feuille.',
    },
  },
  {
    id: 'rec-6',
    timestamp: 'Il y a 4 jours',
    parcelId: 'parcel-ouest-verger',
    parcelName: 'Verger Ouest — Pommiers Golden',
    type: 'DISEASE',
    title: 'Diagnostic Foliaire IA : Canopée Saine',
    summary: 'Contrôle spectrophotométrique conforme (SPAD 46.2). Absence de tavelure.',
    details: {
      diseaseDiagnosis: 'Feuillage Sain & Vigoureux',
      pathogenType: 'NONE',
      confidence: 98,
      severity: 'LOW',
    },
  },
];

