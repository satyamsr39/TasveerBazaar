import { useEffect, useState } from 'react';

const MyUploads = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

// const api_base=process.env.VITE_API_URL
const api_base = import.meta.env.VITE_API_URL;



  useEffect(() => {
    fetch(`${api_base}/upload/my-uploads`, {
      credentials: 'include'
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to fetch images');
        }
        return res.json();
      })
      .then(setImages)
      .catch(err => {
        console.error(err);
        setError(err.message);
        setImages([]);
      });
  }, []);

  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.length === 0 && <p>No uploads found.</p>}
      {images.map((img, i) => (
        <div key={i} className="relative">
          <img src={`api_base${img.url}`} alt="" className="w-full rounded shadow" />
          <a
            href={`api_base${img.url}`}
            download
            className="absolute top-2 right-2 bg-white text-sm px-2 py-1 rounded shadow"
          >
            ⬇️
          </a>
        </div>
      ))}
    </div>
  );
};

export default MyUploads;
