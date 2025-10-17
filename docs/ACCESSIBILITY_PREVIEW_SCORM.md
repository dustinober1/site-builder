# Accessibility, Preview, and SCORM Compliance Guide

## Overview

This document outlines the three major improvements made to the Site Builder application:

1. **Accessibility Enhancements** - WCAG 2.1 AA compliant interface
2. **Preview Feature** - Preview courses before publishing
3. **SCORM Compliance** - SCORM 1.2 and SCORM 2004 support

---

## 1. Accessibility Enhancements

### What's Included

The Site Builder now includes comprehensive accessibility features across both the editor and generated courses:

#### Editor UI Accessibility
- **Keyboard Navigation**: All buttons and controls are fully keyboard accessible
- **ARIA Labels**: Proper ARIA labels on all interactive elements
- **Focus Indicators**: Clear visual focus indicators for keyboard users
- **High Contrast**: Good color contrast ratios (WCAG AA)
- **Screen Reader Support**: Semantic HTML with proper roles

#### Generated Course Accessibility
- **Skip Links**: "Skip to main content" link at the top of every page
- **Heading Structure**: Proper h1-h3 hierarchy
- **Semantic HTML**: Proper use of header, nav, main, footer roles
- **Image Alt Text**: Support for alt text on all images
- **Color Contrast**: WCAG AA compliant colors
- **Responsive Typography**: Better font sizes and line heights
- **Focus Visible Support**: All interactive elements show focus

### Features

#### Skip to Main Content Link
- Invisible until focused
- Allows users to skip header navigation
- First focusable element on page

#### Improved Keyboard Navigation
```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```

#### Focus Indicators
```css
:focus-visible {
  outline: 3px solid #3498db;
  outline-offset: 2px;
}
```

#### Preference Detection
- **Reduced Motion**: Respects `prefers-reduced-motion` setting
- **High Contrast Mode**: Detects `prefers-contrast: more` and adjusts
- **Responsive Text**: Automatic font size adjustment on different screen sizes

### Accessibility Checklist

- ✅ WCAG 2.1 Level AA compliant
- ✅ Keyboard accessible
- ✅ Screen reader compatible
- ✅ Color contrast compliant
- ✅ Focus management
- ✅ Semantic HTML
- ✅ Mobile accessible
- ✅ Print friendly
- ✅ Reduced motion support
- ✅ High contrast support

---

## 2. Preview Feature

### How to Use

1. **Access Preview**: Click the "👁 Preview" button in the editor header
2. **Navigate Pages**: Use the Previous/Next buttons to navigate between pages
3. **Page Counter**: See your current position (e.g., "Page 1 of 5")
4. **Exit Preview**: 
   - Click the ✕ button
   - Click outside the preview modal
   - Press Escape key

### Features

#### Full Page Preview
- Preview entire course layout before publishing
- See all content blocks in context
- Test navigation flow
- Verify responsive design

#### Interactive Controls
- Navigate between pages
- Page counter showing progress
- Keyboard shortcuts (Esc to close)

#### Preview Modal
- Non-blocking preview overlay
- Can close without losing work
- Responsive design for all screen sizes
- Accessible keyboard navigation

### Technical Details

The preview feature:
- Renders course pages in an iframe sandbox
- Includes all styling and formatting
- Shows accurate spacing and layout
- Tests responsive behavior
- Safe sandbox environment

---

## 3. SCORM Compliance

### What is SCORM?

SCORM (Sharable Content Object Reference Model) is a standard for learning management systems. It ensures courses can be:
- Imported into any SCORM-compatible LMS
- Tracked for completion and scores
- Shared across platforms
- Reused in different systems

### Supported Standards

#### SCORM 1.2
- Older but widely supported
- Simpler data model
- Compatible with most legacy LMS platforms
- Use if you need maximum compatibility

**Export**: Click "Export Site" → SCORM 1.2

