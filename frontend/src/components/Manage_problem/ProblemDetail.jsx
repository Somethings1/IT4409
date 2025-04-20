import React, { useState, useEffect } from "react";
import { useLoading } from "../introduce/Loading.jsx";
import { useAuth } from "../introduce/useAuth.jsx";
import { notify } from '../Notification/notification.jsx';
import "../Manage_problem/ProblemDetail.css";

const ProblemDetail = ({ problem, onClose, onUpdate }) => {
  const { startLoading, stopLoading } = useLoading();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...problem });
  const [difficulties, setDifficulties] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [newTestCase, setNewTestCase] = useState({ input: '', expected_output: '', is_hidden: false });
  const [changeDetails, setChangeDetails] = useState("");

  // Fetch additional data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      startLoading();
      try {
        // Fetch difficulties
        const diffResponse = await fetch('http://localhost:8080/problems/difficulties');
        const diffData = await diffResponse.json();
        setDifficulties(diffData);

        // Fetch tags
        const tagsResponse = await fetch('http://localhost:8080/problems/tags');
        const tagsData = await tagsResponse.json();
        setTags(tagsData);

        // Fetch test cases for this problem
        const testCasesResponse = await fetch(`http://localhost:8080/problems/${problem.id}/testcases`);
        const testCasesData = await testCasesResponse.json();
        setTestCases(testCasesData);

        // Set selected tags
        if (problem.tags) {
          setSelectedTags(problem.tags.map(tag => tag.id));
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        notify(2, "Failed to load problem details", "Error");
      } finally {
        stopLoading();
      }
    };

    fetchData();
  }, [problem.id]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditData({ ...problem });
      setSelectedTags(problem.tags ? problem.tags.map(tag => tag.id) : []);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId) 
        : [...prev, tagId]
    );
  };

  const handleTestCaseChange = (e, index) => {
    const { name, value, type, checked } = e.target;
    const updatedTestCases = [...testCases];
    
    if (index !== undefined) {
      updatedTestCases[index] = { 
        ...updatedTestCases[index], 
        [name]: type === 'checkbox' ? checked : value 
      };
      setTestCases(updatedTestCases);
    } else {
      setNewTestCase(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      }));
    }
  };

  const addTestCase = () => {
    if (newTestCase.input && newTestCase.expected_output) {
      setTestCases(prev => [...prev, newTestCase]);
      setNewTestCase({ input: '', expected_output: '', is_hidden: false });
    }
  };

  const removeTestCase = (index) => {
    setTestCases(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!editData.title || !editData.description || !editData.difficulty_id) {
      notify(2, "Title, description and difficulty are required", "Error");
      return;
    }

    const updatedProblem = {
      ...editData,
      tags: selectedTags,
      test_cases: testCases,
      change_details: changeDetails
    };

    try {
      startLoading();
      const response = await fetch(`http://localhost:8080/problems/${problem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProblem),
      });

      if (!response.ok) throw new Error("Update failed");

      const data = await response.json();
      notify(1, "Problem updated successfully", "Success");
      onUpdate(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating problem:", error);
      notify(2, "Failed to update problem", "Error");
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="problem-detail-overlay">
      <div className="problem-detail-container">
        <span className="close-button" onClick={onClose}>&times;</span>
        
        {!isEditing ? (
          <div className="problem-view">
            <div className="problem-header">
              <h2>{problem.title}</h2>
              <span className={`difficulty-badge ${problem.difficulty_name.toLowerCase()}`}>
                {problem.difficulty_name}
              </span>
            </div>

            <div className="problem-tags">
              {problem.tags && problem.tags.map(tag => (
                <span key={tag.id} className="tag">{tag.tag_name}</span>
              ))}
            </div>

            <div className="problem-description">
              <h3>Description</h3>
              <pre>{problem.description}</pre>
            </div>

            {user && user.role === 'admin' && (
              <button className="edit-button" onClick={handleEditToggle}>
                Edit Problem
              </button>
            )}
          </div>
        ) : (
          <div className="problem-edit-form">
            <h2>Edit Problem</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={editData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={editData.description}
                  onChange={handleInputChange}
                  required
                  rows={10}
                />
              </div>

              <div className="form-group">
                <label>Difficulty *</label>
                <select
                  name="difficulty_id"
                  value={editData.difficulty_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Difficulty</option>
                  {difficulties.map(diff => (
                    <option key={diff.id} value={diff.id}>{diff.difficulty_name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tags</label>
                <div className="tags-container">
                  {tags.map(tag => (
                    <div 
                      key={tag.id}
                      className={`tag-selector ${selectedTags.includes(tag.id) ? 'selected' : ''}`}
                      onClick={() => handleTagToggle(tag.id)}
                    >
                      {tag.tag_name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Test Cases</label>
                <div className="test-cases-container">
                  {testCases.map((testCase, index) => (
                    <div key={index} className="test-case">
                      <div className="test-case-header">
                        <h4>Test Case #{index + 1}</h4>
                        <button 
                          type="button" 
                          className="remove-test-case"
                          onClick={() => removeTestCase(index)}
                        >
                          Remove
                        </button>
                      </div>
                      <label>
                        Input:
                        <textarea
                          name="input"
                          value={testCase.input}
                          onChange={(e) => handleTestCaseChange(e, index)}
                        />
                      </label>
                      <label>
                        Expected Output:
                        <textarea
                          name="expected_output"
                          value={testCase.expected_output}
                          onChange={(e) => handleTestCaseChange(e, index)}
                        />
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="is_hidden"
                          checked={testCase.is_hidden}
                          onChange={(e) => handleTestCaseChange(e, index)}
                        />
                        Hidden Test Case
                      </label>
                    </div>
                  ))}

                  <div className="new-test-case">
                    <h4>Add New Test Case</h4>
                    <label>
                      Input:
                      <textarea
                        name="input"
                        value={newTestCase.input}
                        onChange={(e) => handleTestCaseChange(e)}
                      />
                    </label>
                    <label>
                      Expected Output:
                      <textarea
                        name="expected_output"
                        value={newTestCase.expected_output}
                        onChange={(e) => handleTestCaseChange(e)}
                      />
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="is_hidden"
                        checked={newTestCase.is_hidden}
                        onChange={(e) => handleTestCaseChange(e)}
                      />
                      Hidden Test Case
                    </label>
                    <button 
                      type="button" 
                      className="add-test-case"
                      onClick={addTestCase}
                    >
                      Add Test Case
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Change Details</label>
                <textarea
                  name="change_details"
                  value={changeDetails}
                  onChange={(e) => setChangeDetails(e.target.value)}
                  placeholder="Describe what you changed..."
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-button">
                  Save Changes
                </button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={handleEditToggle}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDetail;