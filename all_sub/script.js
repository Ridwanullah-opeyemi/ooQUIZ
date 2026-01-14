let currentIdx = 0;
        let selections = new Array(questions.length).fill(null);
        let secondsLeft = 3600;

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

        function handleManualSubmit() {
            const unanswered = selections.filter(s => s === null).length;
            const message = unanswered > 0
                ? `You have ${unanswered} unanswered questions. Submit anyway?`
                : "Do you want to submit your exam now?";

            if (confirm(message)) showResults();
        }

        function showResults() {
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
                            <span style="color:var(--success)">✔ Correct: ${q.options[q.correct]}</span><br>
                            <span style="color:${isCorrect ? 'var(--success)' : 'var(--danger)'}">
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

        // Countdown Timer Logic
        const timerObj = setInterval(() => {
            secondsLeft--;
            const mins = Math.floor(secondsLeft / 60);
            const secs = secondsLeft % 60;
            document.getElementById('timer').innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
            if (secondsLeft <= 0) {
                clearInterval(timerObj);
                showResults();
            }
        }, 1000);

        window.onload = render;