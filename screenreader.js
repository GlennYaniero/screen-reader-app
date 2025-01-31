import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const ScreenReader = () => {
  const [text, setText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [rate, setRate] = useState(1);
  const synth = window.speechSynthesis;
  let utterance = new SpeechSynthesisUtterance(text);

  useEffect(() => {
    return () => {
      synth.cancel();
    };
  }, []);

  const startReading = () => {
    if (text.trim() === "") return;
    synth.cancel();
    utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.onend = () => setIsSpeaking(false);
    synth.speak(utterance);
    setIsSpeaking(true);
  };

  const pauseReading = () => {
    synth.pause();
  };

  const resumeReading = () => {
    synth.resume();
  };

  const stopReading = () => {
    synth.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-gray-100 rounded-xl shadow-lg">
      <textarea
        className="w-full p-2 border rounded-md"
        rows="4"
        placeholder="Enter text to read..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex gap-2 mt-2">
        <Button onClick={startReading} disabled={isSpeaking}>Read</Button>
        <Button onClick={pauseReading}>Pause</Button>
        <Button onClick={resumeReading}>Resume</Button>
        <Button onClick={stopReading}>Stop</Button>
      </div>
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