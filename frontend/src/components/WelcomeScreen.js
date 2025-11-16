import React, { useState } from 'react';
import Onboarding from './Onboarding';
import './WelcomeScreen.css';

function WelcomeScreen({ onGetStarted }) {
  return (
    <div className="welcome-screen">
      <header className="welcome-header" role="banner">
        <div className="welcome-container">
          <h1>E-Learning Site Builder</h1>
          <p className="subtitle">Create 508-compliant training websites in minutes</p>
        </div>
      </header>

      <main className="welcome-main" role="main">
        <div className="welcome-container">
          <section className="features" aria-labelledby="features-heading">
            <h2 id="features-heading">Key Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🎨</div>
                <h3>Drag & Drop Builder</h3>
                <p>Easy-to-use interface for creating course content without coding</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">♿</div>
                <h3>508 Compliant</h3>
                <p>Built-in accessibility features ensure WCAG 2.1 AA compliance</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">📸</div>
                <h3>Media Support</h3>
                <p>Add images, videos, and interactive content to engage learners</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">📱</div>
                <h3>Responsive Design</h3>
                <p>Automatically adapts to mobile, tablet, and desktop screens</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">📦</div>
                <h3>Static Site Export</h3>
                <p>Generate standalone HTML/CSS for hosting anywhere</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🚀</div>
                <h3>Quick Deployment</h3>
                <p>Host on local servers or any static hosting platform</p>
              </div>
            </div>
          </section>

          <section className="getting-started" aria-labelledby="start-heading">
            <h2 id="start-heading">Ready to Get Started?</h2>
            <p>Build your first course in minutes with our intuitive drag-and-drop editor.</p>
            <button 
              className="cta-button"
              onClick={onGetStarted}
              aria-label="Start creating a new course"
            >
              Create Your First Course
            </button>
          </section>
        </div>
      </main>

      <footer className="welcome-footer" role="contentinfo">
        <p>&copy; 2025 E-Learning Site Builder. Built for accessibility.</p>
      </footer>
    </div>
  );
}

export default WelcomeScreen;
