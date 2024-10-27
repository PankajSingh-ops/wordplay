"use client"
import React, { useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { 
  FormatQuote,
  Refresh,
  ContentCopy,
  CheckCircleOutline,
  Category,
  Psychology,
  Group,
  Palette,
  Settings,
  Timer
} from '@mui/icons-material';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Type definitions
interface SelectOption {
  value: string;
  label: string;
}

interface FormData {
  category: SelectOption | null;
  mood: SelectOption | null;
  audience: SelectOption | null;
  style: SelectOption | null;
  length: SelectOption | null;
  purpose: SelectOption | null;
  topic: string;
  context: string;
}

interface Quote {
  text: string;
  analysis: string;
  usage: string;
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

const QuoteGenerator: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedQuotes, setGeneratedQuotes] = useState<Quote[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    category: null,
    mood: null,
    audience: null,
    style: null,
    length: null,
    purpose: null,
    topic: '',
    context: ''
  });

  const categoryOptions: SelectOption[] = [
    { value: 'motivational', label: 'Motivational' },
    { value: 'philosophical', label: 'Philosophical' },
    { value: 'wisdom', label: 'Wisdom' },
    { value: 'life', label: 'Life' },
    { value: 'success', label: 'Success' },
    { value: 'love', label: 'Love' },
    { value: 'friendship', label: 'Friendship' },
    { value: 'leadership', label: 'Leadership' }
  ];

  const moodOptions: SelectOption[] = [
    { value: 'inspiring', label: 'Inspiring' },
    { value: 'reflective', label: 'Reflective' },
    { value: 'uplifting', label: 'Uplifting' },
    { value: 'empowering', label: 'Empowering' },
    { value: 'peaceful', label: 'Peaceful' },
    { value: 'passionate', label: 'Passionate' }
  ];

  const audienceOptions: SelectOption[] = [
    { value: 'general', label: 'General' },
    { value: 'professional', label: 'Professional' },
    { value: 'students', label: 'Students' },
    { value: 'youth', label: 'Youth' },
    { value: 'leaders', label: 'Leaders' },
    { value: 'creative', label: 'Creative People' }
  ];

  const styleOptions: SelectOption[] = [
    { value: 'simple', label: 'Simple & Direct' },
    { value: 'metaphorical', label: 'Metaphorical' },
    { value: 'poetic', label: 'Poetic' },
    { value: 'profound', label: 'Profound' },
    { value: 'humorous', label: 'Humorous' }
  ];

  const lengthOptions: SelectOption[] = [
    { value: 'short', label: 'Short (10-15 words)' },
    { value: 'medium', label: 'Medium (15-25 words)' },
    { value: 'long', label: 'Long (25-40 words)' }
  ];

  const purposeOptions: SelectOption[] = [
    { value: 'inspire', label: 'Inspire & Motivate' },
    { value: 'educate', label: 'Educate & Inform' },
    { value: 'comfort', label: 'Comfort & Support' },
    { value: 'challenge', label: 'Challenge & Provoke Thought' },
    { value: 'entertain', label: 'Entertain & Amuse' }
  ];

  const createPrompt = (data: FormData): string => {
    return `Generate ${Math.floor(Math.random() * 8) + 3} unique quotes following these parameters:
    
Format each quote as JSON:
{
  "quotes": [
    {
      "text": "The quote text here",
      "analysis": "Brief analysis of the quote's meaning and impact",
      "usage": "Suggested contexts for using this quote"
    }
  ]
}

Parameters:
- Category: ${data.category?.label}
- Mood: ${data.mood?.label}
- Target Audience: ${data.audience?.label}
- Style: ${data.style?.label}
- Length: ${data.length?.label}
- Purpose: ${data.purpose?.label}
- Topic/Theme: ${data.topic}
- Context/Additional Details: ${data.context}

Requirements:
1. Each quote should be original and unique
2. Maintain consistent tone and style
3. Make each quote memorable and impactful
4. Ensure relevance to the specified audience
5. Include appropriate metaphors or imagery where suitable
6. Focus on clarity and coherence
7. Make sure quotes are meaningful and thought-provoking`;
  };

  const handleGenerateQuotes = async (): Promise<void> => {
    setLoading(true);
    try {
      const prompt = createPrompt(formData);
      const model = genAI.getGenerativeModel({
        model: "gemini-pro",
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE
          },
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE
          }
        ]
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const cleanedText = text
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();

        const parsedData = JSON.parse(cleanedText);
        setGeneratedQuotes(parsedData.quotes);
      } catch (error) {
        console.error("Failed to parse response:", error);
        alert("Failed to generate quotes. Please try again.");
      }
    } catch (error) {
      console.error("Error generating quotes:", error);
      alert("There was an error generating quotes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyContent = (content: string, index: number): void => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleReset = (): void => {
    setFormData({
      category: null,
      mood: null,
      audience: null,
      style: null,
      length: null,
      purpose: null,
      topic: '',
      context: ''
    });
    setGeneratedQuotes([]);
    setCopiedIndex(null);
  };

  const handleSelectChange = (selected: SingleValue<SelectOption>, field: keyof FormData): void => {
    setFormData(prev => ({
      ...prev,
      [field]: selected
    }));
  };

  const isFormValid = (): boolean => {
    return !!(
      formData.category &&
      formData.mood &&
      formData.audience &&
      formData.style &&
      formData.length &&
      formData.purpose &&
      formData.topic.trim()
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <div className="flex items-center gap-2">
              <FormatQuote className="text-pink-500" />
              <h1 className="text-3xl font-bold text-gray-800">Quote Generator</h1>
            </div>
            <button
              onClick={handleReset}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-all"
              aria-label="Reset form"
            >
              <Refresh />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Category className="text-pink-500" />
                    Category
                  </div>
                </label>
                <Select
                  options={categoryOptions}
                  value={formData.category}
                  onChange={(selected) => handleSelectChange(selected, 'category')}
                  className="text-sm"
                  placeholder="Select category..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Psychology className="text-pink-500" />
                    Mood
                  </div>
                </label>
                <Select
                  options={moodOptions}
                  value={formData.mood}
                  onChange={(selected) => handleSelectChange(selected, 'mood')}
                  className="text-sm"
                  placeholder="Select mood..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Group className="text-pink-500" />
                    Target Audience
                  </div>
                </label>
                <Select
                  options={audienceOptions}
                  value={formData.audience}
                  onChange={(selected) => handleSelectChange(selected, 'audience')}
                  className="text-sm"
                  placeholder="Select audience..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Palette className="text-pink-500" />
                    Style
                  </div>
                </label>
                <Select
                  options={styleOptions}
                  value={formData.style}
                  onChange={(selected) => handleSelectChange(selected, 'style')}
                  className="text-sm"
                  placeholder="Select style..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Timer className="text-pink-500" />
                    Length
                  </div>
                </label>
                <Select
                  options={lengthOptions}
                  value={formData.length}
                  onChange={(selected) => handleSelectChange(selected, 'length')}
                  className="text-sm"
                  placeholder="Select length..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Settings className="text-pink-500" />
                    Purpose
                  </div>
                </label>
                <Select
                  options={purposeOptions}
                  value={formData.purpose}
                  onChange={(selected) => handleSelectChange(selected, 'purpose')}
                  className="text-sm"
                  placeholder="Select purpose..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic or Theme
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter the main topic or theme..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Context (Optional)
                </label>
                <textarea
                  value={formData.context}
                  onChange={(e) => setFormData(prev => ({ ...prev, context: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 min-h-[100px]"
                  placeholder="Enter any additional context or requirements..."
                />
              </div>
            </div>

            <button
              onClick={handleGenerateQuotes}
              disabled={loading || !isFormValid()}
              className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating Quotes...' : 'Generate Quotes'}
            </button>
          </div>

          {generatedQuotes.length > 0 && (
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Generated Quotes</h2>
              <div className="grid gap-4">
                {generatedQuotes.map((quote, index) => (
                  <div 
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:border-pink-200 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-lg text-gray-800 font-medium mb-2">&quot;{quote.text}&quot;</div>
                        
                        <div className="mt-2 text-sm text-gray-600">
                          <div className="mb-2">
                            <span className="font-medium">Analysis:</span> {quote.analysis}
                          </div>
                          <div>
                            <span className="font-medium">Usage:</span> {quote.usage}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopyContent(quote.text, index)}
                        className="ml-4 text-gray-500 hover:text-pink-500 transition-colors"
                        aria-label="Copy quote"
                      >
                        {copiedIndex === index ? 
                          <CheckCircleOutline className="text-green-500" /> : 
                          <ContentCopy />
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
};

export default QuoteGenerator;