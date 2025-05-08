import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Select, Button, Space, Card, Input, Spin } from 'antd';
import { PlayCircleOutlined, CloudUploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const CodeEditor = ({
  problem,
  initialCodeByLanguage, // e.g., { javascript: "...", python: "..." }
  problemTestCases, // Array of general { input, output } for the current problem.
  onRunCode, // (code: string, language: string) => void
  onSubmitCode, // (code: string, language: string, submissionNote: string, testCasesToUse: Array) => void
  isLoading, // General loading state for editor/related actions (e.g. parent is submitting)
  onSubmissionSuccess, // Callback to potentially trigger refresh in DescriptionPane's submission tab
}) => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [submissionNote, setSubmissionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Local submitting state for button

  useEffect(() => {
    if (initialCodeByLanguage && initialCodeByLanguage[language]) {
      setCode(initialCodeByLanguage[language]);
    } else {
      setCode(`// Start your ${language} solution for problem ${problem.id || ''} here`);
    }
  }, [language, initialCodeByLanguage, problem.id]);

  const handleRunClick = () => {
    if (onRunCode) {
      onRunCode(code, language);
    }
  };

  const handleSubmitClick = async () => {
    if (onSubmitCode && !isSubmitting) {
      setIsSubmitting(true);
      try {
        // The actual submission logic is in the parent via onSubmitCode
        // The parent will handle the async nature and update its state.
        // The parent should ideally return a promise or indicate success/failure.
        await onSubmitCode(code, language, submissionNote, problemTestCases || []);
        // If parent manages notifications, great. Otherwise, local notification can be added.
        // If onSubmissionSuccess is provided, call it.
        if (onSubmissionSuccess) {
            onSubmissionSuccess();
        }
        setSubmissionNote(''); // Clear note on success
      } catch (error) {
        // Parent should handle error notification.
        console.error("Submission failed in CodeEditorPane wrapper:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'c', label: 'C' },
    { value: 'cpp', label: 'C++' },
    { value: 'java', label: 'Java' },
    { value: 'go', label: 'Go' },
    { value: 'csharp', label: 'C#' },
  ];
return (
  <Card
    size="small"
    bordered={false}
    style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}
    bodyStyle={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}
  >
    {/* Control Bar */}
    <div
      style={{
        padding: '8px 16px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
      }}
    >
      <Select
        value={language}
        onChange={setLanguage}
        options={languageOptions}
        style={{ width: 150 }}
        disabled={isLoading || isSubmitting}
      />

      <Space>
        <Button
          icon={<PlayCircleOutlined />}
          onClick={handleRunClick}
          disabled={isLoading || isSubmitting || !onRunCode || !code.trim()}
        >
          Run Code
        </Button>
        <Button
          type="primary"
          icon={<CloudUploadOutlined />}
          onClick={handleSubmitClick}
          loading={isSubmitting}
          disabled={isLoading || !onSubmitCode || !code.trim()}
        >
          Submit
        </Button>
      </Space>
    </div>

    {/* Editor */}
    <div style={{ flexGrow: 1, overflow: 'hidden', padding: '1rem', paddingTop: 0 }}>
      {isLoading && (!problem.id || !initialCodeByLanguage) ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Spin tip="Loading Editor Configuration..." />
        </div>
      ) : (
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="vs-light"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      )}
    </div>
  </Card>
);
};

export default CodeEditor;
