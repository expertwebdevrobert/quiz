let score = 0;
let questionNumber = 1;
let currentQuestionIndex = 0;
let questions = [];
const quizBtn = document.querySelector('.quiz-btn');
async function getQuestions() {
    try {
        const res = await fetch('questions.json');
        const data = await res.json();
        const usedIndices = new Set();
        const randomQuestions = [];
        while (randomQuestions.length < 40) {
            const randomIndex = Math.floor(Math.random() * data.length);
            if (!usedIndices.has(randomIndex)) {
                usedIndices.add(randomIndex);
                randomQuestions.push(data[randomIndex]);
            }
        }
        return randomQuestions;
    }
    catch (err) {
        console.error(err);
    }
}
async function showQuestions() {
    try {
        if (!questions.length) {
            questions = await getQuestions();
        }
        const quizQuestion = document.querySelector('.quiz-question');
        const quizAnswersList = document.querySelector('.quiz-answers-list');
        const questionNumberElement = document.querySelector('.quiz-question-number');
        if (currentQuestionIndex >= questions.length) {
            questionNumberElement.textContent = `Квиз завершен, ваш результат ${score}/40`;
            quizBtn.innerText = 'Начать новый квиз';
            quizBtn.style.background = 'green';
            quizBtn.addEventListener('click', restartQuiz);
        }
        else {
            quizBtn.innerText = 'Ответить';
            quizBtn.style.background = '#006AF2';
            quizBtn.removeEventListener('click', restartQuiz);
        }
        if (quizQuestion && quizAnswersList) {
            const currentQuestion = questions[currentQuestionIndex];
            quizQuestion.textContent = currentQuestion.question;
            quizAnswersList.innerHTML = '';
            for (const key in currentQuestion.options) {
                const li = document.createElement('li');
                li.innerHTML = `
                    <label>
                        <input type="radio" name="category" class="real-radio" value="${key}">
                        <span class="custom-radio"></span>
                        <span class="quiz-answer">${currentQuestion.options[key]}</span>
                    </label>
                `;
                quizAnswersList.append(li);
            }
        }
        if (questionNumberElement) {
            questionNumberElement.textContent = `${questionNumber}/40`;
        }
    }
    catch (err) {
        console.error(err);
    }
}
function checkAnswer() {
    const selectedOption = document.querySelector('input[name="category"]:checked');
    if (!selectedOption) {
        return false;
    }
    const answer = selectedOption.value;
    if (answer === questions[currentQuestionIndex].correct) {
        score++;
    }
    currentQuestionIndex++;
    questionNumber++;
    showQuestions();
}
function restartQuiz() {
    score = 0;
    questionNumber = 1;
    currentQuestionIndex = 0;
    questions = [];
    showQuestions();
}
document.addEventListener('DOMContentLoaded', async () => {
    await showQuestions();
    quizBtn.addEventListener('click', checkAnswer);
});
// document.addEventListener("contextmenu", (event) => event.preventDefault())
// document.addEventListener("keydown", (event) => {
//     if (
//       event.key === "F12" || 
//       (event.ctrlKey && event.shiftKey && event.key === "I") || 
//       (event.ctrlKey && event.key === "U")
//     ) {
//       event.preventDefault();
//     }
// })
//# sourceMappingURL=app.js.map