"use client"
import React, { useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import {
  Description as DescriptionIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon
} from '@mui/icons-material';
import PersonalInfoPage from "./PersonalInfoPage";
import ExperiencePage from "./ExperiencePage";
import PreviewPage from "./PreviewPage";
import SkillsPage from "./Skillspage";

// Define Template type
type ResumeTemplate = 'modern' | 'professional' | 'creative' | 'executive';

// Define proficiency type
type Proficiency = 'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic';

interface WorkExperience {
  jobTitle: string;
  city: string;
  companyName: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  degree: string;
  city: string;
  schoolName: string;
  startDate: string;
  endDate: string;
}

interface Achievement {
  title: string;
  description: string;
  date: string;
}

interface Language {
  language: string;
  proficiency: Proficiency;
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
  description: string;
}

interface Volunteer {
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface FormValues {
  // Page 1: Template and Personal Info
  selectedTemplate: ResumeTemplate;
  profileImage: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  nationality: string;
  dob: string;
  gender: string;
  maritalStatus: string;
  linkedin: string;
  website: string;
  objective: string;

  // Page 2: Experience and Education
  workExperience: WorkExperience[];
  education: Education[];
  achievements: Achievement[];

  // Page 3: Skills and Additional Info
  skills: string;
  languages: Language[];
  certifications: Certification[];
  interests: string;
  volunteer: Volunteer[];
}

const initialValues: FormValues = {
  selectedTemplate: 'modern',
  profileImage: "",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  address: "",
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
  achievements: [
    { title: "", description: "", date: "" }
  ],

  skills: "",
  languages: [
    { language: "", proficiency: "intermediate" }
  ],
  certifications: [
    { name: "", issuer: "", date: "", description: "" }
  ],
  interests: "",
  volunteer: [
    { organization: "", role: "", startDate: "", endDate: "", description: "" }
  ]
};

const MainPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [formikKey, setFormikKey] = useState(0); // Add key for Formik reset

  const handleSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    try {
      const response = await fetch('/api/resume', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to generate resume');

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'resume.docx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      // Reset the form and go back to first page
      resetForm();
      setCurrentPage(1);
      setFormikKey(prev => prev + 1); // Force Formik to reset completely
    } catch (error) {
      console.error('Error generating resume:', error);
    }
  };

  const renderPageContent = (values: FormValues, setFieldValue: FormikHelpers<FormValues>['setFieldValue']) => {
    switch (currentPage) {
      case 1:
        return <PersonalInfoPage values={values} setFieldValue={setFieldValue} />;
      case 2:
        return <ExperiencePage values={values} />;
      case 3:
        return <SkillsPage values={values} />;
      case 4:
        return <PreviewPage values={values} />;
      default:
        return null;
    }
  };

  const steps = ['Personal Info', 'Experience', 'Skills', 'Preview'];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <DescriptionIcon className="text-pink-600 text-3xl" />
          <h1 className="text-2xl font-bold text-gray-800">Resume Builder</h1>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`flex items-center ${index + 1 === currentPage ? 'text-pink-600' : 'text-gray-400'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                    ${index + 1 === currentPage ? 'border-pink-600 bg-pink-50' : 'border-gray-300'}`}
                >
                  {index + 1}
                </div>
                <span className="ml-2">{step}</span>
              </div>
            ))}
          </div>
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
              <div
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-600"
                style={{ width: `${(currentPage / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <Formik<FormValues>
          key={formikKey} // Add key to force complete reset
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-6">
              {renderPageContent(values, setFieldValue)}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                {currentPage > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="flex items-center gap-2 px-4 py-2 text-pink-600 border border-pink-600 rounded-lg hover:bg-pink-50"
                  >
                    <NavigateBeforeIcon /> Previous
                  </button>
                )}
                {currentPage < 4 && (
                  <button
                    type="button"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 ml-auto"
                  >
                    Next <NavigateNextIcon />
                  </button>
                )}
                {currentPage === 4 && (
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 ml-auto"
                  >
                    Generate Resume
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default MainPage;