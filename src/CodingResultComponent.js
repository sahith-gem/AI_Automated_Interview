import React from 'react';

const CodingResultComponent = ({ result }) => {
  return (
    <div>
      <h3>Coding Answer Analysis Result:</h3>
      <p><strong>Overall Efficiency:</strong> {result.efficiency}</p>
      {result.improvements && (
        <div>
          <h4>Areas for Improvement:</h4>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {result.improvements}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CodingResultComponent;
