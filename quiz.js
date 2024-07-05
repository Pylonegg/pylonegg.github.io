let questions = []; // This will hold our questions data
let selectedChoice = null; // Track the currently selected choice
let currentQuestionIndex = 0;
let totalQuestions = 0;
let score = 0;

function loadCategories() {
    fetch('/az104.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            let categories = [...new Set(data.map(q => q.category))];
            let categorySelect = document.getElementById('category');
            categories.forEach((category, index) => {
                let option = document.createElement('option');
                option.value = index;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading categories:', error));
}

function startQuiz() {
    let categorySelect = document.getElementById('category');
    let selectedCategory = categorySelect.options[categorySelect.selectedIndex].textContent;

    let numQuestionsSelect = document.getElementById('num-questions');
    totalQuestions = parseInt(numQuestionsSelect.value);

    let filteredQuestions = questions;
    if (selectedCategory !== 'All') {
        filteredQuestions = questions.filter(q => q.category === selectedCategory);
    }

    if (filteredQuestions.length === 0) {
        alert('No questions available for selected category.');
        return;
    }

    categorySelect.disabled = true;
    numQuestionsSelect.disabled = true;
    document.getElementById('quiz-progress').style.display = 'block';
    document.getElementById('category-selection').style.display = 'none';
    document.getElementById('quiz-content').style.display = 'block';

    // Randomize question selection
    filteredQuestions = shuffle(filteredQuestions);

    displayNextQuestion();

    function displayNextQuestion() {
        if (currentQuestionIndex < totalQuestions) {
            let questionData = filteredQuestions[currentQuestionIndex];
            document.getElementById('question').textContent = questionData.question;
    
            let choicesContainer = document.getElementById('choices');
            choicesContainer.innerHTML = ''; // Clear previous choices
    
            questionData.choices.forEach((choice, index) => {
                let label = document.createElement('label');
                label.textContent = choice;
                label.classList.add('choice-label');
                label.setAttribute('data-index', index);
                label.onclick = function() {
                    selectChoice(this);
                };
    
                choicesContainer.appendChild(label);
            });
    
            updateQuestionCount();
        } else {
            endQuiz();
        }
    }

    window.selectChoice = function(choiceElement) {
        let newIndex = parseInt(choiceElement.getAttribute('data-index'));
        if (selectedChoice !== null) {
            selectedChoice.classList.remove('selected');
        }
        selectedChoice = choiceElement;
        selectedChoice.classList.add('selected');
    };

    window.submitAnswer = function() {
        if (!selectedChoice) {
            alert('Please select an answer.');
            return;
        }

        let answerIndex = parseInt(selectedChoice.getAttribute('data-index'));
        let correctIndex = filteredQuestions[currentQuestionIndex].correct;

        if (answerIndex === correctIndex) {
            score++;
            document.getElementById('result').textContent = 'Correct!';
        } else {
            document.getElementById('result').textContent = `Wrong! The correct answer is: ${filteredQuestions[currentQuestionIndex].choices[correctIndex]}`;
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < totalQuestions) {
            displayNextQuestion();
        } else {
            endQuiz();
        }
    };

    function endQuiz() {
        document.getElementById('quiz-progress').style.display = 'none';
        document.getElementById('quiz-content').style.display = 'none';
        document.getElementById('quiz-summary').style.display = 'block';
        document.getElementById('score').textContent = `You scored ${score} out of ${totalQuestions} (${Math.round((score / totalQuestions) * 100)}%)`;
    }

    function updateQuestionCount() {
        let questionCountText = `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
        document.getElementById('question-count').textContent = questionCountText;
    }
}

// Fisher-Yates shuffle function
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}

loadCategories();
