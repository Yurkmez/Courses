import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../layouts/Context';
import { useContext } from 'react';

import Axios from 'axios';

import styleCourse from './course.module.css';

const Course = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuth } = useContext(AuthContext);

    const goToBasket = () => {
        navigate('/basket', { replace: true });
    };
    // Добавление курса в корзину
    const handleBasket = async (e) => {
        e.preventDefault();
        const idCustomer = localStorage.getItem('idAuth');
        console.log(idCustomer);
        console.log(location.state.id);
        await Axios.post('http://localhost:5000/customer/basket', {
            idCourse: location.state.id,
            idCustomer: idCustomer,
            administratorId: location.state.administratorId,
        })
            .then(function (response) {
                if (response['data'] === 'Course added to basket!') {
                    setTimeout(() => goToBasket(), 500);
                } else if (
                    response['data'] ===
                    'This course is already exists in your basket/order!'
                ) {
                    alert(
                        'This course is already exists in your basket/order!'
                    );
                } else {
                    alert('Something was wrong... Try again');
                }
            })
            .catch(function (error) {
                alert(error);
            });
    };

    return (
        <>
            <div className={styleCourse.twoRow}>
                <div className={styleCourse.rowCourse}>
                    <h2 className={styleCourse.courseName}>
                        Course "{location.state.title}"
                    </h2>
                    <h2>Id {location.state._id}</h2>
                    <img
                        className={styleCourse.sizeImageCourse}
                        src={location.state.img}
                        alt="Pict"
                    />
                    <h4 className={styleCourse.price}>
                        Price:{' '}
                        {new Intl.NumberFormat('ru-RU', {
                            style: 'currency',
                            currency: 'rub',
                            currencyDisplay: 'symbol',
                        }).format(location.state.price)}
                    </h4>
                    <p>{location.state.annotation}</p>
                    <p>{location.state.description}</p>
                    {isAuth ? (
                        <Link
                            className={styleCourse.link}
                            onClick={(e) => handleBasket(e)}
                        >
                            <strong>Add to basket</strong>
                        </Link>
                    ) : (
                        <>
                            <hr />
                            <p className={styleCourse.notLink}>
                                {' '}
                                <strong>
                                    To order a course, sign in or register
                                </strong>
                            </p>
                            <hr />
                        </>
                    )}
                </div>
                <div className={styleCourse.rowLecture}>
                    <h3>Lectures</h3>
                    {location.state.lecture.items.length ? (
                        location.state.lecture.items.map((item) => {
                            return (
                                <div>
                                    <img
                                        className={styleCourse.imgLecture}
                                        src={item.img}
                                    />
                                    <p className={styleCourse.titleLectures}>
                                        <strong>{item.title}</strong>
                                    </p>
                                </div>
                            );
                        })
                    ) : (
                        <p>No lectures.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Course;
