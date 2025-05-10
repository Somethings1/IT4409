import React from 'react';
import { Card, List, Typography, Empty, Spin } from 'antd';

const { Text, Paragraph } = Typography;

const TestCase = ({
  testCases, // Array of { input, output, id? } - These are the problem's general test cases
  isLoading, // boolean, if parent is fetching these test cases
}) => {
  if (isLoading) {
    return <Card title="Test Cases" size="small" style={{padding: 20, textAlign: 'center', height: '100%'}}><Spin tip="Loading Test Cases..." /></Card>;
  }

  if (!testCases || testCases.length === 0) {
    return (
      <Card title="Test Cases" size="small" style={{height: '100%'}} bodyStyle={{display:'flex', alignItems:'center', justifyContent:'center', height:'calc(100% - 40px)' /* Adjust for card header */}}>
        <Empty description="No test cases available for this problem." />
      </Card>
    );
  }

  return (
    <Card title="Test Cases" size="small" style={{ height: '100%', display: 'flex', flexDirection: 'column' }} bodyStyle={{padding: '0 16px 16px 16px', flexGrow:1, overflowY:'auto'}}>
      <List
        dataSource={testCases}
        renderItem={(testCase, index) => (
          <List.Item style={{padding: '8px 0'}}>
            <div style={{width: '100%'}}>
              <Text strong>Case {index + 1}</Text>
              <Paragraph style={{marginTop: '5px', marginBottom: '2px', backgroundColor: '#f7f7f7', padding: '4px 8px', borderRadius: '4px'}}>
                <Text strong>Input:</Text> <Text code style={{whiteSpace: 'pre-wrap', display: 'block'}}>{testCase.input}</Text>
              </Paragraph>
              <Paragraph style={{marginBottom: '5px', backgroundColor: '#f7f7f7', padding: '4px 8px', borderRadius: '4px'}}>
                <Text strong>Expected Output:</Text> <Text code style={{whiteSpace: 'pre-wrap', display: 'block'}}>{testCase.output}</Text>
              </Paragraph>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default TestCase;
