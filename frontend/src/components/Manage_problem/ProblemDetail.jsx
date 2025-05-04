import React, { useState, useEffect } from "react";
import { useLoading } from "../introduce/Loading.jsx";
import { useAuth } from "../introduce/useAuth.jsx";
import { notify } from '../Notification/notification.jsx';
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "../Manage_problem/ProblemDetail.css";
import axios from 'axios';

const ProblemDetail = ({ problem, onClose, onUpdate }) => {
  const { startLoading, stopLoading } = useLoading();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...problem });
  const [difficulties, setDifficulties] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [testCases, setTestCases] = useState([]);
  
  const [newTestCase, setNewTestCase] = useState({ input: '', output: '', active: false });
  const [changeDetails, setChangeDetails] = useState("");
  const [originalTags, setOriginalTags] = useState([]);
  // Fetch additional data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      startLoading();
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("No access token found");
          stopLoading();
          return;
        }

        // Fetch tags
        const tagsResponse = await fetch('http://localhost:8080/api/v1/tags', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const tagsJson = await tagsResponse.json();
        setTags(tagsJson.data.result); // vì result nằm trong data

      

        // Fetch test cases for this problem
        // const testCasesResponse = await fetch(`http://localhost:8080/problems/${problem.id}/testcases`);
        // const testCasesData = await testCasesResponse.json()||[];
        // setTestCases(testCasesData);

        // Set selected tags
        if (problem.tags) {
          setSelectedTags(problem.tags.map(tag => tag.id));
          console.log("select tag gốc của bài táon",selectedTags);
        }
        setOriginalTags(problem.tags.map(tag => tag.id)); // 👈 lưu tag gốc
        console.log("tag gốc của bài táon",originalTags);

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

   const editor = useEditor({
      extensions: [StarterKit],
      content: editData.description, // initial content
      onUpdate: ({ editor }) => {
        setEditData(prev => ({ ...prev, description: editor.getHTML() }));
      }
    });

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

  // const handleTestCaseChange = (e, index) => {
  //   const { name, value, type, checked } = e.target;
  //   const updatedTestCases = [...testCases];
    
  //   if (index !== undefined) {
  //     updatedTestCases[index] = { 
  //       ...updatedTestCases[index], 
  //       [name]: type === 'checkbox' ? checked : value 
  //     };
  //     setTestCases(updatedTestCases);
  //   } else {
  //     setNewTestCase(prev => ({ 
  //       ...prev, 
  //       [name]: type === 'checkbox' ? checked : value 
  //     }));
  //   }
  // };

  const handleTestCaseChange = (e, index) => {
    const { name, value, type, checked } = e.target;
    const updatedTestCases = [...testCases];

    if (index !== undefined) {
      updatedTestCases[index] = {
        ...updatedTestCases[index],
        [name]: type === 'checkbox' ? checked : value
      };
      // setTestCases(updatedTestCases);
    } else {
      setNewTestCase(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };


  const addTestCase = () => {
    if (newTestCase.input && newTestCase.output) {
      // setTestCases(prev => [...prev, newTestCase]);
      setNewTestCase({ input: '', output: '', active: false });
    }
  };

  const removeTestCase = (index) => {
    // setTestCases(prev => prev.filter((_, i) => i !== index));
  };

  const submitTestCase = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No access token found");
      return;
    }

    const newTestCaseData = {
      input: newTestCase.input,
      output: newTestCase.output,
      createdBy: 'admin',
      updatedBy: 'admin',
      problem: {
        id: editData.id
      }
    };

    try {
      startLoading();
      const response = await axios.post("http://localhost:8080/api/v1/testcases", newTestCaseData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      console.log("Test case created successfully:", response.data);
      // Optionally update the UI or handle response data
      // setTestCases(prev => [...prev, response.data]);  // Add new test case to the list
      setNewTestCase({ input: '', output: '', active: false }); // Reset form

      notify(1, "Test case created successfully", "Success");
    } catch (error) {
      console.error("Error creating test case:", error);
      notify(2, "Failed to create test case", "Error");
    } finally {
      stopLoading();
    }
  };


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   if (!editData.title || !editData.description || !editData.difficulty_id) {
  //     notify(2, "Title, description and difficulty are required", "Error");
  //     return;
  //   }

  //   const updatedProblem = {
  //     ...editData,
  //     tags: selectedTags,
  //     test_cases: testCases,
  //     change_details: changeDetails
  //   };

  //   try {
  //     startLoading();
  //     const response = await fetch(`http://localhost:8080/api/v1/problems/${problem.id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(updatedProblem),
  //     });

  //     if (!response.ok) throw new Error("Update failed");

  //     const data = await response.json();
  //     notify(1, "Problem updated successfully", "Success");
  //     onUpdate(data);
  //     setIsEditing(false);
  //   } catch (error) {
  //     console.error("Error updating problem:", error);
  //     notify(2, "Failed to update problem", "Error");
  //   } finally {
  //     stopLoading();
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No access token found");
      stopLoading();
      return;
    }

    const updatedProblem = {
      id: editData.id,
      title: editData.title,
      description: editor.getHTML(),
      difficulty: difficultyToText(editData.difficulty),
      createdBy: editData.createdBy,
    };

    try {
      const response = await axios.put(
        "http://localhost:8080/api/v1/problems",
        updatedProblem,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      notify(1, "Update problem successful", "Success");
      console.log("Update successful:", response.data);
      // Xử lý sau khi update thành công
    } catch (error) {
      console.error("Error updating problem:", error);
      notify(2, "Failed to update problem successful", "Error");
    } finally {
      stopLoading();
    }
  };

  // Helper: Convert difficulty value
  const difficultyToText = (value) => {
    switch (value) {
      case "0": return "EASY";
      case "1": return "MEDIUM";
      case "2": return "HARD";
      default: return "";
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
              <span className={`difficulty-badge ${problem?.difficulty?.toLowerCase?.() || "default"}`}>
                {problem.difficulty}
              </span>
            </div>

            {/* <div className="problem-tags"> */}
              {/* {problem.tags && problem.tags.map(tag => (
                <span key={tag.id} className="tag">{tag.tag_name}</span>
              ))} */}
                  {/* <div className="problem-header">
              <h3 style={{fontColor: 'black'}}>
                Tag:    {problem.tags.join(', ')} 
              </h3>
            
                </div>
            </div> */}

            <div className="problem-tags">
              <h3 style={{ color: '#222',textAlign: 'left'  }}>Tags:</h3>
              <div className="tag-list">
                {problem.tags?.map(tag => (
                  <span key={tag.id || tag} className="tag">
                    {tag.tag_name || tag}
                  </span>
                ))}
              </div>
            </div>

                      

            <div className="problem-description">
              <h3>Description</h3>
              {/* <pre>{problem.description}</pre> */}
              <p className="problem-description">
              {problem.description.length > 100
                ? <span dangerouslySetInnerHTML={{ __html: problem.description.substring(0, 100) + '...' }} />
                : <span dangerouslySetInnerHTML={{ __html: problem.description }} />}
            </p>

            </div>

            {/* {user && user.role === 'Admin' && ( */}
              <button className="edit-button" onClick={handleEditToggle}>
                Edit Problem
              </button>
            {/* )} */}
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

              {/* <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={editData.description}
                  onChange={handleInputChange}
                  required
                  rows={10}
                />
              </div> */}

                <div className="form-group">
                          <label>Description *</label>
                          <div className="tiptap-editor-container">
                            <EditorContent editor={editor} />
                          </div>
                  </div>

                  <div className="form-group">
                    <label>Difficulty *</label>
                    <select
                      name="difficulty"
                      value={editData.difficulty}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Difficulty</option>
                      <option value="0">EASY</option>
                      <option value="1">MEDIUM</option>
                      <option value="2">HARD</option>
                    </select>
                  </div>


              {/* <div className="form-group">
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
              </div> */}

              <div className="form-group">
                <label>Tags</label>
                <div className="tags-container">
                  {tags.map(tag => {
                    const isSelected = editData.tags.includes(tag.id);
                    const isOriginal = originalTags.includes(tag.id); // 👈 check tag gốc

                    return (
                      <div 
                        key={tag.id}
                        className={`tag-selector 
                                    ${isSelected ? 'selected' : ''} 
                                    ${isOriginal ? 'original-tag' : ''}`}
                        onClick={() => handleTagToggle(tag.id)}
                      >
                        {tag.name}
                      </div>
                    );
                  })}
                </div>
              </div>


              <div className="form-group">
                <label>Test Cases</label>
                <div className="test-cases-container">
                  {/* {testCases.map((testCase, index) => (
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
                          name="output"
                          value={testCase.output}
                          onChange={(e) => handleTestCaseChange(e, index)}
                        />
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="active"
                          checked={testCase.active}
                          onChange={(e) => handleTestCaseChange(e, index)}
                        />
                        Hidden Test Case
                      </label>
                    </div>
                  ))} */}

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
                        name="output"
                        value={newTestCase.output}
                        onChange={(e) => handleTestCaseChange(e)}
                      />
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="active"
                        checked={newTestCase.active}
                        onChange={(e) => handleTestCaseChange(e)}
                      />
                      Hidden Test Case
                    </label>
                    <button 
                      type="button" 
                      className="add-test-case"
                      onClick={submitTestCase}
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