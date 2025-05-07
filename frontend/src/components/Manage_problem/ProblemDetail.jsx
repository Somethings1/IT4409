import React, { useState, useEffect } from "react";
import { useLoading } from "../introduce/Loading.jsx";
import { useAuth } from "../introduce/useAuth.jsx";
import { notify } from "../Notification/notification.jsx";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "../Manage_problem/ProblemDetail.css";
import axios from "axios";

const ProblemDetail = ({ problem, onClose, onUpdate }) => {
  const { startLoading, stopLoading } = useLoading();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    ...problem,
    tags: problem.tags ? problem.tags.map((tag) => ({ id: tag.id, name: tag.tag_name })) : [],
  });
  const [tags, setTags] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [newTestCase, setNewTestCase] = useState({ input: "", output: "", active: false });
  const [showOldTestCases, setShowOldTestCases] = useState(false);
  const [changeDetails, setChangeDetails] = useState("");

  // Initialize Tiptap editor for description
  const editor = useEditor({
    extensions: [StarterKit],
    content: editData.description,
    onUpdate: ({ editor }) => {
      setEditData((prev) => ({ ...prev, description: editor.getHTML() }));
    },
  });

  // Fetch tags and test cases
  useEffect(() => {
    const fetchData = async () => {
      startLoading();
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No access token found");
          notify(2, "Authentication required", "Error");
          return;
        }

        // Fetch tags
        const tagsResponse = await fetch(import.meta.env.VITE_API_URL + '/problems/tags', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tagsData = tagsResponse.data.data?.result || [];
        setTags(tagsData);
        console.log("Fetched tags:", tagsData);

        // Fetch test cases
        const testCasesResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/testcases?filter=problem.id:${problem.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const allTestCases = (testCasesResponse.data.data?.result || []).map((tc) => ({
          id: tc.id,
          input: tc.input.replace(/\\n/g, "\n"), // Unescape newlines
          output: tc.output.replace(/\\n/g, "\n"), // Unescape newlines
          active: tc.active,
        }));
        setTestCases(allTestCases);
        console.log("Fetched test cases:", allTestCases);

      } catch (error) {
        console.error("Error fetching data:", error);
        notify(2, "Failed to load problem details", "Error");
      } finally {
        stopLoading();
      }
    };

    fetchData();
  }, [problem.id]);

  // Toggle edit mode
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditData({
        ...problem,
        tags: problem.tags ? problem.tags.map((tag) => ({ id: tag.id, name: tag.tag_name })) : [],
      });
      if (editor) {
        editor.commands.setContent(problem.description);
      }
    }
  };

  // Handle input changes for title and difficulty
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle tag selection
  const handleTagToggle = (tagId) => {
    setEditData((prev) => ({
      ...prev,
      tags: prev.tags.some((tag) => tag.id === tagId)
        ? prev.tags.filter((tag) => tag.id !== tagId)
        : [...prev.tags, { id: tagId, name: tags.find((t) => t.id === tagId)?.name || "" }],
    }));
  };

  // Handle test case changes
  const handleTestCaseChange = (e, index) => {
    const { name, value, type, checked } = e.target;
    if (index !== undefined) {
      const updatedTestCases = [...testCases];
      updatedTestCases[index] = {
        ...updatedTestCases[index],
        [name]: type === "checkbox" ? checked : value,
      };
      setTestCases(updatedTestCases);
    } else {
      setNewTestCase((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Remove test case
  const removeTestCase = async (index) => {
    const token = localStorage.getItem("token");
    if (!token) {
      notify(2, "Authentication required", "Error");
      return;
    }

    const testCaseId = testCases[index].id;
    try {
      startLoading();
      await axios.delete(`http://localhost:8080/api/v1/testcases/${testCaseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTestCases((prev) => prev.filter((_, i) => i !== index));
      notify(1, "Test case deleted successfully", "Success");
    } catch (error) {
      console.error("Error deleting test case:", error);
      notify(2, "Failed to delete test case", "Error");
    } finally {
      stopLoading();
    }
  };

  // Submit new test case
  const submitTestCase = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      notify(2, "Authentication required", "Error");
      return;
    }

    if (!newTestCase.input || !newTestCase.output) {
      notify(2, "Input and output are required", "Error");
      return;
    }

    const newTestCaseData = {
      input: newTestCase.input, // Send raw newlines
      output: newTestCase.output, // Send raw newlines
      active: newTestCase.active,
      createdBy: user?.email || "admin",
      updatedBy: user?.email || "admin",
      problem: { id: editData.id },
    };

    try {
      startLoading();
      console.log("Submitting test case:", newTestCaseData); // Debug log
      const response = await axios.post(
        "http://localhost:8080/api/v1/testcases",
        newTestCaseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setTestCases((prev) => [
        ...prev,
        {
          id: response.data.data?.id,
          input: newTestCase.input,
          output: newTestCase.output,
          active: newTestCase.active,
        },
      ]);
      setNewTestCase({ input: "", output: "", active: false });
      notify(1, "Test case created successfully", "Success");
    } catch (error) {
      console.error("Error creating test case:", error);
      notify(2, "Failed to create test case", "Error");
    } finally {
      stopLoading();
    }
  };

  // Convert difficulty value to text
  const difficultyToText = (value) => {
    const difficultyMap = {
      "0": "EASY",
      "1": "MEDIUM",
      "2": "HARD",
    };
    return difficultyMap[value] || "EASY";
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editData.title || !editData.description || !editData.difficulty) {
      notify(2, "Title, description, and difficulty are required", "Error");
      return;
    }

    const validTags = editData.tags
      .filter((tag) => tag && tag.id)
      .map((tag) => ({ id: tag.id }));

    const updatedProblem = {
      id: editData.id,
      title: editData.title,
      description: editor.getHTML(),
      difficulty: difficultyToText(editData.difficulty),
      createdBy: editData.createdBy || user?.email || "admin",
      tags: validTags,
    };

    try {
      startLoading();
      console.log("Sending updated problem:", updatedProblem);
      const response = await axios.put(
        import.meta.env.VITE_API_URL + "/problems",
        updatedProblem,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      notify(1, "Problem updated successfully", "Success");
      console.log("Update successful:", response.data);
      setIsEditing(false);
      onUpdate(response.data);
    } catch (error) {
      console.error("Error updating problem:", error);
      notify(2, `Failed to update problem: ${error.message}`, "Error");
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="problem-detail-overlay">
      <div className="problem-detail-container">
        <span className="close-button" onClick={onClose}>×</span>

        {!isEditing ? (
          <div className="problem-view">
            <div className="problem-header">
              <h2>{problem.title}</h2>
              <span
                className={`difficulty-badge ${problem?.difficulty?.toLowerCase?.() || "default"}`}
              >
                {problem.difficulty || "Unknown"}
              </span>
            </div>

            <div className="problem-tags">
              <h3 style={{ color: "#222", textAlign: "left" }}>Tags:</h3>
              <div className="tag-list">
                {problem.tags?.length > 0 ? (
                  problem.tags.map((tag) => (
                    <span key={tag.id || tag} className="tag">
                      {tag.tag_name || tag}
                    </span>
                  ))
                ) : (
                  <span>No tags</span>
                )}
              </div>
            </div>

            <div className="problem-description">
              <h3>Description</h3>
              <p
                className="problem-description"
                dangerouslySetInnerHTML={{
                  __html:
                    problem.description.length > 100
                      ? problem.description.substring(0, 100) + "..."
                      : problem.description,
                }}
              />
            </div>

            {user && user.role === "ADMIN" && (
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

              <div className="form-group">
                <label>Tags</label>
                <div className="tags-container">
                  {tags.map((tag) => (
                    <div
                      key={tag.id}
                      className={`tag-selector ${
                        editData.tags.some((t) => t.id === tag.id) ? "selected" : ""
                      }`}
                      onClick={() => handleTagToggle(tag.id)}
                    >
                      {tag.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Test Cases</label>
                <button
                  type="button"
                  onClick={() => setShowOldTestCases((prev) => !prev)}
                >
                  {showOldTestCases ? "Hide Old Test Cases" : "Show Old Test Cases"}
                </button>

                <div className="test-cases-container">
                  {showOldTestCases &&
                    testCases.map((testCase, index) => (
                      <div key={testCase.id || index} className="test-case">
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
                            className="test-case-textarea"
                          />
                        </label>
                        <label>
                          Expected Output:
                          <textarea
                            name="output"
                            value={testCase.output}
                            onChange={(e) => handleTestCaseChange(e, index)}
                            className="test-case-textarea"
                          />
                        </label>
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="active"
                            checked={testCase.active}
                            onChange={(e) => handleTestCaseChange(e, index)}
                          />
                          Show Test Case
                        </label>
                        {/* Display test case with preserved newlines */}
                        <div className="test-case-preview">
                          <h5>Preview:</h5>
                          <pre>{testCase.input}</pre>
                          <pre>{testCase.output}</pre>
                        </div>
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
                        className="test-case-textarea"
                      />
                    </label>
                    <label>
                      Expected Output:
                      <textarea
                        name="output"
                        value={newTestCase.output}
                        onChange={(e) => handleTestCaseChange(e)}
                        className="test-case-textarea"
                      />
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="active"
                        checked={newTestCase.active}
                        onChange={(e) => handleTestCaseChange(e)}
                      />
                      Show Test Case
                    </label>
                    {/* Preview for new test case */}
                    <div className="test-case-preview">
                      <h5>Preview:</h5>
                      <pre>{newTestCase.input || "No input yet"}</pre>
                      <pre>{newTestCase.output || "No output yet"}</pre>
                    </div>
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
