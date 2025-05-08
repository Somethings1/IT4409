import React from 'react';

const Description = ({ problem, testCases = [] }) => {
  if (!problem) return <div>No problem provided. Why are we even here?</div>;

  return (
    <div className="problem-container">
      <h1>{problem.title}</h1>

      <div className={`difficulty-badge ${problem.difficulty?.toLowerCase()}`}>
        {problem.difficulty}
      </div>

      <div className="problem-description-container">
        <div className="problem-description left-aligned">
          <h3>Description</h3>
          <p className="problem-description">
            {problem.description.length > 100 ? (
              <span
                dangerouslySetInnerHTML={{
                  __html: problem.description.substring(0, 100) + '...',
                }}
              />
            ) : (
              <span
                dangerouslySetInnerHTML={{ __html: problem.description }}
              />
            )}
          </p>
        </div>
      </div>

      <div className="problem-examples flush-left">
        <h3>Examples</h3>
        {testCases.length > 0 ? (
          <div className="example">
            <p><strong>Input:</strong> {testCases[0].input}</p>
            <p><strong>Output:</strong> {testCases[0].output}</p>
            <p>
              <strong>Explanation:</strong>{' '}
              {problem?.example?.explanation ?? 'No explanation.'}
            </p>
          </div>
        ) : (
          <p>Wow, no examples? How generous.</p>
        )}
      </div>

      <div className="problem-constraints left-aligned">
        <h3>Constraints</h3>
        <p>{problem.constraints}</p>
      </div>
    </div>
  );
};

export default Description;

