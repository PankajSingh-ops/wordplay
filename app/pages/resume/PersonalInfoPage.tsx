import React from 'react';
import { Field, FormikHelpers } from 'formik';
import {
  CalendarToday as CalendarIcon,
  Language as GlobeIcon,
  LinkedIn as LinkedInIcon,
  Link as LinkIcon,
  CloudUpload as CloudUploadIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  LocationCity as CityIcon
} from '@mui/icons-material';

interface ResumeTemplate {
  id: 'modern' | 'professional' | 'creative' | 'executive';
  name: string;
  description: string;
}

// Define types for select options
interface SelectOption {
  value: string;
  label: string;
}

// Define form values interface
interface FormValues {
  selectedTemplate: ResumeTemplate['id'];
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
}

// Define props interface
interface PersonalInfoPageProps {
  values: FormValues;
  setFieldValue: FormikHelpers<FormValues>['setFieldValue'];
}

const RESUME_TEMPLATES: ResumeTemplate[] = [
  { id: 'modern', name: 'Modern', description: 'Clean and minimal design with accent colors' },
  { id: 'professional', name: 'Professional', description: 'Traditional format with a corporate feel' },
  { id: 'creative', name: 'Creative', description: 'Unique layout with bold typography' },
  { id: 'executive', name: 'Executive', description: 'Sophisticated design for senior positions' },
];

const GENDER_OPTIONS: SelectOption[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' }
];

const MARITAL_STATUS_OPTIONS: SelectOption[] = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' }
];

const PersonalInfoPage: React.FC<PersonalInfoPageProps> = ({ values, setFieldValue }) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFieldValue('profileImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Choose Template</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {RESUME_TEMPLATES.map((template) => (
            <div
              key={template.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                values.selectedTemplate === template.id
                  ? 'border-pink-600 bg-pink-50'
                  : 'border-gray-200 hover:border-pink-300'
              }`}
              onClick={() => setFieldValue('selectedTemplate', template.id)}
            >
              <h4 className="font-medium text-gray-800">{template.name}</h4>
              <p className="text-sm text-gray-500 mt-1">{template.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Image Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Profile Image</h3>
        <div className="flex items-center space-x-4">
          {values.profileImage && (
            <img
              src={values.profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
          )}
          <label className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <CloudUploadIcon className="text-gray-500 mr-2" />
            <span className="text-gray-600">Upload Photo</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>

      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Personal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name Fields */}
          <div className="space-y-2">
            <label className="flex items-center text-gray-700">
              <PersonIcon className="text-gray-400 mr-2" />
              First Name
            </label>
            <Field
              name="firstName"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter your first name"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-gray-700">
              <PersonIcon className="text-gray-400 mr-2" />
              Last Name
            </label>
            <Field
              name="lastName"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter your last name"
            />
          </div>

          {/* Contact Fields */}
          <div className="space-y-2">
            <label className="flex items-center text-gray-700">
              <EmailIcon className="text-gray-400 mr-2" />
              Email Address
            </label>
            <Field
              name="email"
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-gray-700">
              <PhoneIcon className="text-gray-400 mr-2" />
              Phone Number
            </label>
            <Field
              name="phoneNumber"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Address Fields */}
          <div className="space-y-2">
            <label className="flex items-center text-gray-700">
              <HomeIcon className="text-gray-400 mr-2" />
              Address
            </label>
            <Field
              name="address"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter your address"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-gray-700">
              <CityIcon className="text-gray-400 mr-2" />
              City
            </label>
            <Field
              name="city"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter your city"
            />
          </div>

          {/* Additional Fields */}
          <div className="space-y-2">
            <label className="flex items-center text-gray-700">
              <GlobeIcon className="text-gray-400 mr-2" />
              Nationality
            </label>
            <Field
              name="nationality"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter your nationality"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-gray-700">
              <CalendarIcon className="text-gray-400 mr-2" />
              Date of Birth
            </label>
            <Field
              name="dob"
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Gender Selection */}
          <div className="space-y-2">
            <label className="flex items-center text-gray-700">
              <PersonIcon className="text-gray-400 mr-2" />
              Gender
            </label>
            <Field
              as="select"
              name="gender"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Select gender</option>
              {GENDER_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Field>
          </div>

          {/* Marital Status */}
          <div className="space-y-2">
            <label className="flex items-center text-gray-700">
              <PersonIcon className="text-gray-400 mr-2" />
              Marital Status
            </label>
            <Field
              as="select"
              name="maritalStatus"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Select marital status</option>
              {MARITAL_STATUS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Field>
          </div>

          {/* Social Links */}
          <div className="space-y-2">
            <label className="flex items-center text-gray-700">
              <LinkedInIcon className="text-gray-400 mr-2" />
              LinkedIn Profile
            </label>
            <Field
              name="linkedin"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter your LinkedIn URL"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-gray-700">
              <LinkIcon className="text-gray-400 mr-2" />
              Website
            </label>
            <Field
              name="website"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter your website URL"
            />
          </div>
        </div>

        {/* Career Objective */}
        <div className="space-y-2">
          <label className="flex items-center text-gray-700">
            <PersonIcon className="text-gray-400 mr-2" />
            Career Objective
          </label>
          <Field
            as="textarea"
            name="objective"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent h-32"
            placeholder="Enter your career objective"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoPage;