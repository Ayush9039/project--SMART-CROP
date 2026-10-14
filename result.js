document.addEventListener('DOMContentLoaded', function() {
    const resultData = JSON.parse(localStorage.getItem('detectionResult'));
    const resultImage = document.getElementById('resultImage');
    const diseaseName = document.getElementById('diseaseName');
        const cropName = document.getElementById('cropName');
        const confidence = document.getElementById('confidence');
        const symptomsList = document.getElementById('symptomsList');
        const solutionsList = document.getElementById('solutionsList');
    const emptyState = document.getElementById('emptyState');

    if (resultData && resultData.result) {
            const result = resultData.result;
            resultImage.src = resultData.imageUrl;
            
            // Handle disease name - check both disease_name and disease fields
            const disease = result.disease_name || result.disease;
            if (result.is_healthy) {
                diseaseName.textContent = 'Healthy Plant';
            } else {
                diseaseName.textContent = disease || 'Unknown Disease';
            }
            
            // Handle crop name - check both plant_species and crop fields
            const crop = result.plant_species || result.crop;
            cropName.textContent = crop ? `Crop: ${crop}` : 'Crop: Unknown';
            
            // Handle confidence/accuracy - change to "Accuracy"
            let conf = result.confidence;
            if (typeof conf === 'number') {
                confidence.textContent = `Accuracy: ${conf}%`;
            } else if (typeof conf === 'string') {
                confidence.textContent = `Accuracy: ${conf}`;
            } else {
                confidence.textContent = 'Accuracy: -';
            }

        // Symptoms
        symptomsList.innerHTML = '';
        if (result.symptoms) {
            // Handle both string and array formats
            let symptoms = result.symptoms;
            if (typeof symptoms === 'string') {
                symptoms = symptoms.split('. ').filter(s => s.trim());
            }
            if (Array.isArray(symptoms)) {
                symptoms.forEach(symptom => {
                    const li = document.createElement('li');
                    li.textContent = symptom.trim();
                    symptomsList.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = symptoms;
                symptomsList.appendChild(li);
            }
        } else {
            const li = document.createElement('li');
            li.textContent = result.is_healthy ? 'No visible symptoms - plant appears healthy.' : 'Symptoms not specified.';
            symptomsList.appendChild(li);
        }

        // Solutions (Treatment + Prevention)
        solutionsList.innerHTML = '';
        if (result.treatment) {
            const liTreatment = document.createElement('li');
            liTreatment.innerHTML = `<strong>Treatment:</strong> ${result.treatment}`;
            solutionsList.appendChild(liTreatment);
        }
        if (result.prevention) {
            const liPrevention = document.createElement('li');
            liPrevention.innerHTML = `<strong>Prevention:</strong> ${result.prevention}`;
            solutionsList.appendChild(liPrevention);
        }
        if (result.causes) {
            const liCauses = document.createElement('li');
            liCauses.innerHTML = `<strong>Possible Causes:</strong> ${result.causes}`;
            solutionsList.appendChild(liCauses);
        }
        if (!result.treatment && !result.prevention && !result.causes) {
            const li = document.createElement('li');
            li.textContent = result.is_healthy ? 'Continue good care practices to maintain plant health.' : 'No specific recommendations available.';
            solutionsList.appendChild(li);
        }
    } else {
        // Show empty state if no result data
        document.querySelector('section.approaches .card').style.display = 'none';
        emptyState.style.display = 'block';
    }
});