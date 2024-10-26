"use client"
import React, { useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  ContentCopyRounded,
  CheckCircleOutlineRounded,
  Create
} from '@mui/icons-material';


type SelectOption = {
  value: string;
  label: string;
};

interface BlogFormData {
  blogName: string;
  niche: SelectOption | null;
  targetAudience: SelectOption | null;
  contentType: SelectOption | null;
  tone: SelectOption | null;
  length: SelectOption | null;
  keywords: string[];
}

interface BlogIdea {
  title: string;
  description: string;
  outline: string[];
  keywords: string[];
  estimatedWordCount: number;
  targetAudience: string;
  suggestedImages: string[];
}

// Initialize the Google AI client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');


const BlogIdeaGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [blogIdeas, setBlogIdeas] = useState<BlogIdea[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<BlogFormData>({
    blogName: '',
    niche: null,
    targetAudience: null,
    contentType: null,
    tone: null,
    length: null,
    keywords: []
  });

  const nicheOptions: SelectOption[] = [
    { value: 'technology', label: 'Technology & Digital' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'finance', label: 'Personal Finance' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'food', label: 'Food & Cooking' },
    { value: 'travel', label: 'Travel' },
    { value: 'business', label: 'Business & Entrepreneurship' },
    { value: 'education', label: 'Education & Learning' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'fashion', label: 'Fashion & Beauty' }
  ];

  const audienceOptions: SelectOption[] = [
    { value: 'general', label: 'General Audience' },
    { value: 'professionals', label: 'Working Professionals' },
    { value: 'students', label: 'Students' },
    { value: 'parents', label: 'Parents' },
    { value: 'seniors', label: 'Seniors' },
    { value: 'entrepreneurs', label: 'Entrepreneurs' },
    { value: 'techSavvy', label: 'Tech-Savvy Individuals' }
  ];

  const contentTypeOptions: SelectOption[] = [
    { value: 'howTo', label: 'How-To Guides' },
    { value: 'listicle', label: 'Listicles' },
    { value: 'tutorial', label: 'Tutorials' },
    { value: 'review', label: 'Reviews' },
    { value: 'opinion', label: 'Opinion Pieces' },
    { value: 'interview', label: 'Interviews' },
    { value: 'case-study', label: 'Case Studies' }
  ];

  const toneOptions: SelectOption[] = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'educational', label: 'Educational' },
    { value: 'inspirational', label: 'Inspirational' }
  ];

  const lengthOptions: SelectOption[] = [
    { value: 'short', label: 'Short (500-800 words)' },
    { value: 'medium', label: 'Medium (800-1500 words)' },
    { value: 'long', label: 'Long (1500-2500 words)' },
    { value: 'comprehensive', label: 'Comprehensive (2500+ words)' }
  ];

  const createPrompt = (data: BlogFormData): string => {
    return `Generate 5 blog post ideas based on these parameters:

Blog Name: ${data.blogName}
Niche: ${data.niche?.label || 'Not specified'}
Target Audience: ${data.targetAudience?.label || 'Not specified'}
Content Type: ${data.contentType?.label || 'Not specified'}
Tone: ${data.tone?.label || 'Not specified'}
Length: ${data.length?.label || 'Not specified'}
Keywords: ${data.keywords.join(', ') || 'Not specified'}

For each blog post idea, provide:
1. An engaging title
2. A brief description
3. A basic outline (3-5 main points)
4. Relevant keywords
5. Estimated word count
6. Target audience specifics
7. Suggested types of images to include

Return the ideas in JSON format as an array of objects with the following structure:
{
  "title": "string",
  "description": "string",
  "outline": ["string"],
  "keywords": ["string"],
  "estimatedWordCount": number,
  "targetAudience": "string",
  "suggestedImages": ["string"]
}`;
  };

  const handleGenerateIdeas = async () => {
    setLoading(true);
    try {
      const prompt = createPrompt(formData);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const ideas: BlogIdea[] = JSON.parse(cleanedText);
      setBlogIdeas(Array.isArray(ideas) ? ideas : []);
    } catch (error) {
      console.error("Error generating blog ideas:", error);
      alert("There was an error generating blog ideas. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyIdea = (idea: BlogIdea, index: number) => {
    const formattedIdea = `
Title: ${idea.title}

Description:
${idea.description}

Outline:
${idea.outline.map((point, i) => `${i + 1}. ${point}`).join('\n')}

Keywords: ${idea.keywords.join(', ')}
Estimated Word Count: ${idea.estimatedWordCount}
Target Audience: ${idea.targetAudience}

Suggested Images:
${idea.suggestedImages.map(img => `- ${img}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(formattedIdea);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSelectChange = (
    selected: SingleValue<SelectOption>,
    fieldName: keyof BlogFormData
  ) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: selected
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <div className="flex items-center gap-2">
              <Create className="text-pink-500" />
              <h1 className="text-3xl font-bold text-gray-800">Blog Idea Generator</h1>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blog Name
                </label>
                <input
                  type="text"
                  value={formData.blogName}
                  onChange={(e) => setFormData(prev => ({ ...prev, blogName: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter your blog name..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niche
                </label>
                <Select
                  options={nicheOptions}
                  value={formData.niche}
                  onChange={(selected) => handleSelectChange(selected, 'niche')}
                  className="text-sm"
                  placeholder="Select blog niche..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <Select
                  options={audienceOptions}
                  value={formData.targetAudience}
                  onChange={(selected) => handleSelectChange(selected, 'targetAudience')}
                  className="text-sm"
                  placeholder="Select target audience..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type
                </label>
                <Select
                  options={contentTypeOptions}
                  value={formData.contentType}
                  onChange={(selected) => handleSelectChange(selected, 'contentType')}
                  className="text-sm"
                  placeholder="Select content type..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tone
                </label>
                <Select
                  options={toneOptions}
                  value={formData.tone}
                  onChange={(selected) => handleSelectChange(selected, 'tone')}
                  className="text-sm"
                  placeholder="Select tone..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Length
                </label>
                <Select
                  options={lengthOptions}
                  value={formData.length}
                  onChange={(selected) => handleSelectChange(selected, 'length')}
                  className="text-sm"
                  placeholder="Select length..."
                />
              </div>
            </div>

            <button
              onClick={handleGenerateIdeas}
              disabled={loading}
              className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating Ideas...' : 'Generate Blog Ideas'}
            </button>
          </div>

          {blogIdeas.length > 0 && (
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Generated Blog Ideas</h2>
              <div className="grid gap-4">
                {blogIdeas.map((idea, index) => (
                  <div 
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:border-pink-200 transition-all bg-white shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold text-gray-800">{idea.title}</h3>
                        <p className="text-gray-600 mt-2">{idea.description}</p>
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-700">Outline:</h4>
                          <ul className="list-disc list-inside mt-2">
                            {idea.outline.map((point, i) => (
                              <li key={i} className="text-gray-600">{point}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm text-gray-500">
                            Keywords: {idea.keywords.join(', ')}
                          </p>
                          <p className="text-sm text-gray-500">
                            Word Count: {idea.estimatedWordCount}
                          </p>
                          <p className="text-sm text-gray-500">
                            Target Audience: {idea.targetAudience}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopyIdea(idea, index)}
                        className="ml-2 text-gray-500 hover:text-pink-500 transition-colors flex-shrink-0"
                        aria-label="Copy idea"
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
};

export default BlogIdeaGenerator;