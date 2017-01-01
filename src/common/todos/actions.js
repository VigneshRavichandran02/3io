/* @flow */
import type { Action, Deps, Todo } from '../types';
import R from 'ramda';

import { Game, GameUtil } from '../../common/Game';

let currentGame;

export const addHundredTodos = () => ({ getUid, now }: Deps): Action => {
  const todos = R.range(0, 100).map(() => {
    const id = getUid();
    // Note how we can enforce shape with type annotation. This is a special
    // case because flowtype doesn't know Ramda. Nobody wrotes typedefs yet.
    // Atom editor can show flow uncovered code on click.
    const todo: Todo = {
      completed: false,
      createdAt: now(),
      id,
      title: `Item #${id}`,
    };
    return todo;
  });
  return {
    type: 'ADD_HUNDRED_TODOS',
    payload: { todos },
  };
};

export const addTodo = (title: string) => ({ getUid, now }: Deps): Action => ({
  type: 'ADD_TODO',
  payload: {
    todo: {
      completed: false,
      createdAt: now(),
      id: getUid(),
      title: title.trim(),
    },
  },
});

export const clearAllCompletedTodos = (): Action => ({
  type: 'CLEAR_ALL_COMPLETED_TODOS',
});

export const clearAllTodos = (): Action => ({
  type: 'CLEAR_ALL_TODOS',
});

export const deleteTodo = (id: string): Action => ({
  type: 'DELETE_TODO',
  payload: { id },
});

export const toggleTodoCompleted = (todo: Todo): Action => ({
  type: 'TOGGLE_TODO_COMPLETED',
  payload: { todo },
});

const drawWithSet = (num) => {
  let cards = currentGame.deck.draw(num);
  while (!GameUtil.hasSet(cards.concat(currentGame.board.getCards())) && currentGame.deck.cardsRemaining() > 0){
    currentGame.deck.returnCards(cards);
    currentGame.deck.shuffle();
    cards = currentGame.deck.draw(num);
  }
  return cards;
};

export const startGame = (): Action => {
  // When game starts, you must have 12 cards ready and a deck.
  // Draw 12 until there is a set.
  currentGame = new Game();
  let cards = drawWithSet(12);

  //console.log("Set the cards.");
  currentGame.board.setCards(cards);

  //console.log('deck cards remaining', currentGame.deck.cardsRemaining());

  //console.log("See the board's cards:");
  //console.log(cards);

  return {
    type: 'START_GAME',
    payload: {
      board: cards
    },
  };
};

export const selectCard = (index): Action => {
  // cheat
  const sets = GameUtil.getSets(currentGame.board.getCards());
  console.log('sets', sets);

  const cards = currentGame.board.get();
  if (cards[index].isSelected) {
    currentGame.board.deselectCard(index);
  } else {
    currentGame.board.selectCard(index);
  }

  // can't select more than 3 cards
  const selectedCards = currentGame.board.getSelectedCards();
  if (selectedCards.length > 3) {
    currentGame.board.deselectCard(index);
  }
  let set = false;

  if (selectedCards.length === 3 && GameUtil.isSet(selectedCards)) {
    set = true;
    currentGame.board.removeCards(selectedCards);
    const newCards = drawWithSet(3);
    currentGame.board.addCards(newCards);
  }

  console.log('cards remaining', currentGame.deck.cardsRemaining());
  return {
    type: 'SELECT_CARD',
    payload: {
      board: currentGame.board.getCards(),
      set
    }
  };
};

export const endGame = (): Action => ({
  type: 'END_GAME',
  payload: {},
});
