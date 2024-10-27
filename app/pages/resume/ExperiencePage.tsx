import React from 'react';
import { FieldArray, Field } from 'formik';
import {
  Work as WorkIcon,
  School as SchoolIcon,
  EmojiEvents as AchievementsIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  LocationCity as LocationIcon,
  Business as CompanyIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';

interface WorkExperience {
  jobTitle: string;
  companyName: string;
  city: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  degree: string;
  schoolName: string;
  city: string;
  startDate: string;
  endDate: string;
}

interface Achievement {
  title: string;
  date: string;
  description: string;
}
interface ExperiencePageProps {
  values: {
    workExperience: WorkExperience[];
    education: Education[];
    achievements: Achievement[];
  };
}

const ExperiencePage: React.FC<ExperiencePageProps> = ({ values }) => {
  return (
    <div className="space-y-8">
      {/* Work Experience Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center">
            <WorkIcon className="mr-2 text-gray-500" />
            Work Experience
          </h3>
        </div>

        <FieldArray name="workExperience">
          {({ push, remove }) => (
            <div className="space-y-4">
              {values.workExperience.map((_, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4 relative">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                  >
                    <DeleteIcon />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="flex items-center text-gray-700">
                        <WorkIcon className="text-gray-400 mr-2" />
                        Job Title
                      </label>
                      <Field
                        name={`workExperience.${index}.jobTitle`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Enter job title"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-gray-700">
                        <CompanyIcon className="text-gray-400 mr-2" />
                        Company Name
                      </label>
                      <Field
                        name={`workExperience.${index}.companyName`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Enter company name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-gray-700">
                        <LocationIcon className="text-gray-400 mr-2" />
                        City
                      </label>
                      <Field
                        name={`workExperience.${index}.city`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Enter city"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-gray-700">
                        <CalendarIcon className="text-gray-400 mr-2" />
                        Start Date
                      </label>
                      <Field
                        type="date"
                        name={`workExperience.${index}.startDate`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-gray-700">
                        <CalendarIcon className="text-gray-400 mr-2" />
                        End Date
                      </label>
                      <Field
                        type="date"
                        name={`workExperience.${index}.endDate`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-gray-700">
                      <DescriptionIcon className="text-gray-400 mr-2" />
                      Description
                    </label>
                    <Field
                      as="textarea"
                      name={`workExperience.${index}.description`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent h-32"
                      placeholder="Describe your responsibilities and achievements"
                    />
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
                className="flex items-center gap-2 px-4 py-2 text-pink-600 border border-pink-600 rounded-lg hover:bg-pink-50"
              >
                <AddIcon /> Add Work Experience
              </button>
            </div>
          )}
        </FieldArray>
      </div>

      {/* Education Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center">
            <SchoolIcon className="mr-2 text-gray-500" />
            Education
          </h3>
        </div>

        <FieldArray name="education">
          {({ push, remove }) => (
            <div className="space-y-4">
              {values.education.map((_, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4 relative">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                  >
                    <DeleteIcon />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="flex items-center text-gray-700">
                        <SchoolIcon className="text-gray-400 mr-2" />
                        Degree
                      </label>
                      <Field
                        name={`education.${index}.degree`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Enter degree name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-gray-700">
                        <SchoolIcon className="text-gray-400 mr-2" />
                        School Name
                      </label>
                      <Field
                        name={`education.${index}.schoolName`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Enter school name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-gray-700">
                        <LocationIcon className="text-gray-400 mr-2" />
                        City
                      </label>
                      <Field
                        name={`education.${index}.city`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Enter city"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-gray-700">
                        <CalendarIcon className="text-gray-400 mr-2" />
                        Start Date
                      </label>
                      <Field
                        type="date"
                        name={`education.${index}.startDate`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-gray-700">
                        <CalendarIcon className="text-gray-400 mr-2" />
                        End Date
                      </label>
                      <Field
                        type="date"
                        name={`education.${index}.endDate`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                className="flex items-center gap-2 px-4 py-2 text-pink-600 border border-pink-600 rounded-lg hover:bg-pink-50"
              >
                <AddIcon /> Add Education
              </button>
            </div>
          )}
        </FieldArray>
      </div>

      {/* Achievements Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center">
            <AchievementsIcon className="mr-2 text-gray-500" />
            Achievements
          </h3>
        </div>

        <FieldArray name="achievements">
          {({ push, remove }) => (
            <div className="space-y-4">
              {values.achievements.map((_, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4 relative">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                  >
                    <DeleteIcon />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="flex items-center text-gray-700">
                        <AchievementsIcon className="text-gray-400 mr-2" />
                        Title
                      </label>
                      <Field
                        name={`achievements.${index}.title`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Enter achievement title"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-gray-700">
                        <CalendarIcon className="text-gray-400 mr-2" />
                        Date
                      </label>
                      <Field
                        type="date"
                        name={`achievements.${index}.date`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-gray-700">
                      <DescriptionIcon className="text-gray-400 mr-2" />
                      Description
                    </label>
                    <Field
                      as="textarea"
                      name={`achievements.${index}.description`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent h-32"
                      placeholder="Describe your achievement"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => push({ 
                  title: "", 
                  description: "", 
                  date: "" 
                })}
                className="flex items-center gap-2 px-4 py-2 text-pink-600 border border-pink-600 rounded-lg hover:bg-pink-50"
              >
                <AddIcon /> Add Achievement
              </button>
            </div>
          )}
        </FieldArray>
      </div>
    </div>
  );
};

export default ExperiencePage;