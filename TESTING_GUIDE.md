# Testing Guide: New Features

This guide will help you test the new accessibility, preview, and SCORM features.

---

## Prerequisites

1. Site Builder running (frontend and backend)
2. Modern browser (Chrome, Firefox, Safari, Edge)
3. 5-10 minutes

---

## Part 1: Testing Preview Feature ⏱ 5 min

### Step 1: Create a Test Course
1. Open Site Builder
2. Click "Get Started"
3. Click "New Project"
4. Enter name: `Preview Test Course`
5. Click Create

### Step 2: Add Some Content
1. Click toolbar "Heading" button
2. Edit text to: "Lesson 1: Getting Started"
3. Click "Text" button
4. Edit text to: "This is sample course content"
5. Click "Image" or "Video" to add media (optional)

### Step 3: Test Preview Button
1. Look at header - should see two buttons:
   - Blue: "👁 Preview" (new!)
   - Green: "↓ Export Site"
2. Click "👁 Preview"
3. Should see modal open with your content

### Step 4: Test Preview Controls
- Click "Previous" (should be disabled)
- Click "Next" → Page 2 (if exists)
- Look for "Page 1 of 1" counter
- Try keyboard: Press Esc → modal closes
- Or click ✕ button → modal closes
- Or click outside modal → closes

### Step 5: Test Preview Accessibility
1. Close preview (press Esc)
2. Open preview again
3. Press Tab repeatedly
- Should see focus on buttons
- Should see focus indicators (blue outlines)
4. Open browser DevTools (F12)
5. Go to Accessibility tab
6. Check "No violations" message

### ✅ Preview Test Complete!
- [x] Preview button works
- [x] Modal opens and closes
- [x] Navigation works
- [x] Content displays correctly
- [x] Keyboard accessible

---

## Part 2: Testing Accessibility ⏱ 5 min

### Step 1: Test Keyboard Navigation
1. With preview open or viewing exported site
2. Press Tab repeatedly
- Should see focus move through links/buttons
- Should see clear focus indicators (blue outline)
3. Press Shift+Tab to go backwards
- Should move in reverse order
4. On links, press Enter → should navigate
5. On buttons, press Enter → should activate

### Step 2: Check Color Contrast
1. Use WAVE tool: https://wave.webaim.org/
2. Paste your preview URL or exported site URL
3. Look for contrast errors
- Should show: 0 contrast errors
- Should show: High contrast (AA or better)

### Step 3: Test with Screen Reader (Mac)
1. On Mac: Press Cmd+F5 to enable VoiceOver
2. Or use iPhone accessibility
3. Navigate course with screen reader
- Should hear: All text read aloud
- Should hear: Button labels
- Should hear: Headings announced
- Should hear: Navigation structure

### Step 4: Test Mobile/Responsive
1. Export course
2. Open on phone/tablet
3. Check:
- [x] Text is readable (no tiny font)
- [x] Buttons are large enough to tap
- [x] Images scale properly
- [x] Navigation is clear
- [x] No horizontal scroll

### Step 5: Test Print
1. Open exported page in browser
2. Press Ctrl+P (or Cmd+P on Mac)
3. Preview print
4. Check:
- [x] Headers/footers hidden
- [x] Content is readable
- [x] Links are not shown
- [x] No unnecessary colors

### ✅ Accessibility Test Complete!
- [x] Keyboard navigation works
- [x] Color contrast is good
- [x] Screen reader works
- [x] Mobile looks good
- [x] Print is clean

---

## Part 3: Testing SCORM Export ⏱ 10 min

### Step 1: Export as SCORM 1.2
1. With your test course, click "↓ Export Site"
2. Should see dialog (or check console for endpoint)
3. Send POST request or click export button
4. Should generate to: `output-sites/Preview Test Course-scorm12/`

### Step 2: Verify SCORM Files
1. Check output folder contents:
```
Preview Test Course-scorm12/
├── imsmanifest.xml     ← SCORM manifest
├── index.html
├── page-0.html
├── styles.css
└── js/
    └── scorm-api.js    ← SCORM API
```

### Step 3: Validate Manifest
1. Open `imsmanifest.xml` in text editor
2. Check structure:
- [x] Has `<manifest>` element
- [x] Has `<organizations>` section
- [x] Has `<resources>` section
- [x] All pages listed as resources
3. Use online XML validator if needed

### Step 4: Test SCORM in Browser
1. Open `index.html` in browser
2. Look for: No errors in console
3. Check JavaScript loads: `scorm-api.js` is loaded
4. Check pages load correctly

### Step 5: Test SCORM API
1. Open browser DevTools (F12)
2. Go to Console tab
3. Type and run:
```javascript
window.API.Initialize('')
```
- Should return: `true`
- Should log: "SCORM API Initialized"

4. Test SetValue:
```javascript
window.API.SetValue('cmi.core.lesson_status', 'completed')
```
- Should return: `true`

5. Test GetValue:
```javascript
window.API.GetValue('cmi.core.lesson_status')
```
- Should return: `"completed"`

### Step 6: Test Completion Data
1. In console:
```javascript
localStorage.getItem('scorm_completion_status')
```
- Should show: `"completed"` (from previous step)

