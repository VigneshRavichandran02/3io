/* @flow */
import type { Action, TodosState } from '../types';
import R from 'ramda';

const initialState = {
  all: {},
  set: 0
};

const reducer = (
  state: TodosState = initialState,
  action: Action,
): TodosState => {
  switch (action.type) {
    case 'START_GAME':
    case 'SELECT_CARD': {
      const board = action.payload.board;
      let set = state.set;
      if (action.payload.set) {
        set += 1;
      }
      return { ...state, board, set };
    }

    case 'END_GAME': {
      return { ...state, all: {} };
    }

    default:
      return state;

  }
};

export default reducer;
