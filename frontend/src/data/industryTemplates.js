/**
 * Industry-Specific Templates for E-Learning Site Builder
 * Comprehensive library of templates organized by industry domain
 */

export const INDUSTRY_DOMAINS = {
  COMPLIANCE: 'compliance-training',
  ONBOARDING: 'employee-onboarding',
  PRODUCT: 'product-training',
  SOFT_SKILLS: 'soft-skills',
  TECHNICAL: 'technical-training',
  HEALTHCARE: 'healthcare',
  FINANCE: 'finance',
  MANUFACTURING: 'manufacturing',
  CUSTOM: 'custom-blank'
};

const createContentBlock = (type, content, title = '', metadata = {}) => ({
  id: Date.now() + Math.random(),
  type,
  content,
  title,
  ...metadata
});

// ============================================================================
// COMPLIANCE TRAINING TEMPLATES
// ============================================================================

export const COMPLIANCE_TRAINING_TEMPLATE = {
  id: 'template-compliance-training',
  name: 'Compliance Training Course',
  description: 'Data protection, GDPR, and regulatory compliance training',
  category: INDUSTRY_DOMAINS.COMPLIANCE,
  industry: 'Compliance & Legal',
  difficulty: 'Beginner to Intermediate',
  estimatedTime: 45,
  tags: ['compliance', 'data-protection', 'regulations', 'required'],
  suggestedQuestions: ['qb-gdpr-001', 'qb-privacy-001', 'qb-compliance-001'],
  suggestedLearningObjects: ['lo-privacy-policy', 'lo-data-breach-scenario'],
  theme: {
    primaryColor: '#1863d6',
    secondaryColor: '#dc3545',
    accentColor: '#ffc107'
  },
  pages: [
    {
      id: 1,
      title: 'Course Overview',
      slug: 'overview',
      content: [
        createContentBlock('heading', 'Data Protection & Compliance Training'),
        createContentBlock('text', 'Learn about data protection regulations, privacy laws, and your responsibilities as an employee. This course covers GDPR, data security best practices, and compliance requirements.'),
        createContentBlock('text', 'Course Duration: 45 minutes | Difficulty: Beginner to Intermediate')
      ]
    },
    {
      id: 2,
      title: 'Module 1: Understanding GDPR',
      slug: 'module-1-gdpr',
      content: [
        createContentBlock('heading', 'General Data Protection Regulation (GDPR)'),
        createContentBlock('text', 'The GDPR is a European Union regulation that protects individuals\' rights regarding personal data. It applies to organizations that collect and process data of EU residents.'),
        createContentBlock('heading', 'Key GDPR Principles'),
        createContentBlock('text', '• Lawfulness, fairness, and transparency\n• Purpose limitation\n• Data minimization\n• Accuracy\n• Storage limitation\n• Integrity and confidentiality\n• Accountability')
      ]
    },
    {
      id: 3,
      title: 'Module 2: Data Security Practices',
      slug: 'module-2-security',
      content: [
        createContentBlock('heading', 'Protecting Sensitive Data'),
        createContentBlock('text', 'Data security is everyone\'s responsibility. Learn best practices for handling, storing, and transmitting sensitive information.'),
        createContentBlock('heading', 'Essential Security Measures'),
        createContentBlock('text', '• Use strong passwords (12+ characters, mix of types)\n• Enable multi-factor authentication\n• Encrypt sensitive communications\n• Lock your workstation when away\n• Report suspicious activity immediately')
      ]
    },
    {
      id: 4,
      title: 'Module 3: Your Responsibilities',
      slug: 'module-3-responsibilities',
      content: [
        createContentBlock('heading', 'Employee Compliance Obligations'),
        createContentBlock('text', 'As an employee, you have specific responsibilities in maintaining compliance with data protection regulations.'),
        createContentBlock('heading', 'What You Must Do'),
        createContentBlock('text', '• Complete mandatory compliance training annually\n• Obtain consent before collecting personal data\n• Report data breaches within 24 hours\n• Respect data access limitations\n• Participate in compliance audits')
      ]
    },
    {
      id: 5,
      title: 'Knowledge Check',
      slug: 'knowledge-check',
      content: [
        createContentBlock('heading', 'Test Your Knowledge'),
        createContentBlock('text', 'Answer the following questions to verify your understanding of compliance principles.'),
        createContentBlock('knowledge-check', '', '', {
          question: 'What does GDPR stand for?',
          options: [
            'General Data Protection Regulation',
            'Global Data Privacy Rule',
            'Government Data Protection Registry',
            'General Digital Privacy Resolution'
          ],
          correctAnswer: 0
        })
      ]
    }
  ]
};

