// ============================================
// FitTrack - Fitness Tracker App
// ============================================

const STORAGE_KEY = 'fittrack_data';
const DAYS_NL = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
const DAYS_SHORT = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];
const MONTHS_NL = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

const GOAL_LABELS = {
    spiermassa: 'Spiermassa',
    kracht: 'Kracht',
    afvallen: 'Afvallen',
    fitness: 'Fit Blijven'
};

// ============================================
// Workout Plans by goal & split type
// ============================================
// Rep ranges per doel
const REP_CONFIG = {
    kracht:     { compound: '5 x 3-5',  accessory: '3 x 5-8',   isolation: '3 x 8-10'  },
    spiermassa: { compound: '4 x 8-10', accessory: '3 x 10-12', isolation: '3 x 12-15' },
    afvallen:   { compound: '4 x 12-15',accessory: '3 x 12-15', isolation: '3 x 15-20' },
    fitness:    { compound: '3 x 8-12', accessory: '3 x 10-15', isolation: '3 x 12-15' },
};

// Exercise database
function getExercises(goal) {
    const r = REP_CONFIG[goal];
    return {
        push: {
            label: 'Push',
            muscle: 'Borst, Schouders & Triceps',
            exercises: [
                { name: 'Bench Press', target: r.compound, muscle: 'Borst' },
                { name: 'Overhead Press', target: r.compound, muscle: 'Schouders' },
                { name: 'Incline Dumbbell Press', target: r.accessory, muscle: 'Borst' },
                { name: 'Lateral Raises', target: r.isolation, muscle: 'Schouders' },
                { name: 'Tricep Pushdown', target: r.isolation, muscle: 'Triceps' },
                { name: 'Overhead Tricep Extension', target: r.isolation, muscle: 'Triceps' },
            ]
        },
        pull: {
            label: 'Pull',
            muscle: 'Rug & Biceps',
            exercises: [
                { name: 'Deadlift', target: r.compound, muscle: 'Rug' },
                { name: 'Pull-ups', target: r.compound, muscle: 'Rug' },
                { name: 'Barbell Row', target: r.accessory, muscle: 'Rug' },
                { name: 'Face Pulls', target: r.isolation, muscle: 'Achter Schouders' },
                { name: 'Barbell Curl', target: r.isolation, muscle: 'Biceps' },
                { name: 'Hammer Curl', target: r.isolation, muscle: 'Biceps' },
            ]
        },
        legs: {
            label: 'Legs',
            muscle: 'Benen & Core',
            exercises: [
                { name: 'Squat', target: r.compound, muscle: 'Quadriceps' },
                { name: 'Romanian Deadlift', target: r.accessory, muscle: 'Hamstrings' },
                { name: 'Leg Press', target: r.accessory, muscle: 'Quadriceps' },
                { name: 'Walking Lunges', target: r.accessory, muscle: 'Benen' },
                { name: 'Calf Raises', target: r.isolation, muscle: 'Kuiten' },
                { name: 'Plank', target: '3 x 45-60s', muscle: 'Core' },
            ]
        },
        upper: {
            label: 'Upper Body',
            muscle: 'Borst, Rug, Schouders & Armen',
            exercises: [
                { name: 'Bench Press', target: r.compound, muscle: 'Borst' },
                { name: 'Barbell Row', target: r.compound, muscle: 'Rug' },
                { name: 'Overhead Press', target: r.accessory, muscle: 'Schouders' },
                { name: 'Pull-ups', target: r.accessory, muscle: 'Rug' },
                { name: 'Lateral Raises', target: r.isolation, muscle: 'Schouders' },
                { name: 'Barbell Curl', target: r.isolation, muscle: 'Biceps' },
                { name: 'Tricep Pushdown', target: r.isolation, muscle: 'Triceps' },
            ]
        },
        lower: {
            label: 'Lower Body',
            muscle: 'Benen, Billen & Core',
            exercises: [
                { name: 'Squat', target: r.compound, muscle: 'Quadriceps' },
                { name: 'Romanian Deadlift', target: r.compound, muscle: 'Hamstrings' },
                { name: 'Leg Press', target: r.accessory, muscle: 'Quadriceps' },
                { name: 'Bulgarian Split Squat', target: r.accessory, muscle: 'Benen' },
                { name: 'Leg Curl', target: r.isolation, muscle: 'Hamstrings' },
                { name: 'Calf Raises', target: r.isolation, muscle: 'Kuiten' },
                { name: 'Plank', target: '3 x 45-60s', muscle: 'Core' },
            ]
        },
        full: {
            label: 'Full Body',
            muscle: 'Hele Lichaam',
            exercises: [
                { name: 'Squat', target: r.compound, muscle: 'Quadriceps' },
                { name: 'Bench Press', target: r.compound, muscle: 'Borst' },
                { name: 'Barbell Row', target: r.compound, muscle: 'Rug' },
                { name: 'Overhead Press', target: r.accessory, muscle: 'Schouders' },
                { name: 'Romanian Deadlift', target: r.accessory, muscle: 'Hamstrings' },
                { name: 'Plank', target: '3 x 45-60s', muscle: 'Core' },
            ]
        }
    };
}

// Determine split based on number of training days
function getSplitRotation(numDays) {
    switch (numDays) {
        case 2: return ['upper', 'lower'];
        case 3: return ['push', 'pull', 'legs'];
        case 4: return ['upper', 'lower', 'push', 'pull'];
        case 5: return ['push', 'pull', 'legs', 'upper', 'lower'];
        case 6: return ['push', 'pull', 'legs', 'push', 'pull', 'legs'];
        case 7: return ['push', 'pull', 'legs', 'upper', 'lower', 'full', 'full'];
        default: return ['full', 'full'];
    }
}

function getSplitLabel(numDays) {
    switch (numDays) {
        case 2: return 'Upper / Lower';
        case 3: return 'Push / Pull / Legs';
        case 4: return 'Upper / Lower / Push / Pull';
        case 5: return 'PPL + Upper / Lower';
        case 6: return 'Push / Pull / Legs x2';
        case 7: return 'PPL + UL + Full Body';
        default: return 'Full Body';
    }
}

// ============================================
// State
// ============================================
let appData = loadData();
let currentExercise = null;
let currentExerciseSets = [];
let selectedDate = new Date(); // For day navigation

function loadData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    return null;
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
}

function hasProfile() {
    return appData && appData.profile && appData.profile.name;
}

// ============================================
// Helpers
// ============================================
function getTodayString() {
    return new Date().toISOString().split('T')[0];
}

