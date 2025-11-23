/**
 * PDF习题拆分PPT工具 - 前端主逻辑
 */

// 全局状态
const state = {
    fileId: null,
    pages: [],
    currentPage: null,
    currentImage: null,
    selections: {}, // {pageNum: [{x, y, width, height, id}, ...]}
    mergedSelections: [], // [{id: uniqueId, items: [{pageNum, rectId}, ...]}, ...] 合并的题目
    currentRect: null, // 当前正在绘制的矩形框
    selectedRectId: null, // 当前选中的矩形框ID
    selectedMergedId: null, // 当前选中的合并题目ID
    isDrawing: false,
    isDragging: false,
    isResizing: false,
    resizeHandle: null,
    startX: 0,
    startY: 0,
    rectCounter: 0,
    mergedCounter: 0,
    customOrder: [] // 自定义顺序：[{type: 'single'|'merged', pageNum?, rectId?, mergedId?}, ...]
};

// DOM元素
const elements = {
    fileInput: document.getElementById('fileInput'),
    uploadArea: document.getElementById('uploadArea'),
    uploadSection: document.getElementById('uploadSection'),
    mainWorkspace: document.getElementById('mainWorkspace'),
    pageThumbnails: document.getElementById('pageThumbnails'),
    mainCanvas: document.getElementById('mainCanvas'),
    canvasOverlay: document.getElementById('canvasOverlay'),
    currentPageTitle: document.getElementById('currentPageTitle'),
    selectionList: document.getElementById('selectionList'),
    generateBtn: document.getElementById('generateBtn'),
    clearSelectionBtn: document.getElementById('clearSelectionBtn'),
    deleteSelectedBtn: document.getElementById('deleteSelectedBtn'),
    progressBar: document.getElementById('progressBar'),
    progressFill: document.getElementById('progressFill'),
    toast: document.getElementById('toast')
};

const ctx = elements.mainCanvas.getContext('2d');

// 初始化
function init() {
    // 文件上传
    elements.uploadArea.addEventListener('click', () => elements.fileInput.click());
    elements.fileInput.addEventListener('change', handleFileSelect);
    
    // 拖拽上传
    elements.uploadArea.addEventListener('dragover', handleDragOver);
    elements.uploadArea.addEventListener('drop', handleDrop);
    elements.uploadArea.addEventListener('dragleave', handleDragLeave);
    
    // Canvas事件
    elements.mainCanvas.addEventListener('mousedown', handleCanvasMouseDown);
    elements.mainCanvas.addEventListener('mousemove', handleCanvasMouseMove);
    elements.mainCanvas.addEventListener('mouseup', handleCanvasMouseUp);
    elements.mainCanvas.addEventListener('dblclick', handleCanvasDoubleClick);
    
    // 按钮事件
    elements.generateBtn.addEventListener('click', handleGeneratePPT);
    elements.clearSelectionBtn.addEventListener('click', handleClearSelection);
    elements.deleteSelectedBtn.addEventListener('click', handleDeleteSelected);
}

// 文件选择处理
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        uploadFile(file);
    }
}

// 拖拽处理
function handleDragOver(e) {
    e.preventDefault();
    elements.uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    elements.uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    elements.uploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
        uploadFile(file);
    } else {
        showToast('请上传PDF文件', 'error');
    }
}

// 上传文件
async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    showToast('正在上传PDF文件...', 'info');
    
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            state.fileId = data.file_id;
            state.pages = data.pages;
            state.selections = {};
            
            // 显示主工作区
            elements.uploadSection.style.display = 'none';
            elements.mainWorkspace.style.display = 'grid';
            
            // 渲染页面缩略图
            renderPageThumbnails();
            
            showToast('PDF上传成功！', 'success');
        } else {
            showToast(data.error || '上传失败', 'error');
        }
    } catch (error) {
        showToast('上传失败: ' + error.message, 'error');
    }
}

// 渲染页面缩略图
function renderPageThumbnails() {
    elements.pageThumbnails.innerHTML = '';
    
    state.pages.forEach((page, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'page-thumbnail';
        thumbnail.dataset.page = page.page;
        
        const img = document.createElement('img');
        img.src = page.path;
        img.alt = `第${page.page}页`;
        img.onload = () => {
            // 缩略图加载完成
        };
        
        const pageNumber = document.createElement('div');
        pageNumber.className = 'page-number';
        pageNumber.textContent = `第 ${page.page} 页`;
        
        thumbnail.appendChild(img);
        thumbnail.appendChild(pageNumber);
        thumbnail.addEventListener('click', () => loadPage(page.page));
        
        elements.pageThumbnails.appendChild(thumbnail);
    });
}

