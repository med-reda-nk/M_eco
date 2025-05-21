// Modals Component

/**
 * Initializes modal dialogs functionality
 */
export function initModals() {
  const modalsContainer = document.querySelector('.modals-container');
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.close-modal, #cancelUploadBtn');
  
  // Upload modal specific elements
  const uploadButton = document.querySelector('#uploadButton');
  const csvFileInput = document.querySelector('#csvFileInput');
  const csvUploadModal = document.querySelector('#csvUploadModal');
  const modalCsvInput = document.querySelector('#modalCsvInput');
  const browseFilesBtn = document.querySelector('#browseFilesBtn');
  const uploadArea = document.querySelector('.upload-area');
  const uploadPreview = document.querySelector('.upload-preview');
  const fileNameElement = document.querySelector('#fileName');
  const fileSizeElement = document.querySelector('#fileSize');
  const progressBar = document.querySelector('.progress');
  const confirmUploadBtn = document.querySelector('#confirmUploadBtn');
  const removeFileBtn = document.querySelector('#removeFileBtn');
  
  let selectedFile = null;
  
  // Function to open a modal
  const openModal = (modalId) => {
    modalsContainer.classList.add('active');
    
    modals.forEach(modal => {
      if (modal.id === modalId) {
        modal.classList.add('active');
      } else {
        modal.classList.remove('active');
      }
    });
  };
  
  // Function to close all modals
  const closeModals = () => {
    modalsContainer.classList.remove('active');
    modals.forEach(modal => modal.classList.remove('active'));
  };
  
  // Open CSV upload modal
  if (uploadButton) {
    uploadButton.addEventListener('click', () => {
      openModal('csvUploadModal');
    });
  }
  
  // Same for the upload new data button if it exists
  const uploadNewDataBtn = document.querySelector('#uploadNewDataBtn');
  if (uploadNewDataBtn) {
    uploadNewDataBtn.addEventListener('click', () => {
      openModal('csvUploadModal');
    });
  }
  
  // Close modals when clicking close buttons
  closeButtons.forEach(button => {
    if (button) {
      button.addEventListener('click', closeModals);
    }
  });
  
  // Close modals when clicking outside
  modalsContainer.addEventListener('click', (event) => {
    if (event.target === modalsContainer) {
      closeModals();
    }
  });
  
  // Handle file selection via the hidden input
  if (csvFileInput) {
    csvFileInput.addEventListener('change', (event) => {
      handleFileSelection(event.target.files[0]);
    });
  }
  
  // Handle file selection via the modal input
  if (modalCsvInput) {
    modalCsvInput.addEventListener('change', (event) => {
      handleFileSelection(event.target.files[0]);
    });
  }
  
  // Open file browser when clicking the browse button
  if (browseFilesBtn && modalCsvInput) {
    browseFilesBtn.addEventListener('click', () => {
      modalCsvInput.click();
    });
  }
  
  // Handle drag and drop
  if (uploadArea) {
    uploadArea.addEventListener('dragover', (event) => {
      event.preventDefault();
      uploadArea.style.borderColor = 'var(--primary)';
      uploadArea.style.backgroundColor = 'rgba(193, 30, 56, 0.05)';
    });
    
    uploadArea.addEventListener('dragleave', () => {
      uploadArea.style.borderColor = 'var(--neutral-300)';
      uploadArea.style.backgroundColor = 'transparent';
    });
    
    uploadArea.addEventListener('drop', (event) => {
      event.preventDefault();
      uploadArea.style.borderColor = 'var(--neutral-300)';
      uploadArea.style.backgroundColor = 'transparent';
      
      if (event.dataTransfer.files.length) {
        handleFileSelection(event.dataTransfer.files[0]);
      }
    });
    
    uploadArea.addEventListener('click', () => {
      modalCsvInput.click();
    });
  }
  
  // Handle file selection
  function handleFileSelection(file) {
    if (file && file.type === 'text/csv') {
      selectedFile = file;
      
      // Format file size
      const sizeInKB = file.size / 1024;
      const formattedSize = sizeInKB < 1024 
        ? `${sizeInKB.toFixed(2)} KB` 
        : `${(sizeInKB / 1024).toFixed(2)} MB`;
      
      // Update UI
      fileNameElement.textContent = file.name;
      fileSizeElement.textContent = formattedSize;
      uploadArea.classList.add('hidden');
      uploadPreview.classList.remove('hidden');
      confirmUploadBtn.disabled = false;
    } else {
      alert('Please select a valid CSV file.');
    }
  }
  
  // Handle file removal
  if (removeFileBtn) {
    removeFileBtn.addEventListener('click', () => {
      selectedFile = null;
      uploadArea.classList.remove('hidden');
      uploadPreview.classList.add('hidden');
      progressBar.style.width = '0%';
      confirmUploadBtn.disabled = true;
      
      // Clear the file inputs
      if (csvFileInput) csvFileInput.value = '';
      if (modalCsvInput) modalCsvInput.value = '';
    });
  }
  
  // Handle upload confirmation
  if (confirmUploadBtn) {
    confirmUploadBtn.addEventListener('click', async () => {
      if (!selectedFile) {
        alert('Please select a file first.');
        return;
      }
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        progressBar.style.width = `${progress}%`;
        
        if (progress >= 100) {
          clearInterval(interval);
          
          // Process the file (here we would normally send to server)
          const reader = new FileReader();
          reader.onload = async (e) => {
            const csvData = e.target.result;
            console.log('CSV file loaded, first 100 chars:', csvData.substring(0, 100));
            
            // Here we would process and store the data
            // For now we'll simulate that with a timeout
            setTimeout(() => {
              closeModals();
              
              // Reset the upload form for next time
              setTimeout(() => {
                if (removeFileBtn) removeFileBtn.click();
              }, 500);
              
              // Show success message
              alert('File uploaded successfully!');
            }, 1000);
          };
          
          reader.readAsText(selectedFile);
        }
      }, 50);
    });
  }
  
  console.log('Modals initialized');
}