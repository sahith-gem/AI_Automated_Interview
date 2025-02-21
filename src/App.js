import React, { useEffect, useState } from 'react';
import CodingQuestionComponent from './CodingQuestionComponent';
import CodingResultComponent from './CodingResultComponent';
import { fetchCodingQuestions, analyzeCodingAnswer } from './api';

const InterviewApp = () => {
  const [codingQuestions, setCodingQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch coding questions from the API
    const jd = 'Graduate Apprintice Developer';
    const skills =['core java','SQL',]
    fetchCodingQuestions(jd,skills, "easy", 2)
      .then((data) => {
        console.log("Fetched coding questions:", data);
        let allQuestions = [];

        if (data.candidates && data.candidates.length > 0) {
          data.candidates.forEach((candidate) => {
            candidate.content.parts.forEach((part) => {
              try {
                // Extract JSON content from Markdown-like text format
                const jsonMatch = part.text.match(/```json\n([\s\S]*?)\n```/);
                if (jsonMatch) {
                  const jsonString = jsonMatch[1]; // Extract the JSON content
                  const parsedData = JSON.parse(jsonString); // Parse JSON

                  if (parsedData.problems) {
                    parsedData.problems.forEach((problem) => {
                      allQuestions.push({
                        title: problem.title || "Untitled Problem",
                        statement: problem.problemStatement || "No description available.",
                        diagram: problem.diagram || "",
                      });
                    });
                  }
                } else {
                  console.error("No valid JSON found in response:", part.text);
                }
              } catch (error) {
                console.error("Error parsing JSON from response:", error);
              }
            });
          });
        }

        console.log("Processed Questions:", allQuestions);
        setCodingQuestions(allQuestions);
      })
      .catch((error) => {
        console.error("Error fetching coding questions:", error);
      });
  }, []);

  const handleNextAnswer = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < codingQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      if (isSubmitting) return;
      setIsSubmitting(true);
      analyzeCodingAnswer(newAnswers)
        .then((analysisResult) => {
          const analysisText = analysisResult.candidates[0].content.parts[0].text;
          console.log('Coding analysis text:', analysisText);

          // Extract overall efficiency using the exact label "Overall Efficiency:"
          const efficiencyMatch = analysisText.match(/Overall Efficiency:\s*(\d+%)/i);
          const efficiency = efficiencyMatch ? efficiencyMatch[1] : 'N/A';

          // Extract improvements from "Areas for Improvement:" onward
          const improvementMatch = analysisText.match(/Areas for Improvement:\s*((?:.|\n)*)/i);
          let improvements = improvementMatch ? improvementMatch[1].trim() : '';

          // Remove any extra text beyond the improvement list if present
          const extraIndex = improvements.indexOf("Overall Efficiency:");
          if (extraIndex !== -1) {
            improvements = improvements.substring(0, extraIndex).trim();
          }

          // Insert newlines before numbered points.
          // This regex finds occurrences like "1. " and ensures there's a newline before them.
          let improvementsFormatted = improvements.replace(/(\d+\.\s+)/g, '\n$1').trim();

          setResult({ efficiency, improvements: improvementsFormatted });
        })
        .catch((err) => {
          console.error('Error analyzing coding answers:', err);
          setError('Failed to analyze coding answers.');
        })
        .finally(() => {
          setIsSubmitting(false);
        });


    }
  };

  if (error) {
    return <div>{error}</div>;
  }
  if (result) {
    return <CodingResultComponent result={result} />;
  }
  if (codingQuestions.length > 0 && currentQuestionIndex < codingQuestions.length) {
    return (
      <div>
        <h1>Coding Interview Questions</h1>
        <CodingQuestionComponent
          question={codingQuestions[currentQuestionIndex]}
          currentIndex={currentQuestionIndex}
          total={codingQuestions.length}
          onNext={handleNextAnswer}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }
  return <div>Loading coding questions...</div>;

};

export default InterviewApp;