function formatDate(dateStr) {
    const d = new Date(dateStr + 'T12:00:00');
    return `${DAYS_NL[d.getDay()]} ${d.getDate()} ${MONTHS_NL[d.getMonth()]}`;
}

function calcBMI(weightKg, heightCm) {
    if (!weightKg || !heightCm) return null;
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return 'Ondergewicht';
    if (bmi < 25) return 'Gezond';
    if (bmi < 30) return 'Overgewicht';
    return 'Obesitas';
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Goedemorgen';
    if (hour < 18) return 'Goedemiddag';
    return 'Goedenavond';
}

function calcVolume(sets) {
    return sets.reduce((sum, s) => sum + (s.weight * s.reps), 0);
}

function getRPEFeedback(rpe) {
    if (rpe <= 4) return { text: 'Te licht! Verhoog gewicht met 5-10% volgende keer.', class: 'rpe-low' };
    if (rpe <= 6) return { text: 'Aan de lichte kant. Overweeg 2.5-5% meer gewicht.', class: 'rpe-low' };
    if (rpe <= 8) return { text: 'Perfect! Dit is precies goed. Houd dit gewicht aan.', class: 'rpe-good' };
    if (rpe === 9) return { text: 'Zwaar maar goed! Probeer dit gewicht te houden.', class: 'rpe-high' };
    return { text: 'Te zwaar! Verlaag gewicht met 5-10% volgende keer.', class: 'rpe-high' };
}

function getWeightSuggestion(exerciseName) {
    if (!appData || !appData.workouts) return null;
    // Find the last time this exercise was done
    const past = appData.workouts
        .filter(w => w.completed)
        .sort((a, b) => b.date.localeCompare(a.date));
    for (const w of past) {
        for (const ex of Object.values(w.exercises)) {
            if (ex.name === exerciseName && ex.sets && ex.sets.length > 0) {
                const lastRPE = ex.rpe || 0;
                const lastWeight = Math.max(...ex.sets.map(s => s.weight));
                if (lastRPE && lastWeight) {
                    let suggestion = lastWeight;
                    if (lastRPE <= 5) suggestion = Math.round((lastWeight * 1.075) / 2.5) * 2.5;
                    else if (lastRPE <= 6) suggestion = Math.round((lastWeight * 1.025) / 2.5) * 2.5;
                    else if (lastRPE >= 10) suggestion = Math.round((lastWeight * 0.925) / 2.5) * 2.5;
                    else if (lastRPE >= 9) suggestion = Math.round((lastWeight * 0.975) / 2.5) * 2.5;
                    if (suggestion !== lastWeight) {
                        return { lastWeight, lastRPE, suggestion };
                    }
                }
                return { lastWeight, lastRPE: lastRPE || null, suggestion: null };
            }
        }
    }
    return null;
}

function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

function getSelectedDateString() {
    return selectedDate.toISOString().split('T')[0];
}

function isSelectedDateToday() {
    return getSelectedDateString() === getTodayString();
}

function isTrainingDay(date) {
    const dow = date.getDay();
    return appData.profile.trainingDays.includes(dow);
}

function isTodayTrainingDay() {
    return isTrainingDay(selectedDate);
}

function getWorkoutTypeForDate(date) {
    const profile = appData.profile;
    const trainingDays = profile.trainingDays.sort((a, b) => a - b);
    const dow = date.getDay();

    if (!trainingDays.includes(dow)) return null;

    const start = new Date(appData.startDate + 'T12:00:00');
    const target = new Date(date.toISOString().split('T')[0] + 'T12:00:00');

    let totalTrainingDays = 0;
    const cursor = new Date(start);
    while (cursor < target) {
        if (trainingDays.includes(cursor.getDay())) {
            totalTrainingDays++;
        }
        cursor.setDate(cursor.getDate() + 1);
    }

    const rotation = getSplitRotation(trainingDays.length);
    const index = totalTrainingDays % rotation.length;
    return rotation[index];
}

function getTodayWorkoutType() {
    return getWorkoutTypeForDate(selectedDate);
}

function getTodayWorkout() {
    return appData.workouts.find(w => w.date === getSelectedDateString());
}

function getOrCreateTodayWorkout() {
    let workout = getTodayWorkout();
    if (!workout) {
        const type = getTodayWorkoutType();
        if (!type) return null;
        workout = {
            date: getSelectedDateString(),
            type: type,
            exercises: {},
            completed: false
        };
        appData.workouts.push(workout);
        saveData();
    }
    return workout;
}

function getWorkoutPlan() {
    return getExercises(appData.profile.goal);
}

// ============================================
// Onboarding
// ============================================
let onboardingData = { name: '', gender: '', height: 0, weight: 0, age: 0, goal: '', trainingDays: [] };

function initOnboarding() {
    document.getElementById('onboarding').style.display = '';
    document.getElementById('mainApp').style.display = 'none';

    // Step 1: Name + Gender
    document.querySelectorAll('#genderOptions .option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#genderOptions .option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            onboardingData.gender = btn.dataset.value;
        });
    });

    document.getElementById('step1Next').addEventListener('click', () => {
        const name = document.getElementById('profileName').value.trim();
        if (!name) { showToast('Vul je naam in'); return; }
        if (!onboardingData.gender) { showToast('Selecteer je geslacht'); return; }
        onboardingData.name = name;
        goToStep(2);
    });

    // Step 2: Body
    document.getElementById('step2Back').addEventListener('click', () => goToStep(1));
    document.getElementById('step2Next').addEventListener('click', () => {
        const h = parseFloat(document.getElementById('profileHeight').value);
        const w = parseFloat(document.getElementById('profileWeight').value);
        const a = parseInt(document.getElementById('profileAge').value);
        if (!h || h < 100 || h > 250) { showToast('Vul een geldige lengte in (100-250 cm)'); return; }
        if (!w || w < 30 || w > 300) { showToast('Vul een geldig gewicht in (30-300 kg)'); return; }
        if (!a || a < 10 || a > 100) { showToast('Vul een geldige leeftijd in'); return; }
        onboardingData.height = h;
        onboardingData.weight = w;
        onboardingData.age = a;
        goToStep(3);
    });

    // Step 3: Goal
    document.getElementById('step3Back').addEventListener('click', () => goToStep(2));
    document.querySelectorAll('#goalOptions .goal-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('#goalOptions .goal-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            onboardingData.goal = card.dataset.value;
            document.getElementById('step3Next').disabled = false;
        });
    });
    document.getElementById('step3Next').addEventListener('click', () => {
        if (!onboardingData.goal) return;
        goToStep(4);
    });

    // Step 4: Training days
    document.getElementById('step4Back').addEventListener('click', () => goToStep(3));
    document.querySelectorAll('#daySelector .day-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('selected');
            updateDayCount();
        });
    });

    document.getElementById('step4Next').addEventListener('click', () => {
        const selected = Array.from(document.querySelectorAll('#daySelector .day-btn.selected'))
            .map(b => parseInt(b.dataset.day));
        if (selected.length < 2) return;
        onboardingData.trainingDays = selected;
        finishOnboarding();
    });
}

