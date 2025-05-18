document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const mindmap = document.getElementById('mindmap');
    const zoomLevel = document.getElementById('zoom-level');
    const nodeCount = document.getElementById('node-count');
    const statusMessage = document.getElementById('status-message');
    const newMapBtn = document.getElementById('new-map');
    const saveMapBtn = document.getElementById('save-map');
    const exportPngBtn = document.getElementById('export-png');
    const toggleThemeBtn = document.getElementById('toggle-theme');
    const bgColorInput = document.getElementById('bg-color');
    const connColorInput = document.getElementById('conn-color');
    const connWidthInput = document.getElementById('conn-width');
    
    // App State
    let nodes = [];
    let connections = [];
    let selectedNode = null;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let isConnecting = false;
    let startConnector = null;
    let tempConnection = null;
    let nextNodeId = 1;
    
    // Initialize
    initMindmap();
    
    // Event Listeners
    mindmap.addEventListener('mousedown', handleMapMouseDown);
    mindmap.addEventListener('mousemove', handleMapMouseMove);
    mindmap.addEventListener('mouseup', handleMapMouseUp);
    mindmap.addEventListener('wheel', handleZoom);
    mindmap.addEventListener('contextmenu', handleContextMenu);
    
    newMapBtn.addEventListener('click', createNewMap);
    saveMapBtn.addEventListener('click', saveMap);
    exportPngBtn.addEventListener('click', exportAsPNG);
    toggleThemeBtn.addEventListener('click', toggleTheme);
    
    bgColorInput.addEventListener('input', updateBackgroundColor);
    connColorInput.addEventListener('input', updateConnectionColor);
    connWidthInput.addEventListener('input', updateConnectionWidth);
    
    // Make node types draggable
    document.querySelectorAll('.node-type').forEach(nodeType => {
        nodeType.addEventListener('dragstart', handleDragStart);
    });
    
    mindmap.addEventListener('dragover', handleDragOver);
    mindmap.addEventListener('drop', handleDrop);
    
    // Functions
    function initMindmap() {
        // Set initial background color
        updateBackgroundColor();
        
        // Create a central node by default
        createNode('Central Idea', 'central', window.innerWidth / 2, window.innerHeight / 2);
        
        updateNodeCount();
        updateStatus('Ready to build your mind map!');
    }
    
    function createNewMap() {
        if (confirm('Are you sure you want to create a new map? All unsaved changes will be lost.')) {
            // Clear existing nodes and connections
            mindmap.innerHTML = '';
            nodes = [];
            connections = [];
            nextNodeId = 1;
            
            // Reset view
            scale = 1;
            offsetX = 0;
            offsetY = 0;
            updateTransform();
            
            // Create a new central node
            createNode('Central Idea', 'central', window.innerWidth / 2, window.innerHeight / 2);
            
            updateNodeCount();
            updateStatus('New mind map created');
        }
    }
    
    function saveMap() {
        const mapData = {
            nodes: nodes.map(node => ({
                id: node.id,
                x: node.x,
                y: node.y,
                type: node.type,
                content: node.content
            })),
            connections,
            scale,
            offsetX,
            offsetY
        };
        
        const dataStr = JSON.stringify(mapData);
        localStorage.setItem('mindmapData', dataStr);
        
        updateStatus('Mind map saved locally');
    }
    
    function loadMap() {
        const savedData = localStorage.getItem('mindmapData');
        if (savedData) {
            try {
                const mapData = JSON.parse(savedData);
                
                // Clear existing nodes
                mindmap.innerHTML = '';
                nodes = [];
                connections = [];
                
                // Restore nodes
                mapData.nodes.forEach(nodeData => {
                    createNode(
                        nodeData.content,
                        nodeData.type,
                        nodeData.x,
                        nodeData.y,
                        nodeData.id,
                        false // Don't animate on load
                    );
                });
                
                // Restore connections
                mapData.connections.forEach(conn => {
                    createConnection(conn.fromId, conn.toId, false);
                });
                
                // Restore view state
                scale = mapData.scale || 1;
                offsetX = mapData.offsetX || 0;
                offsetY = mapData.offsetY || 0;
                updateTransform();
                
                // Update next node ID
                if (mapData.nodes.length > 0) {
                    nextNodeId = Math.max(...mapData.nodes.map(n => n.id)) + 1;
                }
                
                updateNodeCount();
                updateStatus('Mind map loaded');
                
                return true;
            } catch (e) {
                console.error('Failed to load map:', e);
                return false;
            }
        }
        return false;
    }
    
    function exportAsPNG() {
        updateStatus('Preparing export...');
        
        // Use html2canvas library would be needed here for actual implementation
        // This is a placeholder for the functionality
        alert('Export functionality would use html2canvas to export the mindmap as PNG');
        updateStatus('Export ready');
    }
    
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            toggleThemeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            toggleThemeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
    
    function updateBackgroundColor() {
        mindmap.style.backgroundColor = bgColorInput.value;
    }
    
    function updateConnectionColor() {
        document.documentElement.style.setProperty('--conn-color', connColorInput.value);
        connections.forEach(conn => {
            conn.element.style.backgroundColor = connColorInput.value;
        });
    }
    
    function updateConnectionWidth() {
        const width = connWidthInput.value + 'px';
        connections.forEach(conn => {
            conn.element.style.height = width;
        });
    }
    
    function createNode(content, type, x, y, id = null, animate = true) {
        const nodeId = id || nextNodeId++;
        const nodeElement = document.createElement('div');
        nodeElement.className = `node ${type}`;
        nodeElement.dataset.id = nodeId;
        
        const textarea = document.createElement('textarea');
        textarea.className = 'node-content';
        textarea.value = content;
        textarea.placeholder = 'Enter node text...';
        
        // Add connectors
        const topConnector = createConnector(nodeId, 'top');
        const rightConnector = createConnector(nodeId, 'right');
        const bottomConnector = createConnector(nodeId, 'bottom');
        const leftConnector = createConnector(nodeId, 'left');
        
        nodeElement.appendChild(textarea);
        nodeElement.appendChild(topConnector);
        nodeElement.appendChild(rightConnector);
        nodeElement.appendChild(bottomConnector);
        nodeElement.appendChild(leftConnector);
        
        mindmap.appendChild(nodeElement);
        
        // Position the node
        positionNode(nodeElement, x, y);
        
        // Add event listeners
        nodeElement.addEventListener('mousedown', handleNodeMouseDown);
        textarea.addEventListener('mousedown', e => e.stopPropagation());
        textarea.addEventListener('input', () => updateNodeContent(nodeId, textarea.value));
        
        // Add to nodes array
        const node = {
            id: nodeId,
            element: nodeElement,
            x,
            y,
            type,
            content,
            connectors: {
                top: topConnector,
                right: rightConnector,
                bottom: bottomConnector,
                left: leftConnector
            }
        };
        
        nodes.push(node);
        
        // Animate appearance
        if (animate) {
            // Enhanced animation for new nodes
            nodeElement.style.opacity = '0';
            nodeElement.style.transform = 'translate(-50%, -50%) scale(0.5)';
            nodeElement.style.boxShadow = '0 0 20px rgba(0,0,0,0.3)';
            
            setTimeout(() => {
                nodeElement.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                nodeElement.style.opacity = '1';
                nodeElement.style.transform = 'translate(-50%, -50%) scale(1)';
                nodeElement.style.boxShadow = '0 2px 8px var(--shadow-color)';
                
                // Add ripple effect
                const ripple = document.createElement('div');
                ripple.className = 'ripple';
                ripple.style.cssText = `
                    position: absolute;
                    border: 2px solid ${type === 'central' ? '#ff7675' : type === 'main' ? '#74b9ff' : '#a8e6cf'};
                    width: 100%;
                    height: 100%;
                    border-radius: 8px;
                    animation: ripple 0.6s ease-out forwards;
                `;
                nodeElement.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                    nodeElement.style.transition = '';
                }, 600);
            }, 10);
        }
        
        // Add auto-expand functionality
        autoExpandNode(node);
        
        return node;
    }
    
    function createConnector(nodeId, position) {
        const connector = document.createElement('div');
        connector.className = 'node-connector';
        connector.dataset.nodeId = nodeId;
        connector.dataset.position = position;
        
        connector.addEventListener('mousedown', handleConnectorMouseDown);
        
        return connector;
    }
    
    function positionNode(nodeElement, x, y) {
        nodeElement.style.left = `${x}px`;
        nodeElement.style.top = `${y}px`;
        
        // Position connectors
        const nodeRect = nodeElement.getBoundingClientRect();
        const connectors = nodeElement.querySelectorAll('.node-connector');
        
        connectors.forEach(connector => {
            const position = connector.dataset.position;
            let left, top;
            
            switch (position) {
                case 'top':
                    left = nodeRect.width / 2;
                    top = 0;
                    break;
                case 'right':
                    left = nodeRect.width;
                    top = nodeRect.height / 2;
                    break;
                case 'bottom':
                    left = nodeRect.width / 2;
                    top = nodeRect.height;
                    break;
                case 'left':
                    left = 0;
                    top = nodeRect.height / 2;
                    break;
            }
            
            connector.style.left = `${left}px`;
            connector.style.top = `${top}px`;
        });
    }
    
    function createConnection(fromId, toId, animate = true) {
        const fromNode = nodes.find(n => n.id == fromId);
        const toNode = nodes.find(n => n.id == toId);
        
        if (!fromNode || !toNode) return;
        
        // Check if connection already exists
        const exists = connections.some(conn => 
            (conn.fromId == fromId && conn.toId == toId) || 
            (conn.fromId == toId && conn.toId == fromId)
        );
        
        if (exists) return;
        
        const connectionElement = document.createElement('div');
        connectionElement.className = 'connection';
        mindmap.appendChild(connectionElement);
        
        const connection = {
            fromId,
            toId,
            element: connectionElement
        };
        
        connections.push(connection);
        updateConnectionElement(connection);
        
        // Animate connection
        if (animate) {
            connectionElement.style.opacity = '0';
            connectionElement.style.transform = 'scaleX(0)';
            
            setTimeout(() => {
                connectionElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                connectionElement.style.opacity = '1';
                connectionElement.style.transform = 'scaleX(1)';
                
                setTimeout(() => {
                    connectionElement.style.transition = '';
                }, 300);
            }, 10);
        }
        
        return connection;
    }
    
    function updateConnectionElement(connection) {
        const fromNode = nodes.find(n => n.id == connection.fromId);
        const toNode = nodes.find(n => n.id == connection.toId);
        
        if (!fromNode || !toNode) return;
        
        const fromRect = fromNode.element.getBoundingClientRect();
        const toRect = toNode.element.getBoundingClientRect();
        
        const fromX = fromRect.left + fromRect.width / 2 + offsetX;
        const fromY = fromRect.top + fromRect.height / 2 + offsetY;
        const toX = toRect.left + toRect.width / 2 + offsetX;
        const toY = toRect.top + toRect.height / 2 + offsetY;
        
        const length = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
        const angle = Math.atan2(toY - fromY, toX - fromX) * 180 / Math.PI;
        
        connection.element.style.width = `${length / scale}px`;
        connection.element.style.left = `${fromX / scale}px`;
        connection.element.style.top = `${fromY / scale}px`;
        connection.element.style.transform = `rotate(${angle}deg)`;
    }
    
    function updateAllConnections() {
        connections.forEach(conn => updateConnectionElement(conn));
    }
    
    function updateNodeContent(nodeId, content) {
        const node = nodes.find(n => n.id == nodeId);
        if (node) {
            node.content = content;
        }
    }
    
    function updateTransform() {
        mindmap.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
        zoomLevel.textContent = `Zoom: ${Math.round(scale * 100)}%`;
        updateAllConnections();
    }
    
    function updateNodeCount() {
        nodeCount.textContent = `Nodes: ${nodes.length}`;
    }
    
    function updateStatus(message) {
        statusMessage.textContent = message;
    }
    
    function getNodeById(id) {
        return nodes.find(node => node.id == id);
    }
    
    function deleteNode(nodeId) {
        const nodeIndex = nodes.findIndex(n => n.id == nodeId);
        if (nodeIndex === -1) return;
        
        const node = nodes[nodeIndex];
        
        // Remove all connections to/from this node
        connections = connections.filter(conn => {
            if (conn.fromId == nodeId || conn.toId == nodeId) {
                conn.element.remove();
                return false;
            }
            return true;
        });
        
        // Remove the node
        node.element.remove();
        nodes.splice(nodeIndex, 1);
        
        updateNodeCount();
        updateStatus('Node deleted');
    }
    
    // Event Handlers
    function handleMapMouseDown(e) {
        if (e.button !== 0) return; // Only left mouse button
        
        // Check if clicking on a node or connector
        if (e.target.closest('.node, .node-connector')) return;
        
        isDragging = true;
        dragStartX = e.clientX - offsetX;
        dragStartY = e.clientY - offsetY;
        
        mindmap.style.cursor = 'grabbing';
        e.preventDefault();
    }
    
    function handleMapMouseMove(e) {
        if (isDragging) {
            offsetX = e.clientX - dragStartX;
            offsetY = e.clientY - dragStartY;
            updateTransform();
        }
        
        if (isConnecting && tempConnection) {
            const mouseX = (e.clientX - offsetX) / scale;
            const mouseY = (e.clientY - offsetY) / scale;
            
            const length = Math.sqrt(Math.pow(mouseX - tempConnection.startX, 2) + Math.pow(mouseY - tempConnection.startY, 2));
            const angle = Math.atan2(mouseY - tempConnection.startY, mouseX - tempConnection.startX) * 180 / Math.PI;
            
            tempConnection.element.style.width = `${length}px`;
            tempConnection.element.style.transform = `rotate(${angle}deg)`;
        }
    }
    
    function handleMapMouseUp(e) {
        if (isDragging) {
            isDragging = false;
            mindmap.style.cursor = '';
        }
        
        if (isConnecting) {
            isConnecting = false;
            
            // Check if we're connecting to another connector
            if (e.target.classList.contains('node-connector') && startConnector) {
                const endConnector = e.target;
                const fromId = startConnector.dataset.nodeId;
                const toId = endConnector.dataset.nodeId;
                
                if (fromId !== toId) {
                    createConnection(fromId, toId);
                }
            }
            
            if (tempConnection) {
                tempConnection.element.remove();
                tempConnection = null;
            }
            
            startConnector = null;
        }
    }
    
    function handleZoom(e) {
        e.preventDefault();
        
        const delta = e.deltaY * -0.001;
        const newScale = Math.min(Math.max(0.25, scale + delta), 3);
        
        if (newScale !== scale) {
            // Zoom toward mouse position
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            const worldX = (mouseX - offsetX) / scale;
            const worldY = (mouseY - offsetY) / scale;
            
            scale = newScale;
            
            offsetX = mouseX - worldX * scale;
            offsetY = mouseY - worldY * scale;
            
            updateTransform();
        }
    }
    
    function handleNodeMouseDown(e) {
        if (e.button !== 0) return; // Only left mouse button
        
        const nodeElement = e.currentTarget;
        const nodeId = nodeElement.dataset.id;
        selectedNode = getNodeById(nodeId);
        
        const startX = e.clientX;
        const startY = e.clientY;
        
        const startLeft = parseInt(nodeElement.style.left);
        const startTop = parseInt(nodeElement.style.top);
        
        function moveNode(e) {
            const dx = (e.clientX - startX) / scale;
            const dy = (e.clientY - startY) / scale;
            
            const newLeft = startLeft + dx;
            const newTop = startTop + dy;
            
            nodeElement.style.left = `${newLeft}px`;
            nodeElement.style.top = `${newTop}px`;
            
            selectedNode.x = newLeft;
            selectedNode.y = newTop;
            
            // Update all connections for this node
            connections.forEach(conn => {
                if (conn.fromId == nodeId || conn.toId == nodeId) {
                    updateConnectionElement(conn);
                }
            });
        }
        
        function stopMoveNode() {
            document.removeEventListener('mousemove', moveNode);
            document.removeEventListener('mouseup', stopMoveNode);
        }
        
        document.addEventListener('mousemove', moveNode);
        document.addEventListener('mouseup', stopMoveNode);
        
        e.stopPropagation();
    }
    
    function handleConnectorMouseDown(e) {
        e.stopPropagation();
        
        const connector = e.currentTarget;
        const nodeId = connector.dataset.nodeId;
        const node = getNodeById(nodeId);
        
        if (!node) return;
        
        isConnecting = true;
        startConnector = connector;
        
        // Create a temporary connection line
        const connectionElement = document.createElement('div');
        connectionElement.className = 'connection';
        mindmap.appendChild(connectionElement);
        
        const nodeRect = node.element.getBoundingClientRect();
        const connectorRect = connector.getBoundingClientRect();
        
        const startX = (connectorRect.left + connectorRect.width / 2 - offsetX) / scale;
        const startY = (connectorRect.top + connectorRect.height / 2 - offsetY) / scale;
        
        tempConnection = {
            element: connectionElement,
            startX,
            startY
        };
        
        connectionElement.style.left = `${startX}px`;
        connectionElement.style.top = `${startY}px`;
        connectionElement.style.width = '0px';
    }
    
    function handleContextMenu(e) {
        e.preventDefault();
        
        // Check if clicking on a node
        const nodeElement = e.target.closest('.node');
        if (nodeElement) {
            const nodeId = nodeElement.dataset.id;
            selectedNode = getNodeById(nodeId);
            
            showContextMenu(e.clientX, e.clientY, [
                {
                    text: 'Add Child Node',
                    icon: '<i class="fas fa-plus"></i>',
                    action: () => addChildNode(nodeId)
                },
                {
                    text: 'Delete Node',
                    icon: '<i class="fas fa-trash"></i>',
                    action: () => deleteNode(nodeId)
                },
                { divider: true },
                {
                    text: 'Center View',
                    icon: '<i class="fas fa-crosshairs"></i>',
                    action: () => centerNode(nodeId)
                }
            ]);
        } else {
            // General context menu
            showContextMenu(e.clientX, e.clientY, [
                {
                    text: 'Add Central Node',
                    icon: '<i class="fas fa-plus-circle"></i>',
                    action: () => {
                        const x = (e.clientX - offsetX) / scale;
                        const y = (e.clientY - offsetY) / scale;
                        createNode('Central Idea', 'central', x, y);
                    }
                },
                { divider: true },
                {
                    text: 'Reset View',
                    icon: '<i class="fas fa-expand"></i>',
                    action: () => {
                        scale = 1;
                        offsetX = 0;
                        offsetY = 0;
                        updateTransform();
                    }
                }
            ]);
        }
    }
    
    function showContextMenu(x, y, items) {
        // Remove any existing context menu
        const existingMenu = document.querySelector('.context-menu');
        if (existingMenu) existingMenu.remove();
        
        const menu = document.createElement('div');
        menu.className = 'context-menu active';
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;
        
        items.forEach(item => {
            if (item.divider) {
                const divider = document.createElement('div');
                divider.className = 'context-menu-divider';
                menu.appendChild(divider);
            } else {
                const menuItem = document.createElement('div');
                menuItem.className = 'context-menu-item';
                menuItem.innerHTML = `${item.icon} ${item.text}`;
                menuItem.addEventListener('click', () => {
                    item.action();
                    menu.remove();
                });
                menu.appendChild(menuItem);
            }
        });
        
        document.body.appendChild(menu);
        
        // Close menu when clicking elsewhere
        function closeMenu(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        }
        
        document.addEventListener('click', closeMenu);
    }
    
    function addChildNode(parentId) {
        const parentNode = getNodeById(parentId);
        if (!parentNode) return;
        
        // Position child node offset from parent
        const angle = Math.random() * Math.PI * 2;
        const distance = 200 / scale;
        const x = parentNode.x + Math.cos(angle) * distance;
        const y = parentNode.y + Math.sin(angle) * distance;
        
        const childType = parentNode.type === 'central' ? 'main' : 'sub';
        const childNode = createNode('New Node', childType, x, y);
        
        // Connect parent to child
        createConnection(parentId, childNode.id);
        
        // Auto-focus the new node's textarea
        const textarea = childNode.element.querySelector('.node-content');
        textarea.focus();
        textarea.select();
        
        updateStatus('Child node added');
    }
    
    function centerNode(nodeId) {
        const node = getNodeById(nodeId);
        if (!node) return;
        
        const mindmapRect = mindmap.getBoundingClientRect();
        offsetX = mindmapRect.width / 2 - node.x * scale;
        offsetY = mindmapRect.height / 2 - node.y * scale;
        
        updateTransform();
        updateStatus('View centered on node');
    }
    
    function handleDragStart(e) {
        const nodeType = e.target.closest('.node-type');
        if (!nodeType) return;
        
        e.dataTransfer.setData('text/plain', nodeType.dataset.type);
        e.dataTransfer.effectAllowed = 'copy';
        
        // Add visual feedback
        nodeType.classList.add('dragging');
        setTimeout(() => nodeType.classList.remove('dragging'), 0);
    }
    
    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }
    
    function handleDrop(e) {
        e.preventDefault();
        
        const type = e.dataTransfer.getData('text/plain');
        if (!type) return;
        
        const x = (e.clientX - offsetX) / scale;
        const y = (e.clientY - offsetY) / scale;
        
        const node = createNode('New Node', type, x, y);
        
        // Auto-focus the new node's textarea
        const textarea = node.element.querySelector('.node-content');
        textarea.focus();
        textarea.select();
        
        updateNodeCount();
        updateStatus('New node created');
    }
    
    // Add this new function for auto-expanding nodes
    function autoExpandNode(node) {
        const textarea = node.element.querySelector('.node-content');
        const computeHeight = () => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
            
            // Adjust node width based on content
            const minWidth = 120;
            const textWidth = textarea.value.length * 8;
            node.element.style.width = Math.max(minWidth, textWidth) + 'px';
            
            // Update connections
            connections.forEach(conn => {
                if (conn.fromId == node.id || conn.toId == node.id) {
                    updateConnectionElement(conn);
                }
            });
        };
        
        textarea.addEventListener('input', computeHeight);
        // Initial computation
        computeHeight();
    }
    
    // Add these CSS keyframes to your styles.css file:
    // @keyframes ripple {
    //     0% {
    //         transform: scale(1);
    //         opacity: 1;
    //     }
    //     100% {
    //         transform: scale(1.5);
    //         opacity: 0;
    //     }
    // }
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Three.js scene
    let scene, camera, renderer, element3D;
    
    function init3DScene() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('element-model'), alpha: true });
        renderer.setSize(400, 400);
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(ambientLight, pointLight);
        
        camera.position.z = 5;
    }
    
    // Periodic Table Data
    const elements = [
        { number: 1, symbol: 'H', name: 'Hydrogen', mass: 1.008, category: 'nonmetal' },
        { number: 2, symbol: 'He', name: 'Helium', mass: 4.003, category: 'noble-gas' },
        // Add more elements...
    ];
    
    function createPeriodicTable() {
        const table = document.getElementById('periodic-table');
        elements.forEach((element, index) => {
            const elementDiv = document.createElement('div');
            elementDiv.className = `element ${element.category}`;
            elementDiv.style.setProperty('--animation-order', index);
            
            elementDiv.innerHTML = `
                <div class="element-number">${element.number}</div>
                <div class="element-symbol">${element.symbol}</div>
                <div class="element-mass">${element.mass}</div>
            `;
            
            elementDiv.addEventListener('click', () => showElementDetails(element));
            table.appendChild(elementDiv);
        });
    }
    
    function showElementDetails(element) {
        const modal = document.getElementById('element-modal');
        const elementName = document.getElementById('element-name');
        const elementProperties = document.querySelector('.element-properties');
        
        elementName.textContent = `${element.name} (${element.symbol})`;
        elementProperties.innerHTML = `
            <p>Atomic Number: ${element.number}</p>
            <p>Atomic Mass: ${element.mass}</p>
            <p>Category: ${element.category}</p>
        `;
        
        update3DModel(element);
        modal.style.display = 'flex';
    }
    
    function update3DModel(element) {
        if (element3D) scene.remove(element3D);
        
        // Create 3D representation of the atom
        const geometry = new THREE.SphereGeometry(2, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: getElementColor(element.category),
            metalness: 0.5,
            roughness: 0.5,
        });
        
        element3D = new THREE.Mesh(geometry, material);
        scene.add(element3D);
        
        // Add electron shells
        const electronShells = createElectronShells(element.number);
        electronShells.forEach(shell => scene.add(shell));
        
        animate();
    }
    
    function animate() {
        requestAnimationFrame(animate);
        
        if (element3D) {
            element3D.rotation.x += 0.01;
            element3D.rotation.y += 0.01;
        }
        
        renderer.render(scene, camera);
    }
    
    function createElectronShells(atomicNumber) {
        // Simplified electron shell creation
        const shells = [];
        let remainingElectrons = atomicNumber;
        let shellIndex = 1;
        
        while (remainingElectrons > 0) {
            const shellCapacity = 2 * shellIndex * shellIndex;
            const electrons = Math.min(remainingElectrons, shellCapacity);
            
            const shellGeometry = new THREE.TorusGeometry(shellIndex * 0.5, 0.02, 16, 100);
            const shellMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
            const shell = new THREE.Mesh(shellGeometry, shellMaterial);
            
            shell.rotation.x = Math.random() * Math.PI;
            shell.rotation.y = Math.random() * Math.PI;
            shells.push(shell);
            
            remainingElectrons -= electrons;
            shellIndex++;
        }
        
        return shells;
    }
    
    function getElementColor(category) {
        const colors = {
            'metal': 0x94a3b8,
            'nonmetal': 0x22c55e,
            'noble-gas': 0xec4899,
            'halogen': 0xf59e0b
        };
        return colors[category] || 0xffffff;
    }
    
    // Event Listeners
    document.getElementById('search').addEventListener('input', filterElements);
    document.getElementById('category-filter').addEventListener('change', filterElements);
    document.getElementById('property-filter').addEventListener('change', sortElements);
    
    function filterElements() {
        const searchTerm = document.getElementById('search').value.toLowerCase();
        const category = document.getElementById('category-filter').value;
        
        document.querySelectorAll('.element').forEach(elementDiv => {
            const element = elements[parseInt(elementDiv.dataset.index)];
            const matchesSearch = element.name.toLowerCase().includes(searchTerm) ||
                                element.symbol.toLowerCase().includes(searchTerm);
            const matchesCategory = category === 'all' || element.category === category;
            
            elementDiv.style.display = matchesSearch && matchesCategory ? 'block' : 'none';
        });
    }
    
    function sortElements() {
        const property = document.getElementById('property-filter').value;
        const elementArray = Array.from(document.querySelectorAll('.element'));
        
        elementArray.sort((a, b) => {
            const elementA = elements[parseInt(a.dataset.index)];
            const elementB = elements[parseInt(b.dataset.index)];
            return elementA[property] - elementB[property];
        });
        
        elementArray.forEach(element => {
            element.parentNode.appendChild(element);
        });
    }
    
    // Initialize
    init3DScene();
    createPeriodicTable();
});