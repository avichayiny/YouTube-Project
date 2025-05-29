import './LeftMenu.css';
import { Link, useNavigate } from 'react-router-dom';

function LeftMenu({currentUser, setUser}) {
    const change = () => {
        if(currentUser) {
            sessionStorage.removeItem('token')
            setUser(null);
        }
    }
    
    return (
        <div className="left-menu">
            <div className="col left-menu">
                <div className="btn-group-vertical w-100" role="group" aria-label="Vertical button group">
                <Link className="goto" to={`/`}>
                    <button className="btn btn-light btn-icon">
                        <i className="bi bi-house"></i>
                        Home
                    </button>
                    </Link>
                    <Link className="goto" to={`/log-in`}>
                    <button id ="log-in" className="btn btn-light btn-icon" onClick={change}>
                        <i className="bi bi-door-open"></i>
                        {currentUser ? 'Log Out': 'Log In'}
                    </button>
                    </Link>
                    <Link className="goto" to={currentUser ? `/uploadVideo` : `/log-in`}>
                    <button className="btn btn-light btn-icon">
                        <i className="bi bi-upload"></i>
                        add video
                    </button>
                    </Link>
                    <Link className='goto' to={currentUser ?`/UserVideoList/${currentUser.userName}` : `/log-in`}>
                    <button className="btn btn-light btn-icon">
                        <i className="bi bi-collection-play"></i>
                        My videos
                    </button>
                    </Link>
                    <button className="btn btn-light btn-icon">
                        <i className="bi bi-camera-video"></i>
                        Shorts
                    </button>
                    <button className="btn btn-light btn-icon">
                        <i className="bi bi-clock-history"></i>
                        History
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LeftMenu;