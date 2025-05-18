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
        { number: 1, symbol: 'H', name: 'Hydrogen', mass: 1.008, category: 'nonmetal', melt: -259.14, boil: -252.87 },
        { number: 2, symbol: 'He', name: 'Helium', mass: 4.003, category: 'noble-gas', melt: -272.2, boil: -268.93 },
        { number: 3, symbol: 'Li', name: 'Lithium', mass: 6.94, category: 'alkali-metal', melt: 180.54, boil: 1342 },
        { number: 4, symbol: 'Be', name: 'Beryllium', mass: 9.012, category: 'alkaline-earth', melt: 1287, boil: 2470 },
        { number: 5, symbol: 'B', name: 'Boron', mass: 10.81, category: 'metalloid', melt: 2075, boil: 4000 },
        { number: 6, symbol: 'C', name: 'Carbon', mass: 12.01, category: 'nonmetal', melt: 3550, boil: 4027 },
        { number: 7, symbol: 'N', name: 'Nitrogen', mass: 14.01, category: 'nonmetal', melt: -210.1, boil: -195.79 },
        { number: 8, symbol: 'O', name: 'Oxygen', mass: 16.00, category: 'nonmetal', melt: -218.79, boil: -182.96 },
        { number: 9, symbol: 'F', name: 'Fluorine', mass: 19.00, category: 'halogen', melt: -219.67, boil: -188.11 },
        { number: 10, symbol: 'Ne', name: 'Neon', mass: 20.18, category: 'noble-gas', melt: -248.59, boil: -246.08 },
        { number: 11, symbol: 'Na', name: 'Sodium', mass: 22.99, category: 'alkali-metal', melt: 97.72, boil: 883 },
        { number: 12, symbol: 'Mg', name: 'Magnesium', mass: 24.31, category: 'alkaline-earth', melt: 650, boil: 1090 },
        { number: 13, symbol: 'Al', name: 'Aluminum', mass: 26.98, category: 'post-transition', melt: 660.32, boil: 2519 },
        { number: 14, symbol: 'Si', name: 'Silicon', mass: 28.09, category: 'metalloid', melt: 1414, boil: 3265 },
        { number: 15, symbol: 'P', name: 'Phosphorus', mass: 30.97, category: 'nonmetal', melt: 44.15, boil: 280.5 },
        { number: 16, symbol: 'S', name: 'Sulfur', mass: 32.07, category: 'nonmetal', melt: 115.21, boil: 444.72 },
        { number: 17, symbol: 'Cl', name: 'Chlorine', mass: 35.45, category: 'halogen', melt: -101.5, boil: -34.04 },
        { number: 18, symbol: 'Ar', name: 'Argon', mass: 39.95, category: 'noble-gas', melt: -189.34, boil: -185.85 },
        { number: 19, symbol: 'K', name: 'Potassium', mass: 39.10, category: 'alkali-metal', melt: 63.5, boil: 759 },
        { number: 20, symbol: 'Ca', name: 'Calcium', mass: 40.08, category: 'alkaline-earth', melt: 842, boil: 1484 },
        { number: 21, symbol: 'Sc', name: 'Scandium', mass: 44.96, category: 'transition', melt: 1541, boil: 2831 },
        { number: 22, symbol: 'Ti', name: 'Titanium', mass: 47.87, category: 'transition', melt: 1668, boil: 3287 },
        { number: 23, symbol: 'V', name: 'Vanadium', mass: 50.94, category: 'transition', melt: 1910, boil: 3407 },
        { number: 24, symbol: 'Cr', name: 'Chromium', mass: 51.96, category: 'transition', melt: 1907, boil: 2671 },
        { number: 25, symbol: 'Mn', name: 'Manganese', mass: 54.94, category: 'transition', melt: 1246, boil: 2061 },
        { number: 26, symbol: 'Fe', name: 'Iron', mass: 55.85, category: 'transition', melt: 1538, boil: 2862 },
        { number: 27, symbol: 'Co', name: 'Cobalt', mass: 58.93, category: 'transition', melt: 1495, boil: 2927 },
        { number: 28, symbol: 'Ni', name: 'Nickel', mass: 58.69, category: 'transition', melt: 1455, boil: 2913 },
        { number: 29, symbol: 'Cu', name: 'Copper', mass: 63.55, category: 'transition', melt: 1084.62, boil: 2562 },
        { number: 30, symbol: 'Zn', name: 'Zinc', mass: 65.38, category: 'transition', melt: 419.58, boil: 907 },
        { number: 31, symbol: 'Ga', name: 'Gallium', mass: 69.72, category: 'post-transition', melt: 29.76, boil: 2204 },
        { number: 32, symbol: 'Ge', name: 'Germanium', mass: 72.63, category: 'metalloid', melt: 938.25, boil: 2833 },
        { number: 33, symbol: 'As', name: 'Arsenic', mass: 74.92, category: 'metalloid', melt: 817, boil: 614 },
        { number: 34, symbol: 'Se', name: 'Selenium', mass: 78.97, category: 'nonmetal', melt: 221, boil: 685 },
        { number: 35, symbol: 'Br', name: 'Bromine', mass: 79.90, category: 'halogen', melt: -7.2, boil: 58.8 },
        { number: 36, symbol: 'Kr', name: 'Krypton', mass: 83.80, category: 'noble-gas', melt: -157.37, boil: -157.36 },
        { number: 37, symbol: 'Rb', name: 'Rubidium', mass: 85.47, category: 'alkali-metal', melt: 39.31, boil: 688 },
        { number: 38, symbol: 'Sr', name: 'Strontium', mass: 87.62, category: 'alkaline-earth', melt: 777, boil: 1382 },
        { number: 39, symbol: 'Y', name: 'Yttrium', mass: 88.91, category: 'transition', melt: 1526, boil: 3337 },
        { number: 40, symbol: 'Zr', name: 'Zirconium', mass: 91.22, category: 'transition', melt: 1855, boil: 4377 },
        { number: 41, symbol: 'Nb', name: 'Niobium', mass: 92.91, category: 'transition', melt: 2468, boil: 4744 },
        { number: 42, symbol: 'Mo', name: 'Molybdenum', mass: 95.94, category: 'transition', melt: 2623, boil: 4612 },
        { number: 43, symbol: 'Tc', name: 'Technetium', mass: 98, category: 'transition', melt: 2157, boil: 4265 },
        { number: 44, symbol: 'Ru', name: 'Ruthenium', mass: 101.07, category: 'transition', melt: 2334, boil: 4150 },
        { number: 45, symbol: 'Rh', name: 'Rhodium', mass: 102.91, category: 'transition', melt: 1966, boil: 3727 },
        { number: 46, symbol: 'Pd', name: 'Palladium', mass: 106.42, category: 'transition', melt: 1554.9, boil: 2963 },
        { number: 47, symbol: 'Ag', name: 'Silver', mass: 107.87, category: 'transition', melt: 961.78, boil: 2162 },
        { number: 48, symbol: 'Cd', name: 'Cadmium', mass: 112.41, category: 'transition', melt: 321.07, boil: 765 },
        { number: 49, symbol: 'In', name: 'Indium', mass: 114.82, category: 'post-transition', melt: 156.6, boil: 2072 },
        { number: 50, symbol: 'Sn', name: 'Tin', mass: 118.71, category: 'post-transition', melt: 231.93, boil: 2602 },
        { number: 51, symbol: 'Sb', name: 'Antimony', mass: 121.76, category: 'metalloid', melt: 630.62, boil: 1587 },
        { number: 52, symbol: 'Te', name: 'Tellurium', mass: 127.60, category: 'metalloid', melt: 449.51, boil: 988 },
        { number: 53, symbol: 'I', name: 'Iodine', mass: 126.90, category: 'halogen', melt: 113.7, boil: 184.3 },
        { number: 54, symbol: 'Xe', name: 'Xenon', mass: 131.29, category: 'noble-gas', melt: -111.75, boil: -108.12 },
        { number: 55, symbol: 'Cs', name: 'Cesium', mass: 132.91, category: 'alkali-metal', melt: 28.5, boil: 671 },
        { number: 56, symbol: 'Ba', name: 'Barium', mass: 137.33, category: 'alkaline-earth', melt: 727, boil: 1640 },
        { number: 57, symbol: 'La', name: 'Lanthanum', mass: 138.91, category: 'lanthanoid', melt: 920, boil: 3464 },
        { number: 58, symbol: 'Ce', name: 'Cerium', mass: 140.12, category: 'lanthanoid', melt: 798, boil: 3426 },
        { number: 59, symbol: 'Pr', name: 'Praseodymium', mass: 140.91, category: 'lanthanoid', melt: 931, boil: 3464 },
        { number: 60, symbol: 'Nd', name: 'Neodymium', mass: 144.24, category: 'lanthanoid', melt: 1021, boil: 3071 },
        { number: 61, symbol: 'Pm', name: 'Promethium', mass: 145, category: 'lanthanoid', melt: 1100, boil: 3000 },
        { number: 62, symbol: 'Sm', name: 'Samarium', mass: 150.36, category: 'lanthanoid', melt: 1072, boil: 1900 },
        { number: 63, symbol: 'Eu', name: 'Europium', mass: 151.96, category: 'lanthanoid', melt: 822, boil: 1529 },
        { number: 64, symbol: 'Gd', name: 'Gadolinium', mass: 157.25, category: 'lanthanoid', melt: 1313, boil: 3273 },
        { number: 65, symbol: 'Tb', name: 'Terbium', mass: 158.93, category: 'lanthanoid', melt: 1356, boil: 3123 },
        { number: 66, symbol: 'Dy', name: 'Dysprosium', mass: 162.50, category: 'lanthanoid', melt: 1412, boil: 2562 },
        { number: 67, symbol: 'Ho', name: 'Holmium', mass: 164.93, category: 'lanthanoid', melt: 1474, boil: 2720 },
        { number: 68, symbol: 'Er', name: 'Erbium', mass: 167.26, category: 'lanthanoid', melt: 1529, boil: 2510 },
        { number: 69, symbol: 'Tm', name: 'Thulium', mass: 168.93, category: 'lanthanoid', melt: 1545, boil: 2223 },
        { number: 70, symbol: 'Yb', name: 'Ytterbium', mass: 173.04, category: 'lanthanoid', melt: 819, boil: 1466 },
        { number: 71, symbol: 'Lu', name: 'Lutetium', mass: 174.97, category: 'lanthanoid', melt: 1652, boil: 3402 },
        { number: 72, symbol: 'Hf', name: 'Hafnium', mass: 178.49, category: 'transition', melt: 2150, boil: 4603 },
        { number: 73, symbol: 'Ta', name: 'Tantalum', mass: 180.95, category: 'transition', melt: 3017, boil: 5458 },
        { number: 74, symbol: 'W', name: 'Tungsten', mass: 183.84, category: 'transition', melt: 3422, boil: 5555 },
        { number: 75, symbol: 'Re', name: 'Rhenium', mass: 186.21, category: 'transition', melt: 3186, boil: 5596 },
        { number: 76, symbol: 'Os', name: 'Osmium', mass: 190.23, category: 'transition', melt: 3033, boil: 5027 },
        { number: 77, symbol: 'Ir', name: 'Iridium', mass: 192.22, category: 'transition', melt: 2466, boil: 4420 },
        { number: 78, symbol: 'Pt', name: 'Platinum', mass: 195.08, category: 'transition', melt: 1768.6, boil: 3825 },
        { number: 79, symbol: 'Au', name: 'Gold', mass: 196.97, category: 'transition', melt: 1064.18, boil: 2856 },
        { number: 80, symbol: 'Hg', name: 'Mercury', mass: 200.59, category: 'transition', melt: -38.83, boil: 356.73 },
        { number: 81, symbol: 'Tl', name: 'Thallium', mass: 204.38, category: 'post-transition', melt: 304, boil: 1457 },
        { number: 82, symbol: 'Pb', name: 'Lead', mass: 207.2, category: 'post-transition', melt: 327.5, boil: 1749 },
        { number: 83, symbol: 'Bi', name: 'Bismuth', mass: 208.98, category: 'post-transition', melt: 271.4, boil: 1564 },
        { number: 84, symbol: 'Po', name: 'Polonium', mass: 209, category: 'metalloid', melt: 254, boil: 962 },
        { number: 85, symbol: 'At', name: 'Astatine', mass: 210, category: 'halogen', melt: 302, boil: 337 },
        { number: 86, symbol: 'Rn', name: 'Radon', mass: 222, category: 'noble-gas', melt: -71, boil: -61.7 },
        { number: 87, symbol: 'Fr', name: 'Francium', mass: 223, category: 'alkali-metal', melt: 27, boil: 677 },
        { number: 88, symbol: 'Ra', name: 'Radium', mass: 226, category: 'alkaline-earth', melt: 968, boil: 1413 },
        { number: 89, symbol: 'Ac', name: 'Actinium', mass: 227, category: 'actinoid', melt: 1050, boil: 1500 },
        { number: 90, symbol: 'Th', name: 'Thorium', mass: 232.04, category: 'actinoid', melt: 1115, boil: 4470 },
        { number: 91, symbol: 'Pa', name: 'Protactinium', mass: 231.04, category: 'actinoid', melt: 1050, boil: 2150 },
        { number: 92, symbol: 'U', name: 'Uranium', mass: 238.03, category: 'actinoid', melt: 1135, boil: 4131 },
        { number: 93, symbol: 'Np', name: 'Neptunium', mass: 237.05, category: 'actinoid', melt: 637, boil: 2800 },
        { number: 94, symbol: 'Pu', name: 'Plutonium', mass: 244.06, category: 'actinoid', melt: 640, boil: 3228 },
        { number: 95, symbol: 'Am', name: 'Americium', mass: 243.06, category: 'actinoid', melt: 1176, boil: 2880 },
        { number: 96, symbol: 'Cm', name: 'Curium', mass: 247.07, category: 'actinoid', melt: 1340, boil: 3110 },
        { number: 97, symbol: 'Bk', name: 'Berkelium', mass: 247.07, category: 'actinoid', melt: 986, boil: 2627 },
        { number: 98, symbol: 'Cf', name: 'Californium', mass: 251.08, category: 'actinoid', melt: 900, boil: 1470 },
        { number: 99, symbol: 'Es', name: 'Einsteinium', mass: 252.08, category: 'actinoid', melt: 1133, boil: 1260 },
        { number: 100, symbol: 'Fm', name: 'Fermium', mass: 257.10, category: 'actinoid', melt: 1527, boil: 1800 },
        { number: 101, symbol: 'Md', name: 'Mendelevium', mass: 258.10, category: 'actinoid', melt: 1100, boil: 1400 },
        { number: 102, symbol: 'No', name: 'Nobelium', mass: 259.10, category: 'actinoid', melt: 827, boil: 1447 },
        { number: 103, symbol: 'Lr', name: 'Lawrencium', mass: 262.11, category: 'actinoid', melt: 1627, boil: 3500 },
        { number: 104, symbol: 'Rf', name: 'Rutherfordium', mass: 267.12, category: 'transition', melt: 2100, boil: 4300 },
        { number: 105, symbol: 'Db', name: 'Dubnium', mass: 268.13, category: 'transition', melt: 2280, boil: 4300 },
        { number: 106, symbol: 'Sg', name: 'Seaborgium', mass: 271.13, category: 'transition', melt: 2700, boil: 5000 },
        { number: 107, symbol: 'Bh', name: 'Bohrium', mass: 270.13, category: 'transition', melt: 3000, boil: 5000 },
        { number: 108, symbol: 'Hs', name: 'Hassium', mass: 277.15, category: 'transition', melt: 2700, boil: 5000 },
        { number: 109, symbol: 'Mt', name: 'Meitnerium', mass: 278.15, category: 'transition', melt: 2800, boil: 5000 },
        { number: 110, symbol: 'Ds', name: 'Darmstadtium', mass: 281.17, category: 'transition', melt: 2900, boil: 5000 },
        { number: 111, symbol: 'Rg', name: 'Roentgenium', mass: 282.17, category: 'transition', melt: 2800, boil: 5000 },
        { number: 112, symbol: 'Cn', name: 'Copernicium', mass: 285.17, category: 'transition', melt: 2900, boil: 5000 },
        { number: 113, symbol: 'Nh', name: 'Nihonium', mass: 286.18, category: 'post-transition', melt: 700, boil: 1300 },
        { number: 114, symbol: 'Fl', name: 'Flerovium', mass: 289.19, category: 'post-transition', melt: 600, boil: 1500 },
        { number: 115, symbol: 'Mc', name: 'Moscovium', mass: 288.19, category: 'post-transition', melt: 650, boil: 1400 },
        { number: 116, symbol: 'Lv', name: 'Livermorium', mass: 293.2, category: 'post-transition', melt: 700, boil: 1300 },
        { number: 117, symbol: 'Ts', name: 'Tennessine', mass: 294.2, category: 'halogen', melt: 112, boil: 220 },
        { number: 118, symbol: 'Og', name: 'Oganesson', mass: 294.2, category: 'noble-gas', melt: -222, boil: -189 }
    ];
    
    function createPeriodicTable() {
        const table = document.getElementById('periodic-table');
        
        // Create group numbers
        const groupNumbers = document.createElement('div');
        groupNumbers.className = 'group-numbers';
        for(let i = 1; i <= 18; i++) {
            const group = document.createElement('div');
            group.textContent = i;
            groupNumbers.appendChild(group);
        }
        table.appendChild(groupNumbers);
        
        // Create period numbers
        const periodNumbers = document.createElement('div');
        periodNumbers.className = 'period-numbers';
        for(let i = 1; i <= 7; i++) {
            const period = document.createElement('div');
            period.textContent = i;
            periodNumbers.appendChild(period);
        }
        table.appendChild(periodNumbers);
        
        // Create lanthanide and actinide blocks
        const lanthanoidBlock = document.createElement('div');
        lanthanoidBlock.className = 'lanthanoid-block';
        const actinoidBlock = document.createElement('div');
        actinoidBlock.className = 'actinoid-block';
        
        // Create spacer for f-block elements
        const fBlockSpacer = document.createElement('div');
        fBlockSpacer.className = 'f-block-spacer';
        fBlockSpacer.textContent = '← f-block elements →';
        table.appendChild(fBlockSpacer);

        elements.forEach((element) => {
            const elementDiv = document.createElement('div');
            elementDiv.className = `element ${element.category}`;
            elementDiv.dataset.number = element.number;
            
            elementDiv.innerHTML = `
                <div class="element-number">${element.number}</div>
                <div class="element-symbol">${element.symbol}</div>
                <div class="element-mass">${element.mass.toFixed(1)}</div>
                <div class="element-name">${element.name}</div>
            `;
            
            elementDiv.addEventListener('click', () => showElementDetails(element));
            
            // Position elements
            if (element.category === 'lanthanoid') {
                lanthanoidBlock.appendChild(elementDiv);
            } else if (element.category === 'actinoid') {
                actinoidBlock.appendChild(elementDiv);
            } else {
                table.appendChild(elementDiv);
                // Set grid position based on periodic table layout
                const period = Math.ceil(element.number / 18);
                elementDiv.style.gridRow = period;
            }
        });
        
        // Append lanthanide and actinide blocks
        table.appendChild(lanthanoidBlock);
        table.appendChild(actinoidBlock);
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
            'alkali-metal': 0xff6b6b,
            'alkaline-earth': 0xffd93d,
            'transition': 0x74b9ff,
            'post-transition': 0xa8e6cf,
            'metalloid': 0x6c5ce7,
            'nonmetal': 0x51cf66,
            'halogen': 0xffa94d,
            'noble-gas': 0xff8787,
            'lanthanoid': 0xcc5de8,
            'actinoid': 0xf783ac
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