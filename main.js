const elementData = {
    // Element properties - metal, nonmetal, noble gas
    'H': { type: 'nonmetal', description: 'Lightest element, highly reactive gas' },
    'He': { type: 'noble', description: 'Inert gas, used in balloons and cryogenics' },
    // Add more elements with their properties...
};

function initializePeriodicTable() {
    const searchInput = document.getElementById('searchElement');
    const propertyFilter = document.getElementById('propertyFilter');
    const elements = document.querySelectorAll('.element');

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        elements.forEach(element => {
            const symbol = element.querySelector('.symbol').textContent;
            const name = element.querySelector('.details').textContent.split('\n')[0];
            
            if (symbol.toLowerCase().includes(searchTerm) || 
                name.toLowerCase().includes(searchTerm)) {
                element.classList.remove('filtered-out');
            } else {
                element.classList.add('filtered-out');
            }
        });
    });

    // Property filter functionality
    propertyFilter.addEventListener('change', (e) => {
        const filterValue = e.target.value;
        
        elements.forEach(element => {
            const symbol = element.querySelector('.symbol').textContent;
            const elementType = elementData[symbol]?.type || 'metal';

            if (filterValue === 'all' || elementType === filterValue) {
                element.classList.remove('filtered-out');
            } else {
                element.classList.add('filtered-out');
            }
        });
    });

    // Hover information
    elements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const symbol = e.currentTarget.querySelector('.symbol').textContent;
            const elementInfo = elementData[symbol];
            
            if (elementInfo) {
                showElementInfo(e.currentTarget, elementInfo);
            }
        });

        element.addEventListener('mouseleave', () => {
            hideElementInfo();
        });
    });
}

function showElementInfo(element, info) {
    let infoBox = document.getElementById('element-info');
    if (!infoBox) {
        infoBox = document.createElement('div');
        infoBox.id = 'element-info';
        infoBox.className = 'element-info';
        document.body.appendChild(infoBox);
    }

    infoBox.innerHTML = `
        <h3>${element.querySelector('.symbol').textContent}</h3>
        <p>${element.querySelector('.details').textContent}</p>
        <p>Type: ${info.type}</p>
        <p>${info.description}</p>
    `;

    const rect = element.getBoundingClientRect();
    infoBox.style.left = `${rect.right + 10}px`;
    infoBox.style.top = `${rect.top}px`;
    infoBox.style.display = 'block';
}

function hideElementInfo() {
    const infoBox = document.getElementById('element-info');
    if (infoBox) {
        infoBox.style.display = 'none';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePeriodicTable);
