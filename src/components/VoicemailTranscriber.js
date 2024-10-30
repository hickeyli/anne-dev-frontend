import React, { useState } from 'react';

const BASE_URL = 'http://anne-dev-flask.eba-staidi2z.us-east-1.elasticbeanstalk.com';

const VoicemailTranscriber = () => {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [extractedInfo, setExtractedInfo] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const allowedTypes = ['audio/flac', 'audio/m4a', 'audio/mp3', 'audio/mp4', 'audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/webm'];
    
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      alert('Please select a supported audio file format (flac, m4a, mp3, mp4, mpeg, ogg, wav, webm)');
      event.target.value = null; // Reset the file input
    }
  };

  const handleTranscribe = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${BASE_URL}/api/transcribe`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTranscript(data.text);
      setExtractedInfo(JSON.parse(data.extracted_info));
    } catch (error) {
      console.error('Error:', error);
      setTranscript('An error occurred during transcription.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <div className="voicemail-transcriber-container">
      <div className="voicemail-transcriber-content">
        <h2>Voicemail Transcriber</h2>
        <div className="input-button-container">
          <input type="file" onChange={handleFileChange} accept="audio/*" id="file-input" />
          <label htmlFor="file-input" className="file-input-label">
            {file ? file.name : 'Choose File'}
          </label>
          <button onClick={handleTranscribe} disabled={!file}>Transcribe</button>
        </div>
        {file && (
          <p className="file-selected">File selected: {file.name}</p>
        )}
        {transcript && (
          <div className="transcript">
            <h3>Transcript:</h3>
            <pre>{transcript}</pre>
            <button onClick={() => copyToClipboard(transcript)}>Copy Transcript</button>
          </div>
        )}
        {extractedInfo && (
          <div className="extracted-info">
            <h3>Extracted Information:</h3>
            {Object.entries(extractedInfo).map(([key, value]) => (
              <div key={key} className="info-item">
                <strong>{key}:</strong> 
                <input type="text" value={value || ''} readOnly />
                <button onClick={() => copyToClipboard(value)}>Copy</button>
              </div>
            ))}
            <button onClick={() => copyToClipboard(JSON.stringify(extractedInfo))}>
              Copy All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoicemailTranscriber;
