import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {initAnalytics, trackPageView} from './services/analytics.ts';

initAnalytics();
trackPageView();

createRoot(document.getElementById('root')!).render(<App />);
