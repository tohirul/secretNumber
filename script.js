// @ts-nocheck
"use strict"; // strict mode
// Definitions of elements to modify with dom
const body = document.querySelector("body");
const checkBtn = document.querySelector(".check");
const guessInput = document.querySelector(".guess");
const messageField = document.querySelector(".message");
const hiddenNumber = document.querySelector(".number");
const scoreField = document.querySelector(".score");
const highScoreField = document.querySelector(".highScore");
const buttonReset = document.querySelector(".again");
// The Secret Number
let secretNumber = Math.trunc(Math.random() * 20) + 1;
// High Score that will be compared against the score whenever the answer is correct.
let highScore = 0;
highScoreField.textContent = highScore;
// Limited score which will decrease every time a wrong answer is submitted.
let score = 20;
scoreField.textContent = score;
// This object will be used to transfer modified values of DOM elements
let content = {};
// every time DOM issues a change this function will be called to pass the modified values which are stored inside the object
const changeContent = (content) => {
    // using optional chaining to Modify elements.
    // if the modification value exists in the object the modification will take place
    body.style.backgroundColor = content?.backgroundColor;
    hiddenNumber.textContent = content?.hiddenNumberTextContent;
    messageField.textContent = content?.messageFieldContent;
    scoreField.textContent = content?.scoreFieldTextContent;
    hiddenNumber.style.width = content?.hiddenNumberWidth;
    // disable element
    if (content.disabled === true) {
        checkBtn.disabled = true;
        checkBtn.textContent = "Disabled";
    } else if (content.disabled === false) {
        checkBtn.disabled = false;
        checkBtn.textContent = "Check!";
    }
    // change high score if answer if correct and score is higher than the highest score
    content.highScoreChange && content.highScoreChange();
};
// On click event to reset all the elements to default
buttonReset.onclick = () => {
    guessInput.value = "";
    secretNumber = Math.trunc(Math.random() * 20) + 1;
    score = 20;
    // storing modification values to pass through the function
    content = {
        backgroundColor: "#222",
        hiddenNumberTextContent: "?",
        messageFieldContent: "Start guessing...",
        scoreFieldTextContent: score,
        hiddenNumberWidth: "150px",
        disabled: false,
    };
    // passing the object of values to modify the DOM elements
    changeContent(content);
};
// Function which will be called to change the score
const changeScore = () => {
    // if the score is 1, this condition will be triggered to make some modifications
    if (score === 1) {
        score = score - 1;
        content = {
            backgroundColor: "red",
            hiddenNumberTextContent: secretNumber,
            messageFieldContent: "🛑You have lost the game. Please try again",
            scoreFieldTextContent: score,
            disabled: true,
        };
        changeContent(content);
        return;
    }
    score = score - 1;
    console.log(score);
    content = {
        backgroundColor: "#222",
        scoreFieldTextContent: score,
    };
    changeContent(content);
};
// click event to check the value if the answer is correct or incorrect
checkBtn.onclick = () => {
    // condition to determine the value is valid or not
    if (
        guessInput.value === "" ||
        guessInput.value > 20 ||
        guessInput.value < 0
    ) {
        // if the value is invalid
        content = {
            backgroundColor: "#bca600",
            hiddenNumberTextContent: "?",
            messageFieldContent: "⛔Enter a valid value before checking.",
            scoreFieldTextContent: score,
        };
        changeContent(content);
        guessInput.value = "";
        // function will return from here
        return;
    }
    // condition to check if the score is sufficient to continue.
    if (Number(guessInput.value) !== Number(secretNumber) && score === 1) {
        changeScore();
        // function will return from here.
        return;
    } else if (Number(guessInput.value) !== Number(secretNumber) && score > 1) {
        // the score is sufficient to continue
        changeScore();
    }
    // Ternary operator to check if the value is correct or wrong
    Number(guessInput.value) === Number(secretNumber)
        ? // if it is correct
          (content = {
              backgroundColor: "#60b347",
              hiddenNumberTextContent: secretNumber,
              messageFieldContent: "Correct Number ✅🎉✨",
              scoreFieldTextContent: score,
              hiddenNumberWidth: "30rem",
              disabled: true,
              highScoreChange: function () {
                  score > highScore && (highScore = score);
                  return (highScoreField.innerText = highScore);
              },
          })
        : // if it is wrong
          (content =
              //  object containing modifier values,
              // Another ternary operator to check if the value is greater or less then the secret number and toggle the values
              Number(guessInput.value) > Number(secretNumber)
                  ? // if the value is greater
                    {
                        hiddenNumberTextContent: "?",
                        messageFieldContent: "📈Too high. Please, try again.",
                        scoreFieldTextContent: score,
                    }
                  : // if the value is lesser
                    {
                        hiddenNumberTextContent: "?",
                        messageFieldContent: "📉Too low. Please, try again.",
                        scoreFieldTextContent: score,
                    });
    // Invoking the function and passing the values to modify the DOM
    changeContent(content);
    guessInput.value = "";
};
