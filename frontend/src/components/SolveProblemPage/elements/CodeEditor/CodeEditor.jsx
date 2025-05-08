import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Select, Button, Space, Card, Input, Spin } from 'antd';
import { PlayCircleOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { useAuth } from '@/components/introduce/useAuth.jsx';
import axios from 'axios';

const { TextArea } = Input;

const CodeEditor = ({
    problem,
    initialCodeByLanguage, // e.g., { javascript: "...", python: "..." }
    isLoading, // General loading state for editor/related actions (e.g. parent is submitting)
    onSubmissionSuccess, // Callback to potentially trigger refresh in DescriptionPane's submission tab
}) => {
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // Local submitting state for button
    const getAuthToken = () => localStorage.getItem("token");
    const { user } = useAuth();

    useEffect(() => {
        if (initialCodeByLanguage && initialCodeByLanguage[language]) {
            setCode(initialCodeByLanguage[language]);
        } else {
            setCode(`// Start your ${language} solution for problem ${problem.id || ''} here`);
        }
    }, [language, initialCodeByLanguage, problem.id]);

    const handleSubmitClick = async () => {
        if (!code?.trim() || !problem?.id || isSubmitting) {
            console.warn('Missing code or problem ID, or already submitting. Calm down.');
            return;
        }

        setIsSubmitting(true);
        try {
            const token = getAuthToken();

            const payload = {
                code,
                language: 'C++',
                problem: { id: problem.id },
                user: { id: user._id }
            };

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

            const submission = response?.data?.data;

            if (onSubmissionSuccess) {
                onSubmissionSuccess(submission);
            }
        } catch (error) {
            console.error('Submission failed harder than a freshman in advanced calculus:', error);
            // Optional: notify(0, 'Code submission failed.', 'Error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const languageOptions = [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'c', label: 'C' },
        { value: 'cpp', label: 'C++' },
        { value: 'java', label: 'Java' },
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
