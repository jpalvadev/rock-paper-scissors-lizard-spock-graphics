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

const startBtn = document.querySelector('.btn--start');

const gameFront = document.querySelector('.game-front');

const vsScreenPlayer1 = document.querySelector('.vs-screen__player--1');
const vsScreenPlayer2 = document.querySelector('.vs-screen__player--2');
const vsScreen = document.querySelector('.vs-screen');
const vsScreenVsImg = document.querySelector('.vs-screen__vs');

const herosList = document.querySelectorAll('.hero-selection__hero-card');
const cpuWeaponsList = document.querySelectorAll('.cpu-weapons');

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

const playerLifeBar = document.querySelector('.game-screen__healthbar-life--1');
const cpuLifeBar = document.querySelector('.game-screen__healthbar-life--2');

const fightScreen = document.querySelector('.game-screen__fight');
const hands = document.querySelector('.game-screen__hands');
const playerHand = document.querySelector('.game-screen__hands--player');
const cpuHand = document.querySelector('.game-screen__hands--cpu');

const outcomeTextOne = document.querySelector('.game-screen__outcome-text--1');
const outcomeTextTwo = document.querySelector('.game-screen__outcome-text--2');

let playerWeaponSelected = false;

///////////////////////////////
// DYNAMIC MEDIA QUERY DETECTOR
let mediaqueryList = window.matchMedia('(min-width: 640px)');
console.log(mediaqueryList);

const mediaqueryDetector = (wide) => {
  if (wide.matches) {
    playerLifeBar.style.left = `${score[1] * 20}%`;
  } else {
    playerLifeBar.style.left = `-${score[1] * 20}%`;
  }
};

mediaqueryList.addEventListener('change', mediaqueryDetector);
// mediaqueryList.removeEventListener('change', mediaqueryDetector);

/////////////
// GAME LOGIC
const getComputerPlay = () => {
  return computerChoices[Math.floor(Math.random() * computerChoices.length)];
};

const showWinner = (plChoice, cpuChoice) => {
  playerHand.src = `images/hands/${plChoice}.png`;
  cpuHand.src = `images/hands/${cpuChoice}.png`;

  // PROBANDO
  setTimeout(() => {
    playerWeaponsContainer.classList.toggle('visible');
    cpuWeaponsContainer.classList.toggle('visible');
    fightScreen.classList.toggle('visible');
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
};

// MAIN game screen
gameFront.classList.toggle('hidden');
gameScreen.classList.toggle('visible');

/////////////////////
// START BUTTON CLICK
startBtn.addEventListener('click', function () {
  //flow normal
  // gameFront.classList.toggle('hidden');
  // setTimeout(() => {
  //   heroSelectionScreen.classList.toggle('visible');
  // }, 500);
  //vs screen
  // vsScreen.classList.toggle('visible');
  // vsScreenPlayer1.classList.toggle('visible');
  // vsScreenPlayer2.classList.toggle('visible');
  // vsScreenVsImg.classList.toggle('visible');
  // const startBtnSound = document.querySelector('.suffer');
  // startBtnSound.play();
  // game screen
  // gameScreen.classList.toggle('visible');
});

///////////////////////////////
// ADD AND REMOVE HOVER CLASSES
const addHoverClass = (e) => {
  if (e.target.closest('.hero-selection__hero-card')) {
    e.target.closest('.hero-selection__hero-card').classList.add('hero-hover');
  }

  if (e.target.closest('.game-screen__weapons--player')) {
    e.target.classList.add('weapon-hover');
  }
};
heroContainer.addEventListener('mouseover', addHoverClass);
playerWeaponsContainer.addEventListener('mouseover', addHoverClass);

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
heroContainer.addEventListener('mouseout', removeHoverClass);
playerWeaponsContainer.addEventListener('mouseout', removeHoverClass);

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

//
const playerWeapon = (e) => {
  if (!e.target.closest('.game-screen__weapon')) return;
  let route = e.target.src.lastIndexOf('/') + 1;
  let playerChoice = e.target.src.slice(route, -4);

  showElements(playerWeaponsContainer, cpuWeaponsContainer);
  playerWeaponsContainer.ontransitionend = () => {
    showElements(fightScreen);
    hands.style.animation = 'handsUpDown 2s ease 1s';
  };
  hands.onanimationend = () => {
    hands.style.animation = '';
    showWinner(playerChoice, getComputerPlay());
  };
};
playerWeaponsContainer.addEventListener('click', playerWeapon);

// VS Screen
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

  vsScreen.classList.toggle('visible');
  vsScreenPlayer1.classList.toggle('visible');
  vsScreenPlayer2.classList.toggle('visible');
  setTimeout(() => {
    vsScreenVsImg.classList.toggle('visible');
    setTimeout(() => {
      vsScreen.classList.toggle('visible');
      vsScreenPlayer1.classList.toggle('visible');
      vsScreenPlayer2.classList.toggle('visible');
      vsScreenVsImg.classList.toggle('visible');
      gameScreen.classList.toggle('visible');
      getCpuWeapon();
    }, 2000);
  }, 500);
};

const getCpuChoice = (humanSelection) => {
  let counter = 0;
  let lastCpuSelection = 0;
  let randomCpuSelection;

  const interval = setInterval(() => {
    herosList[lastCpuSelection].classList.remove('cpu-choice');

    do {
      randomCpuSelection = Math.floor(Math.random() * herosList.length);
      console.log(randomCpuSelection);
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
        heroSelectionScreen.classList.toggle('visible');
        setTimeout(() => {
          showVsScreenData();
        }, 500);
      }, 1500);
    }
  }, 200);
};

const getCpuWeapon = () => {
  let lastCpuSelection = 0;
  let randomCpuSelection;

  const interval = setInterval(() => {
    cpuWeaponsList[lastCpuSelection].classList.remove('cpu-choice');

    do {
      randomCpuSelection = Math.floor(Math.random() * cpuWeaponsList.length);
      console.log(randomCpuSelection);
    } while (randomCpuSelection === lastCpuSelection);

    cpuWeaponsList[randomCpuSelection].classList.add('cpu-choice');
    lastCpuSelection = randomCpuSelection;

    if (playerWeaponSelected) {
      clearInterval(interval);
    }
  }, 500);
};

const startGame = (e) => {
  if (
    e.target.classList.contains('hero-selection__img') ||
    e.target.classList.contains('hero-selection__hero-name')
  ) {
    console.log('anda');
    heroContainer.removeEventListener('mouseover', addHoverClass);
    heroContainer.removeEventListener('mouseout', removeHoverClass);

    const selectedDiv = e.target.closest('.hero-selection__hero-card');
    const heroSelectedName = selectedDiv.querySelector(
      '.hero-selection__hero-name'
    ).textContent;
    const heroPosition = selectedDiv.dataset.heroNumber;

    selectedDiv.style.animation = 'player-selection 0.5s';
    heroContainer.removeEventListener('click', startGame);
    getCpuChoice(Number(heroPosition));
  }
};

heroContainer.addEventListener('click', startGame);
