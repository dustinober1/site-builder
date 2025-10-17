import React, { useState, useCallback } from 'react';
import './Editor.css';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import PropertiesPanel from './PropertiesPanel';
import PreviewModal from './PreviewModal';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Editor({ project, onBack }) {
  const [currentPage, setCurrentPage] = useState(project.pages[0]);
  const [blocks, setBlocks] = useState(currentPage.content || []);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleAddBlock = useCallback((type) => {
    const newBlock = {
      id: Date.now(),
      type,
      content: `New ${type}`,
      alt: '',
      title: '',
      url: ''
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
  }, [blocks]);

  const handleUpdateBlock = useCallback((blockId, updates) => {
    setBlocks(blocks.map(block =>
      block.id === blockId ? { ...block, ...updates } : block
    ));
  }, [blocks]);

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

      <div className="editor-content">
        <Toolbar onAddBlock={handleAddBlock} />
        <Canvas
          blocks={blocks}
          selectedBlockId={selectedBlockId}
          onSelectBlock={setSelectedBlockId}
          onDeleteBlock={handleDeleteBlock}
          onMoveBlock={handleMoveBlock}
        />
        <PropertiesPanel
          block={selectedBlock}
          onUpdateBlock={handleUpdateBlock}
          onDelete={handleDeleteBlock}
        />
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
