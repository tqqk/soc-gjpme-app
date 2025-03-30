const questionContainer = document.getElementById("question-container");
const resultContainer = document.getElementById("result-container");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// získání otázek z api
async function fetchQuestions() {
  try {
    const response = await fetch("http://localhost:3000/api/questions");
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
    "rounded-lg", 
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

// 
async function handleAnswer(questionId, answer, clickedButton) {
  try {

    // vypnutí tlačítek pro zvolení odpovědi
    Array.from(document.querySelectorAll("button")).forEach(btn => btn.disabled = true);

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

    const response = await fetch("http://localhost:3000/api/submit", {
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
      resultContainer.appendChild(correctAnswerMessage);
    } else {
      const correctAnswerMessage = document.createElement("p");
      correctAnswerMessage.textContent = "Špatná odpověď";
      correctAnswerMessage.classList.add(
        "text-red-900", 
        "text-center", 
        "text-xl"
      );
      resultContainer.appendChild(correctAnswerMessage);
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
    "text-2xl", 
    "font-semibold", 
    "mb-4"
  );
  scoreText.textContent = `Skóre: ${score} z ${questions.length}`;

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
