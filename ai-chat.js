// AI Chat Functionality

class SmartCropAI {
    constructor() {
        this.conversationHistory = [];
        this.isLoading = false;
        this.apiUrl = 'http://localhost:5000/chat';
    }
    
    initializeResponses() {
        return {
            // Fertilizer recommendations
            'fertilizer': {
                'wheat': 'For wheat cultivation, I recommend using NPK fertilizer with a ratio of 120:60:40 kg/ha. Apply 50% nitrogen as basal dose and remaining 50% in two equal splits at crown root initiation and jointing stage. Also consider applying 25 kg/ha of zinc sulfate if soil is deficient.',
                'rice': 'For rice, use NPK at 120:60:60 kg/ha ratio. Apply full phosphorus and potash as basal dose. Nitrogen should be applied in 3 splits: 50% basal, 25% at tillering, and 25% at panicle initiation stage.',
                'cotton': 'Cotton requires NPK at 120:60:60 kg/ha. Apply 25% N as basal, 50% at square formation, and 25% at flowering. Include micronutrients like boron (1 kg/ha) and zinc (5 kg/ha).',
                'default': 'For general fertilizer recommendations, soil testing is crucial. Based on typical requirements, use NPK at 100:50:50 kg/ha as a starting point, but adjust based on your soil test results and crop requirements.'
            },
            
            // Pest identification and management
            'pest': {
                'identification': 'To identify pest damage, look for these signs: 1) Leaf damage patterns (holes, yellowing, wilting), 2) Presence of insects on plants, 3) Sticky honeydew on leaves, 4) Distorted growth. Upload a clear photo for specific identification.',
                'aphids': 'For aphid control, use integrated pest management: 1) Spray neem oil (3-5ml/L), 2) Release ladybugs or lacewing predators, 3) Use yellow sticky traps, 4) Apply imidacloprid if infestation is severe.',
                'bollworm': 'For bollworm in cotton: 1) Monitor with pheromone traps, 2) Spray Bt-based insecticide, 3) Use nuclear polyhedrosis virus (NPV), 4) Apply neem-based products during early instar stages.',
                'default': 'For general pest management, follow IPM principles: 1) Regular monitoring, 2) Cultural practices (crop rotation, clean cultivation), 3) Biological control, 4) Chemical control as last resort.'
            },
            
            // Disease management
            'disease': {
                'fungal': 'For fungal diseases: 1) Ensure proper drainage and air circulation, 2) Apply copper-based fungicides preventively, 3) Use resistant varieties, 4) Practice crop rotation, 5) Remove infected plant debris.',
                'bacterial': 'For bacterial diseases: 1) Use copper-based bactericides, 2) Ensure proper sanitation, 3) Avoid overhead irrigation, 4) Use pathogen-free seeds, 5) Practice crop rotation.',
                'viral': 'For viral diseases: 1) Control vector insects (aphids, whiteflies), 2) Use virus-free planting material, 3) Remove infected plants immediately, 4) Apply reflective mulches to deter vectors.',
                'default': 'For disease management, early detection is key. Practice preventive measures: crop rotation, proper spacing, balanced nutrition, and regular monitoring. Send plant samples to lab for accurate diagnosis.'
            },
            
            // Irrigation and water management
            'irrigation': {
                'scheduling': 'For irrigation scheduling: 1) Monitor soil moisture at 15-30cm depth, 2) Water when moisture drops to 70% of field capacity, 3) Apply 3-5cm water per irrigation, 4) Avoid irrigation during flowering in some crops.',
                'drip': 'Drip irrigation benefits: 1) 30-50% water savings, 2) Better nutrient management, 3) Reduced weed growth, 4) Lower labor costs. Install with 16mm laterals spaced 1.5m apart.',
                'deficit': 'Deficit irrigation strategy: 1) Apply less water during vegetative stage, 2) Ensure adequate water during critical stages (flowering, grain filling), 3) Monitor plant stress indicators.',
                'default': 'Water management is crucial for crop success. Check soil moisture regularly, avoid waterlogging, and adjust irrigation based on weather conditions and crop stage.'
            },
            
            // Harvest timing
            'harvest': {
                'wheat': 'Harvest wheat when: 1) Grain moisture is 12-14%, 2) Grains are hard and cannot be dented with fingernail, 3) Lower leaves are yellowing, 4) Morning harvest is preferred to reduce shattering losses.',
                'rice': 'Harvest rice when: 1) 80-85% grains are straw colored, 2) Moisture content is 20-25%, 3) Grains feel firm when pressed, 4) Harvest in morning hours for better quality.',
                'cotton': 'Cotton picking: 1) Pick when bolls are fully opened, 2) Fiber moisture is below 12%, 3) Avoid picking after rain or morning dew, 4) Multiple picks may be needed.',
                'default': 'Proper harvest timing ensures maximum yield and quality. Monitor crop maturity indicators and weather conditions. Harvest during dry conditions when possible.'
            },
            
            // Weather-based advice
            'weather': {
                'rain': 'With upcoming rain: 1) Postpone irrigation and fertilizer application, 2) Ensure proper drainage, 3) Apply preventive fungicide spray, 4) Delay harvesting operations, 5) Cover harvested produce.',
                'drought': 'During drought: 1) Apply mulch to conserve moisture, 2) Use drought-tolerant varieties, 3) Practice deficit irrigation, 4) Adjust planting dates, 5) Apply anti-transpirants.',
                'heatwave': 'During heatwave: 1) Provide shade nets if possible, 2) Increase irrigation frequency, 3) Apply potassium to improve heat tolerance, 4) Harvest early morning or evening.',
                'default': 'Weather impacts farming significantly. Monitor forecasts regularly and adjust farming practices accordingly. Use weather-based advisory services for better planning.'
            }
        };
    }
    
