import React, { useState, useEffect } from 'react';
import { Tabs, Typography, Tag, Input, Button, List, Card, Empty, Divider, Modal, Spin } from 'antd';
import { SendOutlined, ReloadOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react'; // For showing code in submission detail
import axios from 'axios'; // For fetching
import { notify } from '../../../Notification/notification'; // Assuming you have this for user feedback
import { useAuth } from '../../../introduce/useAuth.jsx';


const { TabPane } = Tabs;
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const Description = ({
    problem,
    example,
    onPostTextCommentSuccess,
    triggerOpenSubmission
}) => {
    const { user } = useAuth();

    const [activeTabKey, setActiveTabKey] = useState('description');
    const [newCommentInput, setNewCommentInput] = useState('');

    // State for fetched data
    const [textComments, setTextComments] = useState([]);
    const [codeSubmissions, setCodeSubmissions] = useState([]);

    // State for loading indicators for tabs
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);

    // State to track if data has been fetched at least once
    const [commentsFetched, setCommentsFetched] = useState(false);
    const [submissionsFetched, setSubmissionsFetched] = useState(false);

    // Submission Detail Modal state
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedSubmissionForDetail, setSelectedSubmissionForDetail] = useState(null);

    const getAuthToken = () => localStorage.getItem("token");

    useEffect(() => {
        if (triggerOpenSubmission) {
            setActiveTabKey("submissions");
        }
    }, [triggerOpenSubmission]);
    ///////
    // Init fetching
    ///////
    useEffect(() => {
        // console.log("user",user);
        if (problem?.id && activeTabKey === 'comments' && !commentsFetched) {
            fetchComments();
        }
        if (problem?.id && activeTabKey === 'submissions' && !submissionsFetched) {
            fetchSubmissions();
        }
    }, [activeTabKey, problem?.id, commentsFetched, submissionsFetched]); // Fetch when tab becomes active

    // --- Fetching Logic ---
    const fetchComments = async (forceRefresh = false) => {
        if (!problem?.id || (commentsFetched && !forceRefresh)) return;

        setIsLoadingComments(true);
        try {
            const token = getAuthToken();

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/comments?filter=problem.id:${problem.id}&sort=createdAt,desc`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const comments = await response.data.data.result || [];
            // console.log("comment",comments);
            const formattedComments = comments.slice(0, 10).map(c => ({
                id: c.id,
                problemId: c.problem?.id || problem.id,
                content: c.content,
                author: c.user?.name || 'Anonymous',
                email: c.user?.email || 'nobody',
                timestamp: new Date(c.createdAt).toLocaleString(),
            }));

            setTextComments(formattedComments);
            setCommentsFetched(true);

        } catch (error) {
            console.error('Error fetching comments:', error);
            notify(0, 'Failed to load comments.', 'Error');
        } finally {
            setIsLoadingComments(false);
        }
    };


    const fetchSubmissions = async (forceRefresh = false) => {
        if (!problem?.id || (submissionsFetched && !forceRefresh)) return;
        setIsLoadingSubmissions(true);
        try {
            
            const token = getAuthToken();
            // console.log("token",token)
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/submissions?filter=problem.id:${problem.id}&user.id:${user._id}&sort=createdAt,desc`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const fetchedSubmissions = response.data.data.result.map(sub => ({
                ...sub,
                id: sub.id || `sub-${Math.random()}`, // ensure id
                timestamp: sub.timestamp || new Date().toLocaleString(),
                // Mocking test case details if not present
                problemTestCasesUsedForThisSubmission: sub.problemTestCasesUsedForThisSubmission ||
                    (sub.testCases ? sub.testCases.map((tc, idx) => ({ ...tc, passed: sub.passedTests > idx })) : []),
            }));
            setCodeSubmissions(fetchedSubmissions);
            setSubmissionsFetched(true);
        } catch (error) {
            console.error('Error fetching submissions:', error);
            // notify(0, 'Failed to load submissions.', 'Error'); // Can be noisy if endpoint is not ready
            setCodeSubmissions([]); // Clear or keep old on error?
        } finally {
            setIsLoadingSubmissions(false);
        }
    };

    const handlePostCommentClick = async () => {
        if (!newCommentInput.trim() || !problem?.id) return;

        try {
            const token = getAuthToken(); // however you're storing your auth
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/comments`,
                {
                    content: newCommentInput,
                    problem: { id: problem.id },
                    user: { id: user._id }
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const res = await response.data.data;
            const newPostedComment = {
                id: res.id,
                problemId: problem.id,
                content: res.content,
                author: user.name || 'Anonymous',
                // email: user.email|| 'nobody',
                timestamp: new Date(res.createdAt).toLocaleString(),
            }

            setTextComments(prev => [newPostedComment, ...prev]);
            setNewCommentInput('');
            notify(1, 'Comment posted!', 'Success');

            if (onPostTextCommentSuccess) {
                onPostTextCommentSuccess(newPostedComment);
            }

        } catch (error) {
            console.error('Error posting comment:', error);
            notify(0, 'Failed to post comment.', 'Error');
        }
    };


    const handleViewSubmissionClick = (submission) => {
        setSelectedSubmissionForDetail(submission);
        setIsDetailModalVisible(true);
    };

    const closeDetailModal = () => {
        setIsDetailModalVisible(false);
        setSelectedSubmissionForDetail(null);
    };

    const getDifficultyColor = (difficulty) => {
        difficulty = difficulty?.toLowerCase();
        if (difficulty === 'easy') return 'green';
        if (difficulty === 'medium') return 'orange';
        if (difficulty === 'hard') return 'red';
        return 'default';
    };

    if (!problem || !problem.id) {
        return <Card style={{ padding: 20, textAlign: 'center' }}><Empty description="No problem selected or data available." /></Card>;
    }

    const submissionDetailTestCases = selectedSubmissionForDetail?.problemTestCasesUsedForThisSubmission || [];

    return (
        <Card style={{ height: '100%', overflowY: 'auto' }} bodyStyle={{ padding: '16px' }}>
            <Title level={4} style={{ marginTop: 0 }}>{problem.id}. {problem.title}</Title>
            {problem.difficulty && (
                <Tag color={getDifficultyColor(problem.difficulty)} style={{ marginBottom: '16px' }}>
                    {problem.difficulty}
                </Tag>
            )}

            <Tabs activeKey={activeTabKey} onChange={setActiveTabKey}>
                <TabPane tab="Description" key="description">
                    {/* ... Description, Example, Constraints (same as before) ... */}
                    <Typography>
                        <Title level={5}>Problem Description</Title>
                        {problem.description ? (
                            <Paragraph>
                                <span dangerouslySetInnerHTML={{ __html: problem.description }} />
                            </Paragraph>
                        ) : <Text type="secondary">No description available.</Text>}

                        {example && (
                            <>
                                <Divider />
                                <Title level={5}>Example</Title>
                                <Card size="small" style={{ backgroundColor: '#f9f9f9' }}>
                                    {example.input && <><Text strong>Input:</Text> <Text code>{example.input}</Text><br /></>}
                                    {example.output && <><Text strong>Output:</Text> <Text code>{example.output}</Text><br /></>}
                                </Card>
                            </>
                        )}

                        {problem.constraints && (
                            <>
                                <Divider />
                                <Title level={5}>Constraints</Title>
                                <Paragraph>{problem.constraints}</Paragraph>
                            </>
                        )}
                    </Typography>
                </TabPane>

                <TabPane tab="Comments" key="comments">
                    <TextArea
                        rows={3}
                        value={newCommentInput}
                        onChange={(e) => setNewCommentInput(e.target.value)}
                        placeholder="Add a public comment about this problem..."
                        style={{ marginBottom: '10px' }}
                    />
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handlePostCommentClick}
                        disabled={!newCommentInput.trim() || isLoadingComments}
                        loading={isLoadingComments && !commentsFetched} // Show loading on button only during initial fetch
                    >
                        Post Comment
                    </Button>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={() => fetchComments(true)}
                        style={{ marginLeft: 8 }}
                        loading={isLoadingComments}
                        disabled={isLoadingComments}
                    >
                        Refresh
                    </Button>
                    <Divider />
                    <Title level={5} style={{ marginTop: '20px' }}>Posted Comments</Title>
                    {isLoadingComments ? <div style={{ textAlign: 'center', padding: '20px' }}><Spin /></div> :
                        textComments && textComments.length > 0 ? (
                            <List
                                itemLayout="horizontal"
                                dataSource={textComments}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            // title={<Text strong>{item.author} <Text type="secondary" style={{ fontSize: '0.8em' }}>{item.timestamp}</Text></Text>}
                                            title={
                                                    <Text strong>
                                                        {item.author}
                                                        {item.email === user.email && <Text type="secondary"> (you)</Text>}
                                                        <Text type="secondary" style={{ fontSize: '0.8em' }}> {item.timestamp}</Text>
                                                    </Text>
                                                    }

                                            description={<Paragraph style={{ whiteSpace: 'pre-wrap' }}>{item.content}</Paragraph>}
                                        />
                                    </List.Item>
                                )}
                            />
                        ) : <Empty description={commentsFetched ? "No comments yet." : "Click refresh or comments will load automatically."} />}
                </TabPane>

                <TabPane tab="Submissions" key="submissions">
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={() => fetchSubmissions(true)}
                        style={{ marginBottom: 10 }}
                        loading={isLoadingSubmissions}
                        disabled={isLoadingSubmissions}
                    >
                        Refresh My Submissions
                    </Button>
                    <Divider style={{ marginTop: 0 }} />
                    {isLoadingSubmissions ? <div style={{ textAlign: 'center', padding: '20px' }}><Spin /></div> :
                        codeSubmissions && codeSubmissions.length > 0 ? (
                            <List
                                itemLayout="horizontal"
                                dataSource={codeSubmissions}
                                renderItem={item => (
                                    <List.Item
                                        actions={[
                                            <Button type="link" onClick={() => handleViewSubmissionClick(item)}>
                                                View Details
                                            </Button>
                                        ]}
                                    >
                                        <List.Item.Meta
                                            title={<>
                                                <Text strong>Submission ID: {item.id}</Text>
                                                <Tag
                                                    color={item.status === 'Accepted' ? 'success' :
                                                        item.status === 'Pending' ? 'processing' :
                                                            item.status && (item.status.includes('Failed') || item.status.includes('Error')) ? 'error' :
                                                                item.status === 'Partial' ? 'warning' :
                                                                    'default'}
                                                    style={{ marginLeft: 8 }}
                                                >
                                                    {item.status || "N/A"}
                                                </Tag>
                                            </>}
                                            description={
                                                <>
                                                    {item.timestamp} - {item.language} <br />
                                                    Result: {item.rightTestcase ?? 'N/A'} / {item.totalTestcase ?? 'N/A'}
                                                    {item.submissionNote && <><br /><Text italic>Note: {item.submissionNote.substring(0, 30)}{item.submissionNote.length > 30 ? '...' : ''}</Text></>}
                                                </>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        ) : <Empty description={submissionsFetched ? "No code submissions yet for this problem." : "Click refresh or submissions will load automatically."} />}
                </TabPane>
            </Tabs>

            {/* Submission Detail Modal (same as before) */}
            {selectedSubmissionForDetail && (
                <Modal
                    title={`Submission ID: ${typeof selectedSubmissionForDetail.id === 'string' ? selectedSubmissionForDetail.id.substring(0, 10) : selectedSubmissionForDetail.id}...`}
                    visible={isDetailModalVisible}
                    onCancel={closeDetailModal}
                    footer={[<Button key="close" onClick={closeDetailModal}>Close</Button>]}
                    width={800}
                    bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
                >
                    <Paragraph>
                        <Text strong>Language:</Text> {selectedSubmissionForDetail.language} <br />
                        <Text strong>Timestamp:</Text> {selectedSubmissionForDetail.timestamp} <br />
                        <Text strong>Status:</Text> <Tag color={selectedSubmissionForDetail.status === 'Accepted' ? 'success' : (selectedSubmissionForDetail.status && (selectedSubmissionForDetail.status.includes('Failed') || selectedSubmissionForDetail.status.includes('Error'))) ? 'error' : 'default'}>{selectedSubmissionForDetail.status}</Tag> <br />
                        <Text strong>Result:</Text> {selectedSubmissionForDetail.passedTests} / {selectedSubmissionForDetail.totalTests} passed
                        {selectedSubmissionForDetail.submissionNote && <><br /><Text strong>Note:</Text> <Text italic>{selectedSubmissionForDetail.submissionNote}</Text></>}
                    </Paragraph>
                    <Divider>Submitted Code</Divider>
                    <div style={{ border: '1px solid #f0f0f0', height: '250px' }}>
                        <Editor
                            height="100%"
                            language={selectedSubmissionForDetail.language}
                            value={selectedSubmissionForDetail.code}
                            theme="vs-dark"
                            options={{ readOnly: true, minimap: { enabled: false }, automaticLayout: true, scrollBeyondLastLine: false }}
                        />
                    </div>
                    <Divider>Test Case Results</Divider>
                    {selectedSubmissionForDetail.status === 'Pending' ? (
                        <Paragraph>Evaluation results are not yet available.</Paragraph>
                    ) : submissionDetailTestCases && submissionDetailTestCases.length > 0 ? (
                        <List
                            dataSource={submissionDetailTestCases.map((tc, index) => ({
                                ...tc,
                                passed: tc.passed !== undefined ? tc.passed : (selectedSubmissionForDetail.passedTests > index)
                            }))}
                            renderItem={(tc, index) => (
                                <List.Item>
                                    <Card size="small" title={`Test Case ${index + 1}`} style={{ width: '100%', backgroundColor: tc.passed ? '#f6ffed' : '#fff1f0' }}>
                                        <Text strong>Input:</Text> <Text code style={{ whiteSpace: 'pre-wrap' }}>{tc.input}</Text><br />
                                        <Text strong>Expected Output:</Text> <Text code style={{ whiteSpace: 'pre-wrap' }}>{tc.output}</Text><br />
                                        {!tc.passed && tc.actualOutput && <><Text strong>Your Output:</Text> <Text code style={{ whiteSpace: 'pre-wrap' }}>{tc.actualOutput}</Text><br /></>}
                                        <Text strong>Status:</Text> {tc.passed ? <Tag color="success">Pass</Tag> : <Tag color="error">Fail</Tag>}
                                    </Card>
                                </List.Item>
                            )}
                        />
                    ) : (
                        <Paragraph>Detailed test case results not available for this submission or status.</Paragraph>
                    )}
                </Modal>
            )}
        </Card>
    );
};

export default Description;
