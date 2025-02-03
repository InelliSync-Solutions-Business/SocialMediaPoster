export interface Template {
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

export interface TemplateCategory {
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
