import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const timeoutRef = useRef(null);

const api_base=NEXT_PUBLIC_API_URL

  useEffect(() => {
    fetch(`${api_base}/auth/me`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(userData => setUser(userData))
      .catch((err) => console.log('Error fetching user:', err));
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    if (isUploading) return; // ⛔ Don't close dropdown during upload
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 1000);
  };

  const handleLogout = () => {
    if (user) {
      window.location.href = `${api_base}/auth/logout`;
    }
  };

  const handleFileChange = (e) => {
    setUploadFile(e.target.files[0]);
    setUploadStatus('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadStatus('Please select a file first');
      return;
    }

    setIsUploading(true);
    setUploadStatus('Uploading...');

    const formData = new FormData();
    formData.append('image', uploadFile);

    try {
      const res = await fetch(`${api_base}/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (res.ok) {
        setUploadStatus('Upload successful! 🎉');
        setUploadFile(null);
      } else {
        setUploadStatus('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('Upload error');
    }

    setIsUploading(false);
  };

  return (
    <div className='bg-gray-700 w-full p-4 flex justify-between items-center'>
      <div className='font-bold text-3xl font-serif text-white'><div className="flex gap-2"><div className="h-12 w-16"><img src='./logo.png' className=" rounded-lg"/></div><div>TasveerBazaar</div></div></div>

      <div className="flex gap-4 items-center">
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button className="bg-gray-100 p-2 rounded flex items-center gap-2">
            <div className="flex items-center gap-2">🧑‍💼 {user?.email}</div>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <ul className="absolute z-10 bg-gray-200 text-gray-900 rounded shadow-md mt-2 w-72 right-0 p-4 space-y-3">

              <li>
                <Link to="/Home" className="block px-4 py-2 hover:bg-gray-100 rounded">🏠 Home</Link>
              </li>
              <li>
                <Link to="/TopSearches" className="block px-4 py-2 hover:bg-gray-100 rounded">🔍 Top Searches</Link>
              </li>
              <li>
                <Link to="/History" className="block px-4 py-2 hover:bg-gray-100 rounded">📜 History</Link>
              </li>

              <li onClick={handleLogout} className="cursor-pointer block px-4 py-2 hover:bg-red-600 rounded text-red-700 font-semibold">
                Logout
              </li>

              <li>
                <form onSubmit={handleUpload} className="flex flex-col gap-2">
                  <label className="font-semibold">Upload Your Creation:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="p-1 rounded border"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white rounded py-1 hover:bg-blue-700 transition"
                  >
                    Upload
                  </button>
                  {uploadStatus && (
                    <p className="text-sm text-gray-700">{uploadStatus}</p>
                  )}
                </form>
              </li>

              <li>
                <Link to="/MyUploads" className="block px-4 py-2 hover:bg-gray-100 rounded">📁 My Uploads</Link>
              </li>

            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
