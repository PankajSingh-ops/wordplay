"use client";

import React, { useState } from "react";
import { Formik, Form, Field, FieldArray, FormikHelpers } from "formik";
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import ErrorIcon from '@mui/icons-material/Error';
import ImageIcon from '@mui/icons-material/Image';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import StyleIcon from '@mui/icons-material/Style';
import Header from "@/app/common/Header";



const RESUME_TEMPLATES = [
  { id: 'modern', name: 'Modern', description: 'Clean and minimal design with accent colors' },
  { id: 'professional', name: 'Professional', description: 'Traditional format with a corporate feel' },
  { id: 'creative', name: 'Creative', description: 'Unique layout with bold typography' },
  { id: 'executive', name: 'Executive', description: 'Sophisticated design for senior positions' },
];

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' }
];

const MARITAL_STATUS_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' }
];

const initialValues = {
  selectedTemplate: 'modern',
  profileImage: "",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  address: "",
  zipcode: "",
  city: "",
  nationality: "",
  dob: "",
  gender: "",
  maritalStatus: "",
  linkedin: "",
  website: "",
  objective: "",
  workExperience: [
    { jobTitle: "", city: "", companyName: "", startDate: "", endDate: "", description: "" }
  ],
  education: [
    { degree: "", city: "", schoolName: "", startDate: "", endDate: "" }
  ],
  skills: "",
  interests: ""
};

const ResumeBuilder = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [previewImage, setPreviewImage] = useState<any>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleImageChange = (event:any, setFieldValue:any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFieldValue("profileImage", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values: any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { setSubmitting, setStatus }: FormikHelpers<any>
  ) => {    try {
      const response = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      if (result.downloadUrl) {
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = 'resume.docx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        setStatus({ error: result.error || 'Failed to generate resume' });
      }
    } catch (error) {
      console.log(error);
      setStatus({ error: 'Failed to generate resume. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <DescriptionIcon className="text-blue-600 text-3xl" />
          <h1 className="text-2xl font-bold text-gray-800">Resume Builder</h1>
        </div>

        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting, status, setFieldValue }) => (
            <Form className="space-y-6">
              {status && status.error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
                  <ErrorIcon className="text-red-500" />
                  <p className="text-red-700">{status.error}</p>
                </div>
              )}

              {/* Template Selection */}
              <div className="border-b pb-6">
                <div className="flex items-center gap-2 mb-4">
                  <StyleIcon className="text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-700">Choose Template</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {RESUME_TEMPLATES.map(template => (
                    <label 
                      key={template.id}
                      className={`
                        border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition
                        ${values.selectedTemplate === template.id ? 'border-blue-500 bg-blue-50' : ''}
                      `}
                    >
                      <Field
                        type="radio"
                        name="selectedTemplate"
                        value={template.id}
                        className="sr-only"
                      />
                      <div className="font-medium text-gray-700">{template.name}</div>
                      <div className="text-sm text-gray-500">{template.description}</div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="border-b pb-6">
                <div className="flex items-center gap-2 mb-4">
                  <PersonIcon className="text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-700">Personal Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Profile Image */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Image
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 border rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
                        {previewImage ? (
                          <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="text-gray-400 text-3xl" />
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, setFieldValue)}
                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0 file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <Field
                      name="firstName"
                      type="text"
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <Field
                      name="lastName"
                      type="text"
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <Field
                      name="dob"
                      type="date"
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <Field
                      as="select"
                      name="gender"
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Gender</option>
                      {GENDER_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marital Status
                    </label>
                    <Field
                      as="select"
                      name="maritalStatus"
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Marital Status</option>
                      {MARITAL_STATUS_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Field
                      name="email"
                      type="email"
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <Field
                      name="phoneNumber"
                      type="tel"
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <LinkedInIcon className="text-gray-400" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        LinkedIn Profile
                      </label>
                      <Field
                        name="linkedin"
                        type="url"
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <LanguageIcon className="text-gray-400" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <Field
                        name="website"
                        type="url"
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Professional Objective
                    </label>
                    <Field
                      name="objective"
                      as="textarea"
                      rows="4"
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="Brief summary of your career objectives..."
                    />
                  </div>
                </div>
              </div>

              {/* Work Experience Section */}
              <div className="border-b pb-6">
                <div className="flex items-center gap-2 mb-4">
                  <WorkIcon className="text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-700">Work Experience</h2>
                </div>

                <FieldArray name="workExperience">
                  {({ push, remove }) => (
                    <div>
                      {values.workExperience.map((_, index) => (
                        <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="font-medium text-gray-700">Experience {index + 1}</h3>
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Job Title
                              </label>
                              <Field
                                name={`workExperience.${index}.jobTitle`}
                                type="text"
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company Name
                              </label>
                              <Field
                                name={`workExperience.${index}.companyName`}
                                type="text"
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                City
                              </label>
                              <Field
                                name={`workExperience.${index}.city`}
                                type="text"
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                                </label>
                                <Field
                                name={`workExperience.${index}.startDate`}
                                type="date"
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                              </label>
                              <Field
                                name={`workExperience.${index}.endDate`}
                                type="date"
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                              </label>
                              <Field
                                name={`workExperience.${index}.description`}
                                as="textarea"
                                rows="3"
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                                placeholder="Describe your responsibilities and achievements..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => push({ 
                          jobTitle: "", 
                          city: "", 
                          companyName: "", 
                          startDate: "", 
                          endDate: "", 
                          description: "" 
                        })}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                      >
                        <AddIcon /> Add More Experience
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>

              {/* Education Section */}
              <div className="border-b pb-6">
                <div className="flex items-center gap-2 mb-4">
                  <SchoolIcon className="text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-700">Education</h2>
                </div>

                <FieldArray name="education">
                  {({ push, remove }) => (
                    <div>
                      {values.education.map((_, index) => (
                        <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="font-medium text-gray-700">Education {index + 1}</h3>
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Degree
                              </label>
                              <Field
                                name={`education.${index}.degree`}
                                type="text"
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                School Name
                              </label>
                              <Field
                                name={`education.${index}.schoolName`}
                                type="text"
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                City
                              </label>
                              <Field
                                name={`education.${index}.city`}
                                type="text"
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                              </label>
                              <Field
                                name={`education.${index}.startDate`}
                                type="date"
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                              </label>
                              <Field
                                name={`education.${index}.endDate`}
                                type="date"
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => push({ 
                          degree: "", 
                          city: "", 
                          schoolName: "", 
                          startDate: "", 
                          endDate: "" 
                        })}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                      >
                        <AddIcon /> Add More Education
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>

              {/* Skills & Interests Section */}
              <div className="border-b pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Skills
                    </label>
                    <Field
                      name="skills"
                      as="textarea"
                      rows="4"
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="List your key skills..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Interests
                    </label>
                    <Field
                      name="interests"
                      as="textarea"
                      rows="4"
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="List your interests and hobbies..."
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    px-6 py-2 rounded-lg text-white font-medium
                    ${isSubmitting 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'}
                  `}
                >
                  {isSubmitting ? 'Generating...' : 'Generate Resume'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
    </>
  );
};

export default ResumeBuilder;