function updateDayCount() {
    const count = document.querySelectorAll('#daySelector .day-btn.selected').length;
    const el = document.getElementById('dayCount');
    const btn = document.getElementById('step4Next');

    if (count < 2) {
        el.textContent = 'Selecteer minimaal 2 dagen';
        btn.disabled = true;
    } else {
        const split = getSplitLabel(count);
        el.textContent = `${count} dagen per week — ${split}`;
        btn.disabled = false;
    }
}

function goToStep(step) {
    document.querySelectorAll('.onboarding-step').forEach(s => s.classList.remove('active'));
    document.querySelector(`.onboarding-step[data-step="${step}"]`).classList.add('active');
}

function finishOnboarding() {
    appData = {
        profile: {
            name: onboardingData.name,
            gender: onboardingData.gender,
            height: onboardingData.height,
            weight: onboardingData.weight,
            age: onboardingData.age,
            goal: onboardingData.goal,
            trainingDays: onboardingData.trainingDays,
            weightHistory: [{ date: getTodayString(), weight: onboardingData.weight }]
        },
        workouts: [],
        startDate: getTodayString()
    };

    // Generate first week of pre-filled workouts
    generateFirstWeek();

    saveData();
    startApp();
}

function generateFirstWeek() {
    const starterWeights = typeof getStarterWeights !== 'undefined'
        ? getStarterWeights(appData.profile.gender, appData.profile.weight)
        : {};
    const allPlans = getExercises(appData.profile.goal);
    const trainingDays = appData.profile.trainingDays.sort((a, b) => a - b);
    const rotation = getSplitRotation(trainingDays.length);

    // Find dates for the past 7 days that match training days
    const today = new Date();
    const pastDates = [];
    for (let i = 7; i >= 1; i--) {
        const d = new Date(today.getTime() - i * 86400000);
        if (trainingDays.includes(d.getDay())) {
            pastDates.push(d);
        }
    }

    pastDates.forEach((date, idx) => {
        const dateStr = date.toISOString().split('T')[0];
        const type = rotation[idx % rotation.length];
        const plan = allPlans[type];
        if (!plan) return;

        const exercises = {};
        plan.exercises.forEach((ex, i) => {
            const baseWeight = starterWeights[ex.name] || 20;
            const match = ex.target.match(/(\d+)\s*x\s*(\d+)/);
            const numSets = match ? parseInt(match[1]) : 3;
            const targetReps = match ? parseInt(match[2]) : 10;

            if (ex.name === 'Plank') {
                exercises[i] = {
                    name: ex.name,
                    sets: Array.from({ length: numSets }, () => ({ weight: 0, reps: 45 })),
                    rpe: 7
                };
            } else if (ex.name === 'Pull-ups') {
                exercises[i] = {
                    name: ex.name,
                    sets: Array.from({ length: numSets }, () => ({ weight: 0, reps: Math.max(3, targetReps - 2) })),
                    rpe: 8
                };
            } else {
                exercises[i] = {
                    name: ex.name,
                    sets: Array.from({ length: numSets }, (_, si) => ({
                        weight: baseWeight,
                        reps: Math.max(targetReps - si, targetReps - 2)
                    })),
                    rpe: 7
                };
            }
        });

        appData.workouts.push({
            date: dateStr,
            type: type,
            exercises: exercises,
            completed: true
        });
    });

    // Update startDate to a week ago
    appData.startDate = new Date(today.getTime() - 7 * 86400000).toISOString().split('T')[0];
}

// ============================================
// Tab Navigation
// ============================================
function initTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');

            if (tab.dataset.tab === 'stats') renderStats();
            if (tab.dataset.tab === 'history') renderHistory();
            if (tab.dataset.tab === 'badges') renderBadges();
            if (tab.dataset.tab === 'profile') { renderProfile(); renderBadgeShowcase(); }
        });
    });
}

// ============================================
// Workout Tab
// ============================================
function renderWorkout() {
    const name = appData.profile.name.split(' ')[0];
    document.getElementById('greeting').textContent = `${getGreeting()}, ${name}`;

    const dateStr = getSelectedDateString();
    const d = new Date(dateStr + 'T12:00:00');
    const todayLabel = isSelectedDateToday() ? 'Vandaag — ' : '';
    document.getElementById('dateDisplay').textContent =
        `${todayLabel}${DAYS_NL[d.getDay()]} ${d.getDate()} ${MONTHS_NL[d.getMonth()]} ${d.getFullYear()}`;

    // Disable next button if we're on today or in the future
    const nextBtn = document.getElementById('nextDay');
    if (nextBtn) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        nextBtn.disabled = selectedDate >= new Date(getTodayString() + 'T12:00:00');
        nextBtn.style.opacity = nextBtn.disabled ? '0.3' : '';
    }

    const restMsg = document.getElementById('restDayMessage');
    const workoutContent = document.getElementById('workoutContent');

    if (!isTrainingDay(selectedDate)) {
        restMsg.style.display = '';
        workoutContent.style.display = 'none';
        // Show next training day from selectedDate
        const trainingDays = appData.profile.trainingDays;
        let nextDay = new Date(selectedDate);
        for (let i = 1; i <= 7; i++) {
            nextDay = new Date(selectedDate.getTime() + i * 86400000);
            if (trainingDays.includes(nextDay.getDay())) break;
        }
        const info = document.getElementById('nextWorkoutInfo');
        if (info) info.textContent = `Volgende training: ${DAYS_NL[nextDay.getDay()]}`;
        return;
    }

    restMsg.style.display = 'none';
    workoutContent.style.display = '';

    const type = getTodayWorkoutType();
    const allPlans = getWorkoutPlan();
    const plan = allPlans[type];
    const workout = getOrCreateTodayWorkout();

    document.getElementById('dayBadge').textContent = plan.label;
    document.getElementById('muscleGroup').textContent = plan.muscle;

    const list = document.getElementById('exerciseList');
    list.innerHTML = '';

    let completedCount = 0;

    plan.exercises.forEach((exercise, idx) => {
        const logged = workout.exercises[idx];
        const isCompleted = logged && logged.sets && logged.sets.length > 0;
        if (isCompleted) completedCount++;

        const card = document.createElement('div');
        card.className = `exercise-card${isCompleted ? ' completed' : ''}`;
        card.innerHTML = `
            <div class="exercise-info">
                <h4>${exercise.name}</h4>
                <span class="target">${exercise.target} — ${exercise.muscle}</span>
                ${isCompleted ? `<div class="exercise-sets-summary">${logged.sets.length} sets — ${calcVolume(logged.sets)} kg volume${logged.rpe ? ' — RPE ' + logged.rpe : ''}</div>` : ''}
            </div>
            <div class="exercise-status">${isCompleted ? '&#10003;' : ''}</div>
        `;
        card.addEventListener('click', () => openExerciseModal(exercise, idx));
        list.appendChild(card);
    });

    const finishBtn = document.getElementById('finishWorkout');
    finishBtn.disabled = false;
    finishBtn.style.opacity = '';
    if (completedCount > 0 && !workout.completed) {
        finishBtn.style.display = 'block';
        finishBtn.textContent = completedCount === plan.exercises.length
            ? 'Workout Afronden'
            : `Workout Afronden (${completedCount}/${plan.exercises.length})`;
    } else if (workout.completed) {
        finishBtn.style.display = 'block';
        finishBtn.textContent = 'Workout Afgerond!';
        finishBtn.disabled = true;
        finishBtn.style.opacity = '0.6';
    } else {
        finishBtn.style.display = 'none';
    }
}

