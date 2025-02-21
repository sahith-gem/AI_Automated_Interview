// import axios from 'axios';



// api.js
import axios from 'axios';


// Place your Gemini API Key for testing in local machine ex const API_KEY = 'AsdgfhghIXXx5CQ_JFE';
//For Production purpose place the keyh in environment variables for windows OS
const API_KEY = 'GEMINI_API_KEY';

export const fetchCodingQuestions = async (jd, skills, difficulty = "easy", count = 2) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `Generate ${count} ${difficulty}-level coding interview questions for a ${jd} role and with skills ${skills}.
For each question, provide:
• title: a short title for the problem,
• problemStatement: a detailed problem statement including constraints and sample input/output,
• diagram: a description or URL for a diagram if available (or an empty string if not).
Return the output as a JSON code block formatted exactly as follows:

\`\`\`json
{
  "problems": [
    {
      "title": "Title of Problem",
      "problemStatement": "Detailed problem statement including constraints and examples.",
      "diagram": "Diagram description or URL (if available, else empty string)."
    }
    // ... more problems
  ]
}
\`\`\`

Do not include any additional text.`
          }]
        }]
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching coding questions:', error);
    throw error;
  }
};



export const analyzeCodingAnswer = async (answers) => {
  try {
    const answerText = answers
      .map((ans, index) =>
        `Question ${index + 1} Answer (${ans.language}):\n${ans.code}`
      )
      .join('\n\n');

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `Analyze the following coding interview answers and produce an analysis in the exact format below:

Overall Efficiency: <percentage>

Areas for Improvement:
1. First improvement point
2. Second improvement point
...

Do not output any additional text or explanation.

${answerText}`
          }]
        }]
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error('Error analyzing coding answer:', error);
    throw error;
  }
};
