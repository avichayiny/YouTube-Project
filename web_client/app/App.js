import { BrowserRouter, Route, Routes, Router } from 'react-router-dom';
import './App.css';
import SignUpScreen from '../sign-up-screen/Sign-up-screen';
import { useState } from 'react';
import SignInScreen from '../sign-in-screen/sign-in-screen';
import VideosScreen from '../videosScreen/VideosScreen';
import VideoPage from '../videoPage/VideoPage';
import videosList from '../data/VideosList.json';
import UploadVideo from '../uploadVideos/UploadVideo';
import EditUser from '../editUser/EditUser';
import UserVideoList from '../user video list/UserVideoList';

function App() {
  const [userList, setUsers] = useState([])
  const [videoList, setVideo] = useState([]);
  const [user, setUser] = useState();
  const [token, setToken] = useState(null)
  console.log(userList)

  return (

    <div className="App">
      <BrowserRouter>

        <Routes>
          <Route path='/UserVideoList/:userName' element={<UserVideoList currentUser={user} setUser={setUser}/>} />
          <Route path='/sign_up' element={<SignUpScreen />} />
          <Route path='/EditUser' element={<EditUser currentUser={user} token= {token} setToken = {setToken} setUser={setUser}/>} />
          <Route path='/log-in' element={<SignInScreen userList={userList} currentUser={user} setUser={setUser} token= {token} setToken = {setToken}/>} />
          <Route path='/' element={<VideosScreen videosList={videoList} setVideos={setVideo} currentUser={user} setUser={setUser} token={token} setToken={setToken}/>}></Route>
          <Route path='/VideoPage/:id' element={<VideoPage videosList={videoList} setNewVideo={setVideo} currentUser={user} setUser={setUser}/>} />
          <Route path='/uploadVideo' element={<UploadVideo videoList={videoList} setVideo={setVideo} currentUser={user} setUser={setUser}/>} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