document.getElementById('finishWorkout')?.addEventListener('click', () => {
    const workout = getTodayWorkout();
    if (workout && !workout.completed) {
        workout.completed = true;
        saveData();
        renderWorkout();
        showToast('Workout opgeslagen!');
        setTimeout(() => checkNewBadges(), 500);
    }
});

// ============================================
// Exercise Modal
// ============================================
let currentRPE = 0;

function openExerciseModal(exercise, index) {
    currentExercise = { ...exercise, index };
    currentRPE = 0;

    const workout = getOrCreateTodayWorkout();
    const existing = workout.exercises[index];

    if (existing && existing.sets && existing.sets.length > 0) {
        currentExerciseSets = existing.sets.map(s => ({ ...s }));
        currentRPE = existing.rpe || 0;
    } else {
        const match = exercise.target.match(/(\d+)\s*x/);
        const numSets = match ? parseInt(match[1]) : 3;
        currentExerciseSets = Array.from({ length: numSets }, () => ({ weight: 0, reps: 0 }));
    }

    document.getElementById('modalTitle').textContent = exercise.name;

    // Exercise guide
    const guide = typeof EXERCISE_GUIDE !== 'undefined' ? EXERCISE_GUIDE[exercise.name] : null;
    const guideEl = document.getElementById('exerciseGuide');
    const guideContent = document.getElementById('guideContent');
    if (guide && guideEl) {
        guideEl.style.display = '';
        guideContent.style.display = 'none';
        document.getElementById('guideExecution').textContent = guide.execution;
        const tipsList = document.getElementById('guideTips');
        tipsList.innerHTML = guide.tips.map(t => `<li>${t}</li>`).join('');
        const mistakesList = document.getElementById('guideMistakes');
        mistakesList.innerHTML = guide.mistakes.map(m => `<li>${m}</li>`).join('');
    } else if (guideEl) {
        guideEl.style.display = 'none';
    }

    // Weight suggestion from previous RPE
    const suggestionEl = document.getElementById('weightSuggestion');
    const ws = getWeightSuggestion(exercise.name);
    if (ws && ws.suggestion && suggestionEl) {
        const dir = ws.suggestion > ws.lastWeight ? 'verhogen' : 'verlagen';
        document.getElementById('suggestionText').textContent =
            `Suggestie: ${dir} naar ${ws.suggestion} kg (vorige: ${ws.lastWeight} kg, RPE ${ws.lastRPE})`;
        suggestionEl.style.display = '';
    } else if (suggestionEl) {
        suggestionEl.style.display = 'none';
    }

    // RPE reset
    document.querySelectorAll('.rpe-btn').forEach(b => b.classList.remove('selected'));
    if (currentRPE) {
        const btn = document.querySelector(`.rpe-btn[data-rpe="${currentRPE}"]`);
        if (btn) btn.classList.add('selected');
        const fb = getRPEFeedback(currentRPE);
        document.getElementById('rpeFeedback').textContent = fb.text;
        document.getElementById('rpeFeedback').className = 'rpe-feedback ' + fb.class;
    } else {
        document.getElementById('rpeFeedback').textContent = '';
    }

    renderSets();
    document.getElementById('modalOverlay').classList.add('active');
}

function renderSets() {
    const container = document.getElementById('setsContainer');
    container.innerHTML = '';

    if (currentExerciseSets.length === 0) {
        currentExerciseSets.push({ weight: 0, reps: 0 });
    }

    currentExerciseSets.forEach((set, i) => {
        const row = document.createElement('div');
        row.className = 'set-row';
        row.innerHTML = `
            <label>Set ${i + 1}</label>
            <div>
                <input type="number" inputmode="decimal" placeholder="kg" value="${set.weight || ''}"
                    data-set="${i}" data-field="weight" min="0" step="0.5">
                <div class="input-label">kg</div>
            </div>
            <div>
                <input type="number" inputmode="numeric" placeholder="reps" value="${set.reps || ''}"
                    data-set="${i}" data-field="reps" min="0">
                <div class="input-label">reps</div>
            </div>
            ${currentExerciseSets.length > 1 ? `<button class="remove-set" data-set="${i}">&times;</button>` : ''}
        `;
        container.appendChild(row);
    });

    container.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', (e) => {
            const idx = parseInt(e.target.dataset.set);
            const field = e.target.dataset.field;
            currentExerciseSets[idx][field] = parseFloat(e.target.value) || 0;
        });
    });

    container.querySelectorAll('.remove-set').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(e.target.dataset.set);
            currentExerciseSets.splice(idx, 1);
            renderSets();
        });
    });
}

