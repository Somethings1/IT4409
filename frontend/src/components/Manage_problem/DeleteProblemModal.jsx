import React, { useState } from 'react';
import "./Form_delete.css";
import { notify } from '../Notification/notification.jsx';

const DeleteProblemModal = ({ problem, onDelete, onClose }) => {
  const [reason, setReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!reason.trim()) {
      notify(2, 'Please enter a deletion reason', 'Error');
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(problem.id, reason);
      notify(1, `Problem "${problem.title}" deleted successfully`, 'Success');
      onClose();
    } catch (error) {
      console.error("Error deleting problem:", error);
      notify(2, `Failed to delete problem "${problem.title}"`, 'Error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-content">
        <h2>Confirm Problem Deletion</h2>
        <div className="problem-info">
          <p><strong>Title:</strong> {problem.title}</p>
          <p><strong>Difficulty:</strong> 
            <span className={`difficulty-badge ${problem.difficulty_name.toLowerCase()}`}>
              {problem.difficulty_name}
            </span>
          </p>
          {problem.tags && problem.tags.length > 0 && (
            <p><strong>Tags:</strong> {problem.tags.map(tag => tag.tag_name).join(', ')}</p>
          )}
        </div>

        <p className="warning-message">
          This action cannot be undone. All test cases and submissions related to this problem will also be deleted.
        </p>

        <div className="delete-input-group">
          <label htmlFor="reason">Deletion Reason *</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why this problem needs to be deleted..."
            rows={3}
            required
          />
        </div>

        <div className="delete-actions">
          <button 
            className="delete-btn delete-btn-confirm" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Confirm Delete'}
          </button>
          <button 
            className="delete-btn delete-btn-cancel" 
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProblemModal;