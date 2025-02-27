// DOM elements
const dropZone = document.getElementById('dropZone');
const progressContainer = document.getElementById('progressContainer');
const completionMessage = document.getElementById('completionMessage');
const progressBar = document.getElementById('progressBar');
const progressPercentage = document.getElementById('progressPercentage');
const currentFileName = document.getElementById('currentFileName');
const currentFileCount = document.getElementById('currentFileCount');
const totalFileCount = document.getElementById('totalFileCount');
const convertMoreBtn = document.getElementById('convertMoreBtn');
const browseText = document.querySelector('.browse-text');
const scaleInput = document.getElementById('scale');
const scaleValue = document.getElementById('scaleValue');
const dimensionsPreview = document.getElementById('dimensionsPreview');
const outputDimensions = document.getElementById('outputDimensions');

// Current video dimensions
let currentVideoDimensions = null;

// Window control buttons
const minimizeBtn = document.getElementById('minimizeBtn');
const maximizeBtn = document.getElementById('maximizeBtn');
const closeBtn = document.getElementById('closeBtn');

// Settings elements
const qualityInput = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const losslessInput = document.getElementById('lossless');
const compressionInput = document.getElementById('compression');
const compressionValue = document.getElementById('compressionValue');
const presetInput = document.getElementById('preset');

// Event listeners for window controls
if (minimizeBtn) minimizeBtn.addEventListener('click', () => window.api.windowControls.minimize());
if (maximizeBtn) minimizeBtn.addEventListener('click', () => window.api.windowControls.maximize());
if (closeBtn) closeBtn.addEventListener('click', () => window.api.windowControls.close());

// Set up standard HTML5 drag and drop
window.addEventListener('DOMContentLoaded', () => {
  // Visual indication when dragging over the drop zone
  dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropZone.classList.add('active');
  });

  dropZone.addEventListener('dragleave', (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropZone.classList.remove('active');
  });
  
  // Handle the drop event directly
  dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropZone.classList.remove('active');
    
    // Get files from the drop event
    const files = Array.from(event.dataTransfer.files);
    
    if (files.length === 0) {
      showNotification('No files dropped');
      return;
    }
    
    // Get file paths from the files
    const filePaths = files.map(file => file.path).filter(Boolean);
    
    // Filter to accept only video files
    const validFilePaths = filePaths.filter(filePath => {
      const ext = filePath.split('.').pop().toLowerCase();
      return ['mp4', 'mov', 'avi'].includes(ext);
    });
    
    if (validFilePaths.length === 0) {
      showNotification('Please drop valid video files (MP4, MOV, AVI)');
      return;
    }
    
    // Process the files with valid paths
    processFiles(validFilePaths);
  });
});

// Click on drop zone to select files
dropZone.addEventListener('click', () => {
  browseForFiles();
});

// Click on "browse" text to select files
browseText.addEventListener('click', (event) => {
  event.stopPropagation();
  browseForFiles();
});

// "Convert More" button click
convertMoreBtn.addEventListener('click', () => {
  showDropZone();
});

// Browse for files function
async function browseForFiles() {
  try {
    await window.api.selectFiles();
  } catch (error) {
    console.error('Error selecting files:', error);
  }
}

// Settings change handlers
qualityInput.addEventListener('input', () => {
  qualityValue.textContent = qualityInput.value;
});

compressionInput.addEventListener('input', () => {
  compressionValue.textContent = compressionInput.value;
});

scaleInput.addEventListener('input', () => {
  const scale = parseInt(scaleInput.value);
  scaleValue.textContent = `${scale}%`;
  updateOutputDimensions(scale);
});

function updateOutputDimensions(scale) {
  if (!currentVideoDimensions) {
    dimensionsPreview.style.display = 'none';
    return;
  }

  const scaleFactor = scale / 100;
  const outputWidth = Math.round(currentVideoDimensions.width * scaleFactor);
  const outputHeight = Math.round(currentVideoDimensions.height * scaleFactor);
  
  outputDimensions.textContent = `${outputWidth}×${outputHeight}`;
  dimensionsPreview.style.display = 'flex';
}

// Get current settings
function getConversionSettings() {
  return {
    quality: parseInt(qualityInput.value),
    lossless: losslessInput.checked,
    compressionLevel: parseInt(compressionInput.value),
    preset: presetInput.value,
    scale: parseInt(scaleInput.value)
  };
}

// Process files for conversion
async function processFiles(filePaths) {
  if (!filePaths || filePaths.length === 0) return;
  
  // Get video dimensions of the first file
  try {
    const dimensions = await window.api.getVideoDimensions(filePaths[0]);
    currentVideoDimensions = dimensions;
    updateOutputDimensions(parseInt(scaleInput.value));
  } catch (error) {
    console.error('Error getting video dimensions:', error);
  }
  
  showProgressUI();
  try {
    const settings = getConversionSettings();
    await window.api.handleFileDrop(filePaths, settings);
  } catch (error) {
    console.error('Error processing files:', error);
    showNotification('Error processing files. Please try again.');
    showDropZone();
  }
}

// Show progress UI
function showProgressUI() {
  dropZone.style.display = 'none';
  progressContainer.style.display = 'block';
  completionMessage.style.display = 'none';
}

// Show completion UI
function showCompletionUI() {
  dropZone.style.display = 'none';
  progressContainer.style.display = 'none';
  completionMessage.style.display = 'flex';
}

// Show drop zone
function showDropZone() {
  dropZone.style.display = 'flex';
  progressContainer.style.display = 'none';
  completionMessage.style.display = 'none';
  // Reset progress bar
  progressBar.style.width = '0%';
  progressPercentage.textContent = '0%';
}

// Update progress UI
function updateProgressUI(data) {
  currentFileName.textContent = data.file;
  currentFileCount.textContent = data.currentFile;
  totalFileCount.textContent = data.totalFiles;
  progressBar.style.width = `${data.progress}%`;
  progressPercentage.textContent = `${data.progress}%`;
}

// Show notification
function showNotification(message) {
  // Simple notification - can be enhanced in future
  alert(message);
}

// Register event handlers for conversion progress and completion
window.api.onProgress((data) => {
  updateProgressUI(data);
});

window.api.onComplete((data) => {
  showCompletionUI();
});

// Create a simple SVG logo if logo.svg doesn't exist
document.addEventListener('DOMContentLoaded', () => {
  const appLogo = document.getElementById('appLogo');
  const logoSvg = `
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6366f1" />
          <stop offset="100%" stop-color="#4f46e5" />
        </linearGradient>
      </defs>
      <path fill="url(#logoGradient)" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
    </svg>
  `;
  appLogo.outerHTML = logoSvg;
});