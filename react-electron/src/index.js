import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {GenericProvider} from "./components/contexts/GenericContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GenericProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </GenericProvider>
);
