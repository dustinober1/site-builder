import React, { useState, useCallback, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import './Editor.css';

// Import sub-components
import EditorHeader from './EditorHeader';
import EditorContent from './EditorContent';
import EditorModals from './EditorModals';

// Import custom hooks
import { useAutoSave } from './useAutoSave';
import { useVersionHistory } from './useVersionHistory';

// Import utilities
import { autoSaveProject } from '../../utils/projectStorage';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Main Editor Component
 * Refactored for better maintainability and testability
 */
const Editor = memo(function Editor({ project, onBack }) {
  // State
  const [currentPage, setCurrentPage] = useState(project.pages[0]);
  const [blocks, setBlocks] = useState(currentPage.content || []);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('properties');

  // UI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');

  // Modal State
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [showPublishingPanel, setShowPublishingPanel] = useState(false);
  const [showLearningObjectRepo, setShowLearningObjectRepo] = useState(false);
  const [showQuestionBank, setShowQuestionBank] = useState(false);

  // Progress Modal State
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressTitle, setProgressTitle] = useState('');
  const [progressMessage, setProgressMessage] = useState('');
  const [progressValue, setProgressValue] = useState(0);
  const [progressStatus, setProgressStatus] = useState('processing');

  // Custom hooks
  const { showVersionHistory, projectVersions, handleRestoreVersion, toggleVersionHistory } =
    useVersionHistory(project);

  const handleAutoSave = useCallback((updatedProject) => {
    if (autoSaveProject(updatedProject)) {
      setAutoSaveStatus('✓ Auto-saved');
      setTimeout(() => setAutoSaveStatus(''), 3000);
    }
  }, []);

  useAutoSave(project, blocks, currentPage, handleAutoSave);

  // Get selected block
  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  // Update project
  const handleUpdateProject = useCallback((updatedProject) => {
    setCurrentPage(updatedProject.pages.find(p => p.id === currentPage.id));
  }, [currentPage.id]);

  // Add block handler
  const handleAddBlock = useCallback((type) => {
    const newBlock = {
      id: Date.now(),
      type,
      content: '',
      alt: '',
      title: '',
      url: ''
    };

    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id);
  }, []);

  // Update block handler
  const handleUpdateBlock = useCallback((blockId, updates) => {
    setBlocks(prev =>
      prev.map(block =>
        block.id === blockId ? { ...block, ...updates } : block
      )
    );
  }, []);

  // Delete block handler
  const handleDeleteBlock = useCallback((blockId) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  }, [selectedBlockId]);

  // Move block handler
  const handleMoveBlock = useCallback((fromIndex, toIndex) => {
    setBlocks(prev => {
      const newBlocks = [...prev];
      const [removed] = newBlocks.splice(fromIndex, 1);
      newBlocks.splice(toIndex, 0, removed);
      return newBlocks;
    });
  }, []);

  // Apply template handler
  const handleApplyTemplate = useCallback((template) => {
    setBlocks(template.blocks || []);
    setShowTemplateLibrary(false);
  }, []);

  // Suggestion acceptance handler
  const handleSuggestionAccept = useCallback((suggestion) => {
    const newBlock = {
      id: Date.now(),
      type: suggestion.type,
      content: suggestion.content || '',
      question: suggestion.question || '',
      alt: '',
      title: '',
      url: ''
    };
    setBlocks(prev => [...prev, newBlock]);
  }, []);

  // Insert learning object handler
  const handleInsertLearningObject = useCallback((object) => {
    const newBlock = {
      id: Date.now(),
      type: object.type === 'image' ? 'image' : 'text',
      alt: object.description,
      title: object.title,
      url: object.url,
      content: object.type === 'document' ? `<a href="${object.url}" target="_blank">${object.title}</a>` : ''
    };
    setBlocks(prev => [...prev, newBlock]);
    setShowLearningObjectRepo(false);
  }, []);

  // Insert question handler
  const handleInsertQuestion = useCallback((question) => {
    const newBlock = {
      id: Date.now(),
      type: 'knowledge-check',
      question: question.question,
      questionType: question.type || 'multiple-choice',
      options: question.options || [],
      correctAnswer: question.correctAnswer || 0,
      alt: '',
      title: '',
      url: ''
    };
    setBlocks(prev => [...prev, newBlock]);
    setShowQuestionBank(false);
  }, []);

  // Generate site handler
  const handleGenerateSite = useCallback(async () => {
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
      const errorMessage = error.response?.data?.error || error.message;
      let detailedMessage = `Error: ${errorMessage}`;
      let hint = '';

      if (errorMessage.toLowerCase().includes('network error')) {
        hint = 'Make sure the backend server is running and accessible';
      }

      setMessage(`✗ ${detailedMessage}`);
      console.error('Error generating site:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [project, currentPage, blocks]);

  return (
    <div className="editor">
      <EditorHeader
        project={project}
        autoSaveStatus={autoSaveStatus}
        message={message}
        isGenerating={isGenerating}
        onBack={onBack}
        onShowTemplateLibrary={() => setShowTemplateLibrary(true)}
        onShowVersionHistory={toggleVersionHistory}
        onGenerateSite={handleGenerateSite}
      />

      <EditorContent
        currentPage={currentPage}
        blocks={blocks}
        selectedBlock={selectedBlock}
        activeTab={activeTab}
        onSetCurrentPage={setCurrentPage}
        onSetBlocks={setBlocks}
        onSetSelectedBlockId={setSelectedBlockId}
        onAddBlock={handleAddBlock}
        onUpdateBlock={handleUpdateBlock}
        onDeleteBlock={handleDeleteBlock}
        onMoveBlock={handleMoveBlock}
        onSetActiveTab={setActiveTab}
        onShowPreview={() => setIsPreviewOpen(true)}
        onShowPublishingPanel={() => setShowPublishingPanel(true)}
        onShowLearningObjectRepo={() => setShowLearningObjectRepo(true)}
        onShowQuestionBank={() => setShowQuestionBank(true)}
        onUpdateProject={handleUpdateProject}
        onSuggestionAccept={handleSuggestionAccept}
      />

      <EditorModals
        showTemplateLibrary={showTemplateLibrary}
        showVersionHistory={showVersionHistory}
        showPublishingPanel={showPublishingPanel}
        showLearningObjectRepo={showLearningObjectRepo}
        showQuestionBank={showQuestionBank}
        showProgressModal={showProgressModal}
        isPreviewOpen={isPreviewOpen}
        progressTitle={progressTitle}
        progressMessage={progressMessage}
        progressValue={progressValue}
        progressStatus={progressStatus}
        project={project}
        currentPage={currentPage}
        blocks={blocks}
        projectVersions={projectVersions}
        onCloseTemplateLibrary={() => setShowTemplateLibrary(false)}
        onCloseVersionHistory={() => toggleVersionHistory()}
        onClosePublishingPanel={() => setShowPublishingPanel(false)}
        onCloseLearningObjectRepo={() => setShowLearningObjectRepo(false)}
        onCloseQuestionBank={() => setShowQuestionBank(false)}
        onCloseProgressModal={() => setShowProgressModal(false)}
        onClosePreview={() => setIsPreviewOpen(false)}
        onApplyTemplate={handleApplyTemplate}
        onRestoreVersion={handleRestoreVersion}
        onInsertLearningObject={handleInsertLearningObject}
        onInsertQuestion={handleInsertQuestion}
      />
    </div>
  );
});

Editor.displayName = 'Editor';

Editor.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    pages: PropTypes.arrayOf(PropTypes.object).isRequired
  }).isRequired,
  onBack: PropTypes.func.isRequired
};

export default Editor;