// 加载页面
async function loadPage(pageNum) {
    // 更新当前页面
    state.currentPage = pageNum;
    
    // 更新缩略图选中状态
    document.querySelectorAll('.page-thumbnail').forEach(thumb => {
        if (parseInt(thumb.dataset.page) === pageNum) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
    
    // 加载图片
    const page = state.pages.find(p => p.page === pageNum);
    if (!page) return;
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
        state.currentImage = img;
        
        // 设置Canvas尺寸
        elements.mainCanvas.width = img.width;
        elements.mainCanvas.height = img.height;
        
        // 绘制图片
        drawCanvas();
        
        // 隐藏覆盖层
        elements.canvasOverlay.style.display = 'none';
        
        // 更新标题
        elements.currentPageTitle.textContent = `第 ${pageNum} 页`;
        
        // 更新控制按钮
        const hasSelections = state.selections[pageNum] && state.selections[pageNum].length > 0;
        elements.clearSelectionBtn.style.display = hasSelections ? 'block' : 'none';
    };
    
    img.src = page.path;
}

// 绘制Canvas
function drawCanvas() {
    if (!state.currentImage) return;
    
    // 清空Canvas
    ctx.clearRect(0, 0, elements.mainCanvas.width, elements.mainCanvas.height);
    
    // 绘制图片
    ctx.drawImage(state.currentImage, 0, 0);
    
    // 绘制所有矩形框
    if (state.currentPage && state.selections[state.currentPage]) {
        state.selections[state.currentPage].forEach(rect => {
            drawRect(rect, rect.id === state.selectedRectId);
        });
    }
    
    // 绘制当前正在绘制的矩形框
    if (state.currentRect) {
        drawRect(state.currentRect, false);
    }
}

// 绘制矩形框
function drawRect(rect, isSelected) {
    const { x, y, width, height } = rect;
    
    // 绘制矩形
    ctx.strokeStyle = isSelected ? '#667eea' : '#ff6b6b';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.strokeRect(x, y, width, height);
    
    // 绘制半透明填充
    ctx.fillStyle = isSelected ? 'rgba(102, 126, 234, 0.1)' : 'rgba(255, 107, 107, 0.1)';
    ctx.fillRect(x, y, width, height);
    
    // 如果选中，绘制调整手柄
    if (isSelected) {
        const handleSize = 8;
        const handles = [
            { x: x, y: y }, // 左上
            { x: x + width, y: y }, // 右上
            { x: x, y: y + height }, // 左下
            { x: x + width, y: y + height }, // 右下
            { x: x + width / 2, y: y }, // 上
            { x: x + width / 2, y: y + height }, // 下
            { x: x, y: y + height / 2 }, // 左
            { x: x + width, y: y + height / 2 } // 右
        ];
        
        handles.forEach(handle => {
            ctx.fillStyle = '#667eea';
            ctx.fillRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 1;
            ctx.strokeRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
        });
    }
}

// Canvas鼠标事件处理
function handleCanvasMouseDown(e) {
    if (!state.currentImage) return;
    
    const rect = elements.mainCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 转换为Canvas坐标
    const scaleX = elements.mainCanvas.width / rect.width;
    const scaleY = elements.mainCanvas.height / rect.height;
    const canvasX = x * scaleX;
    const canvasY = y * scaleY;
    
    // 检查是否点击在调整手柄上
    if (state.selectedRectId && state.currentPage) {
        const selectedRect = state.selections[state.currentPage].find(r => r.id === state.selectedRectId);
        if (selectedRect) {
            const handle = getResizeHandle(selectedRect, canvasX, canvasY);
            if (handle) {
                state.isResizing = true;
                state.resizeHandle = handle;
                state.startX = canvasX;
                state.startY = canvasY;
                return;
            }
            
            // 检查是否点击在矩形框内（拖拽）
            if (isPointInRect(canvasX, canvasY, selectedRect)) {
                state.isDragging = true;
                state.startX = canvasX;
                state.startY = canvasY;
                return;
            }
        }
    }
    
    // 开始绘制新矩形框
    state.isDrawing = true;
    state.currentRect = {
        x: canvasX,
        y: canvasY,
        width: 0,
        height: 0
    };
    state.selectedRectId = null;
    updateSelectionList();
}

function handleCanvasMouseMove(e) {
    if (!state.currentImage) return;
    
    const rect = elements.mainCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 转换为Canvas坐标
    const scaleX = elements.mainCanvas.width / rect.width;
    const scaleY = elements.mainCanvas.height / rect.height;
    const canvasX = x * scaleX;
    const canvasY = y * scaleY;
    
    // 调整矩形框大小
    if (state.isResizing && state.selectedRectId && state.currentPage) {
        const selectedRect = state.selections[state.currentPage].find(r => r.id === state.selectedRectId);
        if (selectedRect) {
            resizeRect(selectedRect, state.resizeHandle, canvasX, canvasY);
            drawCanvas();
            updateSelectionList();
            return;
        }
    }
    
    // 拖拽矩形框
    if (state.isDragging && state.selectedRectId && state.currentPage) {
        const selectedRect = state.selections[state.currentPage].find(r => r.id === state.selectedRectId);
        if (selectedRect) {
            const dx = canvasX - state.startX;
            const dy = canvasY - state.startY;
            
            selectedRect.x = Math.max(0, Math.min(selectedRect.x + dx, elements.mainCanvas.width - selectedRect.width));
            selectedRect.y = Math.max(0, Math.min(selectedRect.y + dy, elements.mainCanvas.height - selectedRect.height));
            
            state.startX = canvasX;
            state.startY = canvasY;
            
            drawCanvas();
            updateSelectionList();
            return;
        }
    }
    
    // 绘制新矩形框
    if (state.isDrawing && state.currentRect) {
        state.currentRect.width = canvasX - state.currentRect.x;
        state.currentRect.height = canvasY - state.currentRect.y;
        drawCanvas();
    }
    
    // 更新鼠标样式
    updateCursor(canvasX, canvasY);
}

function handleCanvasMouseUp(e) {
    if (state.isDrawing && state.currentRect) {
        // 完成绘制
        const rect = normalizeRect(state.currentRect);
        if (rect.width > 10 && rect.height > 10) {
            // 添加到选择列表
            if (!state.selections[state.currentPage]) {
                state.selections[state.currentPage] = [];
            }
            
            if (!rect.id) {
                rect.id = ++state.rectCounter;
            }
            state.selections[state.currentPage].push(rect);
            state.selectedRectId = rect.id;
            
            updateSelectionList();
            updateGenerateButton();
        }
        
        state.currentRect = null;
        state.isDrawing = false;
        drawCanvas();
    }
    
    state.isDragging = false;
    state.isResizing = false;
    state.resizeHandle = null;
}

function handleCanvasDoubleClick(e) {
    // 双击选择矩形框
    if (!state.currentPage) return;
    
    const rect = elements.mainCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const scaleX = elements.mainCanvas.width / rect.width;
    const scaleY = elements.mainCanvas.height / rect.height;
    const canvasX = x * scaleX;
    const canvasY = y * scaleY;
    
    // 查找点击的矩形框
    if (state.selections[state.currentPage]) {
        for (let r of state.selections[state.currentPage]) {
            if (isPointInRect(canvasX, canvasY, r)) {
                // 如果点击的是已选中的，取消选择
                if (state.selectedRectId === r.id) {
                    state.selectedRectId = null;
                    state.selectedMergedId = null;
                } else {
                    state.selectedRectId = r.id;
                    state.selectedMergedId = null; // 选择单个题目时，取消合并组选择
                }
                drawCanvas();
                updateSelectionList();
                return;
            }
        }
    }
    
    // 点击空白区域，取消所有选择
    state.selectedRectId = null;
    state.selectedMergedId = null;
    drawCanvas();
    updateSelectionList();
}

// 工具函数
function normalizeRect(rect) {
    return {
        x: Math.min(rect.x, rect.x + rect.width),
        y: Math.min(rect.y, rect.y + rect.height),
        width: Math.abs(rect.width),
        height: Math.abs(rect.height)
    };
}

function isPointInRect(x, y, rect) {
    return x >= rect.x && x <= rect.x + rect.width &&
           y >= rect.y && y <= rect.y + rect.height;
}

function getResizeHandle(rect, x, y) {
    const handleSize = 12;
    const handles = [
        { type: 'nw', x: rect.x, y: rect.y },
        { type: 'ne', x: rect.x + rect.width, y: rect.y },
        { type: 'sw', x: rect.x, y: rect.y + rect.height },
        { type: 'se', x: rect.x + rect.width, y: rect.y + rect.height },
        { type: 'n', x: rect.x + rect.width / 2, y: rect.y },
        { type: 's', x: rect.x + rect.width / 2, y: rect.y + rect.height },
        { type: 'w', x: rect.x, y: rect.y + rect.height / 2 },
        { type: 'e', x: rect.x + rect.width, y: rect.y + rect.height / 2 }
    ];
    
    for (let handle of handles) {
        if (Math.abs(x - handle.x) < handleSize && Math.abs(y - handle.y) < handleSize) {
            return handle.type;
        }
    }
    
    return null;
}

function resizeRect(rect, handle, x, y) {
    const minSize = 20;
    
    switch (handle) {
        case 'nw':
            rect.width = Math.max(minSize, rect.x + rect.width - x);
            rect.height = Math.max(minSize, rect.y + rect.height - y);
            rect.x = Math.max(0, x);
            rect.y = Math.max(0, y);
            break;
        case 'ne':
            rect.width = Math.max(minSize, x - rect.x);
            rect.height = Math.max(minSize, rect.y + rect.height - y);
            rect.y = Math.max(0, y);
            break;
        case 'sw':
            rect.width = Math.max(minSize, rect.x + rect.width - x);
            rect.height = Math.max(minSize, y - rect.y);
            rect.x = Math.max(0, x);
            break;
        case 'se':
            rect.width = Math.max(minSize, x - rect.x);
            rect.height = Math.max(minSize, y - rect.y);
            break;
        case 'n':
            rect.height = Math.max(minSize, rect.y + rect.height - y);
            rect.y = Math.max(0, y);
            break;
        case 's':
            rect.height = Math.max(minSize, y - rect.y);
            break;
        case 'w':
            rect.width = Math.max(minSize, rect.x + rect.width - x);
            rect.x = Math.max(0, x);
            break;
        case 'e':
            rect.width = Math.max(minSize, x - rect.x);
            break;
    }
    
    // 限制在Canvas范围内
    rect.x = Math.max(0, Math.min(rect.x, elements.mainCanvas.width - rect.width));
    rect.y = Math.max(0, Math.min(rect.y, elements.mainCanvas.height - rect.height));
    rect.width = Math.min(rect.width, elements.mainCanvas.width - rect.x);
    rect.height = Math.min(rect.height, elements.mainCanvas.height - rect.y);
}

function updateCursor(x, y) {
    if (state.selectedRectId && state.currentPage) {
        const selectedRect = state.selections[state.currentPage].find(r => r.id === state.selectedRectId);
        if (selectedRect) {
            const handle = getResizeHandle(selectedRect, x, y);
            if (handle) {
                const cursors = {
                    'nw': 'nw-resize', 'ne': 'ne-resize', 'sw': 'sw-resize', 'se': 'se-resize',
                    'n': 'n-resize', 's': 's-resize', 'w': 'w-resize', 'e': 'e-resize'
                };
                elements.mainCanvas.style.cursor = cursors[handle] || 'default';
                return;
            }
            
            if (isPointInRect(x, y, selectedRect)) {
                elements.mainCanvas.style.cursor = 'move';
                return;
            }
        }
    }
    
    elements.mainCanvas.style.cursor = 'crosshair';
}

// 更新选择列表
function updateSelectionList() {
    // 计算所有题目（包括合并的）
    const allQuestions = getAllQuestions();
    
    if (allQuestions.length === 0) {
        elements.selectionList.innerHTML = '<p class="empty-hint">暂无选择</p>';
        updateGenerateButton();
        return;
    }
    
    // 如果自定义顺序为空或长度不匹配，初始化自定义顺序
    // 但只在customOrder完全为空时才初始化，避免覆盖已有的顺序
    if (state.customOrder.length === 0) {
        state.customOrder = allQuestions.map(q => ({
            type: q.isMerged ? 'merged' : 'single',
            pageNum: q.isMerged ? null : q.pageNum,
            rectId: q.isMerged ? null : q.rectId,
            mergedId: q.isMerged ? q.mergedId : null
        }));
    } else {
        // 同步customOrder，添加新题目，移除已删除的题目
        const existingIds = new Set();
        state.customOrder.forEach(order => {
            if (order.type === 'merged') {
                existingIds.add(`merged_${order.mergedId}`);
            } else {
                existingIds.add(`single_${order.pageNum}_${order.rectId}`);
            }
        });
        
        // 添加不在customOrder中的新题目
        allQuestions.forEach(q => {
            const id = q.isMerged ? `merged_${q.mergedId}` : `single_${q.pageNum}_${q.rectId}`;
            if (!existingIds.has(id)) {
                state.customOrder.push({
                    type: q.isMerged ? 'merged' : 'single',
                    pageNum: q.isMerged ? null : q.pageNum,
                    rectId: q.isMerged ? null : q.rectId,
                    mergedId: q.isMerged ? q.mergedId : null
                });
            }
        });
        
        // 移除已删除的题目
        state.customOrder = state.customOrder.filter(order => {
            if (order.type === 'merged') {
                return state.mergedSelections.some(m => m.id === order.mergedId);
            } else {
                const pageNum = order.pageNum;
                const rectId = order.rectId;
                if (!state.selections[pageNum]) return false;
                return state.selections[pageNum].some(r => r.id === rectId);
            }
        });
    }
    
    // 按照自定义顺序排序
    const orderedQuestions = state.customOrder.map(orderItem => {
        return allQuestions.find(q => {
            if (orderItem.type === 'merged') {
                return q.isMerged && q.mergedId === orderItem.mergedId;
            } else {
                return !q.isMerged && q.pageNum === orderItem.pageNum && q.rectId === orderItem.rectId;
            }
        });
    }).filter(q => q !== undefined);
    
    // 添加不在自定义顺序中的新题目
    allQuestions.forEach(q => {
        const exists = orderedQuestions.some(oq => 
            (q.isMerged && oq.isMerged && q.mergedId === oq.mergedId) ||
            (!q.isMerged && !oq.isMerged && q.pageNum === oq.pageNum && q.rectId === oq.rectId)
        );
        if (!exists) {
            orderedQuestions.push(q);
        }
    });
    
    elements.selectionList.innerHTML = '';
    
    // 按自定义顺序显示所有题目
    orderedQuestions.forEach((question, index) => {
        if (!question) return;
        
        const questionNum = index + 1;
        const item = document.createElement('div');
        item.className = 'selection-item';
        item.draggable = true;
        item.dataset.questionIndex = index;
        
        // 判断是否选中
        const isSelected = question.isMerged 
            ? question.mergedId === state.selectedMergedId
            : (question.rectId === state.selectedRectId && parseInt(question.pageNum) === state.currentPage);
        
        if (isSelected) {
            item.classList.add('selected');
        }
        
        // 拖拽事件
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragend', handleDragEnd);
        
        if (question.isMerged) {
            // 合并题目显示
            const pageInfo = question.items.map(item => `第${item.pageNum}页`).join(' + ');
            item.innerHTML = `
                <div class="drag-handle">☰</div>
                <div class="selection-item-info">
                    <div class="page-info">题目 ${questionNum}（合并：${pageInfo}）</div>
                    <div class="size-info">${question.items.length} 张图片</div>
                </div>
                <div class="selection-item-actions">
                    <button class="btn-icon" onclick="selectMerged(${question.mergedId})" title="${question.mergedId === state.selectedMergedId ? '取消选择' : '选择'}">${question.mergedId === state.selectedMergedId ? '✓' : '👆'}</button>
                    <button class="btn-icon" onclick="deleteMerged(${question.mergedId})" title="删除">🗑️</button>
                </div>
            `;
        } else {
            // 单个题目显示
            item.innerHTML = `
                <div class="drag-handle">☰</div>
                <div class="selection-item-info">
                    <div class="page-info">题目 ${questionNum}</div>
                    <div class="size-info">${Math.round(question.width)} × ${Math.round(question.height)} px</div>
                </div>
                <div class="selection-item-actions">
                    <button class="btn-icon" onclick="selectRect(${question.pageNum}, ${question.rectId})" title="${question.rectId === state.selectedRectId && parseInt(question.pageNum) === state.currentPage ? '取消选择' : '选择'}">${question.rectId === state.selectedRectId && parseInt(question.pageNum) === state.currentPage ? '✓' : '👆'}</button>
                    <button class="btn-icon" onclick="mergeQuestion(${question.pageNum}, ${question.rectId})" title="合并">🔗</button>
                    <button class="btn-icon" onclick="deleteRect(${question.pageNum}, ${question.rectId})" title="删除">🗑️</button>
                </div>
            `;
        }
        
        elements.selectionList.appendChild(item);
    });
    
    updateGenerateButton();
}

// 拖拽相关变量
let draggedElement = null;
let draggedIndex = null;

// 拖拽开始
function handleDragStart(e) {
    draggedElement = this;
    draggedIndex = parseInt(this.dataset.questionIndex);
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

// 拖拽悬停
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
    return false;
}

// 拖拽放置
function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    const dropIndex = parseInt(this.dataset.questionIndex);
    
    if (draggedIndex !== dropIndex) {
        // 更新自定义顺序
        const temp = state.customOrder[draggedIndex];
        state.customOrder.splice(draggedIndex, 1);
        state.customOrder.splice(dropIndex, 0, temp);
        
        // 重新渲染列表
        updateSelectionList();
    }
    
    return false;
}

