import ReactPlayer from 'react-player';
import styleVideo from './videos.module.css';

const ShowVideos = () => {
    return (
        <div className={styleVideo.mainBlock}>
            <h2>Lectures</h2>
            <div className={styleVideo.positionVideo}>
                <ReactPlayer
                    url="<https://www.youtube.com/watch?v=As6UudRRwSI&t=29s>"
                    controls
                />
            </div>
        </div>
    );
};

export default ShowVideos;
