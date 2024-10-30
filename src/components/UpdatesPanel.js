import React from 'react';

const UpdatesPanel = ({ updates }) => {
  return (
    <div className="updates-panel">
      <h2>Important Updates and Dates</h2>
      {updates.length > 0 ? (
        <ul>
          {updates.map((update, index) => (
            <li key={index}>
              <strong>{update.date || 'No date'}</strong>: {update.description || 'No description'}
            </li>
          ))}
        </ul>
      ) : (
        <p>No updates available. Upload meeting notes to see updates.</p>
      )}
    </div>
  );
};

export default UpdatesPanel;
