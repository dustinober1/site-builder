import React, { useMemo } from 'react';
import { analyzeContentFlow, detectLearningGaps, mapObjectivesAlignment } from '../utils/pedagogicalAnalysis';
import './LearningFlowAnalyzer.css';

const LearningFlowAnalyzer = ({ blocks, objectives = [] }) => {
  const flowAnalysis = useMemo(() => analyzeContentFlow(blocks), [blocks]);
  const gaps = useMemo(() => detectLearningGaps(blocks, objectives), [blocks, objectives]);
  const alignment = useMemo(() => mapObjectivesAlignment(blocks, objectives), [blocks, objectives]);

  const getScoreClass = (score) => {
    if (score > 80) return 'score-high';
    if (score > 50) return 'score-med';
    return 'score-low';
  };

  return (
    <div className="learning-flow-analyzer">
      <h2>Pedagogical Analysis</h2>

      {/* Visual Timeline */}
      <div className="analyzer-section">
        <h3>Content Timeline</h3>
        <div className="timeline-container">
          {blocks.map((block, idx) => (
            <div 
              key={block.id || idx} 
              className={`timeline-segment segment-${block.type}`}
              style={{ width: `${100 / blocks.length}%` }}
              title={`${block.type}: ${block.content?.substring(0, 20)}...`}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem', justifyContent: 'center' }}>
          <span><i className="segment-text" style={{ display: 'inline-block', width: 10, height: 10 }}></i> Text</span>
          <span><i className="segment-interaction" style={{ display: 'inline-block', width: 10, height: 10 }}></i> Interaction</span>
          <span><i className="segment-assessment" style={{ display: 'inline-block', width: 10, height: 10 }}></i> Assessment</span>
        </div>
      </div>

      {/* Flow Dashboard */}
      <div className="analyzer-section">
        <h3>
          Flow Dashboard 
          <span className={`flow-score-badge ${getScoreClass(flowAnalysis.score)}`}>
            Score: {flowAnalysis.score}
          </span>
        </h3>
        {flowAnalysis.issues.length > 0 ? (
          <ul className="issue-list">
            {flowAnalysis.issues.map((issue, i) => (
              <li key={i} className="issue-item">{issue}</li>
            ))}
          </ul>
        ) : (
          <p>✅ Content flow looks logical and balanced.</p>
        )}
      </div>

      {/* Gap Detector */}
      <div className="analyzer-section">
        <h3>Gap Detector</h3>
        {gaps.length > 0 ? (
          <ul className="gap-list">
            {gaps.map((gap, i) => (
              <li key={i} className="gap-item">{gap}</li>
            ))}
          </ul>
        ) : (
          <p>✅ All learning objectives are addressed.</p>
        )}
      </div>

      {/* Objective Mapping */}
      <div className="analyzer-section">
        <h3>Objective Alignment ({alignment.coverage.toFixed(0)}%)</h3>
        <div className="mapping-grid">
          {alignment.mapping.map((map, i) => (
            <div key={i} className={`mapping-card ${map.isCovered ? 'covered' : 'uncovered'}`}>
              <strong>{map.objectiveTitle}</strong>
              <div style={{ fontSize: '0.85rem', marginTop: '5px' }}>
                Blocks: {map.blockCount} | Assessed: {map.isAssessed ? 'Yes' : 'No'}
              </div>
            </div>
          ))}
        </div>
        {alignment.unmappedBlocks > 0 && (
          <p style={{ color: '#856404', marginTop: '10px' }}>
            ⚠️ {alignment.unmappedBlocks} block(s) are not linked to any objective.
          </p>
        )}
      </div>
    </div>
  );
};

export default LearningFlowAnalyzer;
