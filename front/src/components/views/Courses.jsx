// https://stackoverflow.com/questions/42173786/react-router-pass-data-when-navigating-programmatically
// Переход в другой компонент с передачей параметров
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import styleCourses from './courses.module.css';

const Courses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState();
    const [course, setCourse] = useState();

    useEffect(() => {
        async function fetchData() {
            console.log('Send?');
            Axios.get('http://localhost:5000/customer/courses/all')
                .then((response) => {
                    setCourses(response.data);
                    console.log(response.data);
                })
                .catch((error) => console.log(error));
        }
        fetchData();
    }, []);

    // Условие "if (course)" (см. ниже)  определяет переход только при наличии данных в "course",
    // иначе процесс запускается сразу, при начальном определении course в useState = null
    useEffect(() => {
        if (course) {
            navigate('course', {
                state: {
                    id: course._id,
                    img: course.img,
                    title: course.title,
                    price: course.price,
                    annotation: course.annotation,
                    description: course.description,
                    lecture: course.lecture,
                    administratorId: course.administratorId,
                },
            });
        }
    }, [course]);

    const handleGetSingleCourse = async (e, id) => {
        // e.preventDefault();
        await Axios.get(`http://localhost:5000/customer/course/${id}`)
            .then(function (response) {
                setCourse(response.data);
            })
            .catch(function (error) {
                alert(error);
            });
    };

    if (!courses)
        return (
            <>
                <p>No courses </p>;
            </>
        );
    return (
        <>
            <h2 className={styleCourses.head}>List of courses</h2>
            <div className={styleCourses.mainBlock}>
                {courses.map((item) => {
                    return (
                        <div className={styleCourses.setBlock} key={item._id}>
                            <h2>{item.title}</h2>
                            <img
                                className={styleCourses.imageSize}
                                src={item.img}
                                alt="pict"
                            />
                            <h4 className={styleCourses.marginPrice}>
                                Price:{' '}
                                {new Intl.NumberFormat('ru-RU', {
                                    style: 'currency',
                                    currency: 'rub',
                                    currencyDisplay: 'symbol',
                                }).format(item.price)}
                            </h4>
                            <p>{item.annotation}</p>
                            <Link
                                className={styleCourses.link}
                                onClick={(e) =>
                                    handleGetSingleCourse(e, item._id)
                                }
                            >
                                <strong>Open course</strong>
                            </Link>
                            <hr />
                            <hr />
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default Courses;