    processQuery(query) {
        const lowerQuery = query.toLowerCase();
        let category = 'general';
        let subCategory = 'default';
        
        // Determine category based on keywords
        if (this.containsKeywords(lowerQuery, ['fertilizer', 'nutrient', 'npk', 'urea', 'phosphorus', 'potassium'])) {
            category = 'fertilizer';
            if (this.containsKeywords(lowerQuery, ['wheat'])) subCategory = 'wheat';
            else if (this.containsKeywords(lowerQuery, ['rice', 'paddy'])) subCategory = 'rice';
            else if (this.containsKeywords(lowerQuery, ['cotton'])) subCategory = 'cotton';
        }
        else if (this.containsKeywords(lowerQuery, ['pest', 'insect', 'bug', 'aphid', 'bollworm', 'caterpillar'])) {
            category = 'pest';
            if (this.containsKeywords(lowerQuery, ['identify', 'identification', 'damage'])) subCategory = 'identification';
            else if (this.containsKeywords(lowerQuery, ['aphid'])) subCategory = 'aphids';
            else if (this.containsKeywords(lowerQuery, ['bollworm'])) subCategory = 'bollworm';
        }
        else if (this.containsKeywords(lowerQuery, ['disease', 'fungus', 'bacterial', 'virus', 'infection', 'rot'])) {
            category = 'disease';
            if (this.containsKeywords(lowerQuery, ['fungal', 'fungus'])) subCategory = 'fungal';
            else if (this.containsKeywords(lowerQuery, ['bacterial'])) subCategory = 'bacterial';
            else if (this.containsKeywords(lowerQuery, ['viral', 'virus'])) subCategory = 'viral';
        }
        else if (this.containsKeywords(lowerQuery, ['irrigation', 'water', 'watering', 'drip', 'sprinkler'])) {
            category = 'irrigation';
            if (this.containsKeywords(lowerQuery, ['schedule', 'timing', 'when'])) subCategory = 'scheduling';
            else if (this.containsKeywords(lowerQuery, ['drip'])) subCategory = 'drip';
            else if (this.containsKeywords(lowerQuery, ['deficit', 'less water'])) subCategory = 'deficit';
        }
        else if (this.containsKeywords(lowerQuery, ['harvest', 'harvesting', 'when to harvest', 'maturity'])) {
            category = 'harvest';
            if (this.containsKeywords(lowerQuery, ['wheat'])) subCategory = 'wheat';
            else if (this.containsKeywords(lowerQuery, ['rice', 'paddy'])) subCategory = 'rice';
            else if (this.containsKeywords(lowerQuery, ['cotton'])) subCategory = 'cotton';
        }
        else if (this.containsKeywords(lowerQuery, ['weather', 'rain', 'drought', 'heat', 'temperature'])) {
            category = 'weather';
            if (this.containsKeywords(lowerQuery, ['rain', 'rainfall'])) subCategory = 'rain';
            else if (this.containsKeywords(lowerQuery, ['drought', 'dry'])) subCategory = 'drought';
            else if (this.containsKeywords(lowerQuery, ['heat', 'hot', 'temperature'])) subCategory = 'heatwave';
        }
        
        // Get response
        const categoryResponses = this.responses[category];
        if (categoryResponses && categoryResponses[subCategory]) {
            return categoryResponses[subCategory];
        }
        
        // Default responses for common queries
        if (this.containsKeywords(lowerQuery, ['hello', 'hi', 'hey', 'good morning', 'good evening'])) {
            return "Hello! I'm your SmartCrop AI assistant. I'm here to help you with farming questions about crops, fertilizers, pest management, irrigation, and more. What would you like to know?";
        }
        
        if (this.containsKeywords(lowerQuery, ['thank you', 'thanks', 'appreciate'])) {
            return "You're welcome! I'm glad I could help. Feel free to ask if you have more farming questions. Good luck with your crops! 🌱";
        }
        
        // Default fallback
        return "I'd be happy to help you with that farming question! For the most accurate advice, could you provide more specific details? I can assist with:\n\n• Fertilizer recommendations\n• Pest and disease management\n• Irrigation scheduling\n• Harvest timing\n• Weather-based farming advice\n\nWhat specific aspect would you like to know about?";
    }
    
