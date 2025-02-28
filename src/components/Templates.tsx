import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Badge } from "@/components/ui/badge"; // Absolute import
// import { Badge } from "../components/ui/badge"; // Relative import as fallback

interface Template {
  id: string;
  title: string;
  description: string;
  category: 'Professional' | 'Casual & Engaging' | 'Educational Content';
  tag: 'Business' | 'General' | 'Education';
  postType: 'short' | 'long' | 'thread';
  audience: string;
  style: string;
  guidelines: string;
}

interface TemplateCategory {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'coming-soon';
  isDisabled?: boolean;
  subcategories: {
    id: string;
    title: string;
    description: string;
    templates: Template[];
  }[];
}

interface TemplatesProps {
  category?: string;
  onSelect?: (template: Template | null, prepopulatedFields?: {
    targetAudience: string;
    writingStyle: string;
    additionalGuidelines: string;
  }) => void;
  selected?: Template | null;
  onTemplateSelect?: (template: Template) => void;
  onNavigateToGenerator?: () => void;
}

const Templates: React.FC<TemplatesProps> = ({ category, onSelect, selected, onTemplateSelect, onNavigateToGenerator }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const templateCategories: TemplateCategory[] = [
    {
      id: 'business-digital-branding',
      title: 'Business Digital Branding',
      description: 'Strategies to enhance your business\'s online presence, brand identity, and digital marketing',
      status: 'active',
      subcategories: [
        {
          id: 'brand-storytelling',
          title: 'Brand Storytelling & Positioning',
          description: 'Crafting compelling narratives that define your brand\'s unique value and mission',
          templates: [
            {
              id: 'brand-origin-story',
              title: 'Company Origin & Mission Narrative',
              description: 'Powerful storytelling about your business\'s founding and core values',
              category: 'Professional',
              tag: 'Business',
              postType: 'long',
              audience: 'Potential clients, investors, industry professionals',
              style: 'Authentic, inspirational, and purpose-driven',
              guidelines: 'Share the authentic journey, highlight challenges overcome, emphasize mission and vision, create emotional connection'
            },
            {
              id: 'brand-values-showcase',
              title: 'Showcasing Corporate Values',
              description: 'Demonstrating your company\'s commitment to social responsibility and core principles',
              category: 'Professional',
              tag: 'Business',
              postType: 'short',
              audience: 'Conscious consumers, potential employees, industry peers',
              style: 'Sincere, impactful, and transparent',
              guidelines: 'Highlight specific actions that demonstrate values, use concrete examples, show genuine commitment'
            }
          ]
        },
        {
          id: 'visual-identity',
          title: 'Visual Brand Identity',
          description: 'Creating a cohesive and memorable visual representation of your brand across digital platforms',
          templates: [
            {
              id: 'logo-design-guide',
              title: 'Logo Usage & Brand Style Guide',
              description: 'Comprehensive guidelines for consistent visual branding',
              category: 'Professional',
              tag: 'Business',
              postType: 'long',
              audience: 'Design team, marketing professionals, external vendors',
              style: 'Clear, precise, and authoritative',
              guidelines: 'Outline logo variations, color palette, typography, and usage rules'
            }
          ]
        },
        {
          id: 'digital-marketing-strategy',
          title: 'Digital Marketing & Positioning',
          description: 'Strategic approaches to digital marketing and brand differentiation',
          templates: [
            {
              id: 'unique-value-proposition',
              title: 'Unique Value Proposition Development',
              description: 'Crafting a clear and compelling statement of your brand\'s unique benefits',
              category: 'Professional',
              tag: 'Business',
              postType: 'short',
              audience: 'Potential clients, stakeholders',
              style: 'Concise, impactful, and value-driven',
              guidelines: 'Highlight key differentiators and solve specific customer pain points'
            }
          ]
        },
        {
          id: 'social-media-branding',
          title: 'Social Media Brand Presence',
          description: 'Strategies for building and maintaining a strong brand identity across social platforms',
          templates: [
            {
              id: 'social-media-voice-guide',
              title: 'Social Media Brand Voice Guidelines',
              description: 'Defining the tone, style, and communication approach for social media',
              category: 'Professional',
              tag: 'Business',
              postType: 'long',
              audience: 'Social media managers, content creators',
              style: 'Engaging, consistent, and brand-aligned',
              guidelines: 'Provide examples of appropriate language, tone, and communication style'
            }
          ]
        },
        {
          id: 'digital-marketing-strategies',
          title: 'Digital Marketing & Thought Leadership',
          description: 'Establishing authority and engaging potential clients through strategic content',
          templates: [
            {
              id: 'industry-insights-long',
              title: 'Industry Trends & Insights Analysis',
              description: 'Comprehensive breakdown of current industry developments and future predictions',
              category: 'Professional',
              tag: 'Business',
              postType: 'long',
              audience: 'Industry professionals, potential clients, decision-makers',
              style: 'Analytical, authoritative, and forward-thinking',
              guidelines: 'Provide data-driven insights, offer unique perspectives, demonstrate deep industry knowledge'
            },
            {
              id: 'case-study-success',
              title: 'Client Success Story Showcase',
              description: 'Highlighting transformative results and client achievements',
              category: 'Professional',
              tag: 'Business',
              postType: 'long',
              audience: 'Potential clients, industry peers, investors',
              style: 'Detailed, results-oriented, and credibility-building',
              guidelines: 'Use specific metrics, tell a compelling narrative, demonstrate tangible business impact'
            }
          ]
        },
        {
          id: 'leadership-personal-branding',
          title: 'Leadership & Personal Branding',
          description: 'Developing a strong personal and professional online presence for business leaders',
          templates: [
            {
              id: 'leadership-journey-thread',
              title: 'Leadership Journey & Insights',
              description: 'Personal narrative of professional growth and leadership lessons',
              category: 'Professional',
              tag: 'Business',
              postType: 'thread',
              audience: 'Aspiring leaders, industry professionals, potential clients',
              style: 'Reflective, honest, and inspirational',
              guidelines: 'Share personal challenges and learnings, provide actionable leadership insights, demonstrate vulnerability and strength'
            },
            {
              id: 'innovation-thought-leadership',
              title: 'Innovation and Thought Leadership Post',
              description: 'Sharing cutting-edge insights and forward-thinking perspectives',
              category: 'Professional',
              tag: 'Business',
              postType: 'long',
              audience: 'Industry innovators, potential clients, professional network',
              style: 'Intellectual, visionary, and provocative',
              guidelines: 'Introduce novel ideas, challenge existing paradigms, provide unique strategic perspectives'
            }
          ]
        }
      ]
    },
    {
      id: 'personal-digital-branding',
      title: 'Personal Digital Branding',
      description: 'Strategies to build, enhance, and showcase your personal brand and professional identity online',
      status: 'active',
      subcategories: [
        {
          id: 'personal-storytelling',
          title: 'Personal Brand Storytelling',
          description: 'Crafting a compelling narrative that showcases your unique professional journey and values',
          templates: [
            {
              id: 'professional-journey-narrative',
              title: 'Professional Journey & Personal Mission',
              description: 'Creating a powerful narrative that highlights your career path and core beliefs',
              category: 'Professional',
              tag: 'General',
              postType: 'long',
              audience: 'Professional network, potential employers, clients',
              style: 'Authentic, inspirational, and reflective',
              guidelines: 'Share key milestones, challenges overcome, and personal growth'
            }
          ]
        },
        {
          id: 'professional-online-presence',
          title: 'Professional Online Presence',
          description: 'Developing a cohesive and impactful digital identity across professional platforms',
          templates: [
            {
              id: 'linkedin-profile-optimization',
              title: 'LinkedIn Profile Optimization Guide',
              description: 'Strategies for creating a standout professional profile',
              category: 'Professional',
              tag: 'General',
              postType: 'long',
              audience: 'Job seekers, professionals looking to network',
              style: 'Clear, strategic, and professional',
              guidelines: 'Provide tips for headline, summary, experience sections, and networking'
            }
          ]
        },
        {
          id: 'thought-leadership',
          title: 'Thought Leadership & Content Strategy',
          description: 'Establishing yourself as an expert in your field through strategic content creation',
          templates: [
            {
              id: 'personal-content-strategy',
              title: 'Personal Thought Leadership Content Plan',
              description: 'Developing a content strategy to showcase expertise and insights',
              category: 'Professional',
              tag: 'General',
              postType: 'long',
              audience: 'Professional community, potential employers, clients',
              style: 'Insightful, authoritative, and forward-thinking',
              guidelines: 'Outline content themes, platforms, and unique perspective'
            }
          ]
        },
        {
          id: 'personal-brand-visual-identity',
          title: 'Personal Brand Visual Identity',
          description: 'Creating a consistent and professional visual representation across digital platforms',
          templates: [
            {
              id: 'personal-brand-visual-guide',
              title: 'Personal Branding Visual Consistency Guide',
              description: 'Developing a cohesive visual style for personal professional branding',
              category: 'Professional',
              tag: 'General',
              postType: 'long',
              audience: 'Individual professionals, freelancers, entrepreneurs',
              style: 'Clean, professional, and distinctive',
              guidelines: 'Define color palette, typography, imagery style, and personal logo usage'
            }
          ]
        },
        {
          id: 'professional-narrative',
          title: 'Professional Journey & Storytelling',
          description: 'Crafting a compelling personal narrative that highlights your unique professional path',
          templates: [
            {
              id: 'career-evolution-thread',
              title: 'Career Evolution & Milestone Narrative',
              description: 'Detailed storytelling of professional growth, challenges, and key achievements',
              category: 'Professional',
              tag: 'Business',
              postType: 'thread',
              audience: 'Professionals, career seekers, industry peers',
              style: 'Reflective, authentic, and inspirational',
              guidelines: 'Share pivotal career moments, lessons learned, personal growth insights, maintain a genuine and motivational tone'
            },
            {
              id: 'professional-origin-story',
              title: 'Professional Origin & Passion Story',
              description: 'Personal narrative exploring the roots of your professional passion',
              category: 'Casual & Engaging',
              tag: 'General',
              postType: 'long',
              audience: 'Aspiring professionals, mentees, networking contacts',
              style: 'Personal, vulnerable, and motivational',
              guidelines: 'Explain what drove you to your current field, share early influences, demonstrate passion and commitment'
            }
          ]
        },
        {
          id: 'skill-expertise-showcase',
          title: 'Skill & Expertise Positioning',
          description: 'Demonstrating professional capabilities and thought leadership',
          templates: [
            {
              id: 'expertise-deep-dive',
              title: 'Deep Dive into Professional Expertise',
              description: 'Comprehensive exploration of your specialized knowledge and unique insights',
              category: 'Professional',
              tag: 'Business',
              postType: 'long',
              audience: 'Industry professionals, potential employers/clients, peers',
              style: 'Analytical, authoritative, and educational',
              guidelines: 'Provide in-depth insights, share unique perspectives, demonstrate depth of knowledge, use concrete examples'
            },
            {
              id: 'skill-transformation-story',
              title: 'Professional Skill Transformation Journey',
              description: 'Narrative about learning, adapting, and mastering new professional skills',
              category: 'Casual & Engaging',
              tag: 'Education',
              postType: 'thread',
              audience: 'Learners, professionals seeking growth, career changers',
              style: 'Encouraging, practical, and step-by-step',
              guidelines: 'Detail skill acquisition process, share challenges and breakthroughs, provide actionable advice'
            }
          ]
        },
        {
          id: 'personal-brand-networking',
          title: 'Personal Branding & Networking',
          description: 'Building and leveraging a strong personal brand for professional opportunities',
          templates: [
            {
              id: 'networking-philosophy',
              title: 'Networking Philosophy & Approach',
              description: 'Sharing insights on building meaningful professional connections',
              category: 'Professional',
              tag: 'Business',
              postType: 'long',
              audience: 'Professionals, networkers, career developers',
              style: 'Strategic, insightful, and relationship-focused',
              guidelines: 'Explain networking strategies, share personal experiences, provide actionable networking tips'
            },
            {
              id: 'personal-brand-impact',
              title: 'Personal Brand Impact & Opportunities',
              description: 'Exploring how a strong personal brand creates professional opportunities',
              category: 'Professional',
              tag: 'Business',
              postType: 'short',
              audience: 'Career-focused individuals, entrepreneurs, professionals',
              style: 'Motivational, strategic, and evidence-based',
              guidelines: 'Highlight the power of personal branding, share success stories, inspire proactive personal brand development'
            }
          ]
        },
        {
          id: 'creative-personal-expression',
          title: 'Creative Personal Expression',
          description: 'Showcasing personality, creativity, and unique professional identity',
          templates: [
            {
              id: 'creative-professional-journey',
              title: 'Creative Professional Journey Narrative',
              description: 'Unique storytelling that blends professional achievements with personal creativity',
              category: 'Casual & Engaging',
              tag: 'General',
              postType: 'thread',
              audience: 'Creative professionals, artists, innovators',
              style: 'Imaginative, personal, and inspiring',
              guidelines: 'Blend professional narrative with creative expression, showcase unique approach to work, inspire creativity'
            },
            {
              id: 'personal-brand-creativity',
              title: 'Creativity as a Personal Brand Differentiator',
              description: 'Exploring how creativity sets you apart in your professional field',
              category: 'Casual & Engaging',
              tag: 'Education',
              postType: 'short',
              audience: 'Emerging professionals, creatives, innovators',
              style: 'Playful, insightful, and thought-provoking',
              guidelines: 'Highlight unique creative approaches, share innovative thinking, demonstrate value of creativity'
            }
          ]
        }
      ]
    },
    {
      id: 'tech-innovation',
      title: 'Tech & Innovation Insights',
      description: 'Cutting-edge content exploring technological advancements, innovation trends, and digital transformation',
      status: 'active',
      subcategories: [
        {
          id: 'ai-tech-trends',
          title: 'AI and Emerging Technologies',
          description: 'In-depth exploration of artificial intelligence, machine learning, and transformative tech trends',
          templates: [
            {
              id: 'ai-industry-impact',
              title: 'AI Transformation in Industry',
              description: 'Analyzing how AI is revolutionizing different sectors and business models',
              category: 'Educational Content',
              tag: 'Education',
              postType: 'long',
              audience: 'Tech professionals, business leaders, innovators',
              style: 'Analytical, forward-thinking, and insightful',
              guidelines: 'Provide concrete examples, discuss potential challenges and opportunities, highlight real-world AI applications'
            },
            {
              id: 'emerging-tech-deep-dive',
              title: 'Deep Dive: Emerging Technology Landscape',
              description: 'Comprehensive overview of cutting-edge technologies shaping the future',
              category: 'Educational Content',
              tag: 'Education',
              postType: 'thread',
              audience: 'Tech enthusiasts, students, professionals',
              style: 'Informative, engaging, and accessible',
              guidelines: 'Break down complex tech concepts, use analogies, provide visual explanations, discuss potential societal impact'
            }
          ]
        },
        {
          id: 'web-development-insights',
          title: 'Web Development & Frameworks',
          description: 'Expert insights into modern web development technologies, frameworks, and best practices',
          templates: [
            {
              id: 'react-vue-comparison',
              title: 'React vs Vue: Choosing the Right Framework',
              description: 'Comparative analysis of React and Vue for modern web development',
              category: 'Educational Content',
              tag: 'Education',
              postType: 'long',
              audience: 'Web developers, students, tech decision-makers',
              style: 'Technical, balanced, and practical',
              guidelines: 'Provide objective comparison, discuss pros and cons, offer context-based recommendations'
            },
            {
              id: 'frontend-performance-optimization',
              title: 'Frontend Performance Optimization Techniques',
              description: 'Advanced strategies for improving web application performance',
              category: 'Educational Content',
              tag: 'Education',
              postType: 'long',
              audience: 'Web developers, performance engineers',
              style: 'Technical, detailed, solution-oriented',
              guidelines: 'Provide code examples, discuss measurement techniques, offer actionable optimization strategies'
            }
          ]
        },
        {
          id: 'innovation-case-studies',
          title: 'Innovation Case Studies',
          description: 'Real-world examples of technological innovation and digital transformation',
          templates: [
            {
              id: 'startup-innovation-journey',
              title: 'Startup Innovation Journey',
              description: 'Detailed exploration of how startups drive technological innovation',
              category: 'Professional',
              tag: 'Business',
              postType: 'long',
              audience: 'Entrepreneurs, investors, tech enthusiasts',
              style: 'Narrative-driven, inspirational, analytical',
              guidelines: 'Tell a compelling story, highlight key challenges and breakthroughs, provide strategic insights'
            }
          ]
        }
      ]
    },
    {
      id: 'educational-content',
      title: 'Educational & Professional Development',
      description: 'Comprehensive learning resources for digital tech, professional skills, and career growth',
      status: 'active',
      subcategories: [
        {
          id: 'digital-skills-learning',
          title: 'Digital Skills & Career Development',
          description: 'Practical guidance for developing essential digital skills and advancing professional careers',
          templates: [
            {
              id: 'tech-career-roadmap',
              title: 'Tech Career Roadmap & Skill Development',
              description: 'Comprehensive guide to building a successful career in technology',
              category: 'Educational Content',
              tag: 'Education',
              postType: 'thread',
              audience: 'Students, early-career professionals, career changers',
              style: 'Motivational, structured, actionable',
              guidelines: 'Provide clear learning paths, recommend resources, discuss skill progression, offer industry insights'
            },
            {
              id: 'learning-tech-efficiently',
              title: 'Efficient Learning Strategies for Tech Professionals',
              description: 'Techniques and approaches for continuous learning in a rapidly evolving tech landscape',
              category: 'Educational Content',
              tag: 'Education',
              postType: 'long',
              audience: 'Tech professionals, lifelong learners',
              style: 'Practical, evidence-based, motivational',
              guidelines: 'Share learning techniques, discuss effective resources, provide psychological insights into skill acquisition'
            }
          ]
        },
        {
          id: 'industry-certifications',
          title: 'Professional Certifications & Credentials',
          description: 'Guidance on obtaining and leveraging professional certifications in tech',
          templates: [
            {
              id: 'certification-strategy',
              title: 'Strategic Certification Planning',
              description: 'How to choose and pursue relevant professional certifications',
              category: 'Educational Content',
              tag: 'Education',
              postType: 'long',
              audience: 'Professionals seeking career advancement',
              style: 'Strategic, informative, goal-oriented',
              guidelines: 'Compare certification programs, discuss ROI, provide selection criteria, share preparation tips'
            }
          ]
        }
      ]
    },
    {
      id: 'community-building',
      title: 'Personalized Community & Engagement',
      description: 'Strategies for building meaningful connections, fostering engagement, and creating value-driven communities',
      status: 'active',
      subcategories: [
        {
          id: 'audience-connection',
          title: 'Audience Connection & Personalization',
          description: 'Techniques for creating personalized, authentic, and engaging content',
          templates: [
            {
              id: 'personalized-storytelling',
              title: 'Personalized Community Storytelling',
              description: 'Crafting narratives that resonate with specific audience segments',
              category: 'Casual & Engaging',
              tag: 'General',
              postType: 'thread',
              audience: 'Community members, potential followers',
              style: 'Authentic, empathetic, conversational',
              guidelines: 'Use personal anecdotes, address specific pain points, demonstrate genuine understanding'
            },
            {
              id: 'community-value-creation',
              title: 'Community Value Creation Strategies',
              description: 'Building and nurturing engaged, supportive online communities',
              category: 'Casual & Engaging',
              tag: 'General',
              postType: 'long',
              audience: 'Community leaders, content creators, entrepreneurs',
              style: 'Insightful, strategic, actionable',
              guidelines: 'Discuss engagement techniques, share community management best practices, provide real-world examples'
            }
          ]
        },
        {
          id: 'interactive-content',
          title: 'Interactive Content & Engagement',
          description: 'Creating content that encourages participation, dialogue, and community interaction',
          templates: [
            {
              id: 'community-challenge',
              title: 'Community Challenge & Growth Initiatives',
              description: 'Designing interactive challenges that foster learning and connection',
              category: 'Casual & Engaging',
              tag: 'General',
              postType: 'short',
              audience: 'Community members, potential participants',
              style: 'Motivational, clear, exciting',
              guidelines: 'Define clear objectives, provide simple participation rules, highlight potential benefits'
            }
          ]
        }
      ]
    }
  ];

  const handleTemplateSelect = (template: Template) => {
    const prepopulatedFields = {
      targetAudience: template.audience,
      writingStyle: template.style,
      additionalGuidelines: template.guidelines
    };

    // Use the appropriate callback based on what was provided
    if (onTemplateSelect) {
      onTemplateSelect(template);
    } else if (onSelect) {
      onSelect(template, prepopulatedFields);
    }
    
    // Navigate to generator if callback provided
    if (onNavigateToGenerator) {
      onNavigateToGenerator();
    }
    
    setExpandedCategory(null); // Optional: collapse categories after selection
  };

  return (
    <div className="space-y-6">
      {templateCategories.map((category) => (
        <div key={category.id} className="bg-secondary/10 dark:bg-secondary/20 rounded-lg">
          <div 
            onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
            className="
              flex 
              justify-between 
              items-center 
              p-4 
              cursor-pointer 
              hover:bg-secondary/20 
              dark:hover:bg-secondary/30 
              transition-colors 
              rounded-t-lg
            "
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold">{category.title}</h3>
                  {category.status === 'coming-soon' && (
                    <Badge variant="secondary">Coming Soon</Badge>
                  )}
                </div>
                <p className="text-sm text-foreground/60 dark:text-foreground/70">
                  {category.description}
                </p>
              </div>
              {expandedCategory === category.id ? (
                <ChevronDown className="w-6 h-6 text-foreground/60" />
              ) : (
                <ChevronRight className="w-6 h-6 text-foreground/60" />
              )}
            </div>
          </div>

          {expandedCategory === category.id && !category.isDisabled && (
            <div className="p-4 space-y-4">
              {category.subcategories.map((subcategory) => (
                <div key={subcategory.id} className="bg-secondary/5 dark:bg-secondary/10 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-foreground/80 dark:text-foreground/90 mb-3">
                    {subcategory.title}
                  </h3>
                  <p className="text-sm text-foreground/60 dark:text-foreground/70 mb-4">
                    {subcategory.description}
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {subcategory.templates.map((template) => (
                      <div 
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className="
                          cursor-pointer 
                          p-4 
                          hover:bg-gray-100 
                          dark:hover:bg-gray-800 
                          rounded-lg 
                          transition-colors 
                          duration-200 
                          ease-in-out
                          ${selected?.id === template.id ? 'bg-blue-50 dark:bg-blue-900' : ''}
                        "
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                              {template.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {template.description}
                            </p>
                          </div>
                          {selected?.id === template.id && (
                            <Badge variant="secondary">Selected</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Templates;
