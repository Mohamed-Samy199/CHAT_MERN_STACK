import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import './index.scss'
import { ChatContextProvider } from './context/ChatContext/chat.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <ChatContextProvider>
        <App />
    </ChatContextProvider>
);