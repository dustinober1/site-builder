/**
 * Path Validator to ensure no dead ends in branching scenarios.
 */

/**
 * Validates the course structure for dead ends and unreachable blocks.
 * @param {Array} blocks - The course content blocks.
 * @returns {Object} Validation results with errors and warnings.
 */
export const validatePaths = (blocks) => {
  const errors = [];
  const warnings = [];
  const blockMap = new Map(blocks.map(b => [b.id, b]));
  const visited = new Set();

  if (blocks.length === 0) return { errors: ['Course is empty'], warnings: [] };

  // Start from the first block
  const traverse = (blockId) => {
    if (visited.has(blockId)) return;
    visited.add(blockId);

    const block = blockMap.get(blockId);
    if (!block) return;

    // Check for branching logic
    if (block.branches && block.branches.length > 0) {
      block.branches.forEach(branch => {
        if (!branch.targetId) {
          errors.push(`Block "${block.id}" has a branch with no target.`);
        } else if (!blockMap.has(branch.targetId)) {
          errors.push(`Block "${block.id}" branches to non-existent block "${branch.targetId}".`);
        } else {
          traverse(branch.targetId);
        }
      });
    } else if (block.nextBlockId) {
      // Linear progression
      if (!blockMap.has(block.nextBlockId)) {
        errors.push(`Block "${block.id}" points to non-existent next block "${block.nextBlockId}".`);
      } else {
        traverse(block.nextBlockId);
      }
    } else {
      // Potential end of course or dead end
      const isLastBlock = blocks[blocks.length - 1].id === block.id;
      if (!isLastBlock && !block.isEndBlock) {
        warnings.push(`Block "${block.id}" is not marked as an end block but has no outgoing paths.`);
      }
    }
  };

  traverse(blocks[0].id);

  // Check for unreachable blocks
  blocks.forEach(block => {
    if (!visited.has(block.id)) {
      warnings.push(`Block "${block.id}" is unreachable from the start.`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};
