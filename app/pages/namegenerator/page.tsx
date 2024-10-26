"use client";

import React, { useState } from 'react';
import Select, { MultiValue, SingleValue } from 'react-select';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  RefreshRounded, 
  ContentCopyRounded,
  CheckCircleOutlineRounded
} from '@mui/icons-material';

// Define types
interface OptionType {
  value: string;
  label: string;
}

interface FormDataType {
  gender: string;
  country: string;
  nameTypes: OptionType[];
  startingLetters: string;
  nameThemes: OptionType[];
}

interface GeneratedName {
  name: string;
  meaning: string;
  significance: string;
}

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    gender: '',
    country: '',
    nameTypes: [],
    startingLetters: '',
    nameThemes: []
  });

  // Options for dropdowns
  const countryOptions: OptionType[] = [
    { value: 'india', label: 'India' },
    { value: 'usa', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'canada', label: 'Canada' },
    { value: 'australia', label: 'Australia' }
  ];

  const nameTypeOptions: OptionType[] = [
    { value: 'unique', label: 'Unique' },
    { value: 'common', label: 'Common' },
    { value: 'popular', label: 'Popular' },
    { value: 'artistic', label: 'Artistic' }
  ];

  const themeOptions: OptionType[] = [
    { value: 'nature', label: 'Nature' },
    { value: 'freedom_fighters', label: 'Freedom Fighters' },
    { value: 'movie_characters', label: 'Movie Characters' },
    { value: 'superheroes', label: 'Superheroes' },
    { value: 'mythology', label: 'Mythology' },
    { value: 'celestial', label: 'Celestial Bodies' }
  ];

  const createPrompt = (data: FormDataType): string => {
    let prompt = `Generate 10 unique baby names that are ${data.gender} names`;
    
    if (data.country) {
      prompt += ` popular in ${data.country}`;
    }

    if (data.nameTypes.length > 0) {
      const types = data.nameTypes.map(t => t.label).join(', ');
      prompt += ` and are considered ${types}`;
    }

    if (data.startingLetters) {
      prompt += ` starting with the letter ${data.startingLetters}`;
    }

    if (data.nameThemes.length > 0) {
      const themes = data.nameThemes.map(t => t.label).join(', ');
      prompt += `. The names should be related to ${themes}`;
    }

    prompt += `. For each name, provide its meaning and cultural significance in the following JSON format:
    {
      "names": [
        {
          "name": "name here",
          "meaning": "detailed meaning here",
          "significance": "cultural or thematic significance here"
        }
      ]
    }`;

    return prompt;
  };

  // Inside handleGenerateNames
const handleGenerateNames = async () => {
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
        if (!data.names || !Array.isArray(data.names)) {
          throw new Error("Response doesn't contain the expected 'names' array");
        }
        
        // Validate each name object
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const validNames = data.names.filter((name: { name: any; meaning: any; significance: any; }) => 
          name &&
          typeof name.name === 'string' &&
          typeof name.meaning === 'string' &&
          typeof name.significance === 'string'
        );
        
        if (validNames.length === 0) {
          throw new Error("No valid name entries found in response");
        }
        
        setGeneratedNames(validNames);
      } catch (jsonError) {
        console.error("Failed to parse JSON:", jsonError);
        console.log("Raw response:", text); // For debugging
        alert("Failed to process the generated names. Please try again.");
      }
    } catch (error) {
      console.error("Error generating names:", error);
      alert("There was an error generating names. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleCopyName = (name: string, index: number) => {
    navigator.clipboard.writeText(name);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleReset = () => {
    setFormData({
      gender: '',
      country: '',
      nameTypes: [],
      startingLetters: '',
      nameThemes: []
    });
    setGeneratedNames([]);
    setCopiedIndex(null);
  };

  const handleCountryChange = (selected: SingleValue<OptionType>) => {
    setFormData(prev => ({ 
      ...prev, 
      country: selected?.value || '' 
    }));
  };

  const handleNameTypesChange = (selected: MultiValue<OptionType>) => {
    setFormData(prev => ({ 
      ...prev, 
      nameTypes: selected as OptionType[] 
    }));
  };

  const handleThemesChange = (selected: MultiValue<OptionType>) => {
    setFormData(prev => ({ 
      ...prev, 
      nameThemes: selected as OptionType[] 
    }));
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <h1 className="text-3xl font-bold text-gray-800">Baby Name Generator</h1>
            <button
              onClick={handleReset}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-all"
              aria-label="Reset form"
            >
              <RefreshRounded />
            </button>
          </div>

          <div className="space-y-6">
            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Gender
              </label>
              <div className="grid grid-cols-2 gap-4">
                {['male', 'female'].map((gender) => (
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

            {/* Country Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Country
              </label>
              <Select
                options={countryOptions}
                value={countryOptions.find(option => option.value === formData.country)}
                onChange={handleCountryChange}
                className="text-sm"
                placeholder="Choose a country..."
                instanceId="country-select"
              />
            </div>

            {/* Name Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name Types (Multiple)
              </label>
              <Select
                isMulti
                options={nameTypeOptions}
                value={formData.nameTypes}
                onChange={handleNameTypesChange}
                className="text-sm"
                placeholder="Select name types..."
                instanceId="name-types-select"
              />
            </div>

            {/* Starting Letter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Starting Letter
              </label>
              <input
                type="text"
                maxLength={1}
                value={formData.startingLetters}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  startingLetters: e.target.value.toUpperCase() 
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Enter a letter..."
              />
            </div>

            {/* Name Themes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name Themes (Multiple)
              </label>
              <Select
                isMulti
                options={themeOptions}
                value={formData.nameThemes}
                onChange={handleThemesChange}
                className="text-sm"
                placeholder="Select themes..."
                instanceId="themes-select"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateNames}
              disabled={loading || !formData.gender}
              className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating Names...' : 'Generate Names'}
            </button>
          </div>

          {/* Generated Names */}
          {generatedNames.length > 0 && (
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Generated Names</h2>
              <div className="grid gap-4">
                {generatedNames.map((nameData, index) => (
                  <div 
                    key={index} 
                    className="p-4 border border-gray-200 rounded-lg hover:border-pink-200 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-800">{nameData.name}</h3>
                      <button
                        onClick={() => handleCopyName(nameData.name, index)}
                        className="text-gray-500 hover:text-pink-500 transition-colors"
                        aria-label={`Copy ${nameData.name}`}
                      >
                        {copiedIndex === index ? 
                          <CheckCircleOutlineRounded className="text-green-500" /> : 
                          <ContentCopyRounded />
                        }
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{nameData.meaning}</p>
                    <p className="text-sm text-gray-500 mt-1">{nameData.significance}</p>
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