// ============================================
// FitDash - Fitness Dashboard App
// ============================================

const DASH_STORAGE = 'fitdash_data';

// ============================================
// Default / Demo Data
// ============================================

function getDefaultData() {
    const today = new Date();
    const workouts = [
        { id: 1, type: 'strength', name: 'Push Day', duration: 55, calories: 420, notes: 'Felt strong today', date: daysAgo(0) },
        { id: 2, type: 'cardio', name: 'Morning Run', duration: 35, calories: 310, notes: '5K in 28 min', date: daysAgo(1) },
        { id: 3, type: 'strength', name: 'Pull Day', duration: 50, calories: 390, notes: 'New PR on deadlift', date: daysAgo(2) },
        { id: 4, type: 'flexibility', name: 'Yoga Flow', duration: 40, calories: 150, notes: 'Recovery session', date: daysAgo(3) },
        { id: 5, type: 'strength', name: 'Leg Day', duration: 60, calories: 480, notes: 'Heavy squats', date: daysAgo(4) },
        { id: 6, type: 'cardio', name: 'HIIT Session', duration: 25, calories: 350, notes: 'Tabata intervals', date: daysAgo(5) },
        { id: 7, type: 'strength', name: 'Push Day', duration: 50, calories: 400, notes: '', date: daysAgo(6) },
        { id: 8, type: 'cardio', name: 'Cycling', duration: 45, calories: 380, notes: '20km ride', date: daysAgo(8) },
        { id: 9, type: 'strength', name: 'Pull Day', duration: 48, calories: 370, notes: '', date: daysAgo(9) },
        { id: 10, type: 'flexibility', name: 'Stretching', duration: 30, calories: 100, notes: 'Full body', date: daysAgo(10) },
        { id: 11, type: 'strength', name: 'Leg Day', duration: 55, calories: 460, notes: '', date: daysAgo(11) },
        { id: 12, type: 'cardio', name: 'Swimming', duration: 40, calories: 400, notes: 'Laps at the pool', date: daysAgo(13) },
    ];

    const goals = [
        { id: 1, name: 'Workout 4x per week', target: 4, current: 3, unit: 'workouts', period: 'week' },
        { id: 2, name: 'Burn 2000 cal/week', target: 2000, current: 1470, unit: 'cal', period: 'week' },
        { id: 3, name: 'Bench Press 100kg', target: 100, current: 82.5, unit: 'kg', period: 'milestone' },
        { id: 4, name: 'Run 5K under 25 min', target: 25, current: 28, unit: 'min', period: 'milestone', lowerIsBetter: true },
    ];

    const weightHistory = [
        { date: daysAgo(42), value: 78.5 },
        { date: daysAgo(35), value: 78.0 },
        { date: daysAgo(28), value: 77.6 },
        { date: daysAgo(21), value: 77.2 },
        { date: daysAgo(14), value: 76.8 },
        { date: daysAgo(7), value: 76.5 },
        { date: daysAgo(0), value: 76.2 },
    ];

    const strengthHistory = [
        { date: daysAgo(56), value: 70 },
        { date: daysAgo(42), value: 72.5 },
        { date: daysAgo(28), value: 75 },
        { date: daysAgo(14), value: 80 },
        { date: daysAgo(0), value: 82.5 },
    ];

    return {
        profile: { name: 'User', weight: 76.2, height: 178, age: 27 },
        workouts,
        goals,
        weightHistory,
        strengthHistory,
        nextId: 13,
    };
}

function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split('T')[0];
}

// ============================================
// State
// ============================================

let state = loadState();