// Guide toggle
document.getElementById('guideToggle')?.addEventListener('click', () => {
    const content = document.getElementById('guideContent');
    const toggle = document.getElementById('guideToggle');
    if (content.style.display === 'none') {
        content.style.display = '';
        toggle.textContent = 'Uitleg verbergen';
    } else {
        content.style.display = 'none';
        toggle.textContent = 'Hoe voer ik deze oefening uit?';
    }
});

// RPE buttons
document.querySelectorAll('.rpe-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.rpe-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        currentRPE = parseInt(btn.dataset.rpe);
        const fb = getRPEFeedback(currentRPE);
        document.getElementById('rpeFeedback').textContent = fb.text;
        document.getElementById('rpeFeedback').className = 'rpe-feedback ' + fb.class;
    });
});

document.getElementById('addSetBtn')?.addEventListener('click', () => {
    const lastSet = currentExerciseSets[currentExerciseSets.length - 1];
    currentExerciseSets.push({ weight: lastSet.weight, reps: lastSet.reps });
    renderSets();
});

document.getElementById('cancelModal')?.addEventListener('click', () => {
    document.getElementById('modalOverlay').classList.remove('active');
    currentExercise = null;
});

document.getElementById('saveModal')?.addEventListener('click', () => {
    const workout = getOrCreateTodayWorkout();
    const validSets = currentExerciseSets.filter(s => s.reps > 0);

    if (validSets.length > 0) {
        workout.exercises[currentExercise.index] = {
            name: currentExercise.name,
            sets: validSets,
            rpe: currentRPE || null
        };
    } else {
        delete workout.exercises[currentExercise.index];
    }

    saveData();
    document.getElementById('modalOverlay').classList.remove('active');
    renderWorkout();
    showToast(`${currentExercise.name} opgeslagen!`);
    currentExercise = null;
});

document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        document.getElementById('modalOverlay').classList.remove('active');
    }
});

// ============================================
// History Tab
// ============================================
function renderHistory() {
    const list = document.getElementById('historyList');
    const noHistory = document.getElementById('noHistory');
    list.innerHTML = '';

    const completed = appData.workouts
        .filter(w => w.completed)
        .sort((a, b) => b.date.localeCompare(a.date));

    if (completed.length === 0) {
        noHistory.style.display = 'block';
        return;
    }
    noHistory.style.display = 'none';

    const allPlans = getWorkoutPlan();

    completed.forEach(workout => {
        const plan = allPlans[workout.type];
        if (!plan) return;
        let totalVol = 0;
        const exerciseEntries = Object.values(workout.exercises);

        const card = document.createElement('div');
        card.className = 'history-card';

        let exercisesHtml = '';
        exerciseEntries.forEach(ex => {
            const vol = calcVolume(ex.sets);
            totalVol += vol;
            const bestSet = ex.sets.reduce((best, s) => s.weight > best.weight ? s : best, ex.sets[0]);
            exercisesHtml += `
                <div class="history-exercise">
                    <span>${ex.name}</span>
                    <span>${ex.sets.length} sets — beste: ${bestSet.weight}kg x ${bestSet.reps}</span>
                </div>
            `;
        });

        card.innerHTML = `
            <div class="history-header">
                <span class="history-date">${formatDate(workout.date)}</span>
                <span class="history-badge ${workout.type}">${plan.label}</span>
            </div>
            <div class="history-exercises">${exercisesHtml}</div>
            <div class="history-volume">Totaal volume: ${totalVol.toLocaleString('nl-NL')} kg</div>
        `;
        list.appendChild(card);
    });
}

// ============================================
// Stats Tab
// ============================================
let volumeChart, frequencyChart, muscleChart;

function renderStats() {
    const completed = appData.workouts.filter(w => w.completed);

    document.getElementById('totalWorkouts').textContent = completed.length;

    // Streak: count consecutive training days with completed workouts
    let streak = 0;
    const completedDates = new Set(completed.map(w => w.date));
    const trainingDays = appData.profile.trainingDays;
    let checkDate = new Date(getTodayString() + 'T12:00:00');

    for (let i = 0; i < 365; i++) {
        const dateStr = checkDate.toISOString().split('T')[0];
        const isTrainingDay = trainingDays.includes(checkDate.getDay());

        if (isTrainingDay) {
            if (completedDates.has(dateStr)) {
                streak++;
            } else if (i > 0) {
                break;
            }
        }
        checkDate.setDate(checkDate.getDate() - 1);
    }
    document.getElementById('currentStreak').textContent = streak;

    let totalVol = 0;
    completed.forEach(w => {
        Object.values(w.exercises).forEach(ex => {
            totalVol += calcVolume(ex.sets);
        });
    });
    document.getElementById('totalVolume').textContent = totalVol.toLocaleString('nl-NL');

    const avgEx = completed.length > 0
        ? (completed.reduce((sum, w) => sum + Object.keys(w.exercises).length, 0) / completed.length).toFixed(1)
        : 0;
    document.getElementById('avgExercises').textContent = avgEx;

    renderVolumeChart(completed);
    renderFrequencyChart(completed);
    renderMuscleChart(completed);
}

function getWeekLabel(dateStr) {
    const d = new Date(dateStr + 'T12:00:00');
    const startOfYear = new Date(d.getFullYear(), 0, 1);
    const weekNum = Math.ceil(((d - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
    return `W${weekNum}`;
}

function renderVolumeChart(completed) {
    const weekData = {};
    completed.forEach(w => {
        const week = getWeekLabel(w.date);
        if (!weekData[week]) weekData[week] = 0;
        Object.values(w.exercises).forEach(ex => {
            weekData[week] += calcVolume(ex.sets);
        });
    });

    const labels = Object.keys(weekData).slice(-8);
    const data = labels.map(l => weekData[l]);

    if (volumeChart) volumeChart.destroy();
    volumeChart = new Chart(document.getElementById('volumeChart'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Volume (kg)',
                data,
                backgroundColor: 'rgba(108, 99, 255, 0.6)',
                borderColor: '#6C63FF',
                borderWidth: 2,
                borderRadius: 6,
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94A1B2' } },
                x: { grid: { display: false }, ticks: { color: '#94A1B2' } }
            }
        }
    });
}

function renderFrequencyChart(completed) {
    const weekData = {};
    completed.forEach(w => {
        const week = getWeekLabel(w.date);
        if (!weekData[week]) weekData[week] = 0;
        weekData[week]++;
    });

    const labels = Object.keys(weekData).slice(-8);
    const data = labels.map(l => weekData[l]);

    if (frequencyChart) frequencyChart.destroy();
    frequencyChart = new Chart(document.getElementById('frequencyChart'), {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Workouts',
                data,
                borderColor: '#2CB67D',
                backgroundColor: 'rgba(44, 182, 125, 0.1)',
                fill: true,
                tension: 0.3,
                pointBackgroundColor: '#2CB67D',
                pointRadius: 4,
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94A1B2', stepSize: 1 } },
                x: { grid: { display: false }, ticks: { color: '#94A1B2' } }
            }
        }
    });
}

