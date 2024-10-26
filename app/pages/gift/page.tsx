"use client"
import React, { useState } from 'react';
import Select from 'react-select';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  RefreshRounded, 
  ContentCopyRounded,
  CheckCircleOutlineRounded,
  CardGiftcard
} from '@mui/icons-material';

interface OptionType {
  value: string;
  label: string;
}

interface FormDataType {
  recipientName: string;
  recipientAge: number;
  giftType: OptionType | null;
  occasion: OptionType | null;
  relationship: OptionType | null;
  giftValue: OptionType | null;
  tone: OptionType | null;
  language: OptionType | null;
  sentimentLevel: OptionType | null;
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export default function GiftMessageGenerator() {
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedMessages, setGeneratedMessages] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    recipientName: '',
    recipientAge: 0,
    giftType: null,
    occasion: null,
    relationship: null,
    giftValue: null,
    tone: null,
    language: null,
    sentimentLevel: null
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

  const occasionOptions: OptionType[] = [
    { value: 'birthday', label: 'Birthday' },
    { value: 'wedding', label: 'Wedding' },
    { value: 'graduation', label: 'Graduation' },
    { value: 'anniversary', label: 'Anniversary' },
    { value: 'housewarming', label: 'Housewarming' },
    { value: 'babyshower', label: 'Baby Shower' },
    { value: 'christmas', label: 'Christmas' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'retirement', label: 'Retirement' },
    { value: 'promotion', label: 'Job Promotion' }
  ];

  const relationshipOptions: OptionType[] = [
    { value: 'family', label: 'Family Member' },
    { value: 'friend', label: 'Friend' },
    { value: 'colleague', label: 'Colleague' },
    { value: 'romantic', label: 'Romantic Partner' },
    { value: 'mentor', label: 'Mentor' },
    { value: 'client', label: 'Client' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'neighbor', label: 'Neighbor' }
  ];

  const giftTypeOptions: OptionType[] = [
    { value: 'personalItem', label: 'Personal Item (Clothing, Accessories)' },
    { value: 'experience', label: 'Experience (Tickets, Vouchers)' },
    { value: 'technology', label: 'Technology' },
    { value: 'homeDecor', label: 'Home Décor' },
    { value: 'food', label: 'Food/Beverages' },
    { value: 'money', label: 'Money/Gift Card' },
    { value: 'handmade', label: 'Handmade Item' },
    { value: 'book', label: 'Book' },
    { value: 'jewelry', label: 'Jewelry' }
  ];

  const giftValueOptions: OptionType[] = [
    { value: 'token', label: 'Token Gift' },
    { value: 'moderate', label: 'Moderate Value' },
    { value: 'expensive', label: 'High Value' },
    { value: 'luxury', label: 'Luxury Item' },
    { value: 'priceless', label: 'Priceless/Sentimental' }
  ];

  const toneOptions: OptionType[] = [
    { value: 'formal', label: 'Formal' },
    { value: 'casual', label: 'Casual' },
    { value: 'funny', label: 'Humorous' },
    { value: 'sentimental', label: 'Sentimental' },
    { value: 'professional', label: 'Professional' },
    { value: 'playful', label: 'Playful' }
  ];

  const sentimentLevelOptions: OptionType[] = [
    { value: 'light', label: 'Light & Brief' },
    { value: 'moderate', label: 'Moderately Personal' },
    { value: 'deep', label: 'Deep & Meaningful' },
    { value: 'nostalgic', label: 'Nostalgic & Reflective' }
  ];

