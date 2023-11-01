let numberOfQuestions = document.querySelector(
  ".quez-app .question-count span"
);
let bulletsSpans = document.querySelector(".bullets .spans");
let quezArea = document.querySelector(".quez-area");
let answerArea = document.querySelector(".answers-area");
let submit = document.querySelector(".submit");
let results = document.querySelector(".results");
let bullets = document.querySelector(".bullets");
let timeDown = document.querySelector(".count-down");
let currentIndex = 0;
let rightAnswer = 0;
let setInt;
function getQuestions() {
  let req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let data = JSON.parse(this.responseText);
      createBullets(data.length);

      addQuestionData(data[currentIndex], data.length);

      countDown(30, data.length);

      submit.onclick = () => {
        let rightAnswer = data[currentIndex].right_answer;
        currentIndex++;

        checkAnswer(rightAnswer, data.length);
        // Remove Previous Question
        quezArea.innerHTML = "";
        answerArea.innerHTML = "";

        addQuestionData(data[currentIndex], data.length);

        handleBullets();

        showResults(data.length);

        clearInterval(setInt);

        countDown(30, data.length);
      };
    }
  };
  req.open("Get", "jsQ.json", true);
  req.send();
}

getQuestions();

function createBullets(num) {
  numberOfQuestions.innerHTML = num;
  // Create Spans
  for (let i = 0; i < num; i++) {
    let span = document.createElement("span");
    bulletsSpans.appendChild(span);
    if (i === 0) {
      span.className = "on";
    }
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    let head = document.createElement("h2");
    head.textContent = obj["title"];
    quezArea.appendChild(head);
    // Create Answers
    for (let i = 1; i <= 4; i++) {
      let div = document.createElement("div");
      div.className = "answers";
      let inputRadio = document.createElement("input");
      inputRadio.type = "radio";
      inputRadio.id = `answer-${i}`;
      inputRadio.name = "Question";
      inputRadio.dataset.answer = obj[`answer_${i}`];
      let label = document.createElement("label");
      label.htmlFor = inputRadio.id;
      label.textContent = inputRadio.dataset.answer;
      div.appendChild(inputRadio);
      div.appendChild(label);
      answerArea.appendChild(div);
    }
  }

  // console.log(obj["title"]);
  // console.log(count)
}
// Check Answer
function checkAnswer(rAnswer, count) {
  let answer = document.getElementsByName("Question");
  let answerChoosen;
  for (let i = 0; i < answer.length; i++) {
    if (answer[i].checked) {
      answerChoosen = answer[i].dataset.answer;
    }
  }
  if (answerChoosen === rAnswer) {
    rightAnswer++;
  }
}
// bullets spans
function handleBullets() {
  let span = document.querySelectorAll(".bullets .spans span");
  let arraySpan = Array.from(span);
  arraySpan.forEach((span, index) => {
    if (index === currentIndex) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  if (currentIndex === count) {
    let theResults;
    // Remove Element
    quezArea.remove();
    answerArea.remove();
    submit.remove();
    bullets.remove();

    if (rightAnswer < 5) {
      theResults = `<span class="bad">Bad</span> Your Answer ${rightAnswer} From 9`;
    } else if (rightAnswer > 5 && rightAnswer < 8) {
      theResults = `<span class="good">Good</span> Your Answer ${rightAnswer} From 9`;
    } else {
      theResults = `<span class="perfect">Perfect</span> Your Answer ${rightAnswer} From 9`;
    }
    results.innerHTML = theResults;
    results.style.marginTop = "20px";
    results.style.backgroundColor = "#fff";
    results.style.padding = "15px";
  }
}

function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    setInt = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      timeDown.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(setInt);
        submit.click();
      }
    }, 1000);
  }
}
