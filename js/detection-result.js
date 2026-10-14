document.addEventListener('DOMContentLoaded', function() {
    const resultData = JSON.parse(localStorage.getItem('detectionResult'));
    const resultContainer = document.getElementById('resultContainer');
    const emptyState = document.getElementById('emptyState');
    
    if (!resultData || !resultData.plants) {
        emptyState.style.display = 'block';
        return;
    }

    // Hide empty state
    emptyState.style.display = 'none';
    
    // Display the uploaded image
    const imageSection = document.createElement('div');
    imageSection.className = 'result-image-section';
    const img = document.createElement('img');
    img.src = resultData.imageUrl;
    img.alt = 'Uploaded plant image';
    img.className = 'result-image';
    imageSection.appendChild(img);
    resultContainer.appendChild(imageSection);

    // Create plants section
    const plantsSection = document.createElement('div');
    plantsSection.className = 'plants-section';
    
    // Add section header
    const plantsHeader = document.createElement('h2');
    plantsHeader.innerHTML = '<i class="fas fa-seedling"></i> Detected Plants';
    plantsSection.appendChild(plantsHeader);
    
    // Add each plant card
    resultData.plants.forEach((plant, index) => {
        const plantCard = document.createElement('div');
        plantCard.className = 'plant-card';
        
        // Plant header with name and health status
        const plantHeader = document.createElement('div');
        plantHeader.className = 'plant-header';
        
        const plantName = document.createElement('h3');
        plantName.textContent = `${plant.name} (${plant.scientific_name || 'Scientific name not available'})`;
        
        const healthStatus = document.createElement('span');
        healthStatus.className = `health-tag ${plant.health_status.toLowerCase().replace(' ', '-')}`;
        healthStatus.innerHTML = `<i class="fas ${getHealthIcon(plant.health_status)}"></i> ${capitalizeFirstLetter(plant.health_status)} (${plant.confidence}%)`;
        
        plantHeader.appendChild(plantName);
        plantHeader.appendChild(healthStatus);
        
        // Plant details
        const plantDetails = document.createElement('div');
        plantDetails.className = 'plant-details';
        
        // Location in image
        if (plant.location_in_image) {
            const location = document.createElement('p');
            location.className = 'plant-location';
            location.innerHTML = `<i class="fas fa-map-marker-alt"></i> Location: ${formatLocation(plant.location_in_image)}`;
            plantDetails.appendChild(location);
        }
        
        // Description
        if (plant.description) {
            const description = document.createElement('div');
            description.className = 'plant-description';
            description.innerHTML = `<p>${plant.description}</p>`;
            plantDetails.appendChild(description);
        }
        
        // Care tips
        if (plant.care_tips && plant.care_tips.length > 0) {
            const careTips = document.createElement('div');
            careTips.className = 'care-tips';
            
            const tipsHeader = document.createElement('h4');
            tipsHeader.innerHTML = '<i class="fas fa-heart"></i> Care Recommendations';
            careTips.appendChild(tipsHeader);
            
            const tipsList = document.createElement('ul');
            plant.care_tips.forEach(tip => {
                if (tip.trim()) {
                    const li = document.createElement('li');
                    li.textContent = tip.replace(/^[-\*]\s*/, '').trim();
                    tipsList.appendChild(li);
                }
            });
            
            careTips.appendChild(tipsList);
            plantDetails.appendChild(careTips);
        }
        
        // Assemble plant card
        plantCard.appendChild(plantHeader);
        plantCard.appendChild(plantDetails);
        plantsSection.appendChild(plantCard);
    });
    
    resultContainer.appendChild(plantsSection);
    
    // Add environment section if available
    if (resultData.environment) {
        const envSection = document.createElement('div');
        envSection.className = 'environment-section';
        
        const envHeader = document.createElement('h2');
        envHeader.innerHTML = '<i class="fas fa-leaf"></i> Environment Analysis';
        envSection.appendChild(envHeader);
        
        const envDetails = document.createElement('div');
        envDetails.className = 'environment-details';
        
        // Soil condition
        if (resultData.environment.soil_condition) {
            const soil = document.createElement('div');
            soil.className = 'env-item';
            soil.innerHTML = `<i class="fas fa-mountain"></i> <strong>Soil:</strong> ${resultData.environment.soil_condition}`;
            envDetails.appendChild(soil);
        }
        
        // Light condition
        if (resultData.environment.light_condition) {
            const light = document.createElement('div');
            light.className = 'env-item';
            light.innerHTML = `<i class="fas fa-sun"></i> <strong>Light:</strong> ${resultData.environment.light_condition}`;
            envDetails.appendChild(light);
        }
        
        // Water condition
        if (resultData.environment.water_condition) {
            const water = document.createElement('div');
            water.className = 'env-item';
            water.innerHTML = `<i class="fas fa-tint"></i> <strong>Water:</strong> ${resultData.environment.water_condition}`;
            envDetails.appendChild(water);
        }
        
        // Surrounding objects
        if (resultData.environment.surrounding_objects && resultData.environment.surrounding_objects.length > 0) {
            const objects = document.createElement('div');
            objects.className = 'env-item';
            
            const objectsList = resultData.environment.surrounding_objects
                .map(obj => `${obj.name} (${obj.type}, ${obj.impact} impact)`)
                .join(', ');
                
            objects.innerHTML = `<i class="fas fa-object-group"></i> <strong>Surrounding Objects:</strong> ${objectsList}`;
            envDetails.appendChild(objects);
        }
        
        envSection.appendChild(envDetails);
        resultContainer.appendChild(envSection);
    }
    
    // Add overall recommendations if available
    if (resultData.recommendations && resultData.recommendations.length > 0) {
        const recSection = document.createElement('div');
        recSection.className = 'recommendations-section';
        
        const recHeader = document.createElement('h2');
        recHeader.innerHTML = '<i class="fas fa-clipboard-check"></i> Overall Recommendations';
        recSection.appendChild(recHeader);
        
        const recList = document.createElement('ul');
        recList.className = 'recommendations-list';
        
        resultData.recommendations.forEach(rec => {
            if (rec.trim()) {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fas fa-check-circle"></i> ${rec}`;
                recList.appendChild(li);
            }
        });
        
        recSection.appendChild(recList);
        resultContainer.appendChild(recSection);
    }
    
    // Add back button
    const backButton = document.createElement('div');
    backButton.className = 'back-button-container';
    backButton.innerHTML = `
        <a href="image-detection.html" class="btn btn-back">
            <i class="fas fa-arrow-left"></i> Analyze Another Image
        </a>
    `;
    resultContainer.appendChild(backButton);
});

// Helper functions
function getHealthIcon(healthStatus) {
    const status = healthStatus.toLowerCase();
    if (status.includes('healthy')) return 'fa-heart';
    if (status.includes('slightly')) return 'fa-heart-broken';
    if (status.includes('unhealthy')) return 'fa-heart-broken';
    return 'fa-question-circle';
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function formatLocation(location) {
    return location
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
