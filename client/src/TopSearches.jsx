import { useEffect, useState } from 'react';


const TopSearches = () => {
  const [topSearches, setTopSearches] = useState([]);

  useEffect(() => {
  fetch('http://localhost:3000/unsplash/top-searches', {
    credentials: 'include'
  })
    .then((res) => res.json())
    .then((data) => {
      setTopSearches(data); 
    });
}, []);


  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Top 5 Search Terms</h2>
      <ul>
        {topSearches.length === 0 ? (
          <p>No top searches found.</p>
        ) : (
         
          topSearches.slice(0, 5).map((term, index) => (
            <li key={index} className="py-2">{term}</li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TopSearches;
