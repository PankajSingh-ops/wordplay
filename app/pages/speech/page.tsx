"use client"
import React, { useState } from 'react';
import Select from 'react-select';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { 
  RefreshRounded, 
  ContentCopyRounded,
  CheckCircleOutlineRounded,
  CampaignRounded,
  Person,
  Timer,
  Language,
  Category,
  RecordVoiceOver,
  Psychology,
  FormatQuote
} from '@mui/icons-material';

interface OptionType {
  value: string;
  label: string;
}

interface FormDataType {
  occasion: OptionType | null;
  audience: OptionType | null;
  tone: OptionType | null;
  duration: OptionType | null;
  speakerRole: OptionType | null;
  language: OptionType | null;
  specialElements: OptionType[];
  topic: string;
  keyPoints: string;
}
interface SpeechVersion {
    speech: string;
    speakerNotes?: string;
    version?: number;
  }
 

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export default function SpeechWriterGenerator() {
  const [loading, setLoading] = useState(false);
  const [generatedSpeeches, setGeneratedSpeeches] = useState<SpeechVersion[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    occasion: null,
    audience: null,
    tone: null,
    duration: null,
    speakerRole: null,
    language: null,
    specialElements: [],
    topic: '',
    keyPoints: ''
  });

  // Options for dropdowns
  const occasionOptions: OptionType[] = [
    { value: 'wedding', label: 'Wedding Speech' },
    { value: 'graduation', label: 'Graduation Ceremony' },
    { value: 'corporate', label: 'Business Presentation' },
    { value: 'birthday', label: 'Birthday Celebration' },
    { value: 'farewell', label: 'Farewell Speech' },
    { value: 'award', label: 'Award Ceremony' },
    { value: 'conference', label: 'Conference Talk' },
    { value: 'retirement', label: 'Retirement Party' },
    { value: 'memorial', label: 'Memorial Service' },
    { value: 'welcome', label: 'Welcome Address' }
  ];

  const audienceOptions: OptionType[] = [
    { value: 'professional', label: 'Professional Colleagues' },
    { value: 'family', label: 'Family Members' },
    { value: 'friends', label: 'Friends' },
    { value: 'students', label: 'Students' },
    { value: 'mixed', label: 'Mixed Audience' },
    { value: 'academic', label: 'Academic Community' },
    { value: 'clients', label: 'Clients/Customers' },
    { value: 'general', label: 'General Public' }
  ];

  const toneOptions: OptionType[] = [
    { value: 'formal', label: 'Formal & Professional' },
    { value: 'casual', label: 'Casual & Friendly' },
    { value: 'inspirational', label: 'Inspirational & Motivational' },
    { value: 'humorous', label: 'Light & Humorous' },
    { value: 'emotional', label: 'Emotional & Heartfelt' },
    { value: 'serious', label: 'Serious & Somber' },
    { value: 'educational', label: 'Educational & Informative' }
  ];

  const durationOptions: OptionType[] = [
    { value: 'veryShort', label: '2-3 minutes' },
    { value: 'short', label: '5-7 minutes' },
    { value: 'medium', label: '10-12 minutes' },
    { value: 'long', label: '15-20 minutes' },
    { value: 'extended', label: '30+ minutes' }
  ];

  const speakerRoleOptions: OptionType[] = [
    { value: 'host', label: 'Host/MC' },
    { value: 'guest', label: 'Guest Speaker' },
    { value: 'expert', label: 'Subject Matter Expert' },
    { value: 'honoree', label: 'Person Being Honored' },
    { value: 'leader', label: 'Team Leader/Manager' },
    { value: 'family', label: 'Family Member' },
    { value: 'friend', label: 'Friend' }
  ];

  const languageOptions: OptionType[] = [
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'italian', label: 'Italian' },
    { value: 'portuguese', label: 'Portuguese' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'japanese', label: 'Japanese' }
  ];

  const specialElementOptions: OptionType[] = [
    { value: 'quotes', label: 'Include Relevant Quotes' },
    { value: 'statistics', label: 'Include Statistics/Data' },
    { value: 'stories', label: 'Personal Stories/Anecdotes' },
    { value: 'jokes', label: 'Appropriate Humor/Jokes' },
    { value: 'interactive', label: 'Audience Interaction' },
    { value: 'callToAction', label: 'Call to Action' }
  ];

  const createPrompt = (data: FormDataType): string => {
    return `Create a respectful, appropriate, and professional speech following these guidelines. The speech should be suitable for all audiences and avoid any potentially sensitive or controversial content.

Generate a speech using these parameters:
Format Requirements:
{
  "versions": [
    {
      "speech": "Main speech content here",
      "speakerNotes": "Guidance notes for delivery"
    }
  ]
}

Speech Parameters:
- Event Type: ${data.occasion?.label}
- Audience: ${data.audience?.label}
- Speaking Style: ${data.tone?.label}
- Length: ${data.duration?.label}
- Speaker Position: ${data.speakerRole?.label}
- Preferred Language: ${data.language?.label}
- Main Subject: ${data.topic}
- Essential Points: ${data.keyPoints}
- Additional Elements: ${data.specialElements.map(elem => elem.label).join(', ')}

Please ensure the speech:
1. Uses appropriate, professional language
2. Maintains a positive, constructive tone
3. Focuses on bringing people together
4. Avoids controversial topics
5. Respects all audiences
6. Includes universal, inclusive examples
7. Uses family-friendly humor if requested
8. Emphasizes shared values and common ground

The speech should be structured with:
1. A welcoming introduction
2. Clear main points
3. Supporting examples
4. A positive conclusion`;
  };



  const handleGenerateSpeeches = async () => {
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
      
      try {
        // Clean the response and parse JSON
        const cleanedText = text
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .replace(/[\u0000-\u001F]+/g, '')
          .trim();
        
        let parsedData;
        try {
          parsedData = JSON.parse(cleanedText);
        } catch (jsonError) {
          // If JSON parsing fails, try to extract content between curly braces
          const match = cleanedText.match(/\{[\s\S]*\}/);
          if (match) {
            parsedData = JSON.parse(match[0]);
          } else {
            throw jsonError;
          }
        }
        
        // Process the speeches based on the response format
        let processedSpeeches: SpeechVersion[] = [];
        
        if (Array.isArray(parsedData)) {
          processedSpeeches = parsedData.map((item, index) => ({
            speech: typeof item === 'string' ? item : item.speech || '',
            speakerNotes: typeof item === 'object' ? item.speakerNotes : undefined,
            version: index + 1
          }));
        } else if (parsedData.versions && Array.isArray(parsedData.versions)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          processedSpeeches = parsedData.versions.map((item:any, index:any) => ({
            ...item,
            version: index + 1
          }));
        } else if (typeof parsedData === 'object' && parsedData.speech) {
          processedSpeeches = [{
            speech: parsedData.speech,
            speakerNotes: parsedData.speakerNotes,
            version: 1
          }];
        }

        if (processedSpeeches.length === 0) {
          throw new Error("No valid speech content found in the response");
        }

        setGeneratedSpeeches(processedSpeeches);
      } catch (jsonError) {
        console.error("Failed to parse response:", jsonError);
        alert("Failed to process the generated speeches. Please try again.");
      }
    } catch (error) {
      console.error("Error generating speeches:", error);
      alert("There was an error generating speeches. Please try again. If the problem persists, try modifying your input parameters.");
    } finally {
      setLoading(false);
    }
  };


  const handleCopySpeech = (speech: string, index: number) => {
    navigator.clipboard.writeText(speech);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };



  const handleReset = () => {
    setFormData({
      occasion: null,
      audience: null,
      tone: null,
      duration: null,
      speakerRole: null,
      language: null,
      specialElements: [],
      topic: '',
      keyPoints: ''
    });
    setGeneratedSpeeches([]);
    setCopiedIndex(null);
  };

  const isFormValid = () => {
    return (
      formData.occasion !== null &&
      formData.audience !== null &&
      formData.tone !== null &&
      formData.duration !== null &&
      formData.speakerRole !== null &&
      formData.language !== null &&
      formData.topic.trim() !== ''
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <div className="flex items-center gap-2">
              <CampaignRounded className="text-pink-500" />
              <h1 className="text-3xl font-bold text-gray-800">Speech Writer Generator</h1>
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
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Category className="text-pink-500" />
                    Speech Occasion
                  </div>
                </label>
                <Select
                  options={occasionOptions}
                  value={formData.occasion}
                  onChange={(selected) => setFormData(prev => ({ ...prev, occasion: selected }))}
                  className="text-sm"
                  placeholder="Select occasion..."
                  instanceId="occasion-select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Person className="text-pink-500" />
                    Target Audience
                  </div>
                </label>
                <Select
                  options={audienceOptions}
                  value={formData.audience}
                  onChange={(selected) => setFormData(prev => ({ ...prev, audience: selected }))}
                  className="text-sm"
                  placeholder="Select audience..."
                  instanceId="audience-select"
                />
              </div>
            </div>

            {/* Additional Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Psychology className="text-pink-500" />
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
                    <Timer className="text-pink-500" />
                    Duration
                  </div>
                </label>
                <Select
                  options={durationOptions}
                  value={formData.duration}
                  onChange={(selected) => setFormData(prev => ({ ...prev, duration: selected }))}
                  className="text-sm"
                  placeholder="Select duration..."
                  instanceId="duration-select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <RecordVoiceOver className="text-pink-500" />
                    Speaker Role
                  </div>
                </label>
                <Select
                  options={speakerRoleOptions}
                  value={formData.speakerRole}
                  onChange={(selected) => setFormData(prev => ({ ...prev, speakerRole: selected }))}
                  className="text-sm"
                  placeholder="Select role..."
                  instanceId="role-select"
                />
              </div>
            </div>

            {/* Language and Special Elements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Language className="text-pink-500" />
                    Language
                  </div>
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
                  <div className="flex items-center gap-2">
                    <FormatQuote className="text-pink-500" />
                    Special Elements
                  </div>
                </label>
                <Select
                  options={specialElementOptions}
                  value={formData.specialElements}
                  onChange={(selected) => setFormData(prev => ({ ...prev, specialElements: selected as OptionType[] }))}
                  className="text-sm"
                  placeholder="Select elements..."
                  instanceId="elements-select"
                  isMulti
                />
              </div>
            </div>

            {/* Topic and Key Points */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speech Topic
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter the main topic of your speech..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Points (Optional)
                </label>
                <textarea
                  value={formData.keyPoints}
                  onChange={(e) => setFormData(prev => ({ ...prev, keyPoints: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 min-h-[100px]"
                  placeholder="Enter any specific points you'd like to include in your speech (one per line)..."
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateSpeeches}
              disabled={loading || !isFormValid()}
              className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating Speech...' : 'Generate Speech'}
            </button>
          </div>

          {/* Generated Speeches */}
          {generatedSpeeches.length > 0 && (
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Generated Speeches</h2>
              <div className="grid gap-4">
              {generatedSpeeches.map((speechData, index) => (
              <div 
                key={index} 
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-200 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-2">Version {speechData.version || index + 1}</div>
                    <p className="text-gray-800 whitespace-pre-line">{speechData.speech}</p>
                    
                    {speechData.speakerNotes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-700 mb-1">Speaker Notes:</div>
                        <p className="text-gray-600 text-sm whitespace-pre-line">{speechData.speakerNotes}</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleCopySpeech(speechData.speech, index)}
                    className="ml-4 text-gray-500 hover:text-blue-500 transition-colors flex-shrink-0"
                    aria-label="Copy speech"
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