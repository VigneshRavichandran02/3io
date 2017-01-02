/* @flow */
import R from 'ramda';
import React from 'react';
import newTodoMessages from '../../common/todos/newTodoMessages';
import { Button, Space } from '../app/components';
import { Input, Form } from '../app/components';
import { addTodo, startGame, endGame, selectCard } from '../../common/todos/actions';
import { connect } from 'react-redux';
import { fields } from '../../common/lib/redux-fields';
import { injectIntl, intlShape } from 'react-intl';

console.log("todo game is getting imported");

const _ = require('underscore');

const CardComponent = ({isSelected, properties, selectCard}) => {
  const className = isSelected ? 'selected' : '';
  return <h5 className={className + ' card'} onClick={ selectCard }>{properties}</h5>
};

const createCardContainer = (component) => {
  return connect(
    (state, ownProps) => {
      const card = state.game.board[ownProps.index];
      return {
        isSelected: card.isSelected,
        properties: card.properties
      };
    },
    (dispatch, ownProps) => {
      return {
        selectCard: () => {
          dispatch(selectCard(ownProps.index));
        }
      }
    })(component);
};
const Card = createCardContainer(CardComponent);

const GameComponent = ({ board, set, startGame, endGame }) => {
  const gameDeck = _.map(board, (card, i) => {
    return <Card key={i} index={i} />;
  });
  return (
    <div>
      <h1>Game</h1>
      <h2>Point: {set}</h2>
      <Button onClick={startGame}> Start Game </Button>
      <Space />
      <Button onClick={endGame}> End Game </Button>

      <div className="cardDeck">
      { gameDeck }
      </div>
    </div>
  );
};

const createGameContainer = (component) => {
  return connect(
    (state) => {
      return { board: state.game.board, set: state.game.set };
    },
    (dispatch, ownProps) => {
      return {
        startGame: () => dispatch(startGame),
        endGame: () => dispatch(endGame),
      }
    })(component);
};

const Game = createGameContainer(GameComponent);

/*
export default R.compose(
  connect(
    null,
    { addTodo },
  ),
  injectIntl,
  fields({
    path: 'newTodo',
    fields: ['title'],
  }),
)(NewTodo);
*/

export {
  Game,
  createCardContainer,
  createGameContainer,
};
