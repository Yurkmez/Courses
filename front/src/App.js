import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import MainLayout from './components/layouts/MainLayout';
import {
    AuthContext,
    IdAuthContext,
    NameAuthContext,
} from './components/layouts/Context';
import HomePage from './components/views/HomePage';
import Courses from './components/views/Courses';
import Course from './components/views/Course';
import Basket from './components/views/Basket';
import Order from './components/views/Order';
import ShowVideos from './components/views/ShowVideos';
import Login from './components/views/Login';
import Logout from './components/views/Logout';
import Register from './components/views/Register';
import NotFound from './components/views/NotFound';
import './App.css';
// import PrivateRoute from './components/layouts/PrivatRout';

function App() {
    const [isAuth, setIsAuth] = useState(false);
    const [idAuth, setIdAuth] = useState();
    const [nameAuth, setNameAuth] = useState('');

    return (
        <BrowserRouter>
            <AuthContext.Provider value={{ isAuth, setIsAuth }}>
                <IdAuthContext.Provider value={{ idAuth, setIdAuth }}>
                    <NameAuthContext.Provider value={{ nameAuth, setNameAuth }}>
                        <div className="App">
                            <Routes>
                                <Route path="/" element={<MainLayout />}>
                                    <Route
                                        index={true}
                                        element={<HomePage />}
                                    />
                                    <Route
                                        path="courses"
                                        element={<Courses />}
                                    />
                                    <Route
                                        path="courses/course"
                                        element={<Course />}
                                    />
                                    <Route
                                        path="register"
                                        element={<Register />}
                                    />
                                    <Route path="login" element={<Login />} />
                                    <Route path="basket" element={<Basket />} />
                                    <Route path="order" element={<Order />} />
                                    <Route
                                        path="showvideo"
                                        element={<ShowVideos />}
                                    />
                                    <Route path="logout" element={<Logout />} />
                                    <Route path="*" element={<NotFound />} />
                                </Route>
                            </Routes>
                        </div>
                    </NameAuthContext.Provider>
                </IdAuthContext.Provider>
            </AuthContext.Provider>
        </BrowserRouter>
    );
}

export default App;
