import React from 'react';
import { Check } from 'lucide-react';

const PricingTier = ({ name, price, features, isPopular }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${isPopular ? 'border-2 border-purple-600' : ''}`}>
    {isPopular && (
      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ">
        Popular
      </span>
    )}
    <h3 className="text-2xl font-bold mb-4">{name}</h3>
    <p className="text-4xl font-bold mb-6">${price}<span className="text-base font-normal">/month</span></p>
    <ul className="mb-6 space-y-4">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <Check className="text-green-500 mr-2" size={20} />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <button className={`w-full py-2 px-4 rounded-md transition duration-200 ${isPopular ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
      {isPopular ? 'Start Free Trial' : 'Choose Plan'}
    </button>
  </div>
);

const Pricing = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">Choose the Right Plan for You</h2>
      
      <div className="flex justify-center mb-8">
        <div className="bg-gray-200 dark:bg-gray-700 p-1 rounded-full">
          <button className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 shadow">Monthly</button>
          <button className="px-4 py-2 rounded-full text-gray-800 dark:text-white">Yearly</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <PricingTier
          name="Starter"
          price={9}
          features={[
            "1 User",
            "10 eBooks",
            "Basic Templates",
            "Email Support"
          ]}
          isPopular={false}
        />
        <PricingTier
          name="Professional"
          price={29}
          features={[
            "5 Users",
            "Unlimited eBooks",
            "Advanced Templates",
            "Priority Support",
            "Custom Branding"
          ]}
          isPopular={true}
        />
        <PricingTier
          name="Enterprise"
          price={99}
          features={[
            "Unlimited Users",
            "Unlimited eBooks",
            "Custom Templates",
            "24/7 Support",
            "API Access",
            "White-label Solution"
          ]}
          isPopular={false}
        />
      </div>
    </div>
  );
};

export default Pricing;