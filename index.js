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
    5. You can set your own difficulty and range. Type easy, medium, hard and range.E.q easy 1000. Default is easy 100
    `);
  console.log("--------------------------------------------------------------");

  const maxAttempts = 7;
  let leftAttempts = maxAttempts;
  let rangeLimit = 100;
  let setHintDifficulty = "easy";
  const numberToGuess = Math.floor(Math.random() * rangeLimit) + 1;
  let startTime;

  rl.question(
    '"I have selected a number. Can you guess it?" Type [Yes/No] to continue, or to close the programm: ',
    (answer) => {
      if (answer === "Yes") {
        startTime = Date.now();
        // askForGuess();
        askDifficultyAndRange();
      } else {
        rl.close();
      }
    }
  );
  function askDifficultyAndRange() {
    rl.question(
      "Set up you difficulty and range, or type fine to skip it: ",
      (input) => {
        if (input === "fine") {
          rl.close();
        } else {
          const result = setDifficultyAndRange(
            input,
            rangeLimit,
            setHintDifficulty
          );
          rangeLimit = result.rangeLimit;
          setHintDifficulty = result.setHintDifficulty;
          askForGuess();
        }
      }
    );
  }

  function askForGuess() {
    rl.question("Enter your guess ", (input) => {
      if (input === "quit") {
        rl.close();
      }
      const userGuess = parseInt(input, 10);

      if (input === "hint") {
        giveHint(numberToGuess, setHintDifficulty, rangeLimit, askForGuess);
      }

      if (
        (input !== "hint" && isNaN(userGuess)) ||
        userGuess < 1 ||
        userGuess > rangeLimit
      ) {
        console.log(`Please provide a valid number between 1 - ${rangeLimit}`);
        askForGuess();
        return;
      }

      leftAttempts--;
      if (input !== "hint") {
        if (userGuess === numberToGuess) {
          const elapsedTime = Math.round((Date.now() - startTime) / 1000);
          console.log(
            `Congrats you have won the game. Your lucky number is ${userGuess}`
          );
          console.log(`Time taken: ${elapsedTime} seconds`);
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
                const elapsedTime = Math.round((Date.now() - startTime) / 1000);
                console.log(`Time taken: ${elapsedTime} seconds`);
                rl.close();
              }
            }
          );
        }
      }
    });
  }
}
startGame();

function giveHint(number, difficultyLevel, maxRange, askForGuess) {
  if (Number(number) < 1 || Number(number) > Number(maxRange)) {
    console.log("Number is out of specifc range");
    return;
  }

  const hintDivisions = {
    easy: 10,
    medium: 4,
    hard: 2,
  };

  const divisions = hintDivisions[difficultyLevel.toLowerCase()];

  if (!divisions) {
    console.error(
      "Invalid difficulty level. Choose 'easy', 'medium', or 'hard'."
    );
    return;
  }

  const ranges = calcRange(maxRange, divisions);

  const matchingRange = ranges.find(
    (range) => number >= range[0] && number <= range[1]
  );

  console.log(
    `You lucky number somewhere between these numbers: ${matchingRange[0]} and ${matchingRange[1]}`
  );
  askForGuess();

  function calcRange(maxRange, divisions) {
    const rangeSize = Math.ceil(maxRange / divisions);
    const ranges = [];
    for (let i = 1; i <= maxRange; i += rangeSize) {
      ranges.push([i, Math.min(i + rangeSize - 1, maxRange)]);
    }
    return ranges;
  }
}

function setDifficultyAndRange(input, rangeLimit, setHintDifficulty) {
  const isRangeProvided = input.split(" ")[1];
  const isDifficultyProvided = input.split(" ")[0];
  if (Number(isRangeProvided)) {
    rangeLimit = Number(isRangeProvided);
    console.log(`You have set your range: ${rangeLimit}`);
  }
  if (["easy", "medium", "hard"].includes(isDifficultyProvided)) {
    setHintDifficulty = isDifficultyProvided;
    console.log(`You have set your difficulty: ${setHintDifficulty}`);
  }
  return { rangeLimit, setHintDifficulty };
}
