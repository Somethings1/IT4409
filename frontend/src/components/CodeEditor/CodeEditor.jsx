// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import Editor from '@monaco-editor/react';
// // import '../Manage_problem/item.css';
// import './CodeEditor.css';
// import { notify } from '../Notification/notification.jsx';
// const CodeEditor = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const [language, setLanguage] = useState('javascript');
//   const [code, setCode] = useState('');
//   const [comments, setComments] = useState('');
  
//   const [submittedComments, setSubmittedComments] = useState([]);


//   // Initialize with problem data
//   const problem = state?.problem || {};
//   const initialCode = state?.initialCode || {};

//   useEffect(() => {
//     if (initialCode[language]) {
//       setCode(initialCode[language]);
//     } else {
//       setCode(`// Write your ${language} solution here`);
//     }
//   }, [language, initialCode]);

//   // const handleSubmit = () => {
//   //   // Handle code submission
//   //   console.log('Submitted code:', code);
//   //   // alert('Code submitted successfully!');
    
//   // };

//   const handleRun = () => {
//     // Handle code execution
//     console.log('Running code:', code);
//     // alert('Code executed! Check console for output.');
//      notify(1, "Code executed! Check console for output", "Success");
//   };


//   const handleSubmit = () => {
//     const newComment = {
//       code,
//       comment: comments,
//       timestamp: new Date().toLocaleString(),
//       author: "You", // Có thể dùng user.name nếu có auth
//     };
  
//     setSubmittedComments(prev => [newComment, ...prev]);
//     setComments("");
//     notify(1, "Code submitted and saved as a comment", "Success");
//   };
  
//   return (
//     <div className="code-editor-container">
//       <div className="problem-info">
//         <h1>{problem.title}</h1>
//         <div className={`difficulty-badge ${problem.difficulty?.toLowerCase()}`}>
//           {problem.difficulty}
//         </div>
        
//         <div className="problem-description left-aligned">
//           <h3>Description</h3>
//           <p>{problem.description}</p>
//         </div>
        
//         <div className="problem-examples flush-left">
//           <h3>Examples</h3>
//           {problem.example && (
//             <div className="example">
//               <p><strong>Input:</strong> {problem.example.input}</p>
//               <p><strong>Output:</strong> {problem.example.output}</p>
//               <p><strong>Explanation:</strong> {problem.example.explanation}</p>
//             </div>
//           )}
//         </div>
        
//         <div className="problem-constraints left-aligned">
//           <h3>Constraints</h3>
//           <p>{problem.constraints}</p>
//         </div>
//       </div>
      
//       <div className="editor-section">
//         <div className="editor-toolbar">
//         <select 
//           value={language} 
//           onChange={(e) => setLanguage(e.target.value)}
//           className="language-selector"
//         >
//           <option value="javascript">JavaScript</option>
//           <option value="python">Python</option>
//           <option value="c">C</option>
//           <option value="cpp">C++</option>
//           <option value="java">Java</option>
//           <option value="go">Go</option>
//           <option value="csharp">C#</option>
//         </select>

          
//           <div className="editor-buttons">
//             <button className="run-button" onClick={handleRun}>
//               Run Code
//             </button>
//             <button className="submit-button" onClick={handleSubmit}>
//               Submit
//             </button>
//           </div>
//         </div>
        
//         <Editor
//           height="400px"
//           language={language}
//           value={code}
//           onChange={(value) => setCode(value)}
//           theme="vs-black"
//           options={{
//             minimap: { enabled: false },
//             fontSize: 14,
//             wordWrap: 'on'
//           }}
//         />
//         <div className="comment-list">
//           {submittedComments.map((item, index) => (
//             <div className="comment-item" key={index}>
//               <div className="comment-author">{item.author}</div>
//               {item.comment && <div className="comment-text">{item.comment}</div>}
//               <div className="comment-time">{item.timestamp}</div>

//               <details className="submitted-code">
//                 <summary>View Submitted Code</summary>
//                 <pre className="submitted-code-block">
//                   {item.code}
//                 </pre>
//               </details>
//             </div>
//           ))}
//         </div>

//         <div className="comments-section">
//   <h3>Comments</h3>
//   <textarea
//     value={comments}
//     onChange={(e) => setComments(e.target.value)}
//     placeholder="Add your comments here..."
//     rows={4}
//     className="comment-textarea"
//   />
//   <div className="comment-controls">
//     <button 
//       className="comment-submit"
//       onClick={() => {
//         // Handle comment submission
//         console.log("Comment submitted:", comments);
//         setComments(""); // Clear the textarea
//         notify(1, "Comment submitted", "Success");
//       }}
//       disabled={!comments.trim()} // Disable if empty
//     >
//       Post Comment
//     </button>
//     <button
//       className="comment-cancel"
//       onClick={() => setComments("")}
//       disabled={!comments.trim()}
//     >
//       Cancel
//     </button>
//   </div>
  
