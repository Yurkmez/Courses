// https://materializecss.com/getting-started.html
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext, NameAuthContext } from '../layouts/Context';
import { FaUserGraduate } from 'react-icons/fa';

import styleNavbar from './navbar.module.css';

const Navbar = () => {
    const { isAuth } = useContext(AuthContext);
    const { nameAuth } = useContext(NameAuthContext);

    return (
        <div className={styleNavbar.mainDiv}>
            <p className={styleNavbar.subDiv}>
                <NavLink
                    style={({ isActive }) =>
                        isActive ? { color: 'lightgray' } : { color: 'white' }
                    }
                    to="/"
                    end
                >
                    Home
                </NavLink>
                <NavLink
                    style={({ isActive }) =>
                        isActive ? { color: 'lightgray' } : { color: 'white' }
                    }
                    to="courses"
                >
                    Courses
                </NavLink>
                {isAuth ? (
                    <div className={styleNavbar.subDiv2}>
                        <NavLink
                            style={({ isActive }) =>
                                isActive
                                    ? { color: 'lightgray' }
                                    : { color: 'white' }
                            }
                            to="basket"
                        >
                            Basket
                        </NavLink>
                        <NavLink
                            style={({ isActive }) =>
                                isActive
                                    ? { color: 'lightgray' }
                                    : { color: 'white' }
                            }
                            to="order"
                        >
                            Order
                        </NavLink>
                        <NavLink
                            style={({ isActive }) =>
                                isActive
                                    ? { color: 'lightgray' }
                                    : { color: 'white' }
                            }
                            to="logout"
                        >
                            Sign out
                        </NavLink>
                        <div className={styleNavbar.iconStile}>
                            <FaUserGraduate />
                            <p>{nameAuth}</p>
                        </div>
                    </div>
                ) : (
                    <NavLink
                        style={({ isActive }) =>
                            isActive
                                ? { color: 'lightgray' }
                                : { color: 'white' }
                        }
                        to="login"
                    >
                        Sign in
                    </NavLink>
                )}
            </p>
        </div>
    );
};

export default Navbar;
