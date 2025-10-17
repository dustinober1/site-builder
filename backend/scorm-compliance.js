/**
 * SCORM 1.2 and 2004 Compliance Module
 * Provides utilities to generate SCORM-compliant manifests and content
 */

const fs = require('fs');
const path = require('path');

/**
 * Generate SCORM 1.2 manifest file
 */
function generateSCORM12Manifest(projectName, pages, outputDir) {
  const timestamp = new Date().toISOString();
  const manifestId = `manifest-${Date.now()}`;
  
  // Build organization structure
  let itemsXML = '';
  pages.forEach((page, index) => {
    const pageSlug = page.slug || `page-${index}`;
    itemsXML += `
    <item identifier="item_${index}" identifierref="res_${index}">
      <title>${escapeXml(page.title)}</title>
    </item>`;
  });

  const manifest = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${manifestId}" 
          version="1.0"
          xmlns="http://www.adlnet.org/xsd/adlcp_v1p3.xsd"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3.xsd"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.adlnet.org/xsd/adlcp_v1p3.xsd http://www.adlnet.org/xsd/adlcp_v1p3.xsd">
  
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>

  <organizations default="org_1">
    <organization identifier="org_1">
      <title>${escapeXml(projectName)}</title>
      <item identifier="item_root" identifierref="res_index">
        <title>${escapeXml(projectName)} - Home</title>
        ${itemsXML}
      </item>
    </organization>
  </organizations>

  <resources>
    <resource identifier="res_index" type="webcontent" href="index.html" adlcp:scormtype="sco">
      <file href="index.html"/>
      <file href="styles.css"/>
      <dependency identifierref="res_lib"/>
    </resource>
    ${generateResourceEntries(pages)}
    <resource identifier="res_lib" type="webcontent" adlcp:scormtype="asset">
      <file href="js/scorm-api.js"/>
    </resource>
  </resources>

</manifest>`;

  fs.writeFileSync(path.join(outputDir, 'imsmanifest.xml'), manifest);
}

/**
 * Generate SCORM 2004 manifest file
 */
function generateSCORM2004Manifest(projectName, pages, outputDir) {
  const timestamp = new Date().toISOString();
  const manifestId = `manifest-${Date.now()}`;
  
  let itemsXML = '';
  pages.forEach((page, index) => {
    const pageSlug = page.slug || `page-${index}`;
    itemsXML += `
    <item identifier="item_${index}" identifierref="res_${index}">
      <title>${escapeXml(page.title)}</title>
    </item>`;
  });

  const manifest = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${manifestId}" 
          version="1.0"
          xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"
          xmlns:adlseq="http://www.adlnet.org/xsd/adlseq_v1p3"
          xmlns:adlnav="http://www.adlnet.org/xsd/adlnav_v1p3"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsglobal.org/xsd/imscp_v1p1 http://www.imsglobal.org/xsd/imscp_v1p1.xsd
                              http://www.adlnet.org/xsd/adlcp_v1p3 http://www.adlnet.org/xsd/adlcp_v1p3.xsd
                              http://www.adlnet.org/xsd/adlseq_v1p3 http://www.adlnet.org/xsd/adlseq_v1p3.xsd
                              http://www.adlnet.org/xsd/adlnav_v1p3 http://www.adlnet.org/xsd/adlnav_v1p3.xsd">
  
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>2004 3rd Edition</schemaversion>
  </metadata>

  <organizations default="org_1">
    <organization identifier="org_1">
      <title>${escapeXml(projectName)}</title>
      <item identifier="item_root" identifierref="res_index">
        <title>${escapeXml(projectName)} - Home</title>
        ${itemsXML}
      </item>
    </organization>
  </organizations>

  <resources>
    <resource identifier="res_index" type="webcontent" href="index.html" adlcp:scormtype="sco">
      <file href="index.html"/>
      <file href="styles.css"/>
      <dependency identifierref="res_lib"/>
    </resource>
    ${generateResourceEntries(pages)}
    <resource identifier="res_lib" type="webcontent" adlcp:scormtype="asset">
      <file href="js/scorm-api.js"/>
    </resource>
  </resources>

</manifest>`;

  fs.writeFileSync(path.join(outputDir, 'imsmanifest.xml'), manifest);
}

/**
 * Generate individual resource entries for pages
 */
function generateResourceEntries(pages) {
  let entries = '';
  pages.forEach((page, index) => {
    const pageSlug = page.slug || `page-${index}`;
    entries += `
    <resource identifier="res_${index}" type="webcontent" href="${pageSlug}.html" adlcp:scormtype="sco">
      <file href="${pageSlug}.html"/>
    </resource>`;
  });
  return entries;
}

/**
 * Generate SCORM Runtime API (JavaScript)
 * This provides the SCORM API that content can interact with
 */
