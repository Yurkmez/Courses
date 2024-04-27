import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import styleOrder from './order.module.css';

const Order = () => {
    const navigate = useNavigate();
    const [order, setOrder] = useState([]);
    const idCustomer = localStorage.getItem('idAuth');

    // Получение курсов из order покупателя
    useEffect(() => {
        async function fetchData() {
            const response = await Axios.get(
                `http://localhost:5000/customer/order/${idCustomer}`
            );
            setOrder(response.data);
            console.log(response.data);
        }
        fetchData();
    }, []);

    const goToVideo = () => {
        navigate('/showvideo', { replace: true });
    };

    if (order.length == 0)
        return <h2 className={styleOrder.empty}>Order is empty. </h2>;

    return (
        <div className={styleOrder.mainBlock}>
            <h2 className={styleOrder.courseName}>My Order</h2>
            <table>
                <thead>
                    <tr className={styleOrder.textTr}>
                        <th className={styleOrder.col_1}>
                            <h3>Course</h3>
                        </th>
                        <th className={styleOrder.col_2}>
                            <h3>Annotation</h3>
                        </th>
                        <th className={styleOrder.col_3}>
                            <h3>Action</h3>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {order.map((item) => {
                        return (
                            <>
                                <tr>
                                    <td>
                                        <div
                                            className={styleOrder.imagePosition}
                                        >
                                            <h4>{item.courseId.title}</h4>
                                            <img
                                                className={styleOrder.imageSize}
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
                                    <td className={styleOrder.buttonBlock}>
                                        <div
                                            className={
                                                styleOrder.buttonLocation
                                            }
                                        >
                                            <button
                                                class="btn btn-primary"
                                                onClick={goToVideo}
                                            >
                                                View
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

export default Order;
