import React, { useState, useEffect } from 'react';
import './QuestionBank.css';

function QuestionBank({ isOpen, onClose, onInsertQuestion }) {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestionForm, setNewQuestionForm] = useState({
    question: '',
    type: 'multiple-choice',
    options: ['', '', '', ''],
    correctAnswer: 0,
    tags: '',
    learningObjective: '',
    difficulty: 'beginner',
    competency: ''
  });

  // Sample questions data
  const sampleQuestions = [
    {
      id: 1,
      question: 'What is the primary purpose of workplace safety protocols?',
      type: 'multiple-choice',
      options: [
        'To increase productivity',
        'To protect employees from injury and illness',
        'To reduce company costs',
        'To satisfy legal requirements'
      ],
      correctAnswer: 1,
      explanation: 'Safety protocols primarily focus on protecting employees from workplace hazards.',
      tags: ['safety', 'protocols', 'workplace'],
      learningObjective: 'Understand safety protocols',
      competency: 'Safety Management',
      difficulty: 'beginner',
      createdAt: '2025-01-15'
    },
    {
      id: 2,
      question: 'True or False: All workplace hazards can be completely eliminated.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 1,
      explanation: 'While many hazards can be controlled, some risks may still exist even with controls.',
      tags: ['safety', 'hazards', 'risk'],
      learningObjective: 'Recognize hazard limitations',
      competency: 'Risk Management',
      difficulty: 'intermediate',
      createdAt: '2025-01-20'
    },
    {
      id: 3,
      question: 'Fill in the blank: The most important step in hazard identification is ________.',
      type: 'fill-in-the-blank',
      options: [],
      correctAnswer: 'observation',
      explanation: 'Observation is the key to identifying potential hazards in the workplace.',
      tags: ['hazard', 'identification', 'observation'],
      learningObjective: 'Identify hazards',
      competency: 'Safety Assessment',
      difficulty: 'beginner',
      createdAt: '2025-01-22'
    },
    {
      id: 4,
      question: 'Match the safety color with its meaning:',
      type: 'matching',
      items: [
        { id: 'item1', stem: 'Red' },
        { id: 'item2', stem: 'Yellow' },
        { id: 'item3', stem: 'Blue' },
        { id: 'item4', stem: 'Green' }
      ],
      choices: [
        'Danger',
        'Caution',
        'Information',
        'Safety'
      ],
      correctAnswer: [0, 1, 2, 3],
      explanation: 'Red indicates danger, yellow caution, blue information, and green safety.',
      tags: ['colors', 'safety', 'signs'],
      learningObjective: 'Understand safety signage',
      competency: 'Safety Communication',
      difficulty: 'intermediate',
      createdAt: '2025-01-25'
    }
  ];

  useEffect(() => {
    // In a real implementation, this would fetch from an API
    setQuestions(sampleQuestions);
    setFilteredQuestions(sampleQuestions);
  }, []);

  useEffect(() => {
    let result = questions;

    if (searchTerm) {
      result = result.filter(q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter(q => q.tags.includes(selectedCategory));
    }

    if (selectedType !== 'all') {
      result = result.filter(q => q.type === selectedType);
    }

    if (selectedDifficulty !== 'all') {
      result = result.filter(q => q.difficulty === selectedDifficulty);
    }

    setFilteredQuestions(result);
  }, [searchTerm, selectedCategory, selectedType, selectedDifficulty, questions]);

  const handleAddQuestion = (e) => {
    e.preventDefault();
    
    const newQuestion = {
      id: Date.now(),
      question: newQuestionForm.question,
      type: newQuestionForm.type,
      options: newQuestionForm.type === 'multiple-choice' || newQuestionForm.type === 'true-false' 
        ? newQuestionForm.options 
        : [],
      correctAnswer: newQuestionForm.correctAnswer,
      explanation: newQuestionForm.explanation || '',
      tags: newQuestionForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      learningObjective: newQuestionForm.learningObjective,
      competency: newQuestionForm.competency,
      difficulty: newQuestionForm.difficulty,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setQuestions(prev => [...prev, newQuestion]);
    setNewQuestionForm({
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      tags: '',
      learningObjective: '',
      difficulty: 'beginner',
      competency: ''
    });
    setShowAddForm(false);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...newQuestionForm.options];
    newOptions[index] = value;
    setNewQuestionForm(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const handleInsertQuestion = (question) => {
    if (onInsertQuestion) {
      onInsertQuestion(question);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewQuestionForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="question-bank-modal">
      <div className="question-bank-content">
        <div className="question-bank-header">
          <h2>Question Bank</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="question-bank-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="safety">Safety</option>
              <option value="compliance">Compliance</option>
              <option value="onboarding">Onboarding</option>
              <option value="technical">Technical</option>
            </select>
            
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="multiple-choice">Multiple Choice</option>
              <option value="true-false">True/False</option>
              <option value="fill-in-the-blank">Fill-in-the-Blank</option>
              <option value="matching">Matching</option>
            </select>
            
            <select 
              value={selectedDifficulty} 
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          
          <button 
            className="add-question-btn"
            onClick={() => setShowAddForm(true)}
          >
            + Add Question
          </button>
        </div>
        
        <div className="question-bank-body">
          {showAddForm ? (
            <div className="add-question-form">
              <h3>Add New Question</h3>
              <form onSubmit={handleAddQuestion}>
                <div className="form-group">
                  <label htmlFor="question">Question</label>
                  <textarea
                    id="question"
                    name="question"
                    value={newQuestionForm.question}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="type">Question Type</label>
                  <select
                    id="type"
                    name="type"
                    value={newQuestionForm.type}
                    onChange={handleFormChange}
                  >
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="true-false">True/False</option>
                    <option value="fill-in-the-blank">Fill-in-the-Blank</option>
                    <option value="matching">Matching</option>
                  </select>
                </div>
                
                {(newQuestionForm.type === 'multiple-choice' || newQuestionForm.type === 'true-false') && (
                  <div className="form-group">
                    <label htmlFor="options">Options</label>
                    {newQuestionForm.options.map((option, index) => (
                      <div key={index} className="option-input">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                        <input
                          type="radio"
                          name="correctAnswer"
                          value={index}
                          checked={newQuestionForm.correctAnswer === index}
                          onChange={() => setNewQuestionForm(prev => ({ ...prev, correctAnswer: index }))}
                        />
                        <span>Correct</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {newQuestionForm.type === 'fill-in-the-blank' && (
                  <div className="form-group">
                    <label htmlFor="correctAnswer">Correct Answer</label>
                    <input
                      type="text"
                      id="correctAnswer"
                      name="correctAnswer"
                      value={newQuestionForm.correctAnswer}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                )}
                
                {newQuestionForm.type === 'matching' && (
                  <div className="form-group">
                    <label htmlFor="items">Items to Match</label>
                    <p>Enter items to match (one per line):</p>
                    <textarea
                      id="items"
                      name="items"
                      value={newQuestionForm.items?.join('\n') || ''}
                      onChange={(e) => {
                        const items = e.target.value.split('\n').filter(item => item.trim());
                        const itemsArray = items.map((item, idx) => ({ id: `item${idx}`, stem: item }));
                        setNewQuestionForm(prev => ({ ...prev, items: itemsArray }));
                      }}
                      placeholder="Item 1&#10;Item 2&#10;Item 3&#10;Item 4"
                    />
                    
                    <p>Enter matching choices (one per line):</p>
                    <textarea
                      id="choices"
                      name="choices"
                      value={newQuestionForm.choices?.join('\n') || ''}
                      onChange={(e) => {
                        const choices = e.target.value.split('\n').filter(choice => choice.trim());
                        setNewQuestionForm(prev => ({ ...prev, choices }));
                      }}
                      placeholder="Choice 1&#10;Choice 2&#10;Choice 3&#10;Choice 4"
                    />
                    
                    <p>Enter correct matching indices (comma separated):</p>
                    <input
                      type="text"
                      name="correctAnswer"
                      value={newQuestionForm.correctAnswer.join(',')}
                      onChange={(e) => {
                        const indices = e.target.value.split(',').map(idx => parseInt(idx.trim())).filter(num => !isNaN(num));
                        setNewQuestionForm(prev => ({ ...prev, correctAnswer: indices }));
                      }}
                      placeholder="0,1,2,3"
                    />
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="explanation">Explanation</label>
                  <textarea
                    id="explanation"
                    name="explanation"
                    value={newQuestionForm.explanation}
                    onChange={handleFormChange}
                    placeholder="Provide explanation for the correct answer"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="tags">Tags (comma separated)</label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={newQuestionForm.tags}
                    onChange={handleFormChange}
                    placeholder="safety, protocols, training"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="learningObjective">Learning Objective</label>
                  <input
                    type="text"
                    id="learningObjective"
                    name="learningObjective"
                    value={newQuestionForm.learningObjective}
                    onChange={handleFormChange}
                    placeholder="What the learner will know"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="competency">Competency</label>
                  <input
                    type="text"
                    id="competency"
                    name="competency"
                    value={newQuestionForm.competency}
                    onChange={handleFormChange}
                    placeholder="Target competency"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="difficulty">Difficulty Level</label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={newQuestionForm.difficulty}
                    onChange={handleFormChange}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="save-btn">Save Question</button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="questions-grid">
              {filteredQuestions.map(question => (
                <div key={question.id} className="question-card">
                  <div className="question-header">
                    <div className="question-type">
                      <span className="type-badge">{question.type.replace('-', ' ')}</span>
                      <span className="difficulty-badge">{question.difficulty}</span>
                    </div>
                    <button 
                      className="insert-btn"
                      onClick={() => handleInsertQuestion(question)}
                      title="Add to course"
                    >
                      Add
                    </button>
                  </div>
                  
                  <div className="question-content">
                    <h3>{question.question}</h3>
                    
                    {question.options && question.options.length > 0 && (
                      <div className="question-options">
                        {question.options.map((option, index) => (
                          <div key={index} className={`option ${index === question.correctAnswer ? 'correct' : ''}`}>
                            <span className="option-letter">{String.fromCharCode(65 + index)}.</span>
                            <span className="option-text">{option}</span>
                            {index === question.correctAnswer && <span className="correct-indicator">✓</span>}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {question.explanation && (
                      <div className="question-explanation">
                        <strong>Explanation:</strong> {question.explanation}
                      </div>
                    )}
                  </div>
                  
                  <div className="question-footer">
                    <div className="tags">
                      {question.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                    
                    <div className="metadata">
                      <div>Objective: {question.learningObjective}</div>
                      <div>Competency: {question.competency}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuestionBank;