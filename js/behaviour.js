/*-------------- Constants -------------*/
const cardValues = ["Ace","2","3","4","5","6","7","8","9","10","Jester","Queen","King"];

/*---------- Variables (state) ---------*/
let currentCard = null;
let nextCard = null;
let coins = 0;
let gameActive = false;
let msg;

/*----- Cached Element References  -----*/
const frontCard = document.querySelector('.card1 img');
const backCard = document.querySelector('.card2 img');
const higherBtn = document.getElementById('higher');
const lowerBtn = document.getElementById('lower');
const resetBtn = document.getElementById('resetBtn');
const coinCount = document.getElementById('coin-count');

/*-------------- Functions -------------*/
function initGame() {
    coins = 0;
    gameActive = true;
    updateCoinDisplay();
    drawNewCard();
    if (backCard) backCard.style.display = 'none';
    if (higherBtn) higherBtn.disabled = false;
    if (lowerBtn) lowerBtn.disabled = false;
}
function drawNewCard() {
    const randomIndex = Math.floor(Math.random() * cardValues.length);
    currentCard = cardValues[randomIndex];
     if (frontCard) {
        frontCard.src = `./assets/${currentCard}.png`;
        frontCard.alt = `Card ${currentCard}`;
    }
    const nextRandomIndex = Math.floor(Math.random() * cardValues.length);
    nextCard = cardValues[nextRandomIndex];
}

function compareCards(guess) {
    if (!gameActive) return;
    
    const currentIndex = cardValues.indexOf(currentCard);
    const nextIndex = cardValues.indexOf(nextCard);
    if (backCard) {
        backCard.src = `./assets/${nextCard}.png`;
        backCard.alt = `Card ${nextCard}`;
        backCard.style.display = 'block';
    }
     let correct = false;
    
    if (guess === 'higher' && nextIndex > currentIndex) {
        correct = true;
    } else if (guess === 'lower' && nextIndex < currentIndex) {
        correct = true;
    } else if (nextIndex === currentIndex) {
        correct = false; 
    }
    if (correct) {
        coins++;
        updateCoinDisplay();
        setTimeout(() => {
        currentCard = nextCard;
            if (frontCard) frontCard.src = `./assets/${currentCard}.png`;
            if (backCard) backCard.style.display = 'none';
            drawNewCard();
             if (coins >= 10) {
                msg = `You won!`;
             gameActive = false;
            }
        }, 1000);
    } else {
        setTimeout(() => {
            msg = `Game Over! You collected ${coins} coins.`;
            gameActive = false;
            if (higherBtn) higherBtn.disabled = true;
            if (lowerBtn) lowerBtn.disabled = true;
        }, 1000);
    }
}
function updateCoinDisplay() {
    if (coinCount) coinCount.textContent = coins;
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
