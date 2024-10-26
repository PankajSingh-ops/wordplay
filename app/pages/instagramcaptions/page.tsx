"use client"
import React, { useState } from 'react';

const InstagramCaptionGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [formData, setFormData] = useState<{
    quoteLength: string;
    background: string;
    isGroupPhoto: string;
    groupMembers: string[]; // Correctly typed as an array of strings
    gender: string;
    mood: string;
    customMood: string;
  }>({
    quoteLength: 'short',
    background: 'none',
    isGroupPhoto: 'no',
    groupMembers: [], // Initialize as an empty array
    gender: '',
    mood: '',
    customMood: '',
  });
  

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call to Gemini (replace with actual implementation)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setGeneratedCaption("Living my best life! 🌟 #blessed #instagram #vibes");
    } catch (error) {
      console.error("Error generating caption:", error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Instagram Caption Generator</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quote Length */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caption Length
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleInputChange({ target: { name: 'quoteLength', value: 'short' }})}
                  className={`p-4 rounded-lg border ${
                    formData.quoteLength === 'short' 
                      ? 'border-pink-500 bg-pink-50' 
                      : 'border-gray-200'
                  } hover:border-pink-500 transition-all`}
                >
                  <span className="block text-sm">Short Caption</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange({ target: { name: 'quoteLength', value: 'long' }})}
                  className={`p-4 rounded-lg border ${
                    formData.quoteLength === 'long' 
                      ? 'border-pink-500 bg-pink-50' 
                      : 'border-gray-200'
                  } hover:border-pink-500 transition-all`}
                >
                  <span className="block text-sm">Long Caption</span>
                </button>
              </div>
            </div>

            {/* Background Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {['None', 'Nature', 'Mountain', 'Sea', 'Ocean'].map((bg) => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => handleInputChange({ target: { name: 'background', value: bg.toLowerCase() }})}
                    className={`p-4 rounded-lg border ${
                      formData.background === bg.toLowerCase()
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200'
                    } hover:border-pink-500 transition-all`}
                  >
                    <span className="block text-sm">{bg}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Group Photo Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Is this a group photo?
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleInputChange({ target: { name: 'isGroupPhoto', value: 'yes' }})}
                  className={`flex-1 p-4 rounded-lg border ${
                    formData.isGroupPhoto === 'yes'
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200'
                  } hover:border-pink-500 transition-all`}
                >
                  <span className="block text-sm">Yes</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange({ target: { name: 'isGroupPhoto', value: 'no' }})}
                  className={`flex-1 p-4 rounded-lg border ${
                    formData.isGroupPhoto === 'no'
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200'
                  } hover:border-pink-500 transition-all`}
                >
                  <span className="block text-sm">No</span>
                </button>
              </div>
            </div>

            {/* Group Members (Conditional) */}
            {formData.isGroupPhoto === 'yes' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Who are you with?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['Friends', 'Partner', 'Family', 'Office Mates', 'Colleagues'].map((member) => (
                    <button
                      key={member}
                      type="button"
                      onClick={() => {
                        const newMembers = formData.groupMembers.includes(member)
                          ? formData.groupMembers.filter(m => m !== member)
                          : [...formData.groupMembers, member];
                        handleInputChange({ target: { name: 'groupMembers', value: newMembers }});
                      }}
                      className={`p-4 rounded-lg border ${
                        formData.groupMembers.includes(member)
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200'
                      } hover:border-pink-500 transition-all`}
                    >
                      <span className="block text-sm">{member}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mood Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What&apos;s your mood?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {['Good', 'Bad', 'Sad', 'Angry', 'Love'].map((mood) => (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => handleInputChange({ target: { name: 'mood', value: mood.toLowerCase() }})}
                    className={`p-4 rounded-lg border ${
                      formData.mood === mood.toLowerCase()
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200'
                    } hover:border-pink-500 transition-all`}
                  >
                    <span className="block text-sm">{mood}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Mood Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or describe your mood (optional)
              </label>
              <input
                type="text"
                name="customMood"
                value={formData.customMood}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="E.g., Adventurous, Peaceful, Excited..."
              />
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors disabled:bg-pink-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>Generating...</>
              ) : (
                <>Generate Caption</>
              )}
            </button>
          </form>

          {/* Generated Caption */}
          {generatedCaption && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-medium text-gray-800 mb-3">Generated Caption:</h2>
              <p className="text-gray-600">{generatedCaption}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedCaption);
                }}
                className="mt-4 text-pink-500 hover:text-pink-600 text-sm font-medium flex items-center gap-2"
              >
                Copy to clipboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstagramCaptionGenerator;