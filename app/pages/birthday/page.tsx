"use client"
import React, { useState } from 'react';
import Select from 'react-select';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  RefreshRounded, 
  ContentCopyRounded,
  CheckCircleOutlineRounded,
  Cake
} from '@mui/icons-material';

interface OptionType {
  value: string;
  label: string;
}

interface FormDataType {
  name: string;
  age: number;
  language: OptionType | null;
  wishType: OptionType | null;
  relationship: OptionType | null;
  style: OptionType | null;
  occasion: OptionType | null;
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export default function BirthdayWishesGenerator() {
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedWishes, setGeneratedWishes] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    name: '',
    age: 0,
    language: null,
    wishType: null,
    relationship: null,
    style: null,
    occasion: null
  });

  // Options for dropdowns
  const languageOptions: OptionType[] = [
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'italian', label: 'Italian' },
    { value: 'portuguese', label: 'Portuguese' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'korean', label: 'Korean' }
  ];

  const wishTypeOptions: OptionType[] = [
    { value: 'funny', label: 'Funny & Humorous' },
    { value: 'romantic', label: 'Loving & Romantic' },
    { value: 'happy', label: 'Cheerful & Happy' },
    { value: 'casual', label: 'Casual & Friendly' },
    { value: 'emotional', label: 'Deep & Emotional' },
    { value: 'traditional', label: 'Traditional & Formal' },
    { value: 'sarcastic', label: 'Sarcastic & Witty' },
    { value: 'poetic', label: 'Poetic & Artistic' }
  ];

  const relationshipOptions: OptionType[] = [
    { value: 'mother', label: 'Mother' },
    { value: 'father', label: 'Father' },
    { value: 'brother', label: 'Brother' },
    { value: 'sister', label: 'Sister' },
    { value: 'girlfriend', label: 'Girlfriend' },
    { value: 'boyfriend', label: 'Boyfriend' },
    { value: 'spouse', label: 'Spouse' },
    { value: 'bestfriend', label: 'Best Friend' },
    { value: 'friend', label: 'Friend' },
    { value: 'colleague', label: 'Colleague' },
    { value: 'grandparent', label: 'Grandparent' },
    { value: 'cousin', label: 'Cousin' },
    { value: 'niece', label: 'Niece' },
    { value: 'nephew', label: 'Nephew' }
  ];

  const styleOptions: OptionType[] = [
    { value: 'singing', label: 'Singing Style' },
    { value: 'motivational', label: 'Motivational' },
    { value: 'mocking', label: 'Playful Mocking' },
    { value: 'shocking', label: 'Surprising' },
    { value: 'storytelling', label: 'Story Format' },
    { value: 'rhyming', label: 'Rhyming Verses' },
    { value: 'letter', label: 'Letter Format' },
    { value: 'speech', label: 'Speech Style' }
  ];

  const occasionOptions: OptionType[] = [
    { value: 'milestone', label: 'Milestone Birthday (18, 21, 30, 40, 50...)' },
    { value: 'first', label: 'First Birthday After Major Life Event' },
    { value: 'quarantine', label: 'Virtual/Distance Birthday' },
    { value: 'surprise', label: 'Surprise Party' },
    { value: 'belated', label: 'Belated Birthday' },
    { value: 'early', label: 'Early Birthday' }
  ];

  const createPrompt = (data: FormDataType): string => {
    return `Generate 10 unique and creative birthday wishes with these specifications:
      - Name: ${data.name}
      - Age: ${data.age}
      - Language: ${data.language?.label}
      - Type of Wish: ${data.wishType?.label}
      - Relationship: ${data.relationship?.label}
      - Style: ${data.style?.label}
      - Special Occasion: ${data.occasion?.label || 'Regular Birthday'}

      Guidelines:
      1. Make each wish personal and unique
      2. Include age-appropriate references
      3. Match the tone to the relationship and wish type
      4. If in a non-English language, include pronunciation guide
      5. Incorporate the specified style creatively
      6. Keep cultural sensitivity in mind
      7. Make it memorable and shareable
      8. Include relevant emojis where appropriate

      Format the response as a JSON array of strings, containing just the wishes.`;
  };

  const handleGenerateWishes = async () => {
    setLoading(true);
    try {
      const prompt = createPrompt(formData);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      
      try {
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const data = JSON.parse(cleanedText);
        
        if (Array.isArray(data)) {
          setGeneratedWishes(data);
        } else if (Array.isArray(data.wishes)) {
          setGeneratedWishes(data.wishes);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (jsonError) {
        console.error("Failed to parse JSON:", jsonError);
        alert("Failed to process the generated wishes. Please try again.");
      }
    } catch (error) {
      console.error("Error generating wishes:", error);
      alert("There was an error generating wishes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyWish = (wish: string, index: number) => {
    navigator.clipboard.writeText(wish);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      age: 0,
      language: null,
      wishType: null,
      relationship: null,
      style: null,
      occasion: null
    });
    setGeneratedWishes([]);
    setCopiedIndex(null);
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== '' &&
      formData.age > 0 &&
      formData.language !== null &&
      formData.wishType !== null &&
      formData.relationship !== null &&
      formData.style !== null
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <div className="flex items-center gap-2">
              <Cake className="text-pink-500" />
              <h1 className="text-3xl font-bold text-gray-800">Birthday Wishes Generator</h1>
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
            {/* Name and Age Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birthday Person&apos;s Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter name..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={formData.age || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter age..."
                  min="0"
                />
              </div>
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  Type of Wish
                </label>
                <Select
                  options={wishTypeOptions}
                  value={formData.wishType}
                  onChange={(selected) => setFormData(prev => ({ ...prev, wishType: selected }))}
                  className="text-sm"
                  placeholder="Select wish type..."
                  instanceId="wish-type-select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship
                </label>
                <Select
                  options={relationshipOptions}
                  value={formData.relationship}
                  onChange={(selected) => setFormData(prev => ({ ...prev, relationship: selected }))}
                  className="text-sm"
                  placeholder="Select relationship..."
                  instanceId="relationship-select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Style of Wish
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
            </div>

            {/* Optional Occasion */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Occasion (Optional)
              </label>
              <Select
                options={occasionOptions}
                value={formData.occasion}
                onChange={(selected) => setFormData(prev => ({ ...prev, occasion: selected }))}
                className="text-sm"
                placeholder="Select special occasion..."
                instanceId="occasion-select"
                isClearable
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateWishes}
              disabled={loading || !isFormValid()}
              className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating Wishes...' : 'Generate Birthday Wishes'}
            </button>
          </div>

          {/* Generated Wishes */}
          {generatedWishes.length > 0 && (
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Generated Birthday Wishes</h2>
              <div className="grid gap-4">
                {generatedWishes.map((wish, index) => (
                  <div 
                    key={index} 
                    className="p-4 border border-gray-200 rounded-lg hover:border-pink-200 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-gray-800">{wish}</p>
                      <button
                        onClick={() => handleCopyWish(wish, index)}
                        className="ml-4 text-gray-500 hover:text-pink-500 transition-colors"
                        aria-label="Copy wish"
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