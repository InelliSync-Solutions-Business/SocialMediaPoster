import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Particles } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine } from '@tsparticles/engine';
import type { IParticlesProps } from '@tsparticles/react';
import { 
  Image as ImageIcon, 
  PenTool as ContentIcon, 
  Share2 as SharingIcon, 
  Target as TargetIcon 
} from 'lucide-react';

interface ExtendedParticlesProps extends IParticlesProps {
  init?: (engine: Engine) => Promise<void>;
}

const LandingPage: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check if dark mode is enabled
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);

    // Set up a mutation observer to detect theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setIsDarkMode(isDark);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  // Configure particles based on theme
  const particlesConfig = {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: isDarkMode ? "#ffffff" : "#3b82f6" },
      shape: { type: "circle" },
      opacity: { value: isDarkMode ? 0.5 : 0.3, random: false },
      size: { value: 3, random: true },
      line_linked: { 
        enable: true, 
        distance: 150, 
        color: isDarkMode ? "#ffffff" : "#3b82f6", 
        opacity: isDarkMode ? 0.4 : 0.3, 
        width: 1 
      },
      move: { 
        enable: true, 
        speed: 2, 
        direction: "none" as const, 
        random: false, 
        straight: false, 
        out_mode: "out", 
        bounce: false 
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "repulse"
        },
        resize: {
          enable: true
        }
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4
        }
      }
    },
    retina_detect: true
  };

  const particlesProps: ExtendedParticlesProps = {
    id: "tsparticles",
    init: async (engine: Engine) => await loadSlim(engine),
    options: particlesConfig,
    className: "absolute inset-0 z-0"
  };

  const features = [
    {
      title: "Image Generation",
      description: "Create stunning visuals for your posts instantly",
      icon: ImageIcon,
      capabilities: [
        "AI-powered image creation",
        "Platform-specific image sizing",
        "Style and mood customization"
      ]
    },
    {
      title: "Advanced Content Creation",
      description: "Craft perfect posts for every platform",
      icon: ContentIcon,
      capabilities: [
        "Short-form content",
        "Long-form articles",
        "Twitter/X threads",
        "Custom content templates"
      ]
    },
    {
      title: "Smart Social Sharing",
      description: "Optimize and distribute content effortlessly",
      icon: SharingIcon,
      capabilities: [
        "Direct platform sharing",
        "Character count tracking",
        "Platform-specific optimization",
        "Inline content editing"
      ]
    },
    {
      title: "Multi-Platform Targeting",
      description: "Tailored content for each social network",
      icon: TargetIcon,
      capabilities: [
        "Facebook strategy",
        "Instagram optimization",
        "LinkedIn professional tone",
        "X/Twitter engagement",
        "Discord community content"
      ]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      quote: "Transformed our social media strategy overnight!",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "Mike Rodriguez",
      role: "Content Creator",
      quote: "The AI understands my brand better than I do!",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    }
  ];

  // Define text color classes based on theme
  const textColorClass = isDarkMode ? "text-white" : "text-gray-800";
  const textMutedClass = isDarkMode ? "text-white/70" : "text-gray-600";
  const cardBgClass = isDarkMode ? "bg-white/10" : "bg-white/80";
  const buttonBgClass = isDarkMode ? "bg-white/10" : "bg-blue-600";
  const buttonHoverClass = isDarkMode ? "hover:bg-white/20" : "hover:bg-blue-700";
  const buttonTextClass = isDarkMode ? "text-white" : "text-white";
  const borderClass = isDarkMode ? "border-white/20" : "border-blue-400";
  const capabilityBgClass = isDarkMode ? "bg-white/10" : "bg-blue-100";
  const capabilityTextClass = isDarkMode ? "text-white/80" : "text-blue-800";

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen overflow-hidden"
    >
      {/* Particle Background */}
      <Particles {...particlesProps} />

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-16 text-center">
        <motion.h1 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className={`text-5xl font-bold mb-6 ${textColorClass}`}
        >
          AI-Powered Social Media Transformation
        </motion.h1>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`max-w-2xl mx-auto ${cardBgClass} backdrop-blur-lg rounded-xl p-6 shadow-2xl`}
        >
          <TypeAnimation
            sequence={[
              "Create Engaging Posts",
              1000,
              "Boost Your Social Media Presence",
              1000,
              "Effortless Content Creation",
              1000
            ]}
            wrapper="p"
            cursor={true}
            repeat={0}
            className={`text-xl ${textColorClass} mb-4`}
          />
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-10"
          >
            <Link 
              to="/app/generator" 
              className={`
                ${buttonBgClass} backdrop-blur-lg
                ${buttonTextClass}
                px-10 py-4 rounded-full text-lg 
                ${buttonHoverClass}
                transition-all duration-300
                inline-block shadow-lg hover:shadow-xl
                transform hover:-translate-y-1
                border ${borderClass}
                font-semibold
                focus:outline-none focus:ring-2 focus:ring-blue-400
              `}
            >
              Start Your Content Journey
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 py-16">
        <h2 className={`text-3xl font-bold text-center mb-12 ${textColorClass}`}>Unleash Your Content Potential</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.05 }}
              className={`${cardBgClass} backdrop-blur-lg p-6 rounded-xl border ${borderClass}`}
            >
              <div className="flex items-center mb-4">
                <feature.icon className={`w-8 h-8 mr-3 ${isDarkMode ? "text-white/80" : "text-blue-600"}`} strokeWidth={1.5} />
                <h3 className={`text-xl font-semibold ${textColorClass}`}>{feature.title}</h3>
              </div>
              <p className={`mb-4 ${textMutedClass}`}>{feature.description}</p>
              <div className="flex flex-wrap gap-2">
                {feature.capabilities.map((capability, idx) => (
                  <span 
                    key={idx} 
                    className={`
                      ${capabilityBgClass} px-3 py-1 rounded-full 
                      text-sm ${capabilityTextClass}`}
                  >
                    {capability}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 container mx-auto px-6 py-16 text-center">
        <h2 className={`text-3xl font-bold mb-12 ${textColorClass}`}>What Our Users Say</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`${cardBgClass} backdrop-blur-lg p-6 rounded-xl`}
            >
              <p className={`italic mb-4 ${textColorClass}`}>"{testimonial.quote}"</p>
              <div className="flex items-center justify-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h4 className={`font-semibold ${textColorClass}`}>{testimonial.name}</h4>
                  <p className={`text-sm ${textMutedClass}`}>{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 container mx-auto px-6 py-16 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`${cardBgClass} backdrop-blur-lg rounded-xl p-12`}
        >
          <h2 className={`text-4xl font-bold mb-6 ${textColorClass}`}>Ready to Revolutionize Your Content?</h2>
          <p className={`text-xl mb-8 ${textMutedClass}`}>Join thousands of creators who are transforming their social media strategy</p>
          <Link 
            to="/pricing" 
            className={`
              ${buttonBgClass} backdrop-blur-lg
              ${buttonTextClass}
              px-12 py-4 rounded-full text-lg 
              ${buttonHoverClass}
              transition-all duration-300
              inline-block shadow-lg hover:shadow-xl
              transform hover:-translate-y-1
              border ${borderClass}
              font-semibold
              focus:outline-none focus:ring-2 focus:ring-blue-400
            `}
          >
            Start Your Free Trial
          </Link>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default LandingPage;
