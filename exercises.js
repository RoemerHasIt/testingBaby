// ============================================
// Exercise Guide Database
// ============================================
const EXERCISE_GUIDE = {
    'Bench Press': {
        execution: 'Ga op de bank liggen met je ogen onder de stang. Pak de stang iets breder dan schouderbreedte. Haal de stang uit het rek, laat hem gecontroleerd zakken naar je midden borst, en duw hem explosief omhoog tot je armen gestrekt zijn.',
        tips: [
            'Houd je schouderbladen samengetrokken en naar beneden gedrukt',
            'Zet je voeten stevig op de grond voor stabiliteit',
            'Adem in bij het zakken, adem uit bij het omhoog duwen',
            'Houd je polsen recht, niet naar achteren gekanteld'
        ],
        mistakes: [
            'De stang laten stuiteren op je borst',
            'Je billen van de bank tillen',
            'Polsen te ver naar achteren buigen',
            'Te breed of te smal vastpakken'
        ]
    },
    'Overhead Press': {
        execution: 'Sta rechtop met de stang op schouderhoogte, handen iets breder dan schouderbreedte. Duw de stang recht omhoog boven je hoofd totdat je armen volledig gestrekt zijn. Laat gecontroleerd zakken.',
        tips: [
            'Span je buikspieren en bilspieren aan voor stabiliteit',
            'Duw je hoofd licht naar voren zodra de stang je voorhoofd passeert',
            'Houd de stang dicht bij je gezicht tijdens de beweging',
            'Adem uit bij het omhoog duwen'
        ],
        mistakes: [
            'Te veel naar achteren leunen (holle rug)',
            'De stang te ver voor je lichaam duwen',
            'Je knieen gebruiken om momentum te maken',
            'Ellebogen te ver naar buiten draaien'
        ]
    },
    'Incline Dumbbell Press': {
        execution: 'Stel de bank in op 30-45 graden. Pak twee dumbbells en ga achterover leunen. Start met de dumbbells op schouderhoogte en duw ze omhoog totdat je armen gestrekt zijn. Laat gecontroleerd zakken.',
        tips: [
            'Kies een hoek van 30-45 graden voor optimale bovenborst activatie',
            'Laat de dumbbells niet tegen elkaar tikken bovenaan',
            'Houd een lichte boog in je onderrug',
            'Draai je polsen zodat je handpalmen naar voren wijzen'
        ],
        mistakes: [
            'De bank te steil instellen (wordt dan een schouder oefening)',
            'De dumbbells te snel laten zakken',
            'Ongelijkmatig duwen (een arm sneller dan de ander)',
            'Te zwaar gewicht kiezen waardoor je vorm verliest'
        ]
    },
    'Lateral Raises': {
        execution: 'Sta rechtop met een dumbbell in elke hand naast je lichaam. Til je armen zijwaarts op tot schouderhoogte met een lichte buiging in je ellebogen. Houd even vast bovenaan en laat gecontroleerd zakken.',
        tips: [
            'Gebruik een licht gewicht en focus op de squeeze bovenaan',
            'Leid de beweging met je ellebogen, niet je handen',
            'Kantel je handen licht alsof je water uit een kan giet',
            'Ga niet hoger dan schouderhoogte'
        ],
        mistakes: [
            'Te zwaar gewicht waardoor je gaat slingeren',
            'Je schouders optrekken richting je oren',
            'Je armen volledig strekken (houdt lichte buiging)',
            'Momentum gebruiken vanuit je heupen'
        ]
    },
    'Tricep Pushdown': {
        execution: 'Sta voor een kabel machine met een rechte of V-bar op hoge positie. Pak de bar vast, houd je ellebogen langs je lichaam en duw naar beneden tot je armen volledig gestrekt zijn. Laat gecontroleerd terug.',
        tips: [
            'Houd je ellebogen gefixeerd langs je lichaam',
            'Squeeze je triceps volledig onderaan de beweging',
            'Leun licht voorover voor meer stabiliteit',
            'Gebruik een gewicht waarbij je 12-15 reps schoon kunt doen'
        ],
        mistakes: [
            'Ellebogen naar voren of opzij laten bewegen',
            'Je hele bovenlichaam gebruiken om het gewicht te duwen',
            'Te snel werken zonder controle',
            'Niet het volledige bewegingsbereik gebruiken'
        ]
    },
    'Overhead Tricep Extension': {
        execution: 'Pak een dumbbell met beide handen en houd deze boven je hoofd met gestrekte armen. Laat de dumbbell achter je hoofd zakken door je ellebogen te buigen. Strek je armen weer volledig.',
        tips: [
            'Houd je ellebogen dicht bij je hoofd en naar voren gericht',
            'Laat de dumbbell ver genoeg zakken voor een goede stretch',
            'Span je core aan voor stabiliteit',
            'Dit kan ook zittend op een bank voor meer steun'
        ],
        mistakes: [
            'Ellebogen te ver naar buiten laten wijzen',
            'Je rug te veel hol trekken',
            'Het gewicht te snel laten zakken',
            'Niet volledig strekken bovenaan'
        ]
    },
    'Deadlift': {
        execution: 'Sta met je voeten op heupbreedte, stang boven het midden van je voet. Buig door je heupen en knieen, pak de stang op schouderbreedte. Houd je rug recht, borst omhoog, en til de stang op door je heupen naar voren te duwen en te gaan staan.',
        tips: [
            'De stang moet langs je scheenbenen en bovenbenen schuiven',
            'Adem diep in en span je core aan voordat je tilt',
            'Duw de grond weg met je voeten in plaats van de stang omhoog te trekken',
            'Lock je heupen en knieen tegelijkertijd bovenaan'
        ],
        mistakes: [
            'Je rug laten ronden (gevaarlijk!)',
            'De stang te ver van je lichaam houden',
            'Je knieen naar binnen laten zakken',
            'Met je rug trekken in plaats van met je benen/heupen'
        ]
    },
    'Pull-ups': {
        execution: 'Hang aan een pull-up bar met je handen iets breder dan schouderbreedte, handpalmen van je af. Trek jezelf omhoog tot je kin boven de bar is. Laat jezelf gecontroleerd zakken tot je armen volledig gestrekt zijn.',
        tips: [
            'Denk eraan je ellebogen naar beneden en naar achteren te trekken',
            'Span je schouderbladen samen onderaan de beweging',
            'Vermijd slingeren door je core aan te spannen',
            'Gebruik een band voor assistentie als je ze nog niet kunt'
        ],
        mistakes: [
            'Slingeren of kipping gebruiken voor reps',
            'Niet het volledige bereik gebruiken (halve reps)',
            'Je schouders optrekken naar je oren',
            'Alleen met je armen trekken in plaats van je rug'
        ]
    },
    'Barbell Row': {
        execution: 'Buig voorover met de stang in je handen, rug recht, knieen licht gebogen. Je bovenlichaam is ongeveer 45 graden. Trek de stang naar je navel door je ellebogen naar achteren te trekken. Laat gecontroleerd zakken.',
        tips: [
            'Houd je rug recht gedurende de hele beweging',
            'Trek naar je navel voor meer lat activatie',
            'Squeeze je schouderbladen samen bovenaan',
            'Houd je core aangespannen voor stabiliteit'
        ],
        mistakes: [
            'Je bovenlichaam te veel oprichten tijdens het trekken',
            'Je rug laten ronden',
            'De stang te ver van je lichaam houden',
            'Momentum gebruiken door te slingeren'
        ]
    },
    'Face Pulls': {
        execution: 'Stel de kabel in op gezichtshoogte met een touw. Pak het touw met beide handen en trek naar je gezicht terwijl je je handen uit elkaar spreidt. Je eindt met je handen naast je oren.',
        tips: [
            'Focus op het naar buiten draaien van je schouders',
            'Houd je ellebogen hoog tijdens de trek',
            'Dit is een oefening voor gezondheid, niet voor kracht - gebruik licht gewicht',
            'Squeeze je schouderbladen samen en houd 1 seconde vast'
        ],
        mistakes: [
            'Te zwaar gewicht gebruiken',
            'Naar je borst trekken in plaats van je gezicht',
            'Je hele lichaam achterover leunen',
            'Niet je schouders naar buiten draaien bovenaan'
        ]
    },
    'Barbell Curl': {
        execution: 'Sta rechtop met een stang in je handen, onderhandse grip op schouderbreedte. Houd je ellebogen langs je lichaam en curl de stang omhoog door alleen je onderarmen te bewegen. Laat gecontroleerd zakken.',
        tips: [
            'Houd je ellebogen gefixeerd langs je lichaam',
            'Squeeze je biceps bovenaan de beweging',
            'Gebruik een EZ-bar als een rechte stang oncomfortabel is voor je polsen',
            'Controleer het gewicht op de weg terug naar beneden'
        ],
        mistakes: [
            'Je hele bovenlichaam naar achteren slingeren',
            'Je ellebogen naar voren brengen',
            'Het gewicht te snel laten vallen',
            'Niet het volledige bereik gebruiken'
        ]
    },
    'Hammer Curl': {
        execution: 'Sta rechtop met dumbbells langs je lichaam, handpalmen naar je lichaam gericht (neutrale grip). Curl de dumbbells omhoog terwijl je je handpalmen naar elkaar gericht houdt. Laat gecontroleerd zakken.',
        tips: [
            'De neutrale grip traint ook je onderarmen en brachialis',
            'Je kunt ze tegelijk of afwisselend doen',
            'Houd je polsen stevig en recht',
            'Dit is een geweldige aanvulling op reguliere curls'
        ],
        mistakes: [
            'Je polsen draaien tijdens de beweging',
            'Slingeren met je bovenlichaam',
            'Te snel bewegen zonder controle',
            'Ellebogen naar voren of opzij laten gaan'
        ]
    },
    'Squat': {
        execution: 'Plaats de stang op je bovenrug (niet je nek). Sta op schouderbreedte met tenen licht naar buiten. Zak door je heupen en knieen alsof je op een stoel gaat zitten tot minstens parallel. Duw door je hele voet terug omhoog.',
        tips: [
            'Houd je borst omhoog en kijk recht vooruit',
            'Duw je knieen naar buiten in lijn met je tenen',
            'Adem diep in voordat je zakt, span je core aan',
            'Zak tot minstens parallel (bovenbenen horizontaal) voor volledige activatie'
        ],
        mistakes: [
            'Knieen naar binnen laten zakken',
            'Op je tenen komen te staan (hakken van de grond)',
            'Je rug te veel naar voren laten kantelen',
            'Niet diep genoeg zakken'
        ]
    },
    'Romanian Deadlift': {
        execution: 'Houd de stang voor je dijen met gestrekte armen. Duw je heupen naar achteren terwijl je de stang langs je benen laat zakken. Houd je rug recht en knieen licht gebogen. Voel de stretch in je hamstrings en kom terug omhoog.',
        tips: [
            'Dit is GEEN reguliere deadlift - je benen blijven bijna gestrekt',
            'Duw je heupen ver naar achteren als een scharnier',
            'De stang glijdt langs je bovenbenen en scheenbenen',
            'Voel een duidelijke stretch in je hamstrings onderaan'
        ],
        mistakes: [
            'Je knieen te veel buigen (wordt dan een squat)',
            'Je rug laten ronden',
            'De stang te ver van je lichaam houden',
            'Te diep gaan als je flexibiliteit het niet toelaat'
        ]
    },
    'Leg Press': {
        execution: 'Ga in de leg press zitten met je voeten op schouderbreedte op het platform. Laat het platform zakken door je knieen te buigen tot 90 graden. Duw terug omhoog zonder je knieen volledig te locken.',
        tips: [
            'Voeten hoger = meer hamstrings, voeten lager = meer quads',
            'Houd je onderrug tegen de rugleuning gedrukt',
            'Adem in bij het zakken, uit bij het duwen',
            'Lock je knieen NIET volledig bovenaan'
        ],
        mistakes: [
            'Je billen laten opkomen van het kussen (onderrug rondt)',
            'Te veel gewicht laden met een klein bewegingsbereik',
            'Knieen volledig locken bovenaan',
            'Knieen naar binnen laten zakken'
        ]
    },
    'Walking Lunges': {
        execution: 'Sta rechtop met dumbbells in je handen of een stang op je rug. Neem een grote stap naar voren en zak door tot je achterste knie bijna de grond raakt. Duw jezelf omhoog en neem direct de volgende stap.',
        tips: [
            'Neem grote genoeg stappen zodat beide knieen 90 graden buigen',
            'Houd je bovenlichaam rechtop',
            'Duw af door je voorste hak',
            'Begin met lichaamsgewicht als je nieuw bent'
        ],
        mistakes: [
            'Te kleine stappen nemen (knie over tenen)',
            'Naar voren leunen met je bovenlichaam',
            'Je knie op de grond laten knallen',
            'Balans verliezen door te smalle stappen'
        ]
    },
    'Calf Raises': {
        execution: 'Sta op een verhoging (step of plaat) met de ballen van je voeten op de rand. Laat je hakken zakken voor een volle stretch, duw dan omhoog op je tenen zo hoog als je kunt. Houd 1 seconde bovenaan.',
        tips: [
            'Gebruik het volledige bewegingsbereik - van stretch tot squeeze',
            'Ga langzaam en gecontroleerd, geen stuiteren',
            'Varieer met je tenen naar binnen of naar buiten voor andere focus',
            'Je kuiten herstellen snel, dus gebruik gerust hoger volume'
        ],
        mistakes: [
            'Stuiteren onderaan de beweging',
            'Niet het volledige bereik gebruiken',
            'Te snel bewegen',
            'Je knieen buigen tijdens de beweging'
        ]
    },
    'Plank': {
        execution: 'Ga op je onderarmen en tenen liggen met je lichaam in een rechte lijn van hoofd tot voeten. Houd je core aangespannen en je heupen in lijn. Adem normaal door en houd de positie vast.',
        tips: [
            'Denk eraan je navel naar je ruggengraat te trekken',
            'Kijk naar de grond om je nek neutraal te houden',
            'Span ook je bilspieren aan',
            'Als je langer dan 60 seconden kunt, maak het zwaarder (gewicht op rug)'
        ],
        mistakes: [
            'Je heupen laten doorhangen',
            'Je billen te hoog in de lucht steken',
            'Je adem inhouden',
            'Je schouders naar je oren optrekken'
        ]
    },
    'Bulgarian Split Squat': {
        execution: 'Plaats je achterste voet op een bank achter je. Zak recht naar beneden door je voorste been te buigen tot je bovenbeen parallel is. Duw door je voorste hak terug omhoog.',
        tips: [
            'Leun licht naar voren voor meer quad activatie',
            'Houd je kern aangespannen voor balans',
            'Begin met lichaamsgewicht voordat je gewicht toevoegt',
            'Je voorste scheenbeen mag licht naar voren kantelen'
        ],
        mistakes: [
            'Te dicht of te ver van de bank staan',
            'Je knie naar binnen laten zakken',
            'Te veel gewicht gebruiken voordat je balans hebt',
            'Je voorste hak van de grond laten komen'
        ]
    },
    'Leg Curl': {
        execution: 'Ga op de leg curl machine liggen met het kussen tegen je achillespees. Curl je benen omhoog door je knieen te buigen tot je hamstrings volledig samengetrokken zijn. Laat gecontroleerd terug.',
        tips: [
            'Squeeze je hamstrings bovenaan en houd even vast',
            'Laat het gewicht niet terugvallen - controleer de negatieve fase',
            'Houd je heupen op het kussen gedrukt',
            'Varieer met enkele been voor extra focus'
        ],
        mistakes: [
            'Je heupen optillen van het kussen',
            'Te snel bewegen zonder controle',
            'Het gewicht terugslaan naar de startpositie',
            'Niet het volledige bereik gebruiken'
        ]
    }
};

