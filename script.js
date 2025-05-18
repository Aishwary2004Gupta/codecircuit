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
            nodeElement.style.opacity = '0';
            nodeElement.style.transform = 'translate(-50%, -50%) scale(0.5)';
            
            setTimeout(() => {
                nodeElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                nodeElement.style.opacity = '1';
                nodeElement.style.transform = 'translate(-50%, -50%) scale(1)';
                
                setTimeout(() => {
                    nodeElement.style.transition = '';
                }, 300);
            }, 10);
        }
        
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
        
        const x =