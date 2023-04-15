
export const getResponse = async (input) => {
    const response = await fetch("http://localhost:3001/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: input }),
    });
    const data = await response.json();
    return data;
  };


export const voiceTranslate = async (input) => {
    try {
        const response = await fetch('http://localhost:3001/api/uberduck', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ speech: input }),
        });
        if (!response.ok) {
            throw new Error('Error fetching WAV file');
        }
        const data = await response.json();
        const audioBlob = new Blob([new Uint8Array([...atob(data.audio)].map(c => c.charCodeAt(0)))], {type: 'audio/wav'});
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
    } catch (error) {
        console.error(error);
    }
};

  
