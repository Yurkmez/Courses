import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import styleRegister from './register.module.css';

const Register = () => {
    const navigate = useNavigate();

    const [data, setData] = useState({
        email: '',
        password: '',
        confirm: '',
        name: '',
    });

    const handleSubmit = (e) => {
        if (data.password !== data.confirm) {
            return alert('Password mismatch!');
        }
        e.preventDefault();
        Axios.post('http://localhost:5000/customer/register', {
            newEmail: data.email,
            newName: data.name,
            newPassword: data.password,
        })
            .then(function (response) {
                alert(response['data']);
                goToLogin();
            })
            .catch(function (error) {
                alert(error);
            });
    };

    const goToLogin = () => navigate('/login', { replace: true });

    return (
        <div className={styleRegister.inputWidth}>
            <h4>Registration</h4>
            <form onSubmit={handleSubmit} class="formPadding" novalidate>
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
                <div class="input-field">
                    <input
                        id="confirm"
                        type="password"
                        value={data.confirm}
                        // class="validate"
                        onChange={(e) => {
                            setData({
                                ...data,
                                confirm: e.target.value,
                            });
                        }}
                        required
                    />
                    <label for="confirm">Confirm password</label>
                    <span
                        class="helper-text"
                        data-error="Repeat password"
                    ></span>
                </div>
                <div class="input-field">
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        // class="validate"
                        onChange={(e) => {
                            setData({ ...data, name: e.target.value });
                        }}
                        required
                    />
                    <label for="name">You name</label>
                    <span
                        class="helper-text"
                        data-error="Enter you name"
                    ></span>
                </div>
                <button class="btn btn-primary" type="submit">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
