import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App'
import AuthProvider from './context/AuthContext';
import './globals.css'
import QueryProvider from './lib/react-query/QueryProvider';
import { ThemeProvider } from './components/shared/ThemeProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(

    <BrowserRouter> <QueryProvider><ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <AuthProvider><App /></AuthProvider></ThemeProvider></QueryProvider></BrowserRouter>

);
