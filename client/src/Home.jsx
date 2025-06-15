

import { useEffect, useState } from "react";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

const Home = () => {
  const [input, setInput] = useState('');
  const [images, setImages] = useState([]);
  const debouncedInput = useDebounce(input, 500); 
const api_base=process.env.VITE_API_URL

  useEffect(() => {
    const fetchImages = async () => {
      const res = await fetch(`${api_base}/unsplash/images`, {
        credentials: 'include'
      });
      const data = await res.json();
      setImages(data || []);
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (!debouncedInput) return;

    const fetchImages = async () => {
      try {
        const res = await fetch(`${api_base}/unsplash/images?query=${debouncedInput}`, {
          credentials: 'include'
        });
        const data = await res.json();
        setImages(data || []);
      } catch (err) {
        console.error("Debounced fetch error:", err);
      }
    };

    fetchImages();
  }, [debouncedInput]);

  const handleClick = async () => {
    if (!input) return;
    const res = await fetch(`${api_base}/unsplash/images?query=${input}`, {
      credentials: 'include'
    });
    const data = await res.json();
    setImages(data || []);
  };

  return (
    <div className="p-4 min-h-screen bg-gray-900">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleClick(); 
            }
          }}
          placeholder="Search Image..."
          className="w-full p-2 rounded-xl border bg-gray-50"
        />
        <button
          className="bg-gray-200 px-4 rounded p-2 hover:bg-gradient-to-r from-gray-100 to-gray-500"
          onClick={handleClick}
        >
          Submit
        </button>
      </div>

      {input && (
        <div className="text-white mb-2">
          You searched for "<span className="font-semibold">{input}</span>" — {images.length} result{images.length !== 1 ? 's' : ''} found
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-black/80 p-4 rounded-xl">
        {images.length === 0 ? (
          <p className="text-gray-400 col-span-full text-center">No images found.</p>
        ) : (
          images.map((img, i) => (
            <div key={i} className="relative group flex justify-center">
              <img
                src={img.url}
                alt={img.alt || 'Image'}
                className="w-full h-auto rounded shadow"
              />
              <a
                href={img.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-2 right-2  p-2 rounded-full shadow hover:bg-gray-900 hidden group-hover:block"
                title="Download image"
              >
                <svg class="w-10 h-10 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path fill-rule="evenodd" d="M13 11.15V4a1 1 0 1 0-2 0v7.15L8.78 8.374a1 1 0 1 0-1.56 1.25l4 5a1 1 0 0 0 1.56 0l4-5a1 1 0 1 0-1.56-1.25L13 11.15Z" clip-rule="evenodd"/>
  <path fill-rule="evenodd" d="M9.657 15.874 7.358 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.358l-2.3 2.874a3 3 0 0 1-4.685 0ZM17 16a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z" clip-rule="evenodd"/>
</svg>

              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;