2. Try setting score:
```javascript
window.API.SetValue('cmi.core.score.raw', 85)
window.API.GetValue('cmi.core.score.raw')
```
- Should return: `"85"`

3. Terminate SCORM:
```javascript
window.API.Terminate('')
```
- Should return: `true`
- Should log: "SCORM API Terminated"

### ✅ SCORM Test Complete!
- [x] SCORM 1.2 exports correctly
- [x] Manifest is valid
- [x] Files are in place
- [x] API initializes
- [x] Data can be set/get
- [x] Completion tracking works

---

## Part 4: Testing SCORM 2004 (Optional) ⏱ 5 min

### Step 1: Export SCORM 2004
1. Export again, choose SCORM 2004
2. Should generate to: `output-sites/Preview Test Course-scorm2004/`

### Step 2: Verify Structure
1. Check `imsmanifest.xml`:
- [x] Has SCORM 2004 namespace
- [x] Structure similar to 1.2
- [x] All pages listed

### Step 3: Test Differences
- SCORM 2004 features:
  - Larger XML with more metadata
  - More namespace definitions
  - Supports more data elements
  - Better structure definitions

---

## Part 5: Full Integration Test ⏱ 15 min (Optional)

### Requirements
- Need free Moodle instance or similar LMS
- Free trial available at: https://demo.moodle.org

### Steps
1. Log in to Moodle or Canvas
2. Create new course
3. Add activity → SCORM Activity
4. Upload your SCORM 1.2 package
5. Configure tracking settings
6. Launch course from student view
7. Verify:
- [x] Course loads
- [x] Can navigate pages
- [x] Completion marked in LMS
- [x] Time tracked
- [x] Scores tracked (if any)

---

## Troubleshooting

### Preview doesn't open
```
Solution:
1. Check browser console (F12)
2. Check for error messages
3. Disable ad-blockers
4. Try incognito mode
```

### SCORM export fails
```
Solution:
1. Check backend is running
2. Check output-sites folder exists
3. Check file permissions
4. Check console for errors
5. Try SCORM 1.2 instead
```

### API returns errors
```
Solution:
1. Check API initialized first
2. Check localStorage enabled
3. Check valid data values
4. Check console for error codes
5. Use GetLastError() to debug
```

### Manifest validation fails
```
Solution:
1. Check XML syntax
2. Verify all file paths exist
3. Check namespace definitions
4. Use online validator
5. Compare to working example
```

---

## Test Checklist

### Preview Feature
- [ ] Preview button appears
- [ ] Preview modal opens
- [ ] Content displays correctly
- [ ] Previous button works
- [ ] Next button works
- [ ] Page counter shows
- [ ] Close button works
- [ ] Esc key closes
- [ ] Click outside closes

### Accessibility
- [ ] Keyboard navigation works
- [ ] Tab moves through elements
- [ ] Focus indicators visible
- [ ] Color contrast good
- [ ] Screen reader compatible
- [ ] Mobile responsive
- [ ] Text readable
- [ ] No errors in WAVE tool
- [ ] Print looks clean

### SCORM 1.2
- [ ] Files generate
- [ ] Manifest is valid
- [ ] All pages included
- [ ] Styles load
- [ ] API loads
- [ ] Initialize works
- [ ] SetValue works
- [ ] GetValue works
- [ ] Terminate works

### SCORM 2004
- [ ] Files generate
- [ ] Different namespace from 1.2
- [ ] Manifest is valid
- [ ] Works like 1.2

---

## Quick Test Scenarios

### Scenario 1: Create and Test Quick Course
```
1. Create project: "Test"
2. Add heading: "Welcome"
3. Add text: "Hello"
4. Preview → should see content
5. Close preview
6. Export SCORM 1.2
7. Check files exist
8. ✅ 10 minutes, verified working
```

### Scenario 2: Mobile Accessibility Test
```
1. Export any course
2. Open on mobile phone
3. Test:
   - Can read text
   - Can tap buttons
   - Page loads fast
   - Images display
4. ✅ Mobile ready
```

### Scenario 3: LMS Upload Test
```
1. Export SCORM 1.2
2. Open Moodle (free.moodle.org)
3. Upload package
4. Launch course
5. Check completion tracking
6. ✅ LMS integration works
```

---

## Success Criteria

### ✅ All Tests Passing When:
- Preview button visible and working
- SCORM files generated correctly
- Manifest validates
- API functions execute
- No errors in console
- Accessibility tests pass
- Mobile looks responsive
- Course launches in LMS

### ✅ Ready for Production When:
- All tests passing
- Tested in target LMS
- Verified accessibility
- Content is ready
- Users trained on preview feature

---

## Next Steps

1. **If tests pass**: Features are working! 🎉
   - Start creating courses
   - Use preview feature
   - Export to SCORM for LMS

2. **If tests fail**: Check troubleshooting
   - Review error messages
   - Check console logs
   - Try test scenarios again

3. **Get help**:
   - Check documentation: `docs/QUICK_START_NEW_FEATURES.md`
   - Read full guide: `docs/ACCESSIBILITY_PREVIEW_SCORM.md`

---

**Happy testing! 🧪**

For any issues, check the documentation or your browser console for detailed error messages.
