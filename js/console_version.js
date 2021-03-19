// First position Human Score, second position CPU score
const score = [0, 0];

// Each key is a weapon, and each key has inside another object that contains the winning possibilities for each weapon
const rules = {
  scissors: { paper: 'cuts', lizard: 'decapitates' },
  paper: { rock: 'covers', spock: 'disproves' },
  rock: { lizard: 'crushes', scissors: 'crushes' },
  lizard: { spock: 'poisons', paper: 'eats' },
  spock: { scissors: 'smashes', rock: 'vaporizes' },
};

const computerChoices = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
const playerValidChoices = [...computerChoices, 'exit'];

const getComputerPlay = () => {
  return computerChoices[Math.floor(Math.random() * computerChoices.length)];
};
const checkPlayerSelection = (playerSelection) => {
  return playerValidChoices.includes(playerSelection)
    ? true
    : alert('Wrong choice!');
};

const getPlayerPlay = (playerSelection) => {
  // ASK for player input.
  do {
    playerSelection = prompt(
      `Type ${computerChoices.join(', ')} or exit to end the game`
    );

    playerSelection = playerSelection?.toLowerCase() ?? 'exit';

    // Repeat the prompt until player input is valid
  } while (!checkPlayerSelection(playerSelection));

  return playerSelection;
};

const getWinner = (plChoice, cpuChoice) => {
  // Human press cancel button or type exit
  if (plChoice === 'exit') return 'exit';

  if (plChoice === cpuChoice) return `Both chose ${plChoice}. It's a tie.`;

  // To know how the winning condition works check the rules object structure
  if (cpuChoice in rules[plChoice]) {
    score[0]++;
    return `You win! ${plChoice} ${rules[plChoice][cpuChoice]} ${cpuChoice}`;
  } else {
    score[1]++;
    return `You lose! ${cpuChoice} ${rules[cpuChoice][plChoice]} ${plChoice}`;
  }
};

const printResults = (roundResult) => {
  console.log(roundResult);
  console.log(`Human Score: ${score[0]}`);
  console.log(`Computer Score: ${score[1]}`);
  console.log('------------------------');
  if (score[0] === 5) console.log('HUMAN PLAYER WON THE GAME!!!');
  if (score[1] === 5) console.log('CPU PLAYER WON THE GAME!!!');
};

// MAIN GAME
const game = () => {
  // Game Loop until one reaches 5 wins
  while (score.every((el) => el < 5)) {
    const playerSelection = getPlayerPlay();

    const computerSelection = getComputerPlay();

    const roundResult = getWinner(playerSelection, computerSelection);

    // IF player chooses exit or press cancel, end the game,
    if (roundResult === 'exit') {
      console.log('You ended the game');
      return;
    }

    printResults(roundResult);
  }
};

game();