function renderMuscleChart(completed) {
    const typeCounts = {};
    completed.forEach(w => {
        typeCounts[w.type] = (typeCounts[w.type] || 0) + 1;
    });

    const allPlans = getWorkoutPlan();
    const labels = Object.keys(typeCounts).map(t => allPlans[t] ? allPlans[t].label : t);
    const data = Object.values(typeCounts);
    const colors = ['#6C63FF', '#2CB67D', '#FF8906', '#FF6584', '#E8D44D', '#94A1B2'];

    if (muscleChart) muscleChart.destroy();
    muscleChart = new Chart(document.getElementById('muscleChart'), {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 0,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#94A1B2', padding: 16, usePointStyle: true }
                }
            },
            cutout: '65%'
        }
    });
}

// ============================================
// Profile Tab
// ============================================
function renderProfile() {
    const p = appData.profile;

    // Avatar
    const avatar = document.getElementById('profileAvatar');
    avatar.textContent = p.name.charAt(0).toUpperCase();

    document.getElementById('profileDisplayName').textContent = p.name;

    // BMI
    const bmi = calcBMI(p.weight, p.height);
    document.getElementById('profileBMI').textContent = bmi ? bmi.toFixed(1) : '-';
    document.getElementById('profileBMICategory').textContent = bmi ? getBMICategory(bmi) : '-';

    // Details
    document.getElementById('profileGoalDisplay').textContent = GOAL_LABELS[p.goal] || p.goal;
    document.getElementById('profileGenderDisplay').textContent = p.gender.charAt(0).toUpperCase() + p.gender.slice(1);
    document.getElementById('profileAgeDisplay').textContent = `${p.age} jaar`;
    document.getElementById('profileHeightDisplay').textContent = `${p.height} cm`;
    document.getElementById('profileWeightDisplay').textContent = `${p.weight} kg`;
    document.getElementById('profileSchemaDisplay').textContent = getSplitLabel(p.trainingDays.length);

    const dayNames = p.trainingDays
        .sort((a, b) => a - b)
        .map(d => DAYS_SHORT[d]);
    document.getElementById('profileDaysDisplay').textContent = dayNames.join(', ');
}

// ============================================
// Inline Profile Editing
// ============================================
let editingField = null;

const FIELD_CONFIG = {
    name:   { title: 'Naam bewerken', type: 'text' },
    gender: { title: 'Geslacht bewerken', type: 'choice', options: ['man', 'vrouw', 'anders'] },
    age:    { title: 'Leeftijd bewerken', type: 'number', unit: 'jaar', min: 10, max: 100 },
    height: { title: 'Lengte bewerken', type: 'number', unit: 'cm', min: 100, max: 250 },
    weight: { title: 'Gewicht bewerken', type: 'number', unit: 'kg', min: 30, max: 300, step: 0.1 },
    goal:   { title: 'Doel bewerken', type: 'choice', options: ['spiermassa', 'kracht', 'afvallen', 'fitness'], labels: GOAL_LABELS },
    trainingDays: { title: 'Trainingsdagen bewerken', type: 'days' }
};

// Name click
document.getElementById('profileDisplayName')?.addEventListener('click', () => openFieldEditor('name'));

// Row clicks
document.querySelectorAll('.profile-row.editable').forEach(row => {
    row.addEventListener('click', () => openFieldEditor(row.dataset.field));
});

function openFieldEditor(field) {
    editingField = field;
    const config = FIELD_CONFIG[field];
    const modal = document.getElementById('editFieldModal');
    const content = document.getElementById('editFieldContent');
    document.getElementById('editFieldTitle').textContent = config.title;

    const currentValue = field === 'trainingDays' ? appData.profile.trainingDays : appData.profile[field];

    if (config.type === 'text') {
        content.innerHTML = `<div class="form-group"><input type="text" class="form-input" id="editFieldInput" value="${currentValue}"></div>`;
    } else if (config.type === 'number') {
        content.innerHTML = `<div class="form-group"><div class="input-with-unit"><input type="number" class="form-input" id="editFieldInput" value="${currentValue}" min="${config.min}" max="${config.max}" step="${config.step || 1}" inputmode="decimal"><span class="unit-label">${config.unit}</span></div></div>`;
    } else if (config.type === 'choice') {
        const labels = config.labels || {};
        content.innerHTML = `<div class="option-group edit-options">${config.options.map(opt =>
            `<button class="option-btn${currentValue === opt ? ' selected' : ''}" data-value="${opt}">${labels[opt] || opt.charAt(0).toUpperCase() + opt.slice(1)}</button>`
        ).join('')}</div>`;
        content.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                content.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
        });
    } else if (config.type === 'days') {
        content.innerHTML = `<div class="day-selector edit-days">${
            [1,2,3,4,5,6,0].map(d => `<button class="day-btn${currentValue.includes(d) ? ' selected' : ''}" data-day="${d}">${DAYS_SHORT[d]}</button>`).join('')
        }</div><p class="day-count" id="editDayCount"></p>`;
        content.querySelectorAll('.day-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('selected');
                const count = content.querySelectorAll('.day-btn.selected').length;
                document.getElementById('editDayCount').textContent = count < 2
                    ? 'Minimaal 2 dagen'
                    : `${count} dagen — ${getSplitLabel(count)}`;
            });
        });
        const count = currentValue.length;
        setTimeout(() => {
            const el = document.getElementById('editDayCount');
            if (el) el.textContent = `${count} dagen — ${getSplitLabel(count)}`;
        }, 0);
    }

    modal.classList.add('active');
}

document.getElementById('cancelEditField')?.addEventListener('click', () => {
    document.getElementById('editFieldModal').classList.remove('active');
    editingField = null;
});

document.getElementById('editFieldModal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        document.getElementById('editFieldModal').classList.remove('active');
        editingField = null;
    }
});

