import React from 'react';
import { FieldArray, Field } from 'formik';
import {
  Psychology as SkillsIcon,
  Language as LanguageIcon,
  CardMembership as CertificationIcon,
  InterestsTwoTone as InterestsIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Business as OrganizationIcon,
  Work as RoleIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  School as IssuerIcon,
  VolunteerActivism
} from '@mui/icons-material';

interface ProficiencyLevel {
  value: 'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic';
  label: string;
}

// Define interfaces for form sections
interface Language {
  language: string;
  proficiency: ProficiencyLevel['value'];
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
  description: string;
}

interface VolunteerExperience {
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

// Define interface for form values
interface SkillsPageValues {
  skills: string;
  languages: Language[];
  certifications: Certification[];
  interests: string;
  volunteer: VolunteerExperience[];
}

// Define props interface
interface SkillsPageProps {
  values: SkillsPageValues;
}

const PROFICIENCY_LEVELS: ProficiencyLevel[] = [
  { value: 'native', label: 'Native' },
  { value: 'fluent', label: 'Fluent' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'basic', label: 'Basic' }
];

const SkillsPage: React.FC<SkillsPageProps> = ({ values }) => {
  return (
    <div className="space-y-8">
      {/* Skills Section */}
      <div className="space-y-4">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center">
            <SkillsIcon className="mr-2 text-gray-500" />
            Skills
          </h3>
        </div>
        <div className="space-y-2">
          <Field
            as="textarea"
            name="skills"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent h-32"
            placeholder="Enter your skills (separated by commas)"
          />
        </div>
      </div>

      {/* Languages Section */}
      <div className="space-y-4">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center">
            <LanguageIcon className="mr-2 text-gray-500" />
            Languages
          </h3>
        </div>

        <FieldArray name="languages">
          {({ push, remove }) => (
            <div className="space-y-4">
              {values.languages.map((_, index) => (
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
                        <LanguageIcon className="text-gray-400 mr-2" />
                        Language
                      </label>
                      <Field
                        name={`languages.${index}.language`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Enter language"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-gray-700">
                        <LanguageIcon className="text-gray-400 mr-2" />
                        Proficiency
                      </label>
                      <Field
                        as="select"
                        name={`languages.${index}.proficiency`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="">Select proficiency level</option>
                        {PROFICIENCY_LEVELS.map(level => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </Field>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => push({ language: "", proficiency: "" })}
                className="flex items-center gap-2 px-4 py-2 text-pink-600 border border-pink-600 rounded-lg hover:bg-pink-50"
              >
                <AddIcon /> Add Language
              </button>
            </div>
          )}
        </FieldArray>
      </div>

      {/* Certifications Section */}
      <div className="space-y-4">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center">
            <CertificationIcon className="mr-2 text-gray-500" />
            Certifications
          </h3>
        </div>

        <FieldArray name="certifications">
          {({ push, remove }) => (
            <div className="space-y-4">
              {values.certifications.map((_, index) => (
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
                        <CertificationIcon className="text-gray-400 mr-2" />
                        Certification Name
                      </label>
                      <Field
                        name={`certifications.${index}.name`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Enter certification name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-gray-700">
                        <IssuerIcon className="text-gray-400 mr-2" />
                        Issuing Organization
                      </label>
                      <Field
                        name={`certifications.${index}.issuer`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Enter issuer name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-gray-700">
                        <CalendarIcon className="text-gray-400 mr-2" />
                        Date
                      </label>
                      <Field
                        type="date"
                        name={`certifications.${index}.date`}
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
                      name={`certifications.${index}.description`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent h-24"
                      placeholder="Describe your certification"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => push({ 
                  name: "", 
                  issuer: "", 
                  date: "", 
                  description: "" 
                })}
                className="flex items-center gap-2 px-4 py-2 text-pink-600 border border-pink-600 rounded-lg hover:bg-pink-50"
              >
                <AddIcon /> Add Certification
              </button>
            </div>
          )}
        </FieldArray>
      </div>

      {/* Interests Section */}
      <div className="space-y-4">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center">
            <InterestsIcon className="mr-2 text-gray-500" />
            Interests
          </h3>
        </div>
        <div className="space-y-2">
          <Field
            as="textarea"
            name="interests"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent h-32"
            placeholder="Enter your interests and hobbies"
          />
        </div>
      </div>

      {/* Volunteer Experience Section */}
      <div className="space-y-4">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center">
            <VolunteerActivism className="mr-2 text-gray-500" />
            Volunteer Experience
          </h3>
        </div>

        <FieldArray name="volunteer">
          {({ push, remove }) => (
            <div className="space-y-4">
              {values.volunteer.map((_, index) => (
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
                        <OrganizationIcon className="text-gray-400 mr-2" />
                        Organization
                      </label>
                      <Field
                        name={`volunteer.${index}.organization`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Enter organization name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-gray-700">
                        <RoleIcon className="text-gray-400 mr-2" />
                        Role
                      </label>
                      <Field
                        name={`volunteer.${index}.role`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Enter your role"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-gray-700">
                        <CalendarIcon className="text-gray-400 mr-2" />
                        Start Date
                      </label>
                      <Field
                        type="date"
                        name={`volunteer.${index}.startDate`}
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
                        name={`volunteer.${index}.endDate`}
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
                      name={`volunteer.${index}.description`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent h-32"
                      placeholder="Describe your volunteer work"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => push({ 
                  organization: "", 
                  role: "", 
                  startDate: "", 
                  endDate: "", 
                  description: "" 
                })}
                className="flex items-center gap-2 px-4 py-2 text-pink-600 border border-pink-600 rounded-lg hover:bg-pink-50"
              >
                <AddIcon /> Add Volunteer Experience
              </button>
            </div>
          )}
        </FieldArray>
      </div>
    </div>
  );
};

export default SkillsPage;