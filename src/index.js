import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import 'font-awesome/css/font-awesome.css';
import 'awsdk/lib/awsdk.css';
import { applyPolyfills, defineCustomElements } from 'amwell-visit-console/loader';

import App from './App';

applyPolyfills().then(() => {
    defineCustomElements(window)
        .then(() => {
            ReactDOM.render(
                <BrowserRouter>
                    <Route component={App} />
                </BrowserRouter>,
                document.getElementById('root'));
        });
});
