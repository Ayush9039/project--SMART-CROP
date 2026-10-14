// FAQ Search and Filter Functionality

function searchFAQs() {
    const searchTerm = document.getElementById('faqSearch').value.toLowerCase();
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();
        
        if (question.includes(searchTerm) || answer.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show "no results" message if no items are visible
    const visibleItems = Array.from(faqItems).filter(item => item.style.display !== 'none');
    showNoResultsMessage(visibleItems.length === 0);
}

function filterFAQs(category) {
    const faqItems = document.querySelectorAll('.faq-item');
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    // Update active button
    categoryButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    faqItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Clear search when filtering
    document.getElementById('faqSearch').value = '';
    
    // Show "no results" message if no items are visible
    const visibleItems = Array.from(faqItems).filter(item => item.style.display !== 'none');
    showNoResultsMessage(visibleItems.length === 0);
}

function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked FAQ if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

function showNoResultsMessage(show) {
    let noResultsMsg = document.getElementById('noResultsMessage');
    
    if (show && !noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.id = 'noResultsMessage';
        noResultsMsg.className = 'no-results-message';
        noResultsMsg.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #6b7280;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; color: #d1d5db;"></i>
                <h3 style="margin-bottom: 0.5rem; color: #374151;">No FAQs found</h3>
                <p>Try adjusting your search terms or browse different categories.</p>
            </div>
        `;
        document.querySelector('.faq-container').appendChild(noResultsMsg);
    } else if (!show && noResultsMsg) {
        noResultsMsg.remove();
    }
}

// Initialize FAQ functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for FAQ search
    const searchInput = document.getElementById('faqSearch');
    if (searchInput) {
        searchInput.addEventListener('input', searchFAQs);
    }
    
    // Add keyboard support for FAQ items
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ(this);
            }
        });
        
        // Make FAQ questions focusable
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
    });
    
    // Update aria-expanded when FAQ is toggled
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const faqItem = mutation.target;
                const question = faqItem.querySelector('.faq-question');
                const isActive = faqItem.classList.contains('active');
                
                if (question) {
                    question.setAttribute('aria-expanded', isActive.toString());
                }
            }
        });
    });
    
    // Observe FAQ items for accessibility
    document.querySelectorAll('.faq-item').forEach(item => {
        observer.observe(item, { attributes: true });
    });
    
    // Add smooth scrolling to FAQ items
    const faqLinks = document.querySelectorAll('a[href^="#faq"]');
    faqLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                
                // Open the FAQ if it's closed
                if (!targetElement.classList.contains('active')) {
                    const question = targetElement.querySelector('.faq-question');
                    if (question) {
                        toggleFAQ(question);
                    }
                }
            }
        });
    });
});