// ============================================================================
// EMPLOYEE ONBOARDING TEMPLATES
// ============================================================================

export const ONBOARDING_TEMPLATE = {
  id: 'template-onboarding',
  name: 'Employee Onboarding Program',
  description: 'New hire orientation with company culture, policies, and role-specific training',
  category: INDUSTRY_DOMAINS.ONBOARDING,
  industry: 'Human Resources',
  difficulty: 'Beginner',
  estimatedTime: 120,
  tags: ['onboarding', 'new-hire', 'orientation', 'hr'],
  suggestedQuestions: ['qb-company-001', 'qb-policies-001', 'qb-benefits-001'],
  suggestedLearningObjects: ['lo-company-handbook', 'lo-benefits-guide', 'lo-org-structure'],
  theme: {
    primaryColor: '#28a745',
    secondaryColor: '#1863d6',
    accentColor: '#17a2b8'
  },
  pages: [
    {
      id: 1,
      title: 'Welcome to the Team',
      slug: 'welcome',
      content: [
        createContentBlock('heading', 'Welcome to Our Company!'),
        createContentBlock('text', 'We\'re thrilled to have you join our team. This onboarding program will help you get up to speed quickly and feel confident in your new role.'),
        createContentBlock('text', 'Total Duration: 2-3 hours | This course covers essential information needed on your first day.')
      ]
    },
    {
      id: 2,
      title: 'Company Overview',
      slug: 'company-overview',
      content: [
        createContentBlock('heading', 'Our Company History & Mission'),
        createContentBlock('text', 'Founded in 1995, our company has grown to serve over 10,000 clients worldwide. Our mission is to provide innovative solutions that transform how businesses operate.'),
        createContentBlock('heading', 'Organization Structure'),
        createContentBlock('text', 'Our organization is structured around five core departments: Sales, Engineering, Operations, Marketing, and Finance. Each department plays a crucial role in our success.')
      ]
    },
    {
      id: 3,
      title: 'Workplace Policies',
      slug: 'workplace-policies',
      content: [
        createContentBlock('heading', 'Employee Handbook Highlights'),
        createContentBlock('text', 'Please review our employee handbook for complete policies. Key areas include:'),
        createContentBlock('text', '• Code of Conduct\n• Anti-Discrimination Policy\n• Health & Safety Guidelines\n• Remote Work Policy\n• Equipment and Security')
      ]
    },
    {
      id: 4,
      title: 'Benefits & Compensation',
      slug: 'benefits-compensation',
      content: [
        createContentBlock('heading', 'Your Benefits Package'),
        createContentBlock('text', 'We offer a comprehensive benefits package designed to support your wellbeing:'),
        createContentBlock('text', '• Health Insurance (medical, dental, vision)\n• 401(k) retirement plan with matching\n• Paid Time Off (20 days + holidays)\n• Professional Development Budget\n• Wellness Programs')
      ]
    },
    {
      id: 5,
      title: 'Role-Specific Training',
      slug: 'role-training',
      content: [
        createContentBlock('heading', 'Your New Role'),
        createContentBlock('text', 'Your role and responsibilities will be outlined by your manager during your first week. This section covers key tools and processes you\'ll use.'),
        createContentBlock('heading', 'Essential Tools'),
        createContentBlock('text', '• Email and Communication Systems\n• Project Management Tools\n• Customer Relationship Management (CRM)\n• Time Tracking System\n• Knowledge Base and Documentation')
      ]
    },
    {
      id: 6,
      title: 'IT & Security Setup',
      slug: 'it-security',
      content: [
        createContentBlock('heading', 'Getting Set Up Technically'),
        createContentBlock('text', 'Your IT team will handle most setup, but here are key security practices to follow:'),
        createContentBlock('text', '• Keep your password secure and unique\n• Enable multi-factor authentication\n• Report IT issues to the help desk\n• Protect company information\n• Follow data security guidelines')
      ]
    },
    {
      id: 7,
      title: 'Onboarding Checklist',
      slug: 'checklist',
      content: [
        createContentBlock('heading', 'Your First Week Checklist'),
        createContentBlock('text', 'Here\'s what to expect during your first week:'),
        createContentBlock('text', '✓ Day 1: IT setup, office tour, meet your team\n✓ Day 1-2: HR orientation and paperwork\n✓ Day 2-3: Role-specific training\n✓ Day 3-5: Team projects and assignments\n✓ End of Week: Check-in with your manager'),
        createContentBlock('text', 'Congratulations on your new position! We\'re excited to work with you.')
      ]
    }
  ]
};

// ============================================================================
// PRODUCT TRAINING TEMPLATES
// ============================================================================

export const PRODUCT_TRAINING_TEMPLATE = {
  id: 'template-product-training',
  name: 'Product Training Course',
  description: 'Feature walkthroughs, use cases, troubleshooting, and product expertise',
  category: INDUSTRY_DOMAINS.PRODUCT,
  industry: 'Sales & Support',
  difficulty: 'Intermediate',
  estimatedTime: 90,
  tags: ['product', 'training', 'features', 'sales'],
  suggestedQuestions: ['qb-features-001', 'qb-scenarios-001'],
  suggestedLearningObjects: ['lo-product-demo', 'lo-use-cases'],
  theme: {
    primaryColor: '#6f42c1',
    secondaryColor: '#007bff',
    accentColor: '#fd7e14'
  },
  pages: [
    {
      id: 1,
      title: 'Product Introduction',
      slug: 'introduction',
      content: [
        createContentBlock('heading', 'Our Product Overview'),
        createContentBlock('text', 'This course is designed to help you understand our product\'s key features, benefits, and how to use it effectively. Whether you\'re in sales, support, or implementation, this training will equip you with the knowledge to succeed.'),
        createContentBlock('heading', 'Course Objectives'),
        createContentBlock('text', 'By the end of this course, you will be able to:\n• Explain the product\'s core features and benefits\n• Navigate the user interface confidently\n• Support customers with common use cases\n• Troubleshoot basic issues')
      ]
    },
    {
      id: 2,
      title: 'Core Features & Benefits',
      slug: 'core-features',
      content: [
        createContentBlock('heading', 'Key Features'),
        createContentBlock('text', 'Our product is built on three core features:'),
        createContentBlock('heading', 'Feature 1: Analytics Dashboard'),
        createContentBlock('text', 'Real-time insights into customer behavior, product usage, and key metrics. The dashboard is fully customizable and provides at-a-glance views of your most important data.'),
        createContentBlock('heading', 'Feature 2: Integration Engine'),
        createContentBlock('text', 'Seamless integration with 50+ popular business applications. Connect your tools, sync data automatically, and eliminate manual workflows.'),
        createContentBlock('heading', 'Feature 3: Automation Workflows'),
        createContentBlock('text', 'Create powerful automation rules without coding. Trigger actions based on conditions and save hours of manual work every week.')
      ]
    },
    {
      id: 3,
      title: 'Getting Started Guide',
      slug: 'getting-started',
      content: [
        createContentBlock('heading', 'Your First Steps'),
        createContentBlock('text', 'Follow this step-by-step guide to set up and configure the product:'),
        createContentBlock('heading', 'Step 1: Account Setup'),
        createContentBlock('text', 'Create your account, set up your workspace, and invite team members.'),
        createContentBlock('heading', 'Step 2: Configuration'),
        createContentBlock('text', 'Configure your settings, connect data sources, and define your preferences.'),
        createContentBlock('heading', 'Step 3: Creating Your First Workflow'),
        createContentBlock('text', 'Follow our wizard to create your first automation workflow. Most users complete this in under 10 minutes.')
      ]
    },
    {
      id: 4,
      title: 'Common Use Cases',
      slug: 'use-cases',
      content: [
        createContentBlock('heading', 'Real-World Applications'),
        createContentBlock('text', 'Here are common ways our customers use our product:'),
        createContentBlock('heading', 'Use Case 1: Sales Pipeline Management'),
        createContentBlock('text', 'Track deals, automate follow-ups, and forecast revenue using the platform\'s sales features.'),
        createContentBlock('heading', 'Use Case 2: Customer Support Automation'),
        createContentBlock('text', 'Automate ticket routing, trigger response workflows, and reduce support costs by up to 40%.'),
        createContentBlock('heading', 'Use Case 3: Marketing Automation'),
        createContentBlock('text', 'Create personalized customer journeys, segment audiences, and measure campaign performance.')
      ]
    },
    {
      id: 5,
      title: 'Troubleshooting Guide',
      slug: 'troubleshooting',
      content: [
        createContentBlock('heading', 'Common Issues & Solutions'),
        createContentBlock('text', 'Here are solutions to frequently encountered problems:'),
        createContentBlock('heading', 'Problem: Data Not Syncing'),
        createContentBlock('text', 'Solution: Check your API key, verify the connection is active, and review rate limits in your integration settings.'),
        createContentBlock('heading', 'Problem: Workflow Not Triggering'),
        createContentBlock('text', 'Solution: Verify trigger conditions are set correctly, check if the workflow is enabled, and review the activity log.'),
        createContentBlock('heading', 'Problem: Permission Errors'),
        createContentBlock('text', 'Solution: Ensure your user role has appropriate permissions. Contact your workspace admin to adjust access levels.')
      ]
    }
  ]
};

