# Advanced Content Blocks - Documentation

## Overview

Your Site Builder now includes advanced content block types for creating interactive and engaging educational content. These new block types allow you to add knowledge checks, advanced questions, and branching scenarios to your courses.

---

## New Block Types

### 1. Knowledge Check ✓

**Purpose**: Test learner comprehension with multiple-choice questions.

**Features**:
- Question prompt
- Multiple choice options (up to unlimited)
- Correct answer designation
- Optional feedback message
- Learner immediately sees if answer is correct

**When to Use**:
- Assess understanding of key concepts
- Create quick quizzes between sections
- Reinforce learning through immediate feedback
- Track learner comprehension

**Example**:
```
Question: What is the capital of France?
Options:
  - London (incorrect)
  - Paris (correct)
  - Berlin (incorrect)
  - Madrid (incorrect)
Feedback: "Correct! Paris is known as the City of Light."
```

---

### 2. Advanced Question ❓

**Purpose**: Promote deeper thinking with open-ended questions requiring explanatory answers.

**Features**:
- Question prompt
- Detailed answer (for reference/instructor)
- Explanation/context
- Space for learner reflection
- Suitable for essays, case studies, discussions

**When to Use**:
- Encourage critical thinking
- Create case study questions
- Develop discussion prompts
- Promote application of concepts
- Build written communication skills

**Example**:
```
Question: How would you apply conservation principles in your organization?
Answer: [Detailed answer provided by instructor]
Explanation: This requires analysis of organizational context and conservation theory.
```

---

### 3. Branching Scenario 🔀

**Purpose**: Create interactive choose-your-own-path scenarios with consequences.

**Features**:
- Scenario description/context
- Multiple decision paths (2 or more)
- Each choice leads to a different outcome
- Demonstrates consequence of decisions
- Builds problem-solving skills

**When to Use**:
- Simulate real-world decision-making
- Create ethical dilemma scenarios
- Practice communication strategies
- Show cause-and-effect relationships
- Build scenario-based training

**Example**:
```
Scenario: "You discover a colleague violating company policy. What do you do?"
Path 1: "Report to management"
  Outcome: "This maintains company integrity, though the colleague loses trust."
Path 2: "Talk to colleague first"
  Outcome: "This preserves the relationship and may resolve the issue directly."
```

---

## How to Use Each Block Type

### Adding a Knowledge Check

1. **Click the Toolbar**: In the editor, locate the toolbar on the left
2. **Select "Knowledge Check"**: Click the "✓" button
3. **Enter Question**: In Properties Panel, enter your question
4. **Add Options**: 
   - Click "+ Add Option" button
   - Enter each answer choice
   - Repeat until you have all options (typically 3-5)
5. **Set Correct Answer**: 
   - Enter the index of the correct option (0 for first, 1 for second, etc.)
6. **Add Feedback (Optional)**: 
   - Enter feedback message that appears when answered
7. **Preview**: 
   - See your question in the canvas
   - Click to select and edit anytime

---

### Adding an Advanced Question

1. **Click the Toolbar**: Locate the toolbar on the left
2. **Select "Advanced Question"**: Click the "❓" button
3. **Enter Question**: In Properties Panel, enter your question
4. **Enter Answer**: Provide the detailed answer for reference
5. **Add Explanation (Optional)**: 
   - Add context or teaching notes
   - Explain why this question is important
6. **Preview**: 
   - See your question in the canvas
   - The first 100 characters of the answer display in preview

---

### Adding a Branching Scenario

1. **Click the Toolbar**: Locate the toolbar on the left
2. **Select "Branching Scenario"**: Click the "🔀" button
3. **Enter Scenario Description**: 
   - Set the context and decision to make
   - Make it engaging and realistic
4. **Add Decision Paths**:
   - Click "+ Add Path" button
   - Enter the choice/decision
   - Enter the outcome
   - Repeat for each path (typically 2-4 paths)
5. **Preview**: 
   - See your scenario in the canvas
   - All paths display in preview

---

## Best Practices

### Knowledge Checks
✓ Keep questions clear and concise  
✓ Avoid "trick" questions  
✓ Include plausible wrong answers (distractors)  
✓ Provide helpful feedback  
✓ Test one concept per question  
✓ Use 3-5 options typically  
✓ Vary correct answer position  

### Advanced Questions
✓ Make questions thought-provoking  
✓ Require analysis, synthesis, or evaluation  
✓ Provide context when needed  
✓ Explain why the question matters  
✓ Consider how to grade responses  
✓ Make answer detailed and specific  
✓ Avoid questions answerable with simple facts  

### Branching Scenarios
✓ Create realistic situations  
✓ Show meaningful consequences  
✓ Avoid "obvious" right/wrong answers  
✓ Teach decision-making, not just facts  
✓ Include 2-4 paths (more gets complex)  
✓ Make outcomes substantive  
✓ Consider multiple valid approaches  

---

## Page Scrolling

The course canvas is designed to be fully scrollable while you develop:

