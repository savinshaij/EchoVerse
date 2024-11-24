"use client";
// pages/nouns.js
import { useState } from 'react';
import nlp from "compromise";
export default function NounsExtractor() {
  const [inputText, setInputText] = useState('');
  const [nouns, setNouns] = useState([]);

  const handleExtractNouns = () => {
    const articles = ["a", "an", "the","The","A","An","This","this","that","That",",","It","it"]; // Correct variable name
    const doc = nlp(inputText);
  
    // Extract all pronouns from the input text
    const pronouns = doc.pronouns().out('array');
  
    // Extract all nouns from the input text
    const extractedNouns = doc.nouns().out('text')
   
    // Remove pronouns from the list of nouns
    const nounsWithoutPronouns = extractedNouns.split(' ').filter(word => !pronouns.includes(word.toLowerCase())).filter(word => !articles.includes(word.toLowerCase())).filter(str => /[A-Z]/.test(str)).join(' ');
  //  const result = nlp(nounsWithoutPronouns);
  // .filter(str => /[A-Z]/.test(str))
  const docs = nlp(nounsWithoutPronouns);
  const result = docs.nouns().out('array');
    // Remove articles from the nouns
    // const nounsWithoutArticles = nounsWithoutPronouns.filter(noun => !articles.includes(noun));
  
    // Set the filtered nouns
    setNouns(result);
   console.log(result);
  };
  

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Extract Nouns from Text</h1>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text here..."
        rows={5}
        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
      />
      <br />
      <button
        onClick={handleExtractNouns}
        style={{
          marginTop: '10px',
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Extract Nouns
      </button>
      <div style={{ marginTop: '20px' }}>
        <h2>{nouns}</h2>
       
      </div>
    </div>
  );
}
