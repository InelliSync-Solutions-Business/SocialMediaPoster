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
  onSelectTemplate: (template: Template) => void;
}

const Templates: React.FC<TemplatesProps> = ({ onSelectTemplate }) => {
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
      id: 'educational-content',
      title: 'Educational Content',
      description: 'Comprehensive learning resources and educational materials',
      status: 'coming-soon',
      isDisabled: true,
      subcategories: [
        {
          id: 'academic-insights',
          title: 'Academic & Professional Learning',
          description: 'In-depth educational content for professionals and learners',
          templates: [
            {
              id: 'educational-long-form',
              title: 'Educational Deep Dive',
              description: 'Comprehensive post explaining a complex topic',
              category: 'Educational Content',
              tag: 'Education',
              postType: 'long',
              audience: 'Students, professionals seeking in-depth knowledge',
              style: 'Academic, informative, and engaging',
              guidelines: 'Break down complex concepts, use clear explanations, include relevant examples and research'
            }
          ]
        },
        {
          id: 'skill-development',
          title: 'Skill Development & Tutorials',
          description: 'Practical guides and learning resources',
          templates: [
            {
              id: 'step-by-step-tutorial',
              title: 'Step-by-Step Learning Guide',
              description: 'Detailed tutorial on mastering a specific skill',
              category: 'Educational Content',
              tag: 'Education',
              postType: 'thread',
              audience: 'Learners, professionals looking to upskill',
              style: 'Clear, instructional, and encouraging',
              guidelines: 'Break down complex processes, provide actionable steps, include practical tips'
            }
          ]
        }
      ]
    },
    {
      id: 'technology-innovation',
      title: 'Technology & Innovation',
      description: 'Cutting-edge insights and thought leadership in technology',
      status: 'coming-soon',
      isDisabled: true,
      subcategories: [
        {
          id: 'ai-insights',
          title: 'AI and Emerging Technologies',
          description: 'Cutting-edge insights into artificial intelligence and tech trends',
          templates: [
            {
              id: 'ai-innovation-long',
              title: 'AI and Future Technologies',
              description: 'In-depth exploration of technological innovations',
              category: 'Educational Content',
              tag: 'Business',
              postType: 'long',
              audience: 'Tech enthusiasts, professionals, researchers',
              style: 'Intellectual, forward-thinking, and accessible',
              guidelines: 'Explain complex AI concepts, provide real-world applications, discuss ethical considerations'
            },
            {
              id: 'tech-startup-short',
              title: 'Tech Startup Announcement',
              description: 'Concise, exciting post for a tech product launch',
              category: 'Professional',
              tag: 'Business',
              postType: 'short',
              audience: 'Tech professionals, early adopters, startup enthusiasts',
              style: 'Professional, innovative, and slightly provocative',
              guidelines: 'Highlight unique value proposition, use technical but accessible language, include a call-to-action'
            }
          ]
        },
        {
          id: 'tech-trends',
          title: 'Technology Trends',
          description: 'Exploring current and emerging technological trends',
          templates: [
            {
              id: 'industry-tech-trends',
              title: 'Tech Industry Trends Analysis',
              description: 'Comprehensive overview of current technological shifts',
              category: 'Professional',
              tag: 'Business',
              postType: 'long',
              audience: 'Tech industry professionals, investors, strategists',
              style: 'Analytical, forward-looking, and insightful',
              guidelines: 'Provide data-driven insights, highlight key industry transformations, predict future directions'
            }
          ]
        }
      ]
    },
    {
      id: 'creative-writing',
      title: 'Creative Writing & Storytelling',
      description: 'Inspiring narratives and creative expression',
      status: 'coming-soon',
      isDisabled: true,
      subcategories: [
        {
          id: 'personal-journeys',
          title: 'Personal Narratives',
          description: 'Authentic stories of personal growth and experience',
          templates: [
            {
              id: 'startup-journey-thread',
              title: 'Startup Journey Narrative',
              description: 'Multi-part story about entrepreneurial experience',
              category: 'Casual & Engaging',
              tag: 'Business',
              postType: 'thread',
              audience: 'Entrepreneurs, startup founders, business students',
              style: 'Personal, authentic, motivational',
              guidelines: 'Share personal insights, be vulnerable, provide actionable advice, maintain narrative flow across thread'
            },
            {
              id: 'mental-health-awareness-thread',
              title: 'Mental Health Journey',
              description: 'Comprehensive discussion on mental wellness',
              category: 'Casual & Engaging',
              tag: 'General',
              postType: 'thread',
              audience: 'Young professionals, mental health advocates',
              style: 'Empathetic, personal, supportive',
              guidelines: 'Share personal experiences, provide resources, reduce stigma, offer hope and support'
            }
          ]
        },
        {
          id: 'creative-process',
          title: 'Creative Process & Inspiration',
          description: 'Insights into creativity, artistic expression, and inspiration',
          templates: [
            {
              id: 'creative-industry-thread',
              title: 'Creative Process Unveiled',
              description: 'Behind-the-scenes look at creative work',
              category: 'Casual & Engaging',
              tag: 'Education',
              postType: 'thread',
              audience: 'Artists, designers, creative professionals',
              style: 'Inspirational, vulnerable, step-by-step',
              guidelines: 'Show creative process, share challenges and breakthroughs, inspire other creatives'
            }
          ]
        }
      ]
    }
  ];

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
                        onClick={() => onSelectTemplate(template)}
                        className="
                          cursor-pointer 
                          p-4 
                          rounded-lg 
                          border 
                          border-border/30 
                          hover:border-primary/50 
                          transition-all 
                          duration-300 
                          hover:shadow-lg 
                          dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]
                          bg-background 
                          dark:bg-secondary/10
                          hover:bg-primary/5
                          dark:hover:bg-primary/10
                        "
                      >
                        <h4 className="text-md font-semibold mb-2 text-foreground/80 dark:text-foreground/90">
                          {template.title}
                        </h4>
                        <p className="text-sm text-foreground/60 dark:text-foreground/70 mb-4">
                          {template.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs px-2 py-1 rounded-full bg-secondary/30 dark:bg-secondary/20 text-foreground/70">
                            {template.postType}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary/70">
                            {template.tag}
                          </span>
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
