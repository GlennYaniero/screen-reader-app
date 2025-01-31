import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const ScreenReader = () => {
  // State to store the user-input text
  const [text, setText] = useState("");
  // State to track if speech is currently active
  const [isSpeaking, setIsSpeaking] = useState(false);
  // State to control speech rate
  const [rate, setRate] = useState(1);
  // State to store available voices
  const [voices, setVoices] = useState([]);
  // State to track the selected voice
  const [selectedVoice, setSelectedVoice] = useState(null);
  
  // Speech synthesis API instance
  const synth = window.speechSynthesis;
  let utterance = new SpeechSynthesisUtterance(text);

  useEffect(() => {
    // Load available voices when the component mounts
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      setSelectedVoice(availableVoices[0] || null);
    };
    loadVoices();
    synth.onvoiceschanged = loadVoices;

    return () => {
      synth.cancel(); // Stop any ongoing speech when unmounting
    };
  }, []);

  const startReading = () => {
    if (text.trim() === "") return; // Prevent empty text reading
    synth.cancel(); // Cancel any ongoing speech before starting new
    utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    // Event handlers for speech synthesis
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => console.error("Speech synthesis error:", event);
    
    synth.speak(utterance); // Start speech
  };

  const pauseReading = () => {
    synth.pause(); // Pause speech synthesis
  };

  const resumeReading = () => {
    synth.resume(); // Resume paused speech
  };

  const stopReading = () => {
    synth.cancel(); // Stop speech and reset state
    setIsSpeaking(false);
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-gray-100 rounded-xl shadow-lg">
      {/* Textarea for user input */}
      <textarea
        className="w-full p-2 border rounded-md"
        rows="4"
        placeholder="Enter text to read..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      
      {/* Voice selection dropdown */}
      <div className="mt-2">
        <label className="block">Voice:</label>
        <select
          className="w-full p-2 border rounded-md"
          onChange={(e) => setSelectedVoice(voices.find(v => v.name === e.target.value))}
          value={selectedVoice?.name || ""}
        >
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>{voice.name}</option>
          ))}
        </select>
      </div>
      
      {/* Control buttons */}
      <div className="flex gap-2 mt-2">
        <Button onClick={startReading} disabled={isSpeaking}>Read</Button>
        <Button onClick={pauseReading}>Pause</Button>
        <Button onClick={resumeReading}>Resume</Button>
        <Button onClick={stopReading}>Stop</Button>
      </div>
      
      {/* Speech rate slider */}
      <div className="mt-4">
        <label className="block">Speed:</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={rate}
          onChange={(e) => setRate(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default ScreenReader;

