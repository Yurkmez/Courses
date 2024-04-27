// npm i react-icons
import { BsTelephoneFill } from 'react-icons/bs';
import { FaWhatsappSquare } from 'react-icons/fa';
import { AiOutlineMail } from 'react-icons/ai';

import styleFooter from './footer.module.css';

const Footer = () => {
    return (
        <>
            <div className={styleFooter.mainBlockFooter}>
                <div className={styleFooter.contactFlexExt}>
                    <p>Contact ...</p>
                    <p>Consultation ...</p>
                    <p>Technical support ...</p>
                    <p>Course authors ...</p>
                </div>
                <div className={styleFooter.contactFlexExt}>
                    <div className={styleFooter.contactFlexIner}>
                        <BsTelephoneFill className={styleFooter.icons} />
                        <p>+xx xxx xxx xx xx</p>
                    </div>
                    <div className={styleFooter.contactFlexIner}>
                        <FaWhatsappSquare className={styleFooter.icons} />
                        <p>+xx xxx xxx xx xx</p>
                    </div>
                    <div className={styleFooter.contactFlexIner}>
                        <AiOutlineMail className={styleFooter.icons} />
                        <p>xxxxxxx@xxxx.xxx</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Footer;
