/* @flow */


import React from 'react';
import { View, StyleSheet, Text, TouchableHighlight, Button } from 'react-native';
import { createCardContainer, createGameContainer } from '../../browser/todos/Game';

console.log('check imports', createCardContainer);

const _ = require('underscore');

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 5,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    margin: 5,
  },
});

const CardComponent = ({ card, selectCard }) => (
  <TouchableHighlight onPress={selectCard} style={[styles.card, { backgroundColor: 'green' }]}>
      <Text >{ card.properties }</Text>
  </TouchableHighlight>
);

const Card = createCardContainer(CardComponent);

const GameComponent = ({ board, set, startGame, endGame }) => {
  console.log('board', board, 'startGame', startGame, 'endGame', endGame, 'set', set);
  const gameDeck = _.map(board, (card, i) => {
    return <Card key={i} index={i} card={card} />;
  });
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
        <Button onPress={startGame} title="Start Game" />
        <Button onPress={endGame} title="End Game" />
      </View>
      <View style={{flex: 9}}>
        <View style={styles.cardContainer}>
          {gameDeck[0]}
          {gameDeck[1]}
          {gameDeck[2]}
        </View>
        <View style={styles.cardContainer}>
          {gameDeck[3]}
          {gameDeck[4]}
          {gameDeck[5]}
        </View>
        <View style={styles.cardContainer}>
          {gameDeck[6]}
          {gameDeck[7]}
          {gameDeck[8]}
        </View>
        <View style={styles.cardContainer}>
          {gameDeck[9]}
          {gameDeck[10]}
          {gameDeck[11]}
        </View>
      </View>
    </View>
  );
};

const Game = createGameContainer(GameComponent);

export {
  Game,
};
