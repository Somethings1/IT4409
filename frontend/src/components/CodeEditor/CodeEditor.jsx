import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import './CodeEditor.css';
import { notify } from '../Notification/notification.jsx';
import axios from 'axios';

const CodeEditor = () => {
  const { state } = useLocation();
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [comments, setComments] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showSubmissionDetail, setShowSubmissionDetail] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const [submittedComments, setSubmittedComments] = useState([]);
  const [showCommentsSection, setShowCommentsSection] = useState(false);
  const [showTestCases, setShowTestCases] = useState(false);
  const [showSubmissionPanel, setShowSubmissionPanel] = useState(false);

  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const editorRef = useRef(null);
  const bottomPanelRef = useRef(null);
  const resizeHandleRef = useRef(null);
  const verticalResizeHandleRef = useRef(null);

  const [leftPanelWidth, setLeftPanelWidth] = useState('40%');
  const [bottomPanelHeight, setBottomPanelHeight] = useState('200px');
  const isResizing = useRef(false);

  const problem = state?.problem || {};
  const initialCode = state?.initialCode || {};

  useEffect(() => {
    if (initialCode[language]) {
      setCode(initialCode[language]);
    } else {
      setCode(`// Write your ${language} solution here`);
    }

    const fetchTestCases = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("No access token found");
          stopLoading();
          return;
        }
        const response = await axios.get(`http://localhost:8080/api/v1/testcases?filter=problem.id:${problem.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("ds testcase", response.data.data.result );
        const activeTestCases = response.data.data.result
          .filter(tc => tc.active === true)
          .map(tc => ({ input: tc.input, output: tc.output }));
        setTestCases(activeTestCases);
        console.log("setTestCases = ", activeTestCases );
      } catch (error) {
        console.error('Error fetching test cases:', error);
      }
    };

    if (problem?.id) {
      fetchTestCases();
    }
    setupResizeHandlers();

    return () => {
      window.removeEventListener('mousemove', handleHorizontalResize);
      window.removeEventListener('mouseup', stopHorizontalResize);
      window.removeEventListener('mousemove', handleVerticalResize);
      window.removeEventListener('mouseup', stopVerticalResize);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [language, initialCode, problem]);

  const setupResizeHandlers = () => {
    const horizontalResizeHandle = resizeHandleRef.current;
    const verticalResizeHandle = verticalResizeHandleRef.current;

    if (horizontalResizeHandle) horizontalResizeHandle.addEventListener('mousedown', startHorizontalResize);
    if (verticalResizeHandle) verticalResizeHandle.addEventListener('mousedown', startVerticalResize);
  };

  const startHorizontalResize = (e) => {
    e.preventDefault();
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', handleHorizontalResize);
    window.addEventListener('mouseup', stopHorizontalResize);
  };

  const handleHorizontalResize = (e) => {
    if (!isResizing.current) return;
    const container = leftPanelRef.current?.parentElement;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const newLeftWidth = e.clientX - containerRect.left;
    const minWidth = 300;
    const maxWidth = containerRect.width - 300;
    if (newLeftWidth > minWidth && newLeftWidth < maxWidth) {
      leftPanelRef.current.style.width = `${newLeftWidth}px`;
      rightPanelRef.current.style.width = `calc(100% - ${newLeftWidth}px)`;
    }
  };

  const stopHorizontalResize = () => {
    isResizing.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    window.removeEventListener('mousemove', handleHorizontalResize);
    window.removeEventListener('mouseup', stopHorizontalResize);
    if (leftPanelRef.current) setLeftPanelWidth(`${leftPanelRef.current.offsetWidth}px`);
  };

  const startVerticalResize = (e) => {
    e.preventDefault();
    window.addEventListener('mousemove', handleVerticalResize);
    window.addEventListener('mouseup', stopVerticalResize);
  };

  const handleVerticalResize = (e) => {
    const container = editorRef.current?.parentElement;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const newBottomHeight = containerRect.bottom - e.clientY;
    const minHeight = 100;
    const maxHeight = 400;
    if (newBottomHeight > minHeight && newBottomHeight < maxHeight) {
      setBottomPanelHeight(`${newBottomHeight}px`);
    }
  };

  const stopVerticalResize = () => {
    window.removeEventListener('mousemove', handleVerticalResize);
    window.removeEventListener('mouseup', stopVerticalResize);
  };

  const handleRun = () => {
    console.log('Running code:', code);
    notify(1, "Code executed! Check console for output", "Success");
  };

  const handleSubmit = () => {
    const newComment = {
      id: `${Date.now()}`,
      code,
      text: comments,
      timestamp: new Date().toLocaleString(),
      author: "You",
      status: 'Pending',
      language,
      passedTests: null,
      totalTests: testCases.length,
    };
    setSubmittedComments(prev => [newComment, ...prev]);
    setComments("");
    setShowSubmissionPanel(true);
    notify(1, "Code submitted, waiting for result...", "Info");

    setTimeout(() => {
      const randomResult = Math.random();
      const updatedStatus = randomResult > 0.5 ? 'Partial' : 'Submit Failed';
      const passedTests = randomResult > 0.5 ? testCases.length - 1 : 0;

      setSubmittedComments(prev => {
        const updated = [...prev];
        updated[0] = {
          ...updated[0],
          status: updatedStatus,
          passedTests,
          totalTests: testCases.length
        };
        return updated;
      });
      notify(1, `Submission ${updatedStatus}`, updatedStatus === 'Partial' ? 'Success' : 'Error');
    }, 1500);
  };

  const handleSubmissionClick = (submissionId) => {
    const submission = submittedComments.find(s => s.id === submissionId);
    setSelectedSubmission(submission);
    setShowSubmissionDetail(true);
  };

  return (
    <div className="code-editor-container">

      {/* showsubmissiondetail */}
      
 {/*  */}

       <div 
        className="problem-info" 
        ref={leftPanelRef}
        style={{ 
          width: leftPanelWidth,
          minWidth: '300px',
          maxWidth: 'calc(100% - 300px)'
        }}
      >
        <h1>{problem.title}</h1>
        <div className={`difficulty-badge ${problem.difficulty?.toLowerCase()}`}>
          {problem.difficulty}
          {/* {problem.id} */}
        </div>

        {/* <div className="problem-description-container">
          <div className="problem-description left-aligned">
            <h3>Description</h3>
            <p>{problem.description}</p>
          </div>
        </div> */}
        
        <div className="problem-description-container">
          <div className="problem-description left-aligned">
            <h3>Description</h3>
            <p className="problem-description">
              {problem.description.length > 100
                ? <span dangerouslySetInnerHTML={{ __html: problem.description.substring(0, 100) + '...' }} />
                : <span dangerouslySetInnerHTML={{ __html: problem.description }} />}
            </p>
          </div>
        </div>
    

        <div className="problem-examples flush-left">
          <h3>Examples</h3>
          {/* {problem.example && (
            <div className="example">
              <p><strong>Input:</strong> {problem.example.input}</p>
              <p><strong>Output:</strong> {problem.example.output}</p>
              <p><strong>Explanation:</strong> {problem.example.explanation}</p>
            </div>
          )} */}
            {testCases.length > 0 && (
          <div className="example">
            <p><strong>Input:</strong> {testCases[0].input}</p>
            <p><strong>Output:</strong> {testCases[0].output}</p>
            <p><strong>Explanation:</strong> {problem?.example?.explanation ?? "No explanation."}</p>
          </div>
        )}

        </div>

        <div className="problem-constraints left-aligned">
          <h3>Constraints</h3>
          <p>{problem.constraints}</p>
        </div>

        <div className="toggle-buttons">
          <button 
            className={`toggle-button ${showSubmissionPanel ? 'active' : ''}`}
            onClick={() => {
              setShowSubmissionPanel(!showSubmissionPanel);
              setShowTestCases(false);
              setShowCommentsSection(false);
            }}
          >
            {showSubmissionPanel ? 'Hide Submission' : 'Show Submission'}
          </button>
        </div>
        {showSubmissionPanel && (
          <div className="bottom-panel" style={{ height: bottomPanelHeight }}>
            <div className="submission-section">
              <h3>Submissions</h3>
              {submittedComments.length > 0 ? (
                <div className="submission-list">
                  {submittedComments.map((submission) => (
                    <div 
                    key={submission.id} 
                    className="submission-item"
                    onClick={() => handleSubmissionClick(submission.id)}
                  >
                    <div className="submission-header">
                      <span className="submission-time">{submission.timestamp}</span>
                      <span className={`submission-status ${submission.status ? submission.status.toLowerCase().replace(' ', '-') : ''}`}>
                        {submission.status ?? "N/A"}
                      </span>

                    </div>
                        {/* <div className="submission-header">
                            <span className="submission-time">{submission.timestamp}</span>
                            <span className={`submission-status ${submission.status.toLowerCase().replace(' ', '-')}`}>
                              {submission.status}
                            </span>
                            {submission.status !== 'Pending' && (
                              <span className="submission-result">
                                {submission.passedTests}/{submission.totalTests} test cases passed
                              </span>
                            )}
                          </div> */}

                    <div className="submission-meta">
                      <p><strong>ID:</strong> {submission.id}</p>
                      <p><strong>Language:</strong> {submission.language}</p>
                      <p><strong>Passed:</strong> {submission.passedTests ?? 0}/{submission.totalTests ?? 0}</p>
                    </div>
                  
                  </div>
                  
                  ))}
                </div>
              ) : (
                <p>No submissions yet.</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div 
        className="resize-handle"
        ref={resizeHandleRef}
        onMouseDown={startHorizontalResize}
      />
      {!showSubmissionDetail && (
      <div 
        className="editor-section"
        ref={rightPanelRef}
        style={{ 
          width: `calc(100% - ${leftPanelWidth})`,
          minWidth: '300px'
        }}
      >
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

        <div 
          className="editor-wrapper"
          ref={editorRef}
          style={{ height: showTestCases || showCommentsSection 
            ? `calc(100% - ${bottomPanelHeight})` 
            : '100%' 
          }}
        >
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value)}
            theme="vs"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on'
            }}
          />
        </div>

        {(showTestCases || showCommentsSection ) && (
          <div 
            className="vertical-resize-handle"
            ref={verticalResizeHandleRef}
            onMouseDown={startVerticalResize}
          />
        )}

        <div className="toggle-buttons">
          <button 
            className={`toggle-button ${showTestCases ? 'active' : ''}`}
            onClick={() => {
              setShowTestCases(!showTestCases);
              setShowCommentsSection(false);
              setShowSubmissionPanel(false);
            }}
          >
            {showTestCases ? 'Hide Test Cases' : 'Show Test Cases'}
          </button>
          <button 
            className={`toggle-button ${showCommentsSection ? 'active' : ''}`}
            onClick={() => {
              setShowCommentsSection(!showCommentsSection);
              setShowTestCases(false);
              setShowSubmissionPanel(false);
            }}
          >
            {showCommentsSection ? 'Hide Comments' : 'Show Comments'}
          </button>
        </div>
        
        {showTestCases && (
          <div className="bottom-panel" style={{ height: bottomPanelHeight }}>
            <div className="problem-testcases left-aligned">
            {/* <h2 className="text-xl font-semibold mb-2">Test Cases</h2> */}
            <h3>Test Cases</h3>
                {testCases.length === 0 ? (
                  <p className="text-gray-500">No active test cases.</p>
                ) : (
                  <ul className="space-y-2">
                    <p>
                    {/* {testCases.map((tc, idx) => (
                      <div className="testcase" key={idx}>
                      <li key={idx} className="bg-gray-100 p-2 rounded shadow">
                        <p><strong>Test {idx + 1}</strong></p>
                        <p><strong>Input:</strong> {tc.input}</p>
                        <p><strong>Expected Output:</strong> {tc.output}</p>
                      </li>
                      </div>
                    ))} */}
                        {testCases.map((testCase, index) => (
                          <div className="testcase" key={index}>
                            <p><strong>Case {index + 1}:</strong></p>
                            <p><strong>Input:</strong> {testCase.input}</p>
                            <p><strong>Output:</strong> {testCase.output}</p>
                          </div>
                        ))}
                        </p>
                  </ul>
                )}
            </div>
          </div>
        )}
        {/* {showTestCases && (
          <div className="bottom-panel" style={{ height: bottomPanelHeight }}>
            <div className="problem-testcases left-aligned">
              <h3>Test Cases</h3>
              {testCases.map((testCase, index) => (
                <div className="testcase" key={index}>
                  <p><strong>Case {index + 1}:</strong></p>
                  <p><strong>Input:</strong> {testCase.input}</p>
                  <p><strong>Output:</strong> {testCase.output}</p>
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* {showCommentsSection && (
          <div 
            className="bottom-panel"
            style={{ height: bottomPanelHeight }}
          >
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
                    const newComment = {
                      text: comments,
                      timestamp: new Date().toLocaleString(),
                      author: "You"
                    };
                    setSubmittedComments(prev => [newComment, ...prev]);
                    setComments("");
                    notify(1, "Comment submitted", "Success");
                  }}
                  disabled={!comments.trim()}
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
            </div>
          </div>
        )} */}
        {showCommentsSection && (
          <div 
            className="bottom-panel"
            style={{ height: bottomPanelHeight }}
          >
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
                    if (!comments.trim()) return; // Prevent empty comments
                    const newComment = {
                      id: `${Date.now()}`, // Unique ID for the comment
                      text: comments,
                      timestamp: new Date().toLocaleString(),
                      author: "You",
                    };
                    setSubmittedComments(prev => [newComment, ...prev]); // Add new comment to the top
                    setComments(""); // Clear the textarea
                    notify(1, "Comment submitted", "Success");
                  }}
                  disabled={!comments.trim()}
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

              {/* Display submitted comments */}
              <div className="submitted-comments">
                <h4>Submitted Comments</h4>
                {submittedComments.length > 0 ? (
                  <ul className="comment-list">
                    {submittedComments
                      .filter(comment => comment.text) // Only show comments with text (exclude submissions without text)
                      .map((comment) => (
                        <li key={comment.id} className="comment-item">
                          <p><strong>{comment.author}</strong> <small>{comment.timestamp}</small></p>
                          <p>{comment.text}</p>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p>No comments yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        
      </div>
      )}
      {showSubmissionDetail && selectedSubmission && (
            <div className="submission-detail-panel">
              <h2>Submission ID: {selectedSubmission.id}</h2>
              <p>Language: {selectedSubmission.language}</p>
              <p>Status: {selectedSubmission.status}</p>
              <p><strong>Code:</strong></p>
              <pre className="code-block">{selectedSubmission.code}</pre>

              <p>
                Result: {selectedSubmission.passedTests}/{selectedSubmission.totalTests} test cases passed
              </p>

              <h3>Test Case Results:</h3>
              {testCases.map((test, index) => {
                const passed = selectedSubmission.passedTests > index; // giả lập kết quả
                return (
                  <div
                    key={index}
                    className={`testcase-result ${passed ? "pass" : "fail"}`}
                  >
                    <p><strong>Input:</strong> {test.input}</p>
                    <p><strong>Expected Output:</strong> {test.output}</p>
                    <p><strong>Your Output:</strong> {passed ? test.output : "Wrong Answer"}</p>
                    <p>
                      <strong>Status:</strong>
                      <span className={`testcase-status ${passed ? "success" : "fail"}`}>
                        {passed ? "✅ Pass" : "❌ Fail"}
                      </span>
                    </p>
                    <hr />
                  </div>

                );
              })}
              <button onClick={() => setShowSubmissionDetail(false)}>Close</button>
            </div>
          )}
    </div>
  );
};

export default CodeEditor;