document.getElementById('saveEditField')?.addEventListener('click', () => {
    const config = FIELD_CONFIG[editingField];
    const content = document.getElementById('editFieldContent');
    let newValue;

    if (config.type === 'text') {
        newValue = document.getElementById('editFieldInput').value.trim();
        if (!newValue) { showToast('Vul een waarde in'); return; }
    } else if (config.type === 'number') {
        newValue = parseFloat(document.getElementById('editFieldInput').value);
        if (!newValue || newValue < config.min || newValue > config.max) {
            showToast(`Waarde moet tussen ${config.min} en ${config.max} ${config.unit} zijn`);
            return;
        }
    } else if (config.type === 'choice') {
        const sel = content.querySelector('.option-btn.selected');
        if (!sel) { showToast('Maak een keuze'); return; }
        newValue = sel.dataset.value;
    } else if (config.type === 'days') {
        newValue = Array.from(content.querySelectorAll('.day-btn.selected')).map(b => parseInt(b.dataset.day));
        if (newValue.length < 2) { showToast('Selecteer minimaal 2 dagen'); return; }
    }

    // Save
    if (editingField === 'trainingDays') {
        appData.profile.trainingDays = newValue;
    } else {
        appData.profile[editingField] = newValue;
    }

    // Track weight changes
    if (editingField === 'weight') {
        if (!appData.profile.weightHistory) appData.profile.weightHistory = [];
        appData.profile.weightHistory.push({ date: getTodayString(), weight: newValue });
    }

    saveData();
    renderProfile();
    document.getElementById('editFieldModal').classList.remove('active');
    editingField = null;
    showToast('Profiel bijgewerkt!');
});

document.getElementById('resetProfileBtn')?.addEventListener('click', () => {
    if (confirm('Weet je zeker dat je je profiel en alle data wilt resetten?')) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    }
});

// ============================================
// Badge / Achievement System
// ============================================
const BADGES = [
    // Streak badges
    { id: 'streak_3',  icon: '&#x1F525;', name: 'Op Stoom',        desc: '3 workouts op rij', category: 'Streak',  check: d => calcStreak(d) >= 3 },
    { id: 'streak_5',  icon: '&#x26A1;',  name: 'Onverstoorbaar',  desc: '5 workouts op rij', category: 'Streak',  check: d => calcStreak(d) >= 5 },
    { id: 'streak_10', icon: '&#x1F3C6;', name: 'Machine',         desc: '10 workouts op rij',category: 'Streak',  check: d => calcStreak(d) >= 10 },
    { id: 'streak_25', icon: '&#x1F48E;', name: 'Legende',         desc: '25 workouts op rij',category: 'Streak',  check: d => calcStreak(d) >= 25 },

    // Total workouts
    { id: 'total_1',   icon: '&#x1F44A;', name: 'Eerste Stap',     desc: 'Eerste workout voltooid',    category: 'Workouts', check: d => completedCount(d) >= 1 },
    { id: 'total_10',  icon: '&#x1F4AA;', name: 'Doorzetter',      desc: '10 workouts voltooid',       category: 'Workouts', check: d => completedCount(d) >= 10 },
    { id: 'total_25',  icon: '&#x1F3CB;', name: 'Gym Rat',         desc: '25 workouts voltooid',       category: 'Workouts', check: d => completedCount(d) >= 25 },
    { id: 'total_50',  icon: '&#x1F947;', name: 'Half Centurion',  desc: '50 workouts voltooid',       category: 'Workouts', check: d => completedCount(d) >= 50 },
    { id: 'total_100', icon: '&#x1F451;', name: 'Centurion',       desc: '100 workouts voltooid',      category: 'Workouts', check: d => completedCount(d) >= 100 },

    // Volume badges
    { id: 'vol_1k',    icon: '&#x1F4A5;', name: '1 Ton Club',      desc: '1.000 kg totaal volume',     category: 'Volume', check: d => totalVolume(d) >= 1000 },
    { id: 'vol_5k',    icon: '&#x1F30B;', name: 'Kracht Berg',     desc: '5.000 kg totaal volume',     category: 'Volume', check: d => totalVolume(d) >= 5000 },
    { id: 'vol_10k',   icon: '&#x1F680;', name: 'Raket Kracht',    desc: '10.000 kg totaal volume',    category: 'Volume', check: d => totalVolume(d) >= 10000 },
    { id: 'vol_25k',   icon: '&#x2B50;',  name: 'Volume Ster',     desc: '25.000 kg totaal volume',    category: 'Volume', check: d => totalVolume(d) >= 25000 },
    { id: 'vol_50k',   icon: '&#x1F30D;', name: 'Wereldkracht',    desc: '50.000 kg totaal volume',    category: 'Volume', check: d => totalVolume(d) >= 50000 },
    { id: 'vol_100k',  icon: '&#x1F311;', name: 'Titanium',        desc: '100.000 kg totaal volume',   category: 'Volume', check: d => totalVolume(d) >= 100000 },

    // Weekly volume
    { id: 'week_5k',   icon: '&#x1F4CA;', name: 'Productieve Week',desc: '5.000 kg in een week',       category: 'Wekelijks', check: d => bestWeekVolume(d) >= 5000 },
    { id: 'week_10k',  icon: '&#x1F4C8;', name: 'Monster Week',    desc: '10.000 kg in een week',      category: 'Wekelijks', check: d => bestWeekVolume(d) >= 10000 },
    { id: 'week_20k',  icon: '&#x1F525;', name: 'Beest Modus',     desc: '20.000 kg in een week',      category: 'Wekelijks', check: d => bestWeekVolume(d) >= 20000 },

    // Variety
    { id: 'all_types', icon: '&#x1F3AF;', name: 'All-Rounder',     desc: 'Alle split types gedaan',    category: 'Variatie', check: d => allTypesCompleted(d) },

    // Personal records
    { id: 'first_rpe', icon: '&#x1F3AC;', name: 'Zelfkennis',      desc: 'Eerste RPE score gegeven',   category: 'Speciaal', check: d => hasAnyRPE(d) },
    { id: 'perfect_w', icon: '&#x2728;',  name: 'Perfect Workout',  desc: 'Alle oefeningen in 1 workout', category: 'Speciaal', check: d => hasPerfectWorkout(d) },
];

// Badge helper functions
function completedCount(data) {
    return data.workouts.filter(w => w.completed).length;
}

function totalVolume(data) {
    let vol = 0;
    data.workouts.filter(w => w.completed).forEach(w => {
        Object.values(w.exercises).forEach(ex => {
            if (ex.sets) vol += ex.sets.reduce((s, set) => s + (set.weight * set.reps), 0);
        });
    });
    return vol;
}

