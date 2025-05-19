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

function createLoadingScreen() {
    const loader = document.createElement('div');
    loader.className = 'loading-screen';
    loader.innerHTML = `
        <div class="loader-container">
            <div class="atom-loader">
                <div class="electron"></div>
                <div class="electron"></div>
                <div class="electron"></div>
            </div>
            <div class="loading-text">Loading Periodic Table...</div>
        </div>
    `;
    document.body.appendChild(loader);

    const loaderStyles = document.createElement('style');
    loaderStyles.textContent = `
        .loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #0a0f1d;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }

        .loader-container {
            text-align: center;
        }

        .atom-loader {
            width: 100px;
            height: 100px;
            position: relative;
            margin: 0 auto 20px;
        }

        .electron {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 2px solid #4a90e2;
            animation: rotate 2s linear infinite;
        }

        .electron:nth-child(1) { animation-delay: -0.5s; }
        .electron:nth-child(2) { 
            animation-delay: -1s;
            border-color: #7c4dff;
        }
        .electron:nth-child(3) { 
            animation-delay: -1.5s;
            border-color: #00ff95;
        }

        .loading-text {
            color: white;
            font-family: 'Poppins', sans-serif;
            font-size: 18px;
            letter-spacing: 2px;
            animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes rotate {
            from { transform: rotateX(60deg) rotateY(45deg) rotateZ(0); }
            to { transform: rotateX(60deg) rotateY(45deg) rotateZ(360deg); }
        }

        @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }
    `;
    document.head.appendChild(loaderStyles);
}

function initializeElements() {
    const propertyFilter = document.getElementById('propertyFilter');
    const elements = document.querySelectorAll('.element');
    
    // Create search button with toggle functionality
    const searchButton = document.createElement('button');
    searchButton.innerHTML = '🔍';
    searchButton.className = 'search-button';
    searchButton.setAttribute('data-state', 'search');
    document.body.appendChild(searchButton);

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

        .search-button[data-state="close"] {
            transform: rotate(45deg);
            font-size: 24px;
        }

        .search-button:hover {
            background: rgba(30, 41, 59, 1);
        }

        .search-modal {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.95);
            z-index: 1001;
            background: rgba(30, 41, 59, 0.95);
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
        }

        .search-modal.active {
            display: block;
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }

        #searchElement {
            width: 300px;
            padding: 12px 20px;
            padding-right: 40px;
            border-radius: 25px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            background: rgba(20, 30, 45, 0.9);
            color: white;
            font-size: 16px;
            outline: none;
        }

        .search-container {
            position: relative;
        }

        .clear-search {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.5);
            cursor: pointer;
            padding: 4px;
            line-height: 1;
            font-size: 18px;
            display: none;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            text-align: center;
        }

        .clear-search:hover {
            color: rgba(255, 255, 255, 0.8);
        }

        .clear-search.visible {
            display: flex;
        }
    `;
    document.head.appendChild(searchStyles);

    // Update search button click handler
    searchButton.addEventListener('click', () => {
        const isSearching = searchButton.getAttribute('data-state') === 'search';
        
        if (isSearching) {
            searchModal.classList.add('active');
            searchButton.innerHTML = '+';
            searchButton.setAttribute('data-state', 'close');
            searchModal.querySelector('#searchElement').focus();
        } else {
            searchModal.classList.remove('active');
            searchButton.innerHTML = '🔍';
            searchButton.setAttribute('data-state', 'search');
            searchModal.querySelector('#searchElement').value = '';
            // Reset element visibility
            elements.forEach(el => {
                el.style.opacity = '1';
                el.style.pointerEvents = 'auto';
            });
        }
    });

    // Create search modal
    const searchModal = document.createElement('div');
    searchModal.className = 'search-modal';
    searchModal.innerHTML = `
        <div class="search-container">
            <input type="text" id="searchElement" placeholder="Search elements...">
        </div>
    `;
    document.body.appendChild(searchModal);

    // Add clear button to search input
    const searchContainer = searchModal.querySelector('.search-container');
    const clearButton = document.createElement('button');
    clearButton.className = 'clear-search';
    clearButton.innerHTML = '×';
    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        clearButton.classList.remove('visible');
        // Reset element visibility
        elements.forEach(el => {
            el.style.opacity = '1';
            el.style.pointerEvents = 'auto';
        });
        searchInput.focus();
    });
    searchContainer.appendChild(clearButton);

    // Handle search input
    const searchInput = searchModal.querySelector('#searchElement');
    searchInput.addEventListener('input', (e) => {
        const hasValue = e.target.value.length > 0;
        clearButton.classList.toggle('visible', hasValue);
        
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
document.addEventListener('DOMContentLoaded', () => {
    createLoadingScreen();
    
    // Start loading assets and initialization in the background
    Promise.all([
        new Promise(resolve => {
            initializeElements();
            resolve();
        }),
        // Minimum loading time for animation
        new Promise(resolve => setTimeout(resolve, 2000))
    ]).then(() => {
        // Remove loading screen with fade out
        const loader = document.querySelector('.loading-screen');
        if (loader) {
            loader.style.transition = 'opacity 0.5s ease-out';
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
                // Trigger initial animation
                transform(targets.table, 2000);
            }, 500);
        }
    });
});
