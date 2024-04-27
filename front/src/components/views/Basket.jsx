// import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Axios from 'axios';
import styleBasket from './basket.module.css';

const Basket = () => {
    const navigate = useNavigate();
    const [basket, setBasket] = useState([]);
    const idCustomer = localStorage.getItem('idAuth');

    const goToOrder = () => {
        navigate('/order', { replace: true });
    };

    // Получение курсов из корзины покупателя
    useEffect(() => {
        Axios.get(`http://localhost:5000/customer/basket/${idCustomer}`).then(
            (response) => {
                setBasket(response.data);
            }
        );
    }, []);

    // Удаление курса
    const handleDeleteCourse = async (e, id) => {
        e.preventDefault();
        await Axios.post(`http://localhost:5000/customer/remove/${id}`)
            .then(async () => {
                await Axios.get(
                    `http://localhost:5000/customer/basket/${idCustomer._id}`
                ).then((response) => {
                    setBasket(response.data);
                });
            })
            .catch(function (error) {
                alert(error);
            });
    };

    // Покупка курса
    const handleBuyCourse = async (e, id) => {
        e.preventDefault();
        await Axios.post(`http://localhost:5000/customer/order/${id}`)
            .then(setTimeout(() => goToOrder(), 500))
            .catch(function (error) {
                alert(error);
            });
    };

    if (basket.length == 0)
        return <h2 className={styleBasket.empty}>Basket is empty. </h2>;

    return (
        <div className={styleBasket.mainBlock}>
            <h2 className={styleBasket.courseName}>My Basket</h2>
            <table>
                <thead>
                    <tr className={styleBasket.textTr}>
                        <th className={styleBasket.col_1}>
                            <h3>Course</h3>
                        </th>
                        <th className={styleBasket.col_2}>
                            <h3>Annotation</h3>
                        </th>
                        <th className={styleBasket.col_3}>
                            <h3>Action</h3>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {basket.map((item) => {
                        return (
                            <>
                                <tr>
                                    <td>
                                        <div
                                            className={
                                                styleBasket.imagePosition
                                            }
                                        >
                                            <h4>{item.courseId.title}</h4>
                                            <img
                                                className={
                                                    styleBasket.imageSize
                                                }
                                                src={item.courseId.img}
                                                alt="pict"
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <h6>
                                            Author:{' '}
                                            {item.courseId.administratorId.name}
                                        </h6>
                                        <hr />
                                        <p>{item.courseId.annotation}</p>
                                        <hr />
                                        <h6>
                                            Price:{' '}
                                            {new Intl.NumberFormat('ru-RU', {
                                                style: 'currency',
                                                currency: 'rub',
                                                currencyDisplay: 'symbol',
                                            }).format(item.courseId.price)}
                                        </h6>
                                    </td>
                                    <td className={styleBasket.buttonBlock}>
                                        <div
                                            className={
                                                styleBasket.buttonLocation
                                            }
                                        >
                                            <button
                                                class="btn btn-primary"
                                                onClick={(e) =>
                                                    handleDeleteCourse(
                                                        e,
                                                        item._id
                                                    )
                                                }
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <div
                                            className={
                                                styleBasket.buttonLocation
                                            }
                                        >
                                            <button
                                                class="btn btn-primary"
                                                onClick={(e) =>
                                                    handleBuyCourse(e, item._id)
                                                }
                                            >
                                                Buy
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <hr />
                                    </td>
                                    <td>
                                        <hr />
                                    </td>
                                    <td>
                                        <hr />
                                    </td>
                                </tr>
                            </>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Basket;