  const createPrompt = (data: FormDataType): string => {
    return `Generate 8 unique, thoughtful gift messages based on the following details:
      - Recipient Name: ${data.recipientName}
      - Age: ${data.recipientAge}
      - Occasion: ${data.occasion?.label}
      - Gift Type: ${data.giftType?.label}
      - Relationship: ${data.relationship?.label}
      - Gift Value Level: ${data.giftValue?.label}
      - Tone: ${data.tone?.label}
      - Language: ${data.language?.label}
      - Sentiment Level: ${data.sentimentLevel?.label}
  
    Guidelines:
    1. Personalize each message to suit the recipient's relationship and occasion.
    2. Reflect the tone and sentiment specified.
    3. Mention the gift type with subtlety, focusing on meaning rather than specifics.
    4. Ensure cultural sensitivity and age-appropriate language.
    5. For non-English messages, include pronunciation in parentheses.
    6. For luxury gifts, emphasize the thought over value.
    7. Format responses as a JSON array of strings, containing only the messages.
  
    Context:
    - Highlight shared memories for experience gifts.
    - Emphasize personal effort for handmade gifts.
    - For monetary gifts, focus on intention rather than amount.
    - Sentimental items should connect to shared history.
  
    Please return the messages as a structured JSON array of strings.`;
  };
  

  const handleGenerateMessages = async () => {
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
          setGeneratedMessages(data);
        } else if (Array.isArray(data.messages)) {
          setGeneratedMessages(data.messages);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (jsonError) {
        console.error("Failed to parse JSON:", jsonError);
        alert("Failed to process the generated messages. Please try again.");
      }
    } catch (error) {
      console.error("Error generating messages:", error);
      alert("There was an error generating messages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = (message: string, index: number) => {
    navigator.clipboard.writeText(message);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleReset = () => {
    setFormData({
      recipientName: '',
      recipientAge: 0,
      giftType: null,
      occasion: null,
      relationship: null,
      giftValue: null,
      tone: null,
      language: null,
      sentimentLevel: null
    });
    setGeneratedMessages([]);
    setCopiedIndex(null);
  };

  const isFormValid = () => {
    return (
      formData.recipientName.trim() !== '' &&
      formData.recipientAge > 0 &&
      formData.giftType !== null &&
      formData.occasion !== null &&
      formData.relationship !== null &&
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
              <CardGiftcard className="text-pink-500" />
              <h1 className="text-3xl font-bold text-gray-800">Gift Message Generator</h1>
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
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, recipientName: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter recipient's name..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Age
                </label>
                <input
                  type="number"
                  value={formData.recipientAge || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, recipientAge: parseInt(e.target.value) || 0 }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter age..."
                  min="0"
                />
              </div>
            </div>

            {/* Primary Selections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occasion
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
                  Gift Type
                </label>
                <Select
                  options={giftTypeOptions}
                  value={formData.giftType}
                  onChange={(selected) => setFormData(prev => ({ ...prev, giftType: selected }))}
                  className="text-sm"
                  placeholder="Select gift type..."
                  instanceId="gift-type-select"
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
                  Gift Value Level
                </label>
                <Select
                  options={giftValueOptions}
                  value={formData.giftValue}
                  onChange={(selected) => setFormData(prev => ({ ...prev, giftValue: selected }))}
                  className="text-sm"
                  placeholder="Select gift value level..."
                  instanceId="gift-value-select"
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
                  Sentiment Level
                </label>
                <Select
                  options={sentimentLevelOptions}
                  value={formData.sentimentLevel}
                  onChange={(selected) => setFormData(prev => ({ ...prev, sentimentLevel: selected }))}
                  className="text-sm"
                  placeholder="Select sentiment level..."
                  instanceId="sentiment-select"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateMessages}
              disabled={loading || !isFormValid()}
              className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating Messages...' : 'Generate Gift Messages'}
            </button>
          </div>

          {/* Generated Messages Display */}
          {generatedMessages.length > 0 && (
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Gift Messages</h2>
              <div className="grid gap-4">
                {generatedMessages.map((message, index) => (
                  <div 
                    key={index} 
                    className="p-4 border border-gray-200 rounded-lg hover:border-pink-200 transition-all bg-white shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-gray-800 flex-grow">{message}</p>
                      <button
                        onClick={() => handleCopyMessage(message, index)}
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

