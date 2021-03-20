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

const gameFront = document.querySelector('.game-front');
const startBtn = document.querySelector('.btn--start');

const vsScreenPlayer1 = document.querySelector('.vs-screen__player--1');
const vsScreenPlayer2 = document.querySelector('.vs-screen__player--2');
const vsScreen = document.querySelector('.vs-screen');
const vsScreenVsImg = document.querySelector('.vs-screen__vs');

const herosList = document.querySelectorAll('.hero-selection__hero-card');
const heroSelectionScreen = document.querySelector('.hero-selection');
const heroContainer = document.querySelector('.hero-selection__grid');
const heroImage = document.querySelector('.hero-selection__img');

const gameScreen = document.querySelector('.game-screen');
const playerWeaponsContainer = document.querySelector(
  '.game-screen__weapons--player'
);
const cpuWeaponsContainer = document.querySelector(
  '.game-screen__weapons--cpu'
);
const cpuWeaponsList = document.querySelectorAll('.cpu-weapons');
let playerWeaponSelected = false;
// let selectedHeroDiv;

const playerLifeBar = document.querySelector('.game-screen__healthbar-life--1');
const cpuLifeBar = document.querySelector('.game-screen__healthbar-life--2');
const fightScreen = document.querySelector('.game-screen__fight');
const hands = document.querySelector('.game-screen__hands');
const playerHand = document.querySelector('.game-screen__hands--player');
const cpuHand = document.querySelector('.game-screen__hands--cpu');
const outcomeTextOne = document.querySelector('.game-screen__outcome-text--1');
const outcomeTextTwo = document.querySelector('.game-screen__outcome-text--2');

const modalScreen = document.querySelector('.modal');
const modalText = document.querySelector('.modal__text');
const rematchBtn = document.querySelector('.btn--rematch');

///////////////////////////////
// DYNAMIC MEDIA QUERY DETECTOR
let mediaqueryList = window.matchMedia('(min-width: 640px)');
const mediaqueryDetector = (wide) => {
  if (wide.matches) {
    playerLifeBar.style.left = `${score[1] * 20}%`;
  } else {
    playerLifeBar.style.left = `-${score[1] * 20}%`;
  }
};
mediaqueryList.addEventListener('change', mediaqueryDetector);

///////////////////////////////
// ADD and REMOVE hover classes
const addHoverClass = (e) => {
  if (e.target.closest('.hero-selection__hero-card')) {
    e.target.closest('.hero-selection__hero-card').classList.add('hero-hover');
  }

  if (e.target.closest('.game-screen__weapons--player')) {
    e.target.classList.add('weapon-hover');
  }
};

const removeHoverClass = (e) => {
  if (e.target.closest('.hero-selection__hero-card')) {
    e.target
      .closest('.hero-selection__hero-card')
      .classList.remove('hero-hover');
  }
  if (e.target.closest('.game-screen__weapons--player')) {
    e.target.classList.remove('weapon-hover');
  }
};

const addEvListeners = () => {
  heroContainer.addEventListener('mouseover', addHoverClass);
  playerWeaponsContainer.addEventListener('mouseover', addHoverClass);
  heroContainer.addEventListener('mouseout', removeHoverClass);
  playerWeaponsContainer.addEventListener('mouseout', removeHoverClass);
};
addEvListeners();

///////////////////////////////////////////
// ADD and REMOVE visible CLASS to elements
const showElements = (...elements) => {
  elements.forEach((el) => {
    el.classList.add('visible');
  });
};
const hideElements = (...elements) => {
  elements.forEach((el) => {
    el.classList.remove('visible');
  });
};

/////////////
// GAME LOGIC
const getComputerPlay = () => {
  return computerChoices[Math.floor(Math.random() * computerChoices.length)];
};

const showWinner = (plChoice, cpuChoice) => {
  playerHand.src = `images/hands/${plChoice}.png`;
  cpuHand.src = `images/hands/${cpuChoice}.png`;

  const timeout = setTimeout(() => {
    showElements(playerWeaponsContainer, cpuWeaponsContainer);
    hideElements(fightScreen);
    playerWeaponSelected = false;
    randomCpuWeapon();
  }, 2000);

  // Reset hands and text
  playerWeaponsContainer.ontransitionend = () => {
    outcomeTextOne.textContent = '';
    outcomeTextTwo.textContent = '';
    playerHand.src = `images/hands/rock.png`;
    cpuHand.src = `images/hands/rock.png`;
  };

  if (plChoice === cpuChoice) {
    outcomeTextOne.textContent = `Both chose ${plChoice}`;
    outcomeTextTwo.textContent = `It's a Tie!`;
    return;
  }

  // To know how the winning condition works check the rules object structure
  if (cpuChoice in rules[plChoice]) {
    score[0]++;
    outcomeTextOne.textContent = `${plChoice} ${rules[plChoice][cpuChoice]} ${cpuChoice}`;
    outcomeTextTwo.textContent = `You Win!!!`;
    cpuLifeBar.style.left = `-${score[0] * 20}%`;
  } else {
    score[1]++;
    outcomeTextOne.textContent = `${cpuChoice} ${rules[cpuChoice][plChoice]} ${plChoice}`;
    outcomeTextTwo.textContent = `You Lose!!!`;
    mediaqueryDetector(mediaqueryList);
  }
  if (score[0] === 5 || score[1] === 5) {
    showModal();
    clearTimeout(timeout);
    return;
  }
};

// MAIN game screen --- For test
// gameFront.classList.toggle('visible');
// gameScreen.classList.toggle('visible');
// playerWeaponsContainer.classList.toggle('visible');
// cpuWeaponsContainer.classList.toggle('visible');

