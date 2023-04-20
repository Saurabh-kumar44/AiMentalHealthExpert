import { useState } from 'react';
import { Configuration, OpenAIApi } from 'openai';
import '../src/app/globals.css';
import './style.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [apiResponse, setApiResponse] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const configuration = new Configuration({
      apiKey: "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",
    });

    const openai = new OpenAIApi(configuration);

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: inputText,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

    setApiResponse(response.data.choices[0].text);
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica');
    doc.setFontSize(12);
    doc.setTextColor(46, 68, 94);
    doc.text(20, 20, 'AI Response');
    const lines = apiResponse.split('\n');
    let y = 40;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      doc.text(20, y, line);
      y += 10;
    }
    doc.save('resolution.pdf');
  };

  return (
    <div className="main-container">
      <div className="form-container">
        <h2 className="form-heading">Share Your Problems</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="input" value={inputText} onChange={handleInputChange} className="form-input" />
          <button type="submit" className="form-button">Submit</button>
        </form>
      </div>
      {apiResponse &&
        <div className="response-container">
          <h2 className="response-heading">Response</h2>
          <div className="response-text" id="response-table">
            {apiResponse.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
          <button className="download-button" onClick={downloadPDF}>Download PDF</button>
        </div>
      }
    </div>
  );
}