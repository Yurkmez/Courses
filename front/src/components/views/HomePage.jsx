import styleHome from './homePage.module.css';

const HomePage = () => {
    return (
        <>
            <div className={styleHome.mainBlock}>
                <h2>Author's courses on design</h2>
                <div>
                    <p>
                        The courses offered are prepared by renowned designers
                        in which they share their knowledge and experience.
                        These are excursions into the history of design, current
                        trends and tendencies, architecture, interior design,
                        product design and much more. Each course includes a
                        selection of videos on a given topic. The course
                        abstract provides brief information on the topic, format
                        and duration of the course. <hr />
                        <br />
                        To select and purchase a course, you must register,
                        after which these options will be available. Afterwards,
                        the purchased course will be available for viewing.
                    </p>
                </div>
                <div>
                    <h6 className={styleHome.footerBlock}>
                        Register (Sign in) to purchase the course .
                    </h6>
                </div>
            </div>
        </>
    );
};

export default HomePage;
