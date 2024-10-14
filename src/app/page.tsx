'use client';

import Navigation from './Navigation';
import HeroSection from './HeroSection';
import FeatureSection from './FeatureSection';
import TestimonialSection from './TestimonialSection';
import PricingSection from './PricingSection';
import Footer from './Footer';

const LandingPage = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            <Navigation />
            <main className="flex-grow">
                <HeroSection />
                <FeatureSection />
                <TestimonialSection />
                <PricingSection />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
