"use client";

import React, { useState } from 'react';
import Select from 'react-select';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  RefreshRounded, 
  ContentCopyRounded,
  CheckCircleOutlineRounded
} from '@mui/icons-material';
import Header from '@/app/common/Header';

// Define types
interface OptionType {
  value: string;
  label: string;
}

interface FormDataType {
  name: string;
  age: number;
  gender: string;
  nature: OptionType | null;
  relationship: OptionType | null;
}

interface GeneratedNickname {
  nickname: string;
  meaning: string;
}

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export default function NicknameGenerator() {
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedNicknames, setGeneratedNicknames] = useState<GeneratedNickname[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    name: '',
    age: 0,
    gender: '',
    nature: null,
    relationship: null
  });

  // Options for dropdowns
  const natureOptions: OptionType[] = [
    { value: 'happy', label: 'Happy' },
    { value: 'confident', label: 'Confident' },
    { value: 'shy', label: 'Shy' },
    { value: 'crazy', label: 'Crazy' },
    { value: 'angry', label: 'Angry' },
    { value: 'funny', label: 'Funny' },
    { value: 'smart', label: 'Smart' },
    { value: 'adventurous', label: 'Adventurous' },
    { value: 'creative', label: 'Creative' },
    { value: 'caring', label: 'Caring' },
    { value: 'energetic', label: 'Energetic' },
    { value: 'quiet', label: 'Quiet' }
  ];

  const relationshipOptions: OptionType[] = [
    { value: 'girlfriend', label: 'Girlfriend' },
    { value: 'boyfriend', label: 'Boyfriend' },
    { value: 'bestfriend', label: 'Best Friend' },
    { value: 'friend', label: 'Friend' },
    { value: 'wife', label: 'Wife' },
    { value: 'husband', label: 'Husband' },
    { value: 'father', label: 'Father' },
    { value: 'mother', label: 'Mother' },
    { value: 'brother', label: 'Brother' },
    { value: 'sister', label: 'Sister' },
    { value: 'classmate', label: 'Classmate' },
    { value: 'colleague', label: 'Colleague' },
    { value: 'cousin', label: 'Cousin' },
    { value: 'roommate', label: 'Roommate' }
  ];

  const createPrompt = (data: FormDataType): string => {
    return `Generate 10 unique, creative, and culturally appropriate nicknames for a person with the following characteristics:
      - Name: ${data.name}
      - Age: ${data.age}
      - Gender: ${data.gender}
      - Nature/Personality: ${data.nature?.label}
      - Relationship: ${data.relationship?.label}
  
      Important guidelines for nickname generation:
      1. Analyze the name "${data.name}" and identify its likely cultural origin (e.g., Indian, Western, Asian, Arabic, etc.)
      2. Create nicknames that:
         - Are derived from or related to the actual name "${data.name}" (using elements, sounds, or meanings from the original name)
         - Respect the cultural context of the name
         - Match the person's age group (${data.age} years old)
         - Reflect their ${data.nature?.label} personality
         - Are appropriate for a ${data.relationship?.label} relationship
      3. Include both:
         - Traditional/cultural nickname variations of the name
         - Creative modern nicknames that blend cultural elements with personality traits
  
      Consider these aspects:
      - For Indian names: Include variations using common Indian nickname patterns (e.g., adding -u, -ji, or shortening with endearing terms)
      - For Western names: Include common diminutives and personality-based variations
      - For East Asian names: Consider respectful modifications based on cultural patterns
      - For Arabic names: Include appropriate honorific variations and endearing terms
      
      The nicknames should sound natural and feel like organic extensions of the original name while reflecting the relationship dynamic.
  
      Please provide the response in the following JSON format:
      {
        "nicknames": [
          {
            "nickname": "nickname here",
            "meaning": "detailed explanation including: 1) how it relates to their original name, 2) its cultural significance if any, 3) how it reflects their personality/age, and 4) why it's suitable for the relationship"
          }
        ]
      }
  
      Important:
      - Ensure each nickname flows naturally when spoken
      - Make sure nicknames are respectful and age-appropriate
      - Avoid generic nicknames that could apply to anyone
      - Each nickname should have a clear connection to their actual name
      - Consider the relationship context (${data.relationship?.label}) when determining the level of formality or intimacy
      - Factor in their ${data.nature?.label} nature in the wordplay or associations`;
  };

  const handleGenerateNicknames = async () => {
    setLoading(true);
    try {
      const prompt = createPrompt(formData);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();

      try {
        // Clean the response text by removing any markdown code block markers
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        // Find the first '{' and last '}' to extract the JSON object
        const startIndex = cleanedText.indexOf('{');
        const endIndex = cleanedText.lastIndexOf('}') + 1;
        
        if (startIndex === -1 || endIndex === 0) {
          throw new Error("No valid JSON object found in response");
        }
        
        const jsonStr = cleanedText.slice(startIndex, endIndex);
        
        // Parse the cleaned JSON
        const data = JSON.parse(jsonStr);
        
        // Validate the expected structure
        if (!data.nicknames || !Array.isArray(data.nicknames)) {
          throw new Error("Response doesn't contain the expected 'nicknames' array");
        }
        
        // Validate each nickname object
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const validNicknames = data.nicknames.filter((nickname: { nickname: any; meaning: any; }) => 
          nickname &&
          typeof nickname.nickname === 'string' &&
          typeof nickname.meaning === 'string'
        );
        
        if (validNicknames.length === 0) {
          throw new Error("No valid nickname entries found in response");
        }
        
        setGeneratedNicknames(validNicknames);
      } catch (jsonError) {
        console.error("Failed to parse JSON:", jsonError);
        console.log("Raw response:", text); // For debugging
        alert("Failed to process the generated nicknames. Please try again.");
      }
    } catch (error) {
      console.error("Error generating nicknames:", error);
      alert("There was an error generating nicknames. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyNickname = (nickname: string, index: number) => {
    navigator.clipboard.writeText(nickname);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      age: 0,
      gender: '',
      nature: null,
      relationship: null
    });
    setGeneratedNicknames([]);
    setCopiedIndex(null);
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== '' &&
      formData.age > 0 &&
      formData.gender !== '' &&
      formData.nature !== null &&
      formData.relationship !== null
    );
  };

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <h1 className="text-3xl font-bold text-gray-800">Nickname Generator</h1>
            <button
              onClick={handleReset}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-all"
              aria-label="Reset form"
            >
              <RefreshRounded />
            </button>
          </div>

          <div className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Enter name..."
              />
            </div>

            {/* Age Input */}
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

            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['male', 'female', 'other'].map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, gender }))}
                    className={`p-4 rounded-lg border ${
                      formData.gender === gender 
                        ? 'border-pink-500 bg-pink-50 text-pink-700' 
                        : 'border-gray-200 hover:border-pink-500'
                    } transition-all text-sm capitalize`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            {/* Nature Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nature/Personality
              </label>
              <Select
                options={natureOptions}
                value={formData.nature}
                onChange={(selected) => setFormData(prev => ({ 
                  ...prev, 
                  nature: selected 
                }))}
                className="text-sm"
                placeholder="Select nature..."
                instanceId="nature-select"
              />
            </div>

            {/* Relationship Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relationship
              </label>
              <Select
                options={relationshipOptions}
                value={formData.relationship}
                onChange={(selected) => setFormData(prev => ({ 
                  ...prev, 
                  relationship: selected 
                }))}
                className="text-sm"
                placeholder="Select relationship..."
                instanceId="relationship-select"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateNicknames}
              disabled={loading || !isFormValid()}
              className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating Nicknames...' : 'Generate Nicknames'}
            </button>
          </div>

          {/* Generated Nicknames */}
          {generatedNicknames.length > 0 && (
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Generated Nicknames</h2>
              <div className="grid gap-4">
                {generatedNicknames.map((nicknameData, index) => (
                  <div 
                    key={index} 
                    className="p-4 border border-gray-200 rounded-lg hover:border-pink-200 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-800">{nicknameData.nickname}</h3>
                      <button
                        onClick={() => handleCopyNickname(nicknameData.nickname, index)}
                        className="text-gray-500 hover:text-pink-500 transition-colors"
                        aria-label={`Copy ${nicknameData.nickname}`}
                      >
                        {copiedIndex === index ? 
                          <CheckCircleOutlineRounded className="text-green-500" /> : 
                          <ContentCopyRounded />
                        }
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{nicknameData.meaning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}