function loadState() {
    try {
        const raw = localStorage.getItem(DASH_STORAGE);
        if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return getDefaultData();
}

function saveState() {
    localStorage.setItem(DASH_STORAGE, JSON.stringify(state));
}

// ============================================
// Navigation
// ============================================

const pages = {
    overview: 'Overview',
    workouts: 'Workouts',
    progress: 'Progress',
    goals: 'Goals',
};

function navigate(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    const pageEl = document.getElementById('page-' + page);
    const navEl = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (pageEl) pageEl.classList.add('active');
    if (navEl) navEl.classList.add('active');

    document.getElementById('pageTitle').textContent = pages[page] || 'Overview';

    // Close mobile sidebar
    document.querySelector('.sidebar').classList.remove('open');

    if (page === 'overview') renderOverview();
    if (page === 'workouts') renderWorkouts();
    if (page === 'progress') renderProgress();
    if (page === 'goals') renderGoals();
}

// ============================================
// Render: Overview
// ============================================

let activityChart = null;
let splitChart = null;

function renderOverview() {
    const thisWeek = getThisWeekWorkouts();
    const lastWeek = getLastWeekWorkouts();

    // Stats
    const totalCal = thisWeek.reduce((s, w) => s + w.calories, 0);
    const totalMin = thisWeek.reduce((s, w) => s + w.duration, 0);
    const lastCal = lastWeek.reduce((s, w) => s + w.calories, 0);

    document.getElementById('totalCalories').textContent = totalCal.toLocaleString();
    document.getElementById('totalWorkouts').textContent = thisWeek.length;
    document.getElementById('totalMinutes').textContent = totalMin;
    document.getElementById('currentStreak').textContent = calculateStreak();

    // Trends
    const calPct = lastCal > 0 ? Math.round(((totalCal - lastCal) / lastCal) * 100) : 0;
    setTrend('calTrend', calPct, '%');
    setTrend('workoutTrend', thisWeek.length - lastWeek.length, '', true);

    // Recent workouts
    renderWorkoutList('recentWorkouts', state.workouts.slice(0, 5));

    // Goals overview
    renderGoalsOverview();

    // Charts
    renderActivityChart('week');
    renderSplitChart();
}

function setTrend(id, value, suffix, absolute) {
    const el = document.getElementById(id);
    if (!el) return;
    const prefix = value > 0 ? '+' : '';
    el.textContent = prefix + value + suffix;
    el.className = 'stat-trend ' + (value > 0 ? 'up' : value < 0 ? 'down' : 'neutral');
}

function getThisWeekWorkouts() {
    const start = getWeekStart(new Date());
    return state.workouts.filter(w => w.date >= start);
}

function getLastWeekWorkouts() {
    const thisStart = getWeekStart(new Date());
    const d = new Date(thisStart);
    d.setDate(d.getDate() - 7);
    const lastStart = d.toISOString().split('T')[0];
    return state.workouts.filter(w => w.date >= lastStart && w.date < thisStart);
}

function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return d.toISOString().split('T')[0];
}

function calculateStreak() {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 60; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const ds = d.toISOString().split('T')[0];
        if (state.workouts.some(w => w.date === ds)) {
            streak++;
        } else if (i > 0) {
            break;
        }
    }
    return streak;
}

function renderActivityChart(range) {
    const ctx = document.getElementById('activityChart');
    if (!ctx) return;

    if (activityChart) activityChart.destroy();

    let labels, data;
    if (range === 'week') {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        labels = days;
        data = days.map((_, i) => {
            const d = new Date();
            const day = d.getDay();
            const diff = (day === 0 ? -6 : 1) - day + i;
            const target = new Date(d);
            target.setDate(d.getDate() + diff);
            const ds = target.toISOString().split('T')[0];
            return state.workouts.filter(w => w.date === ds).reduce((s, w) => s + w.calories, 0);
        });
    } else {
        labels = [];
        data = [];
        for (let i = 3; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i * 7);
            const start = getWeekStart(d);
            const end = new Date(start);
            end.setDate(end.getDate() + 6);
            const endStr = end.toISOString().split('T')[0];
            labels.push('Wk ' + (4 - i));
            data.push(state.workouts.filter(w => w.date >= start && w.date <= endStr).reduce((s, w) => s + w.calories, 0));
        }
    }

    activityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Calories',
                data,
                backgroundColor: 'rgba(108, 92, 231, 0.6)',
                borderColor: '#6C5CE7',
                borderWidth: 1,
                borderRadius: 6,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false }, ticks: { color: '#9090A8', font: { size: 11 } } },
                y: { grid: { color: 'rgba(42,42,69,0.5)' }, ticks: { color: '#9090A8', font: { size: 11 } } }
            }
        }
    });

    ctx.parentElement.style.height = '240px';
}

function renderSplitChart() {
    const ctx = document.getElementById('splitChart');
    if (!ctx) return;

    if (splitChart) splitChart.destroy();

    const counts = { strength: 0, cardio: 0, flexibility: 0 };
    state.workouts.forEach(w => { if (counts[w.type] !== undefined) counts[w.type]++; });

    splitChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Strength', 'Cardio', 'Flexibility'],
            datasets: [{
                data: [counts.strength, counts.cardio, counts.flexibility],
                backgroundColor: ['#6C5CE7', '#00CEC9', '#FDCB6E'],
                borderWidth: 0,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#9090A8', padding: 12, font: { size: 11 } }
                }
            }
        }
    });

    ctx.parentElement.style.height = '240px';
}

