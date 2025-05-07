import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useAuth } from "../introduce/useAuth.jsx";
import { useLoading } from "../introduce/Loading.jsx";
import { notify } from '../Notification/notification.jsx';
import "./ProblemForm.css";

const ProblemForm = ({ turnoff, refresh, isEditMode, problemData }) => {
  const { startLoading, stopLoading } = useLoading();
  const { user } = useAuth();
  const [difficulties, setDifficulties] = useState([]);
  const [tags, setTags] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [newTestCase, setNewTestCase] = useState({ 
    input: '', 
    output: '', 
    active: false 
  });
  const [changeDetails, setChangeDetails] = useState('');

  // Form data state
  const [formData, setFormData] = useState({
    title: "",
    description: "", // Will be replaced by Tiptap editor
    difficulty: "",
    tags: [], 
    test_cases: [] 
  });

  // Initialize form with problem data if in edit mode
  useEffect(() => {
    const fetchInitialData = async () => {
      startLoading();
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("No access token found");
          stopLoading();
          return;
        }

        // Fetch tags
        const tagsResponse = await fetch(import.meta.env.VITE_API_URL + '/tags', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const tagsJson = await tagsResponse.json();
        setTags(tagsJson.data.result); // vì result nằm trong data

        if (isEditMode && problemData) {
          setFormData({
            title: problemData.title,
            description: problemData.description,
            difficulty: problemData.difficulty,
            tags: problemData.tags ? problemData.tags.map(t => t.id) : []
          });

          // Fetch test cases
          const testCasesResponse = await fetch(
            import.meta.env.VITE_API_URL + `/problems/${problemData.id}/testcases`
          );
          const testCasesData = await testCasesResponse.json();
          setTestCases(testCasesData);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        notify(2, "Failed to load form data", "Error");
      } finally {
        stopLoading();
      }
    };

    fetchInitialData();
  }, [isEditMode, problemData]);

  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.description, // initial content
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, description: editor.getHTML() }));
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tagId) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
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
    if (!formData.title || !formData.description || !formData.difficulty) {
      notify(2, "Title, description, and difficulty are required", "Error");
      return;
    }

    const problemPayload = {
      title: formData.title,
      description: formData.description,
      difficulty: formData.difficulty,
      tags: formData.tags.map(tagId => ({ id: tagId })),
      createdBy: user.username,
      updatedBy: user.username,
      test_cases: testCases.length ? testCases : []
    };

    try {
      startLoading();

      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No access token found");
        stopLoading();
        return;
      }
      
      const url = isEditMode 
        ? `${import.meta.env.VITE_API_URL}/problems/${problemData.id}`
        : `${import.meta.env.VITE_API_URL}/problems`;
      
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(problemPayload),
      });

      if (!response.ok) throw new Error("Operation failed");

      const data = await response.json();
      notify(1, `Problem ${isEditMode ? 'updated' : 'created'} successfully`, "Success");
      refresh();
      turnoff();
    } catch (error) {
      console.error("Error submitting problem:", error);
      notify(2, `Failed to ${isEditMode ? 'update' : 'create'} problem`, "Error");
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="problem-form-overlay">
      <div className="problem-form-container">
        <span className="close-button" onClick={turnoff}>&times;</span>
        <h2>{isEditMode ? 'Edit Problem' : 'Create New Problem'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
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
              value={formData.difficulty}
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
              {tags.map(tag => (
                <div
                  key={tag.id}
                  className={`tag-selector ${formData.tags.includes(tag.id) ? 'selected' : ''}`}
                  onClick={() => handleTagToggle(tag.id)}
                >
                  {tag.name}
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
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              {isEditMode ? 'Update Problem' : 'Create Problem'}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={turnoff}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProblemForm;
