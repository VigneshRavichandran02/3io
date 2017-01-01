const _ = require('underscore');

/*********** Configurable Game Constants ***********/
const Texture = ['solid', 'shaded', 'empty'];
const Shape = ['square', 'squiggle', 'oval'];
const Quantity = ['one', 'two', 'three'];
const Color = ['blue', 'green', 'red'];

const PropertyTypes = [Color, Quantity, Shape, Texture];

const NUM_PROPERTIES = PropertyTypes.length;
const NUM_VARIATIONS = PropertyTypes[0].length;

const TOTAL_CARDS = Math.pow(NUM_VARIATIONS, NUM_PROPERTIES);

const GAME_CARDS = 12;


/*********** Game ***********/
class Game {
  constructor() {
    this.deck = new Deck();
    this.board = new GameBoard();
    this.points = 0;
  }
}


/*********** Deck ***********/
class Deck {
  constructor() {
    this.cards = [];

    this.reset();
  }

  // Reset the deck to an initial state.
  reset() {
    const choices = [];
    for (let i = 0; i < NUM_VARIATIONS; i++) {
      choices.push(i);
    }

    const cardsProperties = [];
    for (let i = 0; i < NUM_VARIATIONS; i++){
      permute(0, i, [], choices, cardsProperties);
    }

    const cards = [];
    cardsProperties.forEach((cardProperties, cardPropertiesIndex) => {
      cards[cardPropertiesIndex] = new Card(cardProperties);
    });

    this.cards = _.shuffle(cards);
  }

  shuffle() {
    this.cards = _.shuffle(this.cards);
  }

  // Draw 'n' cards from the deck.
  draw(n) {
    return this.cards.splice(0, n);
  }

  // Return cards to the deck.
  returnCards(cards) {
    this.cards.push(...cards);
  }

  // Get the number of cards remaining.
  cardsRemaining() {
    return this.cards.length;
  }
}


/*********** GameBoard ***********/
class GameBoard {
  constructor() {
    this.cards = [];

    this.selectedCardIndexes = [];

    this.reset();
  }

  // Reset the board.
  reset() {
    const cards = [];
    for (let i = 0; i < GAME_CARDS; i++) {
      cards[i] = null;
    }

    this.cards = cards;	
  }

  // Add cards to the board.
  addCards(newCards) {
    if (newCards.length > this.cards.filter((card) => card == null).length) {
      throw new Error('Added too many cards');
    }

    newCards = Array.from(newCards);

    while (newCards.length) {
      this.cards.forEach((card, cardIndex) => {
        if (this.cards[cardIndex] == null && newCards.length) {
          this.cards[cardIndex] = newCards.shift();
        }
      });
    }
  }

  // Remove cards from the board.
  removeCards(cardsToRemove) {
    this.cards.forEach((card, cardIndex) => {
      cardsToRemove.forEach((cardToRemove) => {
        if (card.equals(cardToRemove)) {
          this.cards[cardIndex] = null;
        }
      });
    });
  }

  // Set the cards on the board.
  setCards(cards) {
    this.cards = Array.from(cards);
  }

  // Get the board - the cards, including gaps in the board.
  get() {
    return this.cards;
  }

  // Get the cards on the board (same as get(), but with valid cards only).
  getCards() {
    return this.get().filter((card) => card != null);
  }

  // Select a card by its index.
  selectCard(cardIndex) {
    // Delsect a card if there are already NUM_VARIATIONS selected.
    /*
    if (this.selectedCardIndexes.length > NUM_VARIATIONS) {
      this.board.deselectCard(this.selectedCardIndexes[0]);
      this.selectedCardIndexes.pop();
    }
   */

    this.cards[cardIndex].isSelected = true;
    //this.selectedCardIndexes.push(cardIndex);
  }

  // Get all of the selected cards.
  getSelectedCards() {
    return this.cards.filter((card) => card.isSelected);
  }

  // Delselect a card by its index.
  deselectCard(cardIndex) {
    this.cards[cardIndex].isSelected = false;

    //const i = this.selectedCardIndexes.indexOf(cardIndex);
    //this.selectedCardIndexes.splice(i, 1);
  }
}


/*********** Card ***********/
class Card {
  constructor(properties) {
    if (properties.length != NUM_PROPERTIES) {
      throw new Error('Invalid properties');
    }
    properties.forEach((property) => {
      if (property < 0 || property >= NUM_VARIATIONS) {
        throw new Error('Invalid variations');
      }
    });

    this.properties = properties;
    this.isSelected = false;
  }

  // Get the card's properties.
  get() {
    return Array.from(this.properties);
  }