**Features**:
- ✓ Scroll vertically to view all content blocks
- ✓ Scroll smoothly through pages with many blocks
- ✓ Canvas maintains responsive layout while scrolling
- ✓ Properties panel remains accessible while scrolling
- ✓ All new blocks remain fully editable regardless of position

**Navigation**:
- **Scroll with mouse wheel**: Scroll up/down through content
- **Scroll with keyboard**: Use arrow keys or Page Up/Down
- **Drag scrollbar**: Click and drag the right scrollbar
- **Touch scroll**: On tablets/mobile, swipe to scroll

---

## Creating an Engaging Course Structure

### Recommended Flow:
1. **Introduction** (Text Block)
   - Welcome learners
   - Set expectations
   - Preview what they'll learn

2. **Content Sections** (Heading + Text/Image/Video)
   - Organize by topic
   - Use headings to structure
   - Include visuals

3. **Knowledge Checks** (After each section)
   - Reinforce learning
   - Quick comprehension tests
   - Build confidence

4. **Complex Topics** (Advanced Questions)
   - Encourage deeper thinking
   - Create discussion prompts
   - Develop critical skills

5. **Practical Application** (Branching Scenarios)
   - Apply concepts to real situations
   - Practice decision-making
   - Build competencies

6. **Summary** (Text Block)
   - Recap key points
   - Preview next steps
   - Encourage reflection

---

## Example Course Using All Block Types

### Module: "Conservation Decision Making"

```
[Heading] Conservation Decision Making

[Text] Introduction to conservation principles...

[Video] Ecosystem Overview (5 minutes)

[Knowledge Check]
Question: What is biodiversity?
Options: (with feedback)

[Heading] Conservation Challenges

[Text] Climate change affecting habitats...

[Advanced Question]
Question: How would you balance economic growth with conservation?

[Branching Scenario]
Scenario: You're managing a habitat threatened by development...
Path 1: Protect the habitat
Path 2: Allow controlled development

[Text] Summary and next steps...
```

---

## Tips for Better Content

### Make Knowledge Checks Effective:
- Test recall, comprehension, and application
- Mix question types
- Use scenarios for application questions
- Provide clear, supportive feedback
- Avoid penalizing wrong answers in practice

### Make Advanced Questions Valuable:
- Connect to real-world applications
- Require analysis beyond simple facts
- Provide rubric or grading guidance
- Encourage multiple perspectives
- Allow time for thoughtful response

### Make Branching Scenarios Memorable:
- Start with authentic dilemmas
- Show consequences of decisions
- Include both "good" and "learning" paths
- Connect to organizational values
- Debrief and explain decision-making

---

## Technical Details

### Block Structure

Each new block type stores specific data:

**Knowledge Check**:
```javascript
{
  type: "knowledge-check",
  question: "string",
  options: ["string", "string", ...],
  correctAnswer: number,
  feedback: "string"
}
```

**Advanced Question**:
```javascript
{
  type: "advanced-question",
  question: "string",
  answer: "string",
  explanation: "string"
}
```

**Branching Scenario**:
```javascript
{
  type: "branching-scenario",
  scenario: "string",
  paths: [
    { choice: "string", outcome: "string" },
    { choice: "string", outcome: "string" },
    ...
  ]
}
```

### Scrolling

- Canvas element: `.canvas { overflow-y: auto; }`
- Automatically scrolls content area
- Maintains fixed header and toolbar
- Responsive on all screen sizes

---

## Exporting with Advanced Content

When you export your course:

- All new block types are included
- Knowledge checks export with correct answers
- Advanced questions export with full details
- Branching scenarios export with all paths
- All content is properly formatted
- Full 508 accessibility compliance

---

## Common Questions

**Q: How many options should a knowledge check have?**  
A: Typically 3-5 options. More options make it harder; fewer options increase guessing.

**Q: Can I reorder blocks after adding them?**  
A: Yes! Use the up/down arrow buttons on each block to reorder.

**Q: Do advanced questions have automatic grading?**  
A: No, they're reference material. Learners see your provided answer.

**Q: Can branching scenarios have more than 4 paths?**  
A: Yes, but it can become complex. 2-3 paths is typically optimal for learning.

**Q: Is scrolling smooth on mobile?**  
A: Yes, all scrolling is smooth and touch-friendly.

**Q: Can I include formatting in question text?**  
A: Currently text is plain, but you can use line breaks. Rich formatting coming soon.

---

## Accessibility

All new block types include:
- ✓ Proper semantic HTML
- ✓ ARIA labels on all controls
- ✓ Keyboard navigation support
- ✓ Color-blind friendly indicators
- ✓ Screen reader compatibility
- ✓ 508 compliance
- ✓ WCAG 2.1 AA standards

---

## What's Next

Future enhancements could include:
- Drag-and-drop to reorder options in knowledge checks
- Rich text formatting for questions
- Image support in scenarios
- Branching with conditional paths
- Question answer randomization
- Scoring and tracking
- Feedback based on answer choice
- Multi-page branching trees

---

**Version**: 1.0  
**Last Updated**: 2024  
**Status**: Production Ready
