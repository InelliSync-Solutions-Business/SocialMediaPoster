import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import Templates from '@/components/Templates';

const TemplatesPage = () => {
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
            onSelect={(template) => {
              // Handle template selection
              if (template) {
                // Navigate to content generator with selected template
                // This can be implemented using React Router or your preferred navigation method
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
