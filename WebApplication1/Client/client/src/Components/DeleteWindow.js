// DeleteWindow.js
import React from 'react';

const DeleteWindow = ({ isOpen, onClose, onDelete, userId }) => {
  if (!isOpen) return null;

  return (
    <div className="delete-window-overlay">
      <div className="delete-window">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this user?</p>
        <div className="delete-window-buttons">
          <button onClick={() => onDelete(userId)}>Yes, Delete</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteWindow;