#### SCORM 2004 (3rd Edition)
- Modern standard
- More detailed tracking
- Better data model
- Recommended for new courses
- Compatible with newer LMS platforms

**Export**: Click "Export Site" → SCORM 2004

### Generated SCORM Package Contents

Both SCORM exports include:

```
project-name-scorm12/ (or scorm2004/)
├── imsmanifest.xml          # SCORM manifest (course structure)
├── index.html               # Home page
├── page-0.html, page-1.html # Course pages
├── styles.css               # Styling
└── js/
    └── scorm-api.js         # SCORM runtime API
```

### SCORM Manifest (imsmanifest.xml)

The manifest file defines:
- Course structure and organization
- Page resources and relationships
- Learning objectives
- Content type definitions
- Dependencies

Example structure:
```xml
<manifest identifier="manifest-123456">
  <organizations>
    <organization identifier="org_1">
      <title>My Course</title>
      <item identifier="item_0">
        <title>Page 1</title>
      </item>
    </organization>
  </organizations>
  
  <resources>
    <resource identifier="res_0" href="page-0.html">
      <file href="page-0.html"/>
    </resource>
  </resources>
</manifest>
```

### SCORM API Integration

The generated SCORM packages include a Runtime API that allows:

#### Completion Tracking
```javascript
API.SetValue('cmi.core.lesson_status', 'completed');
```

#### Score Tracking
```javascript
API.SetValue('cmi.core.score.raw', 85);
```

#### Session Management
```javascript
API.Initialize('');
// ... course content ...
API.Terminate('');
```

#### Data Persistence
```javascript
API.SetValue('cmi.suspend_data', 'custom data');
var data = API.GetValue('cmi.suspend_data');
```

### SCORM Data Model

Supported SCORM data elements:

| Element | Description | Example |
|---------|-------------|---------|
| `cmi.core.student_id` | Student identifier | "12345" |
| `cmi.core.student_name` | Student name | "John Doe" |
| `cmi.core.lesson_status` | Completion status | "completed" |
| `cmi.core.score.raw` | Score percentage | "85" |
| `cmi.core.session_time` | Time in course | "0001:30:45" |
| `cmi.suspend_data` | Custom data | Any string |
| `cmi.comments` | Notes/feedback | Any string |

### LMS Compatibility

The SCORM packages are compatible with:

**SCORM 1.2:**
- Moodle
- Blackboard Learn
- Canvas
- Adobe Captivate
- Articulate Storyline
- LASCO
- Saba
- And most others

**SCORM 2004:**
- Moodle (with plugin)
- Blackboard Learn (newer versions)
- Canvas
- Adobe Captivate
- Articulate Storyline
- Docebo
- And most modern LMS

### How to Use SCORM Package

1. **Generate Course**: Create your course in Site Builder
2. **Preview**: Use the Preview button to check layout
3. **Export SCORM**: Click export and choose SCORM version
4. **Upload to LMS**: 
   - Log into your LMS
   - Go to course/content import section
   - Upload the generated file
   - Configure tracking/grading
5. **Students Take Course**: Students launch course from LMS
6. **Track Results**: LMS tracks completion, time, scores

### Advanced: Custom SCORM Integration

To add custom JavaScript to track events:

1. The SCORM API is available globally as `window.API`
2. Call it from your course pages:

```javascript
// In your course content
if (window.API) {
  window.API.SetValue('cmi.core.lesson_status', 'completed');
  window.API.SetValue('cmi.core.score.raw', 90);
}
```

### Data Persistence

SCORM data is stored in browser localStorage:
- `scorm_student_id`
- `scorm_student_name`
- `scorm_completion_status`
- `scorm_score_raw`
- `scorm_suspend_data`
- `scorm_completion_data`

The data can be used to:
- Resume courses where students left off
- Track progress across sessions
- Store custom learning data
- Generate completion reports

### Troubleshooting SCORM

