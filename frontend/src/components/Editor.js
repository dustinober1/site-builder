import React, { useState, useCallback, useEffect } from 'react';
import './Editor.css';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import PropertiesPanel from './PropertiesPanel';
import PreviewModal from './PreviewModal';
import ProgressTracker from './ProgressTracker';
import LearningPath from './LearningPath';
import AnalyticsDashboard from './AnalyticsDashboard';
import TemplateLibrary from './TemplateLibrary';
import SmartSuggestions from './SmartSuggestions';
import PublishingPanel from './PublishingPanel';
import ThemeManager from './ThemeManager';
import CollaborationPanel from './CollaborationPanel';
import AISettings from './AISettings';
import GamificationPanel from './GamificationPanel';
import OfflineSyncManager from './OfflineSyncManager';
import AccessibilityChecker from './AccessibilityChecker';
import LearningObjectRepository from './LearningObjectRepository';
import QuestionBank from './QuestionBank';
import { autoSaveProject, saveProject } from '../utils/projectStorage';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Editor({ project, onBack }) {
  const [currentPage, setCurrentPage] = useState(project.pages[0]);
  const [blocks, setBlocks] = useState(currentPage.content || []);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [activeTab, setActiveTab] = useState('properties');
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [showPublishingPanel, setShowPublishingPanel] = useState(false);
  const [showLearningObjectRepo, setShowLearningObjectRepo] = useState(false);
  const [showQuestionBank, setShowQuestionBank] = useState(false);

  // Auto-save project when blocks change
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (project && blocks.length > 0) {
        const updatedProject = {
          ...project,
          pages: project.pages.map(page =>
            page.id === currentPage.id ? { ...page, content: blocks } : page
          ),
          lastAutoSave: new Date().toISOString()
        };
        
        if (autoSaveProject(updatedProject)) {
          setAutoSaveStatus('✓ Auto-saved');
          setTimeout(() => setAutoSaveStatus(''), 3000);
        }
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [blocks, currentPage, project]);

  const handleAddBlock = useCallback((type) => {
    let newBlock = {
      id: Date.now(),
      type,
      content: '',
      alt: '',
      title: '',
      url: ''
    };

    // Initialize with appropriate default properties based on type
    switch(type) {
      case 'knowledge-check':
        newBlock = {
          ...newBlock,
          question: 'Enter question here',
          questionType: 'multiple-choice', // Default to multiple choice
          options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
          correctAnswer: 0,
          feedback: '',
          correctFeedback: 'Correct!',
          incorrectFeedback: 'Please try again.'
        };
        break;
      case 'drag-and-drop':
        newBlock = {
          ...newBlock,
          question: 'Drag the items to the correct targets',
          questionType: 'drag-and-drop',
          items: [
            { id: 'item1', content: 'Item 1' },
            { id: 'item2', content: 'Item 2' },
            { id: 'item3', content: 'Item 3' }
          ],
          targets: [
            { id: 'target1', label: 'Target 1' },
            { id: 'target2', label: 'Target 2' },
            { id: 'target3', label: 'Target 3' }
          ],
          correctMapping: {
            'target1': 'item1',
            'target2': 'item2',
            'target3': 'item3'
          },
          correctFeedback: 'Perfect! All items matched correctly.',
          incorrectFeedback: 'Some matches need correction.'
        };
        break;
      case 'hotspot':
        newBlock = {
          ...newBlock,
          question: 'Click on the correct area in the image',
          questionType: 'hotspot',
          imageUrl: '',
          alt: 'Interactive image',
          hotspots: [
            { id: 'hotspot1', top: 20, left: 30, width: 15, height: 15 },
            { id: 'hotspot2', top: 50, left: 60, width: 15, height: 15 }
          ],
          correctHotspot: 'hotspot1',
          correctFeedback: 'Correct! You identified the right area.',
          incorrectFeedback: 'Incorrect. Please try again.'
        };
        break;
      case 'advanced-question':
        newBlock = {
          ...newBlock,
          question: 'Enter question here',
          answer: '',
          explanation: ''
        };
        break;
      case 'branching-scenario':
        newBlock = {
          ...newBlock,
          scenario: 'Describe the scenario here',
          paths: [
            { choice: 'Choice 1', outcome: 'What happens if they choose this' },
            { choice: 'Choice 2', outcome: 'What happens if they choose this' }
          ]
        };
        break;
      case 'heading':
        newBlock = { ...newBlock, content: 'New Heading' };
        break;
      case 'text':
        newBlock = { ...newBlock, content: 'New text content' };
        break;
      default:
        newBlock = { ...newBlock, content: `New ${type}` };
    }
    
    if (type === 'interactive-video') {
      newBlock = {
        ...newBlock,
        type: 'interactive-video',
        title: 'Interactive Video',
        url: '', // Video URL
        description: 'Interactive video description',
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
      };
    }
    }

    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
  }, [blocks]);

  const handleUpdateBlock = useCallback((blockId, updates) => {
    setBlocks(blocks.map(block =>
      block.id === blockId ? { ...block, ...updates } : block
    ));
  }, [blocks]);

  const handleUpdateProject = useCallback((updatedProject) => {
    // Update the project in the parent state
    setCurrentProject(updatedProject);
    // Save the updated project
    saveProject(updatedProject);
  }, []);

  const handleDeleteBlock = useCallback((blockId) => {
    setBlocks(blocks.filter(block => block.id !== blockId));
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  }, [blocks, selectedBlockId]);

  const handleMoveBlock = useCallback((fromIndex, toIndex) => {
    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, movedBlock);
    setBlocks(newBlocks);
  }, [blocks]);

  const handleGenerateSite = async () => {
    try {
      setIsGenerating(true);
      setMessage('');

      const updatedPages = project.pages.map(page =>
        page.id === currentPage.id ? { ...page, content: blocks } : page
      );

      const response = await axios.post(`${API_URL}/api/generate/site`, {
        projectName: project.name,
        pages: updatedPages
      });

      setMessage(`✓ Site generated successfully! View at: ${response.data.path}`);
    } catch (error) {
      setMessage(`✗ Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyTemplate = useCallback((template) => {
    // Apply the template blocks to the current page
    setBlocks(template.blocks);
    
    // Optionally apply color scheme (would need to be implemented in the backend)
    // For now, just apply the content blocks
    console.log('Applying template:', template);
  }, []);

  const handleSuggestionAccept = useCallback((suggestion) => {
    // Create a new block based on the suggestion
    const newBlock = {
      id: Date.now(),
      type: suggestion.type,
      content: suggestion.content || '',
      question: suggestion.question || '',
      questionType: suggestion.questionType || 'multiple-choice',
      options: suggestion.options || [],
      correctAnswer: suggestion.correctAnswer !== undefined ? suggestion.correctAnswer : 0,
      alt: '',
      title: '',
      url: ''
    };

    // Add the new block to the current page
    setBlocks([...blocks, newBlock]);
  }, [blocks]);

  const handleInsertLearningObject = useCallback((object) => {
    // Create a new block based on the learning object
    let newBlock = {
      id: Date.now(),
      alt: object.description,
      title: object.title,
      url: object.url
    };

    // Determine block type based on object type
    switch(object.type) {
      case 'image':
        newBlock.type = 'image';
        break;
      case 'video':
        newBlock.type = 'video';
        break;
      case 'document':
        newBlock.type = 'text';
        newBlock.content = `<a href="${object.url}" target="_blank">${object.title}</a> - ${object.description}`;
        break;
      case 'scorm':
        newBlock.type = 'text';
        newBlock.content = `<iframe src="${object.url}" width="100%" height="400px"></iframe>`;
        break;
      default:
        newBlock.type = 'text';
        newBlock.content = `[Learning Object: ${object.title}] ${object.description}`;
    }

    setBlocks([...blocks, newBlock]);
    setShowLearningObjectRepo(false);
  }, [blocks]);

  const handleInsertQuestion = useCallback((question) => {
    // Create a new assessment block based on the question
    const newBlock = {
      id: Date.now(),
      type: 'knowledge-check',
      question: question.question,
      questionType: question.type,
      options: question.options,
      correctAnswer: question.correctAnswer,
      feedback: question.explanation || '',
      correctFeedback: 'Correct!',
      incorrectFeedback: 'Please try again.',
      alt: '',
      title: '',
      url: ''
    };

    // For specific question types, set appropriate properties
    if (question.type === 'fill-in-the-blank') {
      newBlock.correctAnswer = question.correctAnswer;
    } else if (question.type === 'matching') {
      newBlock.items = question.items;
      newBlock.choices = question.choices;
      newBlock.correctAnswer = question.correctAnswer;
    }

    setBlocks([...blocks, newBlock]);
    setShowQuestionBank(false);
  }, [blocks]);

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  return (
    <div className="editor">
      <header className="editor-header" role="banner">
        <div className="header-left">
          <button 
            className="back-button"
            onClick={onBack}
            aria-label="Go back to projects"
          >
            ← Back
          </button>
          <h1>{project.name}</h1>
          {autoSaveStatus && (
            <span className="auto-save-status">{autoSaveStatus}</span>
          )}
        </div>
        <div className="header-right">
          {message && (
            <div 
              className={`message ${message.includes('✓') ? 'success' : 'error'}`}
              role="status"
              aria-live="polite"
            >
              {message}
            </div>
          )}
          <button
            className="template-button"
            onClick={() => setShowTemplateLibrary(true)}
            aria-label="Apply a template to your course"
          >
            🎨 Templates
          </button>
          <button
            className="publish-button"
            onClick={() => setShowPublishingPanel(true)}
            aria-label="Publish your course"
          >
            🚀 Publish
          </button>
          <button
            className="repository-button"
            onClick={() => setShowLearningObjectRepo(true)}
            aria-label="Open learning object repository"
          >
            📚 Repository
          </button>
          <button
            className="questions-button"
            onClick={() => setShowQuestionBank(true)}
            aria-label="Open question bank"
          >
            ❓ Questions
          </button>
          <button
            className="preview-button"
            onClick={() => setIsPreviewOpen(true)}
            aria-label="Preview the course before exporting"
          >
            👁 Preview
          </button>
          <button
            className="generate-button"
            onClick={handleGenerateSite}
            disabled={isGenerating}
            aria-label="Export the course as a static website"
          >
            {isGenerating ? 'Exporting...' : '↓ Export Site'}
          </button>
        </div>
      </header>
      
      {showTemplateLibrary && (
        <TemplateLibrary
          onSelectTemplate={handleApplyTemplate}
          onClose={() => setShowTemplateLibrary(false)}
        />
      )}
      
      {showPublishingPanel && (
        <PublishingPanel
          project={{
            ...project,
            pages: project.pages.map(page => 
              page.id === currentPage.id 
                ? { ...page, content: blocks } 
                : page
            )
          }}
          onClose={() => setShowPublishingPanel(false)}
        />
      )}

      {showLearningObjectRepo && (
        <LearningObjectRepository
          isOpen={showLearningObjectRepo}
          onClose={() => setShowLearningObjectRepo(false)}
          onInsertObject={handleInsertLearningObject}
        />
      )}

      {showQuestionBank && (
        <QuestionBank
          isOpen={showQuestionBank}
          onClose={() => setShowQuestionBank(false)}
          onInsertQuestion={handleInsertQuestion}
        />
      )}

      <div className="editor-content">
        <Toolbar onAddBlock={handleAddBlock} />
        <div className="main-content-area">
          <div className="canvas-and-tracker">
            <ProgressTracker 
              project={project} 
              currentPage={currentPage} 
              blocks={blocks} 
              onBlockChange={setBlocks}
            />
            <Canvas
              blocks={blocks}
              selectedBlockId={selectedBlockId}
              onSelectBlock={setSelectedBlockId}
              onDeleteBlock={handleDeleteBlock}
              onMoveBlock={handleMoveBlock}
              onUpdateBlock={handleUpdateBlock}
            />
          </div>
          <div className="sidebar-panel">
            <LearningPath
              project={project}
              currentPage={currentPage}
              blocks={blocks}
              onNavigate={(page) => {
                setCurrentPage(page);
                setBlocks(page.content || []);
              }}
            />
            <SmartSuggestions
              project={project}
              currentPage={currentPage}
              blocks={blocks}
              onSuggestionAccept={handleSuggestionAccept}
            />
            <ThemeManager
              project={project}
              onUpdateProject={handleUpdateProject}
            />
            <CollaborationPanel
              project={project}
              onCollaborationUpdate={() => {}}
            />
            <AISettings
              project={project}
              onUpdateProject={handleUpdateProject}
            />
            <GamificationPanel
              project={project}
              onUpdateProject={handleUpdateProject}
            />
            <OfflineSyncManager
              project={project}
              onUpdateProject={handleUpdateProject}
            />
            <AccessibilityChecker
              project={project}
              currentPage={currentPage}
              blocks={blocks}
            />
            <div className="panel-tabs">
              <button 
                className={`tab-button ${activeTab === 'properties' ? 'active' : ''}`}
                onClick={() => setActiveTab('properties')}
              >
                Properties
              </button>
              <button 
                className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </button>
            </div>
            <div className="panel-content">
              {activeTab === 'properties' && (
                <PropertiesPanel
                  block={selectedBlock}
                  onUpdateBlock={handleUpdateBlock}
                  onDelete={handleDeleteBlock}
                />
              )}
              {activeTab === 'analytics' && (
                <AnalyticsDashboard
                  project={project}
                  blocks={blocks}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        pages={project.pages.map(p => 
          p.id === currentPage.id ? { ...p, content: blocks } : p
        )}
        projectName={project.name}
      />
    </div>
  );
}

export default Editor;