function generateSCORMAPI() {
  return `/**
 * SCORM 1.2 and 2004 Runtime API
 * Provides communication between content and LMS
 */

(function(window) {
  'use strict';

  // SCORM API Object
  const SCORMApi = {
    initialized: false,
    suspended: false,
    completionStatus: 'not attempted',
    successStatus: 'unknown',
    scoreRaw: 0,
    sessionTime: '0000:00:00',
    startTime: new Date(),

    /**
     * Initialize SCORM connection
     */
    Initialize: function(emptyString) {
      if (this.initialized) {
        return 'false';
      }
      
      this.initialized = true;
      console.log('SCORM API Initialized');
      return 'true';
    },

    /**
     * Finish SCORM session
     */
    Terminate: function(emptyString) {
      if (!this.initialized) {
        return 'false';
      }
      
      // Save completion data
      this.saveCompletionData();
      
      this.initialized = false;
      console.log('SCORM API Terminated');
      return 'true';
    },

    /**
     * Get SCORM data value
     */
    GetValue: function(element) {
      const mapping = {
        'cmi.core.student_id': () => localStorage.getItem('scorm_student_id') || 'unknown',
        'cmi.core.student_name': () => localStorage.getItem('scorm_student_name') || 'Unknown',
        'cmi.core.lesson_status': () => this.completionStatus,
        'cmi.core.score.raw': () => this.scoreRaw.toString(),
        'cmi.core.session_time': () => this.calculateSessionTime(),
        'cmi.core.exit': () => localStorage.getItem('scorm_exit') || '',
        'cmi.suspend_data': () => localStorage.getItem('scorm_suspend_data') || '',
        'cmi.launch_data': () => localStorage.getItem('scorm_launch_data') || '',
        'cmi.comments': () => localStorage.getItem('scorm_comments') || '',
      };

      if (mapping[element]) {
        return mapping[element]();
      }
      
      return '';
    },

    /**
     * Set SCORM data value
     */
    SetValue: function(element, value) {
      const mapping = {
        'cmi.core.lesson_status': () => {
          const validStatuses = ['passed', 'failed', 'completed', 'incomplete', 'browsed', 'not attempted'];
          if (validStatuses.includes(value)) {
            this.completionStatus = value;
            localStorage.setItem('scorm_completion_status', value);
            return true;
          }
          return false;
        },
        'cmi.core.score.raw': () => {
          const score = parseFloat(value);
          if (!isNaN(score) && score >= 0 && score <= 100) {
            this.scoreRaw = score;
            localStorage.setItem('scorm_score_raw', score);
            return true;
          }
          return false;
        },
        'cmi.core.student_id': () => {
          localStorage.setItem('scorm_student_id', value);
          return true;
        },
        'cmi.suspend_data': () => {
          localStorage.setItem('scorm_suspend_data', value);
          return true;
        },
        'cmi.comments': () => {
          localStorage.setItem('scorm_comments', value);
          return true;
        },
      };

      if (mapping[element]) {
        return mapping[element]() ? 'true' : 'false';
      }
      
      return 'false';
    },

    /**
     * Get error code
     */
    GetLastError: function() {
      return '0'; // 0 = no error
    },

    /**
     * Get error string
     */
    GetErrorString: function(errorCode) {
      const errors = {
        '0': 'No error',
        '101': 'General exception',
        '301': 'General initialization failure',
        '401': 'General termination failure',
        '402': 'Termination before initialization',
      };
      return errors[errorCode] || 'Unknown error';
    },

    /**
     * Get diagnostic information
     */
    GetDiagnostic: function(errorCode) {
      return 'Diagnostic information not available';
    },

    /**
     * Calculate session time
     */
    calculateSessionTime: function() {
      const elapsed = Math.floor((new Date() - this.startTime) / 1000);
      const hours = Math.floor(elapsed / 3600);
      const minutes = Math.floor((elapsed % 3600) / 60);
      const seconds = elapsed % 60;
      
      return \`\${String(hours).padStart(4, '0')}:\${String(minutes).padStart(2, '0')}:\${String(seconds).padStart(2, '0')}\`;
    },

    /**
     * Save completion data
     */
    saveCompletionData: function() {
      const data = {
        completionStatus: this.completionStatus,
        scoreRaw: this.scoreRaw,
        sessionTime: this.calculateSessionTime(),
        completedAt: new Date().toISOString(),
      };
      
      console.log('Completion data:', data);
      
      // Could be sent to server here
      localStorage.setItem('scorm_completion_data', JSON.stringify(data));
    }
  };

  // Expose globally
  window.API = SCORMApi;
  window.API_1484_11 = SCORMApi; // SCORM 2004

  // Track page completion
  window.addEventListener('beforeunload', function() {
    if (SCORMApi.initialized) {
      SCORMApi.SetValue('cmi.core.exit', 'suspend');
    }
  });

})(window);
`;
}

/**
 * Generate SCORM-compliant HTML wrapper for content
 */
function generateSCORMWrapper(content, title, projectName) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - ${escapeHtml(projectName)}</title>
  <link rel="stylesheet" href="styles.css">
  <script src="js/scorm-api.js"></script>
</head>
<body>
  <script>
    // SCORM initialization
    if (window.API && window.API.Initialize) {
      window.API.Initialize('');
    }
    
    // Track learning activity
    document.addEventListener('DOMContentLoaded', function() {
      console.log('SCORM Content Loaded');
    });
    
    // Mark as completed when user finishes
    window.addEventListener('beforeunload', function() {
      if (window.API && window.API.SetValue) {
        window.API.SetValue('cmi.core.lesson_status', 'completed');
        window.API.Terminate('');
      }
    });
  </script>
  
  <div class="scorm-wrapper">
    ${content}
  </div>
</body>
</html>`;
}

/**
 * Escape XML special characters
 */
function escapeXml(str) {
  if (typeof str !== 'string') {
    return '';
  }
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

module.exports = {
  generateSCORM12Manifest,
  generateSCORM2004Manifest,
  generateSCORMAPI,
  generateSCORMWrapper,
  escapeXml,
};
