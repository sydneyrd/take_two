import React, { useState, useEffect } from 'react';
import './dpad.css'

export const VoiceToText = ({setTranscript,  listening, setListening, recognition, setRecognition, stopListening}) => {

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const WebSpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new WebSpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      setRecognition(recognitionInstance);
    } else {
      console.error('SpeechRecognition not supported by this browser.');
    }
  }, []);

  const startListening = () => {
    setTranscript('')
    if (recognition) {
      setListening(true);
      recognition.start();
      recognition.onresult = (event) => {
        const currentResult = event.results[event.results.length - 1];
        if (currentResult.isFinal) {
          const newTranscript = currentResult[0].transcript;
          setTranscript((prevTranscript) => prevTranscript + " " + newTranscript.trim());
        }
      };
      
    }
  };




  return (
    <>
      <div className="d-pad">
  <div className="d-pad-button up"></div>
  <div className="d-pad-button right"></div>
  <div className="d-pad-button down"></div>
  <div className="d-pad-button left"></div>
  <div className="d-pad-center"></div>
</div>

<div  style={{ display: 'flex', flexWrap: 'wrap' }}>
<div className="voice--container">

</div>

 <button className="voice--button"
      
      onClick={listening ? stopListening : startListening}>
        {listening ? '🛑' : '🎤'}
      </button>
</div>

      </>
  );
};


