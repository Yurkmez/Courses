import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, IdAuthContext } from '../layouts/Context';

const Logout = () => {
    const navigate = useNavigate();
    const { isAuth, setIsAuth } = useContext(AuthContext);
    const { setIdAuth } = useContext(IdAuthContext);

    useEffect(() => {
        const goToMainPage = () => navigate('/', { replace: true });
        setIsAuth(false);
        setIdAuth('');
        localStorage.setItem('idAuth', '');
        setTimeout(() => goToMainPage(), 200);
    }, []);
    // return <div></div>;
};

export default Logout;
