/* @flow */
import type { Action, TodosState } from '../types';
import R from 'ramda';

const initialState = {
  all: {},
};

const reducer = (
  state: TodosState = initialState,
  action: Action,
): TodosState => {
  switch (action.type) {
    case 'START_GAME': {
      const deck = action.payload.deck;
      return { ...state, deck };
    }

    case 'END_GAME': {
      return { ...state, all: {} };
    }

    default:
      return state;

  }
};

export default reducer;