// 拖拽结束
function handleDragEnd(e) {
    document.querySelectorAll('.selection-item').forEach(item => {
        item.classList.remove('drag-over', 'dragging');
    });
    draggedElement = null;
    draggedIndex = null;
}

// 获取所有题目（包括合并的），如果自定义顺序存在则按自定义顺序，否则按第一张图片的位置排序
function getAllQuestions() {
    const questions = [];
    
    // 添加合并的题目
    state.mergedSelections.forEach(merged => {
        questions.push({
            isMerged: true,
            mergedId: merged.id,
            items: merged.items
        });
    });
    
    // 添加未合并的单个题目
    Object.keys(state.selections).sort((a, b) => parseInt(a) - parseInt(b)).forEach(pageNum => {
        const pageSelections = state.selections[pageNum];
        pageSelections.forEach(rect => {
            // 检查这个矩形框是否已经在合并题目中
            const isInMerged = state.mergedSelections.some(merged => 
                merged.items.some(item => item.pageNum === parseInt(pageNum) && item.rectId === rect.id)
            );
            
            if (!isInMerged) {
                questions.push({
                    isMerged: false,
                    pageNum: parseInt(pageNum),
                    rectId: rect.id,
                    width: rect.width,
                    height: rect.height
                });
            }
        });
    });
    
    // 如果自定义顺序存在且有效，按自定义顺序排序
    if (state.customOrder.length > 0 && state.customOrder.length === questions.length) {
        const orderedQuestions = [];
        state.customOrder.forEach(orderItem => {
            const question = questions.find(q => {
                if (orderItem.type === 'merged') {
                    return q.isMerged && q.mergedId === orderItem.mergedId;
                } else {
                    return !q.isMerged && q.pageNum === orderItem.pageNum && q.rectId === orderItem.rectId;
                }
            });
            if (question) {
                orderedQuestions.push(question);
            }
        });
        return orderedQuestions;
    }
    
    // 否则按默认排序（第一张图片的位置）
    const questionsWithSortKey = questions.map(q => {
        if (q.isMerged) {
            const firstItem = q.items.sort((a, b) => {
                if (a.pageNum !== b.pageNum) return a.pageNum - b.pageNum;
                return a.rectId - b.rectId;
            })[0];
            return { ...q, sortKey: getQuestionSortKey(firstItem.pageNum, firstItem.rectId) };
        } else {
            return { ...q, sortKey: getQuestionSortKey(q.pageNum, q.rectId) };
        }
    });
    
    questionsWithSortKey.sort((a, b) => {
        if (a.sortKey.pageNum !== b.sortKey.pageNum) {
            return a.sortKey.pageNum - b.sortKey.pageNum;
        }
        if (a.sortKey.y !== b.sortKey.y) {
            return a.sortKey.y - b.sortKey.y;
        }
        return a.sortKey.rectId - b.sortKey.rectId;
    });
    
    return questionsWithSortKey;
}

