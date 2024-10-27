"use client"
import React, { useState } from 'react';
import Select from 'react-select';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import {
  Create,
  Refresh,
  ContentCopy,
  CheckCircleOutline,
  Style,
  Category,
  Psychology,
  Timer,
  FormatQuote,
  Palette,
  Group,
  Settings
} from '@mui/icons-material';

interface OptionType {
  value: string;
  label: string;
}

interface FormDataType {
  contentType: OptionType | null;
  genre: OptionType | null;
  writingStyle: OptionType | null;
  length: OptionType | null;
  targetAudience: OptionType | null;
  theme: OptionType | null;
  literaryElements: OptionType[];
  mainIdea: string;
  additionalDetails: string;
  tone: OptionType | null;
}

interface GeneratedContent {
  content: string;
  notes?: string;
  outline?: string;
  version: number;
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export default function CreativeWritingGenerator() {
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    contentType: null,
    genre: null,
    writingStyle: null,
    length: null,
    targetAudience: null,
    theme: null,
    literaryElements: [],
    mainIdea: '',
    additionalDetails: '',
    tone: null
  });

  // Options for dropdowns
  const contentTypeOptions: OptionType[] = [
    { value: 'short_story', label: 'Short Story' },
    { value: 'poem', label: 'Poem' },
    { value: 'blog_post', label: 'Blog Post' },
    { value: 'creative_essay', label: 'Creative Essay' },
    { value: 'character_sketch', label: 'Character Sketch' },
    { value: 'dialogue', label: 'Dialogue Scene' },
    { value: 'flash_fiction', label: 'Flash Fiction' },
    { value: 'personal_narrative', label: 'Personal Narrative' },
    { value: 'descriptive_scene', label: 'Descriptive Scene' }
  ];

  const genreOptions: OptionType[] = [
    { value: 'literary', label: 'Literary Fiction' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'science_fiction', label: 'Science Fiction' },
    { value: 'romance', label: 'Romance' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'horror', label: 'Horror' },
    { value: 'historical', label: 'Historical' },
    { value: 'contemporary', label: 'Contemporary' },
    { value: 'magical_realism', label: 'Magical Realism' }
  ];

  const writingStyleOptions: OptionType[] = [
    { value: 'descriptive', label: 'Descriptive' },
    { value: 'narrative', label: 'Narrative' },
    { value: 'lyrical', label: 'Lyrical' },
    { value: 'minimalist', label: 'Minimalist' },
    { value: 'experimental', label: 'Experimental' },
    { value: 'stream_consciousness', label: 'Stream of Consciousness' },
    { value: 'journalistic', label: 'Journalistic' },
    { value: 'academic', label: 'Academic' }
  ];

  const lengthOptions: OptionType[] = [
    { value: 'very_short', label: '100-300 words' },
    { value: 'short', label: '500-800 words' },
    { value: 'medium', label: '1000-1500 words' },
    { value: 'long', label: '2000-3000 words' },
    { value: 'very_long', label: '3000+ words' }
  ];

  const audienceOptions: OptionType[] = [
    { value: 'children', label: 'Children' },
    { value: 'young_adult', label: 'Young Adult' },
    { value: 'adult', label: 'Adult' },
    { value: 'general', label: 'General Audience' },
    { value: 'academic', label: 'Academic Audience' },
    { value: 'professional', label: 'Professional' }
  ];

  const themeOptions: OptionType[] = [
    { value: 'coming_of_age', label: 'Coming of Age' },
    { value: 'love', label: 'Love and Relationships' },
    { value: 'identity', label: 'Identity and Self-Discovery' },
    { value: 'conflict', label: 'Conflict and Resolution' },
    { value: 'nature', label: 'Nature and Environment' },
    { value: 'society', label: 'Society and Culture' },
    { value: 'technology', label: 'Technology and Progress' },
    { value: 'mortality', label: 'Life and Death' }
  ];

  const literaryElementOptions: OptionType[] = [
    { value: 'metaphor', label: 'Metaphors' },
    { value: 'symbolism', label: 'Symbolism' },
    { value: 'imagery', label: 'Vivid Imagery' },
    { value: 'foreshadowing', label: 'Foreshadowing' },
    { value: 'flashback', label: 'Flashbacks' },
    { value: 'irony', label: 'Irony' },
    { value: 'dialogue', label: 'Rich Dialogue' },
    { value: 'allegory', label: 'Allegory' }
  ];

  const toneOptions: OptionType[] = [
    { value: 'dramatic', label: 'Dramatic' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'melancholic', label: 'Melancholic' },
    { value: 'optimistic', label: 'Optimistic' },
    { value: 'satirical', label: 'Satirical' },
    { value: 'mysterious', label: 'Mysterious' },
    { value: 'philosophical', label: 'Philosophical' },
    { value: 'romantic', label: 'Romantic' }
  ];

  const createPrompt = (data: FormDataType): string => {
    return `Create a creative writing piece following these parameters:

Format Requirements:
{
  "versions": [
    {
      "content": "Main creative content here",
      "notes": "Writing techniques and analysis",
      "outline": "Structure and key elements"
    }
  ]
}

Writing Parameters:
- Content Type: ${data.contentType?.label}
- Genre: ${data.genre?.label}
- Writing Style: ${data.writingStyle?.label}
- Length: ${data.length?.label}
- Target Audience: ${data.targetAudience?.label}
- Theme: ${data.theme?.label}
- Tone: ${data.tone?.label}
- Main Idea: ${data.mainIdea}
- Additional Details: ${data.additionalDetails}
- Literary Elements to Include: ${data.literaryElements.map(elem => elem.label).join(', ')}

Please ensure the writing:
1. Maintains consistent style and voice
2. Uses vivid and engaging language
3. Incorporates requested literary elements naturally
4. Follows proper structure for the chosen content type
5. Appeals to the specified target audience
6. Develops themes effectively
7. Creates meaningful emotional impact
8. Provides clear narrative or thematic progression

The piece should include:
1. Strong opening hook
2. Well-developed ideas/characters/scenes
3. Effective use of literary devices
4. Satisfying conclusion`;
  };

  const handleGenerateContent = async () => {
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
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      });

      const response = await result.response;
      const text = await response.text();

      try {
        const cleanedText = text
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .replace(/[\u0000-\u001F]+/g, '')
          .trim();

        let parsedData;
        try {
          parsedData = JSON.parse(cleanedText);
        } catch (jsonError) {
          const match = cleanedText.match(/\{[\s\S]*\}/);
          if (match) {
            parsedData = JSON.parse(match[0]);
          } else {
            throw jsonError;
          }
        }

        let processedContent: GeneratedContent[] = [];

        if (Array.isArray(parsedData)) {
          processedContent = parsedData.map((item, index) => ({
            content: typeof item === 'string' ? item : item.content || '',
            notes: typeof item === 'object' ? item.notes : undefined,
            outline: typeof item === 'object' ? item.outline : undefined,
            version: index + 1
          }));
        } else if (parsedData.versions && Array.isArray(parsedData.versions)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          processedContent = parsedData.versions.map((item: any, index: number) => ({
            ...item,
            version: index + 1
          }));
        } else if (typeof parsedData === 'object' && parsedData.content) {
          processedContent = [{
            content: parsedData.content,
            notes: parsedData.notes,
            outline: parsedData.outline,
            version: 1
          }];
        }

        if (processedContent.length === 0) {
          throw new Error("No valid content found in the response");
        }

        setGeneratedContent(processedContent);
      } catch (jsonError) {
        console.error("Failed to parse response:", jsonError);
        alert("Failed to process the generated content. Please try again.");
      }
    } catch (error) {
      console.error("Error generating content:", error);
      alert("There was an error generating content. Please try again. If the problem persists, try modifying your input parameters.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyContent = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleReset = () => {
    setFormData({
      contentType: null,
      genre: null,
      writingStyle: null,
      length: null,
      targetAudience: null,
      theme: null,
      literaryElements: [],
      mainIdea: '',
      additionalDetails: '',
      tone: null
    });
    setGeneratedContent([]);
    setCopiedIndex(null);
  };

  const isFormValid = () => {
    return (
      formData.contentType !== null &&
      formData.genre !== null &&
      formData.writingStyle !== null &&
      formData.length !== null &&
      formData.targetAudience !== null &&
      formData.theme !== null &&
      formData.tone !== null &&
      formData.mainIdea.trim() !== ''
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <div className="flex items-center gap-2">
              <Create className="text-pink-500" />
              <h1 className="text-3xl font-bold text-gray-800">Creative Writing Generator</h1>
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
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Category className="text-pink-500" />
                    Content Type
                  </div>
                </label>
                <Select
                  options={contentTypeOptions}
                  value={formData.contentType}
                  onChange={(selected) => setFormData(prev => ({ ...prev, contentType: selected }))}
                  className="text-sm"
                  placeholder="Select content type..."
                  instanceId="content-type-select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Style className="text-pink-500" />
                    Genre
                  </div>
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
            </div>

            {/* Writing Style and Length */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Psychology className="text-pink-500" />
                    Writing Style
                  </div>
                  </label>
                <Select
                  options={writingStyleOptions}
                  value={formData.writingStyle}
                  onChange={(selected) => setFormData(prev => ({ ...prev, writingStyle: selected }))}
                  className="text-sm"
                  placeholder="Select writing style..."
                  instanceId="style-select"
                />
              </div>

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
                  onChange={(selected) => setFormData(prev => ({ ...prev, length: selected }))}
                  className="text-sm"
                  placeholder="Select length..."
                  instanceId="length-select"
                />
              </div>
            </div>

            {/* Target Audience and Theme */}
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
                  value={formData.targetAudience}
                  onChange={(selected) => setFormData(prev => ({ ...prev, targetAudience: selected }))}
                  className="text-sm"
                  placeholder="Select target audience..."
                  instanceId="audience-select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Palette className="text-pink-500" />
                    Theme
                  </div>
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

            {/* Tone and Literary Elements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Settings className="text-pink-500" />
                    Tone
                  </div>
                </label>
                <Select
                  options={toneOptions}
                  value={formData.tone}
                  onChange={(selected) => setFormData(prev => ({ ...prev, tone: selected }))}
                  className="text-sm"
                  placeholder="Select tone..."
                  instanceId="tone-select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <FormatQuote className="text-pink-500" />
                    Literary Elements
                  </div>
                </label>
                <Select
                  options={literaryElementOptions}
                  value={formData.literaryElements}
                  onChange={(selected) => setFormData(prev => ({ ...prev, literaryElements: selected as OptionType[] }))}
                  className="text-sm"
                  placeholder="Select elements..."
                  instanceId="elements-select"
                  isMulti
                />
              </div>
            </div>

            {/* Main Idea and Additional Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Idea or Prompt
                </label>
                <input
                  type="text"
                  value={formData.mainIdea}
                  onChange={(e) => setFormData(prev => ({ ...prev, mainIdea: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter the main idea or writing prompt..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Details (Optional)
                </label>
                <textarea
                  value={formData.additionalDetails}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalDetails: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 min-h-[100px]"
                  placeholder="Enter any additional details, specific requirements, or context..."
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateContent}
              disabled={loading || !isFormValid()}
              className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating Content...' : 'Generate Creative Writing'}
            </button>
          </div>

          {/* Generated Content */}
          {generatedContent.length > 0 && (
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Generated Content</h2>
              <div className="grid gap-4">
                {generatedContent.map((content, index) => (
                  <div 
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:border-pink-200 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-2">Version {content.version}</div>
                        <div className="prose max-w-none">
                          <div className="text-gray-800 whitespace-pre-line">{content.content}</div>
                          
                          {content.outline && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                              <div className="text-sm font-medium text-gray-700 mb-1">Outline:</div>
                              <p className="text-gray-600 text-sm whitespace-pre-line">{content.outline}</p>
                            </div>
                          )}

                          {content.notes && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                              <div className="text-sm font-medium text-gray-700 mb-1">Writing Notes:</div>
                              <p className="text-gray-600 text-sm whitespace-pre-line">{content.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopyContent(content.content, index)}
                        className="ml-4 text-gray-500 hover:text-pink-500 transition-colors flex-shrink-0"
                        aria-label="Copy content"
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
}