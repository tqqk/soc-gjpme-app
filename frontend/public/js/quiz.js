const questionContainer = document.getElementById("question-container");
const resultContainer = document.getElementById("result-container");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// získání otázek z api
async function fetchQuestions() {
  try {
    const response = await fetch("https://soc-gjpme-app-backend-1.onrender.com/api/questions");
    const data = await response.json();

    questions = data.sort((a, b) => a.orderNumber - b.orderNumber);
    displayCurrentQuestion();
  } catch (error) {
    resultContainer.textContent = "Chyba při načítání otázek z api";
  }
}

// ukaž otázku
function displayCurrentQuestion() {

  questionContainer.innerHTML = "";
  resultContainer.innerHTML = "";

  // poslední otázka = konec kvízu
  if (currentQuestionIndex >= questions.length) {
    showFinalScore();
    return;
  }

  const question = questions[currentQuestionIndex];

  // vytvoření div pro otázku
  const questionDiv = document.createElement("div");
  questionDiv.classList.add(
    "p-6", 
    "rounded", 
    "bg-white", 
    "shadow-md",
  );

  // text otázky
  const questionText = document.createElement("p");
  questionText.classList.add(
    "text-xl", 
    "font-medium", 
    "mb-4",  
 
  );
  questionText.textContent = question.question;
  questionDiv.appendChild(questionText);

  // vytvoření div pro možnosti odpovědí
  const optionsContainer = document.createElement("div");
  optionsContainer.classList.add(
    "flex", 
    "flex-col", 
    "gap-3"
  );

  // vytvoření tlačítka pro každou odpověď  
  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.classList.add(
      "w-full",
      "py-3",
      "px-4",
      "border-2",
      "border-black",
      "text-black",
      "rounded",
      "hover:bg-black",
      "hover:text-white",
    );
    button.textContent = option;
    button.onclick = (event) => handleAnswer(question.id, option, event.target);
    optionsContainer.appendChild(button);
  });

  questionDiv.appendChild(optionsContainer);
  questionContainer.appendChild(questionDiv);
}

// funkce na zpracování odpovědi
async function handleAnswer(questionId, answer, clickedButton) {
  try {

    // vypnutí tlačítek po zvolení odpovědi a zmena stylu
    Array.from(document.querySelectorAll("#question-container button")).forEach(btn => {
      btn.disabled = true;
      btn.classList.remove("hover:bg-black", "hover:text-white");
    });

    // přidání stylu pro zvolenou odpověď
    if (clickedButton) {
      clickedButton.classList.remove(
        "hover:bg-black", 
        "hover:text-white"
      );
      clickedButton.classList.add(
        "bg-black",
        "text-white"
      );
    }

    const response = await fetch("https://soc-gjpme-app-backend-1.onrender.com/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, answer }),
    });
    const result = await response.json();

    if (result.correct) {
      score++;
      const correctAnswerMessage = document.createElement("p");
      correctAnswerMessage.textContent = "Správná odpověď";
      correctAnswerMessage.classList.add(
        "text-green-900", 
        "text-center", 
        "text-xl"
      );
      clickedButton.classList.add(
        "bg-green-900",
        "text-white"
      );
      resultContainer.appendChild(correctAnswerMessage);
    } else {
      const incorrectAnswerMessage = document.createElement("p");
      incorrectAnswerMessage.textContent = "Špatná odpověď";
      incorrectAnswerMessage.classList.add(
        "text-red-900", 
        "text-center", 
        "text-xl"
      );
      clickedButton.classList.add(
        "bg-red-900",
        "text-white"
      );
      resultContainer.appendChild(incorrectAnswerMessage);
    }
  } catch (error) {
    resultContainer.textContent = "Chyba při odesílání odpovědi";
  }
  showNextButton();
}

// tlačítko na další otázku
function showNextButton() {
  const nextButton = document.createElement("button");
  nextButton.textContent = "Další otázka";
  nextButton.classList.add(
    "py-2",
    "px-4",
    "mx-4",
    "border-2",
    "bg-black",
    "border-black",
    "text-white",
    "hover:bg-opacity-5",
    "hover:text-black",
    "rounded",
    "hover:bg-blue-700",
  );
  nextButton.onclick = () => {
    currentQuestionIndex++;
    displayCurrentQuestion();
  };
  resultContainer.appendChild(nextButton);
}


// finální skóre
function showFinalScore() {
  questionContainer.innerHTML = "";
  resultContainer.innerHTML = "";

  const scoreDiv = document.createElement("div");
  scoreDiv.classList.add(
    "bg-white", 
    "p-6", 
    "rounded-lg", 
    "shadow-md", 
    "text-center"
  );

  const scoreText = document.createElement("p");
  scoreText.classList.add(
    "text-xl", 
    "font-semibold", 
    "mb-4",
    "p-4"
  );

  if (score === questions.length) {
    scoreText.textContent = `Gratulujeme! Dosáhli jste plného počtu bodů: ${score} z ${questions.length} bodů`;
    scoreText.classList.add(
      "text-green-900"
    );
  } else if (score >= questions.length / 1.5 ) {
    scoreText.textContent = `Dobré, ale může to být lepší! Dosáhli jste ${score} z ${questions.length} bodů`;
    scoreText.classList.add(
      "text-green-900"
    );
  } else if (score < questions.length / 1.5) {
    scoreText.textContent = `Zkuste to znovu! Dosáhli jste pouze ${score} z ${questions.length} bodů`;
    scoreText.classList.add(
      "text-red-900"
    );
  }

  const restartButton = document.createElement("button");
  restartButton.textContent = "Restartovat kvíz";
  restartButton.classList.add(
    "py-2",
    "px-4",
    "bg-black",
    "text-white",
    "border-2",
    "border-black",
    "rounded-lg",
    "hover:bg-opacity-5",
    "hover:text-black",
  );
  restartButton.onclick = restartQuiz;

  scoreDiv.appendChild(scoreText);
  scoreDiv.appendChild(restartButton);
  questionContainer.appendChild(scoreDiv);
}

// restart kvízu
function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  fetchQuestions();
}

// zavolání funkce pro získání otázek
fetchQuestions();

// skrytí upozornění
document.addEventListener("DOMContentLoaded", () => {
  const alertDiv = document.getElementById("alert");
  const hideAlertButton = document.getElementById("hide-alert");

  hideAlertButton.addEventListener("click", () => {
      alertDiv.classList.add("hidden");
  });
});
