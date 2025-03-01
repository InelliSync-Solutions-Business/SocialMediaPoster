import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import Templates from '@/components/Templates';
import { ResponsiveContainer, Section } from '@/components/ui/responsive-container';

interface TemplatesPageProps {
  onTemplateSelect: (template: any, prepopulatedFields: any) => void;
  onNavigateToGenerator: () => void;
}

const TemplatesPage: React.FC<TemplatesPageProps> = ({ 
  onTemplateSelect, 
  onNavigateToGenerator 
}) => {
  return (
    <MainLayout>
      <Section
        title="Templates"
        description="Choose from our collection of professionally crafted templates"
        className="mb-4"
      >
        <ResponsiveContainer>
          <Templates 
            category="all"
            onSelect={(template, prepopulatedFields) => {
              if (template && prepopulatedFields) {
                onTemplateSelect(template, prepopulatedFields);
                onNavigateToGenerator();
              }
            }}
            selected={null}
          />
        </ResponsiveContainer>
      </Section>
    </MainLayout>
  );
};

export default TemplatesPage;
