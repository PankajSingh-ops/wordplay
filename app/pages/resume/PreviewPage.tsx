import React from 'react';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon,
  LinkedIn as LinkedInIcon,
  Language as WebsiteIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Psychology as SkillsIcon,
  CardMembership as CertificationIcon,
  Interests as InterestsIcon,
  VolunteerActivism as VolunteerIcon
} from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';

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
  startDate: string;
  endDate: string;
}

interface Language {
  language: string;
  proficiency: string;
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
  description?: string;
}

interface Volunteer {
  role: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface ResumeValues {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  linkedin?: string;
  website?: string;
  objective?: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills?: string;
  languages: Language[];
  certifications: Certification[];
  volunteer: Volunteer[];
  interests?: string;
}

interface SectionProps {
  icon: React.ReactElement<SvgIconProps>;
  title: string;
  children: React.ReactNode;
}

interface ContactItemProps {
  icon: React.ReactElement<SvgIconProps>;
  text: string;
  link?: string;
}

const Section: React.FC<SectionProps> = ({ icon, title, children }) => (
  <div className="mb-6">
    <div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-2">
      {icon}
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
    {children}
  </div>
);

const ContactItem: React.FC<ContactItemProps> = ({ icon, text, link }) => {
  const content = (
    <div className="flex items-center gap-2 text-gray-600">
      {icon}
      <span>{text}</span>
    </div>
  );

  return link ? (
    <a href={link} target="_blank" rel="noopener noreferrer" className="hover:text-pink-600">
      {content}
    </a>
  ) : content;
};

const PreviewPage: React.FC<{ values: ResumeValues }> = ({ values }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {values.firstName} {values.lastName}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 justify-center mt-4">
          {values.email && (
            <ContactItem 
              icon={<EmailIcon className="text-gray-500" />}
              text={values.email}
              link={`mailto:${values.email}`}
            />
          )}
          {values.phoneNumber && (
            <ContactItem 
              icon={<PhoneIcon className="text-gray-500" />}
              text={values.phoneNumber}
              link={`tel:${values.phoneNumber}`}
            />
          )}
          {values.address && (
            <ContactItem 
              icon={<LocationIcon className="text-gray-500" />}
              text={`${values.address}, ${values.city}`}
            />
          )}
          {values.linkedin && (
            <ContactItem 
              icon={<LinkedInIcon className="text-gray-500" />}
              text="LinkedIn Profile"
              link={values.linkedin}
            />
          )}
          {values.website && (
            <ContactItem 
              icon={<WebsiteIcon className="text-gray-500" />}
              text="Portfolio"
              link={values.website}
            />
          )}
        </div>
      </div>

      {/* Objective */}
      {values.objective && (
        <Section icon={<PersonIcon className="text-gray-500" />} title="Professional Summary">
          <p className="text-gray-700 whitespace-pre-wrap">{values.objective}</p>
        </Section>
      )}

      {/* Work Experience */}
      {values.workExperience.length > 0 && (
        <Section icon={<WorkIcon className="text-gray-500" />} title="Work Experience">
          <div className="space-y-4">
            {values.workExperience.map((exp, index) => (
              <div key={index} className="border-l-2 border-pink-200 pl-4">
                <h3 className="text-lg font-semibold text-gray-800">{exp.jobTitle}</h3>
                <h4 className="text-md text-gray-600">{exp.companyName} - {exp.city}</h4>
                <p className="text-sm text-gray-500">
                  {exp.startDate} - {exp.endDate}
                </p>
                <p className="mt-2 text-gray-700 whitespace-pre-wrap">{exp.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Education */}
      {values.education.length > 0 && (
        <Section icon={<SchoolIcon className="text-gray-500" />} title="Education">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {values.education.map((edu, index) => (
              <div key={index} className="border-l-2 border-pink-200 pl-4">
                <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                <h4 className="text-md text-gray-600">{edu.schoolName}</h4>
                <p className="text-sm text-gray-500">
                  {edu.startDate} - {edu.endDate}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Skills */}
      {values.skills && (
        <Section icon={<SkillsIcon className="text-gray-500" />} title="Skills">
          <div className="flex flex-wrap gap-2">
            {values.skills.split(',').map((skill, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-sm"
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Languages */}
      {values.languages.length > 0 && (
        <Section icon={<LanguageIcon className="text-gray-500" />} title="Languages">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {values.languages.map((lang, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{lang.language}</span>
                <span className="text-sm text-gray-500">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Certifications */}
      {values.certifications.length > 0 && (
        <Section icon={<CertificationIcon className="text-gray-500" />} title="Certifications">
          <div className="space-y-4">
            {values.certifications.map((cert, index) => (
              <div key={index} className="border-l-2 border-pink-200 pl-4">
                <h3 className="text-lg font-semibold text-gray-800">{cert.name}</h3>
                <h4 className="text-md text-gray-600">{cert.issuer}</h4>
                <p className="text-sm text-gray-500">{cert.date}</p>
                {cert.description && (
                  <p className="mt-2 text-gray-700">{cert.description}</p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Volunteer Experience */}
      {values.volunteer.length > 0 && (
        <Section icon={<VolunteerIcon className="text-gray-500" />} title="Volunteer Experience">
          <div className="space-y-4">
            {values.volunteer.map((vol, index) => (
              <div key={index} className="border-l-2 border-pink-200 pl-4">
                <h3 className="text-lg font-semibold text-gray-800">{vol.role}</h3>
                <h4 className="text-md text-gray-600">{vol.organization}</h4>
                <p className="text-sm text-gray-500">
                  {vol.startDate} - {vol.endDate}
                </p>
                <p className="mt-2 text-gray-700 whitespace-pre-wrap">{vol.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Interests */}
      {values.interests && (
        <Section icon={<InterestsIcon className="text-gray-500" />} title="Interests">
          <p className="text-gray-700">{values.interests}</p>
        </Section>
      )}
    </div>
  );
};

export default PreviewPage;