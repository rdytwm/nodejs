import React from 'react';
import ReactDOM from 'react-dom';
import './Assets/css/index.css';
import App from './Component/App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
