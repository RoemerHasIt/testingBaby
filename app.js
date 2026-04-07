// ============================================
// FitTrack - Fitness Tracker App
// ============================================

const STORAGE_KEY = 'fittrack_data';

// Workout schema: Push / Pull / Legs (6-dag rotatie)
const WORKOUT_PLAN = {
    push: {
        label: 'Push',
        muscle: 'Borst, Schouders & Triceps',
        exercises: [
            { name: 'Bench Press', target: '4 x 8-10', muscle: 'Borst' },
            { name: 'Overhead Press', target: '3 x 8-10', muscle: 'Schouders' },
            { name: 'Incline Dumbbell Press', target: '3 x 10-12', muscle: 'Borst' },
            { name: 'Lateral Raises', target: '3 x 12-15', muscle: 'Schouders' },
            { name: 'Tricep Pushdown', target: '3 x 10-12', muscle: 'Triceps' },
            { name: 'Overhead Tricep Extension', target: '3 x 10-12', muscle: 'Triceps' },
        ]
    },
    pull: {
        label: 'Pull',
        muscle: 'Rug & Biceps',
        exercises: [
            { name: 'Deadlift', target: '3 x 5-6', muscle: 'Rug' },
            { name: 'Pull-ups', target: '4 x 6-10', muscle: 'Rug' },
            { name: 'Barbell Row', target: '3 x 8-10', muscle: 'Rug' },
            { name: 'Face Pulls', target: '3 x 12-15', muscle: 'Achter Schouders' },
            { name: 'Barbell Curl', target: '3 x 10-12', muscle: 'Biceps' },
            { name: 'Hammer Curl', target: '3 x 10-12', muscle: 'Biceps' },
        ]
    },
    legs: {
        label: 'Legs',
        muscle: 'Benen & Core',
        exercises: [
            { name: 'Squat', target: '4 x 6-8', muscle: 'Quadriceps' },
            { name: 'Romanian Deadlift', target: '3 x 8-10', muscle: 'Hamstrings' },
            { name: 'Leg Press', target: '3 x 10-12', muscle: 'Quadriceps' },
            { name: 'Walking Lunges', target: '3 x 10 per been', muscle: 'Benen' },
            { name: 'Calf Raises', target: '4 x 12-15', muscle: 'Kuiten' },
            { name: 'Plank', target: '3 x 45-60s', muscle: 'Core' },
        ]
    }
};

const DAY_ROTATION = ['push', 'pull', 'legs', 'push', 'pull', 'legs'];
const DAYS_NL = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
const MONTHS_NL = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

// ============================================
// State
// ============================================
let appData = loadData();
let currentExercise = null;
let currentExerciseSets = [];

function loadData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    return { workouts: [], startDate: new Date().toISOString().split('T')[0] };
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
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

function getTodayWorkoutType() {
    const start = new Date(appData.startDate + 'T12:00:00');
    const today = new Date(getTodayString() + 'T12:00:00');
    const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
    const index = ((diffDays % 6) + 6) % 6;
    return DAY_ROTATION[index];
}

function getTodayWorkout() {
    return appData.workouts.find(w => w.date === getTodayString());
}

function getOrCreateTodayWorkout() {
    let workout = getTodayWorkout();
    if (!workout) {
        const type = getTodayWorkoutType();
        workout = {
            date: getTodayString(),
            type: type,
            exercises: {},
            completed: false
        };
        appData.workouts.push(workout);
        saveData();
    }
    return workout;
}

function calcVolume(sets) {
    return sets.reduce((sum, s) => sum + (s.weight * s.reps), 0);
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

// ============================================
// Tab Navigation
// ============================================
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');

        if (tab.dataset.tab === 'stats') renderStats();
        if (tab.dataset.tab === 'history') renderHistory();
    });
});