    containsKeywords(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }
    
    addToHistory(userMessage, aiResponse) {
        this.conversationHistory.push({
            user: userMessage,
            ai: aiResponse,
            timestamp: new Date().toLocaleTimeString()
        });
    }
}

// Initialize AI Assistant
const smartCropAI = new SmartCropAI();

async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
            hideTypingIndicator();
        }
    }
}

// Initialize AI Assistant
const smartCropAI = new SmartCropAI();

async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (message && !smartCropAI.isLoading) {
        await smartCropAI.getAIResponse(message);
        messageInput.value = '';
    }
}

async function sendQuickQuestion(question) {
    if (smartCropAI.isLoading) return;
    
    addMessageToChat(question, 'user');
    
    showTypingIndicator();
    smartCropAI.isLoading = true;
    
    try {
        // Call Gemini API through backend
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: question })
        });
        
        if (response.ok) {
            const data = await response.json();
            hideTypingIndicator();
            addMessageToChat(data.reply, 'ai');
            smartCropAI.addToHistory(question, data.reply);
        } else {
            hideTypingIndicator();
            addMessageToChat('Sorry, I encountered an error. Please try again.', 'ai');
        }
    } catch (error) {
        console.error('Error calling AI API:', error);
        hideTypingIndicator();
        addMessageToChat('Sorry, I cannot connect to the AI service right now. Please try again later.', 'ai');
    } finally {
        smartCropAI.isLoading = false;
    }
}

function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas ${sender === 'user' ? 'fa-user' : 'fa-robot'}"></i>
        </div>
        <div class="message-content">
            <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
        <div class="message-time">${currentTime}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add animation
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(20px)';
    setTimeout(() => {
        messageDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 100);
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typingIndicator';
    typingDiv.className = 'message ai-message';
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="typing-animation">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add typing animation styles
    const style = document.createElement('style');
    style.textContent = `
        .typing-animation {
            display: flex;
            gap: 4px;
            align-items: center;
            padding: 10px 0;
        }
        .typing-animation span {
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
            animation: typing 1.4s infinite ease-in-out;
        }
        .typing-animation span:nth-child(1) { animation-delay: 0.2s; }
        .typing-animation span:nth-child(2) { animation-delay: 0.4s; }
        .typing-animation span:nth-child(3) { animation-delay: 0.6s; }
        @keyframes typing {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
            30% { transform: translateY(-10px); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function handleEnter(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Auto-resize input
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 100) + 'px';
        });
    }
    
    // Add welcome message
    setTimeout(() => {
        const welcomeMessage = "Welcome to SmartCrop AI! I'm here to help you with farming questions. You can ask me about fertilizers, pest control, irrigation, harvest timing, and weather-based farming advice. What would you like to know?";
        addMessageToChat(welcomeMessage, 'ai');
    }, 1000);
});

// Export functions for global access
window.sendMessage = sendMessage;
window.sendQuickQuestion = sendQuickQuestion;
window.handleEnter = handleEnter;