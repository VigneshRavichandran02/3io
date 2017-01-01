/* @flow */
import Buttons from './Buttons';
import NewTodo from './NewTodo';
import React from 'react';
import Todos from './Todos';
import { Game } from './Game';
import linksMessages from '../../common/app/linksMessages';
import { PageHeader, Title, View } from '../app/components';
import { injectIntl, intlShape } from 'react-intl';

const TodosPage = ({ intl }) => (
  <View>
    <Game />

    <Title message={linksMessages.todos} />
    <PageHeader heading={intl.formatMessage(linksMessages.todos)} />
    <NewTodo />
    <Todos />
    <Buttons />

  </View>
);

TodosPage.propTypes = {
  intl: intlShape,
};

export default injectIntl(TodosPage);
