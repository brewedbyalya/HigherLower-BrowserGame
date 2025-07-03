/* Psuedocode:- Coins start at 0, and when the game restarts, its 0 again.
//card1 and card2 needs to change after every round.
//Coin score needs to go up every round.
//The program needs to be responsive to the user's guesses (show correct if guessed right).
//A message needs to appear after every correct or wrong guess.
//The program needs to stop after 10 coins to declare the user a winner.
//Flip animation needs to play after rounds, updating the cards.*/

/*-------------- Constants -------------*/
const cardValues = ["Ace","2","3","4","5","6","7","8","9","10","Jester","Queen","King"];

/*---------- Variables (state) ---------*/
let currentCard;
let nextCard;
let coins = 0;
let gameActive;

/*----- Cached Element References  -----*/
const frontCard = document.querySelector('.card1 img');
const backCard = document.querySelector('.card2 img');
const higherBtn = document.getElementById('higher');
const lowerBtn = document.getElementById('lower');
const resetBtn = document.getElementById('resetBtn');
const coinCount = document.getElementById('coin-count');
const statusMessage = document.getElementById('game-status-container');

/*-------------- Functions -------------*/
function initGame() {
  coins = 0;
  gameActive = true;
  updateCoinDisplay();
  updateStatus("Game started! Is the next card higher or lower?");
  drawNewCard();

  if (backCard) {
    backCard.src = './assets/flippedCard.png';
    backCard.alt = 'Flipped card back';
    backCard.classList.remove('hidden');
  }

  if (higherBtn) higherBtn.disabled = false;
  if (lowerBtn) lowerBtn.disabled = false;
}

function drawNewCard() {
  const randomIndex = Math.floor(Math.random() * cardValues.length);
  currentCard = cardValues[randomIndex];

  if (frontCard) {
    frontCard.src = `./assets/${currentCard}.png`;
    frontCard.alt = `${currentCard} playing card`;
  }

  let nextRandomIndex;
  do {
    nextRandomIndex = Math.floor(Math.random() * cardValues.length);
  } while (nextRandomIndex === randomIndex);
  nextCard = cardValues[nextRandomIndex];
}

async function showFlippedCard() {
  if (backCard) {
    backCard.src = './assets/flippedCard.png';
    backCard.alt = 'Flipped card back';
    backCard.classList.remove('hidden');
  }
}

async function revealCard() {
  if (backCard) {
    backCard.src = `./assets/${nextCard}.png`;
    backCard.alt = `${nextCard} playing card`;
    backCard.classList.add('flip-animation');
    await new Promise(resolve => setTimeout(resolve, 500));
    backCard.classList.remove('flip-animation');
  }
}

async function compareCards(guess) {
  if (!gameActive) return;

  higherBtn.disabled = true;
  lowerBtn.disabled = true;

  const currentIndex = cardValues.indexOf(currentCard);
  const nextIndex = cardValues.indexOf(nextCard);

  await showFlippedCard();
  await new Promise(resolve => setTimeout(resolve, 300));
  await revealCard();

  if (currentIndex === nextIndex) {
    updateStatus(`Same card! ${nextCard} equals ${currentCard}. Try again!`, true);
    setTimeout(() => {
      drawNewCard();
      if (higherBtn) higherBtn.disabled = false;
      if (lowerBtn) lowerBtn.disabled = false;
    }, 1000);
    return;
  }

  const correct = (guess === 'higher' && nextIndex > currentIndex) ||
                  (guess === 'lower' && nextIndex < currentIndex);

  if (correct) {
    coins++;
    updateCoinDisplay();
    updateStatus(`Correct! ${nextCard} is ${guess} than ${currentCard}.`, true);

    if (coins >= 10) {
      playSound('successSound');
      updateStatus('Congratulations! You won with 10 coins!', true);
      gameActive = false;
      createConfetti();
      setTimeout(() => (window.location.href = 'winner.html'), 1500);
    } else {
      setTimeout(async () => {
        currentCard = nextCard;
        frontCard.src = `./assets/${currentCard}.png`;
        await showFlippedCard();
        drawNewCard();
        updateStatus(`Now compare ${currentCard} to the next card.`, true);
        higherBtn.disabled = false;
        lowerBtn.disabled = false;
      }, 1000);
    }
  } else {
    playSound('failureSound');
    updateStatus(`Game Over! ${nextCard} is ${nextIndex > currentIndex ? 'higher' : 'lower'} than ${currentCard}. You collected ${coins} coins.`, false);
    gameActive = false;
  }
}

function updateCoinDisplay() {
  if (coinCount) {
    coinCount.textContent = coins;
    coinCount.classList.add('text-pop');
    setTimeout(() => coinCount.classList.remove('text-pop'), 300);
  }
}

function updateStatus(message, isPositive = true) {
  if (statusMessage) {
    statusMessage.textContent = message;
    statusMessage.className = isPositive ? 'status-positive' : 'status-negative';
  }
}


/*----------- Event Listeners ----------*/
if (higherBtn) {
    higherBtn.addEventListener('click', () => compareCards('higher'));
}

if (lowerBtn) {
    lowerBtn.addEventListener('click', () => compareCards('lower'));
}

if (resetBtn) {
    resetBtn.addEventListener('click', initGame);
}

initGame();

/* ----------------------------------------Extras-------------------------------------------- */

/*----------- Confetti Animation ----------*/
function createConfetti() {
    const colors = ['#6a0dad', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
    const container = document.createElement('div');
    container.id = 'confetti-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '1000';
    document.body.appendChild(container);
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animation = `confetti ${(Math.random() * 3 + 2)}s ease-in-out ${(Math.random() * 2)}s infinite`;
        confetti.style.left = Math.random() * 100 + 'vw';
        container.appendChild(confetti);
    }
    
    setTimeout(() => {
        container.remove();
    }, 5000);
}

/*---------------- Sound Effects ----------------*/
let musicEnabled = true;
let musicStarted = false;

function initMusic() {
  if (!musicStarted && musicEnabled) {
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
      bgMusic.volume = 0.3;
      bgMusic.play();
      musicStarted = true;
    }
  }
}

function toggleMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    
    if (bgMusic) {
        musicEnabled = !musicEnabled;
        if (musicEnabled) {
            bgMusic.play();
            musicToggle.textContent = 'Music: ON';
        } else {
            bgMusic.pause();
            musicToggle.textContent = 'Music: OFF';
        }
    }
}

function playSound(soundId) {
    if (!musicEnabled) return;
    
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0;
        sound.play();
    }
}

document.addEventListener('DOMContentLoaded', () => {
  const musicToggle = document.getElementById('musicToggle');
  if (musicToggle) {
    musicToggle.addEventListener('click', toggleMusic);
  }
  
  document.body.addEventListener('click', initMusic, { once: true });
  
  if (window.location.pathname.includes('winner.html')) {
    playSound('successSound');
  }
});