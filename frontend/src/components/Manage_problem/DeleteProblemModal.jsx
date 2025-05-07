import React, { useState } from 'react';
import { useAuth } from "../introduce/useAuth.jsx"; // Import useAuth hook
import { useLoading } from "../introduce/Loading.jsx"; // Import useLoading hook
import "./Form_delete.css";
import { notify } from '../Notification/notification.jsx';

const DeleteProblemModal = ({ problem, onDelete, onClose }) => {
  // Extract startLoading and stopLoading from useLoading hook
  const { startLoading, stopLoading } = useLoading();
  // Extract user from useAuth hook
  const { user } = useAuth();

  const [reason, setReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!reason.trim()) {
      notify(2, 'Please enter a deletion reason', 'Error');
      return;
    }

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        notify(2, 'No access token found', 'Error');
        return;
      }

      startLoading(); // Start loading spinner or indicator

      // Xóa vấn đề thông qua API
      const response = await fetch(`http://localhost:8080/api/v1/problems/${problem.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Gửi token trong header
        },
        body: JSON.stringify({ reason }),  // Gửi lý do xóa
      });

      if (!response.ok) {
        throw new Error(`Failed to delete problem: ${response.statusText}`);
      }

      // Thông báo và đóng modal khi xóa thành công
      notify(1, `Problem "${problem.title}" deleted successfully`, 'Success');
      onClose();
    } catch (error) {
      console.error("Error deleting problem:", error);
      notify(2, `Failed to delete problem "${problem.title}"`, 'Error');
    } finally {
      setIsDeleting(false);
      stopLoading(); // Stop loading indicator after completion
    }
  };

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-content">
        <h2>Confirm Problem Deletion</h2>
        <div className="problem-info">
          <p><strong>Title:</strong> {problem.title}</p>
          <p><strong>Difficulty:</strong> 
            <span className={`difficulty-badge ${problem?.difficulty?.toLowerCase?.() || "default"}`}>
              {problem.difficulty}
            </span>
          </p>
          {problem.tags && problem.tags.length > 0 && (
            <p><strong>Tags:</strong> {problem.tags.join(', ')}</p>
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
