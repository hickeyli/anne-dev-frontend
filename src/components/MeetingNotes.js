import React, { useState, useEffect } from 'react';
import './MeetingNotes.css'; // We'll create this CSS file for styling

const BASE_URL = 'http://anne-dev-flask.eba-staidi2z.us-east-1.elasticbeanstalk.com';

const MeetingNotes = ({ onUpdateExtracted }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/meeting-notes`);
      if (!response.ok) {
        throw new Error('Failed to fetch meeting notes');
      }
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching meeting notes:', error);
      setError('Failed to fetch meeting notes');
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${BASE_URL}/api/upload-meeting-notes`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload and process the file');
      }

      const result = await response.json();
      console.log('Upload response:', result);
      
      if (result.extracted_info && Array.isArray(result.extracted_info.updates)) {
        onUpdateExtracted(result.extracted_info.updates);
      } else {
        console.error('Unexpected response format:', result);
        setError('Received unexpected data format from server');
      }
      setFile(null);
      fetchNotes();
    } catch (error) {
      console.error('Error uploading meeting notes:', error);
      setError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="meeting-notes-container">
      <div className="meeting-notes-sidebar">
        <h3>Uploaded Notes</h3>
        <div className="notes-list">
          {notes.map((note, index) => (
            <div 
              key={index} 
              className={`note-item ${selectedNote === note ? 'selected' : ''}`} 
              onClick={() => setSelectedNote(note)}
            >
              {note}
            </div>
          ))}
        </div>
      </div>
      <div className="meeting-notes-content">
        <h2>Meeting Notes</h2>
        <div className="upload-section">
          <input 
            type="file" 
            accept=".pdf" 
            onChange={handleFileChange} 
            id="file-input" 
            className="file-input"
          />
          <label htmlFor="file-input" className="file-input-label">
            {file ? file.name : 'Choose File'}
          </label>
          <button 
            onClick={handleUpload} 
            disabled={!file || isLoading}
            className="upload-button"
          >
            {isLoading ? 'Processing...' : 'Upload and Process'}
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
        
        {selectedNote && (
          <div className="note-content">
            <h4>{selectedNote}</h4>
            <iframe
              src={`${BASE_URL}/api/meeting-notes/${selectedNote}`}
              width="100%"
              height="600px"
              style={{border: 'none'}}
              title="Meeting Note PDF"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingNotes;
