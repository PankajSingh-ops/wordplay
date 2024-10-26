"use client"
import React, { useState } from 'react';
import Select from 'react-select';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  RefreshRounded, 
  ContentCopyRounded,
  CheckCircleOutlineRounded,
  Event
} from '@mui/icons-material';

interface OptionType {
  value: string;
  label: string;
}

interface FormDataType {
  eventName: string;
  eventLocation: string;
  eventType: OptionType | null;
  eventMood: OptionType | null;
  audienceType: OptionType | null;
  captionStyle: OptionType | null;
  tone: OptionType | null;
  language: OptionType | null;
  hashtagPreference: OptionType | null;
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export default function EventsCaptionGenerator() {
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedCaptions, setGeneratedCaptions] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    eventName: '',
    eventLocation: '',
    eventType: null,
    eventMood: null,
    audienceType: null,
    captionStyle: null,
    tone: null,
    language: null,
    hashtagPreference: null
  });

  const languageOptions: OptionType[] = [
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'italian', label: 'Italian' },
    { value: 'portuguese', label: 'Portuguese' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'chinese', label: 'Chinese' }
  ];

  const eventTypeOptions: OptionType[] = [
    { value: 'wedding', label: 'Wedding' },
    { value: 'conference', label: 'Conference' },
    { value: 'concert', label: 'Concert' },
    { value: 'festival', label: 'Festival' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'networking', label: 'Networking Event' },
    { value: 'charity', label: 'Charity Event' },
    { value: 'sports', label: 'Sports Event' },
    { value: 'exhibition', label: 'Exhibition' },
    { value: 'launch', label: 'Product Launch' }
  ];

  const audienceTypeOptions: OptionType[] = [
    { value: 'general', label: 'General Public' },
    { value: 'professional', label: 'Professional' },
    { value: 'youth', label: 'Youth' },
    { value: 'industry', label: 'Industry Specific' },
    { value: 'community', label: 'Community' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'academic', label: 'Academic' },
    { value: 'cultural', label: 'Cultural' }
  ];

  const eventMoodOptions: OptionType[] = [
    { value: 'formal', label: 'Formal' },
    { value: 'casual', label: 'Casual' },
    { value: 'celebratory', label: 'Celebratory' },
    { value: 'inspirational', label: 'Inspirational' },
    { value: 'educational', label: 'Educational' },
    { value: 'energetic', label: 'Energetic' },
    { value: 'networking', label: 'Networking' },
    { value: 'creative', label: 'Creative' }
  ];

  const captionStyleOptions: OptionType[] = [
    { value: 'professional', label: 'Professional' },
    { value: 'creative', label: 'Creative' },
    { value: 'minimalist', label: 'Minimalist' },
    { value: 'storytelling', label: 'Storytelling' },
    { value: 'promotional', label: 'Promotional' }
  ];

  const toneOptions: OptionType[] = [
    { value: 'formal', label: 'Formal' },
    { value: 'casual', label: 'Casual' },
    { value: 'enthusiastic', label: 'Enthusiastic' },
    { value: 'informative', label: 'Informative' },
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' }
  ];

  const hashtagPreferenceOptions: OptionType[] = [
    { value: 'none', label: 'No Hashtags' },
    { value: 'minimal', label: '1-3 Hashtags' },
    { value: 'moderate', label: '4-6 Hashtags' },
    { value: 'extensive', label: '7+ Hashtags' }
  ];

  const createPrompt = (data: FormDataType): string => {
    return `Create 8 professional and appropriate social media captions for a ${data.eventType?.label} event. 

Event Details:
- Event Name: ${data.eventName}
- Location: ${data.eventLocation}
- Event Category: ${data.eventType?.label}
- Atmosphere: ${data.eventMood?.label}
- Intended Audience: ${data.audienceType?.label}
- Writing Style: ${data.captionStyle?.label}
- Communication Tone: ${data.tone?.label}
- Preferred Language: ${data.language?.label}
- Hashtag Amount: ${data.hashtagPreference?.label}

Please follow these content guidelines:
1. Focus on professional and inclusive language
2. Emphasize the event's positive aspects and community value
3. Include appropriate location mentions
4. Match the specified professional tone
5. Consider the target audience's professional interests
6. For non-English captions, include business-appropriate translations
7. Include relevant, professional hashtags based on preference
8. Keep captions concise and platform-appropriate

Required elements for each caption:
- Clear description of the event's professional purpose
- Professional call-to-action when appropriate
- Community-focused messaging
- Location reference where relevant
- Industry-appropriate hashtags (as per preference)
- Event date/time references if applicable

Additional specifications:
- Keep content family-friendly and professional
- Avoid controversial topics
- Focus on event value and community benefits
- Maintain professional business language
- Ensure content is appropriate for all audiences

Please return only appropriate, professional captions as a JSON array of strings.`;
  };

  const handleGenerateCaptions = async () => {
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
          setGeneratedCaptions(data);
        } else if (Array.isArray(data.captions)) {
          setGeneratedCaptions(data.captions);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (jsonError) {
        console.error("Failed to parse JSON:", jsonError);
        alert("Failed to process the generated captions. Please try again.");
      }
    } catch (error) {
      console.error("Error generating captions:", error);
      alert("There was an error generating captions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCaption = (caption: string, index: number) => {
    navigator.clipboard.writeText(caption);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleReset = () => {
    setFormData({
      eventName: '',
      eventLocation: '',
      eventType: null,
      eventMood: null,
      audienceType: null,
      captionStyle: null,
      tone: null,
      language: null,
      hashtagPreference: null
    });
    setGeneratedCaptions([]);
    setCopiedIndex(null);
  };

  const isFormValid = () => {
    return (
      formData.eventName.trim() !== '' &&
      formData.eventLocation.trim() !== '' &&
      formData.eventType !== null &&
      formData.eventMood !== null &&
      formData.audienceType !== null &&
      formData.tone !== null &&
      formData.language !== null
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <div className="flex items-center gap-2">
              <Event className="text-pink-500" />
              <h1 className="text-3xl font-bold text-gray-800">Event Caption Generator</h1>
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
                  Event Name
                </label>
                <input
                  type="text"
                  value={formData.eventName}
                  onChange={(e) => setFormData(prev => ({ ...prev, eventName: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter event name..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Location
                </label>
                <input
                  type="text"
                  value={formData.eventLocation}
                  onChange={(e) => setFormData(prev => ({ ...prev, eventLocation: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter location..."
                />
              </div>
            </div>

            {/* Primary Selections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type
                </label>
                <Select
                  options={eventTypeOptions}
                  value={formData.eventType}
                  onChange={(selected) => setFormData(prev => ({ ...prev, eventType: selected }))}
                  className="text-sm"
                  placeholder="Select event type..."
                  instanceId="event-type-select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Mood
                </label>
                <Select
                  options={eventMoodOptions}
                  value={formData.eventMood}
                  onChange={(selected) => setFormData(prev => ({ ...prev, eventMood: selected }))}
                  className="text-sm"
                  placeholder="Select event mood..."
                  instanceId="event-mood-select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <Select
                  options={audienceTypeOptions}
                  value={formData.audienceType}
                  onChange={(selected) => setFormData(prev => ({ ...prev, audienceType: selected }))}
                  className="text-sm"
                  placeholder="Select target audience..."
                  instanceId="audience-type-select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption Style
                </label>
                <Select
                  options={captionStyleOptions}
                  value={formData.captionStyle}
                  onChange={(selected) => setFormData(prev => ({ ...prev, captionStyle: selected }))}
                  className="text-sm"
                  placeholder="Select caption style..."
                  instanceId="caption-style-select"
                />
              </div>
            </div>

            {/* Additional Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tone
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
                  Hashtag Preference
                </label>
                <Select
                  options={hashtagPreferenceOptions}
                  value={formData.hashtagPreference}
                  onChange={(selected) => setFormData(prev => ({ ...prev, hashtagPreference: selected }))}
                  className="text-sm"
                  placeholder="Select hashtag preference..."
                  instanceId="hashtag-select"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateCaptions}
              disabled={loading || !isFormValid()}
              className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating Captions...' : 'Generate Event Captions'}
            </button>
          </div>

          {/* Generated Messages Display */}
          {generatedCaptions.length > 0 && (
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Gift Messages</h2>
              <div className="grid gap-4">
                {generatedCaptions.map((message, index) => (
                  <div 
                    key={index} 
                    className="p-4 border border-gray-200 rounded-lg hover:border-pink-200 transition-all bg-white shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-gray-800 flex-grow">{message}</p>
                      <button
                        onClick={() => handleCopyCaption(message, index)}
                        className="ml-2 text-gray-500 hover:text-pink-500 transition-colors flex-shrink-0"
                        aria-label="Copy message"
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

