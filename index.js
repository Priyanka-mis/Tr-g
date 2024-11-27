 function startGame() {
    const player1 = document.getElementById("player1").value
    const player2 = document.getElementById("player2").value

    if (!player1 || !player2){
        alert ("please fill your name")
    }

    else{
        document.getElementById("players").style.display ="none"
        document.getElementById("category").style.display ="block"
        fetchCategory()
    }

}

function fetchCategory() {
    const api = "https://the-trivia-api.com/v2/categories";

    fetch(api)
    .then(response =>response.json())
    .then(data =>{
        const categorySelect = document.getElementById("choose-category")
        categorySelect.innerHTML = "";

        const keys = Object.keys(data);
        
        for (let i = 0; i < keys.length; i++) {
            const categoryKey = keys[i]
            const option = document.createElement("option")
            option.value = categoryKey;
            option.textContent = categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
            categorySelect.appendChild(option);
        }
        console.log(data);
    })
    .catch(error=> console.error("error", error))
};

let easyQuestions = [];
let mediumQuestions = [];
let hardQuestions = [];
let currentQ=[]

function fetchQuestions(){
   const categorySelect= document.getElementById("choose-category").value;
   const easy = `https://the-trivia-api.com/api/questions?categories=${categorySelect}&limit=2&difficulty=easy`;
   const medium = `https://the-trivia-api.com/api/questions?categories=${categorySelect}&limit=2&difficulty=medium`;
   const hard = `https://the-trivia-api.com/api/questions?categories=${categorySelect}&limit=2&difficulty=hard`;

   fetch(easy)
   .then(response => response.json())
   .then(data => {
     easyQuestions = data;
      console.log('Easy questions fetched:', easyQuestions);
      return fetch(medium);
   })
   .then(response => response.json())
   .then(data => {
       mediumQuestions = data;
      console.log('Medium questions fetched:', mediumQuestions);
      return fetch(hard);
   })
   .then(response => response.json())
   .then(data => {
     hardQuestions= data;
      console.log('Hard questions fetched:', hardQuestions);

      // Combine all cquestions here
      questions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];
      allAnswers= questions;
      currentQ = 0;
      console.log('All questions:', questions);
      display()
   })
   .catch(error => {
    console.log("Error fetching questions:", error);
});
}


let questions = [];
let presentPlayer = 0;
let currQuesIn = 0;

function display() {
    if (currQuesIn < questions.length) {
        const questionData = questions[currQuesIn];
        document.getElementById("category").style.display = "none";
        document.getElementById("all-questions").style.display = "block";
        document.getElementById("question").textContent = `Question: ${questionData.question}`;
        // document.getElementById("player2-answer").style.display = "none";


        if (presentPlayer === 1) {
            document.getElementById("player1-answer").style.display = "none";
            document.getElementById("player2-answer").value = "";
            document.getElementById("player2-answer").style.display = "block";
            document.getElementById("player1-answer").focus();
        } else {
            document.getElementById("player1-answer").value = "";
            document.getElementById("player1-answer").style.display = "block";
            document.getElementById("player2-answer").style.display = "none";
            document.getElementById("player1-answer").focus();
        }
    } else {   
        
    }
}

var  player1Answer
let scores = {
    player1: 0,
    player2: 0
};

function updateScoreDisplay() {
    document.getElementById("player1-score").textContent = `Player 1 Score: ${scores.player1}`;
    document.getElementById("player2-score").textContent = `Player 2 Score: ${scores.player2}`;
}

var allAnswers;

function nextQuestion() {
    if (!allAnswers || !allAnswers.length) {
        alert("Questions are not loaded yet.");
        return;
    }

    const correctAnswers = allAnswers.map(x => x.correctAnswer.toLowerCase());
    let currentAnswer;

    if (currQuesIn % 2 === 0) {

        currentAnswer = document.getElementById("player1-answer").value.trim().toLowerCase();
        
        if (correctAnswers.includes(currentAnswer)) {
            if (currQuesIn < 2) {
                scores.player1 += 10;
            } else if (currQuesIn < 4) {
                scores.player1 += 15;
            } else {
                scores.player1 += 20;
            }
        }
    } else {
        // Player 2's turn
        currentAnswer = document.getElementById("player2-answer").value.trim().toLowerCase();
        
        if (correctAnswers.includes(currentAnswer)) {
            if (currQuesIn < 2) {
                scores.player2 += 10;
            } else if (currQuesIn < 4) {
                scores.player2 += 15;
            } else {
                scores.player2 += 20;
            }
        }
    }
    updateScoreDisplay()

    
    if (currentAnswer === "") {
        alert("Please enter an answer before proceeding.");
        return;
    }

    currQuesIn++;
    presentPlayer = presentPlayer === 1 ? 2 : 1;
    
    display();

}


function submitAnswers() {

    document.getElementById("submit").style.display = "block";
    document.getElementById("next").style.display = "block";
    showMarks();
}


function showMarks() {
    document.getElementById("all-questions").style.display = "none";
    document.getElementById("results").style.display = "block";

    
    // Get player names
    const player1Name = document.getElementById("player1").value || "Player 1";
    const player2Name = document.getElementById("player2").value || "Player 2";
    
    let winner;
    if (scores.player1 > scores.player2) {
        winner = player1Name;
    } else if (scores.player2 > scores.player1) {
        winner = player2Name;
    } else {
        winner = "No one";
    }

    document.getElementById("player1-score").textContent = `Player 1 (${player1Name}) Score: ${scores.player1}`;
    document.getElementById("player2-score").textContent = `Player 2 (${player2Name}) Score: ${scores.player2}`;
    document.getElementById("winner").textContent = `Winner: ${winner}`;
}


 function playAgain(){
    window.location.reload()
 }



