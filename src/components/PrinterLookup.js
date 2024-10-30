import React, { useState, useEffect, useCallback } from 'react';

const BASE_URL = 'http://anne-dev-flask.eba-staidi2z.us-east-1.elasticbeanstalk.com';

const PrinterLookup = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [printerInfo, setPrinterInfo] = useState(null);
  const [allRooms, setAllRooms] = useState([]);
  const [error, setError] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null); // State to track copied key

  useEffect(() => {
    // Fetch all room names when the component mounts
    const fetchRooms = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/printer-rooms`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          const validRooms = data
            .filter(item => item.Room != null)
            .map(item => ({
              room: String(item.Room),
              brand: item.Brand ? String(item.Brand) : 'Unknown'
            }));
          setAllRooms(validRooms);
        } else {
          setError('Received invalid data for rooms');
        }
      } catch (error) {
        console.error('Error fetching room names:', error);
        setError('Failed to fetch room names');
      }
    };
    fetchRooms();
  }, []);

  const updateSearchTerm = useCallback((term) => {
    setSearchTerm(term);
    if (term && Array.isArray(allRooms)) {
      const filteredSuggestions = allRooms.filter(item =>
        item.room.toLowerCase().includes(term.toLowerCase())
      );
      setSuggestions(filteredSuggestions.slice(0, 5)); // Limit to 5 suggestions
    } else {
      setSuggestions([]);
    }
  }, [allRooms]);

  const fetchPrinterInfo = async (room) => {
    try {
      const response = await fetch(`${BASE_URL}/api/printer-info?room=${encodeURIComponent(room)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPrinterInfo(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching printer info:', error);
      setPrinterInfo(null);
      setError('Failed to fetch printer information');
    }
  };

  const handleSuggestionClick = useCallback((room) => {
    updateSearchTerm(room);
    setSuggestions([]); // Clear suggestions after selection
    fetchPrinterInfo(room); // Fetch printer info immediately
  }, [updateSearchTerm]);

  const handleCopy = (key, text) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard:', text);
      setCopiedKey(key); // Set the copied key
      setTimeout(() => setCopiedKey(null), 2000); // Clear the copied key after 2 seconds
    }).catch(err => {
      console.error('Failed to copy text:', err);
    });
  };

  return (
    <div className="printer-lookup">
      <h2>Printer Lookup</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => updateSearchTerm(e.target.value)}
          placeholder="Enter room name"
        />
      </div>
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((item, index) => (
            <li key={index} onClick={() => handleSuggestionClick(item.room)}>
              <span className="room">{item.room}</span>
              <span className="brand">{item.brand}</span>
            </li>
          ))}
        </ul>
      )}
      {printerInfo && (
        <div className="printer-info">
          <h3>Printer Information</h3>
          <table>
            <tbody>
              {Object.entries(printerInfo).map(([key, value]) => (
                <tr key={key}>
                  <td onClick={() => handleCopy(key, value != null ? String(value) : '')}>
                    {key}
                  </td>
                  <td onClick={() => handleCopy(key, value != null ? String(value) : '')}>
                    {value != null ? String(value) : ''}
                    {copiedKey === key && <span className="copied-tooltip">Copied!</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PrinterLookup;
