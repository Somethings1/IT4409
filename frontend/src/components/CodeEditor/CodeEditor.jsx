import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
// import '../Manage_problem/item.css';
import './CodeEditor.css';
import { notify } from '../Notification/notification.jsx';
const CodeEditor = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [comments, setComments] = useState('');
  
  // Initialize with problem data
  const problem = state?.problem || {};
  const initialCode = state?.initialCode || {};

  useEffect(() => {
    if (initialCode[language]) {
      setCode(initialCode[language]);
    } else {
      setCode(`// Write your ${language} solution here`);
    }
  }, [language, initialCode]);

  const handleSubmit = () => {
    // Handle code submission
    console.log('Submitted code:', code);
    // alert('Code submitted successfully!');
    
  };

  const handleRun = () => {
    // Handle code execution
    console.log('Running code:', code);
    // alert('Code executed! Check console for output.');
     notify(1, "Code executed! Check console for output", "Success");
  };

  return (
    <div className="code-editor-container">
      <div className="problem-info">
        <h1>{problem.title}</h1>
        <div className={`difficulty-badge ${problem.difficulty?.toLowerCase()}`}>
          {problem.difficulty}
        </div>
        
        <div className="problem-description left-aligned">
          <h3>Description</h3>
          <p>{problem.description}</p>
        </div>
        
        <div className="problem-examples flush-left">
          <h3>Examples</h3>
          {problem.example && (
            <div className="example">
              <p><strong>Input:</strong> {problem.example.input}</p>
              <p><strong>Output:</strong> {problem.example.output}</p>
              <p><strong>Explanation:</strong> {problem.example.explanation}</p>
            </div>
          )}
        </div>
        
        <div className="problem-constraints left-aligned">
          <h3>Constraints</h3>
          <p>{problem.constraints}</p>
        </div>
      </div>
      
      <div className="editor-section">
        <div className="editor-toolbar">
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          className="language-selector"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="go">Go</option>
          <option value="csharp">C#</option>
        </select>

          
          <div className="editor-buttons">
            <button className="run-button" onClick={handleRun}>
              Run Code
            </button>
            <button className="submit-button" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
        
        <Editor
          height="400px"
          language={language}
          value={code}
          onChange={(value) => setCode(value)}
          theme="vs-black"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on'
          }}
        />
        
        <div className="comments-section">
  <h3>Comments</h3>
  <textarea
    value={comments}
    onChange={(e) => setComments(e.target.value)}
    placeholder="Add your comments here..."
    rows={4}
    className="comment-textarea"
  />
  <div className="comment-controls">
    <button 
      className="comment-submit"
      onClick={() => {
        // Handle comment submission
        console.log("Comment submitted:", comments);
        setComments(""); // Clear the textarea
        notify(1, "Comment submitted", "Success");
      }}
      disabled={!comments.trim()} // Disable if empty
    >
      Post Comment
    </button>
    <button
      className="comment-cancel"
      onClick={() => setComments("")}
      disabled={!comments.trim()}
    >
      Cancel
    </button>
  </div>
  
          {/* Display existing comments */}
          <div className="comment-list">
            {/* Example comment - replace with dynamic rendering */}
            <div className="comment-item">
              <div className="comment-author">User123</div>
              <div className="comment-text">This problem was challenging but fun!</div>
              <div className="comment-time">2 hours ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;