/////////////////////
// START BUTTON CLICK
startBtn.addEventListener('click', function () {
  //flow normal
  hideElements(gameFront);
  setTimeout(() => {
    showElements(heroSelectionScreen);
  }, 500);

  const startBtnSound = document.querySelector('.suffer');
  startBtnSound.play();
});

const reset = () => {
  hideElements(modalScreen, fightScreen, heroSelectionScreen, gameScreen);
  showElements(gameFront);

  addEvListeners();

  herosList.forEach((el) => {
    el.classList.remove('hero-hover', 'cpu-choice');
  });
  score[0] = 0;
  score[1] = 0;

  cpuLifeBar.style.left = `-${score[0] * 20}%`;
  mediaqueryDetector(mediaqueryList);
};

const showModal = () => {
  if (score[0] === 5) {
    modalText.textContent = 'You Win!!!';
    const youWin = document.querySelector('.you-win');
    youWin.play();
  } else {
    modalText.textContent = 'You Lose!!!';
    const youLose = document.querySelector('.you-lose');
    youLose.play();
  }
  showElements(modalScreen);
};
rematchBtn.addEventListener('click', reset);

const playRound = (playerChoice) => {
  showWinner(playerChoice, getComputerPlay());
};

const playerWeapon = (e) => {
  if (!e.target.closest('.game-screen__weapon')) return;
  let route = e.target.src.lastIndexOf('/') + 1;
  let playerChoice = e.target.src.slice(route, -4);
  playerWeaponSelected = true;

  hideElements(playerWeaponsContainer, cpuWeaponsContainer);

  setTimeout(() => {
    showElements(fightScreen);
    hands.style.animation = 'handsUpDown 2s ease 1s';
  }, 700);

  hands.onanimationend = () => {
    hands.style.animation = '';
    playRound(playerChoice);
    // showWinner(playerChoice, getComputerPlay());
  };
};
playerWeaponsContainer.addEventListener('click', playerWeapon);

const showVsScreenData = () => {
  let playerHeroImg = document.querySelector('.vs-screen__img--1');

  let cpuHeroImg = document.querySelector('.vs-screen__img--2');
  const playerSelection = document.querySelector('.hero-hover');
  const playerSelectionImg = playerSelection.querySelector('img');
  const cpuSelection = document.querySelector('.cpu-choice');
  const cpuSelectionImg = cpuSelection.querySelector('img');
  let playerSelectionName = vsScreenPlayer1.querySelector('h2');
  let cpuSelectionName = vsScreenPlayer2.querySelector('h2');

  playerSelectionName.textContent = playerSelection
    .querySelector('.hero-selection__hero-name')
    .textContent.toUpperCase();
  playerHeroImg.src = playerSelectionImg.src;

  cpuSelectionName.textContent = cpuSelection
    .querySelector('.hero-selection__hero-name')
    .textContent.toUpperCase();
  cpuHeroImg.src = cpuSelectionImg.src;

  showElements(vsScreen, vsScreenPlayer1, vsScreenPlayer2, vsScreenVsImg);

  setTimeout(() => {
    hideElements(vsScreen, vsScreenPlayer1, vsScreenPlayer2, vsScreenVsImg);
    showElements(gameScreen, playerWeaponsContainer, cpuWeaponsContainer);
    randomCpuWeapon();
  }, 2500);
};

const getCpuHero = (humanSelection) => {
  let counter = 0;
  let lastCpuSelection = 0;
  let randomCpuSelection;

  const interval = setInterval(() => {
    herosList[lastCpuSelection].classList.remove('cpu-choice');

    do {
      randomCpuSelection = Math.floor(Math.random() * herosList.length);
    } while (
      randomCpuSelection === humanSelection ||
      randomCpuSelection === lastCpuSelection
    );

    herosList[randomCpuSelection].classList.add('cpu-choice');
    lastCpuSelection = randomCpuSelection;

    counter++;

    if (counter === 10) {
      clearInterval(interval);
      herosList[randomCpuSelection].style.animation = 'cpu-selection 0.5s';
      setTimeout(() => {
        hideElements(heroSelectionScreen);
        showVsScreenData();
      }, 1500);
    }
  }, 200);
};

// Cpu random red border
const randomCpuWeapon = () => {
  let lastCpuSelection = 0;
  let randomCpuSelection;

  const interval = setInterval(() => {
    cpuWeaponsList[lastCpuSelection].classList.remove('cpu-choice');

    do {
      randomCpuSelection = Math.floor(Math.random() * cpuWeaponsList.length);
    } while (randomCpuSelection === lastCpuSelection);

    cpuWeaponsList[randomCpuSelection].classList.add('cpu-choice');
    lastCpuSelection = randomCpuSelection;

    if (playerWeaponSelected) {
      clearInterval(interval);
      cpuWeaponsList[randomCpuSelection].classList.remove('cpu-choice');
    }
  }, 500);
};

const startGame = (e) => {
  if (
    e.target.classList.contains('hero-selection__img') ||
    e.target.classList.contains('hero-selection__hero-name')
  ) {
    heroContainer.removeEventListener('mouseover', addHoverClass);
    heroContainer.removeEventListener('mouseout', removeHoverClass);

    const selectedHeroDiv = e.target.closest('.hero-selection__hero-card');
    const heroPosition = selectedHeroDiv.dataset.heroNumber;

    selectedHeroDiv.style.animation = 'player-selection 0.5s';

    getCpuHero(Number(heroPosition));
  }
};

heroContainer.addEventListener('click', startGame);
