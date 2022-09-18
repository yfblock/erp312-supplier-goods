import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<h2>Hello from React!</h2>);