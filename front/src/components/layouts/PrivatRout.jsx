import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../layouts/Context';

const PrivatRout = () => {
    const isAuth = useContext(AuthContext);
    if (isAuth === true) {
        return (
            <div>
                <Outlet />
            </div>
        );
    }
};

export default PrivatRout;
