import React, { useEffect, useState } from 'react';
import UpdatesPanel from './UpdatesPanel';

const BASE_URL = 'http://anne-dev-flask.eba-staidi2z.us-east-1.elasticbeanstalk.com';

const Home = () => {
  const [extractedUpdates, setExtractedUpdates] = useState([]);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/updates`);
        if (!response.ok) {
          throw new Error('Failed to fetch updates');
        }
        const data = await response.json();
        setExtractedUpdates(data);
      } catch (error) {
        console.error('Error fetching updates:', error);
      }
    };

    fetchUpdates();
  }, []);

  return (
    <div className="home">
      {/* <h1>Welcome to Anne Bot</h1> */}
      <UpdatesPanel updates={extractedUpdates} />
    </div>
  );
};

export default Home;