// ============================================================================
// SOFT SKILLS TRAINING TEMPLATES
// ============================================================================

export const SOFT_SKILLS_TEMPLATE = {
  id: 'template-soft-skills',
  name: 'Soft Skills Development',
  description: 'Communication, leadership, time management, and interpersonal skills training',
  category: INDUSTRY_DOMAINS.SOFT_SKILLS,
  industry: 'Professional Development',
  difficulty: 'Beginner to Intermediate',
  estimatedTime: 60,
  tags: ['soft-skills', 'professional-development', 'leadership', 'communication'],
  suggestedQuestions: ['qb-communication-001', 'qb-leadership-001'],
  suggestedLearningObjects: ['lo-communication-tips', 'lo-leadership-scenarios'],
  theme: {
    primaryColor: '#20c997',
    secondaryColor: '#6f42c1',
    accentColor: '#fd7e14'
  },
  pages: [
    {
      id: 1,
      title: 'Course Introduction',
      slug: 'introduction',
      content: [
        createContentBlock('heading', 'Developing Professional Soft Skills'),
        createContentBlock('text', 'Soft skills are increasingly important for professional success. This course covers essential interpersonal and professional skills that will help you advance in your career.'),
        createContentBlock('heading', 'What You\'ll Learn'),
        createContentBlock('text', '• Effective communication strategies\n• Active listening techniques\n• Conflict resolution approaches\n• Time management best practices\n• Leadership and influence')
      ]
    },
    {
      id: 2,
      title: 'Effective Communication',
      slug: 'communication',
      content: [
        createContentBlock('heading', 'Mastering Professional Communication'),
        createContentBlock('text', 'Clear communication is the foundation of successful collaboration. Learn how to communicate effectively in various professional contexts.'),
        createContentBlock('heading', 'Key Communication Principles'),
        createContentBlock('text', '• Be clear and concise\n• Adapt your style to your audience\n• Listen actively before responding\n• Ask clarifying questions\n• Follow up important conversations in writing'),
        createContentBlock('heading', 'Different Communication Contexts'),
        createContentBlock('text', '• Email communication\n• Presentations and public speaking\n• One-on-one meetings\n• Team meetings\n• Difficult conversations')
      ]
    },
    {
      id: 3,
      title: 'Active Listening',
      slug: 'active-listening',
      content: [
        createContentBlock('heading', 'The Art of Active Listening'),
        createContentBlock('text', 'Listening is more than hearing. Active listening is a skill that improves relationships and understanding.'),
        createContentBlock('heading', 'Active Listening Techniques'),
        createContentBlock('text', '• Minimize distractions\n• Give full attention\n• Use body language to show engagement\n• Reflect back what you hear\n• Ask follow-up questions\n• Avoid interrupting'),
        createContentBlock('heading', 'Benefits of Active Listening'),
        createContentBlock('text', 'Improved relationships, better understanding, reduced conflicts, and increased trust among team members.')
      ]
    },
    {
      id: 4,
      title: 'Conflict Resolution',
      slug: 'conflict-resolution',
      content: [
        createContentBlock('heading', 'Handling Workplace Conflicts'),
        createContentBlock('text', 'Conflicts are normal in any workplace. The key is how you handle them.'),
        createContentBlock('heading', 'Conflict Resolution Steps'),
        createContentBlock('text', '1. Stay calm and composed\n2. Listen to understand both perspectives\n3. Identify the core issue\n4. Brainstorm solutions together\n5. Agree on next steps\n6. Follow up'),
        createContentBlock('heading', 'Conflict Resolution Styles'),
        createContentBlock('text', '• Collaborating: Win-win solutions\n• Compromising: Middle ground\n• Avoiding: Delay or ignore\n• Accommodating: Give in\n• Competing: Your way wins')
      ]
    },
    {
      id: 5,
      title: 'Time Management & Priorities',
      slug: 'time-management',
      content: [
        createContentBlock('heading', 'Managing Your Time Effectively'),
        createContentBlock('text', 'Time is your most valuable resource. Learn strategies to work smarter, not just harder.'),
        createContentBlock('heading', 'Time Management Techniques'),
        createContentBlock('text', '• The Pomodoro Technique\n• Priority Matrix (Eisenhower Box)\n• Time blocking\n• Daily planning rituals\n• Delegation strategies'),
        createContentBlock('heading', 'Productivity Tips'),
        createContentBlock('text', '• Eliminate distractions\n• Batch similar tasks\n• Take regular breaks\n• Review progress daily\n• Adjust as needed')
      ]
    },
    {
      id: 6,
      title: 'Leadership & Influence',
      slug: 'leadership',
      content: [
        createContentBlock('heading', 'Developing Leadership Skills'),
        createContentBlock('text', 'Leadership isn\'t just for managers. Everyone can develop influence and lead effectively.'),
        createContentBlock('heading', 'Leadership Essentials'),
        createContentBlock('text', '• Set clear vision and goals\n• Lead by example\n• Develop others\n• Make decisions decisively\n• Take responsibility'),
        createContentBlock('heading', 'Building Influence'),
        createContentBlock('text', '• Build trust through integrity\n• Develop expertise\n• Listen and understand others\n• Recognize and celebrate others\n• Communicate your vision clearly')
      ]
    }
  ]
};

