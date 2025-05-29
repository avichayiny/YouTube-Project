import './Profile.css';
import { useNavigate } from 'react-router-dom';
function Profile({ currentUser }) {
    const nickName = currentUser ? currentUser.nickName : 'guest';
    const img = currentUser ? currentUser.profilePicture : '../files for projects/deafult.jpg';
    console.log(img);
    const navigate = useNavigate();
    function editAndDeletePage(){
        if(currentUser){
            navigate('/EditUser');
        }
    }
    return (
        <div className='proflie'>
            <div className="profile-info">
                <img src={img} onClick={editAndDeletePage} style={{ cursor: 'pointer' }}></img>
                <span>{nickName}</span>
            </div>
        </div>

    );
}
export default Profile;