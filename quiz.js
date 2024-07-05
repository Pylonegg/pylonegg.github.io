let questions = []; // Array to hold quiz questions

// Function to fetch JSON data
async function fetchQuizData() {
    try {
        const response = await fetch('az104.json');
        if (!response.ok) {
            throw new Error('Failed to fetch quiz data');
        }
        questions = await response.json();
        startQuiz();
    } catch (error) {
        console.error('Error fetching quiz data:', error);
        alert('Failed to load quiz data. Please try again later.');
    }
}

// Initialize quiz
fetchQuizData();

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
    displayQuestion();
}

function displayQuestion() {
    const question = questions[currentQuestionIndex];
    document.querySelector('.question').textContent = question.question;
    
    const choicesContainer = document.querySelector('.choices');
    choicesContainer.innerHTML = ''; // Clear previous choices

    question.choices.forEach((choice, index) => {
        const choiceElement = document.createElement('div');
        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = 'answer';
        radioInput.value = index;
        choiceElement.appendChild(radioInput);
        choiceElement.appendChild(document.createTextNode(choice));
        choicesContainer.appendChild(choiceElement);
    });
}

function checkAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    
    if (selectedOption) {
        const answerIndex = parseInt(selectedOption.value, 10);
        const question = questions[currentQuestionIndex];

        if (answerIndex === question.correct) {
            document.getElementById('result').textContent = "Correct!";
            score++;
        } else {
            document.getElementById('result').textContent = `Wrong! The correct answer is ${question.choices[question.correct]}`;
        }

        // Move to next question or end quiz
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion();
        } else {
            endQuiz();
        }
    } else {
        alert("Please select an answer.");
    }
}

function endQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = `<h1>Quiz complete!</h1><p>You scored ${score} out of ${questions.length} (${Math.round(score / questions.length * 100)}%).</p>`;
}
