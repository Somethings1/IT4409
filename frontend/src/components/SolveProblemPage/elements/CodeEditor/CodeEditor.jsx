import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Select, Button, Space, Card, Input, Spin } from 'antd';
import { PlayCircleOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { notify } from '../../../Notification/notification';
import { useAuth } from '../../../introduce/useAuth.jsx';
import axios from 'axios';

const { TextArea } = Input;

// Formatting functions for each language
// Formatting functions for each language
const formatCppCode = (code) => {
  const lines = code.split('\n').map(line => line.trim());
  const formattedLines = lines.map((line) => {
    if (line === '') return line;
    if (line.startsWith('//') || line.startsWith('#include') || line.startsWith('using')) {
      return line;
    } else if (line.startsWith('int main') || line.startsWith('}')) {
      return line;
    } else if (line.startsWith('cout') || line.startsWith('return')) {
      return '  ' + line;
    } else {
      return '    ' + line;
    }
  });
  return formattedLines.join('\n'); // ✅ Fixed
};

const formatCCode = (code) => {
  const lines = code.split('\n').map(line => line.trim());
  const formattedLines = lines.map((line) => {
    if (line === '') return line;
    if (line.startsWith('//') || line.startsWith('#include') || line.startsWith('#define')) {
      return line;
    } else if (line.startsWith('int main') || line.startsWith('}')) {
      return line;
    } else if (line.startsWith('printf') || line.startsWith('return')) {
      return '  ' + line;
    } else {
      return '    ' + line;
    }
  });
  return formattedLines.join('\n'); // ✅ Fixed
};

const formatJavaCode = (code) => {
  const lines = code.split('\n').map(line => line.trim());
  const formattedLines = lines.map((line) => {
    if (line === '') return line;
    if (line.startsWith('//') || line.startsWith('import') || line.startsWith('public class')) {
      return line;
    } else if (line.startsWith('public static void main') || line.startsWith('}')) {
      return '  ' + line;
    } else if (line.startsWith('System.out') || line.startsWith('return')) {
      return '    ' + line;
    } else {
      return '      ' + line;
    }
  });
  return formattedLines.join('\n'); // ✅ Fixed
};

const formatJavaScriptCode = (code) => {
  const lines = code.split('\n').map(line => line.trim());
  const formattedLines = lines.map((line) => {
    if (line === '') return line;
    if (line.startsWith('//') || line.startsWith('/*')) {
      return line;
    } else if (line.startsWith('function') || line.startsWith('}')) {
      return line;
    } else if (line.startsWith('console.log') || line.startsWith('return')) {
      return '  ' + line;
    } else {
      return '    ' + line;
    }
  });
  return formattedLines.join('\n'); // ✅ Fixed
};

const CodeEditor = ({
  problem,
  initialCodeByLanguage, // e.g., { javascript: "...", python: "..." }
  isLoading, // General loading state for editor/related actions
  onSubmissionSuccess, // Callback to trigger refresh in DescriptionPane's submission tab
}) => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Local submitting state for button
  const getAuthToken = () => localStorage.getItem("token");
  const { user } = useAuth();

  useEffect(() => {
    if (initialCodeByLanguage && initialCodeByLanguage[language]) {
      // Use the provided initial code without formatting
      setCode(initialCodeByLanguage[language]);
    } else {
      // Set a minimal default code without forced formatting
      setCode(`// Start your ${language} solution for problem ${problem.id || ''} here`);
    }
    
  }, [language, initialCodeByLanguage, problem.id,]);

  const handleSubmitClick = async () => {
    if (!code?.trim() || !problem?.id || isSubmitting) {
      console.warn('Missing code or problem ID, or already submitting. Calm down.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = getAuthToken();
      // Format code based on language
      let formattedCode = code;
      if (language === 'C++') {
        formattedCode = formatCppCode(code);
      } else if (language === 'C') {
        formattedCode = formatCCode(code);
      } else if (language === 'Java') {
        formattedCode = formatJavaCode(code);
      } else if (language === 'Javascipt') {
        formattedCode = formatJavaScriptCode(code);
      }

      const payload = {
        code: formattedCode,
        language: language,
        problem: { id: problem.id },
        user: { id: user._id }
      };
      console.log("play bad",payload);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/submissions`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("payload", payload);
      const submission = response?.data?.data;

      if (onSubmissionSuccess) {
        onSubmissionSuccess(submission);
      }
      notify(1, 'Code submission Success.', 'Success');
    } catch (error) {
      console.error('Submission failed harder than a freshman in advanced calculus:', error);
    //   notify(2, 'Code submission failed.', 'Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const languageOptions = [
    { value: 'Javascipt', label: 'JavaScript' },
    { value: 'C', label: 'C' },
    { value: 'C++', label: 'C++' },
    { value: 'Java', label: 'Java' },
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
            type="primary"
            icon={<CloudUploadOutlined />}
            onClick={handleSubmitClick}
            loading={isSubmitting}
            disabled={isLoading || !code.trim()}
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