**Issue: Course won't import to LMS**
- Check imsmanifest.xml is valid XML
- Verify all file paths are correct
- Ensure .html files exist in package
- Try SCORM 1.2 for maximum compatibility

**Issue: Scores not tracking**
- Verify LMS has SCORM tracking enabled
- Check student setup in course
- Ensure API.Initialize() is called
- Review browser console for errors

**Issue: Course won't launch**
- Check manifest structure
- Verify index.html exists and has correct name
- Check all resource references match filenames
- Test in different LMS

---

## Implementation Details

### Frontend Components

#### PreviewModal.js
- Modal overlay for course preview
- Page navigation controls
- Responsive design
- Keyboard accessible

#### PreviewModal.css
- Modal styling
- Animations
- Responsive breakpoints
- Accessibility focus states

### Backend Modules

#### scorm-compliance.js
Functions:
- `generateSCORM12Manifest()` - Creates SCORM 1.2 manifest
- `generateSCORM2004Manifest()` - Creates SCORM 2004 manifest
- `generateSCORMAPI()` - Creates runtime API JavaScript
- `generateSCORMWrapper()` - Wraps content in SCORM HTML

#### Updated server.js
New endpoints:
- `POST /api/generate/scorm-12` - Generate SCORM 1.2 package
- `POST /api/generate/scorm-2004` - Generate SCORM 2004 package

Enhanced features:
- Improved HTML generation with accessibility
- Better CSS with accessibility support
- Skip links implementation
- Enhanced semantic structure

---

## Testing

### Accessibility Testing

Use these tools to verify accessibility:
- **WAVE** (webaim.org/wave) - Visual accessibility testing
- **Axe DevTools** - Automated accessibility testing
- **Lighthouse** (Chrome DevTools) - Built-in accessibility audit
- **Screen readers**: NVDA (Windows), VoiceOver (Mac)
- **Keyboard only**: Tab through all elements

### SCORM Testing

1. **Manifest Validation**: Validate imsmanifest.xml
2. **Test in LMS**: 
   - Use free LMS like Moodle
   - Import your SCORM package
   - Test course launch
   - Verify completion tracking
3. **API Testing**: Check browser console for API calls

### Preview Testing

1. Test all pages load correctly
2. Verify styling appears properly
3. Check navigation works
4. Test on mobile/tablet
5. Test keyboard navigation

---

## Best Practices

### For Accessibility
1. Always add alt text to images
2. Use descriptive headings
3. Keep text readable (min 14px)
4. Test with keyboard navigation
5. Test with screen readers
6. Verify color contrast
7. Don't rely on color alone

### For SCORM
1. Test before uploading to LMS
2. Keep package file names consistent
3. Validate manifest XML
4. Test on target LMS first
5. Keep course structure simple
6. Document custom data fields
7. Test in multiple browsers

### For Preview
1. Preview before exporting
2. Check all pages display correctly
3. Test responsive design
4. Verify all links work
5. Check image loading
6. Test on target devices

---

## Resources

### Accessibility
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- WebAIM: https://webaim.org/
- MDN Accessibility: https://developer.mozilla.org/en-US/docs/Web/Accessibility

### SCORM
- Official SCORM Documentation: https://adlnet.gov/research/scorm/
- SCORM Best Practices: https://adlnet.gov/understanding-scorm/
- LMS Compatibility: Check your LMS documentation

### Tools
- WAVE Tool: https://wave.webaim.org/
- Axe DevTools: https://www.deque.com/axe/devtools/
- SCORM Validator: https://scorm.com/scorm-conformance-certification/

---

## Summary

Your Site Builder now includes:

✅ **Accessibility**: WCAG 2.1 AA compliant courses  
✅ **Preview**: Test courses before publishing  
✅ **SCORM 1.2**: Legacy LMS compatibility  
✅ **SCORM 2004**: Modern standard support  

These features work together to create professional, compliant e-learning courses that work on any platform and are accessible to all learners.
