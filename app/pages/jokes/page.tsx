"use client"
import React, { useState } from 'react';
import Select from 'react-select';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  RefreshRounded, 
  ContentCopyRounded,
  CheckCircleOutlineRounded,
  EmojiEmotions
} from '@mui/icons-material';

interface OptionType {
  value: string;
  label: string;
}

interface FormDataType {
  jokeType: OptionType | null;
  audience: OptionType | null;
  length: OptionType | null;
  language: OptionType | null;
  topic: OptionType | null;
  style: OptionType | null;
  complexity: OptionType | null;
}

interface JokeType {
    type?: string;
    setup?: string;
    punchline?: string;
    content?: string;
    question?: string;
    answer?: string;
    translation?: string;

  }
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export default function JokeGenerator() {
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedJokes, setGeneratedJokes] = useState<JokeType[]>([]);  
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    jokeType: null,
    audience: null,
    length: null,
    language: null,
    topic: null,
    style: null,
    complexity: null
  });

  const jokeTypeOptions: OptionType[] = [
    { value: 'wordplay', label: 'Wordplay/Puns' },
    { value: 'riddle', label: 'Riddles' },
    { value: 'knockknock', label: 'Knock-Knock' },
    { value: 'situational', label: 'Situational Comedy' },
    { value: 'oneliners', label: 'One-Liners' },
    { value: 'animal', label: 'Animal Jokes' },
    { value: 'sciencejokes', label: 'Science Jokes' },
    { value: 'dadJokes', label: 'Dad Jokes' }
  ];

  const audienceOptions: OptionType[] = [
    { value: 'children', label: 'Children (Ages 5-12)' },
    { value: 'family', label: 'Family-Friendly' },
    { value: 'educational', label: 'Educational Setting' },
    { value: 'workplace', label: 'Workplace Appropriate' }
  ];

  const lengthOptions: OptionType[] = [
    { value: 'short', label: 'Short (One-liner)' },
    { value: 'medium', label: 'Medium (Setup and Punchline)' },
    { value: 'long', label: 'Long (Story-Style)' }
  ];

  const languageOptions: OptionType[] = [
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'italian', label: 'Italian' },
    { value: 'hindi', label: 'Hindi' }

  ];

  const topicOptions: OptionType[] = [
    { value: 'school', label: 'School/Learning' },
    { value: 'animals', label: 'Animals/Nature' },
    { value: 'food', label: 'Food/Cooking' },
    { value: 'sports', label: 'Sports/Games' },
    { value: 'science', label: 'Science/Space' },
    { value: 'technology', label: 'Technology' },
    { value: 'music', label: 'Music/Art' },
    { value: 'weather', label: 'Weather' }
  ];

  const styleOptions: OptionType[] = [
    { value: 'clean', label: 'Clean Humor' },
    { value: 'silly', label: 'Silly/Goofy' },
    { value: 'clever', label: 'Clever/Smart' },
    { value: 'educational', label: 'Educational' }
  ];

  const complexityOptions: OptionType[] = [
    { value: 'simple', label: 'Simple (Easy to Understand)' },
    { value: 'moderate', label: 'Moderate (Some Wordplay)' },
    { value: 'complex', label: 'Complex (Clever Reasoning)' }
  ];

  const createPrompt = (data: FormDataType): string => {
    return `Generate 6 family-friendly, appropriate jokes based on these parameters:

Format Guidelines:
- Joke Type: ${data.jokeType?.label}
- Target Audience: ${data.audience?.label}
- Length: ${data.length?.label}
- Language: ${data.language?.label}
- Topic: ${data.topic?.label}
- Style: ${data.style?.label}
- Complexity: ${data.complexity?.label}

Content Requirements:
1. All jokes must be completely family-friendly and appropriate for all ages
2. No content involving:
   - Sensitive topics or stereotypes
   - Physical appearances or disabilities
   - Cultural or religious references
   - Violence or scary elements
   - Inappropriate or adult themes

Style Guidelines:
1. Focus on wordplay, clever connections, and fun observations
2. Include educational elements when possible
3. Keep language simple and clear
4. For non-English jokes, include translations
5. Ensure punchlines are age-appropriate
6. Use positive and uplifting themes

Please return the jokes as a JSON array of objects with the following structure based on joke type:

For standard jokes:
{
  "type": "standard",
  "setup": "setup text",
  "punchline": "punchline text"
}

For one-liners:
{
  "type": "oneliner",
  "content": "joke text"
}

For riddles:
{
  "type": "riddle",
  "question": "riddle question",
  "answer": "riddle answer"
}

For non-English jokes, include a translation field:
{
  "type": "standard",
  "setup": "setup in foreign language",
  "punchline": "punchline in foreign language",
  "translation": "English translation of the complete joke"
}`;
  };


  const handleGenerateJokes = async () => {
    setLoading(true);
    try {
      const prompt = createPrompt(formData);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
  
      try {
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        if (!cleanedText.startsWith('{') && !cleanedText.startsWith('[')) {
          throw new Error("Generated response is not JSON-formatted");
        }
  
        const data = JSON.parse(cleanedText);
        const jokes = Array.isArray(data) ? data : data.jokes;
        
        if (Array.isArray(jokes)) {
          setGeneratedJokes(jokes);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (jsonError) {
        console.error("Failed to parse JSON:", jsonError);
        alert("Failed to process the generated jokes. Please ensure the response format is correct.");
      }
    } catch (error) {
      console.error("Error generating jokes:", error);
      alert("There was an error generating jokes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatJokeForDisplay = (joke: JokeType): string => {
    if (joke.content) {
      return joke.content;
    } else if (joke.setup && joke.punchline) {
      return `${joke.setup}\n${joke.punchline}`;
    } else if (joke.question && joke.answer) {
      return `Q: ${joke.question}\nA: ${joke.answer}`;
    }
    return "Invalid joke format";
  };

  const formatJokeForCopy = (joke: JokeType): string => {
    let formattedJoke = formatJokeForDisplay(joke);
    if (joke.translation) {
      formattedJoke += `\n\nEnglish Translation:\n${joke.translation}`;
    }
    return formattedJoke;
  };

  const handleCopyJoke = (joke: JokeType, index: number) => {
    navigator.clipboard.writeText(formatJokeForCopy(joke));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleReset = () => {
    setFormData({
      jokeType: null,
      audience: null,
      length: null,
      language: null,
      topic: null,
      style: null,
      complexity: null
    });
    setGeneratedJokes([]);
    setCopiedIndex(null);
  };

  const isFormValid = () => {
    return (
      formData.jokeType !== null &&
      formData.audience !== null &&
      formData.length !== null &&
      formData.language !== null &&
      formData.topic !== null
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <div className="flex items-center gap-2">
              <EmojiEmotions className="text-pink-500" />
              <h1 className="text-3xl font-bold text-gray-800">Family-Friendly Joke Generator</h1>
            </div>
            <button
              onClick={handleReset}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-all"
              aria-label="Reset form"
            >
              <RefreshRounded />
            </button>
          </div>

          <div className="space-y-6">
            {/* Primary Selections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Joke Type
                </label>
                <Select
                  options={jokeTypeOptions}
                  value={formData.jokeType}
                  onChange={(selected) => setFormData(prev => ({ ...prev, jokeType: selected }))}
                  className="text-sm"
                  placeholder="Select joke type..."
                  instanceId="joke-type-select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <Select
                  options={audienceOptions}
                  value={formData.audience}
                  onChange={(selected) => setFormData(prev => ({ ...prev, audience: selected }))}
                  className="text-sm"
                  placeholder="Select target audience..."
                  instanceId="audience-select"
                />
              </div>
            </div>

            {/* Additional Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Length
                </label>
                <Select
                  options={lengthOptions}
                  value={formData.length}
                  onChange={(selected) => setFormData(prev => ({ ...prev, length: selected }))}
                  className="text-sm"
                  placeholder="Select length..."
                  instanceId="length-select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <Select
                  options={languageOptions}
                  value={formData.language}
                  onChange={(selected) => setFormData(prev => ({ ...prev, language: selected }))}
                  className="text-sm"
                  placeholder="Select language..."
                  instanceId="language-select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic
                </label>
                <Select
                  options={topicOptions}
                  value={formData.topic}
                  onChange={(selected) => setFormData(prev => ({ ...prev, topic: selected }))}
                  className="text-sm"
                  placeholder="Select topic..."
                  instanceId="topic-select"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Style
                </label>
                <Select
                  options={styleOptions}
                  value={formData.style}
                  onChange={(selected) => setFormData(prev => ({ ...prev, style: selected }))}
                  className="text-sm"
                  placeholder="Select style..."
                  instanceId="style-select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complexity
                </label>
                <Select
                  options={complexityOptions}
                  value={formData.complexity}
                  onChange={(selected) => setFormData(prev => ({ ...prev, complexity: selected }))}
                  className="text-sm"
                  placeholder="Select complexity..."
                  instanceId="complexity-select"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateJokes}
              disabled={loading || !isFormValid()}
              className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating Jokes...' : 'Generate Jokes'}
            </button>
          </div>

          {/* Generated Jokes Display */}
          {generatedJokes.length > 0 && (
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Generated Jokes</h2>
              <div className="grid gap-4">
                {generatedJokes.map((joke, index) => (
                  <div 
                    key={index} 
                    className="p-4 border border-gray-200 rounded-lg hover:border-pink-200 transition-all bg-white shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-grow">
                        <p className="text-gray-800 whitespace-pre-line">
                          {formatJokeForDisplay(joke)}
                        </p>
                        {joke.translation && (
                          <p className="mt-2 text-gray-600 italic">
                            English Translation:
                            <br />
                            {joke.translation}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleCopyJoke(joke, index)}
                        className="ml-2 text-gray-500 hover:text-pink-500 transition-colors flex-shrink-0"
                        aria-label="Copy joke"
                      >
                        {copiedIndex === index ? 
                          <CheckCircleOutlineRounded className="text-green-500" /> : 
                          <ContentCopyRounded />
                        }
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}