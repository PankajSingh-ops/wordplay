"use client"
import React, { useState } from 'react';
import Select from 'react-select';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { 
  RefreshRounded,
  ContentCopyRounded,
  CheckCircleOutlineRounded,
  MailOutline,
  Person,
  Description,
  FormatSize,
  Style,
  Language,
  BusinessCenter,
  DateRange,
  Place
} from '@mui/icons-material';

interface OptionType {
  value: string;
  label: string;
}

interface FormDataType {
  letterType: OptionType | null;
  senderInfo: {
    name: string;
    title: string;
    organization: string;
    address: string;
  };
  recipientInfo: {
    name: string;
    title: string;
    organization: string;
    address: string;
  };
  subject: string;
  language: OptionType | null;
  tone: OptionType | null;
  format: OptionType | null;
  purpose: string;
  additionalDetails: string;
  date: string;
}

interface GeneratedLetter {
  content: string;
  formatting?: string;
  version: number;
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export default function LetterGenerator() {
  const [loading, setLoading] = useState(false);
  const [generatedLetters, setGeneratedLetters] = useState<GeneratedLetter[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    letterType: null,
    senderInfo: {
      name: '',
      title: '',
      organization: '',
      address: ''
    },
    recipientInfo: {
      name: '',
      title: '',
      organization: '',
      address: ''
    },
    subject: '',
    language: null,
    tone: null,
    format: null,
    purpose: '',
    additionalDetails: '',
    date: new Date().toISOString().split('T')[0]
  });

  const letterTypeOptions: OptionType[] = [
    { value: 'formal_request', label: 'Formal Request Letter' },
    { value: 'leave_application', label: 'Leave Application' },
    { value: 'appraisal', label: 'Performance Appraisal' },
    { value: 'recommendation', label: 'Letter of Recommendation' },
    { value: 'resignation', label: 'Resignation Letter' },
    { value: 'complaint', label: 'Complaint Letter' },
    { value: 'appreciation', label: 'Letter of Appreciation' },
    { value: 'business_proposal', label: 'Business Proposal' },
    { value: 'job_application', label: 'Job Application' },
    { value: 'thank_you', label: 'Thank You Letter' }
  ];

