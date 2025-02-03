import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import Templates from '@/components/Templates';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Templates</h1>
            <p className="mt-2 text-muted-foreground">
              Choose from our collection of professionally crafted templates
            </p>
          </div>
          
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
        </div>
      </div>
    </MainLayout>
  );
};

export default TemplatesPage;
