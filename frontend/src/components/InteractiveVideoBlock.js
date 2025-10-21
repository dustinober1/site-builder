import React, { useState, useRef, useEffect } from 'react';
import './InteractiveVideoBlock.css';

function InteractiveVideoBlock({ block, isPreview = false, onUpdateBlock }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  const videoRef = useRef(null);
  const interactionTimers = useRef([]);

  const videoUrl = block.url || block.videoUrl;
  const interactions = block.interactions || [];

  // Initialize interactions based on the block data
  useEffect(() => {
    if (onUpdateBlock && !block.interactions) {
      // Set default interactions for new interactive video blocks
      onUpdateBlock(block.id, {
        interactions: [
          {
            id: 'quiz1',
            type: 'quiz',
            time: 30, // seconds
            question: 'What did you just learn from this video?',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 0,
            feedback: 'Great job!',
            required: true
          }
        ]
      });
    }
  }, [block.id, block.interactions, onUpdateBlock]);

  // Check for interactions when video time updates
  useEffect(() => {
    if (!videoRef.current || !interactions.length) return;

    const checkForInteraction = () => {
      if (!videoRef.current) return;
      
      const currentVideoTime = videoRef.current.currentTime;
      
      interactions.forEach(interaction => {
        // Check if we just passed the interaction time
        if (Math.abs(currentVideoTime - interaction.time) < 0.5 && 
            !userAnswers[interaction.id] && 
            !videoEnded) {
          handleInteraction(interaction);
        }
      });
    };

    const interval = setInterval(checkForInteraction, 500);
    return () => clearInterval(interval);
  }, [currentTime, interactions, userAnswers, videoEnded]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setVideoEnded(true);
  };

  const handleInteraction = (interaction) => {
    if (isPreview) return;
    
    if (interaction.type === 'quiz') {
      setCurrentQuiz(interaction);
      setShowQuiz(true);
      // Pause the video when showing quiz
      if (videoRef.current) {
        videoRef.current.pause();
      }
    } else if (interaction.type === 'checkpoint') {
      // For checkpoints, we can just show a message or pause
      alert(interaction.message || 'Checkpoint reached!');
    }
  };

  const handleQuizSubmit = (selectedAnswer) => {
    if (!currentQuiz) return;

    const isCorrect = selectedAnswer === currentQuiz.correctAnswer;
    const answerData = {
      interactionId: currentQuiz.id,
      selectedAnswer,
      isCorrect,
      timestamp: currentTime
    };

    setUserAnswers(prev => ({
      ...prev,
      [currentQuiz.id]: answerData
    }));

    setShowQuiz(false);
    setCurrentQuiz(null);

    // If it was a required question, continue the video
    if (currentQuiz.required && videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleQuizClose = () => {
    setShowQuiz(false);
    setCurrentQuiz(null);
    // If it was a required question, we can't close without answering
    if (currentQuiz && currentQuiz.required && !userAnswers[currentQuiz.id] && videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleSeek = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
      setVideoEnded(false);
    }
  };

  return (
    <div className={`interactive-video-block ${isPreview ? 'preview-mode' : ''}`}>
      <div className="video-container">
        <video
          ref={videoRef}
          src={videoUrl}
          onTimeUpdate={handleTimeUpdate}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          controls={!showQuiz}
          className={showQuiz ? 'paused-overlay' : ''}
          width="100%"
          height="auto"
        >
          Your browser does not support the video tag.
        </video>

        {showQuiz && currentQuiz && (
          <div className="quiz-overlay">
            <div className="quiz-content">
              <h3>{currentQuiz.question}</h3>
              
              <div className="quiz-options">
                {currentQuiz.options?.map((option, index) => (
                  <button
                    key={index}
                    className={`quiz-option ${userAnswers[currentQuiz.id]?.selectedAnswer === index ? 'selected' : ''}`}
                    onClick={() => handleQuizSubmit(index)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              
              <div className="quiz-controls">
                <button 
                  className="quiz-close-btn"
                  onClick={handleQuizClose}
                  disabled={currentQuiz.required && !userAnswers[currentQuiz.id]}
                >
                  {currentQuiz.required && !userAnswers[currentQuiz.id] 
                    ? 'Answer required' 
                    : 'Skip for now'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="video-controls">
        <div className="control-group">
          <button onClick={handleRestart} disabled={isPreview}>Restart</button>
          
          <div className="speed-controls">
            <span>Speed:</span>
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={playbackSpeed === speed ? 'active' : ''}
                disabled={isPreview}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {interactions && interactions.length > 0 && (
          <div className="interaction-indicators">
            {interactions.map(interaction => (
              <button
                key={interaction.id}
                onClick={() => handleSeek(interaction.time)}
                className={`interaction-marker ${userAnswers[interaction.id] ? 'completed' : 'pending'}`}
                style={{ left: `${(interaction.time / (videoRef.current?.duration || 100)) * 100}%` }}
                disabled={isPreview}
                title={`${interaction.type}: ${interaction.time}s`}
              >
                {userAnswers[interaction.id] ? '✓' : '○'}
              </button>
            ))}
          </div>
        )}

        {block.description && (
          <div className="video-description">
            <p>{block.description}</p>
          </div>
        )}
      </div>

      {interactions && interactions.length > 0 && (
        <div className="interaction-summary">
          <h4>Interactions in this video:</h4>
          <ul>
            {interactions.map((interaction, index) => (
              <li key={interaction.id} className={userAnswers[interaction.id] ? 'completed' : 'pending'}>
                <span className="interaction-time">{Math.floor(interaction.time / 60)}:{String(interaction.time % 60).padStart(2, '0')}</span>
                <span className="interaction-type">{interaction.type === 'quiz' ? 'Quiz' : 'Checkpoint'}</span>
                <span className="interaction-status">
                  {userAnswers[interaction.id] 
                    ? (userAnswers[interaction.id].isCorrect ? '✓ Correct' : '✗ Incorrect') 
                    : 'Pending'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default InteractiveVideoBlock;