// 获取题目的排序键
function getQuestionSortKey(pageNum, rectId) {
    // 计算矩形框在页面中的位置（按y坐标，从上到下）
    if (state.selections[pageNum]) {
        const rect = state.selections[pageNum].find(r => r.id === rectId);
        if (rect) {
            return {
                pageNum: pageNum,
                y: rect.y, // 使用y坐标作为次要排序
                rectId: rectId
            };
        }
    }
    return {
        pageNum: pageNum,
        y: 0,
        rectId: rectId
    };
}

// 选择矩形框（点击已选中的会取消选择）
function selectRect(pageNum, rectId) {
    if (parseInt(pageNum) !== state.currentPage) {
        loadPage(parseInt(pageNum));
    }
    
    // 如果点击的是已选中的，取消选择
    if (state.selectedRectId === rectId && parseInt(pageNum) === state.currentPage) {
        state.selectedRectId = null;
        state.selectedMergedId = null; // 同时取消合并组选择
    } else {
        state.selectedRectId = rectId;
        state.selectedMergedId = null; // 选择单个题目时，取消合并组选择
    }
    
    drawCanvas();
    updateSelectionList();
}

// 删除矩形框
function deleteRect(pageNum, rectId) {
    // 检查是否在合并组中
    state.mergedSelections = state.mergedSelections.filter(merged => {
        const hasRect = merged.items.some(item => item.pageNum === parseInt(pageNum) && item.rectId === rectId);
        if (hasRect && merged.items.length === 1) {
            // 如果合并组只有这一个，删除整个合并组
            if (state.selectedMergedId === merged.id) {
                state.selectedMergedId = null;
            }
            return false;
        } else if (hasRect) {
            // 如果合并组有多个，只删除这个矩形框
            merged.items = merged.items.filter(item => !(item.pageNum === parseInt(pageNum) && item.rectId === rectId));
            return true;
        }
        return true;
    });
    
    if (state.selections[pageNum]) {
        state.selections[pageNum] = state.selections[pageNum].filter(r => r.id !== rectId);
        if (state.selections[pageNum].length === 0) {
            delete state.selections[pageNum];
        }
    }
    
    // 从自定义顺序中删除
    state.customOrder = state.customOrder.filter(order => 
        !(order.type === 'single' && order.pageNum === parseInt(pageNum) && order.rectId === rectId)
    );
    
    if (state.selectedRectId === rectId) {
        state.selectedRectId = null;
    }
    
    if (parseInt(pageNum) === state.currentPage) {
        drawCanvas();
    }
    
    updateSelectionList();
    updateGenerateButton();
}

