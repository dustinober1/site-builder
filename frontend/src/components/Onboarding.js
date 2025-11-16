import React, { useState } from 'react';
import './Onboarding.css';

function Onboarding({ isOpen, onClose, onComplete }) {
  if (!isOpen) return null;

  const steps = [
    {
      title: "Welcome to Site Builder",
      content: "This guide will help you get started with creating interactive websites and courses.",
      illustration: "🎓"
    },
    {
      title: "Create Your Project",
      content: "Start by creating a new project or opening an existing one. You can also choose from various templates.",
      illustration: "📁"
    },
    {
      title: "Add Content Blocks",
      content: "Drag and drop different content blocks like text, images, videos, quizzes, and interactive elements.",
      illustration: "🧩"
    },
    {
      title: "Customize Your Course",
      content: "Adjust colors, fonts, and layout to match your brand or preferences using the theme options.",
      illustration: "🎨"
    },
    {
      title: "Preview and Test",
      content: "Use the real-time preview to see how your course will look and test all interactive elements.",
      illustration: "👁️"
    },
    {
      title: "Publish Your Course",
      content: "Export your course as a static website, SCORM package, or publish directly to our hosting service.",
      illustration: "🚀"
    }
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        <div className="onboarding-header">
          <h2>Getting Started Guide</h2>
          <button className="skip-button" onClick={handleSkip}>
            Skip
          </button>
        </div>
        
        <div className="onboarding-progress">
          <div className="progress-bar">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`progress-step ${index <= currentStep ? 'active' : ''} ${index === currentStep ? 'current' : ''}`}
              ></div>
            ))}
          </div>
          <div className="step-counter">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
        
        <div className="onboarding-content">
          <div className="illustration">
            {steps[currentStep].illustration}
          </div>
          <h3>{steps[currentStep].title}</h3>
          <p>{steps[currentStep].content}</p>
        </div>
        
        <div className="onboarding-navigation">
          <button 
            className="nav-button prev-button" 
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            ← Previous
          </button>
          
          <button 
            className="nav-button next-button" 
            onClick={nextStep}
          >
            {currentStep === steps.length - 1 ? 'Finish' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;