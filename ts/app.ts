let score : number = 0
let questionNumber : number = 1
let currentQuestionIndex : number = 0
let questions = []



const quizBtn = document.querySelector('.quiz-btn') as HTMLButtonElement | null



async function getQuestions() {
    try{
        const res = await fetch('questions.json')
        const data = await res.json()
    

        const usedIndices = new Set<number>()
        const randomQuestions = []

        while (randomQuestions.length < 40) {
            const randomIndex = Math.floor(Math.random() * data.length)
            
            if (!usedIndices.has(randomIndex)) {
                usedIndices.add(randomIndex)
                randomQuestions.push(data[randomIndex])
            }
        }

        return randomQuestions
    }

    catch(err){
        console.error(err)
    }
}

function highlightAnswer(answer: string) {
    const allOptions = document.querySelectorAll('.quiz-option') as NodeListOf<HTMLLabelElement>
    const correctAnswer = questions[currentQuestionIndex].correct


    if(allOptions.length > 0){
        allOptions.forEach((option) => {
            const input = option.querySelector('input') as HTMLInputElement | null
    
    
            if(input){ 
                if(input.value === correctAnswer){
                    option.classList.add('correct') 
                } 
                
                else{
                    option.classList.add('wrong') 
                }
    
                option.classList.add('disabled') 
            }
        })
    }

    if(answer === correctAnswer){
        score++
    }
}

async function showQuestions() {
    if (!questions.length) {
        questions = await getQuestions()
    }

    const quizQuestion = document.querySelector('.quiz-question') as HTMLHeadingElement | null
    const quizAnswersList = document.querySelector('.quiz-answers-list') as HTMLUListElement | null
    const questionNumberElement = document.querySelector('.quiz-question-number') as HTMLSpanElement | null

    if (currentQuestionIndex >= questions.length) {
        questionNumberElement.textContent = `Квиз завершен, ваш результат ${score}/40`
        quizBtn.innerText = 'Начать новый квиз'
        quizBtn.style.background = 'green'
        quizBtn.addEventListener('click', restartQuiz)
    } 
    
    else {
        quizBtn.innerText = 'Далее'
        quizBtn.style.background = '#006AF2'
        quizBtn.removeEventListener('click', restartQuiz)
    }

    if (quizQuestion && quizAnswersList) {
        const currentQuestion = questions[currentQuestionIndex]
        quizQuestion.textContent = currentQuestion.question
        quizAnswersList.innerHTML = ''

        for (const key in currentQuestion.options) {
            const li: HTMLLIElement = document.createElement('li')

            li.innerHTML = `
                <label class="quiz-option">
                    <input type="radio" name="category" class="real-radio" value="${key}">
                    <span class="custom-radio"></span>
                    <span class="quiz-answer">${currentQuestion.options[key]}</span>
                </label>
            `

            const input = li.querySelector('input') as HTMLInputElement
            input.addEventListener('change', () => highlightAnswer(key)) 

            quizAnswersList.append(li)
        }
    }

    if (questionNumberElement) {
        questionNumberElement.textContent = `${questionNumber}/40`
    }
}

function nextQuestion(){
    currentQuestionIndex++
    questionNumber++
    showQuestions()
}

function restartQuiz(){
    score = 0
    questionNumber = 1
    currentQuestionIndex = 0
    questions = []


    showQuestions()
}



document.addEventListener('DOMContentLoaded', async ()=>{
    await showQuestions()
    quizBtn.addEventListener('click', nextQuestion)
})

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

