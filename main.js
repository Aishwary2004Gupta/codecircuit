const elementProperties = {
    // Metals (Groups 1-12 and parts of 13-16)
    'Li': { type: 'metal', category: 'Alkali Metal', state: 'Solid', block: 's', electronConfig: '[He] 2s¹' },
    'Na': { type: 'metal', category: 'Alkali Metal', state: 'Solid', block: 's', electronConfig: '[Ne] 3s¹' },
    'Fe': { type: 'metal', category: 'Transition Metal', state: 'Solid', block: 'd', electronConfig: '[Ar] 3d⁶ 4s²' },
    'Au': { type: 'metal', category: 'Transition Metal', state: 'Solid', block: 'd', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹' },
    
    // Non-metals (Parts of groups 13-16 and group 17)
    'H': { type: 'nonmetal', category: 'Reactive Nonmetal', state: 'Gas', block: 's', electronConfig: '1s¹' },
    'C': { type: 'nonmetal', category: 'Reactive Nonmetal', state: 'Solid', block: 'p', electronConfig: '[He] 2s² 2p²' },
    'N': { type: 'nonmetal', category: 'Reactive Nonmetal', state: 'Gas', block: 'p', electronConfig: '[He] 2s² 2p³' },
    'O': { type: 'nonmetal', category: 'Reactive Nonmetal', state: 'Gas', block: 'p', electronConfig: '[He] 2s² 2p⁴' },
    
    // Noble Gases (Group 18)
    'He': { type: 'noble', category: 'Noble Gas', state: 'Gas', block: 's', electronConfig: '1s²' },
    'Ne': { type: 'noble', category: 'Noble Gas', state: 'Gas', block: 'p', electronConfig: '[He] 2s² 2p⁶' },
    'Ar': { type: 'noble', category: 'Noble Gas', state: 'Gas', block: 'p', electronConfig: '[Ne] 3s² 3p⁶' },
    // Add more elements as needed...
};

// Default type for elements not explicitly defined
const defaultProperties = {
    type: 'metal',
    category: 'Transition Metal',
    state: 'Solid',
    block: 'd',
    electronConfig: 'Not specified'
};

function createHoverCard(element, properties) {
    const card = document.createElement('div');
    card.className = 'element-hover-card';
    
    const symbol = element.querySelector('.symbol').textContent;
    const name = element.querySelector('.details').textContent.split('\n')[0];
    const mass = element.querySelector('.details').textContent.split('\n')[1];
    
    card.innerHTML = `
        <h2>${symbol}</h2>
        <h3>${name}</h3>
        <div class="property-grid">
            <div class="property">
                <label>Atomic Mass:</label>
                <span>${mass}</span>
            </div>
            <div class="property">
                <label>Category:</label>
                <span>${properties.category}</span>
            </div>
            <div class="property">
                <label>State:</label>
                <span>${properties.state}</span>
            </div>
            <div class="property">
                <label>Block:</label>
                <span>${properties.block}</span>
            </div>
            <div class="property">
                <label>Electronic Configuration:</label>
                <span>${properties.electronConfig}</span>
            </div>
        </div>
    `;
    
    return card;
}

function initializeElements() {
    const searchInput = document.getElementById('searchElement');
    const propertyFilter = document.getElementById('propertyFilter');
    const elements = document.querySelectorAll('.element');
    
    // Initialize element types and hover effects
    elements.forEach(element => {
        const symbol = element.querySelector('.symbol').textContent;
        const properties = elementProperties[symbol] || defaultProperties;
        
        // Add property class to element
        element.classList.add(`property-${properties.type}`);
        
        // Hover card functionality
        element.addEventListener('mouseenter', (e) => {
            const hoverCard = createHoverCard(element, properties);
            document.body.appendChild(hoverCard);
            
            const rect = element.getBoundingClientRect();
            const cardRect = hoverCard.getBoundingClientRect();
            
            // Position the card next to the element
            hoverCard.style.left = `${rect.right + 10}px`;
            hoverCard.style.top = `${rect.top - (cardRect.height / 2) + (rect.height / 2)}px`;
        });
        
        element.addEventListener('mouseleave', () => {
            const existingCard = document.querySelector('.element-hover-card');
            if (existingCard) {
                existingCard.remove();
            }
        });
    });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        elements.forEach(element => {
            const symbol = element.querySelector('.symbol').textContent;
            const name = element.querySelector('.details').textContent.split('\n')[0];
            const isVisible = symbol.toLowerCase().includes(searchTerm) || 
                            name.toLowerCase().includes(searchTerm);
            
            element.style.opacity = isVisible ? '1' : '0.2';
            element.style.pointerEvents = isVisible ? 'auto' : 'none';
        });
    });

    // Property filter functionality
    propertyFilter.addEventListener('change', (e) => {
        const filterValue = e.target.value;
        
        elements.forEach(element => {
            const symbol = element.querySelector('.symbol').textContent;
            const properties = elementProperties[symbol] || defaultProperties;
            
            const isVisible = filterValue === 'all' || properties.type === filterValue;
            element.style.opacity = isVisible ? '1' : '0.2';
            element.style.pointerEvents = isVisible ? 'auto' : 'none';
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeElements);
