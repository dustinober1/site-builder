# Advanced Content Blocks - Quick Reference

## New Block Types At a Glance

| Block Type | Icon | Purpose | Best For |
|-----------|------|---------|----------|
| **Knowledge Check** | ✓ | Multiple-choice questions | Quick comprehension tests |
| **Advanced Question** | ❓ | Open-ended questions | Critical thinking, essays |
| **Branching Scenario** | 🔀 | Choose-your-path scenarios | Decision-making practice |

---

## Quick Start

### Add a Knowledge Check
1. Click "✓" button in toolbar
2. Enter question in Properties Panel
3. Add options (click "+ Add Option")
4. Set correct answer (0, 1, 2, etc.)
5. Done! Preview shows in canvas

### Add an Advanced Question
1. Click "❓" button in toolbar
2. Enter question in Properties Panel
3. Enter the answer (reference material)
4. Add explanation (optional)
5. Done! Preview shows first 100 characters

### Add a Branching Scenario
1. Click "🔀" button in toolbar
2. Enter scenario description
3. Add paths (click "+ Add Path")
4. For each path: enter choice and outcome
5. Done! Preview shows all paths

---

## Block Properties

### Knowledge Check Properties
```
Question:       The question text
Options:        Array of answer choices
Correct Answer: Index of correct option (0-based)
Feedback:       Message shown to learner (optional)
```

### Advanced Question Properties
```
Question:     The question text
Answer:       Detailed answer (reference)
Explanation:  Why this question matters (optional)
```

### Branching Scenario Properties
```
Scenario:  The situation and decision
Paths:     Array of:
           - Choice: What the learner can choose
           - Outcome: What happens
```

---

## Actions for Each Block

| Action | How | Notes |
|--------|-----|-------|
| **Select** | Click the block | Shows properties on right |
| **Edit** | Modify in Properties Panel | Auto-saves |
| **Move Up** | Click ↑ button | Moves before previous block |
| **Move Down** | Click ↓ button | Moves after next block |
| **Delete** | Click ✕ button | No undo - confirm deletion |
| **Scroll** | Mouse wheel or arrow keys | See content while editing |

---

## Common Patterns

### Pattern 1: Quiz After Content
```
[Heading] Topic Name
[Text] Educational content
[Video] Supporting material
[Knowledge Check] Test understanding
```

### Pattern 2: Discussion Prompt
```
[Heading] Complex Topic
[Text] Case study or scenario
[Advanced Question] Reflect and respond
```

### Pattern 3: Decision Practice
```
[Heading] Workplace Scenario
[Text] Set the context
[Branching Scenario] Make a choice
[Text] Debrief the outcomes
```

---

## Tips & Tricks

### Knowledge Checks
✓ Mix 3-5 options  
✓ Randomize correct answer position  
✓ Write clear, precise questions  
✓ Make wrong answers plausible  
✓ Provide helpful feedback  
✓ Test one concept per question  

### Advanced Questions
✓ Start with "Why," "How," "What if"  
✓ Connect to real situations  
✓ Allow space for thinking  
✓ Provide detailed answer reference  
✓ Make explanation meaningful  

### Branching Scenarios
✓ Start with realistic situation  
✓ Include 2-4 paths typically  
✓ Show consequences clearly  
✓ Avoid obvious right/wrong  
✓ Make outcomes substantive  
✓ Consider multiple valid approaches  

---

## Scrolling Your Page

Your course canvas is fully scrollable:

- **Scroll Up/Down**: Use mouse wheel or arrow keys
- **Touch Scroll**: Swipe on tablets/mobile
- **Keyboard Navigation**: Page Up/Down
- **Always Accessible**: Properties panel stays visible

This lets you develop large courses with many blocks!

---

## Block Type Decision Tree

```
What do you want to create?

├─ Test if learners understood?
│  └─ Use: Knowledge Check ✓
│
├─ Encourage deep thinking?
│  └─ Use: Advanced Question ❓
│
├─ Practice decision-making?
│  └─ Use: Branching Scenario 🔀
│
├─ Provide information?
│  └─ Use: Text or Heading
│
├─ Show visual content?
│  └─ Use: Image or Video
│
└─ Still not sure?
   └─ Try combining multiple blocks!
```

---

## Examples

### Knowledge Check Example
```
Question: What is the first step in the conservation process?
Options:
  - Assess the current situation (CORRECT)
  - Implement changes immediately
  - Report to management
  - Wait for more information
Feedback: "Yes! Assessment is crucial before action."
```

### Advanced Question Example
```
Question: How would you approach a conservation challenge
          you've never faced before?
Answer: [Detailed methodology provided]
Explanation: This teaches problem-solving approach
             rather than just facts.
```

### Branching Scenario Example
```
Scenario: You discover a team member isn't following
          conservation guidelines. What do you do?

Path 1: Address directly with the person
Outcome: Respectful conversation improves behavior,
         relationship maintained.

Path 2: Report to manager immediately
Outcome: Manager investigates, policy enforced,
         but colleague may feel uncomfortable.

Path 3: Ignore it
Outcome: Non-compliance continues, others may
         follow the poor example.
```

---

## File Storage

New blocks store in your project like other blocks:

```javascript
{
  id: 1702632000000,
  type: "knowledge-check",
  question: "What is...",
  options: ["A", "B", "C"],
  correctAnswer: 1,
  feedback: "Correct!"
}
```

All blocks automatically save every 2 seconds!

---

## Auto-Save Behavior

- ✓ Changes save every 2 seconds automatically
- ✓ All blocks saved: Knowledge Checks, Advanced Questions, Scenarios
- ✓ "Auto-saved" indicator appears in editor
- ✓ No manual save needed
- ✓ Changes persist across browser closes

---

## Preview & Export

### In Preview:
- See all blocks as they'll appear
- Click through scenarios
- Answer knowledge checks
- See your course structure

### In Export:
- All blocks included in export
- Knowledge checks with correct answers
- Scenarios with all paths
- Full 508 accessibility

---

## Troubleshooting

**Q: My block isn't saving**  
A: Check browser console for errors. All saves happen automatically.

**Q: Options won't display in knowledge check**  
A: Make sure you've added options with "+ Add Option" button.

**Q: Can't edit a branching scenario path**  
A: Click the path you want to edit. Look for editable fields.

**Q: Scroll isn't working**  
A: Try using arrow keys. Works on all browsers.

**Q: Getting errors when deleting blocks**  
A: Refresh the page and try again. Your work is auto-saved.

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Scroll down | Arrow Down or Page Down |
| Scroll up | Arrow Up or Page Up |
| Focus block | Tab to block, Enter to select |
| Delete block | Select, then Delete key |
| Move block | Select, click arrow buttons |

---

## Accessibility Features

✓ Full keyboard navigation  
✓ ARIA labels on all controls  
✓ Semantic HTML structure  
✓ Color-blind friendly  
✓ Screen reader compatible  
✓ 508 compliant  
✓ WCAG 2.1 AA standards  

---

**Created**: 2024  
**Version**: 1.0  
**Status**: Ready to Use
