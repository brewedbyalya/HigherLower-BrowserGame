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
    if (!document.getElementById('game-status')) {
        statusMessage.id = 'game-status';
        statusMessage.className = 'mt-3 text-center fw-bold';
        document.querySelector('.container main')?.appendChild(statusMessage);
    }
    
    coins = 0;
    gameActive = true;
    updateCoinDisplay();
    updateStatus("Game started! Is the next card higher or lower?");
    drawNewCard();
    
    if (backCard) {
        backCard.src = './assets/flippedCard.png';
        backCard.alt = 'Flipped Card';
    }
    
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

async function showFlippedCard() {
    if (backCard) {
        backCard.src = './assets/flippedCard.png';
        backCard.style.display = 'block';
        backCard.classList.add('flip-animation');
        
        await new Promise(resolve => setTimeout(resolve, 500));
        backCard.classList.remove('flip-animation');
    }
}

async function revealCard() {
    if (backCard) {
        backCard.src = `./assets/${nextCard}.png`;
        backCard.alt = `Card ${nextCard}`;
        backCard.classList.add('flip-animation');
        
        await new Promise(resolve => setTimeout(resolve, 500));
        backCard.classList.remove('flip-animation');
    }
}

function updateStatus(message, isSuccess = true) {
    if (statusMessage) {
        statusMessage.textContent = message;
        statusMessage.style.color = isSuccess ? '#200615' : '#a7284a';
    }
}

async function compareCards(guess) {
    if (!gameActive) return;
    
    if (higherBtn) higherBtn.disabled = true;
    if (lowerBtn) lowerBtn.disabled = true;
    
    const currentIndex = cardValues.indexOf(currentCard);
    const nextIndex = cardValues.indexOf(nextCard);
    
    await showFlippedCard();
    await new Promise(resolve => setTimeout(resolve, 300));
    await revealCard();
    
    // Check if cards are equal first
    if (currentIndex === nextIndex) {
        updateStatus(`Same card! ${nextCard} equals ${currentCard}. Try again!`, true);
        setTimeout(async () => {
            if (backCard) backCard.style.display = 'none';
            
            // Redraw the next card (keeping current card the same)
            const nextRandomIndex = Math.floor(Math.random() * cardValues.length);
            nextCard = cardValues[nextRandomIndex];
            
            if (higherBtn) higherBtn.disabled = false;
            if (lowerBtn) lowerBtn.disabled = false;
        }, 1000);
        return;
    }
    
    let correct = false;
    if (guess === 'higher' && nextIndex > currentIndex) {
        correct = true;
    } else if (guess === 'lower' && nextIndex < currentIndex) {
        correct = true;
    }
    
    if (correct) {
        coins++;
        updateCoinDisplay();
        updateStatus(`Correct! ${nextCard} is ${guess} than ${currentCard}`, true);
        
        if (coins >= 10) {
            updateStatus("Congratulations! You won with 10 coins!", true);
            gameActive = false;
            createConfetti();
            setTimeout(() => {
                window.location.href = "winner.html";
            }, 1500);
        } else {
            setTimeout(async () => {
                currentCard = nextCard;
                if (frontCard) frontCard.src = `./assets/${currentCard}.png`;
                if (backCard) backCard.style.display = 'none';
                
                drawNewCard();
                updateStatus(`Now compare ${currentCard} to the next card`, true);
                
                if (higherBtn) higherBtn.disabled = false;
                if (lowerBtn) lowerBtn.disabled = false;
            }, 1000);
        }
    } else {
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