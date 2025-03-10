
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Force full width layout
document.documentElement.style.width = '100%';
document.documentElement.style.overflowX = 'hidden';
document.body.style.width = '100%';
document.body.style.overflowX = 'hidden';

createRoot(document.getElementById("root")!).render(<App />);