// ============================================
// Starting weights based on gender & bodyweight
// ============================================
function getStarterWeights(gender, bodyweight) {
    // Multipliers relative to bodyweight for a beginner
    const m = gender === 'vrouw' ? {
        'Bench Press': 0.35, 'Overhead Press': 0.2, 'Incline Dumbbell Press': 0.12,
        'Lateral Raises': 0.04, 'Tricep Pushdown': 0.12, 'Overhead Tricep Extension': 0.08,
        'Deadlift': 0.5, 'Pull-ups': 0, 'Barbell Row': 0.3,
        'Face Pulls': 0.08, 'Barbell Curl': 0.12, 'Hammer Curl': 0.06,
        'Squat': 0.4, 'Romanian Deadlift': 0.35, 'Leg Press': 0.8,
        'Walking Lunges': 0.06, 'Calf Raises': 0.15, 'Plank': 0,
        'Bulgarian Split Squat': 0.06, 'Leg Curl': 0.15
    } : {
        'Bench Press': 0.55, 'Overhead Press': 0.35, 'Incline Dumbbell Press': 0.18,
        'Lateral Raises': 0.06, 'Tricep Pushdown': 0.18, 'Overhead Tricep Extension': 0.12,
        'Deadlift': 0.75, 'Pull-ups': 0, 'Barbell Row': 0.45,
        'Face Pulls': 0.1, 'Barbell Curl': 0.18, 'Hammer Curl': 0.1,
        'Squat': 0.6, 'Romanian Deadlift': 0.5, 'Leg Press': 1.0,
        'Walking Lunges': 0.1, 'Calf Raises': 0.25, 'Plank': 0,
        'Bulgarian Split Squat': 0.1, 'Leg Curl': 0.2
    };

    const weights = {};
    for (const [exercise, mult] of Object.entries(m)) {
        const raw = bodyweight * mult;
        // Round to nearest 2.5 kg
        weights[exercise] = Math.round(raw / 2.5) * 2.5;
    }
    return weights;
}