// ============================================
// Workout Tab
// ============================================
function renderWorkout() {
    const today = new Date();
    document.getElementById('dateDisplay').textContent =
        `${DAYS_NL[today.getDay()]} ${today.getDate()} ${MONTHS_NL[today.getMonth()]} ${today.getFullYear()}`;

    const type = getTodayWorkoutType();
    const plan = WORKOUT_PLAN[type];
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
                ${isCompleted ? `<div class="exercise-sets-summary">${logged.sets.length} sets — ${calcVolume(logged.sets)} kg volume</div>` : ''}
            </div>
            <div class="exercise-status">${isCompleted ? '&#10003;' : ''}</div>
        `;
        card.addEventListener('click', () => openExerciseModal(exercise, idx));
        list.appendChild(card);
    });

    const finishBtn = document.getElementById('finishWorkout');
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

document.getElementById('finishWorkout').addEventListener('click', () => {
    const workout = getTodayWorkout();
    if (workout && !workout.completed) {
        workout.completed = true;
        saveData();
        renderWorkout();
        showToast('Workout opgeslagen!');
    }
});

// ============================================
// Exercise Modal
// ============================================
function openExerciseModal(exercise, index) {
    currentExercise = { ...exercise, index };

    const workout = getOrCreateTodayWorkout();
    const existing = workout.exercises[index];

    if (existing && existing.sets && existing.sets.length > 0) {
        currentExerciseSets = [...existing.sets];
    } else {
        // Pre-fill with target sets
        const match = exercise.target.match(/(\d+)\s*x/);
        const numSets = match ? parseInt(match[1]) : 3;
        currentExerciseSets = Array.from({ length: numSets }, () => ({ weight: 0, reps: 0 }));
    }

    document.getElementById('modalTitle').textContent = exercise.name;
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

    // Input listeners
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

document.getElementById('addSetBtn').addEventListener('click', () => {
    const lastSet = currentExerciseSets[currentExerciseSets.length - 1];
    currentExerciseSets.push({ weight: lastSet.weight, reps: lastSet.reps });
    renderSets();
});

document.getElementById('cancelModal').addEventListener('click', () => {
    document.getElementById('modalOverlay').classList.remove('active');
    currentExercise = null;
});

document.getElementById('saveModal').addEventListener('click', () => {
    const workout = getOrCreateTodayWorkout();
    const validSets = currentExerciseSets.filter(s => s.reps > 0);

    if (validSets.length > 0) {
        workout.exercises[currentExercise.index] = {
            name: currentExercise.name,
            sets: validSets
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

// Close modal on overlay click
document.getElementById('modalOverlay').addEventListener('click', (e) => {
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

    completed.forEach(workout => {
        const plan = WORKOUT_PLAN[workout.type];
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

    // Summary cards
    document.getElementById('totalWorkouts').textContent = completed.length;

    // Streak
    let streak = 0;
    const sortedDates = completed.map(w => w.date).sort().reverse();
    if (sortedDates.length > 0) {
        const today = getTodayString();
        let checkDate = today;
        for (let i = 0; i < 365; i++) {
            if (sortedDates.includes(checkDate)) {
                streak++;
            } else if (i > 0) {
                break;
            }
            const d = new Date(checkDate + 'T12:00:00');
            d.setDate(d.getDate() - 1);
            checkDate = d.toISOString().split('T')[0];
        }
    }
    document.getElementById('currentStreak').textContent = streak;

    // Total volume
    let totalVol = 0;
    completed.forEach(w => {
        Object.values(w.exercises).forEach(ex => {
            totalVol += calcVolume(ex.sets);
        });
    });
    document.getElementById('totalVolume').textContent = totalVol.toLocaleString('nl-NL');

    // Avg exercises
    const avgEx = completed.length > 0
        ? (completed.reduce((sum, w) => sum + Object.keys(w.exercises).length, 0) / completed.length).toFixed(1)
        : 0;
    document.getElementById('avgExercises').textContent = avgEx;

    // Charts
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
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#94A1B2' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94A1B2' }
                }
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
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#94A1B2', stepSize: 1 }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94A1B2' }
                }
            }
        }
    });
}

function renderMuscleChart(completed) {
    const muscleCount = { push: 0, pull: 0, legs: 0 };
    completed.forEach(w => {
        if (muscleCount[w.type] !== undefined) muscleCount[w.type]++;
    });

    if (muscleChart) muscleChart.destroy();
    muscleChart = new Chart(document.getElementById('muscleChart'), {
        type: 'doughnut',
        data: {
            labels: ['Push', 'Pull', 'Legs'],
            datasets: [{
                data: [muscleCount.push, muscleCount.pull, muscleCount.legs],
                backgroundColor: ['#6C63FF', '#2CB67D', '#FF8906'],
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
// Init
// ============================================
renderWorkout();
