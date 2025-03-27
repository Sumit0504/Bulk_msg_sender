document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if(hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // File Upload Handling (Simple UI feedback)
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    
    if(dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());
        
        fileInput.addEventListener('change', handleFileSelect);
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropZone.classList.add('highlight');
            }, false);
        });
    
        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropZone.classList.remove('highlight');
            }, false);
        });
    
        function handleFileSelect(e) {
            const files = e.target.files || e.dataTransfer.files;
            if (files.length > 0) {
                dropZone.querySelector('p').textContent = `Selected file: ${files[0].name}`;
            }
        }
    }
    
    // Form Submission: Send file to /send_messages endpoint using AJAX
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            let formData = new FormData(uploadForm);
    
            try {
                showLoading();
                const response = await fetch('/send_messages', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                if(result.success){
                    showSuccess(result.message);
                } else {
                    showError(result.message || 'An error occurred');
                }
            } catch (error) {
                showError('Network error - please try again');
            } finally {
                hideLoading();
            }
        });
    }
    
    // Launch WhatsApp Messenger on clicking "Launch Messenger" button
    const launchButton = document.getElementById('startWhatsApp');
    if (launchButton) {
        launchButton.addEventListener('click', function() {
            window.open('https://web.whatsapp.com/', '_blank');
        });
    }
    
    // Utility Functions for Loading and Notifications
    function showLoading() {
        document.getElementById('loadingOverlay').style.display = 'grid';
    }
    
    function hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }
    
    function showSuccess(message) {
        alert(message); // Replace with a better notification if desired
    }
    
    function showError(message) {
        alert(message); // Replace with a better notification if desired
    }
});