  toString() {
    return this.properties.join(',');
  }

  // Check equality
  equals(otherCard) {
    return this.toString() == otherCard.toString();
  }
}


/*********** Game Utility Functions ***********/
const GameUtil = {
  // Determine whether the given cards form a valid set.
  isSet(cards) {
    if (cards.length != NUM_VARIATIONS) {
      throw new Error('Wrong number of cards.');
    }

    const cardPropertiesTranspose = [];
    for (let x = 0; x < NUM_PROPERTIES; x++) {
      cardPropertiesTranspose[x] = [];
      for (let y = 0; y < cards.length; y++) {
        cardPropertiesTranspose[x][y] = cards[y].get()[x];
      }
    }

    for (let i = 0; i < cardPropertiesTranspose.length; i++) {
      const numUniqueProperties = cardPropertiesTranspose[i].filter((property, i, properties) => properties.indexOf(property) == i).length;
      if (numUniqueProperties != 1 && numUniqueProperties != NUM_VARIATIONS) {
        return false;
      }
    }

    return true;
  },

  // Get all valid sets from the given cards.
  getSets(cards) {
    let cardCombinationList = [];

    for (let i = 0; i < cards.length; i++) {
      cominbations(0, cards[i], [], cards, cardCombinationList, NUM_VARIATIONS);
    }

    const sets = [];

    cardCombinationList.forEach((cardCombinations) => {
      if (GameUtil.isSet(cardCombinations)) {
        sets.push(cardCombinations);
      }
    });

    return sets;
  },

  // Determine if the given cards have a valid set.
  hasSet(cards) {
    return GameUtil.getSets(cards).length > 0;
  },
};


/*********** Private Helper Functions ***********/
function permute(i, choice, permutation, choices, allPermutations) {
  permutation[i] = choice;

  if (i + 1 >= NUM_PROPERTIES) {
    allPermutations[allPermutations.length] = permutation;
    return;
  }

  choices.forEach((choice) => {
    const permutationCopy = Array.from(permutation);
    permute(i + 1, choice, permutationCopy, choices, allPermutations);
  });
}

function cominbations(i, choice, combination, choices, allCombinations, len) {
  combination[i] = choice;

  if (i + 1 >= len) {
    allCombinations[allCombinations.length] = combination;
    return;
  }

  const r = choices.findIndex((c) => c.equals(choice));
  const reminaingChoices = choices.slice(r + 1);
  reminaingChoices.forEach((choice) => {
    const combinationCopy = Array.from(combination);
    cominbations(i + 1, choice, combinationCopy, reminaingChoices, allCombinations, len);
  });
}

export { Game, GameUtil };

/*
const game = new Game();

let cards;
console.log("Draw 12 until there is a set.");
do {
  cards = game.deck.draw(12);
  game.deck.reset();
} while (!GameUtil.hasSet(cards));

console.log("See the sets:");
console.log(GameUtil.getSets(cards));

console.log("Set the cards.");
game.board.setCards(cards);

cards = game.board.get();

console.log("See the board's cards:");
console.log(cards);

console.log("See the first card's details:");
cards[0].properties.forEach((property, propertyIndex) => {
  console.log(PropertyTypes[propertyIndex][property]);
});

console.log("Select the third card:");
game.board.selectCard(2);

console.log("Confirm it is selected:");
console.log(cards[2]);

console.log("Selecting 2 more cards.")
game.board.selectCard(3);
game.board.selectCard(4);

console.log("See the 3 selected cards.");
const selectedCards = game.board.getSelectedCards();
console.log(selectedCards);

console.log("Are the 3 selected cards a set? : ");
console.log(GameUtil.isSet(selectedCards));

console.log("Assume set for demo purposes - then we remove them from the board.");
game.board.removeCards(selectedCards);

// Award some points.
game.points += 5;

console.log("See that there are missing cards in the board after being removed:");
console.log(game.board.get());

let i;
for (i = 0; i < 1000; i++) {
  console.log("Keep trying to draw 3 cards as long as there's a set in the new board. Try 1000 times.");
  // TODO: Remove 1000 and figure out if there is any way to make a set from the remaining cards.
  const newCards = game.deck.draw(3);
  const potentialBoard = [...game.board.getCards(), ...newCards];

  if (GameUtil.hasSet(potentialBoard)) {
    console.log("New cards that guarentee a set in the board:");
    console.log(newCards);

    console.log("Add the new cards to the board.");
    game.board.addCards(newCards);

    break;
  }

  game.deck.returnCards(newCards);
}

if (i >= 1000) {
  console.log("GAME IS OVER");
  // exit();
}

*/
