import React, { useState } from 'react';
import './AssessmentBlock.css';

function AssessmentBlock({ block, isPreview = false, onSubmit, onAssessmentComplete }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]); // For matching questions
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleAnswerChange = (value) => {
    if (block.questionType === 'multiple-choice' || block.questionType === 'true-false') {
      setSelectedOption(value);
    } else if (block.questionType === 'fill-in-the-blank') {
      setUserAnswer(value);
    }
  };

  const handleMatchingChange = (index, value) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = () => {
    let isCorrect = false;
    let feedbackText = block.feedback || '';
    let score = 0;

    switch (block.questionType) {
      case 'multiple-choice':
        isCorrect = selectedOption === block.correctAnswer;
        score = isCorrect ? 100 : 0;
        break;
      case 'true-false':
        isCorrect = selectedOption === block.correctAnswer;
        score = isCorrect ? 100 : 0;
        break;
      case 'fill-in-the-blank':
        isCorrect = userAnswer.toLowerCase().trim() === (block.correctAnswer || '').toLowerCase().trim();
        score = isCorrect ? 100 : 0;
        break;
      case 'matching':
        // For matching, calculate partial credit
        if (userAnswers.length > 0 && block.correctAnswer && block.correctAnswer.length > 0) {
          const correctCount = userAnswers.filter((answer, idx) => 
            answer === block.correctAnswer[idx]
          ).length;
          score = Math.round((correctCount / block.correctAnswer.length) * 100);
          isCorrect = score === 100;
        } else {
          isCorrect = false;
          score = 0;
        }
        break;
      default:
        isCorrect = false;
        score = 0;
    }

    setFeedback(isCorrect ? block.correctFeedback || 'Correct!' : block.incorrectFeedback || 'Please try again.');
    setIsSubmitted(true);

    if (onSubmit) {
      onSubmit({
        questionId: block.id,
        isCorrect,
        userAnswer: block.questionType === 'matching' ? userAnswers : (block.questionType === 'multiple-choice' || block.questionType === 'true-false') ? selectedOption : userAnswer,
        correctAnswer: block.correctAnswer
      });
    }

    // Call the assessment completion handler if provided
    if (onAssessmentComplete) {
      onAssessmentComplete(block.id, score, isCorrect);
    }
  };

  const renderQuestionContent = () => {
    switch (block.questionType) {
      case 'multiple-choice':
        return (
          <div className="assessment-options">
            {block.options && block.options.map((option, index) => (
              <div key={index} className="option-item">
                <label>
                  <input
                    type="radio"
                    name={`question-${block.id}`}
                    value={index}
                    checked={selectedOption === index}
                    onChange={() => handleAnswerChange(index)}
                    disabled={isSubmitted}
                  />
                  <span>{option}</span>
                </label>
              </div>
            ))}
          </div>
        );

      case 'true-false':
        return (
          <div className="assessment-options">
            <div className="option-item">
              <label>
                <input
                  type="radio"
                  name={`question-${block.id}`}
                  value="true"
                  checked={selectedOption === 'true'}
                  onChange={() => handleAnswerChange('true')}
                  disabled={isSubmitted}
                />
                <span>True</span>
              </label>
            </div>
            <div className="option-item">
              <label>
                <input
                  type="radio"
                  name={`question-${block.id}`}
                  value="false"
                  checked={selectedOption === 'false'}
                  onChange={() => handleAnswerChange('false')}
                  disabled={isSubmitted}
                />
                <span>False</span>
              </label>
            </div>
          </div>
        );

      case 'fill-in-the-blank':
        return (
          <div className="assessment-input">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Type your answer here..."
              disabled={isSubmitted}
            />
          </div>
        );

      case 'matching':
        return (
          <div className="assessment-matching">
            {block.items && block.items.map((item, index) => (
              <div key={index} className="matching-item">
                <span className="matching-stem">{item.stem}</span>
                <span className="matching-connector">matches</span>
                <select
                  value={userAnswers[index] || ''}
                  onChange={(e) => handleMatchingChange(index, e.target.value)}
                  disabled={isSubmitted}
                >
                  <option value="">Select...</option>
                  {block.choices && block.choices.map((choice, choiceIndex) => (
                    <option key={choiceIndex} value={choiceIndex}>{choice}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`assessment-block ${isPreview ? 'preview-mode' : ''}`}>
      <div className="assessment-header">
        <h3>{block.question}</h3>
        {block.questionType && (
          <span className="question-type-badge">{block.questionType.replace('-', ' ')}</span>
        )}
      </div>
      
      <div className="assessment-body">
        {renderQuestionContent()}
        
        {!isPreview && !isSubmitted && (
          <button className="submit-btn" onClick={handleSubmit}>
            Submit Answer
          </button>
        )}
        
        {isSubmitted && (
          <div className={`feedback ${selectedOption === block.correctAnswer ? 'correct' : 'incorrect'}`}>
            <p>{feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssessmentBlock;