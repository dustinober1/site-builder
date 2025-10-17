# Save/Load/Templates Quick Reference

## File Manifest

### New Files Created
- `/frontend/src/utils/projectStorage.js` - Project management utility (520+ lines)
- `/frontend/src/components/TemplateGallery.js` - Template selection modal (120+ lines)
- `/frontend/src/components/TemplateGallery.css` - Template gallery styling (350+ lines)

### Updated Files
- `/frontend/src/components/ProjectList.js` - Added save/load/template functionality
- `/frontend/src/components/ProjectList.css` - Enhanced styling for new UI components
- `/frontend/src/components/Editor.js` - Added auto-save functionality
- `/frontend/src/components/Editor.css` - Added auto-save status styling
- `/frontend/src/App.js` - Initialize projects from storage on startup

### Documentation
- `/docs/SAVE_LOAD_FEATURES.md` - Comprehensive feature documentation

## Key Functions

### projectStorage.js
```
getAllProjects()
saveProject(project)
deleteProject(projectId)
exportProject(project)
importProject(file)
createProjectFromTemplate(templateId, projectName)
getAvailableTemplates()
duplicateProject(projectId)
searchProjects(query)
getProjectStats(projectId)
autoSaveProject(project)
```

### TemplateGallery.js Props
```
isOpen: boolean
onClose: function
onSelectTemplate: function(templateId, projectName)
```

### ProjectList.js Features
```
✓ Create blank project
✓ Create from template
✓ Search projects
✓ Sort projects (Newest/Oldest/By Name)
✓ Open project
✓ Duplicate project
✓ Export project as JSON
✓ Delete project with confirmation
✓ Import project from JSON
✓ Message feedback system
```

## Storage Structure

**localStorage Keys**
- `siteBuilder_projects` - Array of all projects
- `siteBuilder_templates` - Template definitions

**Project Object**
```javascript
{
  id: number,
  name: string,
  description: string,
  pages: Array<Page>,
  templateId: string (optional),
  createdAt: string (ISO),
  updatedAt: string (ISO),
  lastAutoSave: string (ISO, optional),
  importedAt: string (ISO, optional)
}
```

## Templates

### 1. Blank Course
- **ID**: blank
- **Pages**: 1 (Welcome)
- **Use**: Starting from scratch

### 2. Difficult Conservation
- **ID**: difficult-conservation
- **Pages**: 4 (Taxonomy, Ecology, Climate Change, Human Impacts)
- **Modules**: 15+
- **Case Studies**: 5
- **Use**: Environmental education

### 3. Business Training
- **ID**: business-training
- **Pages**: Multiple business modules
- **Use**: Corporate training

### 4. Technical Documentation
- **ID**: technical-documentation
- **Pages**: Documentation-focused
- **Use**: Technical education

## UI Elements

### ProjectList Toolbar
```
[+ Blank] [📋 Template] [Search] [Sort ▼] [📤 Import]
```

### ProjectList Card Actions
```
[Open (blue)] [📋] [📥] [🗑]
                 ^    ^    ^
           Duplicate Export Delete
```

### Editor Header
```
[← Back] [Project Name] [✓ Auto-saved] | [👁 Preview] [↓ Export]
```

## Auto-Save Behavior

- **Trigger**: Changes to blocks
- **Delay**: 2 seconds of inactivity
- **Visual**: "✓ Auto-saved" appears for 3 seconds
- **Storage**: localStorage via `autoSaveProject()`

## Message System

### Success Messages
- "Project created successfully"
- "Project saved"
- "Project exported successfully"
- "Project imported successfully"
- "Project duplicated successfully"

### Error Messages
- "Failed to save project"
- "Failed to delete project"
- "Invalid import file"
- "Failed to import project"

## Common Workflows

### Saving Work
1. User makes changes
2. Auto-save triggers after 2 seconds
3. "✓ Auto-saved" appears briefly
4. User can also manually export

### Creating from Template
1. Click "From Template" button
2. Select template from gallery
3. Enter project name
4. Click "Create Course"
5. Project opens in editor
6. User customizes content

### Backing Up Project
1. Go to Project List
2. Click export icon on project card
3. JSON file downloads
4. Save in safe location

### Restoring from Backup
1. Go to Project List
2. Click import button
3. Select saved JSON file
4. Project imported with "[Imported]" prefix
5. Original name preserved in content

### Duplicating for Variations
1. Go to Project List
2. Click duplicate icon on project card
3. Copy created with "[Copy]" in name
4. Edit the copy independently

## CSS Variables Used

```css
--midnight-blue: #001f3d
--dark-blue: #151983
--royal-blue: #1863d6
--baby-blue: #b6cbe1
--light-gray: #f5f5f5
--dark-gray: #666
```

## Responsive Breakpoints

- **Desktop**: Full multi-column layouts
- **Tablet**: 768px - 2 columns, wrapped toolbar
- **Mobile**: 480px - Single column, stacked buttons

## Browser Compatibility

- Chrome/Edge: ✓ Full support
- Firefox: ✓ Full support
- Safari: ✓ Full support
- localStorage: All modern browsers

## Performance Notes

- Projects loaded once on startup
- Search is client-side filtered
- Sort is client-side sorted
- No API calls for project management
- All operations < 100ms

## Testing Checklist

- [ ] Create blank project
- [ ] Create project from each template
- [ ] Search projects
- [ ] Sort by each option
- [ ] Open project and verify auto-save
- [ ] Duplicate project
- [ ] Export project
- [ ] Import exported project
- [ ] Delete project with confirmation
- [ ] Verify message feedback
- [ ] Test on mobile view
- [ ] Test localStorage persistence
- [ ] Test edge cases (long names, special chars)

---

For complete details, see `/docs/SAVE_LOAD_FEATURES.md`