  const languageOptions: OptionType[] = [
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'hindi', label: 'Hindi' },

  ];

  const toneOptions: OptionType[] = [
    { value: 'formal', label: 'Formal & Professional' },
    { value: 'semi_formal', label: 'Semi-Formal' },
    { value: 'courteous', label: 'Courteous & Respectful' },
    { value: 'assertive', label: 'Assertive & Direct' },
    { value: 'appreciative', label: 'Appreciative & Grateful' },
    { value: 'diplomatic', label: 'Diplomatic & Tactful' }
  ];

  const formatOptions: OptionType[] = [
    { value: 'full_block', label: 'Full Block Format' },
    { value: 'modified_block', label: 'Modified Block Format' },
    { value: 'semi_block', label: 'Semi-Block Format' },
    { value: 'simplified', label: 'Simplified Format' }
  ];
  const createPrompt = (formData: FormDataType) => {
    return `Generate a professional ${formData.letterType?.label} with the following details:
      From: ${formData.senderInfo.name} (${formData.senderInfo.title})
      Organization: ${formData.senderInfo.organization}
      Address: ${formData.senderInfo.address}
      
      To: ${formData.recipientInfo.name} (${formData.recipientInfo.title})
      Organization: ${formData.recipientInfo.organization}
      Address: ${formData.recipientInfo.address}
      
      Subject: ${formData.subject}
      Date: ${formData.date}
      Language: ${formData.language?.label}
      Tone: ${formData.tone?.label}
      Format: ${formData.format?.label}
      
      Purpose: ${formData.purpose}
      Additional Details: ${formData.additionalDetails}
      
      Please provide the letter in JSON format with the following structure:
      {
        "content": "The complete letter text",
        "formatting": "Formatting instructions",
        "version": 1
      }`;
  };

  const handleGenerateLetter = async () => {
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

        // Process the letter based on the response format
        let processedLetter: GeneratedLetter;

        if (Array.isArray(parsedData)) {
          processedLetter = {
            content: parsedData[0].content || parsedData[0],
            formatting: parsedData[0].formatting,
            version: 1
          };
        } else if (typeof parsedData === 'object' && parsedData.content) {
          processedLetter = {
            content: parsedData.content,
            formatting: parsedData.formatting,
            version: 1
          };
        } else {
          throw new Error("Invalid response format");
        }

        setGeneratedLetters([processedLetter]);
      } catch (jsonError) {
        console.error("Failed to parse response:", jsonError);
        alert("Failed to process the generated letter. Please try again.");
      }
    } catch (error) {
      console.error("Error generating letter:", error);
      alert("There was an error generating the letter. Please try again. If the problem persists, try modifying your input parameters.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLetter = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleReset = () => {
    setFormData({
      letterType: null,
      senderInfo: {
        name: '',
        title: '',
        organization: '',
        address: ''
      },
      recipientInfo: {
        name: '',
        title: '',
        organization: '',
        address: ''
      },
      subject: '',
      language: null,
      tone: null,
      format: null,
      purpose: '',
      additionalDetails: '',
      date: new Date().toISOString().split('T')[0]
    });
    setGeneratedLetters([]);
    setCopiedIndex(null);
  };

  const isFormValid = () => {
    return (
      formData.letterType !== null &&
      formData.senderInfo.name.trim() !== '' &&
      formData.recipientInfo.name.trim() !== '' &&
      formData.subject.trim() !== '' &&
      formData.language !== null &&
      formData.tone !== null &&
      formData.format !== null
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <div className="flex items-center gap-2">
              <MailOutline className="text-pink-500" />
              <h1 className="text-3xl font-bold text-gray-800">Professional Letter Generator</h1>
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
            {/* Letter Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Description className="text-pink-500" />
                  Letter Type
                </div>
              </label>
              <Select
                options={letterTypeOptions}
                value={formData.letterType}
                onChange={(selected) => setFormData(prev => ({ ...prev, letterType: selected }))}
                className="text-sm"
                placeholder="Select letter type..."
                instanceId="letter-type-select"
              />
            </div>

            {/* Sender Information */}
            <div className="border-t pt-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Sender Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Person className="text-pink-500 mr-2 inline" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.senderInfo.name}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      senderInfo: { ...prev.senderInfo, name: e.target.value }
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <BusinessCenter className="text-pink-500 mr-2 inline" />
                    Title/Position
                  </label>
                  <input
                    type="text"
                    value={formData.senderInfo.title}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      senderInfo: { ...prev.senderInfo, title: e.target.value }
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization
                  </label>
                  <input
                    type="text"
                    value={formData.senderInfo.organization}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      senderInfo: { ...prev.senderInfo, organization: e.target.value }
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Place className="text-pink-500 mr-2 inline" />
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.senderInfo.address}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      senderInfo: { ...prev.senderInfo, address: e.target.value }
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Recipient Information */}
            <div className="border-t pt-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Recipient Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Person className="text-pink-500 mr-2 inline" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.recipientInfo.name}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      recipientInfo: { ...prev.recipientInfo, name: e.target.value }
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <BusinessCenter className="text-pink-500 mr-2 inline" />
                    Title/Position
                  </label>
                  <input
                    type="text"
                    value={formData.recipientInfo.title}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      recipientInfo: { ...prev.recipientInfo, title: e.target.value }
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization
                  </label>
                  <input
                    type="text"
                    value={formData.recipientInfo.organization}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      recipientInfo: { ...prev.recipientInfo, organization: e.target.value }
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Place className="text-pink-500 mr-2 inline" />
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.recipientInfo.address}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      recipientInfo: { ...prev.recipientInfo, address: e.target.value }
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Letter Details */}
            <div className="border-t pt-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Letter Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DateRange className="text-pink-500 mr-2 inline" />
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Enter subject line..."
                  />
                </div>
              </div>
            </div>

            {/* Previous code remains the same until the Formatting Options section */}

            {/* Formatting Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <Style className="text-pink-500" />
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
                    <FormatSize className="text-pink-500" />
                    Format
                  </div>
                </label>
                <Select
                  options={formatOptions}
                  value={formData.format}
                  onChange={(selected) => setFormData(prev => ({ ...prev, format: selected }))}
                  className="text-sm"
                  placeholder="Select format..."
                  instanceId="format-select"
                />
              </div>
            </div>

            {/* Letter Content */}
            <div className="space-y-4 border-t pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose/Main Message
                </label>
                <textarea
                  value={formData.purpose}
                  onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 min-h-[100px]"
                  placeholder="Briefly describe the main purpose of your letter..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Details
                </label>
                <textarea
                  value={formData.additionalDetails}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalDetails: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 min-h-[100px]"
                  placeholder="Include any additional information, specific points, or context..."
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateLetter}
              disabled={loading || !isFormValid()}
              className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating Letter...' : 'Generate Letter'}
            </button>
          </div>

          {/* Generated Letters */}
          {generatedLetters.length > 0 && (
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Generated Letter</h2>
              <div className="grid gap-4">
                {generatedLetters.map((letter, index) => (
                  <div 
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:border-pink-200 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-2">Version {letter.version}</div>
                        <pre className="whitespace-pre-wrap font-sans text-gray-800">{letter.content}</pre>
                        
                        {letter.formatting && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-gray-700 mb-1">Formatting Notes:</div>
                            <p className="text-gray-600 text-sm">{letter.formatting}</p>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleCopyLetter(letter.content, index)}
                        className="ml-4 text-gray-500 hover:text-pink-500 transition-colors flex-shrink-0"
                        aria-label="Copy letter"
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

