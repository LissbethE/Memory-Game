'use strict';

const btnNew = document.querySelector('.btn-new');
const wrapper = document.querySelector('.wrapper');
const card = Array.from(document.querySelectorAll('.card'));
const scoreEl = document.querySelector('.score');
const highscoreEl = document.querySelector('.highscore');

let score = 16;
let highscore = 0;

let hasFlippedCard = false;
let lockBoard = false;
let card1, card2;
let cardImg1, cardImg2;

const shuffle = function () {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
  arr.sort(() => (Math.random() > 0.5 ? 1 : -1));

  card.forEach((c, i) => {
    let img = c.querySelector('.back-view').querySelector('img');
    img.src = `./Img/emoji-${arr[i]}.png`;
  });
};
shuffle();

const resetBoard = function () {
  [hasFlippedCard, lockBoard] = [false, false];
  [card1, card2] = [null, null];
};

const message = function (m) {
  const h1 = document.querySelectorAll('.back-text h1');

  h1.innerHTML = m;

  h1.forEach(e => {
    e.innerHTML = m
      .split('')
      .map((letter, i) => `<span style="--i: ${i}">${letter}</span>`)
      .join('');
  });

  const span = document.querySelectorAll('.back-text h1 span');
  if (m === 'Perdedor') {
    span.forEach(s => {
      s.style.animation = 'none';
      s.style.color = '#f52a40';
    });
  }
};

const win = function () {
  const winner = card.every(c => c.classList.contains('flip'));

  if (winner && score >= highscore) {
    highscoreEl.textContent = score;

    setTimeout(() => {
      wrapper.classList.add('active');
      message('Ganador');
    }, 1000);
  }
};

const lost = function () {
  if (score > 0) {
    score--;
    scoreEl.textContent = score;

    if (score === 0) {
      scoreEl.textContent = 0;
      scoreEl.textContent = 0;
      card.forEach(c => c.removeEventListener('click', flipCard));

      setTimeout(() => {
        wrapper.classList.add('active');
        message('Perdedor');
      }, 1000);
    }
  }
};

const disabledCard = function () {
  // Yes a match
  card1.removeEventListener('click', flipCard);
  card2.removeEventListener('click', flipCard);

  win();
  resetBoard();
};

const unflipCard = function () {
  lockBoard = true;
  lost();

  // Not a match
  setTimeout(() => {
    card1.classList.add('shake');
    card2.classList.add('shake');
  }, 400);

  setTimeout(() => {
    card1.classList.remove('shake', 'flip');
    card2.classList.remove('shake', 'flip');

    resetBoard();
  }, 1200);
};

// Flip Card
const flipCard = function () {
  if (lockBoard) return;
  if (this === card1) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    // Primer click
    hasFlippedCard = true;
    card1 = this;
    cardImg1 = card1.querySelector('.back-view').querySelector('img').src;
    return;
  }

  // Segundo click
  hasFlippedCard = false;
  card2 = this;
  cardImg2 = card2.querySelector('.back-view').querySelector('img').src;

  checkForMatch();
};

const checkForMatch = () =>
  cardImg1 === cardImg2 ? disabledCard() : unflipCard();

// Add an event to the cards
card.forEach(c => c.addEventListener('click', flipCard));

// B T N -- A G A I N
btnNew.addEventListener('click', () => {
  shuffle();
  resetBoard();

  score = 16;
  scoreEl.textContent = score;
  wrapper.classList.remove('active');

  card.forEach(c => {
    c.classList.remove('shake', 'flip');
    c.addEventListener('click', flipCard);
  });
});
