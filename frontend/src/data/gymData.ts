export interface ExerciseDefinition {
  id: string;
  name: string;
  category: 'PUSH' | 'PULL' | 'LEGS' | 'UPPER' | 'LOWER' | 'CARDIO' | 'CORE';
  targetMuscle: string;
  secondaryMuscles: string[];
  defaultSets: number;
  defaultReps: string;
  equipment: string;
  instructions: string[];
  formTips: string[];
  commonMistakes: string[];
  diagramType: 'bench-press' | 'incline-press' | 'shoulder-press' | 'lateral-raise' | 'tricep-pushdown' | 
               'lat-pulldown' | 'cable-row' | 'face-pull' | 'bicep-curl' | 'hammer-curl' | 
               'squat' | 'rdl' | 'leg-press' | 'calf-raise' | 'hanging-leg-raise' | 
               'split-squat' | 'leg-curl' | 'leg-extension' | 'cardio' | 'mobility';
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  splitType: 'PUSH' | 'PULL' | 'LEGS' | 'UPPER' | 'LOWER' | 'CARDIO' | 'REST';
  dayOfWeek: string;
  description: string;
  estimatedMinutes: number;
  exercises: ExerciseDefinition[];
}

export const WORKOUT_ROUTINES: WorkoutRoutine[] = [
  {
    id: 'routine-push',
    title: 'Push Day (Chest, Delts & Triceps)',
    splitType: 'PUSH',
    dayOfWeek: 'Monday',
    description: 'Hypertrophy focus on horizontal push, vertical push, lateral delts, and elbow extension.',
    estimatedMinutes: 55,
    exercises: [
      {
        id: 'ex-bench-press',
        name: 'Barbell Flat Bench Press',
        category: 'PUSH',
        targetMuscle: 'Mid & Lower Pectorals',
        secondaryMuscles: ['Anterior Deltoid', 'Triceps Brachii'],
        defaultSets: 3,
        defaultReps: '8-10 reps',
        equipment: 'Barbell & Flat Bench',
        instructions: [
          'Lie flat with eyes directly under the bar. Plant feet firmly on the floor.',
          'Retract and pin shoulder blades back and down into the bench.',
          'Grip slightly wider than shoulder width. Unrack and stabilize over mid-chest.',
          'Lower bar smoothly to nipple line, keeping elbows tucked at ~45-60 degrees.',
          'Press bar explosively upward without flaring elbows or lifting hips.'
        ],
        formTips: [
          'Maintain a natural slight arch in lower back, but keep glutes glued to the bench.',
          'Squeeze the bar hard to activate stabilizing muscles throughout arms.'
        ],
        commonMistakes: [
          'Flaring elbows out at 90 degrees (causes high shoulder impingement stress).',
          'Bouncing the barbell off the sternum.'
        ],
        diagramType: 'bench-press'
      },
      {
        id: 'ex-incline-db-press',
        name: 'Incline Dumbbell Press',
        category: 'PUSH',
        targetMuscle: 'Upper Pectorals (Clavicular Head)',
        secondaryMuscles: ['Front Delts', 'Triceps'],
        defaultSets: 3,
        defaultReps: '10-12 reps',
        equipment: 'Incline Bench (30-45°) & Dumbbells',
        instructions: [
          'Set bench angle to 30 to 45 degrees. Kick dumbbells up to shoulder level.',
          'Retract scapula and keep chest proud throughout the movement.',
          'Press weights up in a slight arc until dumbbells almost meet at the peak.',
          'Lower weights under 3-second control until chest stretch is felt.'
        ],
        formTips: [
          'Do not set bench too steep (>45°), otherwise front shoulders take over from chest.',
          'Keep wrists neutral and stacked over elbows.'
        ],
        commonMistakes: [
          'Clanging dumbbells together at top (removes muscle tension).',
          'Cutting range of motion at top or bottom.'
        ],
        diagramType: 'incline-press'
      },
      {
        id: 'ex-db-shoulder-press',
        name: 'Seated Dumbbell Shoulder Press',
        category: 'PUSH',
        targetMuscle: 'Anterior & Medial Deltoids',
        secondaryMuscles: ['Triceps Brachii', 'Upper Traps'],
        defaultSets: 3,
        defaultReps: '10-12 reps',
        equipment: 'Dumbbells & 75-80° Bench',
        instructions: [
          'Sit upright with back supported. Bring dumbbells to ear height.',
          'Brace core and press weights vertically overhead until arms extend.',
          'Lower under control to chin/ear height before pressing again.'
        ],
        formTips: [
          'Keep elbows slightly in front of shoulders in the scapular plane (not flared flat).',
          'Avoid excessive lower back hyperextension.'
        ],
        commonMistakes: [
          'Arching back severely away from the pad to turn it into an incline press.'
        ],
        diagramType: 'shoulder-press'
      },
      {
        id: 'ex-lateral-raises',
        name: 'Dumbbell Lateral Raises',
        category: 'PUSH',
        targetMuscle: 'Lateral Deltoids (Shoulder Width)',
        secondaryMuscles: ['Trapezius'],
        defaultSets: 3,
        defaultReps: '12-15 reps',
        equipment: 'Dumbbells',
        instructions: [
          'Stand tall with slight forward lean (15°). Dumbbells held at sides or slightly in front.',
          'Lead with elbows and raise arms out to sides until parallel to floor.',
          'Pause momentarily at top, feeling side shoulder contraction.',
          'Lower weights slowly under strict control.'
        ],
        formTips: [
          'Imagine pouring water from a pitcher at top or think of pushing walls away.',
          'Use lighter weight to avoid swinging with your traps.'
        ],
        commonMistakes: [
          'Using heavy momentum / swinging with hips.',
          'Shrugging traps up to ears.'
        ],
        diagramType: 'lateral-raise'
      },
      {
        id: 'ex-tricep-pushdown',
        name: 'Cable Tricep Rope Pushdown',
        category: 'PUSH',
        targetMuscle: 'Triceps (Lateral & Long Head)',
        secondaryMuscles: ['Forearms'],
        defaultSets: 3,
        defaultReps: '12-15 reps',
        equipment: 'Cable Machine & Rope Attachment',
        instructions: [
          'Attach rope to high pulley. Grip rope with palms facing each other.',
          'Pin upper arms and elbows firmly to your sides.',
          'Push rope down until arms are fully locked out, then spread rope ends apart.',
          'Return slowly until forearms reach parallel to floor.'
        ],
        formTips: [
          'Keep shoulders back and elbows locked in place — do not swing elbows forward/backward.',
          'Squeeze triceps for 1 second at full lockout.'
        ],
        commonMistakes: [
          'Letting elbows drift forward and using shoulder momentum to press.'
        ],
        diagramType: 'tricep-pushdown'
      }
    ]
  },
  {
    id: 'routine-pull',
    title: 'Pull Day (Back, Biceps & Rear Delts)',
    splitType: 'PULL',
    dayOfWeek: 'Tuesday',
    description: 'Vertical & horizontal pulling to build back V-taper, thickness, and arm strength.',
    estimatedMinutes: 55,
    exercises: [
      {
        id: 'ex-lat-pulldown',
        name: 'Wide Grip Lat Pulldown',
        category: 'PULL',
        targetMuscle: 'Latissimus Dorsi (Back Width)',
        secondaryMuscles: ['Biceps', 'Rhomboids', 'Rear Delts'],
        defaultSets: 3,
        defaultReps: '8-12 reps',
        equipment: 'Cable Machine & Lat Bar',
        instructions: [
          'Sit securely with thigh pads locked down. Grip bar wider than shoulder width.',
          'Lean back very slightly (10-15°) and drive chest upward toward the ceiling.',
          'Pull elbows down and back toward your hip pockets until bar touches upper chest.',
          'Control bar slowly back to full overhead stretch at top.'
        ],
        formTips: [
          'Think of your hands as hooks — pull with your elbows, not with biceps.',
          'Feel the full stretch in your lats at top of every repetition.'
        ],
        commonMistakes: [
          'Leaning back 45 degrees and swinging your torso to move weight.',
          'Pulling bar behind the neck (dangerous for rotator cuffs).'
        ],
        diagramType: 'lat-pulldown'
      },
      {
        id: 'ex-cable-row',
        name: 'Seated Cable Row',
        category: 'PULL',
        targetMuscle: 'Mid-Back, Rhomboids & Lats',
        secondaryMuscles: ['Biceps', 'Erector Spinae'],
        defaultSets: 3,
        defaultReps: '10-12 reps',
        equipment: 'Low Cable Row & V-Grip Handle',
        instructions: [
          'Sit with knees slightly bent. Grasp V-bar handle and sit up tall.',
          'Pull handle in toward lower abdomen while squeezing shoulder blades together.',
          'Hold contraction for 1 second with chest puffed out.',
          'Extend arms forward smoothly allowing shoulder blades to open and stretch.'
        ],
        formTips: [
          'Keep torso stable; avoid violent rocking forward and backward.',
          'Drive elbows straight back past your ribs.'
        ],
        commonMistakes: [
          'Rounding lower back during the stretch phase.',
          'Relying purely on bicep pulling.'
        ],
        diagramType: 'cable-row'
      },
      {
        id: 'ex-face-pulls',
        name: 'Cable Face Pulls',
        category: 'PULL',
        targetMuscle: 'Rear Deltoids & Rotator Cuff',
        secondaryMuscles: ['Rhomboids', 'Trapezius'],
        defaultSets: 3,
        defaultReps: '15 reps',
        equipment: 'High Cable & Rope Attachment',
        instructions: [
          'Set rope at eye/forehead height. Grip ends with thumbs pointing backward.',
          'Step back to create tension. Pull rope directly toward bridge of nose / eyes.',
          'Rotate hands back so thumbs point behind you at completion (external rotation).',
          'Squeeze rear shoulders hard, then return with control.'
        ],
        formTips: [
          'Crucial for posture and countering desk/programming slump.',
          'Focus on external rotation at peak of pull.'
        ],
        commonMistakes: [
          'Using too much weight and pulling to chest instead of face.'
        ],
        diagramType: 'face-pull'
      },
      {
        id: 'ex-db-bicep-curl',
        name: 'Standing Dumbbell Bicep Curls',
        category: 'PULL',
        targetMuscle: 'Biceps Brachii',
        secondaryMuscles: ['Brachialis', 'Forearms'],
        defaultSets: 3,
        defaultReps: '10-12 reps',
        equipment: 'Dumbbells',
        instructions: [
          'Stand with feet shoulder-width apart, holding dumbbells at sides.',
          'Keep elbows tucked close to torso.',
          'Curl weights upward while supinating wrists (turn palms to face ceiling).',
          'Squeeze biceps hard at top without shifting elbows forward.',
          'Lower dumbbells fully under 2-3 second control.'
        ],
        formTips: [
          'Do not swing body or rock hips to lift weight.',
          'Full extension at bottom is essential for complete bicep stretch.'
        ],
        commonMistakes: [
          'Drifting elbows forward past ribs to rest weight on shoulders.'
        ],
        diagramType: 'bicep-curl'
      },
      {
        id: 'ex-hammer-curl',
        name: 'Incline / Standing Hammer Curls',
        category: 'PULL',
        targetMuscle: 'Brachialis & Forearm Brachioradialis',
        secondaryMuscles: ['Biceps'],
        defaultSets: 3,
        defaultReps: '12 reps',
        equipment: 'Dumbbells',
        instructions: [
          'Hold dumbbells with neutral grip (palms facing each other like holding a hammer).',
          'Keep elbows pinned. Curl dumbbells upward toward shoulders.',
          'Pause and squeeze forearm & outer arm at top.',
          'Lower smoothly to starting position.'
        ],
        formTips: [
          'Builds arm thickness and grip strength for pull-ups.'
        ],
        commonMistakes: [
          'Alternating and swinging torso side to side.'
        ],
        diagramType: 'hammer-curl'
      }
    ]
  },
  {
    id: 'routine-legs',
    title: 'Legs & Core Day',
    splitType: 'LEGS',
    dayOfWeek: 'Wednesday',
    description: 'Lower body power, leg hypertrophy, and rotational core stability.',
    estimatedMinutes: 50,
    exercises: [
      {
        id: 'ex-squat',
        name: 'Barbell / Goblet Squat',
        category: 'LEGS',
        targetMuscle: 'Quadriceps & Gluteus Maximus',
        secondaryMuscles: ['Hamstrings', 'Adductors', 'Core'],
        defaultSets: 3,
        defaultReps: '8-10 reps',
        equipment: 'Barbell or Heavy Dumbbell',
        instructions: [
          'Stand with feet slightly wider than shoulder-width, toes turned out 15-30°.',
          'Brace core firmly and break at hips and knees simultaneously.',
          'Lower hips down until thighs are at least parallel to floor.',
          'Keep knees tracking inline with toes and chest upright.',
          'Drive through whole foot to stand back up.'
        ],
        formTips: [
          'Keep weight distributed across mid-foot, not just on toes.',
          'Inhale deeply and brace core before descending.'
        ],
        commonMistakes: [
          'Knees caving inward (valgus collapse).',
          'Rounding lower back at bottom of squat.'
        ],
        diagramType: 'squat'
      },
      {
        id: 'ex-rdl',
        name: 'Romanian Deadlift (RDL)',
        category: 'LEGS',
        targetMuscle: 'Hamstrings & Glutes',
        secondaryMuscles: ['Lower Back / Spinal Erectors', 'Traps'],
        defaultSets: 3,
        defaultReps: '10-12 reps',
        equipment: 'Dumbbells or Barbell',
        instructions: [
          'Stand tall with dumbbells in front of thighs, slight soft bend in knees.',
          'Push hips straight back toward the wall behind you while keeping back flat.',
          'Lower weights along shins until you feel a deep hamstring stretch (just below knees).',
          'Drive hips forward to return to standing, squeezing glutes at top.'
        ],
        formTips: [
          'This is a hip hinge, not a squat — knees do not bend further as you lower.',
          'Keep weights touching or hugging your legs throughout.'
        ],
        commonMistakes: [
          'Squatting down instead of hinging hips back.',
          'Rounding the spine to reach the floor.'
        ],
        diagramType: 'rdl'
      },
      {
        id: 'ex-leg-press',
        name: 'Leg Press / Walking Lunges',
        category: 'LEGS',
        targetMuscle: 'Quadriceps & Glute Medius',
        secondaryMuscles: ['Hamstrings', 'Calves'],
        defaultSets: 3,
        defaultReps: '12 reps',
        equipment: 'Leg Press Machine or Dumbbells',
        instructions: [
          'Place feet shoulder-width on machine platform.',
          'Release safety catches and lower weight until knees reach 90 degrees.',
          'Press through heels and mid-foot back up without locking knees hard.'
        ],
        formTips: [
          'Never lock knees completely out at the top of the press.',
          'Keep lower back and glutes pressed flat against back rest.'
        ],
        commonMistakes: [
          'Butt lifting off the seat at deep depth (places strain on lumbar spine).'
        ],
        diagramType: 'leg-press'
      },
      {
        id: 'ex-calf-raise',
        name: 'Standing Calf Raises',
        category: 'LEGS',
        targetMuscle: 'Calves (Gastrocnemius & Soleus)',
        secondaryMuscles: ['Ankle Stabilizers'],
        defaultSets: 4,
        defaultReps: '15 reps',
        equipment: 'Step / Machine & Dumbbells',
        instructions: [
          'Stand on edge of step with balls of feet. Heels drop down for full stretch.',
          'Press up onto big toes as high as possible.',
          'Hold peak contraction for 1 full second.',
          'Lower down slowly over 2-3 seconds into a deep calf stretch.'
        ],
        formTips: [
          'Pause at bottom for 1-2 seconds to remove Achilles tendon bounce.'
        ],
        commonMistakes: [
          'Bouncing rapidly without pausing or full range of motion.'
        ],
        diagramType: 'calf-raise'
      },
      {
        id: 'ex-hanging-leg-raise',
        name: 'Hanging Knee / Leg Raises',
        category: 'CORE',
        targetMuscle: 'Lower Rectus Abdominis & Hip Flexors',
        secondaryMuscles: ['Obliques', 'Grip'],
        defaultSets: 3,
        defaultReps: '12-15 reps',
        equipment: 'Pull-up Bar or Captains Chair',
        instructions: [
          'Hang from bar with overhand grip or rest on forearm pads.',
          'Brace abs and curl knees or straight legs up toward chest.',
          'Posteriorly tilt pelvis at top to ensure abdominal contraction.',
          'Lower legs smoothly without swinging body.'
        ],
        formTips: [
          'Do not swing; eliminate momentum between reps.'
        ],
        commonMistakes: [
          'Swinging back and forth like a pendulum.'
        ],
        diagramType: 'hanging-leg-raise'
      }
    ]
  },
  {
    id: 'routine-upper',
    title: 'Upper Body Hypertrophy',
    splitType: 'UPPER',
    dayOfWeek: 'Thursday',
    description: 'Balanced upper body development targeting posture, deltoids, and arms.',
    estimatedMinutes: 50,
    exercises: [
      {
        id: 'ex-incline-machine-press',
        name: 'Incline Chest Press Machine',
        category: 'UPPER',
        targetMuscle: 'Clavicular Pectoralis & Shoulders',
        secondaryMuscles: ['Triceps'],
        defaultSets: 3,
        defaultReps: '10-12 reps',
        equipment: 'Incline Press Machine',
        instructions: [
          'Adjust seat so handles align with upper chest.',
          'Keep shoulder blades pinned to back pad.',
          'Press forward and upward smoothly.',
          'Control negative back to deep stretch.'
        ],
        formTips: ['Keep elbows tucked slightly inside wrists.'],
        commonMistakes: ['Shrugging shoulders forward at full extension.'],
        diagramType: 'incline-press'
      },
      {
        id: 'ex-chest-supported-row',
        name: 'Chest Supported Dumbbell / Machine Row',
        category: 'UPPER',
        targetMuscle: 'Upper Back & Rear Delts',
        secondaryMuscles: ['Biceps', 'Lats'],
        defaultSets: 3,
        defaultReps: '10-12 reps',
        equipment: 'Incline Bench (30°) & Dumbbells',
        instructions: [
          'Lie chest-down against incline bench.',
          'Row dumbbells up with elbows flaring ~45 degrees.',
          'Squeeze mid-back and upper traps at top of movement.'
        ],
        formTips: ['Completely eliminates lower back strain.'],
        commonMistakes: ['Jerking head or neck upward.'],
        diagramType: 'cable-row'
      },
      {
        id: 'ex-cable-lateral-raise',
        name: 'Cable Lateral Raise',
        category: 'UPPER',
        targetMuscle: 'Side Delts',
        secondaryMuscles: ['Traps'],
        defaultSets: 3,
        defaultReps: '12-15 reps',
        equipment: 'Low Cable & D-Handle',
        instructions: [
          'Set cable pulley at wrist height.',
          'Grip handle and raise arm diagonally up and out.',
          'Maintains constant tension across the full range of motion.'
        ],
        formTips: ['Keep wrist and elbow aligned.'],
        commonMistakes: ['Using whole body momentum to whip cable.'],
        diagramType: 'lateral-raise'
      },
      {
        id: 'ex-overhead-tricep-ext',
        name: 'Overhead Cable Tricep Extension',
        category: 'UPPER',
        targetMuscle: 'Triceps Long Head',
        secondaryMuscles: ['Core'],
        defaultSets: 3,
        defaultReps: '12 reps',
        equipment: 'Cable & Rope',
        instructions: [
          'Set rope at head height, face away from cable stack in split stance.',
          'Extend arms forward over head until triceps contract.',
          'Allow rope to bend back behind head for deep stretch in triceps long head.'
        ],
        formTips: ['Keep upper arms stationary near ears.'],
        commonMistakes: ['Flaring elbows excessively wide.'],
        diagramType: 'tricep-pushdown'
      },
      {
        id: 'ex-incline-bicep-curl',
        name: 'Incline Dumbbell Bicep Curl',
        category: 'UPPER',
        targetMuscle: 'Biceps Long Head',
        secondaryMuscles: ['Forearms'],
        defaultSets: 3,
        defaultReps: '12 reps',
        equipment: '45-60° Incline Bench & Dumbbells',
        instructions: [
          'Lie back on incline bench with arms hanging straight down.',
          'Curl weights while keeping upper arms pointed toward floor.',
          'Delivers maximum stretch to the long head of the bicep.'
        ],
        formTips: ['Do not let shoulders pull weights upward.'],
        commonMistakes: ['Moving upper arms forward during the curl.'],
        diagramType: 'bicep-curl'
      }
    ]
  },
  {
    id: 'routine-lower',
    title: 'Lower Body & Core Hypertrophy',
    splitType: 'LOWER',
    dayOfWeek: 'Friday',
    description: 'Hamstring, quad, and unilateral stability focus for balanced athleticism.',
    estimatedMinutes: 50,
    exercises: [
      {
        id: 'ex-bulgarian-split-squat',
        name: 'Bulgarian Split Squat',
        category: 'LOWER',
        targetMuscle: 'Quads & Glutes (Unilateral)',
        secondaryMuscles: ['Hamstrings', 'Calves', 'Balance'],
        defaultSets: 3,
        defaultReps: '10 reps / leg',
        equipment: 'Flat Bench & Dumbbells',
        instructions: [
          'Place rear foot elevated on bench behind you. Front foot out ~2-3 feet.',
          'Lower hips until front thigh is parallel to floor.',
          'Push through front heel to return to top.'
        ],
        formTips: ['Lean torso slightly forward (15°) to emphasize glute loading.'],
        commonMistakes: ['Front foot placed too close to bench.'],
        diagramType: 'split-squat'
      },
      {
        id: 'ex-leg-curl',
        name: 'Seated / Lying Leg Curl',
        category: 'LOWER',
        targetMuscle: 'Hamstrings (Knee Flexion)',
        secondaryMuscles: ['Calves'],
        defaultSets: 3,
        defaultReps: '12 reps',
        equipment: 'Leg Curl Machine',
        instructions: [
          'Position pad against lower calf just below calf muscle.',
          'Curl legs back smoothly toward thighs.',
          'Hold contraction for 1 second, then release with control.'
        ],
        formTips: ['Keep toes pointed straight or slightly pulled toward shins.'],
        commonMistakes: ['Hips lifting off pad when curling.'],
        diagramType: 'leg-curl'
      },
      {
        id: 'ex-leg-extension',
        name: 'Leg Extension Machine',
        category: 'LOWER',
        targetMuscle: 'Quadriceps Isolation (Rectus Femoris)',
        secondaryMuscles: ['Knee Extensors'],
        defaultSets: 3,
        defaultReps: '12-15 reps',
        equipment: 'Leg Extension Machine',
        instructions: [
          'Sit with back against pad. Align knee pivot point with machine axis.',
          'Extend legs until quads are fully contracted.',
          'Lower smoothly over 2-3 seconds.'
        ],
        formTips: ['Do not kick or swing weights upward.'],
        commonMistakes: ['Hyperextending knees violently at top.'],
        diagramType: 'leg-extension'
      },
      {
        id: 'ex-cable-crunch',
        name: 'Cable Rope Ab Crunches',
        category: 'CORE',
        targetMuscle: 'Upper & Middle Abdominals',
        secondaryMuscles: ['Obliques'],
        defaultSets: 3,
        defaultReps: '15 reps',
        equipment: 'High Cable & Rope',
        instructions: [
          'Kneel in front of cable stack holding rope handles by ears.',
          'Flex spine and crunch elbows down toward thighs using abs.',
          'Do not sit down onto calves; hinge solely at spine.'
        ],
        formTips: ['Imagine rolling your ribcage down to your pelvic bone.'],
        commonMistakes: ['Hinging at hips instead of curling spine.'],
        diagramType: 'hanging-leg-raise'
      }
    ]
  },
  {
    id: 'routine-cardio',
    title: 'Cardio, Abs & Active Recovery',
    splitType: 'CARDIO',
    dayOfWeek: 'Saturday',
    description: 'Zone-2 cardiovascular conditioning, metabolic health, and core stamina.',
    estimatedMinutes: 40,
    exercises: [
      {
        id: 'ex-treadmill-walk',
        name: 'Incline Treadmill Walk (Zone 2)',
        category: 'CARDIO',
        targetMuscle: 'Cardiovascular System & Calves',
        secondaryMuscles: ['Glutes', 'Hamstrings'],
        defaultSets: 1,
        defaultReps: '25-30 mins',
        equipment: 'Treadmill (Incline 10-12%, Speed 4.0-5.0 km/h)',
        instructions: [
          'Set treadmill incline between 10% and 12%.',
          'Walk at a steady pace where you can still speak full sentences without gasping.',
          'Keep upright posture; do not lean on side handrails.'
        ],
        formTips: ['Optimizes mitochondrial fat burning without impeding muscle recovery.'],
        commonMistakes: ['Gripping side rails tightly and leaning backward.'],
        diagramType: 'cardio'
      },
      {
        id: 'ex-plank',
        name: 'Front Plank Hold',
        category: 'CORE',
        targetMuscle: 'Transverse Abdominis & Deep Core',
        secondaryMuscles: ['Shoulders', 'Glutes'],
        defaultSets: 3,
        defaultReps: '45-60 seconds',
        equipment: 'Yoga Mat',
        instructions: [
          'Rest on forearms and toes. Body in straight line from head to heels.',
          'Squeeze glutes, quads, and pull belly button in toward spine.'
        ],
        formTips: ['Do not let hips sag or pike high in the air.'],
        commonMistakes: ['Holding breath while planking.'],
        diagramType: 'hanging-leg-raise'
      },
      {
        id: 'ex-mobility',
        name: 'Full Body Mobility & Foam Rolling',
        category: 'CARDIO',
        targetMuscle: 'Thoracic Spine, Hip Flexors & Ankle Mobility',
        secondaryMuscles: ['Full Body'],
        defaultSets: 1,
        defaultReps: '15 mins',
        equipment: 'Foam Roller & Mat',
        instructions: [
          'Roll out IT bands, upper back, and hamstrings.',
          'Perform deep hip flexor stretches and 90/90 hip rotations.'
        ],
        formTips: ['Counters sitting for long programming and coding sessions.'],
        commonMistakes: ['Rushing through stretches without breathing.'],
        diagramType: 'mobility'
      }
    ]
  },
  {
    id: 'routine-rest',
    title: 'Rest & Recovery Day',
    splitType: 'REST',
    dayOfWeek: 'Sunday',
    description: 'Systemic recovery, nervous system decompression, and restful nutrition.',
    estimatedMinutes: 20,
    exercises: [
      {
        id: 'ex-rest-walk',
        name: 'Light Outdoor Walk & Sunlight',
        category: 'CARDIO',
        targetMuscle: 'Active Recovery',
        secondaryMuscles: ['Mental Clarity'],
        defaultSets: 1,
        defaultReps: '20-30 mins',
        equipment: 'Outdoors',
        instructions: [
          'Take a relaxed outdoor walk.',
          'Focus on nasal breathing, sunshine, and hydration.'
        ],
        formTips: ['Allows muscles to repair glycogen stores and adapt.'],
        commonMistakes: ['Overworking without adequate rest.'],
        diagramType: 'mobility'
      }
    ]
  }
];

export const getRoutineForToday = (): WorkoutRoutine => {
  const dayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday ...
  const mapping: Record<number, string> = {
    1: 'routine-push',      // Mon
    2: 'routine-pull',      // Tue
    3: 'routine-legs',      // Wed
    4: 'routine-upper',     // Thu
    5: 'routine-lower',     // Fri
    6: 'routine-cardio',    // Sat
    0: 'routine-rest'       // Sun
  };
  const routineId = mapping[dayIndex] || 'routine-push';
  return WORKOUT_ROUTINES.find(r => r.id === routineId) || WORKOUT_ROUTINES[0];
};
