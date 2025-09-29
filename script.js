const questions = {
  science: [
    { question: "What is H2O?", answers: [
      { text: "Oxygen", correct: false },
      { text: "Hydrogen", correct: false },
      { text: "Water", correct: true },
      { text: "Helium", correct: false }
    ]},
    { question: "Which planet is red?", answers: [
      { text: "Earth", correct: false },
      { text: "Mars", correct: true },
      { text: "Venus", correct: false },
      { text: "Jupiter", correct: false }
    ]}
  ],
  history: [
    { question: "Who was the first US President?", answers: [
      { text: "Abraham Lincoln", correct: false },
      { text: "George Washington", correct: true },
      { text: "John Adams", correct: false },
      { text: "Thomas Jefferson", correct: false }
    ]},
    { question: "In which year did WW2 end?", answers: [
      { text: "1940", correct: false },
      { text: "1945", correct: true },
      { text: "1939", correct: false },
      { text: "1950", correct: false }
    ]}
  ],
  sports: [
    { question: "How many players in a soccer team?", answers: [
      { text: "9", correct: false },
      { text: "10", correct: false },
      { text: "11", correct: true },
      { text: "12", correct: false }
    ]},
    { question: "Where were the 2016 Olympics held?", answers: [
      { text: "Tokyo", correct: false },
      { text: "London", correct: false },
      { text: "Rio de Janeiro", correct: true },
      { text: "Beijing", correct: false }
    ]}
  ]
};

const profileContainer = document.getElementById("profile-container");
const categoryContainer = document.getElementById("category-container");
const questionContainer = document.getElementById("question-container");
const resultContainer = document.getElementById("result-container");
const historyContainer = document.getElementById("history-container");

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const restartButton = document.getElementById("restart-btn");
const homeButton = document.getElementById("home-btn");
const scoreElement = document.getElementById("score");
const historyList = document.getElementById("history-list");

let currentCategory = "";
let currentQuestionIndex = 0;
let score = 0;
let currentQuestions = [];
let username = "";

// Load stored history
let scoreHistory = JSON.parse(localStorage.getItem("quizHistory")) || [];

// Show history
function updateHistory() {
  historyList.innerHTML = "";
  scoreHistory.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.name} - ${entry.category}: ${entry.score}`;
    historyList.appendChild(li);
  });
  historyContainer.classList.remove("hidden");
}

// Start quiz
document.getElementById("start-btn").addEventListener("click", () => {
  username = document.getElementById("username").value.trim();
  if (username === "") {
    alert("Please enter your name!");
    return;
  }
  profileContainer.classList.add("hidden");
  categoryContainer.classList.remove("hidden");
  updateHistory();
});

// Choose category
document.querySelectorAll(".category-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    currentCategory = btn.dataset.category;
    currentQuestions = questions[currentCategory];
    categoryContainer.classList.add("hidden");
    questionContainer.classList.remove("hidden");
    startQuiz();
  });
});

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextButton.classList.add("hidden");
  resultContainer.classList.add("hidden");
  showQuestion();
}

function showQuestion() {
  resetState();
  let currentQuestion = currentQuestions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.question;
  currentQuestion.answers.forEach(answer => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    if (answer.correct) button.dataset.correct = answer.correct;
    button.addEventListener("click", selectAnswer);
    answerButtons.appendChild(button);
  });
}

function resetState() {
  nextButton.classList.add("hidden");
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct === "true";
  if (correct) {
    score++;
    selectedButton.classList.add("correct");
  } else {
    selectedButton.classList.add("wrong");
  }
  Array.from(answerButtons.children).forEach(button => {
    if (button.dataset.correct === "true") button.classList.add("correct");
    button.disabled = true;
  });
  nextButton.classList.remove("hidden");
}

function showResult() {
  resultContainer.classList.remove("hidden");
  scoreElement.innerText = `${score} / ${currentQuestions.length}`;

  // Save to history
  scoreHistory.push({ name: username, category: currentCategory, score: `${score}/${currentQuestions.length}` });
  localStorage.setItem("quizHistory", JSON.stringify(scoreHistory));
  updateHistory();
}

function handleNextButton() {
  currentQuestionIndex++;
  if (currentQuestionIndex < currentQuestions.length) {
    showQuestion();
  } else {
    questionContainer.classList.add("hidden");
    nextButton.classList.add("hidden");
    showResult();
  }
}

nextButton.addEventListener("click", handleNextButton);

restartButton.addEventListener("click", () => {
  questionContainer.classList.remove("hidden");
  startQuiz();
});

homeButton.addEventListener("click", () => {
  resultContainer.classList.add("hidden");
  profileContainer.classList.remove("hidden");
  categoryContainer.classList.add("hidden");
  questionContainer.classList.add("hidden");
  updateHistory();
});
