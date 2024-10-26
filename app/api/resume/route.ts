import { NextResponse } from 'next/server';
import { 
  Document, 
  Packer,
  Paragraph, 
  TextRun, 
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  TableRow,
  TableCell,
  Table,
  WidthType,
  convertInchesToTwip,
  ImageRun
} from 'docx';

interface ResumeData {
    selectedTemplate: 'modern' | 'professional' | 'creative' | 'executive';
    profileImage: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address?: string;
    zipcode?: string;
    city?: string;
    nationality?: string;
    dob?: string;
    gender?: string;
    maritalStatus?: string;
    linkedin?: string;
    website?: string;
    objective?: string;
    workExperience: WorkExperience[];
    education: Education[];
    skills: string;
    interests?: string;
  }
  
  interface WorkExperience {
    jobTitle: string;
    city: string;
    companyName: string;
    startDate: string;
    endDate?: string;
    description: string;
  }
  
  interface Education {
    degree: string;
    city: string;
    schoolName: string;
    startDate: string;
    endDate: string;
  }
  
  interface StyleConfig {
    spacing: {
      section: number;
      heading: number;
    };
    sizes: {
      name: number;
      heading: number;
      subheading: number;
      body: number;
    };
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
  }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const templateStyles:any = {
  modern: {
    colors: {
      primary: "2E74B5",
      secondary: "404040",
      accent: "7F7F7F"
    },
    fonts: {
      heading: "Calibri",
      body: "Calibri Light"
    },
    sizes: {
      name: 36,
      heading: 24,
      subheading: 22,
      body: 20
    },
    spacing: {
      heading: 300,
      section: 200
    }
  },
  professional: {
    colors: {
      primary: "000000",
      secondary: "666666",
      accent: "333333"
    },
    fonts: {
      heading: "Times New Roman",
      body: "Arial"
    },
    sizes: {
      name: 32,
      heading: 24,
      subheading: 22,
      body: 20
    },
    spacing: {
      heading: 400,
      section: 300
    }
  },
  creative: {
    colors: {
      primary: "2E86C1",
      secondary: "17A589",
      accent: "8E44AD"
    },
    fonts: {
      heading: "Verdana",
      body: "Segoe UI"
    },
    sizes: {
      name: 40,
      heading: 28,
      subheading: 24,
      body: 20
    },
    spacing: {
      heading: 280,
      section: 180
    }
  },
  executive: {
    colors: {
      primary: "1C2833",
      secondary: "566573",
      accent: "273746"
    },
    fonts: {
      heading: "Georgia",
      body: "Palatino"
    },
    sizes: {
      name: 34,
      heading: 26,
      subheading: 22,
      body: 20
    },
    spacing: {
      heading: 350,
      section: 250
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatDate = (dateString:any, format = 'short') => {
  if (!dateString) return '';
  const date = new Date(dateString);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formats:any = {
    short: { month: 'short', year: 'numeric' },
    full: { month: 'long', day: 'numeric', year: 'numeric' }
  };
  return date.toLocaleDateString('en-US', formats[format]);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const base64ToBuffer = (base64String:any) => {
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  return Buffer.from(base64Data, 'base64');
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createHeading = (text:any, style:any, template:any) => {
  const templateStyle = templateStyles[template];
  
  return new Paragraph({
    text: text.toUpperCase(),
    heading: HeadingLevel.HEADING_1,
    spacing: { 
      before: templateStyle.spacing.heading, 
      after: templateStyle.spacing.section 
    },
    border: {
      bottom: {
        color: templateStyle.colors.accent,
        space: 1,
        style: BorderStyle.SINGLE,
        size: 6,
      },
    },
    alignment: template === 'creative' ? AlignmentType.CENTER : AlignmentType.LEFT
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generateDocx = async (resumeData:ResumeData) => {
  const template = resumeData.selectedTemplate || 'modern';
  const style = templateStyles[template];

  const sections = [
    {
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(0.5),
            right: convertInchesToTwip(0.5),
            bottom: convertInchesToTwip(0.5),
            left: convertInchesToTwip(0.5),
          },
        },
      },
      children: [
        // Header Section with conditional styling
        ...(resumeData.profileImage
          ? [
              new Paragraph({
                alignment: template === 'creative' ? AlignmentType.CENTER : AlignmentType.LEFT,
                spacing: { after: style.spacing.section },
                children: [
                  new ImageRun({
                    data: base64ToBuffer(resumeData.profileImage),
                    // width and height might not be directly supported
                    transformation: {
                      width: 100, // Specifying width via transformation may work with certain viewers
                      height: 100,
                    },
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  } as any), // Type assertion as workaround
                ],
              }),
            ]
          : []),

      // Name and Title Section
      new Paragraph({
        alignment: template === 'creative' ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { after: style.spacing.section },
        children: [
          new TextRun({
            text: `${resumeData.firstName} ${resumeData.lastName}`,
            bold: true,
            size: style.sizes.name,
            color: style.colors.primary,
            font: style.fonts.heading,
          }),
        ],
      }),

      // Personal Details Section
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        margins: { top: 100, bottom: 100, right: 100, left: 100 },
        borders: template === 'modern' ? undefined : {
          top: { style: BorderStyle.SINGLE, size: 1, color: style.colors.accent },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: style.colors.accent },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [createContactInfo(resumeData, style)],
              }),
              new TableCell({
                children: [createPersonalInfo(resumeData, style)],
              }),
            ],
          }),
        ],
      }),

      // Professional Summary
      ...(resumeData.objective ? [
        createHeading("Professional Summary", style, template),
        new Paragraph({
          spacing: { after: style.spacing.section },
          children: [
            new TextRun({
              text: resumeData.objective,
              size: style.sizes.body,
              font: style.fonts.body,
            }),
          ],
        }),
      ] : []),

      // Work Experience Section
      createHeading("Professional Experience", style, template),
      ...generateExperienceSection(resumeData.workExperience, style),

      // Education Section
      createHeading("Education", style, template),
      ...generateEducationSection(resumeData.education, style),

      // Skills Section
      ...(resumeData.skills ? [
        createHeading("Skills", style, template),
        ...generateSkillsSection(resumeData.skills, style, template),
      ] : []),

      // Additional Sections
      ...(resumeData.interests ? [
        createHeading("Interests", style, template),
        new Paragraph({
          spacing: { before: style.spacing.section },
          children: [
            new TextRun({
              text: resumeData.interests,
              size: style.sizes.body,
              font: style.fonts.body,
            }),
          ],
        }),
      ] : []),
    ],
  }];

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: style.fonts.body,
            size: style.sizes.body,
          },
        },
      },
    },
    sections,
  });

  return await Packer.toBuffer(doc);
};

