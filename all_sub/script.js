let currentIdx = 0;
let selections = new Array(questions.length).fill(null);
// UPDATED: Changed to 3600 for exactly 1 hour
let secondsLeft = 3600; 
let timerObj;

function render() {
    const q = questions[currentIdx];
    document.getElementById('topic-display').innerText = q.topic;
    document.getElementById('question-display').innerText = q.q;
    document.getElementById('counter-display').innerText = `Question ${currentIdx + 1} of ${questions.length}`;

    const container = document.getElementById('options-display');
    container.innerHTML = '';

    q.options.forEach((opt, i) => {
        const isSelected = selections[currentIdx] === i;
        container.innerHTML += `
            <label class="option">
                <input type="radio" name="answer" value="${i}" ${isSelected ? 'checked' : ''} onchange="saveAnswer(${i})">
                ${opt}
            </label>
        `;
    });

    document.getElementById('prevBtn').style.visibility = currentIdx === 0 ? 'hidden' : 'visible';
    document.getElementById('nextBtn').innerText = currentIdx === questions.length - 1 ? 'Finish' : 'Next →';
}

function saveAnswer(val) {
    selections[currentIdx] = val;
}

function navigate(step) {
    if (currentIdx === questions.length - 1 && step === 1) {
        handleManualSubmit();
        return;
    }
    currentIdx += step;
    render();
}

// CUSTOM MODAL LOGIC
function showModal(title, message, showCancel = true, onConfirm = null) {
    const modal = document.getElementById('customModal');
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalBody').innerText = message;
    
    const cancelBtn = document.getElementById('modalCancel');
    cancelBtn.style.display = showCancel ? 'inline-block' : 'none';
    
    modal.style.display = 'flex';

    document.getElementById('modalConfirm').onclick = () => {
        modal.style.display = 'none';
        if (onConfirm) onConfirm();
    };

    cancelBtn.onclick = () => {
        modal.style.display = 'none';
    };
}

function handleManualSubmit() {
    const unanswered = selections.filter(s => s === null).length;
    const message = unanswered > 0
        ? `You have ${unanswered} unanswered questions. Submit anyway?`
        : "Do you want to submit your exam now?";

    showModal("Submit Exam", message, true, () => {
        showResults();
    });
}

function showResults() {
    clearInterval(timerObj);
    document.getElementById('exam-view').style.display = 'none';
    document.querySelector('.header-tools').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';

    let correctCount = 0;
    const reviewDiv = document.getElementById('review-list');
    reviewDiv.innerHTML = '';

    questions.forEach((q, i) => {
        const userChoice = selections[i];
        const isCorrect = userChoice === q.correct;
        if (isCorrect) correctCount++;

        reviewDiv.innerHTML += `
            <div class="review-card ${isCorrect ? 'correct' : 'wrong'}">
                <div style="font-weight:bold; margin-bottom:5px;">Q${i + 1}: ${q.q}</div>
                <div style="font-size:0.9rem">
                    <span style="color:green">✔ Correct: ${q.options[q.correct]}</span><br>
                    <span style="color:${isCorrect ? 'green' : 'red'}">
                        👤 Yours: ${userChoice !== null ? q.options[userChoice] : 'Not Answered'}
                    </span>
                </div>
                <div class="explanation"><strong>Review:</strong> ${q.review}</div>
            </div>
        `;
    });

    const scorePercent = Math.round((correctCount / questions.length) * 100);
    document.getElementById('score-text').innerText = scorePercent + "%";
    document.getElementById('stats-text').innerText = `You got ${correctCount} out of ${questions.length} correct.`;
}

function startTimer() {
    timerObj = setInterval(() => {
        secondsLeft--;
        const mins = Math.floor(secondsLeft / 60);
        const secs = secondsLeft % 60;
        document.getElementById('timer').innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        if (secondsLeft <= 0) {
            clearInterval(timerObj);
            showResults();
        }
    }, 1000);
}

window.onload = () => {
    render();
    // Welcoming message
    showModal("Welcome!", "You have 1 hour to complete this practice exam. Your time starts now.", false, () => {
        startTimer();
    });
};