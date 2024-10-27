"use client"
import React, { useState } from 'react';
import Select from 'react-select';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { 
  RefreshRounded, 
  ContentCopyRounded,
  CheckCircleOutlineRounded,
  AutoStories
} from '@mui/icons-material';

interface OptionType {
  value: string;
  label: string;
}

interface FormDataType {
  genre: OptionType | null;
  audience: OptionType | null;
  length: OptionType | null;
  setting: OptionType | null;
  theme: OptionType | null;
  mainCharacter: OptionType | null;
  mood: OptionType | null;
  language: OptionType | null;
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export default function StoryGenerator() {
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedStory, setGeneratedStory] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormDataType>({
    genre: null,
    audience: null,
    length: null,
    setting: null,
    theme: null,
    mainCharacter: null,
    mood: null,
    language: null
  });

  const genreOptions: OptionType[] = [
    { value: 'fantasy', label: 'Fantasy Adventure' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'fairytale', label: 'Fairy Tale' },
    { value: 'educational', label: 'Educational' },
    { value: 'animalStory', label: 'Animal Story' },
    { value: 'scienceFiction', label: 'Kid-Friendly Sci-Fi' },
    { value: 'folklore', label: 'Folk Tale' }
  ];

  const audienceOptions: OptionType[] = [
    { value: 'preschool', label: 'Preschool (Ages 3-5)' },
    { value: 'elementary', label: 'Elementary (Ages 6-10)' },
    { value: 'middleGrade', label: 'Middle Grade (Ages 11-13)' },
    { value: 'family', label: 'Family Read-Aloud' }
  ];

  const lengthOptions: OptionType[] = [
    { value: 'short', label: 'Short (2-3 minutes)' },
    { value: 'medium', label: 'Medium (5-7 minutes)' },
    { value: 'long', label: 'Long (10-12 minutes)' }
  ];

  const settingOptions: OptionType[] = [
    { value: 'enchantedForest', label: 'Enchanted Forest' },
    { value: 'school', label: 'School' },
    { value: 'magicalKingdom', label: 'Magical Kingdom' },
    { value: 'space', label: 'Outer Space' },
    { value: 'underwater', label: 'Underwater World' },
    { value: 'farm', label: 'Farm' },
    { value: 'city', label: 'City Adventure' },
    { value: 'jungle', label: 'Jungle' }
  ];

  const themeOptions: OptionType[] = [
    { value: 'friendship', label: 'Friendship' },
    { value: 'courage', label: 'Courage and Bravery' },
    { value: 'kindness', label: 'Kindness and Empathy' },
    { value: 'learning', label: 'Learning and Growth' },
    { value: 'teamwork', label: 'Teamwork' },
    { value: 'family', label: 'Family Bonds' },
    { value: 'nature', label: 'Nature and Environment' },
    { value: 'creativity', label: 'Creativity and Imagination' }
  ];

  const characterOptions: OptionType[] = [
    { value: 'child', label: 'Child Protagonist' },
    { value: 'animal', label: 'Friendly Animal' },
    { value: 'wizard', label: 'Young Wizard/Witch' },
    { value: 'robot', label: 'Friendly Robot' },
    { value: 'fairy', label: 'Magical Fairy' },
    { value: 'explorer', label: 'Young Explorer' },
    { value: 'superhero', label: 'Kid Superhero' }
  ];

  const moodOptions: OptionType[] = [
    { value: 'cheerful', label: 'Cheerful and Fun' },
    { value: 'exciting', label: 'Exciting and Adventurous' },
    { value: 'cozy', label: 'Cozy and Comforting' },
    { value: 'mysterious', label: 'Gentle Mystery' },
    { value: 'whimsical', label: 'Whimsical and Silly' }
  ];

