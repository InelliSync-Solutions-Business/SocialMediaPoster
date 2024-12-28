import React from 'react';
import { Link } from 'react-router-dom';
import StreamText from '../components/StreamText';

const LandingPage: React.FC = () => {
  const heroText = "Create engaging, platform-optimized content in seconds";

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] 
      dark:bg-[hsl(var(--background-dark))] 
      dark:bg-gradient-to-br dark:from-[hsl(240,10%,3.9%)] dark:to-[hsl(240,10%,8%)]">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold mb-6 
          text-[hsl(var(--foreground))] 
          dark:text-[hsl(var(--foreground-dark))]">
          <StreamText 
            text="AI-Powered Social Media Writer" 
            className="block"
            speed={150} 
          />
        </h1>
        <p className="text-xl mb-10 
          text-[hsl(var(--secondary))] 
          dark:text-[hsl(240,5.9%,70%)]">
          Create engaging, platform-optimized content in seconds
        </p>
        <Link 
          to="/generate" 
          className="
            bg-[hsl(var(--primary))] text-[hsl(var(--foreground))]
            dark:bg-[hsl(var(--primary-dark))] dark:text-[hsl(var(--foreground-dark))]
            px-8 py-3 rounded-full text-lg 
            hover:opacity-90 transition-all duration-300
            border border-[hsl(var(--border))] 
            dark:border-[hsl(var(--border-dark))]"
        >
          Start Writing Now
        </Link>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16 
        bg-[hsl(var(--background))] 
        dark:bg-transparent">
        <h2 className="text-3xl font-bold text-center mb-12 
          text-[hsl(var(--foreground))] 
          dark:text-[hsl(var(--foreground-dark))]">
          Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Multi-Platform Support",
              description: "Generate content for Twitter, LinkedIn, Instagram, and more",
              bgClass: "bg-[hsl(var(--primary)/0.1)]"
            },
            {
              title: "AI-Driven Writing",
              description: "Leverage advanced AI to craft compelling social media posts",
              bgClass: "bg-[hsl(var(--secondary)/0.1)]"
            },
            {
              title: "Customization",
              description: "Tailor content to your brand voice and target audience",
              bgClass: "bg-[hsl(var(--primary)/0.2)]"
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className={`
                text-center p-6 rounded-lg 
                ${feature.bgClass}
                border border-[hsl(var(--border)/0.1)]
                dark:border-[hsl(var(--border-dark)/0.2)]
                hover:scale-105 transition-all duration-300
              `}
            >
              <h3 className="text-xl font-semibold mb-4 
                text-[hsl(var(--foreground))] 
                dark:text-[hsl(var(--foreground-dark))]">
                {feature.title}
              </h3>
              <p className="
                text-[hsl(var(--secondary))] 
                dark:text-[hsl(240,5.9%,70%)]
              ">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16 text-center 
        bg-[hsl(var(--primary)/0.1)] 
        dark:bg-[hsl(var(--primary-dark)/0.1)]">
        <h2 className="text-4xl font-bold mb-6 
          text-[hsl(var(--foreground))] 
          dark:text-[hsl(var(--foreground-dark))]">
          Ready to Transform Your Social Media?
        </h2>
        <p className="text-xl mb-10 
          text-[hsl(var(--secondary))] 
          dark:text-[hsl(240,5.9%,70%)]">
          Join thousands of creators who are saving time and boosting engagement
        </p>
        <Link 
          to="/signup" 
          className="
            bg-[hsl(var(--primary))] text-[hsl(var(--foreground))]
            dark:bg-[hsl(var(--primary-dark))] dark:text-[hsl(var(--foreground-dark))]
            px-10 py-4 rounded-full text-lg 
            hover:opacity-90 transition-all duration-300
            border border-[hsl(var(--border))]
            dark:border-[hsl(var(--border-dark))]"
        >
          Sign Up Free
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;
