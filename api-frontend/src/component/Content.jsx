import React, { useState, useEffect } from "react";
import { Send, Bot, Loader2, Sun, Moon } from "lucide-react";
import axios from "axios";


const useTypewriter = (text, speed = 30) => {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!text) return;

    setIsTyping(true);
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText((prev) => prev + text.charAt(index));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayText, isTyping };
};

const Content = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { displayText, isTyping } = useTypewriter(response);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const fetchGeminiResponse = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setResponse(""); // Clear previous response
    try {
      const res = await axios.post("http://localhost:5000/api/gemini", { prompt });
      setResponse(res.data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error(error);
      setResponse("Sorry, something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      fetchGeminiResponse();
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 
      ${isDarkMode 
        ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
        : 'bg-gradient-to-b from-gray-50 to-gray-100'}`}>
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Header with Dark Mode Toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bot className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Google Gemini Chat
            </h2>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-colors
              ${isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Chat Interface */}
        <div className={`rounded-lg shadow-lg p-6 transition-colors duration-200
          ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Textarea Section */}
          <div className="mb-6">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter your prompt here..."
                className={`w-full min-h-[120px] p-4 rounded-lg transition-colors duration-200
                  ${isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/20' 
                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-200'} 
                  border focus:ring-2 outline-none resize-none`}
              />
              <button
                onClick={fetchGeminiResponse}
                disabled={isLoading || !prompt.trim()}
                className={`absolute bottom-4 right-4 p-2 rounded-full transition-colors
                  ${isDarkMode 
                    ? 'bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600' 
                    : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300'}
                  disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <Send className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Response Section */}
          {response && (
            <div className={`rounded-lg p-6 border transition-colors duration-200
              ${isDarkMode 
                ? 'bg-gray-700 border-gray-600' 
                : 'bg-gray-50 border-gray-100'}`}>
              <h3 className={`font-semibold mb-3 flex items-center gap-2
                ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                <Bot className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                Response
                {isTyping && (
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"/>
                )}
              </h3>
              <div className={`whitespace-pre-wrap ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {displayText}
                {isTyping && (
                  <span className="inline-block w-1 h-4 ml-1 bg-current animate-pulse"/>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Content;