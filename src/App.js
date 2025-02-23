import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import ChatRoom from './pages/ChatRoom/ChatRoom';
import Connections from './pages/Connections/Connections';


const App = () => {
    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/connections" element={<Connections />} />
                {/* Protected route */}
                <Route
                    path="/chat"
                    element={
                        <PrivateRoute>
                            <ChatRoom />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
