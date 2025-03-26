// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // File Upload Handling
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    
    dropZone.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', handleFileSelect);
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        e.preventDefault();
        dropZone.classList.add('highlight');
    }

    function unhighlight(e) {
        e.preventDefault();
        dropZone.classList.remove('highlight');
    }

    function handleFileSelect(e) {
        const files = e.target.files || e.dataTransfer.files;
        if (files.length > 0) {
            const fileName = files[0].name;
            dropZone.querySelector('p').textContent = `Selected file: ${fileName}`;
        }
    }

    // Form Submission
    document.getElementById('uploadForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        
        try {
            showLoading();
            const response = await fetch('/send_messages', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            if (result.success) {
                showSuccess('Messages scheduled successfully!');
            } else {
                showError(result.message || 'An error occurred');
            }
        } catch (error) {
            showError('Network error - please try again');
        } finally {
            hideLoading();
        }
    });

    // Utility Functions
    function showLoading() {
        document.getElementById('loadingOverlay').style.display = 'grid';
    }

    function hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }

    function showSuccess(message) {
        // Implement toast notification
    }

    function showError(message) {
        // Implement error notification
    }
});