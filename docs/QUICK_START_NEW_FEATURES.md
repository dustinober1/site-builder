# Quick Start: Accessibility, Preview & SCORM

## New Features

### 1. 👁 Preview Button
**What**: Preview your course before publishing  
**Where**: Editor header (blue button)  
**How**:
1. Click "👁 Preview"
2. Use Previous/Next to navigate pages
3. Click ✕ or press Esc to close

### 2. ↓ Export Site
**What**: Export your complete course  
**Where**: Editor header (green button)  
**Options**:
- **Standard**: Static website (single version)
- **SCORM 1.2**: For older LMS platforms
- **SCORM 2004**: For modern LMS platforms

### 3. ♿ Accessibility Built-In
**What**: Your courses are now WCAG 2.1 AA compliant  
**Includes**:
- Skip links for screen readers
- Keyboard navigation
- High contrast colors
- Alt text support for images
- Responsive design
- Print friendly

---

## Using Preview

### Preview Your Course
```
1. Edit your course
2. Click 👁 Preview button
3. Navigate through pages
4. Close preview (click X or press Esc)
```

### What Preview Shows
✅ All content blocks  
✅ Styling and layout  
✅ Responsive design  
✅ Navigation between pages  

---

## Exporting for LMS

### Standard Export (Static Website)
Best for: Personal websites, hosting on your own server

1. Click "↓ Export Site"
2. Files generated in `output-sites/your-project/`
3. Upload to your web server

### SCORM 1.2 Export
Best for: Maximum LMS compatibility

1. Click "↓ Export Site"
2. Choose "SCORM 1.2"
3. Files in `output-sites/your-project-scorm12/`
4. Upload to any LMS
5. LMS tracks: completion, time, scores

**Compatible with**: Moodle, Blackboard, Canvas, most others

### SCORM 2004 Export
Best for: Modern LMS platforms

1. Click "↓ Export Site"
2. Choose "SCORM 2004"
3. Files in `output-sites/your-project-scorm2004/`
4. Upload to LMS
5. Supports: completion, time, scores, custom data

**Compatible with**: Moodle, Canvas, Docebo, most modern LMS

---

## Best Practices

### When Creating Content
- ✅ Add alt text to all images
- ✅ Use clear, descriptive headings
- ✅ Keep text readable (14px+ size recommended)
- ✅ Use Preview button to check layout
- ✅ Test on mobile devices

### When Exporting
- ✅ Preview course before exporting
- ✅ Check all pages load correctly
- ✅ Verify all images display
- ✅ Test links work
- ✅ Export SCORM if using an LMS

### After Publishing
- ✅ Test in target LMS
- ✅ Check student feedback
- ✅ Verify SCORM tracking works
- ✅ Keep backup of original project

---

## Accessibility Features

### For Course Takers
- **Keyboard Only**: Navigate entire course with keyboard
- **Screen Reader**: All content is readable by screen readers
- **High Contrast**: Easy to read text and backgrounds
- **Mobile Friendly**: Works on phones and tablets
- **Print Friendly**: Print courses to paper if needed

### For Course Creators
- **Easy Alt Text**: Add descriptions to images
- **Semantic HTML**: Built-in accessible structure
- **Focus Indicators**: Users see where they are
- **Responsive Design**: Works on all screen sizes
- **Validation**: Meets WCAG 2.1 Level AA

---

## SCORM Tracking

### What Gets Tracked
When exported as SCORM, these are tracked by the LMS:

| What | How It Works |
|------|------------|
| **Completion** | Course marked complete when user finishes |
| **Time** | How long user spent in course |
| **Score** | Quiz scores or completion percentage |
| **Attempts** | How many times course was attempted |
| **Session Data** | Custom data saved between sessions |

### Using SCORM Data
The LMS can:
- Issue certificates
- Track compliance
- Generate reports
- Award badges/points
- Require re-training

---

## Troubleshooting

### Preview Not Opening
- Check browser allows popups
- Disable ad-blockers
- Try different browser
- Check browser console (F12) for errors

### Course Not Looking Right in Preview
- Ensure all images are uploaded
- Check content block text
- Verify heading structure
- Try refreshing preview

### SCORM Upload Fails
- Verify LMS accepts SCORM 1.2 or 2004
- Check file is properly compressed
- Try uploading to different LMS
- Check LMS documentation

### Completion Not Tracking
- Verify LMS SCORM support enabled
- Check browser localStorage enabled
- Test student takes full course
- Check LMS activity tracking logs

---

## File Structure

### After Export

**Standard Site:**
```
output-sites/my-course/
├── index.html
├── page-0.html
├── page-1.html
└── styles.css
```

**SCORM Package:**
```
output-sites/my-course-scorm12/
├── imsmanifest.xml    (SCORM manifest)
├── index.html
├── page-0.html
├── styles.css
└── js/
    └── scorm-api.js   (SCORM API)
```

---

## Tips & Tricks

### Preview Keyboard Shortcuts
- **Esc**: Close preview
- **Tab**: Navigate controls
- **Arrow Keys**: Scroll in preview

### Accessibility Tips
- Hover over buttons to see tooltips
- Use keyboard Tab to navigate
- Screen readers will announce all elements
- Colors have good contrast automatically

### SCORM Tips
- SCORM 1.2 works with older systems
- SCORM 2004 works with newer systems
- Always test in your LMS first
- Keep course structures simple

---

## Support

### Need Help?
1. Check the full documentation: `ACCESSIBILITY_PREVIEW_SCORM.md`
2. Preview your course first
3. Test in target LMS
4. Check browser console for errors

### Getting More Info
- Full Accessibility Guide: `/docs/ACCESSIBILITY.md`
- Architecture Details: `/docs/ARCHITECTURE.md`
- System Overview: `/docs/EXECUTIVE_SUMMARY.md`

---

## What's New

### Version with Accessibility, Preview & SCORM

**New Features:**
- ✅ Preview modal for testing before export
- ✅ SCORM 1.2 and 2004 export options
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ Enhanced CSS with accessibility features
- ✅ Improved HTML with skip links and semantic markup

**Improved:**
- ✅ Better keyboard navigation
- ✅ Higher color contrast
- ✅ Responsive typography
- ✅ Print-friendly styling
- ✅ Reduced motion support

**Still Included:**
- ✅ Visual editor
- ✅ Drag-and-drop content blocks
- ✅ Image and video support
- ✅ Responsive design
- ✅ Static site generation

---

Enjoy creating accessible, professional e-learning courses! 🎓
