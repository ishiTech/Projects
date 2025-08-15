class FocusTimer {
    constructor() {
        this.timer = null;
        this.minutes = 0;
        this.seconds = 0;
        this.isRunning = false;
        this.isCompleted = false;
        
        this.initializeElements();
        this.bindEvents();
        this.loadInitialState();
        this.displayHistory();
        
        this.motivationalQuotes = [
            "Excellence is not a skill, it's an attitude. ✨",
            "Your only limit is your mind. Break through it. 🚀", 
            "Success is the sum of small efforts repeated daily. 💪",
            "Focus is the key that unlocks your potential. 🔑",
            "Every expert was once a beginner. Keep going. 🌟",
            "Progress, not perfection, is the goal. 📈",
            "Discipline is choosing between what you want now and what you want most. ⚡",
            "The future depends on what you do today. 🎯",
            "Champions are made when nobody's watching. 🏆",
            "Your potential is endless. 🌟"
        ];
    }
    
    initializeElements() {
        this.minutesInput = document.getElementById('minutesInput');
        this.timerDisplay = document.getElementById('timerDisplay');
        this.timerStatus = document.getElementById('timerStatus');
        this.timerCard = document.getElementById('timerCard');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.breakContent = document.getElementById('breakContent');
        this.breakMessage = document.getElementById('breakMessage');
        this.historyList = document.getElementById('historyList');
        this.weeklyStats = document.getElementById('weeklyStats');
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.minutesInput.addEventListener('change', () => this.updateInitialTime());
    }
    
    loadInitialState() {
        this.updateInitialTime();
    }
    
    updateInitialTime() {
        if (!this.isRunning && !this.isCompleted) {
            this.minutes = parseInt(this.minutesInput.value) || 25;
            this.seconds = 0;
            this.updateDisplay();
        }
    }
    
    updateDisplay() {
        const formattedTime = `${this.minutes}:${this.seconds < 10 ? '0' : ''}${this.seconds}`;
        this.timerDisplay.textContent = formattedTime;
        
        if (this.isRunning) {
            this.timerStatus.textContent = "Focus time in progress...";
            this.timerCard.classList.add('timer-running');
        } else if (this.isCompleted) {
            this.timerStatus.textContent = "Session completed!";
            this.timerCard.classList.remove('timer-running');
        } else {
            this.timerStatus.textContent = "Ready to focus";
            this.timerCard.classList.remove('timer-running');
        }
    }
    
    start() {
        if (!this.isRunning) {
            this.minutes = parseInt(this.minutesInput.value) || 25;
            this.seconds = 0;
            this.isRunning = true;
            this.isCompleted = false;
            this.hideBreakContent();
            
            this.timer = setInterval(() => {
                if (this.seconds === 0) {
                    if (this.minutes === 0) {
                        this.complete();
                    } else {
                        this.minutes--;
                        this.seconds = 59;
                    }
                } else {
                    this.seconds--;
                }
                this.updateDisplay();
            }, 1000);
            
            this.updateControls();
            this.updateDisplay();
        }
    }
    
    pause() {
        if (this.isRunning) {
            clearInterval(this.timer);
            this.isRunning = false;
            this.updateControls();
            this.updateDisplay();
        }
    }
    
    reset() {
        clearInterval(this.timer);
        this.isRunning = false;
        this.isCompleted = false;
        this.updateInitialTime();
        this.hideBreakContent();
        this.updateControls();
        this.updateDisplay();
    }
    
    complete() {
        clearInterval(this.timer);
        this.isRunning = false;
        this.isCompleted = true;
        this.showBreakContent();
        this.saveSession();
        this.updateControls();
        this.updateDisplay();
    }
    
    updateControls() {
        this.startBtn.disabled = this.isRunning;
        this.pauseBtn.disabled = !this.isRunning;
        this.minutesInput.disabled = this.isRunning;
    }
    
    showBreakContent() {
        const randomQuote = this.motivationalQuotes[Math.floor(Math.random() * this.motivationalQuotes.length)];
        this.breakMessage.textContent = randomQuote;
        this.breakContent.classList.remove('hidden');
    }
    
    hideBreakContent() {
        this.breakContent.classList.add('hidden');
    }
    
    saveSession() {
        const sessionData = {
            date: new Date().toLocaleString(),
            duration: parseInt(this.minutesInput.value),
            timestamp: Date.now()
        };
        
        let history = JSON.parse(localStorage.getItem('focusTimerHistory') || '[]');
        history.unshift(sessionData);
        history = history.slice(0, 10); // Keep only last 10 sessions
        localStorage.setItem('focusTimerHistory', JSON.stringify(history));
        
        this.displayHistory();
    }
    
    displayHistory() {
        const history = JSON.parse(localStorage.getItem('focusTimerHistory') || '[]');
        
        if (history.length === 0) {
            this.historyList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12,6 12,12 16,14"/>
                        </svg>
                    </div>
                    <p class="empty-text">No sessions yet. Start your first focus session!</p>
                </div>
            `;
        } else {
            this.historyList.innerHTML = history.map(session => `
                <div class="history-item">
                    <span class="history-date">${this.formatDate(session.date)}</span>
                    <span class="history-duration">${session.duration} min</span>
                </div>
            `).join('');
        }
        
        this.updateWeeklyStats(history);
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 1) {
            return `Today, ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        } else if (diffDays === 2) {
            return `Yesterday, ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        } else {
            return date.toLocaleDateString([], {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'});
        }
    }
    
    updateWeeklyStats(history) {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const weeklyCount = history.filter(session => {
            const sessionDate = new Date(session.timestamp);
            return sessionDate > weekAgo;
        }).length;
        
        this.weeklyStats.textContent = `${weeklyCount} sessions completed this week`;
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new FocusTimer();
});