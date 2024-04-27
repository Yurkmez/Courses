import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AuthContext,
    IdAuthContext,
    NameAuthContext,
} from '../layouts/Context';
import Axios from 'axios';

import styleLogin from './login.module.css';

const Login = () => {
    const { setIsAuth } = useContext(AuthContext);
    const { setIdAuth } = useContext(IdAuthContext);
    const { setNameAuth } = useContext(NameAuthContext);

    const navigate = useNavigate();

    const [data, setData] = useState({
        email: '',
        password: '',
    });
    // Запрос на аутентификацию
    const handleSubmit = (e) => {
        e.preventDefault();
        Axios.post('http://localhost:5000/customer/login', {
            newEmail: data.email,
            newPassword: data.password,
        })
            .then(function (response) {
                if (response['data'] === 'Login successful!') {
                    // Если все в порядке -> ф-цию
                    welCome();
                } else if (response['data'] === 'Wrong password!') {
                    alert(response['data']);
                    setData({
                        ...data,
                        password: '',
                    });
                } else {
                    // This email was not found!
                    alert(response['data']);
                }
            })
            .catch(function (error) {
                alert(error);
            });
    };

    const welCome = () => {
        // запрос id и name пользователя
        Axios.get(`http://localhost:5000/customer/${data.email}`)
            .then(function (response) {
                localStorage.setItem('idAuth', response.data._id);
                setIsAuth(true);
                setIdAuth(response.data._id);
                setNameAuth(response.data.name);
                navigate('/', { replace: true });
            })
            .catch(function (error) {
                alert(error);
            });
    };

    const goToRegister = () => navigate('/register', { replace: true });

    return (
        <div className={styleLogin.inputWidth}>
            <h4>Login</h4>
            <form onSubmit={handleSubmit} class="formPadding">
                <div class="input-field">
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => {
                            setData({ ...data, email: e.target.value });
                        }}
                    />
                    <label for="email">Email</label>
                    <span class="helper-text" data-error="Input email"></span>
                </div>
                <div class="input-field">
                    <input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => {
                            setData({
                                ...data,
                                password: e.target.value,
                            });
                        }}
                    />
                    <label for="password">Password</label>
                    <span
                        class="helper-text"
                        data-error="Enter password"
                    ></span>
                </div>
                <button class="btn btn-primary" type="submit">
                    Login to account
                </button>
                <h6 className={styleLogin.foggotPass}>
                    <a href="/authadmin/reset">Foggot password?</a>
                </h6>
            </form>
            <hr />
            <div className={styleLogin.registered}>
                <h5>You are not registred?</h5>
                <form onSubmit={goToRegister} class="formPadding">
                    <button class="btn btn-primary" type="submit">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
