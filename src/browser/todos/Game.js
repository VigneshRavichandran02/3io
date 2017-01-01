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

const _ = require('underscore');

const CardComponent = ({card, selectCard}) => {
  return <h5 onClick={ selectCard }>{card.properties}</h5>
};

const Card = connect(
  () => {
    return {};
  },
  (dispatch, ownProps) => {
    return {
      selectCard: () => {
        dispatch(selectCard(ownProps.index));
      }
    }
  }
)(CardComponent);

const GameComponent = ({ deck, startGame, endGame }) => {
  const gameDeck = _.map(deck, (card, i) => {
    return <Card key={i} index={i} card={card} />;
  });
  return (
    <div>
      <h1>Game</h1>
      <Button onClick={startGame}> Start Game </Button>
      <Space />
      <Button onClick={endGame}> End Game </Button>

      <div className="cardDeck">
      { gameDeck }
      </div>
    </div>
  );
};

const Game = connect(
  (state) => {
    return { deck: state.game.deck };
  },
  (dispatch, ownProps) => {
    return {
      startGame: () => dispatch(startGame),
      endGame: () => dispatch(endGame),
    }
  }
)(GameComponent);

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
  Game
};
