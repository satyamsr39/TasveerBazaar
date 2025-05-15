import { useEffect, useState } from 'react';

const History = () => {
  const [history, setHistory] = useState([]);
  
  useEffect(() => {
    // Fetch the user's search history from the backend
    fetch('http://localhost:3000/unsplash/history', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(setHistory)
      .catch(err => {
        console.error("Error fetching history:", err);
      });
  }, []);
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Search History</h2>
      <ul>
        {history.length === 0 ? (
          <p>No search history found.</p>
        ) : (
          history.map((term, index) => (
            <li key={index} className="py-2">{term}</li>
          ))
        )}
      </ul>
    </div>
  );
};

export default History;
