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
    
    // Add positioning class
    card.classList.add('element-hover-card');
    
    return card;
}

// Add new styles for hover cards
const cardStyles = document.createElement('style');
cardStyles.textContent = `
    .element-hover-card {
        position: fixed;
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 20px;
        min-width: 300px;
        color: white;
        z-index: 1000;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        transition: opacity 0.2s ease, transform 0.2s ease;
        pointer-events: none;
    }

    .element-hover-card h2 {
        font-size: 2em;
        margin: 0 0 5px 0;
        color: #ffd700;
    }

    .element-hover-card h3 {
        font-size: 1.2em;
        margin: 0 0 15px 0;
        color: rgba(255, 255, 255, 0.8);
    }

    .property-grid {
        display: grid;
        gap: 10px;
    }

    .property {
        display: grid;
        grid-template-columns: 1fr 1.5fr;
        gap: 10px;
        align-items: center;
    }

    .property label {
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.9em;
    }

    .property span {
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.9em;
    }
`;
document.head.appendChild(cardStyles);

function initializeElements() {
    const propertyFilter = document.getElementById('propertyFilter');
    const elements = document.querySelectorAll('.element');
    
    // Create search button and modal
    const searchButton = document.createElement('button');
    searchButton.innerHTML = '🔍';
    searchButton.className = 'search-button';
    document.body.appendChild(searchButton);

    const searchModal = document.createElement('div');
    searchModal.className = 'search-modal';
    searchModal.innerHTML = `
        <div class="search-container">
            <input type="text" id="searchElement" placeholder="Search elements...">
        </div>
    `;
    document.body.appendChild(searchModal);

    // Add search styles
    const searchStyles = document.createElement('style');
    searchStyles.textContent = `
        .search-button {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: rgba(30, 41, 59, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            font-size: 20px;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            line-height: 1;
        }

        .search-button:hover {
            transform: scale(1.1);
            background: rgba(30, 41, 59, 1);
        }

        .search-modal {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1001;
            background: rgba(30, 41, 59, 0.95);
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .search-modal.active {
            display: block;
        }

        #searchElement {
            width: 300px;
            padding: 12px 20px;
            border-radius: 25px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            background: rgba(20, 30, 45, 0.9);
            color: white;
            font-size: 16px;
            outline: none;
        }
    `;
    document.head.appendChild(searchStyles);

    // Add click handlers for search
    searchButton.addEventListener('click', () => {
        searchModal.classList.add('active');
        searchModal.querySelector('#searchElement').focus();
    });

    // Close modal on escape or click outside
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchModal.classList.remove('active');
        }
    });

    document.addEventListener('click', (e) => {
        if (!searchModal.contains(e.target) && e.target !== searchButton) {
            searchModal.classList.remove('active');
        }
    });

    // Handle search input
    const searchInput = searchModal.querySelector('#searchElement');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        elements.forEach(element => {
            const symbol = element.querySelector('.symbol').textContent;
            const name = element.querySelector('.details').textContent.split('\n')[0];
            const properties = elementProperties[symbol] || defaultProperties;
            
            // Search across all properties
            const matchesSearch = [
                symbol.toLowerCase(),                    // Symbol
                name.toLowerCase(),                      // Name
                properties.category.toLowerCase(),       // Category
                properties.state.toLowerCase(),          // State
                properties.block.toLowerCase(),          // Block
                properties.electronConfig.toLowerCase(), // Electronic Configuration
                properties.type.toLowerCase()            // Type (metal/nonmetal/noble)
            ].some(text => text.includes(searchTerm));
            
            element.style.opacity = matchesSearch ? '1' : '0.2';
            element.style.pointerEvents = matchesSearch ? 'auto' : 'none';
        });
    });

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
        
        // Update hover card positioning logic
        element.addEventListener('mouseenter', (e) => {
            const hoverCard = createHoverCard(element, properties);
            document.body.appendChild(hoverCard);
            
            const rect = element.getBoundingClientRect();
            const cardRect = hoverCard.getBoundingClientRect();
            
            // Calculate available space on each side
            const spaceRight = window.innerWidth - rect.right;
            const spaceLeft = rect.left;
            const spaceTop = rect.top;
            const spaceBottom = window.innerHeight - rect.bottom;
            
            let left, top;
            
            // Horizontal positioning
            if (spaceRight >= cardRect.width + 10) {
                // Show on right if enough space
                left = rect.right + 10;
            } else if (spaceLeft >= cardRect.width + 10) {
                // Show on left if enough space
                left = rect.left - cardRect.width - 10;
            } else {
                // Center horizontally if no space on either side
                left = Math.max(10, Math.min(window.innerWidth - cardRect.width - 10,
                    rect.left + (rect.width - cardRect.width) / 2));
            }
            
            // Vertical positioning
            if (spaceBottom >= cardRect.height + 10 || spaceTop < cardRect.height) {
                // Show below element
                top = Math.min(window.innerHeight - cardRect.height - 10,
                    rect.bottom + 10);
            } else {
                // Show above element
                top = Math.max(10, rect.top - cardRect.height - 10);
            }
            
            // Apply final position
            hoverCard.style.left = `${left}px`;
            hoverCard.style.top = `${top}px`;
            
            // Add entrance animation
            hoverCard.style.opacity = '0';
            hoverCard.style.transform = 'scale(0.95)';
            requestAnimationFrame(() => {
                hoverCard.style.opacity = '1';
                hoverCard.style.transform = 'scale(1)';
            });
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
        transform: scale(1.2) translateZ(50px) !important;
        background: linear-gradient(145deg, #ffd700, #ff8c00) !important;
        border: 4px solid #ffd700 !important;
        box-shadow: 
            0 0 30px #ffd700,
            0 15px 30px rgba(0, 0, 0, 0.4) !important;
        z-index: 1000 !important;
        animation: pulseGold 2s infinite !important;
    }

    @keyframes pulseGold {
        0% { box-shadow: 0 0 30px #ffd700, 0 15px 30px rgba(0, 0, 0, 0.4); }
        50% { box-shadow: 0 0 50px #ffd700, 0 15px 30px rgba(0, 0, 0, 0.4); }
        100% { box-shadow: 0 0 30px #ffd700, 0 15px 30px rgba(0, 0, 0, 0.4); }
    }
`;
document.head.appendChild(styles);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeElements);