  const languageOptions: OptionType[] = [
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'italian', label: 'Italian' },
    { value: 'hindi', label: 'Hindi' }

  ];

  const createPrompt = (data: FormDataType): string => {
    return `Generate a family-friendly story based on these parameters:

Story Parameters:
- Genre: ${data.genre?.label}
- Target Audience: ${data.audience?.label}
- Length: ${data.length?.label}
- Setting: ${data.setting?.label}
- Theme: ${data.theme?.label}
- Main Character Type: ${data.mainCharacter?.label}
- Mood: ${data.mood?.label}
- Language: ${data.language?.label}

Content Guidelines:
1. Age-Appropriate Content:
   - No violence, scary elements, or danger
   - No complex emotional situations
   - No references to dating or romance
   - Avoid potentially frightening scenarios

2. Educational Value:
   - Include subtle learning opportunities
   - Promote positive values and life lessons
   - Incorporate problem-solving elements
   - Feature positive role models

3. Structure Requirements:
   - Clear beginning, middle, and end
   - Easy-to-follow plot progression
   - Appropriate pacing for target age
   - Engaging dialogue and descriptions
   - Include sensory details when appropriate

4. Language Guidelines:
   - Age-appropriate vocabulary
   - Clear and concise sentences
   - For non-English stories, use simple language
   - Include translations if necessary
   - Avoid complex metaphors for younger audiences

5. Character Development:
   - Relatable main character
   - Clear character motivations
   - Positive character growth
   - Respectful interactions between characters

6. Cultural Sensitivity:
   - Inclusive and respectful content
   - Universal themes that cross cultures
   - Avoid cultural stereotypes
   - Promote understanding and acceptance

Please format the story with clear paragraphs and appropriate spacing.
For dialog, use quotation marks and new lines for each speaker.
If the story is not in English, please provide an English translation afterward.

The story should engage young readers while maintaining appropriate content and promoting positive values.`;
  };

  const handleGenerateStory = async () => {
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
              category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
              threshold: HarmBlockThreshold.BLOCK_NONE
            },
            {
              category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
              threshold: HarmBlockThreshold.BLOCK_NONE
            }
          ]
      });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      });
      const response = await result.response;
      const text = await response.text();
      setGeneratedStory(text);
    } catch (error) {
      console.error("Error generating story:", error);
      alert("There was an error generating the story. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyStory = () => {
    navigator.clipboard.writeText(generatedStory);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setFormData({
      genre: null,
      audience: null,
      length: null,
      setting: null,
      theme: null,
      mainCharacter: null,
      mood: null,
      language: null
    });
    setGeneratedStory('');
    setCopied(false);
  };

  const isFormValid = () => {
    return (
      formData.genre !== null &&
      formData.audience !== null &&
      formData.length !== null &&
      formData.setting !== null &&
      formData.theme !== null &&
      formData.mainCharacter !== null
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <div className="flex items-center gap-2">
              <AutoStories className="text-pink-500" />
              <h1 className="text-3xl font-bold text-gray-800">Family-Friendly Story Generator</h1>
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
                  Genre
                </label>
                <Select
                  options={genreOptions}
                  value={formData.genre}
                  onChange={(selected) => setFormData(prev => ({ ...prev, genre: selected }))}
                  className="text-sm"
                  placeholder="Select genre..."
                  instanceId="genre-select"
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

            {/* Story Elements */}
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
                  Setting
                </label>
                <Select
                  options={settingOptions}
                  value={formData.setting}
                  onChange={(selected) => setFormData(prev => ({ ...prev, setting: selected }))}
                  className="text-sm"
                  placeholder="Select setting..."
                  instanceId="setting-select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <Select
                  options={themeOptions}
                  value={formData.theme}
                  onChange={(selected) => setFormData(prev => ({ ...prev, theme: selected }))}
                  className="text-sm"
                  placeholder="Select theme..."
                  instanceId="theme-select"
                />
              </div>
            </div>

            {/* Additional Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Character
                </label>
                <Select
                  options={characterOptions}
                  value={formData.mainCharacter}
                  onChange={(selected) => setFormData(prev => ({ ...prev, mainCharacter: selected }))}
                  className="text-sm"
                  placeholder="Select character..."
                  instanceId="character-select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mood
                </label>
                <Select
                  options={moodOptions}
                  value={formData.mood}
                  onChange={(selected) => setFormData(prev => ({ ...prev, mood: selected }))}
                  className="text-sm"
                  placeholder="Select mood..."
                  instanceId="mood-select"
                />
              </div>

              <div className="md:col-span-2">
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
            </div>

            <button
              onClick={handleGenerateStory}
              disabled={loading || !isFormValid()}
              className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating Story...' : 'Generate Story'}
            </button>
          </div>

          {/* Generated Story Display */}
          {generatedStory && (
            <div className="mt-8 space-y-4">
              <div className="items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Your Generated Story</h2>
                <div className="flex items-start justify-between gap-4">
                <p className="text-gray-800 flex-grow">{generatedStory}</p>
                <button
                  onClick={handleCopyStory}
                  className="text-gray-500 hover:text-pink-500 transition-colors"
                  aria-label="Copy story"
                >
                  {copied ? 
                    <CheckCircleOutlineRounded className="text-green-500" /> : 
                    <ContentCopyRounded />
                  }
                </button>
                </div>
              </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}