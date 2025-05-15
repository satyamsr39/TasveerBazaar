import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import MyUploads from './MyUploads';
import Home from './Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Update to use Routes
import TopSearches from './TopSearches'; // Import TopSearches component
import History from './History';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/auth/me', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(setUser);
  }, []);

  return (
    <Router>
      <>
        {user ? <Navbar user={user} />  :
      (
        <div className='flex min-h-screen justify-center items-center'>
            <div className='flex-row bg-gray-300 shadow-2xl  rounded p-4 md:p-8'>
              <div className='text-center font-bold font-serif text-5xl p-2 flex justify-center items-center gap-2'><img src='./logo.png' className='h-24 w-32'/>Tasveerbazar</div>
              <h1 className='font-bold text-2xl m-4 text-center'>Login to Continue...</h1>
              <div className='text-center space-y-2 p-4'>
                <a href="http://localhost:3000/auth/google" className='hover:bg-gray-100 font-serif border-2 flex pointer-cursor rounded justify-center items-center p-2 border-black'>
                  <button>Login with Google</button>
                </a>
                <a href="http://localhost:3000/auth/facebook" className='hover:bg-gray-100 font-serif border-2 flex pointer-cursor rounded justify-center items-center p-2 border-black'>
                  <button>Login with Facebook</button>
                </a>
                <a href="http://localhost:3000/auth/github" className='hover:bg-gray-100 font-serif border-2 flex pointer-cursor rounded justify-center items-center p-2 border-black'>
                  <button>Login with GitHub</button>
                </a>
              </div>
            </div>
            </div>
      )}
      

        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/MyUploads" element={<MyUploads />} />
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/TopSearches" element={<TopSearches />} /> 
          <Route path="/History" element={<History />} /> 
        </Routes>
      </>
    </Router>
  );
}

export default App;