//           {/* Display existing comments */}
//           <div className="comment-list">
//             {/* Example comment - replace with dynamic rendering */}
//             <div className="comment-item">
//               <div className="comment-author">User123</div>
//               <div className="comment-text">This problem was challenging but fun!</div>
//               <div className="comment-time">2 hours ago</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CodeEditor;

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import './CodeEditor.css';
import { notify } from '../Notification/notification.jsx';

const CodeEditor = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [comments, setComments] = useState('');
  const [submittedComments, setSubmittedComments] = useState([]);
  const [showCommentsSection, setShowCommentsSection] = useState(false);
  const [showTestCases, setShowTestCases] = useState(false);
  const [showSubmission, setShowSubmission] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState(null);
  const [showSubmissionPanel, setShowSubmissionPanel] = useState(false);
  

  // Refs for resizable panels
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const editorRef = useRef(null);
  const bottomPanelRef = useRef(null);
  const resizeHandleRef = useRef(null);
  const verticalResizeHandleRef = useRef(null);
  
  // Panel sizes state
  const [leftPanelWidth, setLeftPanelWidth] = useState('40%');
  const [bottomPanelHeight, setBottomPanelHeight] = useState('200px');
  const isResizing = useRef(false);
  // Initialize with problem data
  const problem = state?.problem || {};
  const initialCode = state?.initialCode || {};
  const testCases = problem.testCases || [
    { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
    { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    { input: 'nums = [3,3], target = 6', output: '[0,1]' },
  ];

  useEffect(() => {
    if (initialCode[language]) {
      setCode(initialCode[language]);
    } else {
      setCode(`// Write your ${language} solution here`);
    }
    
    // Initialize resize functionality
    setupResizeHandlers();
    
    return () => {
      // Cleanup all event listeners
      window.removeEventListener('mousemove', handleHorizontalResize);
      window.removeEventListener('mouseup', stopHorizontalResize);
      window.removeEventListener('mousemove', handleVerticalResize);
      window.removeEventListener('mouseup', stopVerticalResize);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [language, initialCode]);


  const setupResizeHandlers = () => {
    const horizontalResizeHandle = resizeHandleRef.current;
    const verticalResizeHandle = verticalResizeHandleRef.current;
    
    if (horizontalResizeHandle) {
      horizontalResizeHandle.addEventListener('mousedown', startHorizontalResize);
    }
    
    if (verticalResizeHandle) {
      verticalResizeHandle.addEventListener('mousedown', startVerticalResize);
    }
  };

  // Horizontal resize (left-right between problem and editor)
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
    
    if (leftPanelRef.current) {
      setLeftPanelWidth(`${leftPanelRef.current.offsetWidth}px`);
    }
  };

  // Vertical resize (up-down between editor and bottom panel)
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
    
    // Set minimum and maximum heights
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
      code,
      comment: comments,
      timestamp: new Date().toLocaleString(),
      author: "You",
    };
    setSubmittedComments(prev => [newComment, ...prev]);
    setComments("");
    setShowSubmission(true); // Show submission panel after submitting
    notify(1, "Code submitted and saved as a comment", "Success");
  };
  const toggleCommentsSection = () => {
    setShowCommentsSection(!showCommentsSection);
    setShowTestCases(false);
  };

  const toggleTestCases = () => {
    setShowTestCases(!showTestCases);
    setShowCommentsSection(false);
  };

  return (
    <div className="code-editor-container">
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
        </div>

        <div className="problem-description-container">
          <div className="problem-description left-aligned">
            <h3>Description</h3>
            <p>{problem.description}</p>
          </div>
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

      {/* Resize handle between problem and editor */}
      <div 
        className="resize-handle"
        ref={resizeHandleRef}
        onMouseDown={startHorizontalResize}
      />

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

        {/* Vertical resize handle between editor and bottom panel */}
        {(showTestCases || showCommentsSection||showSubmissionPanel) && (
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
        {submittedComments.length > 0 && (
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
        )}

      </div>
        
      {showTestCases && (
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
      )}

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
        )}
        {submittedComments.length > 0 &&showSubmissionPanel && (
        <div className="bottom-panel" style={{ height: bottomPanelHeight }}>
          <div className="submission-section">
           
         
            {/* Preview of the last submission */}
            {submittedComments.length > 0 && (
              <div className="last-submission">
                <h4>Your Last Submission</h4>
                <div className="comment-item">
                <div className="comment-header">
                  <span className="comment-author">{submittedComments[0].author}</span>
                  <span className="comment-time">{submittedComments[0].timestamp}</span>
                  <div className="comment-text">{submittedComments[0].text}</div>
                </div>
                  {submittedComments[0].code && (
                    <details className="submitted-code" open>
                      <summary>Submitted Code</summary>
                      <pre className="submitted-code-block">{submittedComments[0].code}</pre>
                    </details>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default CodeEditor;