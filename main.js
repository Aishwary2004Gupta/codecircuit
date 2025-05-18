const elementProperties = {
    // Metals (Groups 1-12 and parts of 13-16)
    'Li': { type: 'metal', category: 'Alkali Metal', state: 'Solid', block: 's', electronConfig: '[He] 2s¹' },
    'Na': { type: 'metal', category: 'Alkali Metal', state: 'Solid', block: 's', electronConfig: '[Ne] 3s¹' },
    'K': { type: 'metal', category: 'Alkali Metal', state: 'Solid', block: 's', electronConfig: '[Ar] 4s¹' },
    'Be': { type: 'metal', category: 'Alkaline Earth Metal', state: 'Solid', block: 's', electronConfig: '[He] 2s²' },
    'Mg': { type: 'metal', category: 'Alkaline Earth Metal', state: 'Solid', block: 's', electronConfig: '[Ne] 3s²' },
    'Ca': { type: 'metal', category: 'Alkaline Earth Metal', state: 'Solid', block: 's', electronConfig: '[Ar] 4s²' },
    'Fe': { type: 'metal', category: 'Transition Metal', state: 'Solid', block: 'd', electronConfig: '[Ar] 3d⁶ 4s²' },
    'Cu': { type: 'metal', category: 'Transition Metal', state: 'Solid', block: 'd', electronConfig: '[Ar] 3d¹⁰ 4s¹' },
    'Zn': { type: 'metal', category: 'Transition Metal', state: 'Solid', block: 'd', electronConfig: '[Ar] 3d¹⁰ 4s²' },
    'Al': { type: 'metal', category: 'Post-Transition Metal', state: 'Solid', block: 'p', electronConfig: '[Ne] 3s² 3p¹' },
    'Sn': { type: 'metal', category: 'Post-Transition Metal', state: 'Solid', block: 'p', electronConfig: '[Kr] 4d¹⁰ 5s² 5p²' },
    'Pb': { type: 'metal', category: 'Post-Transition Metal', state: 'Solid', block: 'p', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²' },
    'Au': { type: 'metal', category: 'Transition Metal', state: 'Solid', block: 'd', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹' },

    // Non-metals (Groups 14-17)
    'H': { type: 'nonmetal', category: 'Reactive Nonmetal', state: 'Gas', block: 's', electronConfig: '1s¹' },
    'C': { type: 'nonmetal', category: 'Reactive Nonmetal', state: 'Solid', block: 'p', electronConfig: '[He] 2s² 2p²' },
    'N': { type: 'nonmetal', category: 'Reactive Nonmetal', state: 'Gas', block: 'p', electronConfig: '[He] 2s² 2p³' },
    'O': { type: 'nonmetal', category: 'Reactive Nonmetal', state: 'Gas', block: 'p', electronConfig: '[He] 2s² 2p⁴' },
    'F': { type: 'nonmetal', category: 'Halogen', state: 'Gas', block: 'p', electronConfig: '[He] 2s² 2p⁵' },
    'P': { type: 'nonmetal', category: 'Reactive Nonmetal', state: 'Solid', block: 'p', electronConfig: '[Ne] 3s² 3p³' },
    'S': { type: 'nonmetal', category: 'Reactive Nonmetal', state: 'Solid', block: 'p', electronConfig: '[Ne] 3s² 3p⁴' },
    'Cl': { type: 'nonmetal', category: 'Halogen', state: 'Gas', block: 'p', electronConfig: '[Ne] 3s² 3p⁵' },
    'I': { type: 'nonmetal', category: 'Halogen', state: 'Solid', block: 'p', electronConfig: '[Kr] 4d¹⁰ 5s² 5p⁵' },

    // Noble Gases (Group 18)
    'He': { type: 'noble', category: 'Noble Gas', state: 'Gas', block: 's', electronConfig: '1s²' },
    'Ne': { type: 'noble', category: 'Noble Gas', state: 'Gas', block: 'p', electronConfig: '[He] 2s² 2p⁶' },
    'Ar': { type: 'noble', category: 'Noble Gas', state: 'Gas', block: 'p', electronConfig: '[Ne] 3s² 3p⁶' },
    'Kr': { type: 'noble', category: 'Noble Gas', state: 'Gas', block: 'p', electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁶' },
    'Xe': { type: 'noble', category: 'Noble Gas', state: 'Gas', block: 'p', electronConfig: '[Kr] 4d¹⁰ 5s² 5p⁶' },
    'Rn': { type: 'noble', category: 'Noble Gas', state: 'Gas', block: 'p', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶' },
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
    const details = element.querySelector('.details').textContent;
    const mass = element.querySelector('.atomic-mass')?.textContent || details.split('\n')[1] || '';
    
    card.innerHTML = `
        <h2>${symbol}</h2>
        <h3>${details}</h3>
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
        
        element.classList.add(`property-${properties.type}`);
        
        // Add click handler for highlight
        element.addEventListener('click', (e) => {
            // Remove highlight from other elements
            elements.forEach(el => el.classList.remove('element-highlighted'));
            // Add highlight to clicked element
            element.classList.add('element-highlighted');
        });
        
        // Add hover card functionality
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

    // Add click handler to remove highlight when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.element')) {
            elements.forEach(el => el.classList.remove('element-highlighted'));
        }
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

// Add styles for highlight effect
const styles = document.createElement('style');
styles.textContent = `
    .element-highlighted {
        transform: scale(1.15) translateZ(30px) !important;
        box-shadow: 0 0 30px rgba(255, 165, 0, 0.8) !important;
        z-index: 1000 !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
`;
document.head.appendChild(styles);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeElements);