// ============================================
// Render: Workout List
// ============================================

const TYPE_ICONS = { strength: '&#9883;', cardio: '&#9829;', flexibility: '&#9734;' };

function renderWorkoutList(containerId, workouts) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = workouts.map(w => `
        <div class="workout-item">
            <div class="workout-type-badge badge-${w.type}">${TYPE_ICONS[w.type] || '?'}</div>
            <div class="workout-details">
                <div class="workout-name">${escapeHtml(w.name)}</div>
                <div class="workout-meta">${formatDate(w.date)}${w.notes ? ' &middot; ' + escapeHtml(w.notes) : ''}</div>
            </div>
            <div class="workout-stats">
                <div class="workout-cal">${w.calories} cal</div>
                <div class="workout-dur">${w.duration} min</div>
            </div>
        </div>
    `).join('');
}

function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.floor((today - d) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return diff + ' days ago';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ============================================
// Render: Goals
// ============================================

function renderGoalsOverview() {
    const el = document.getElementById('goalsOverview');
    if (!el) return;

    el.innerHTML = state.goals.map(g => {
        const pct = g.lowerIsBetter
            ? Math.min(100, Math.round(((g.target / g.current) * 100)))
            : Math.min(100, Math.round((g.current / g.target) * 100));
        return `
            <div class="goal-item">
                <div class="goal-top">
                    <span class="goal-name">${escapeHtml(g.name)}</span>
                    <span class="goal-pct">${pct}%</span>
                </div>
                <div class="goal-bar"><div class="goal-fill" style="width:${pct}%"></div></div>
            </div>
        `;
    }).join('');
}

function renderGoals() {
    const el = document.getElementById('goalsFull');
    if (!el) return;

    el.innerHTML = state.goals.map(g => {
        const pct = g.lowerIsBetter
            ? Math.min(100, Math.round(((g.target / g.current) * 100)))
            : Math.min(100, Math.round((g.current / g.target) * 100));
        const detail = g.lowerIsBetter
            ? `Current: ${g.current}${g.unit} / Target: ${g.target}${g.unit}`
            : `${g.current} / ${g.target} ${g.unit}`;
        return `
            <div class="goal-card-full">
                <div class="goal-name">${escapeHtml(g.name)}</div>
                <div class="goal-detail">${detail}</div>
                <div class="goal-bar"><div class="goal-fill" style="width:${pct}%"></div></div>
                <div class="goal-pct">${pct}% complete</div>
            </div>
        `;
    }).join('');
}

// ============================================
// Render: Workouts Page
// ============================================

let currentFilter = 'all';

function renderWorkouts(filter) {
    if (filter) currentFilter = filter;
    const filtered = currentFilter === 'all'
        ? state.workouts
        : state.workouts.filter(w => w.type === currentFilter);
    renderWorkoutList('allWorkouts', filtered);
}

// ============================================
// Render: Progress Page
// ============================================

let weightChart = null;
let strengthChart = null;

function renderProgress() {
    renderWeightChart();
    renderStrengthChart();
    renderBodyMetrics();
}

function renderWeightChart() {
    const ctx = document.getElementById('weightChart');
    if (!ctx) return;
    if (weightChart) weightChart.destroy();

    const labels = state.weightHistory.map(w => {
        const d = new Date(w.date + 'T00:00:00');
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    const data = state.weightHistory.map(w => w.value);

    weightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Weight (kg)',
                data,
                borderColor: '#00CEC9',
                backgroundColor: 'rgba(0, 206, 201, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#00CEC9',
                pointRadius: 5,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false }, ticks: { color: '#9090A8', font: { size: 11 } } },
                y: { grid: { color: 'rgba(42,42,69,0.5)' }, ticks: { color: '#9090A8', font: { size: 11 } } }
            }
        }
    });
    ctx.parentElement.style.height = '260px';
}