// ============================================================================
// TECHNICAL TRAINING TEMPLATES
// ============================================================================

export const TECHNICAL_TRAINING_TEMPLATE = {
  id: 'template-technical-training',
  name: 'Technical Training Program',
  description: 'Software, system administration, development tools, and IT infrastructure training',
  category: INDUSTRY_DOMAINS.TECHNICAL,
  industry: 'Technology & IT',
  difficulty: 'Intermediate to Advanced',
  estimatedTime: 120,
  tags: ['technical', 'software', 'it', 'development'],
  suggestedQuestions: ['qb-tech-001', 'qb-hands-on-001'],
  suggestedLearningObjects: ['lo-setup-guide', 'lo-code-samples'],
  theme: {
    primaryColor: '#343a40',
    secondaryColor: '#007bff',
    accentColor: '#28a745'
  },
  pages: [
    {
      id: 1,
      title: 'Getting Started',
      slug: 'getting-started',
      content: [
        createContentBlock('heading', 'Technical Training Overview'),
        createContentBlock('text', 'This course covers installation, configuration, and best practices for technical systems and tools.'),
        createContentBlock('heading', 'Prerequisites'),
        createContentBlock('text', '• Basic familiarity with command line\n• Understanding of networking concepts\n• 2-4 GB RAM for virtual environment\n• Administrator access to your machine')
      ]
    },
    {
      id: 2,
      title: 'System Requirements',
      slug: 'requirements',
      content: [
        createContentBlock('heading', 'Hardware & Software Requirements'),
        createContentBlock('text', 'Ensure your system meets these minimum requirements:'),
        createContentBlock('heading', 'Hardware'),
        createContentBlock('text', '• Processor: Dual-core 2.0 GHz or better\n• RAM: 4 GB minimum (8 GB recommended)\n• Disk Space: 20 GB free\n• Network: Stable internet connection'),
        createContentBlock('heading', 'Operating Systems'),
        createContentBlock('text', '• Windows 10 or later\n• macOS 10.14 or later\n• Ubuntu 18.04 or later\n• Other Linux distributions (RHEL, CentOS)')
      ]
    },
    {
      id: 3,
      title: 'Installation & Setup',
      slug: 'installation',
      content: [
        createContentBlock('heading', 'Step-by-Step Installation'),
        createContentBlock('text', 'Follow these steps to install and configure the system:'),
        createContentBlock('heading', 'Step 1: Download the Installer'),
        createContentBlock('text', 'Visit the official website and download the installer for your operating system.'),
        createContentBlock('heading', 'Step 2: Run the Installer'),
        createContentBlock('text', 'Execute the installer and follow the configuration wizard.'),
        createContentBlock('heading', 'Step 3: Verify Installation'),
        createContentBlock('text', 'Run verification commands to confirm successful installation.')
      ]
    },
    {
      id: 4,
      title: 'Configuration & Best Practices',
      slug: 'configuration',
      content: [
        createContentBlock('heading', 'System Configuration'),
        createContentBlock('text', 'Configure the system for optimal performance and security:'),
        createContentBlock('heading', 'Security Configuration'),
        createContentBlock('text', '• Set strong administrative passwords\n• Enable firewall\n• Configure user accounts and permissions\n• Set up SSL certificates\n• Enable logging'),
        createContentBlock('heading', 'Performance Tuning'),
        createContentBlock('text', '• Configure memory allocation\n• Optimize database settings\n• Set up caching\n• Monitor resource usage')
      ]
    },
    {
      id: 5,
      title: 'Troubleshooting & Support',
      slug: 'troubleshooting',
      content: [
        createContentBlock('heading', 'Common Issues & Solutions'),
        createContentBlock('text', 'Resolve common problems encountered during setup and operation:'),
        createContentBlock('heading', 'Installation Issues'),
        createContentBlock('text', '• Permission Denied: Run as administrator\n• Missing Dependencies: Install required packages\n• Port Conflicts: Change default port configuration'),
        createContentBlock('heading', 'Runtime Issues'),
        createContentBlock('text', '• High Memory Usage: Check active processes\n• Slow Performance: Review logs and configuration\n• Connection Issues: Verify network and firewall settings')
      ]
    }
  ]
};