// 清除当前页面选择
function handleClearSelection() {
    if (state.currentPage && state.selections[state.currentPage]) {
        delete state.selections[state.currentPage];
        state.selectedRectId = null;
        drawCanvas();
        updateSelectionList();
        updateGenerateButton();
        elements.clearSelectionBtn.style.display = 'none';
    }
}

// 删除选中的矩形框
function handleDeleteSelected() {
    if (state.selectedRectId && state.currentPage) {
        deleteRect(state.currentPage, state.selectedRectId);
    }
}

// 更新生成按钮状态
function updateGenerateButton() {
    const allQuestions = getAllQuestions();
    elements.generateBtn.disabled = allQuestions.length === 0;
}

// 合并题目
function mergeQuestion(pageNum, rectId) {
    // 检查这个题目是否已经在某个合并组中
    const existingMerged = state.mergedSelections.find(merged => 
        merged.items.some(item => item.pageNum === parseInt(pageNum) && item.rectId === rectId)
    );
    
    if (existingMerged) {
        showToast('该题目已在合并组中，请先删除合并组', 'info');
        return;
    }
    
    // 检查是否已经有选中的合并组（且明确选中）
    if (state.selectedMergedId) {
        // 添加到现有合并组
        const merged = state.mergedSelections.find(m => m.id === state.selectedMergedId);
        if (merged) {
            merged.items.push({ pageNum: parseInt(pageNum), rectId: rectId });
            
            // 从customOrder中移除这个单个题目
            state.customOrder = state.customOrder.filter(order => 
                !(order.type === 'single' && order.pageNum === parseInt(pageNum) && order.rectId === rectId)
            );
            
            // 更新customOrder中的合并组（如果存在）
            const mergedOrderIndex = state.customOrder.findIndex(order => 
                order.type === 'merged' && order.mergedId === merged.id
            );
            if (mergedOrderIndex === -1) {
                // 如果合并组不在customOrder中，添加它（放在被合并题目的位置）
                const removedIndex = state.customOrder.findIndex(order => 
                    order.type === 'single' && order.pageNum === parseInt(pageNum) && order.rectId === rectId
                );
                if (removedIndex !== -1) {
                    state.customOrder.splice(removedIndex, 0, {
                        type: 'merged',
                        mergedId: merged.id
                    });
                } else {
                    state.customOrder.push({
                        type: 'merged',
                        mergedId: merged.id
                    });
                }
            }
            
            updateSelectionList();
            showToast(`已添加到合并题目（共${merged.items.length}张图片）`, 'success');
            // 保持合并组选中状态，方便继续添加
            return;
        }
    }
    
    // 检查是否选中了单个题目（且是当前题目）
    if (state.selectedRectId === rectId && parseInt(pageNum) === state.currentPage) {
        // 如果选中的就是这个题目，创建新的合并组
        const mergedId = ++state.mergedCounter;
        state.mergedSelections.push({
            id: mergedId,
            items: [{ pageNum: parseInt(pageNum), rectId: rectId }]
        });
        
        // 更新customOrder：将单个题目替换为合并组
        const orderIndex = state.customOrder.findIndex(order => 
            order.type === 'single' && order.pageNum === parseInt(pageNum) && order.rectId === rectId
        );
        if (orderIndex !== -1) {
            state.customOrder[orderIndex] = {
                type: 'merged',
                mergedId: mergedId
            };
        } else {
            // 如果不在customOrder中，添加合并组
            state.customOrder.push({
                type: 'merged',
                mergedId: mergedId
            });
        }
        
        state.selectedMergedId = mergedId;
        state.selectedRectId = null;
        updateSelectionList();
        showToast('已创建合并题目，请选择另一张图片点击"合并"按钮继续合并', 'info');
    } else {
        // 先选中这个题目，然后提示用户选择另一张图片
        selectRect(pageNum, rectId);
        showToast('已选中题目，请选择另一张图片点击"合并"按钮进行合并', 'info');
    }
}

