import React from 'react';
import PropTypes from 'prop-types';

// Import components
import Toolbar from '../Toolbar';
import Canvas from '../Canvas';
import PropertiesPanel from '../PropertiesPanel';
import ProgressTracker from '../ProgressTracker';
import LearningPath from '../LearningPath';
import SmartSuggestions from '../SmartSuggestions';
import ThemeManager from '../ThemeManager';
import CollaborationPanel from '../CollaborationPanel';
import AISettings from '../AISettings';
import GamificationPanel from '../GamificationPanel';
import OfflineSyncManager from '../OfflineSyncManager';
import AccessibilityChecker from '../AccessibilityChecker';
import AnalyticsDashboard from '../AnalyticsDashboard';
import LearningFlowAnalyzer from '../LearningFlowAnalyzer';
import TemplateLibrary from '../TemplateLibrary';
import LearningObjectRepository from '../LearningObjectRepository';
import QuestionBank from '../QuestionBank';
import VersionHistory from '../VersionHistory';
import PublishingPanel from '../PublishingPanel';

/**
 * Editor Content Component
 * Main content area with canvas, sidebar, and panels
 */
function EditorContent({
  currentPage,
  blocks,
  selectedBlock,
  activeTab,
  onSetCurrentPage,
  onSetBlocks,
  onSetSelectedBlockId,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  onMoveBlock,
  onSetActiveTab,
  onShowPreview,
  onShowPublishingPanel,
  onShowLearningObjectRepo,
  onShowQuestionBank,
  onUpdateProject,
  onSuggestionAccept,
  project
}) {
  return (
    <div className="editor-content">
      <Toolbar onAddBlock={onAddBlock} />
      <div className="main-content-area">
        <div className="canvas-and-tracker">
          <ProgressTracker
            project={project}
            currentPage={currentPage}
            blocks={blocks}
            onBlockChange={onSetBlocks}
          />
          <Canvas
            blocks={blocks}
            selectedBlockId={selectedBlock?.id || null}
            onSelectBlock={onSetSelectedBlockId}
            onDeleteBlock={onDeleteBlock}
            onMoveBlock={onMoveBlock}
            onUpdateBlock={onUpdateBlock}
          />
        </div>
        <div className="sidebar-panel">
          <LearningPath
            project={project}
            currentPage={currentPage}
            blocks={blocks}
            onNavigate={(page) => {
              onSetCurrentPage(page);
              onSetBlocks(page.content || []);
            }}
          />
          <SmartSuggestions
            project={project}
            currentPage={currentPage}
            blocks={blocks}
            onSuggestionAccept={onSuggestionAccept}
          />
          <ThemeManager
            project={project}
            onUpdateProject={onUpdateProject}
          />
          <CollaborationPanel
            project={project}
            onCollaborationUpdate={() => {}}
          />
          <AISettings
            project={project}
            onUpdateProject={onUpdateProject}
          />
          <GamificationPanel
            project={project}
            onUpdateProject={onUpdateProject}
          />
          <OfflineSyncManager
            project={project}
            onUpdateProject={onUpdateProject}
          />
          <AccessibilityChecker
            project={project}
            currentPage={currentPage}
            blocks={blocks}
          />
          <div className="panel-tabs">
            <button
              className={`tab-button ${activeTab === 'properties' ? 'active' : ''}`}
              onClick={() => onSetActiveTab('properties')}
            >
              Properties
            </button>
            <button
              className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => onSetActiveTab('analytics')}
            >
              Analytics
            </button>
            <button
              className={`tab-button ${activeTab === 'pedagogy' ? 'active' : ''}`}
              onClick={() => onSetActiveTab('pedagogy')}
            >
              Pedagogy
            </button>
          </div>
          <div className="panel-content">
            {activeTab === 'properties' && (
              <PropertiesPanel
                block={selectedBlock}
                onUpdateBlock={onUpdateBlock}
                onDelete={onDeleteBlock}
              />
            )}
            {activeTab === 'analytics' && (
              <AnalyticsDashboard
                project={project}
                blocks={blocks}
              />
            )}
            {activeTab === 'pedagogy' && (
              <LearningFlowAnalyzer
                blocks={blocks}
                objectives={project.objectives || []}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

EditorContent.propTypes = {
  currentPage: PropTypes.object.isRequired,
  blocks: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedBlock: PropTypes.object,
  activeTab: PropTypes.string.isRequired,
  onSetCurrentPage: PropTypes.func.isRequired,
  onSetBlocks: PropTypes.func.isRequired,
  onSetSelectedBlockId: PropTypes.func.isRequired,
  onAddBlock: PropTypes.func.isRequired,
  onUpdateBlock: PropTypes.func.isRequired,
  onDeleteBlock: PropTypes.func.isRequired,
  onMoveBlock: PropTypes.func.isRequired,
  onSetActiveTab: PropTypes.func.isRequired,
  onShowPreview: PropTypes.func.isRequired,
  onShowPublishingPanel: PropTypes.func.isRequired,
  onShowLearningObjectRepo: PropTypes.func.isRequired,
  onShowQuestionBank: PropTypes.func.isRequired,
  onUpdateProject: PropTypes.func.isRequired,
  onSuggestionAccept: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired
};

export default EditorContent;
