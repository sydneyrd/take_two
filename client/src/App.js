import { useState, useEffect } from 'react';
import './App.css';
import './LoadingEllipsis.css';
import { LoadingEllipsis } from './LoadingEllipses';
import { getResponse, voiceTranslate } from './manager';
import {personality} from './personality/bmo';
import {VoiceToText} from './VoiceToText'



function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(personality);
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFace, setShowFace] = useState('');
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);          
            
  
  function removeBracketContent(str) {
              const regex = /\[(.*?)\]/g;
              const strWithoutBracket = str.replace(regex, '').trim();
              return [strWithoutBracket, regex.exec(str)?.[1] ?? ''];
            }
            

//   const stopListening = async () => {
//     if (recognition) {
//      await setListening(false);
//       recognition.stop();
//     }
//   };

const stopListening = async (callback) => {
    if (recognition) {
      recognition.onend = () => {
        if (callback) {
          callback();
        }
      };
      await setListening(false);
      recognition.stop();
    }
  };
  
  
    useEffect(() => {
      const processChatbotResponse = async () => {
        
        if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
          setIsLoading(true);
          const chatresponse = await getResponse(messages);
          const [stringWithoutEmoticon, emoticon] = removeBracketContent(chatresponse.message.content);
          console.log(emoticon)
          setShowFace(emoticon)
          const res = await voiceTranslate(stringWithoutEmoticon);
          console.log(res)
          setMessages((prevMessages) => [...prevMessages, chatresponse.message]);
          setIsLoading(false);
        }
      };
      processChatbotResponse();
      
    }, [messages]);
  
 //on first render, have a pop up that gives instructions/link? 
 
    // const handleClick = async (e) => {
    //   e.preventDefault();
    //   if (listening) {
    //     await stopListening();
    //   }
    //   let copy = { role: "user", content: "" };
    //   if (input !== "") {
    //     copy = { role: "user", content: input };
    //   }
    //   if (transcript !== "") {
    //     copy = { role: "user", content: transcript };
    //   }
    //   setMessages((prevMessages) => [...prevMessages, copy]);
    //   setInput("");
    //   setTranscript("");
    // };
    const handleClick = async (e) => {
        e.preventDefault();
      
        const sendMessage = () => {
          let copy = { role: "user", content: "" };
          if (input !== "") {
            copy = { role: "user", content: input };
          } else if (transcript !== "") {
            copy = { role: "user", content: transcript };
          }
          setMessages((prevMessages) => [...prevMessages, copy]);
          setInput("");
          setTranscript("");
        };
      
        if (listening) {
          await stopListening();
          setTimeout(() => {
            sendMessage();
          }, 1000); // Wait for 1 second
        } else {
          sendMessage();
        }
      };
      
      

return (
  <div className="App">

    <div className="face">
      
    {isLoading ? <LoadingEllipsis /> :      <div className="expression">
                {showFace}
            </div>}
    </div>

    <div className="input--and--button">
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
      <button className='send--text' onClick={(click) => handleClick(click)}>▶</button>
    </div>
    <div className="buttons--container">
    <VoiceToText stopListening={stopListening} recognition={recognition} setRecognition={setRecognition} setTranscript={setTranscript}  listening={listening} setListening={setListening}/>
  </div></div>
);
      }

export default App;
