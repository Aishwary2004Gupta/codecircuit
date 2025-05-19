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
                <div class="nucleus"></div>
                <div class="electron"></div>
                <div class="electron"></div>
                <div class="electron"></div>
            </div>
            <div class="loading-text">Loading Periodic Table...</div>
            <div class="loading-progress">0%</div>
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
            background: radial-gradient(circle at center, #1a1f35 0%, #0a0f1d 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }

        .loader-container {
            text-align: center;
            transform: scale(1.2);
        }

        .atom-loader {
            width: 150px;
            height: 150px;
            position: relative;
            margin: 0 auto 30px;
            perspective: 800px;
        }

        .nucleus {
            position: absolute;
            width: 30px;
            height: 30px;
            background: #ff6b6b;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 20px #ff6b6b;
            animation: pulseNucleus 2s ease-in-out infinite;
        }

        .electron {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 2px solid transparent;
            border-left: 2px solid #4a90e2;
            border-right: 2px solid #4a90e2;
            animation: rotate 3s linear infinite;
        }

        .electron:nth-child(2) { 
            animation-delay: -1s;
            border-color: transparent #7c4dff #7c4dff transparent;
            transform: rotate(60deg);
        }
        .electron:nth-child(3) { 
            animation-delay: -2s;
            border-color: transparent #00ff95 #00ff95 transparent;
            transform: rotate(-60deg);
        }
        .electron:nth-child(4) {
            animation-delay: -3s;
            border-color: transparent #ff9f43 #ff9f43 transparent;
            transform: rotate(30deg);
        }

        .loading-text {
            color: white;
            font-family: 'Poppins', sans-serif;
            font-size: 24px;
            letter-spacing: 3px;
            margin-bottom: 15px;
            animation: glow 2s ease-in-out infinite;
        }

        .loading-progress {
            color: #4a90e2;
            font-family: 'Poppins', sans-serif;
            font-size: 18px;
            font-weight: bold;
        }

        @keyframes rotate {
            from { transform: rotateX(65deg) rotateY(45deg) rotateZ(0); }
            to { transform: rotateX(65deg) rotateY(45deg) rotateZ(360deg); }
        }

        @keyframes pulseNucleus {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
        }

        @keyframes glow {
            0%, 100% { text-shadow: 0 0 10px rgba(255,255,255,0.5); }
            50% { text-shadow: 0 0 20px rgba(255,255,255,0.8); }
        }
    `;
    document.head.appendChild(loaderStyles);

    // Simulate loading progress
    let progress = 0;
    const progressText = loader.querySelector('.loading-progress');
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        progressText.textContent = `${Math.round(progress)}%`;
        if (progress === 100) clearInterval(progressInterval);
    }, 200);

    return { loader, progressInterval };
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
    `;
    document.head.appendChild(searchStyles);

    // Update search button click handler
    searchButton.addEventListener('click', () => {
        if (isFiltered) {
            isFiltered = false;
            elements.forEach(el => {
                el.style.opacity = '1';
                el.style.pointerEvents = 'auto';
            });
            searchInput.value = '';
            searchButton.innerHTML = '🔍';
            return;
        }
        
        const isSearching = searchButton.getAttribute('data-state') === 'search';
        if (isSearching) {
            searchModal.classList.add('active');
            searchButton.setAttribute('data-state', 'close');
            searchInput.focus();
        } else {
            searchModal.classList.remove('active');
            searchButton.setAttribute('data-state', 'search');
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

    // Handle search input
    const searchInput = searchModal.querySelector('#searchElement');
    let isFiltered = false;
    
    // Add real-time search
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        elements.forEach(element => {
            const symbol = element.querySelector('.symbol').textContent;
            const name = element.querySelector('.details').textContent.split('\n')[0];
            const properties = elementProperties[symbol] || defaultProperties;
            
            const matchesSearch = [
                symbol.toLowerCase(),
                name.toLowerCase(),
                properties.category.toLowerCase(),
                properties.state.toLowerCase(),
                properties.block.toLowerCase(),
                properties.type.toLowerCase()
            ].some(text => text.includes(searchTerm));
            
            // Keep element in place but change opacity
            element.style.opacity = matchesSearch ? '1' : '0.2';
        });
    });

    // Keep existing Enter key handler
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            isFiltered = true;
            const searchTerm = e.target.value.toLowerCase();
            
            elements.forEach(element => {
                const symbol = element.querySelector('.symbol').textContent;
                const name = element.querySelector('.details').textContent.split('\n')[0];
                const properties = elementProperties[symbol] || defaultProperties;
                
                const matchesSearch = [
                    symbol.toLowerCase(),
                    name.toLowerCase(),
                    properties.category.toLowerCase(),
                    properties.state.toLowerCase(),
                    properties.block.toLowerCase(),
                    properties.type.toLowerCase()
                ].some(text => text.includes(searchTerm));
                
                element.style.opacity = matchesSearch ? '1' : '0.2';
                element.style.pointerEvents = matchesSearch ? 'auto' : 'none';
            });
            
            searchModal.classList.remove('active');
            searchButton.innerHTML = '✕';
        }
    });

    // Update click handler to clear search
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-modal') && !e.target.closest('.search-button') && isFiltered) {
            isFiltered = false;
            elements.forEach(el => {
                el.style.opacity = '1';
                el.style.pointerEvents = 'auto';
            });
            searchInput.value = '';
            searchButton.innerHTML = '🔍';
        }
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

    .element:hover {
        transform: translateY(-5px) scale(1.05);
        box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .element-hover-card {
        animation: fadeIn 0.3s ease-out;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .search-button, .search-modal, .element-hover-card {
        background: rgba(30, 41, 59, 0.8);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
`;
document.head.appendChild(styles);

// Particles.js styles and initialization
const particleStyles = document.createElement('style');
particleStyles.textContent = `
    .particles-js {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }
`;
document.head.appendChild(particleStyles);

function initParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.id = 'particles-js';
    document.body.insertBefore(particlesContainer, document.body.firstChild);
    
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#ffffff' },
            opacity: { value: 0.2 },
            size: { value: 3 },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#ffffff',
                opacity: 0.1,
                width: 1
            }
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const { loader, progressInterval } = createLoadingScreen();
    
    // Start loading assets and initialization in the background
    Promise.all([
        new Promise(resolve => {
            initializeElements();
            resolve();
        }),
        // Minimum loading time for animation
        new Promise(resolve => setTimeout(resolve, 2000))
    ]).then(() => {
        clearInterval(progressInterval);
        loader.style.transition = 'opacity 0.8s ease-out';
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
            if (typeof transform === 'function' && targets?.table) {
                transform(targets.table, 2000);
            }
        }, 800);
    });

    initParticles();
});

// Add to your existing styles
const categoryColors = {
    'Alkali Metal': '#ff6b6b',
    'Alkaline Earth Metal': '#4ecdc4',
    'Transition Metal': '#45b7d1',
    'Post-Transition Metal': '#96ceb4',
    'Reactive Nonmetal': '#ffeead',
    'Noble Gas': '#d4a4eb',
    'Halogen': '#ffcc5c'
};

// Apply colors to elements based on their category
elements.forEach(element => {
    const symbol = element.querySelector('.symbol').textContent;
    const properties = elementProperties[symbol] || defaultProperties;
    const color = categoryColors[properties.category];
    if (color) {
        element.style.borderColor = color;
        element.style.boxShadow = `0 0 15px ${color}33`;
    }
});

// Add vanilla-tilt.js effect to elements
elements.forEach(element => {
    VanillaTilt.init(element, {
        max: 15,
        speed: 400,
        glare: true,
        'max-glare': 0.2
    });
});