function renderStrengthChart() {
    const ctx = document.getElementById('strengthChart');
    if (!ctx) return;
    if (strengthChart) strengthChart.destroy();

    const labels = state.strengthHistory.map(s => {
        const d = new Date(s.date + 'T00:00:00');
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    const data = state.strengthHistory.map(s => s.value);

    strengthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: '1RM Est. (kg)',
                data,
                borderColor: '#6C5CE7',
                backgroundColor: 'rgba(108, 92, 231, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#6C5CE7',
                pointRadius: 5,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false }, ticks: { color: '#9090A8', font: { size: 11 } } },
                y: { grid: { color: 'rgba(42,42,69,0.5)' }, ticks: { color: '#9090A8', font: { size: 11 } } }
            }
        }
    });
    ctx.parentElement.style.height = '260px';
}

function renderBodyMetrics() {
    const el = document.getElementById('bodyMetrics');
    if (!el) return;

    const p = state.profile;
    const bmi = (p.weight / ((p.height / 100) ** 2)).toFixed(1);
    const wh = state.weightHistory;
    const weightChange = wh.length >= 2 ? (wh[wh.length - 1].value - wh[wh.length - 2].value).toFixed(1) : 0;

    const totalWorkouts = state.workouts.length;
    const totalCal = state.workouts.reduce((s, w) => s + w.calories, 0);

    el.innerHTML = `
        <div class="metric-item">
            <span class="metric-value">${p.weight} kg</span>
            <span class="metric-label">Current Weight</span>
            <span class="metric-change ${weightChange <= 0 ? 'positive' : 'negative'}">${weightChange > 0 ? '+' : ''}${weightChange} kg</span>
        </div>
        <div class="metric-item">
            <span class="metric-value">${bmi}</span>
            <span class="metric-label">BMI</span>
            <span class="metric-change">${getBmiCategory(bmi)}</span>
        </div>
        <div class="metric-item">
            <span class="metric-value">${totalWorkouts}</span>
            <span class="metric-label">Total Workouts</span>
            <span class="metric-change positive">All time</span>
        </div>
        <div class="metric-item">
            <span class="metric-value">${(totalCal / 1000).toFixed(1)}k</span>
            <span class="metric-label">Total Calories</span>
            <span class="metric-change positive">All time</span>
        </div>
    `;
}

function getBmiCategory(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
}

// ============================================
// Log Workout Modal
// ============================================

function openModal() {
    document.getElementById('logModal').classList.add('open');
}

function closeModal() {
    document.getElementById('logModal').classList.remove('open');
    document.getElementById('logType').value = 'strength';
    document.getElementById('logName').value = '';
    document.getElementById('logDuration').value = '';
    document.getElementById('logCalories').value = '';
    document.getElementById('logNotes').value = '';
}

function saveWorkout() {
    const type = document.getElementById('logType').value;
    const name = document.getElementById('logName').value.trim();
    const duration = parseInt(document.getElementById('logDuration').value) || 0;
    const calories = parseInt(document.getElementById('logCalories').value) || 0;
    const notes = document.getElementById('logNotes').value.trim();

    if (!name || !duration) {
        alert('Please fill in at least a name and duration.');
        return;
    }

    const workout = {
        id: state.nextId++,
        type,
        name,
        duration,
        calories,
        notes,
        date: new Date().toISOString().split('T')[0],
    };

    state.workouts.unshift(workout);
    saveState();
    closeModal();
    navigate('overview');
}

// ============================================
// Utilities
// ============================================

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ============================================
// Event Listeners
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Set date
    const now = new Date();
    document.getElementById('pageDate').textContent = now.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    // Profile
    document.getElementById('profileName').textContent = state.profile.name;
    document.getElementById('profileAvatar').textContent = state.profile.name.charAt(0).toUpperCase();

    // Navigation
    document.querySelectorAll('.nav-item, .link[data-page]').forEach(el => {
        el.addEventListener('click', e => {
            e.preventDefault();
            navigate(el.dataset.page);
        });
    });

    // Mobile menu
    document.getElementById('menuToggle').addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('open');
    });

    // Chart range tabs
    document.querySelectorAll('.chart-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderActivityChart(tab.dataset.range);
        });
    });

    // Workout filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderWorkouts(btn.dataset.filter);
        });
    });

    // Modal
    document.getElementById('btnLogWorkout').addEventListener('click', openModal);
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalCancel').addEventListener('click', closeModal);
    document.getElementById('modalSave').addEventListener('click', saveWorkout);
    document.getElementById('logModal').addEventListener('click', e => {
        if (e.target === e.currentTarget) closeModal();
    });

    // Initial render
    navigate('overview');
});
