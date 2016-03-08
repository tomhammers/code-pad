import React from 'react';
import ReactDOM from 'react-dom';
import { Route, IndexRoute } from 'react-router';
import App from './containers/app';

ReactDOM.render(
    <App style={style}/>,
    document.getElementById('app')
);

let style = {
  height: '100%'
};