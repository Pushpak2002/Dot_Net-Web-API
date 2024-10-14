import React from 'react';

const DeleteWindow = ({ isOpen, onClose, onDelete, userId }) => {
  if (!isOpen) return null;

  return (
    <div className="delete-window-overlay">
      <div className="delete-window">
        <img className="delete-img" src={require("../assets/delete_mark.jpg")}
                  alt="delete image"/>
        <h2>Are You Sure?</h2>
        <p>You won't be able to revert this!</p>
        <div className="delete-window-buttons">
          <button className="yes" onClick={() => onDelete(userId)} >Yes, Delete!</button>
          <button className="cancel" onClick={onClose} >Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteWindow;
