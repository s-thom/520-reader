import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {document, globalize} from './util';
import {reset} from './track';
import './index.css';

globalize('lsReset', reset);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