// 选择合并题目（点击已选中的会取消选择）
function selectMerged(mergedId) {
    if (state.selectedMergedId === mergedId) {
        // 如果点击的是已选中的，取消选择
        state.selectedMergedId = null;
    } else {
        // 否则选中这个合并组
        state.selectedMergedId = mergedId;
        state.selectedRectId = null;
    }
    updateSelectionList();
}

// 删除合并题目
function deleteMerged(mergedId) {
    state.mergedSelections = state.mergedSelections.filter(m => m.id !== mergedId);
    // 从自定义顺序中删除
    state.customOrder = state.customOrder.filter(order => 
        !(order.type === 'merged' && order.mergedId === mergedId)
    );
    if (state.selectedMergedId === mergedId) {
        state.selectedMergedId = null;
    }
    updateSelectionList();
}

// 生成PPT
async function handleGeneratePPT() {
    const allQuestions = getAllQuestions();
    if (allQuestions.length === 0) {
        showToast('请至少选择一道题目', 'error');
        return;
    }
    
    elements.generateBtn.disabled = true;
    elements.progressBar.style.display = 'block';
    elements.progressFill.style.width = '30%';
    
    showToast('正在生成PPT...', 'info');
    
    try {
        const response = await fetch('/api/generate-ppt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                file_id: state.fileId,
                selections: state.selections,
                merged_selections: state.mergedSelections,
                custom_order: state.customOrder
            })
        });
        
        const data = await response.json();
        
        elements.progressFill.style.width = '100%';
        
        if (data.success) {
            showToast('PPT生成成功！', 'success');
            
            // 下载PPT
            setTimeout(() => {
                window.location.href = data.download_url;
                elements.progressBar.style.display = 'none';
                elements.progressFill.style.width = '0%';
                elements.generateBtn.disabled = false;
            }, 500);
        } else {
            showToast(data.error || '生成失败', 'error');
            elements.progressBar.style.display = 'none';
            elements.progressFill.style.width = '0%';
            elements.generateBtn.disabled = false;
        }
    } catch (error) {
        showToast('生成失败: ' + error.message, 'error');
        elements.progressBar.style.display = 'none';
        elements.progressFill.style.width = '0%';
        elements.generateBtn.disabled = false;
    }
}

// Toast提示
function showToast(message, type = 'info') {
    elements.toast.textContent = message;
    elements.toast.className = `toast ${type}`;
    elements.toast.classList.add('show');
    
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