// Helper functions for generating sections
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createContactInfo = (resumeData:any, style:any) => {
  return new Paragraph({
    children: [
      new TextRun({
        text: `${resumeData.email}\n`,
        size: style.sizes.body,
        font: style.fonts.body,
      }),
      new TextRun({
        text: `${resumeData.phoneNumber}\n`,
        size: style.sizes.body,
        font: style.fonts.body,
      }),
      ...(resumeData.location ? [
        new TextRun({
          text: `${resumeData.location}\n`,
          size: style.sizes.body,
          font: style.fonts.body,
        }),
      ] : []),
    ],
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createPersonalInfo = (resumeData:any, style:any) => {
  return new Paragraph({
    children: [
      ...(resumeData.nationality ? [
        new TextRun({
          text: `Nationality: ${resumeData.nationality}\n`,
          size: style.sizes.body,
          font: style.fonts.body,
        }),
      ] : []),
      ...(resumeData.dob ? [
        new TextRun({
          text: `Date of Birth: ${formatDate(resumeData.dob, 'full')}\n`,
          size: style.sizes.body,
          font: style.fonts.body,
        }),
      ] : []),
    ],
  });
};

const generateExperienceSection = (experiences: WorkExperience[], style: StyleConfig) => {
    return experiences.map(exp => [
    new Paragraph({
      spacing: { before: style.spacing.section },
      children: [
        new TextRun({
          text: exp.jobTitle,
          bold: true,
          size: style.sizes.subheading,
          color: style.colors.primary,
          font: style.fonts.heading,
        }),
        new TextRun({
          text: ` | ${exp.companyName}`,
          italics: true,
          size: style.sizes.subheading,
          color: style.colors.secondary,
          font: style.fonts.body,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: style.spacing.section / 2 },
      children: [
        new TextRun({
          text: `${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}`,
          size: style.sizes.body,
          font: style.fonts.body,
        }),
      ],
    }),
    ...(exp.description ? exp.description.split('\n').map(line =>
      new Paragraph({
        spacing: { before: style.spacing.section / 2 },
        bullet: { level: 0 },
        children: [
          new TextRun({
            text: line.trim(),
            size: style.sizes.body,
            font: style.fonts.body,
          }),
        ],
      })
    ) : []),
  ]).flat();
};

const generateEducationSection = (education: Education[], style: StyleConfig) => {
    return education.map(edu => [
    new Paragraph({
      spacing: { before: style.spacing.section },
      children: [
        new TextRun({
          text: edu.degree,
          bold: true,
          size: style.sizes.subheading,
          color: style.colors.primary,
          font: style.fonts.heading,
        }),
        new TextRun({
          text: ` | ${edu.schoolName}`,
          italics: true,
          size: style.sizes.subheading,
          color: style.colors.secondary,
          font: style.fonts.body,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: style.spacing.section / 2 },
      children: [
        new TextRun({
          text: `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`,
          size: style.sizes.body,
          font: style.fonts.body,
        }),
      ],
    }),
  ]).flat();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generateSkillsSection = (skills: string, style: StyleConfig, template: ResumeData['selectedTemplate']) => {
    const skillsList = skills.split(',').map(skill => skill.trim());
  
  if (template === 'creative') {
    return [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: skillsList.map(skill => new TextRun({
        text: `${skill} • `,
        size: style.sizes.body,
        font: style.fonts.body,
      })),
    })];
  }
  
  return skillsList.map(skill =>
    new Paragraph({
      spacing: { before: style.spacing.section / 2 },
      bullet: { level: 0 },
      children: [
        new TextRun({
          text: skill,
          size: style.sizes.body,
          font: style.fonts.body,
        }),
      ],
    })
  );
};

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    const docBuffer = await generateDocx(formData);
    
    // Create sanitized filename
    const sanitizedName = `${formData.firstName}-${formData.lastName}`
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const fileName = `resume-${sanitizedName}-${Date.now()}.docx`;

    // Create response with the file buffer
    const response = new NextResponse(docBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': docBuffer.length.toString()
      },
    });

    return response;
  } catch (error) {
    console.error('Resume generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate resume. Please try again.' },
      { status: 500 }
    );
  }
}