function calcStreak(data) {
    const completed = data.workouts.filter(w => w.completed);
    const completedDates = new Set(completed.map(w => w.date));
    const trainingDays = data.profile.trainingDays;
    let streak = 0;
    let bestStreak = 0;
    let checkDate = new Date(getTodayString() + 'T12:00:00');

    // Also check historically for best streak
    const allDates = completed.map(w => w.date).sort();
    if (allDates.length === 0) return 0;

    // Current streak from today backwards
    for (let i = 0; i < 365; i++) {
        const dateStr = checkDate.toISOString().split('T')[0];
        const isTraining = trainingDays.includes(checkDate.getDay());
        if (isTraining) {
            if (completedDates.has(dateStr)) {
                streak++;
            } else if (i > 0) {
                break;
            }
        }
        checkDate.setDate(checkDate.getDate() - 1);
    }
    bestStreak = streak;

    // Also scan all history for best streak
    let tempStreak = 0;
    const sorted = completed.map(w => w.date).sort();
    for (let i = 0; i < sorted.length; i++) {
        if (i === 0) { tempStreak = 1; continue; }
        // Check if there's a gap (only count training days between)
        const prev = new Date(sorted[i-1] + 'T12:00:00');
        const curr = new Date(sorted[i] + 'T12:00:00');
        let gap = false;
        const cursor = new Date(prev.getTime() + 86400000);
        while (cursor < curr) {
            if (trainingDays.includes(cursor.getDay())) {
                gap = true;
                break;
            }
            cursor.setDate(cursor.getDate() + 1);
        }
        tempStreak = gap ? 1 : tempStreak + 1;
        bestStreak = Math.max(bestStreak, tempStreak);
    }
    return bestStreak;
}

function bestWeekVolume(data) {
    const weekVols = {};
    data.workouts.filter(w => w.completed).forEach(w => {
        const week = getWeekLabel(w.date);
        if (!weekVols[week]) weekVols[week] = 0;
        Object.values(w.exercises).forEach(ex => {
            if (ex.sets) weekVols[week] += ex.sets.reduce((s, set) => s + (set.weight * set.reps), 0);
        });
    });
    return Math.max(0, ...Object.values(weekVols));
}

function allTypesCompleted(data) {
    const types = new Set(data.workouts.filter(w => w.completed).map(w => w.type));
    const rotation = getSplitRotation(data.profile.trainingDays.length);
    return rotation.every(t => types.has(t));
}

function hasAnyRPE(data) {
    return data.workouts.some(w => Object.values(w.exercises).some(ex => ex.rpe));
}

function hasPerfectWorkout(data) {
    const allPlans = getExercises(data.profile.goal);
    return data.workouts.filter(w => w.completed).some(w => {
        const plan = allPlans[w.type];
        if (!plan) return false;
        const logged = Object.keys(w.exercises).length;
        return logged >= plan.exercises.length;
    });
}

function getUnlockedBadges() {
    if (!appData || !appData.workouts) return [];
    return BADGES.filter(b => b.check(appData));
}

function renderBadges() {
    const grid = document.getElementById('badgesList');
    if (!grid) return;
    grid.innerHTML = '';

    const unlocked = new Set(getUnlockedBadges().map(b => b.id));
    const total = BADGES.length;
    const earned = unlocked.size;

    document.getElementById('badgesProgress').textContent = `${earned} / ${total} behaald`;

    // Group by category
    const categories = {};
    BADGES.forEach(b => {
        if (!categories[b.category]) categories[b.category] = [];
        categories[b.category].push(b);
    });

    Object.entries(categories).forEach(([cat, badges]) => {
        const section = document.createElement('div');
        section.className = 'badge-category';
        section.innerHTML = `<h3 class="badge-category-title">${cat}</h3>`;

        const badgeRow = document.createElement('div');
        badgeRow.className = 'badge-row';

        badges.forEach(badge => {
            const isUnlocked = unlocked.has(badge.id);
            const card = document.createElement('div');
            card.className = `badge-card${isUnlocked ? ' unlocked' : ' locked'}`;
            card.innerHTML = `
                <span class="badge-icon">${isUnlocked ? badge.icon : '&#x1F512;'}</span>
                <span class="badge-name">${badge.name}</span>
                <span class="badge-desc">${badge.desc}</span>
            `;
            badgeRow.appendChild(card);
        });

        section.appendChild(badgeRow);
        grid.appendChild(section);
    });
}

// Badge showcase on profile (show last 5 earned)
function renderBadgeShowcase() {
    const showcase = document.getElementById('profileBadgeShowcase');
    if (!showcase) return;
    const earned = getUnlockedBadges();
    if (earned.length === 0) {
        showcase.innerHTML = '<span class="showcase-empty">Nog geen badges behaald</span>';
        return;
    }
    showcase.innerHTML = earned.slice(-5).map(b =>
        `<span class="showcase-badge" title="${b.name}: ${b.desc}">${b.icon}</span>`
    ).join('');
}

// Check for new badges after workout completion
function checkNewBadges() {
    if (!appData || !appData.profile) return;
    const prevUnlocked = new Set((appData.unlockedBadgeIds || []));
    const currentUnlocked = getUnlockedBadges();
    const newBadges = currentUnlocked.filter(b => !prevUnlocked.has(b.id));

    if (newBadges.length > 0) {
        appData.unlockedBadgeIds = currentUnlocked.map(b => b.id);
        saveData();
        // Show toast for first new badge
        showToast(`Badge behaald: ${newBadges[0].name}!`);
    }
}

// ============================================
// Day Navigation
// ============================================
function initDayNav() {
    const prev = document.getElementById('prevDay');
    const next = document.getElementById('nextDay');
    if (prev) prev.addEventListener('click', () => {
        selectedDate = new Date(selectedDate.getTime() - 86400000);
        renderWorkout();
    });
    if (next) next.addEventListener('click', () => {
        const tomorrow = new Date(selectedDate.getTime() + 86400000);
        const todayEnd = new Date(getTodayString() + 'T23:59:59');
        if (tomorrow <= todayEnd) {
            selectedDate = tomorrow;
            renderWorkout();
        }
    });
}

// ============================================
// App Init
// ============================================
function startApp() {
    document.getElementById('onboarding').style.display = 'none';
    document.getElementById('mainApp').style.display = '';
    initTabs();
    initDayNav();
    renderWorkout();
}

// Boot
if (hasProfile()) {
    startApp();
} else {
    initOnboarding();
}