// ============================================================================
// EXPORT ALL TEMPLATES
// ============================================================================

export const INDUSTRY_TEMPLATES = {
  [INDUSTRY_DOMAINS.COMPLIANCE]: COMPLIANCE_TRAINING_TEMPLATE,
  [INDUSTRY_DOMAINS.ONBOARDING]: ONBOARDING_TEMPLATE,
  [INDUSTRY_DOMAINS.PRODUCT]: PRODUCT_TRAINING_TEMPLATE,
  [INDUSTRY_DOMAINS.SOFT_SKILLS]: SOFT_SKILLS_TEMPLATE,
  [INDUSTRY_DOMAINS.TECHNICAL]: TECHNICAL_TRAINING_TEMPLATE
};

/**
 * Get all industry templates
 */
export const getIndustryTemplates = () => {
  return Object.entries(INDUSTRY_TEMPLATES).map(([key, template]) => ({
    ...template,
    templateId: key
  }));
};

/**
 * Get templates by industry
 */
export const getTemplatesByIndustry = (industry) => {
  const template = INDUSTRY_TEMPLATES[industry];
  return template ? { ...template, templateId: industry } : null;
};

/**
 * Search templates by keyword
 */
export const searchIndustryTemplates = (query) => {
  const lowerQuery = query.toLowerCase();
  return getIndustryTemplates().filter(template =>
    template.name.toLowerCase().includes(lowerQuery) ||
    template.description.toLowerCase().includes(lowerQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

/**
 * Get template suggestions based on keywords
 */
export const getTemplateSuggestions = (keywords = []) => {
  if (keywords.length === 0) return getIndustryTemplates();

  const matchedTemplates = getIndustryTemplates().map(template => {
    let score = 0;
    const lowerKeywords = keywords.map(k => k.toLowerCase());

    // Score based on keyword matches
    lowerKeywords.forEach(keyword => {
      if (template.name.toLowerCase().includes(keyword)) score += 3;
      if (template.description.toLowerCase().includes(keyword)) score += 2;
      if (template.tags.some(tag => tag.toLowerCase().includes(keyword))) score += 1;
      if (template.industry.toLowerCase().includes(keyword)) score += 1;
    });

    return { ...template, score };
  });

  return matchedTemplates
    .filter(t => t.score > 0)
    .sort((a, b) => b.score - a.score);
};
