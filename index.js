const readLine = require("readline");

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function startGame() {
  console.log("--------------------------------------------------------------");
  console.log(`
    Welcome to the Number Guessing Game!
    Rules:
    1. The computer will randomly select a number between 1 and 100.
    2. You have a limited number of chances to guess the correct number.
    3. After each guess, you will receive a hint if the guess is too high or too low.
    4. If you guess correctly, you win! Otherwise, you lose when you run out of chances.
    `);
  console.log("--------------------------------------------------------------");

  const maxAttempts = 7;
  let leftAttempts = maxAttempts;
  const numberToGuess = Math.floor(Math.random() * 100) + 1;

  rl.question(
    '"I have selected a number between 1 and 100. Can you guess it?" Type [Yes/No] to continue, or to close the programm: ',
    (answer) => {
      if (answer === "Yes") {
        askForGuess();
      } else {
        rl.close();
      }
    }
  );

  function askForGuess() {
    rl.question("Enter your guess ", (input) => {
      if (input === "quit") {
        rl.close();
      }
      const userGuess = parseInt(input, 10);

      if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        console.log(`Please provide a valid number between 1 - 100`);
        askForGuess();
        return;
      }

      leftAttempts--;

      if (userGuess === numberToGuess) {
        console.log(
          `Congrats you have won the game. Your lucky number is ${userGuess}`
        );
        rl.close();
      } else if (leftAttempts > 0) {
        const hint = userGuess > numberToGuess ? "too high" : "too low";

        console.log(`Your guess hint. Number is ${hint}`);
        askForGuess();
      } else {
        console.log(
          `You have run out of attempts. Lucky number was: ${numberToGuess}`
        );

        rl.question(
          "Do you wish to continue playing? Type Yes, this will refresh your attempts to 1000. To abort game just type quit:",
          (answer) => {
            if (answer === "Yes") {
              leftAttempts = 1000;
              askForGuess();
            } else {
              rl.close();
            }
          }
        );
      }
    });
  }
}
startGame();
