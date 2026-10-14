document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const imageUpload = document.getElementById('imageUpload');
    const dropZone = document.getElementById('dropZone');
    const imagePreview = document.getElementById('imagePreview');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const clearPreviewBtn = document.getElementById('clearPreviewBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const detectionResult = document.getElementById('detectionResult');
    const resultsCard = document.getElementById('resultsCard');
    
    // State
    let selectedFile = null;
    
    // Helper Functions
    function showError(message) {
        if (detectionResult) {
            detectionResult.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>${message}</p>
                </div>`;
            detectionResult.style.display = 'block';
            
            // Show results card if hidden
            if (resultsCard) {
                resultsCard.style.display = 'block';
                resultsCard.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            alert(message);
        }
    }
    
    function resetFileInput() {
        imageUpload.value = '';
        imagePreview.src = '';
        imagePreviewContainer.style.display = 'none';
        dropZone.style.display = 'flex';
        analyzeBtn.disabled = true;
        cancelBtn.disabled = true;
        selectedFile = null;
        
        if (detectionResult) {
            detectionResult.style.display = 'none';
        }
        
        if (resultsCard) {
            resultsCard.style.display = 'none';
        }
    }

    // Event Listeners
    function setupEventListeners() {
        // File input change
        if (imageUpload) {
            imageUpload.addEventListener('change', function(e) {
                if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                }
            });
        }

        // Drag and drop events
        if (dropZone) {
            // Prevent default drag behaviors
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
            });

            // Add highlight on drag over
            ['dragenter', 'dragover'].forEach(eventName => {
                dropZone.addEventListener(eventName, function() {
                    dropZone.classList.add('highlight');
                });
            });

            // Remove highlight on drag leave or drop
            ['dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, function() {
                    dropZone.classList.remove('highlight');
                });
            });

            // Handle file drop
            dropZone.addEventListener('drop', function(e) {
                const dt = e.dataTransfer;
                const file = dt.files[0];
                if (file) {
                    handleFileSelect(file);
                    // Update the file input
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    imageUpload.files = dataTransfer.files;
                }
            });
        }

        // Clear preview button
        if (clearPreviewBtn) {
            clearPreviewBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                resetFileInput();
            });
        }

        // Cancel button
        if (cancelBtn) {
            cancelBtn.addEventListener('click', resetFileInput);
        }
    }

    // Handle file selection and validation
    function handleFileSelect(file) {
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showError('File size should be less than 5MB');
            return;
        }
        
        // Check file type
        if (!file.type.match('image.*')) {
            showError('Please select a valid image file (JPG, PNG)');
            return;
        }
        
        selectedFile = file;
        
        // Show preview
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreviewContainer.style.display = 'flex';
            dropZone.style.display = 'none';
            analyzeBtn.disabled = false;
            cancelBtn.disabled = false;
            
            // Hide previous results
            if (detectionResult) detectionResult.style.display = 'none';
            if (resultsCard) resultsCard.style.display = 'none';
        };
        reader.onerror = function() {
            showError('Error reading the file');
        };
        reader.readAsDataURL(file);
    }
    

    // Image Analysis
    async function analyzeImage() {
        if (!selectedFile) return;
        
        analyzeBtn.disabled = true;
        if (loadingIndicator) loadingIndicator.style.display = 'flex';
        if (detectionResult) detectionResult.style.display = 'none';
        if (resultsCard) {
            resultsCard.style.display = 'block';
            resultsCard.scrollIntoView({ behavior: 'smooth' });
        }
        
        const formData = new FormData();
        formData.append('image', selectedFile);
        
        try {
            const response = await fetch('http://localhost:5000/analyze', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            displayResults(data);
            
        } catch (error) {
            console.error('Error:', error);
            showError('Failed to analyze the image. Please try again.');
        } finally {
            if (loadingIndicator) loadingIndicator.style.display = 'none';
            analyzeBtn.disabled = false;
        }
    }

    // Initialize the application
    function init() {
        setupEventListeners();
        
        // Set up analyze button
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', analyzeImage);
        }
        
        // Initial reset
        resetFileInput();
    }
    
    // Start the application
    init();
    
    // Display analysis results
    function displayResults(data) {
        if (!detectionResult) return;
        
        let resultHTML = `
            <div class="result-item">
                <h4>Analysis Results</h4>
                <p><strong>Status:</strong> <span class="status">${data.status || 'Completed'}</span></p>
        `;
        
        // Add plant information if available
        if (data.plants && data.plants.length > 0) {
            data.plants.forEach(plant => {
                resultHTML += `
                    <div class="plant-info">
                        <h5>${plant.name || 'Plant'}</h5>
                        ${plant.scientific_name ? `<p><strong>Scientific Name:</strong> ${plant.scientific_name}</p>` : ''}
                        ${plant.health_status ? `<p><strong>Health Status:</strong> <span class="status ${getStatusClass(plant.health_status)}">${plant.health_status}</span></p>` : ''}
                        ${plant.confidence ? `<p><strong>Confidence:</strong> ${plant.confidence}%</p>` : ''}
                        ${plant.description ? `<p>${plant.description}</p>` : ''}
                    </div>
                `;
                
                // Add disease info if available
                if (plant.disease) {
                    resultHTML += `
                        <div class="disease-info">
                            <h5>Detected Issue</h5>
                            <p><strong>${plant.disease.name || 'Disease'}</strong></p>
                            ${plant.disease.description ? `<p>${plant.disease.description}</p>` : ''}
                        </div>
                    `;
                }
                
                // Add care tips if available
                if (plant.care_tips && plant.care_tips.length > 0) {
                    resultHTML += `
                        <div class="care-tips">
                            <h5>Care Recommendations</h5>
                            <ul>
                                ${plant.care_tips.map(tip => `<li>${tip}</li>`).join('')}
                            </ul>
                        </div>
                    `;
                }
            });
        } else {
            // Fallback for different response formats
            resultHTML += `<p>${data.message || 'No specific issues detected.'}</p>`;
        }
        
        resultHTML += `</div>`; // Close result-item
        
        detectionResult.innerHTML = resultHTML;
        detectionResult.style.display = 'block';
        
        // Show results card if it exists
        if (resultsCard) {
            resultsCard.style.display = 'block';
            resultsCard.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Helper function to get status class for styling
    function getStatusClass(status) {
        if (!status) return '';
        
        const statusLower = status.toLowerCase();
        if (statusLower.includes('healthy')) return 'status-healthy';
        if (statusLower.includes('unhealthy') || statusLower.includes('disease')) return 'status-unhealthy';
        if (statusLower.includes('moderate') || statusLower.includes('slight')) return 'status-moderate';
        return '';
    }

    // Add essential styles if not already in the main CSS
    const style = document.createElement('style');
        /* Responsive adjustments */
        @media (max-width: 768px) {
            .action-buttons {
                flex-direction: column;
                gap: 0.75rem;
            }
            
            .btn {
                width: 100%;
            }
        }
    `;
    document.head.appendChild(style);
});

    