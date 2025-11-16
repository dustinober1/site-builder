import React from 'react';
import PropTypes from 'prop-types';

// Import modal components
import PreviewModal from '../PreviewModal';
import ProgressModal from '../ProgressModal';
import TemplateLibrary from '../TemplateLibrary';
import VersionHistory from '../VersionHistory';
import PublishingPanel from '../PublishingPanel';
import LearningObjectRepository from '../LearningObjectRepository';
import QuestionBank from '../QuestionBank';

/**
 * Editor Modals Component
 * Centralized modal rendering
 */
function EditorModals({
  showTemplateLibrary,
  showVersionHistory,
  showPublishingPanel,
  showLearningObjectRepo,
  showQuestionBank,
  showProgressModal,
  isPreviewOpen,
  progressTitle,
  progressMessage,
  progressValue,
  progressStatus,
  project,
  currentPage,
  blocks,
  projectVersions,
  onCloseTemplateLibrary,
  onCloseVersionHistory,
  onClosePublishingPanel,
  onCloseLearningObjectRepo,
  onCloseQuestionBank,
  onCloseProgressModal,
  onClosePreview,
  onApplyTemplate,
  onRestoreVersion,
  onInsertLearningObject,
  onInsertQuestion
}) {
  return (
    <>
      {showTemplateLibrary && (
        <TemplateLibrary
          onSelectTemplate={onApplyTemplate}
          onClose={onCloseTemplateLibrary}
        />
      )}

      {showVersionHistory && (
        <VersionHistory
          isOpen={showVersionHistory}
          onClose={onCloseVersionHistory}
          versions={projectVersions}
          onRestore={onRestoreVersion}
          projectName={project.name}
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
          onClose={onClosePublishingPanel}
        />
      )}

      {showLearningObjectRepo && (
        <LearningObjectRepository
          isOpen={showLearningObjectRepo}
          onClose={onCloseLearningObjectRepo}
          onInsertObject={onInsertLearningObject}
        />
      )}

      {showQuestionBank && (
        <QuestionBank
          isOpen={showQuestionBank}
          onClose={onCloseQuestionBank}
          onInsertQuestion={onInsertQuestion}
        />
      )}

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={onClosePreview}
        pages={project.pages.map(p =>
          p.id === currentPage.id ? { ...p, content: blocks } : p
        )}
        projectName={project.name}
      />

      <ProgressModal
        isOpen={showProgressModal}
        onClose={onCloseProgressModal}
        title={progressTitle}
        message={progressMessage}
        progress={progressValue}
        status={progressStatus}
      />
    </>
  );
}

EditorModals.propTypes = {
  showTemplateLibrary: PropTypes.bool,
  showVersionHistory: PropTypes.bool,
  showPublishingPanel: PropTypes.bool,
  showLearningObjectRepo: PropTypes.bool,
  showQuestionBank: PropTypes.bool,
  showProgressModal: PropTypes.bool,
  isPreviewOpen: PropTypes.bool,
  progressTitle: PropTypes.string,
  progressMessage: PropTypes.string,
  progressValue: PropTypes.number,
  progressStatus: PropTypes.string,
  project: PropTypes.object.isRequired,
  currentPage: PropTypes.object.isRequired,
  blocks: PropTypes.arrayOf(PropTypes.object).isRequired,
  projectVersions: PropTypes.arrayOf(PropTypes.object),
  onCloseTemplateLibrary: PropTypes.func.isRequired,
  onCloseVersionHistory: PropTypes.func.isRequired,
  onClosePublishingPanel: PropTypes.func.isRequired,
  onCloseLearningObjectRepo: PropTypes.func.isRequired,
  onCloseQuestionBank: PropTypes.func.isRequired,
  onCloseProgressModal: PropTypes.func.isRequired,
  onClosePreview: PropTypes.func.isRequired,
  onApplyTemplate: PropTypes.func.isRequired,
  onRestoreVersion: PropTypes.func.isRequired,
  onInsertLearningObject: PropTypes.func.isRequired,
  onInsertQuestion: PropTypes.func.isRequired
};

export default EditorModals;
