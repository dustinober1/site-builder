import React, { useState, useEffect } from 'react';
import './LearningObjectRepository.css';

function LearningObjectRepository({ isOpen, onClose, onInsertObject }) {
  const [objects, setObjects] = useState([]);
  const [filteredObjects, setFilteredObjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    description: '',
    category: 'image',
    tags: '',
    learningObjective: '',
    difficulty: 'beginner',
    competency: ''
  });

  // Sample learning objects data
  const sampleObjects = [
    {
      id: 1,
      title: 'Learning Object 1',
      type: 'image',
      url: '/uploads/sample-image1.jpg',
      description: 'Sample training image for orientation',
      category: 'image',
      tags: ['orientation', 'safety'],
      learningObjective: 'Understand safety protocols',
      competency: 'Safety Management',
      difficulty: 'beginner',
      createdAt: '2025-01-15',
      fileSize: '1.2MB'
    },
    {
      id: 2,
      title: 'Training Video 1',
      type: 'video',
      url: '/uploads/sample-video1.mp4',
      description: 'Introduction to workplace safety',
      category: 'video',
      tags: ['safety', 'training'],
      learningObjective: 'Know safety procedures',
      competency: 'Safety Compliance',
      difficulty: 'beginner',
      createdAt: '2025-01-20',
      fileSize: '15.4MB'
    },
    {
      id: 3,
      title: 'Handbook Document',
      type: 'document',
      url: '/uploads/handbook.pdf',
      description: 'Employee handbook and policies',
      category: 'document',
      tags: ['policies', 'handbook'],
      learningObjective: 'Understand company policies',
      competency: 'Compliance',
      difficulty: 'intermediate',
      createdAt: '2025-01-22',
      fileSize: '2.3MB'
    },
    {
      id: 4,
      title: 'Interactive Module',
      type: 'scorm',
      url: '/uploads/module1.scorm',
      description: 'Interactive compliance training',
      category: 'scorm',
      tags: ['compliance', 'interactive'],
      learningObjective: 'Complete compliance training',
      competency: 'Regulatory Compliance',
      difficulty: 'intermediate',
      createdAt: '2025-01-25',
      fileSize: '8.7MB'
    }
  ];

  useEffect(() => {
    // In a real implementation, this would fetch from an API
    setObjects(sampleObjects);
    setFilteredObjects(sampleObjects);
  }, []);

  useEffect(() => {
    let result = objects;

    if (searchTerm) {
      result = result.filter(obj => 
        obj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obj.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obj.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter(obj => obj.category === selectedCategory);
    }

    setFilteredObjects(result);
  }, [searchTerm, selectedCategory, objects]);

  const handleUpload = (e) => {
    e.preventDefault();
    // In a real implementation, this would upload to server
    alert('File upload functionality would be implemented here');
    setUploadFormData({
      title: '',
      description: '',
      category: 'image',
      tags: '',
      learningObjective: '',
      difficulty: 'beginner',
      competency: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUploadFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInsertObject = (object) => {
    if (onInsertObject) {
      onInsertObject(object);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="repository-modal">
      <div className="repository-content">
        <div className="repository-header">
          <h2>Learning Object Repository</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="repository-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search learning objects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="category-filter">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
              <option value="scorm">SCORM Packages</option>
            </select>
          </div>
        </div>
        
        <div className="repository-body">
          <div className="repository-grid">
            {filteredObjects.map(obj => (
              <div key={obj.id} className="repository-item">
                <div className="item-preview">
                  {obj.type === 'image' && (
                    <img src={obj.url} alt={obj.title} />
                  )}
                  {obj.type === 'video' && (
                    <div className="video-preview">
                      <video controls width="100%" height="120px">
                        <source src={obj.url} type="video/mp4" />
                        Video preview
                      </video>
                    </div>
                  )}
                  {obj.type === 'document' && (
                    <div className="document-preview">
                      <div className="document-icon">📄</div>
                    </div>
                  )}
                  {obj.type === 'scorm' && (
                    <div className="scorm-preview">
                      <div className="scorm-icon">📚</div>
                    </div>
                  )}
                </div>
                
                <div className="item-details">
                  <h3>{obj.title}</h3>
                  <p className="item-description">{obj.description}</p>
                  
                  <div className="item-meta">
                    <div className="tags">
                      {obj.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                    
                    <div className="metadata">
                      <div className="objective">Objective: {obj.learningObjective}</div>
                      <div className="competency">Competency: {obj.competency}</div>
                      <div className="difficulty">Level: {obj.difficulty}</div>
                    </div>
                  </div>
                  
                  <div className="item-actions">
                    <button 
                      className="insert-button"
                      onClick={() => handleInsertObject(obj)}
                    >
                      Insert into Course
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="upload-section">
            <h3>Upload New Learning Object</h3>
            <form onSubmit={handleUpload} className="upload-form">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={uploadFormData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={uploadFormData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={uploadFormData.category}
                  onChange={handleInputChange}
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                  <option value="scorm">SCORM Package</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="tags">Tags (comma separated)</label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={uploadFormData.tags}
                  onChange={handleInputChange}
                  placeholder="safety, training, onboarding"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="learningObjective">Learning Objective</label>
                <input
                  type="text"
                  id="learningObjective"
                  name="learningObjective"
                  value={uploadFormData.learningObjective}
                  onChange={handleInputChange}
                  placeholder="What the learner will know"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="competency">Competency</label>
                <input
                  type="text"
                  id="competency"
                  name="competency"
                  value={uploadFormData.competency}
                  onChange={handleInputChange}
                  placeholder="Target competency"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="difficulty">Difficulty Level</label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={uploadFormData.difficulty}
                  onChange={handleInputChange}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="file">File Upload</label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  required
                />
              </div>
              
              <button type="submit" className="upload-button">
                Upload Learning Object
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearningObjectRepository;