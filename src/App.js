import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './components/Home';
import VoicemailTranscriber from './components/VoicemailTranscriber';
import TicketDashboard from './components/TicketDashboard';
import MeetingNotes from './components/MeetingNotes';
import PrinterLookup from './components/PrinterLookup';
import './App.css';

function App() {
  const [extractedUpdates, setExtractedUpdates] = useState([]);

  const handleUpdateExtracted = (newUpdates) => {
    setExtractedUpdates(newUpdates);
  };

  return (
    <Router>
      <div id="outer-container">
        <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
        <main id="page-wrap">
          <Header />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home extractedUpdates={extractedUpdates} />} />
              <Route path="/voicemail" element={<VoicemailTranscriber />} />
              <Route path="/dashboard" element={<TicketDashboard />} />
              <Route path="/meeting-notes" element={<MeetingNotes onUpdateExtracted={handleUpdateExtracted} />} />
              <Route path="/printer-lookup" element={<PrinterLookup />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
