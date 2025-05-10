import React, { useState, useEffect } from 'react';
import SplitPane from 'react-split-pane';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Description from './elements/Description';
import CodeEditor from './elements/CodeEditor';
import TestCase from './elements/TestCase';


import './SolveProblemPage.css';

const SolveProblemPage = () => {
    const { state } = useLocation();
    const [testCases, setTestCases] = useState([]);
    const [ submit, setSubmit ] = useState(false);
    const problem = state?.problem || {};

    useEffect(() => {
        const fetchTestCases = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/testcases?filter=problem.id:${problem.id}&page=0&size=10`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const activeTestCases = response.data.data.result
                    .filter(tc => tc.active)
                    .map(tc => ({ input: tc.input, output: tc.output }));

                setTestCases(activeTestCases);
            } catch (error) {
                console.error('Error fetching test cases:', error);
            }
        };

        if (problem?.id) fetchTestCases();
    }, [problem]);

    return (
        <div style={{ height: '90vh', width: '100%', textAlign: 'left' }}>
            <SplitPane split="vertical" defaultSize="50%" minSize={200}>
                <div style={{ overflowY: 'auto', height: '100%' }}>
                    <Description problem={problem} example={testCases[0]} triggerOpenSubmission={submit}/>
                </div>
                <SplitPane split="horizontal" defaultSize="50%" minSize={100}>
                    <div style={{ overflow: 'auto', width: '100%' }}>
                        <CodeEditor problem={problem} onSubmissionSuccess={setSubmit} />
                    </div>
                    <div style={{ overflow: 'auto', height: '100%' }} >
                        <TestCase problem={problem} testCases={testCases} />
                    </div>
                </SplitPane>
            </SplitPane>
        </div>
    );
};

export default SolveProblemPage;

