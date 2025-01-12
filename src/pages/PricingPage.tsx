import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Particles } from '@tsparticles/react';
import particlesConfig from '../utils/particlesConfig'; // Create this utility later
import { TypeAnimation } from 'react-type-animation';

const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const pricingPlans = [
    {
      name: 'Starter',
      price: {
        monthly: 4.99,
        yearly: 49.99
      },
      features: [
        '10 Posts per Month',
        'Basic AI Generation',
        'Single Platform Support',
        'Standard Support'
      ],
      description: "Perfect for tiptoeing into AI-driven content without scaring the neighbor’s cat. Enjoy your 10 monthly posts of fame—enough to make waves, but not quite enough to send your Wi-Fi into witness protection.",
      recommended: false
    },
    {
      name: 'Pro',
      price: {
        monthly: 9.99,
        yearly: 99.99
      },
      features: [
        '50 Posts per Month',
        'Advanced AI Generation',
        'Multi-Platform Support',
        { text: 'Priority Support', comingSoon: true},
        { text: 'Content Analytics', comingSoon: true }
      ],
      description: "Because your brilliance won’t contain itself to a single platform. Sling out 50 posts a month with advanced AI wizardry—just remember to keep the coffee flowing and the meltdown meter under control.",
      recommended: true
    },
    {
      name: 'Enterprise',
      price: {
        monthly: "$1,000,000",
        yearly: "$1,000,000"
      },
      features: [
        'Unlimited Posts',
        { text: 'Custom AI Models', comingSoon: true },
        'All Platform Support',
        { text: 'Dedicated Account Manager', comingSoon: true },
        { text: 'Advanced Analytics', comingSoon: true },
        { text: 'API Access', comingSoon: true }
      ],
      description: "Because, hey, why settle for a mere viral sensation when you can knock over half the web? Go big or go home, right? Just remember to wave goodbye to all those cat memes you’ll be obliterating in the process.",
      recommended: false
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Particles options={particlesConfig} className="absolute inset-0 z-0" />
      
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 container mx-auto px-6 text-center"
      >
        <h1 className="text-5xl font-bold mb-8">Choose Your Plan</h1>
        
        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-800 rounded-full p-1 inline-flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`
                px-6 py-2 rounded-full transition-all duration-300
                ${billingCycle === 'monthly' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
                  : 'text-gray-400 hover:text-white'}
              `}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`
                px-6 py-2 rounded-full transition-all duration-300
                ${billingCycle === 'yearly' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
                  : 'text-gray-400 hover:text-white'}
              `}
            >
              Yearly
              <span className="text-green-400 ml-2 text-xs">Save 15%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.name}
              whileHover={{ scale: plan.recommended ? 1.05 : 1.02 }}
              className={`
                bg-gray-800 rounded-xl p-6 border-2 transition-all duration-300
                ${plan.recommended 
                  ? 'border-purple-600 shadow-2xl' 
                  : 'border-transparent hover:border-purple-400'}
              `}
            >
              {plan.recommended && (
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm inline-block mb-4">
                  Most Popular
                </div>
              )}
              <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
              <div className="text-4xl font-bold mb-6">
                {plan.name === 'Enterprise' ? (
                  <TypeAnimation
                    sequence={[
                      "$1,000,000",
                      1000,
                      "Break the Internet",
                      1000,
                      "Literally",
                      1000
                    ]}
                    wrapper="span"
                    cursor={true}
                    repeat={Infinity}
                    className="block"
                  />
                ) : (
                  <>
                    {plan.price[billingCycle]}
                    <span className="text-base ml-2">
                      / {billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </>
                )}
              </div>
              {plan.description && (
                <p className="text-gray-400 mb-6 italic">{plan.description}</p>
              )}
              <ul className="mb-8 space-y-3 text-left">
                {plan.features.map((feature) => (
                  <li key={typeof feature === 'string' ? feature : feature.text} className="flex items-center">
                    <svg 
                      className="w-5 h-5 mr-2 text-green-400" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    {typeof feature === 'string' ? feature : (
                      <span>
                        {feature.text}
                        <span className="text-xs text-gray-400 ml-2">Coming Soon</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  w-full bg-gradient-to-r from-purple-600 to-indigo-600
                  text-white px-6 py-3 rounded-full
                  hover:from-purple-700 hover:to-indigo-700
                  transition-all duration-300
                "
              >
                Start Free Trial
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 max-w-2xl mx-auto">
            All plans come with a 14-day free trial. No credit card required. 
            Cancel or change your plan anytime.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PricingPage;
