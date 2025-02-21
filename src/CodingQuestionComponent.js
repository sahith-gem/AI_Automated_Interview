// CodingQuestionComponent.js
import React, { useState } from 'react';

const CodingQuestionComponent = ({ question, currentIndex, total, onNext, isSubmitting }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('Python'); // default language

  const handleCodeChange = (e) => setCode(e.target.value);
  const handleLanguageChange = (e) => setLanguage(e.target.value);

  const handleNext = () => {
    if (code.trim() === '') {
      alert("Please provide a code answer before proceeding.");
      return;
    }
    onNext({ code, language });
    setCode('');
    setLanguage('Python'); // reset for next question
  };

  return (
    <div>
      <h2>Coding Question {currentIndex + 1} of {total}</h2>
      <h3>{question.title}</h3>
      <p>{question.statement}</p>
      {question.diagram && question.diagram.trim() !== '' && (
        <div>
          <p><strong>Diagram:</strong></p>
          <p>{question.diagram}</p>
        </div>
      )}
      <div>
        <label>
          Choose Language: 
          <select value={language} onChange={handleLanguageChange} disabled={isSubmitting}>
            <option value="Python">Python</option>
            <option value="Java">Java</option>
            <option value="SQL">SQL</option>
            <option value="C">C</option>
            <option value="C++">C++</option>
            <option value="Javascript">JavaScript</option>
            <option value="Pseudocode">Pseudocode</option>
          </select>
        </label>
      </div>
      <div>
        <textarea
          value={code}
          onChange={handleCodeChange}
          rows={10}
          cols={70}
          placeholder="Write your code answer here..."
          disabled={isSubmitting}
        />
      </div>
      <button onClick={handleNext} disabled={isSubmitting}>
        {currentIndex === total - 1 ? "Submit Code Answer" : "Next Question"}
      </button>
    </div>
  );
};

export default CodingQuestionComponent;
