/**
 * Tool Offset - Dev Long (Login Mobile Pro)
 * Bản quyền © 2026 Dev Long - V3 Titanium
 * Source logic đã được tách biệt & Tối ưu hóa thứ tự nạp (Fix ReferenceError).
 */

(function() { // Bỏ async ở IIFE gốc để chạy đồng bộ phần khai báo
    
    // =================================================================
    // 1. KHAI BÁO BIẾN & HÀM GLOBAL TRƯỚC (ĐỂ HTML GỌI KHÔNG BỊ LỖI)
    // =================================================================

    const CONFIG_URL = 'https://tieuli158.github.io/Tieuli/configoffset.json'; 

    // --- BIẾN TOÀN CỤC ---
    window.dumpData = [];          
    window.foundOffsets = [];      
    window.rawQuickListText = "";  
    window.selectedProjectName = ""; 
    window.currentNotificationTimeout = null; 
    window.scanDebounceTimer = null; 
    
    // Biến cho Web Worker
    let worker = null;
    
    // Biến cho hộp thoại xác nhận
    window.pendingFileObject = null;
    window.pendingProjectName = "";

    // --- CÁC HÀM GIAO DIỆN (UI FUNCTIONS) ---
    // Khai báo ngay lập tức để tránh lỗi "is not defined"

    // 1. Hàm chuyển Tab Mobile
    window.switchMobileTab = function(tabName) {
        if (window.innerWidth > 900) return;

        const sidebar = document.getElementById('sidebarSection');
        const mainContent = document.getElementById('mainContentSection');
        const tabBtnTools = document.getElementById('tabBtnTools');
        const tabBtnResults = document.getElementById('tabBtnResults');

        if(!sidebar || !mainContent) return;

        if (tabName === 'tools') {
            sidebar.style.display = 'flex'; 
            sidebar.classList.add('mobile-tab-active');
            mainContent.style.display = 'none';
            mainContent.classList.remove('mobile-tab-active');
            if(tabBtnTools) tabBtnTools.classList.add('active');
            if(tabBtnResults) tabBtnResults.classList.remove('active');
        } else {
            mainContent.style.display = 'flex';
            mainContent.classList.add('mobile-tab-active');
            sidebar.style.display = 'none';
            sidebar.classList.remove('mobile-tab-active');
            if(tabBtnResults) tabBtnResults.classList.add('active');
            if(tabBtnTools) tabBtnTools.classList.remove('active');
        }
        if(typeof window.playSound === 'function') window.playSound('click');
    }

    // 2. Hàm xử lý Login
    window.handleLogin = function() {
        const user = document.getElementById("loginUser").value.trim();
        const pass = document.getElementById("loginPass").value.trim();
        const remember = document.getElementById("rememberMe").checked;

        if (user && pass) { 
            localStorage.setItem("devlong_isLoggedIn", "true");
            
            if (remember) {
                localStorage.setItem("devlong_savedUser", user);
                localStorage.setItem("devlong_savedPass", pass);
            } else {
                localStorage.removeItem("devlong_savedUser");
                localStorage.removeItem("devlong_savedPass");
            }

            document.getElementById("loginOverlay").classList.add("hidden");
            document.getElementById("appContainer").classList.add("logged-in");
            window.playSound('success');
        } else {
            window.showNotify("Vui lòng nhập tài khoản & mật khẩu!", "error");
            window.playSound('error');
        }
    }

    window.toggleLoginPassword = function(icon) {
        const input = document.getElementById("loginPass");
        if (input.type === "password") {
            input.type = "text";
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");
        } else {
            input.type = "password";
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");
        }
    }

    window.logoutDirect = function() {
        localStorage.removeItem("devlong_isLoggedIn");
        document.getElementById("appContainer").classList.remove("logged-in");
        
        const overlay = document.getElementById("loginOverlay");
        if(overlay) {
            overlay.style.display = "flex"; // Hiện lại overlay
            overlay.classList.remove("hidden");
        }
        
        if (!document.getElementById("rememberMe").checked) {
            document.getElementById("loginPass").value = "";
        }
        window.playSound('delete');
    }

    // 3. Hệ thống âm thanh
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx;

    function initAudio() { 
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();
    }

    window.playSound = function(type) {
        initAudio(); 
        if (!audioCtx) return;
        
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'success') { 
            osc.type = 'sine'; osc.frequency.setValueAtTime(800, t);
            osc.frequency.exponentialRampToValueAtTime(1600, t + 0.1);
            gain.gain.setValueAtTime(0.1, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
            osc.start(t); osc.stop(t + 0.5);
        } else if (type === 'error') { 
            osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, t);
            osc.frequency.linearRampToValueAtTime(100, t + 0.2);
            gain.gain.setValueAtTime(0.2, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
            osc.start(t); osc.stop(t + 0.3);
        } else if (type === 'click' || type === 'copy') { 
            osc.type = 'square'; osc.frequency.setValueAtTime(2000, t);
            gain.gain.setValueAtTime(0.05, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
            osc.start(t); osc.stop(t + 0.05);
        } else if (type === 'delete') { 
            osc.type = 'sawtooth'; osc.frequency.setValueAtTime(500, t);
            osc.frequency.exponentialRampToValueAtTime(50, t + 0.2);
            gain.gain.setValueAtTime(0.1, t); gain.gain.linearRampToValueAtTime(0.001, t + 0.2);
            osc.start(t); osc.stop(t + 0.2);
        }
    }

    // 4. Các hàm xử lý dự án (Project Actions)
    window.quickRename = function(e, name) {
        e.stopPropagation();
        window.selectedProjectName = name;
        document.getElementById("customSelectTrigger").textContent = name;
        window.toggleRenameMode(true);
        document.getElementById("customSelectItems").classList.add("select-hide");
        document.getElementById("customSelectTrigger").classList.remove("select-arrow-active");
    }
    
    window.quickDelete = function(e, name) {
        e.stopPropagation();
        window.selectedProjectName = name;
        window.toggleDeleteMode(true);
        document.getElementById("customSelectItems").classList.add("select-hide");
        document.getElementById("customSelectTrigger").classList.remove("select-arrow-active");
    }
    
    window.toggleCreateMode = function(show) {
        window.playSound('click');
        const trigger = document.querySelector('.custom-select'); const group = document.getElementById('creationGroup'); 
        const btnAdd = document.getElementById('btnAddProject'); const btnDel = document.getElementById('btnDelProject'); const btnRename = document.getElementById('btnRenameProject');
        if (show) {
            trigger.style.display = 'none'; group.style.display = 'flex'; btnAdd.style.display = 'none'; 
            if(btnDel) btnDel.style.display = 'none'; 
            if(btnRename) btnRename.style.display = 'none';
            document.getElementById('newProjectName').value = ''; 
            document.getElementById('clearNewProjectBtn').style.display = 'none'; 
            document.getElementById('newProjectName').focus();
        } else {
            trigger.style.display = 'block'; group.style.display = 'none'; btnAdd.style.display = 'flex'; 
            if(btnDel) btnDel.style.display = 'flex'; 
            if(btnRename) btnRename.style.display = 'flex';
        }
    }

    window.toggleDeleteMode = function(show) {
        window.playSound('click');
        const trigger = document.querySelector('.custom-select'); const group = document.getElementById('deleteGroup');
        const btnAdd = document.getElementById('btnAddProject'); const btnDel = document.getElementById('btnDelProject'); const btnRename = document.getElementById('btnRenameProject');
        if (show) {
            if (!window.selectedProjectName) return window.showNotify("Vui lòng chọn dự án để xoá!", "error");
            trigger.style.display = 'none'; group.style.display = 'flex'; btnAdd.style.display = 'none'; 
            if(btnDel) btnDel.style.display = 'none'; 
            if(btnRename) btnRename.style.display = 'none';
            document.getElementById('deleteConfirmText').innerText = `"${window.selectedProjectName}"?`;
        } else {
            trigger.style.display = 'block'; group.style.display = 'none'; btnAdd.style.display = 'flex'; 
            if(btnDel) btnDel.style.display = 'flex'; 
            if(btnRename) btnRename.style.display = 'flex';
        }
    }

    window.toggleRenameMode = function(show) { 
        window.playSound('click');
        const trigger = document.querySelector('.custom-select'); const group = document.getElementById('renameGroup'); const btnAdd = document.getElementById('btnAddProject'); const btnDel = document.getElementById('btnDelProject'); const btnRename = document.getElementById('btnRenameProject'); 
        if (show) { 
            if (!window.selectedProjectName) return window.showNotify("Vui lòng chọn dự án để đổi tên!", "error"); 
            trigger.style.display = 'none'; group.style.display = 'flex'; btnAdd.style.display = 'none'; 
            if(btnDel) btnDel.style.display = 'none'; 
            if(btnRename) btnRename.style.display = 'none'; 
            document.getElementById('renameProjectInput').value = window.selectedProjectName; 
            document.getElementById('renameProjectInput').focus(); 
        } else { 
            trigger.style.display = 'block'; group.style.display = 'none'; btnAdd.style.display = 'flex'; 
            if(btnDel) btnDel.style.display = 'flex'; 
            if(btnRename) btnRename.style.display = 'flex'; 
        } 
    }

    window.saveNewProject = function() {
        const name = document.getElementById('newProjectName').value.trim();
        if (!name) return window.showNotify("Vui lòng nhập tên dự án!", "error");
        
        const safeName = "offsetPro_" + name;
        if (localStorage.getItem(safeName)) return window.showNotify("(Đã Có Dự Án)", "error");
        
        const currentInput = document.getElementById('input-1').value;
        // Reset bảng
        document.querySelector('#resultTable tbody').innerHTML = '<tr><td colspan="2" style="text-align: center; color: var(--text-dim); padding: 60px 20px;"><div style="display:flex; flex-direction:column; align-items:center; gap:15px; opacity:0.6;"><i class="fa-solid fa-magnifying-glass-chart" style="font-size: 3rem; color: var(--accent);"></i><span style="font-family: \'Be Vietnam Pro\'; font-size: 0.9rem;">Chưa có dữ liệu. Vui lòng nhập Code để tìm kiếm.</span></div></td></tr>';
        document.getElementById('resultCount').innerText = '0 Tìm thấy';
        document.getElementById('activeProjectTitle').style.display = 'none';
        window.foundOffsets = []; window.rawQuickListText = ""; 
        
        const data = { searchList: currentInput, createdAt: Date.now(), results: [], quickList: "" };
        localStorage.setItem(safeName, JSON.stringify(data));
        
        refreshProjectList(); window.selectedProjectName = name; document.getElementById("customSelectTrigger").textContent = name;
        window.showNotify(`Đã tạo dự án: ${name}`, "success"); window.toggleCreateMode(false); window.playSound('success');
        updateActiveProjectTitle(name);

        if (currentInput.trim() !== "") {
            document.getElementById('highlight-1').innerHTML = applySyntaxHighlighting(currentInput);
            window.runPrecisionScanner(false); 
        }
    }

    window.saveProject = function(silent = false) {
        if (!window.selectedProjectName) return window.showNotify("Vui lòng chọn dự án để lưu!", "error");
        const data = { searchList: document.getElementById('input-1').value, createdAt: Date.now(), results: window.foundOffsets, quickList: window.rawQuickListText };
        localStorage.setItem("offsetPro_" + window.selectedProjectName, JSON.stringify(data)); 
        refreshProjectList(); 
        if(!silent) { window.showNotify(`Đã lưu dữ liệu: ${window.selectedProjectName}`, "success"); window.playSound('success'); }
    }

    window.loadProject = function() {
        if (!window.selectedProjectName) { document.getElementById('input-1').value = ""; return; }
        const content = localStorage.getItem("offsetPro_" + window.selectedProjectName); 
        document.querySelector('#resultTable tbody').innerHTML = ''; document.getElementById('resultCount').innerText = '0 Tìm thấy'; window.foundOffsets = []; window.rawQuickListText = "";
        
        updateActiveProjectTitle(window.selectedProjectName);

        if (content !== null) { 
            try {
                const data = JSON.parse(content); 
                document.getElementById('input-1').value = data.searchList || ""; 
                if (data.results && Array.isArray(data.results) && data.results.length > 0) {
                    window.foundOffsets = data.results;
                    document.getElementById('resultCount').innerText = `${window.foundOffsets.length} Tìm thấy`;
                    window.foundOffsets.forEach(res => renderRow(res));
                    generateQuickListText(); 
                    window.showNotify(`Đã nạp lại ${window.foundOffsets.length} offset`, "success"); window.playSound('success');
                }
            } catch (e) { document.getElementById('input-1').value = content; }
            document.getElementById('input-1').dispatchEvent(new Event('input'));
        }
    }

    window.confirmRename = function() { const newName = document.getElementById('renameProjectInput').value.trim(); if(!newName) return window.showNotify("Tên dự án không được để trống!", "error"); if(newName === window.selectedProjectName) return window.toggleRenameMode(false); const oldKey = "offsetPro_" + window.selectedProjectName; const newKey = "offsetPro_" + newName; if(localStorage.getItem(newKey)) return window.showNotify("(Đã Có Dự Án)", "error"); const data = localStorage.getItem(oldKey); localStorage.setItem(newKey, data); localStorage.removeItem(oldKey); window.selectedProjectName = newName; document.getElementById("customSelectTrigger").textContent = newName; updateActiveProjectTitle(newName); refreshProjectList(); window.showNotify(`Đã đổi tên thành: ${newName}`, "success"); window.toggleRenameMode(false); window.playSound('success'); }
    
    window.confirmDeleteInline = function() { if (window.selectedProjectName) { localStorage.removeItem("offsetPro_" + window.selectedProjectName); window.clearWorkspace(false); refreshProjectList(); window.showNotify("Đã Xoá Dự Án", "delete"); window.playSound('delete'); } window.toggleDeleteMode(false); }

    window.inlineConfirmCreate = function() {
        if(!window.pendingProjectName) return;
        
        const newKey = "offsetPro_" + window.pendingProjectName;
        const blankData = { searchList: "", createdAt: Date.now(), results: [], quickList: "" };
        localStorage.setItem(newKey, JSON.stringify(blankData));
        
        window.selectedProjectName = window.pendingProjectName;
        refreshProjectList(); 
        document.getElementById("customSelectTrigger").textContent = window.pendingProjectName;
        updateActiveProjectTitle(window.pendingProjectName);
        document.getElementById('input-1').value = ""; 
        
        window.showNotify(`Đã tạo dự án mới: ${window.pendingProjectName}`, "success");
        window.playSound('success');
        
        setStatus(`Đã tạo dự án & Sẵn sàng!`, 'ready');
        window.pendingFileObject = null; window.pendingProjectName = "";
    }

    window.inlineRejectCreate = function() {
        window.showNotify(`Đã huỷ tạo. Chỉ đọc file!`, "success");
        window.playSound('click');
        setStatus(`Sẵn sàng quét (Chế độ chỉ đọc)`, 'ready');
        window.pendingFileObject = null; window.pendingProjectName = "";
    }

    window.clearWorkspace = function(notify = true) {
        document.getElementById('input-1').value = ''; 
        document.getElementById('highlight-1').innerHTML = ''; 
        document.querySelector('#resultTable tbody').innerHTML = '<tr><td colspan="2" style="text-align: center; color: var(--text-dim); padding: 60px 20px;"><div style="display:flex; flex-direction:column; align-items:center; gap:15px; opacity:0.6;"><i class="fa-solid fa-magnifying-glass-chart" style="font-size: 3rem; color: var(--accent);"></i><span style="font-family: \'Be Vietnam Pro\'; font-size: 0.9rem;">Chưa có dữ liệu. Vui lòng nhập Code để tìm kiếm.</span></div></td></tr>'; 
        document.getElementById('resultCount').innerText = '0 Tìm thấy';
        document.getElementById('activeProjectTitle').style.display = 'none';
        window.rawQuickListText = ""; window.foundOffsets = []; window.dumpData = []; 
        const fileIn = document.getElementById('fileInput'); if(fileIn) fileIn.value = ''; 
        window.selectedProjectName = ""; document.getElementById("customSelectTrigger").textContent = "-- Chọn Dự Án --";
        document.getElementById('dropZone').classList.remove('has-file');
        document.getElementById('dropZoneContent').innerHTML = `<i class="fa-solid fa-cloud-arrow-up drop-zone-icon"></i><div class="drop-zone-text"><h3>Kéo file vào đây</h3><p>hoặc chạm để chọn</p></div>`;
        setStatus('Chưa chọn file...', 'waiting'); 
        if(notify) { window.showNotify("Đã Xoá Tất Cả", "delete"); window.playSound('delete'); }
    }

    window.copyText = function(btn, text) { 
        navigator.clipboard.writeText(text).then(() => { 
            window.showNotify(`Đã copy offset: ${text}`, "copy"); 
            window.playSound('copy'); 
            
            const icon = btn.querySelector('i'); 
            const originalClass = "fa-regular fa-copy"; 
            icon.className = "fa-solid fa-check";
            icon.style.color = "#10b981"; 
            
            setTimeout(() => {
                icon.className = originalClass; 
                icon.style.color = ""; 
            }, 1500);
        }); 
    }

    window.copyQuickList = function(e) { 
        if(!window.rawQuickListText) { window.showNotify("Chưa có kết quả để Copy!", "error"); window.playSound('error'); return; } 
        navigator.clipboard.writeText(window.rawQuickListText).then(() => { window.showNotify(`Đã copy toàn bộ danh sách!`, "copy"); window.playSound('copy'); }); 
    }

    window.showNotify = function(msg, type='success') { 
        const container = document.getElementById('notification-container'); 
        if(!container) return;
        container.innerHTML = ''; 
        if (window.currentNotificationTimeout) {
            clearTimeout(window.currentNotificationTimeout);
            window.currentNotificationTimeout = null;
        }

        const noti = document.createElement('div'); 
        noti.className = `notification ${type}`; 
        
        let icon = 'fa-circle-check'; let title = 'Thành Công';
        if (type === 'error') { icon = 'fa-triangle-exclamation'; title = 'Lỗi'; }
        else if (type === 'delete') { icon = 'fa-trash-can'; title = 'Đã Xoá'; }
        else if (type === 'copy') { icon = 'fa-copy'; title = 'Đã Copy'; }

        noti.innerHTML = `<div class="notif-content"><div class="notif-icon-box"><i class="fa-solid ${icon}"></i></div><div class="notif-text-col"><div class="notif-title">${title}</div><div class="notif-desc">${msg}</div></div><div class="notif-close-btn" onclick="this.parentElement.parentElement.remove()"><i class="fa-solid fa-xmark"></i></div></div>`;
        
        noti.addEventListener('click', function(e) {
            if(!e.target.closest('.notif-close-btn')) {
                noti.classList.add('hide-anim');
                setTimeout(() => noti.remove(), 400);
            }
        });

        container.appendChild(noti); 
        window.currentNotificationTimeout = setTimeout(() => { if(noti.parentElement) { noti.classList.add('hide-anim'); setTimeout(() => { if(noti.parentElement) noti.remove(); }, 400); } }, 3000); 
    }

    window.backupAllData = function() {
        const backupData = {}; let count = 0;
        for (let i = 0; i < localStorage.length; i++) { 
            const key = localStorage.key(i); if (key.startsWith("offsetPro_")) { backupData[key] = localStorage.getItem(key); count++; } 
        }
        if (count === 0) return window.showNotify("Không có dữ liệu dự án để backup!", "error");
        
        const blob = new Blob([JSON.stringify(backupData, null, 2)], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url;
        
        const now = new Date();
        const d = String(now.getDate()).padStart(2, '0');
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const y = now.getFullYear();
        let h = now.getHours();
        const min = String(now.getMinutes()).padStart(2, '0');
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12; h = h ? h : 12;
        const fileName = `DevLong Sao Lưu Offset ${d}-${m}-${y} ${h}h ${min} ${ampm}.json`;
        
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url); window.showNotify(`Đã backup ${count} dự án thành công!`, "success"); window.playSound('success');
    }

    window.restoreAllData = function(input) {
        const file = input.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result); let count = 0;
                for (const key in data) { 
                    if (key.startsWith("offsetPro_")) { localStorage.setItem(key, data[key]); count++; } 
                }
                refreshProjectList(); 
                if (window.selectedProjectName) {
                    const checkKey = "offsetPro_" + window.selectedProjectName;
                    if (localStorage.getItem(checkKey)) {
                        loadProject(); 
                        window.showNotify(`Đã nạp lại version mới của: ${window.selectedProjectName}`, "success");
                    } else {
                        document.getElementById('input-1').value = "";
                        document.querySelector('#resultTable tbody').innerHTML = "";
                        window.selectedProjectName = "";
                        document.getElementById("customSelectTrigger").textContent = "-- Chọn Dự Án --";
                        window.showNotify(`Đã Restore ${count} dự án!`, "success");
                    }
                } else {
                    window.showNotify(`Đã khôi phục ${count} dự án thành công!`, "success");
                }
                window.playSound('success');
            } catch (err) { window.showNotify("File backup bị lỗi hoặc không hợp lệ!", "error"); window.playSound('error'); }
            input.value = '';
        };
        reader.readAsText(file);
    }

    // =================================================================
    // 2. LOGIC NỘI BỘ (KHÔNG CẦN EXPORT) & HELPER
    // =================================================================

    function createBlossoms() {
        const container = document.getElementById('falling-container');
        if(!container) return;
        const symbols = [ { char: '✽', color: '#ffd700' }, { char: '🌸', color: '#ffb7c5' }, { char: '💵', color: '#85bb65' }, { char: '🧧', color: '#ff2400' } ];
        for (let i = 0; i < 30; i++) {
            const b = document.createElement('div'); b.classList.add('falling-item');
            const item = symbols[Math.floor(Math.random() * symbols.length)];
            b.innerText = item.char; b.style.color = item.color;
            b.style.left = Math.random() * 100 + 'vw';
            b.style.animationDuration = (Math.random() * 5 + 5) + 's'; 
            b.style.animationDelay = (Math.random() * 5) + 's';
            b.style.opacity = Math.random() * 0.5 + 0.5;
            b.style.fontSize = (Math.random() * 15 + 15) + 'px';
            container.appendChild(b);
        }
    }

    function refreshProjectList() {
        const items = document.getElementById("customSelectItems"); if(!items) return;
        items.innerHTML = "";
        const projects = [];
        for (let i = 0; i < localStorage.length; i++) { 
            const key = localStorage.key(i); 
            if (key.startsWith("offsetPro_")) { 
                let timestamp = 0; let offsetCount = 0;
                try { const val = JSON.parse(localStorage.getItem(key)); if(val.createdAt) timestamp = val.createdAt; if(val.results) offsetCount = val.results.length; } catch(e) {}
                projects.push({ key: key, time: timestamp, count: offsetCount });
            } 
        }
        projects.sort((a, b) => b.time - a.time); 
        const count = projects.length;
        const label = document.querySelector('.label-save');
        if(label) label.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> 2. Dự Án (Đã Lưu) <span style="background:rgba(255,255,255,0.1); padding:2px 6px; border-radius:4px; font-size:0.7em; color:var(--accent); margin-left: 5px;">[ ${count} ]</span>`;

        const searchContainer = document.createElement("div"); searchContainer.className = "select-search-box";
        searchContainer.innerHTML = `<div class="search-wrapper-pro"><i class="fa-solid fa-magnifying-glass search-icon-left"></i><input type="text" id="projectSearchInput" placeholder="Tìm Kiếm" autocomplete="off"><i class="fa-solid fa-xmark search-clear-btn"></i></div>`;
        items.appendChild(searchContainer);

        const scrollContainer = document.createElement("div"); scrollContainer.className = "select-scroll-content";
        items.appendChild(scrollContainer);

        const searchInput = searchContainer.querySelector('input');
        const clearBtn = searchContainer.querySelector('.search-clear-btn');
        
        searchInput.addEventListener("click", function(e) { e.stopPropagation(); });
        searchInput.addEventListener("input", function() {
            const filterRaw = this.value; const filterNormalized = removeVietnameseTones(filterRaw).toLowerCase();
            clearBtn.style.display = filterRaw ? "flex" : "none"; 
            const headers = scrollContainer.getElementsByClassName("group-header");
            const rows = scrollContainer.getElementsByClassName("item-row");
            for (let i = 0; i < rows.length; i++) {
                const txtName = rows[i].getAttribute("data-search-name") || "";
                if (!filterRaw || removeVietnameseTones(txtName).toLowerCase().startsWith(filterNormalized)) rows[i].style.display = ""; else rows[i].style.display = "none";
            }
            for(let h of headers) h.style.display = filterRaw ? "none" : "";
        });
        clearBtn.addEventListener("click", function(e) { e.stopPropagation(); searchInput.value = ""; clearBtn.style.display = "none"; searchInput.focus(); 
            const rows = scrollContainer.getElementsByClassName("item-row"); for (let i = 0; i < rows.length; i++) rows[i].style.display = "";
            const headers = scrollContainer.getElementsByClassName("group-header"); for(let h of headers) h.style.display = "";
        });

        if (count > 0) {
            const today = new Date().setHours(0,0,0,0); const yesterday = new Date(today - 86400000).setHours(0,0,0,0); let currentGroup = "";
            projects.forEach((proj) => {
                const key = proj.key; const projectName = key.replace("offsetPro_", ""); let dateStr = ""; let groupLabel = "Cũ Hơn";
                if(proj.time) {
                    const date = new Date(proj.time); const checkDate = new Date(proj.time).setHours(0,0,0,0);
                    if(checkDate === today) groupLabel = "Hôm Nay"; else if(checkDate === yesterday) groupLabel = "Hôm Qua";
                    let hours = date.getHours(); const ampm = hours >= 12 ? 'PM' : 'AM'; hours = hours % 12; hours = hours ? hours : 12; 
                    const minutes = String(date.getMinutes()).padStart(2, '0'); dateStr = `${hours}:${minutes} ${ampm} - ${date.getDate()}/${date.getMonth()+1}`;
                }
                if(groupLabel !== currentGroup) {
                    currentGroup = groupLabel; const header = document.createElement("div"); header.className = "group-header";
                    let icon = "fa-clock-rotate-left"; if(groupLabel === "Hôm Nay") icon = "fa-calendar-day"; if(groupLabel === "Hôm Qua") icon = "fa-calendar-check";
                    header.innerHTML = `<i class="fa-solid ${icon}"></i> ${groupLabel}`; scrollContainer.appendChild(header);
                }
                let nameDisplay = projectName; let versionDisplay = ""; const verMatch = projectName.match(/[-_]?v?(\d+(\.\d+)+.*)$/i);
                if(verMatch) { versionDisplay = "v" + verMatch[1]; nameDisplay = projectName.replace(verMatch[0], "").trim(); if(nameDisplay.endsWith('-') || nameDisplay.endsWith('_')) nameDisplay = nameDisplay.slice(0, -1); }
                
                const div = document.createElement("div"); div.className = "item-row"; div.setAttribute("data-search-name", nameDisplay);
                div.innerHTML = `<div class="project-info-group"><div class="project-name-styled"><i class="fa-solid fa-gamepad"></i> ${nameDisplay}${versionDisplay ? `<span class="version-badge">${versionDisplay}</span>` : ''}</div><div class="project-meta-row"><span>${dateStr}</span><span style="color:rgba(255,255,255,0.2)">|</span><div class="meta-stat" style="color:var(--secondary)"><i class="fa-solid fa-crosshairs"></i> ${proj.count} Offset</div></div></div><div class="item-actions"><div class="mini-action-btn mini-btn-edit" title="Đổi tên" onclick="window.quickRename(event, '${projectName}')"><i class="fa-solid fa-pen"></i></div><div class="mini-action-btn mini-btn-del" title="Xoá" onclick="window.quickDelete(event, '${projectName}')"><i class="fa-solid fa-trash"></i></div></div>`;
                div.addEventListener("click", function() { window.playSound('click'); window.selectedProjectName = projectName; document.getElementById("customSelectTrigger").textContent = projectName; items.classList.add("select-hide"); document.getElementById("customSelectTrigger").classList.remove("select-arrow-active"); loadProject(); });
                scrollContainer.appendChild(div);
            });
        } else {
            const div = document.createElement("div"); div.textContent = "(Chưa có dự án)"; div.className = "item-row"; div.style.fontStyle = "italic"; div.style.opacity = "0.5"; scrollContainer.appendChild(div); 
        }
    }

    function removeVietnameseTones(str) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); str = str.replace(/đ/g,"d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A"); str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E"); str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I"); str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O"); str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U"); str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y"); str = str.replace(/Đ/g, "D");
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); str = str.replace(/\u02C6|\u0306|\u031B/g, ""); return str;
    }

    function updateActiveProjectTitle(name) {
        const titleDiv = document.getElementById('activeProjectTitle');
        if (name) { 
            let nameDisplay = name; let versionDisplay = ""; const verMatch = name.match(/[-_]?v?(\d+(\.\d+)+.*)$/i);
            if(verMatch) { versionDisplay = "v" + verMatch[1]; nameDisplay = name.replace(verMatch[0], "").trim(); if(nameDisplay.endsWith('-') || nameDisplay.endsWith('_')) nameDisplay = nameDisplay.slice(0, -1); }
            titleDiv.innerHTML = `<span class="active-title-text">${nameDisplay}</span> ${versionDisplay ? `<span class="active-version-badge">${versionDisplay}</span>` : ''}`; titleDiv.style.display = 'block'; 
        } else { titleDiv.style.display = 'none'; }
    }

    function setStatus(msg, type) { const box = document.getElementById('statusBox'); let icon = ''; if (type === 'loading') icon = '<i class="fa-solid fa-spinner fa-spin" style="color:var(--accent)"></i> '; else if (type === 'ready') icon = '<i class="fa-solid fa-circle-check" style="color:var(--secondary)"></i> '; else if (type === 'waiting') icon = '<i class="fa-solid fa-circle-info" style="color:var(--warning)"></i> '; box.innerHTML = icon + msg; }
    function showLoading(show) { document.getElementById('loadingOverlay').style.display = show ? 'flex' : 'none'; }

    // Worker code
    const workerCode = `
        self.onmessage = async function(e) {
            const file = e.data; const chunkSize = 10 * 1024 * 1024; let offset = 0; let currentClass = ""; let currentClassFullSig = ""; let pendingMetadata = null; let leftover = ""; const decoder = new TextDecoder();
            const classRegex = /\\s(class|struct)\\s+([a-zA-Z0-9_<>@\\u00A0-\\uFFFF]+)/; const rvaRegex = /\\/\\/ RVA: 0x([0-9A-Fa-f]+)\\s+Offset: 0x([0-9A-Fa-f]+)/; const methodRegex = /([a-zA-Z0-9_.<>@\\u00A0-\\uFFFF]+)\\s*\\(/; const fieldOffsetRegex = /;\\s*\\/\\/\\s*0x([0-9A-Fa-f]+)/; const fieldNameRegex = /([a-zA-Z0-9_]+)\\s*;/;
            const results = []; const fileSize = file.size;
            while (offset < fileSize) {
                const slice = file.slice(offset, offset + chunkSize); const buffer = await slice.arrayBuffer(); let text = decoder.decode(buffer, {stream: true});
                text = leftover + text; const lastNewline = text.lastIndexOf('\\n'); if (lastNewline !== -1 && offset + chunkSize < fileSize) { leftover = text.substring(lastNewline + 1); text = text.substring(0, lastNewline); } else { leftover = ""; }
                const lines = text.split('\\n');
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim(); if (!line) continue;
                    if (!line.startsWith('//') && (line.includes('class ') || line.includes('struct '))) { const clsMatch = line.match(classRegex); if (clsMatch) { currentClass = clsMatch[2]; currentClassFullSig = line.split('//')[0].trim(); } }
                    if (line.startsWith('// RVA:')) { const match = line.match(rvaRegex); if (match) pendingMetadata = { offset: match[2] }; } else if (pendingMetadata && !line.startsWith('//')) { const nameMatch = line.match(methodRegex); if (nameMatch) { results.push({ cls: currentClass, classSig: currentClassFullSig, method: nameMatch[1], type: 'method', offset: pendingMetadata.offset, sig: line }); } pendingMetadata = null; }
                    if (currentClass && !line.startsWith('// RVA:')) { const fieldMatch = line.match(fieldOffsetRegex); if (fieldMatch) { const codePart = line.split('//')[0].trim(); const nameMatch = codePart.match(fieldNameRegex); if (nameMatch) { results.push({ cls: currentClass, classSig: currentClassFullSig, method: nameMatch[1], type: 'field', offset: fieldMatch[1], sig: line }); } } }
                }
                offset += chunkSize; const percent = Math.min(100, Math.floor((offset / fileSize) * 100)); self.postMessage({ type: 'progress', percent: percent });
            }
            self.postMessage({ type: 'done', data: results });
        };
    `;
    let workerBlob = new Blob([workerCode], {type: "application/javascript"});
    let workerUrl = URL.createObjectURL(workerBlob);

    // --- 5. LOGIC KHỞI CHẠY (INITIALIZATION) ---
    
    function initLogin() {
        const isLoggedIn = localStorage.getItem("devlong_isLoggedIn") === "true";
        const overlay = document.getElementById("loginOverlay");
        const container = document.getElementById("appContainer");

        if (isLoggedIn) {
            // Đã đăng nhập: Chỉ cần hiện App Container
            if(container) container.classList.add("logged-in");
        } else {
            // Chưa đăng nhập: Phải hiện Overlay lên (vì CSS mặc định là none)
            if (overlay) {
                overlay.style.display = "flex"; 
                overlay.classList.remove("hidden");
            }
            // Check ghi nhớ tài khoản
            const savedUser = localStorage.getItem("devlong_savedUser");
            const savedPass = localStorage.getItem("devlong_savedPass");
            if (savedUser) {
                const userInp = document.getElementById("loginUser");
                const remCheck = document.getElementById("rememberMe");
                if(userInp) userInp.value = savedUser;
                if(remCheck) remCheck.checked = true;
            }
            if (savedPass) {
                const passInp = document.getElementById("loginPass");
                if(passInp) passInp.value = savedPass;
            }
        }
        
        const passInput = document.getElementById("loginPass");
        if(passInput) {
            passInput.addEventListener("keypress", function(e) { if (e.key === "Enter") window.handleLogin(); });
        }
    }

    function initApp() { 
        initLogin(); // Xử lý đăng nhập (Hiện/Ẩn Overlay)
        refreshProjectList(); 
        setupDragDrop();      
        setupEditors();       
        setupCustomDropdown(); 
        createBlossoms();     
        setupClearButtons();  
        
        document.body.addEventListener('click', (e) => { initAudio(); });
        
        const np = document.getElementById('newProjectName'); if(np) np.addEventListener('keypress', (e) => { if (e.key === 'Enter') window.saveNewProject(); });
        const rp = document.getElementById('renameProjectInput'); if(rp) rp.addEventListener('keypress', (e) => { if (e.key === 'Enter') window.confirmRename(); });

        document.addEventListener('keydown', function(e) {
            const cmdKey = (navigator.platform.toUpperCase().indexOf('MAC') >= 0) ? e.metaKey : e.ctrlKey; 
            if (cmdKey && e.key === 'Enter') { e.preventDefault(); window.runPrecisionScanner(); } 
            if (cmdKey && e.key === 's') { e.preventDefault(); window.saveProject(); } 
            if (cmdKey && (e.key === 'c' || e.key === 'C')) {
                if (window.getSelection().toString() === "") { e.preventDefault(); window.copyQuickList(); }
            }
            if (e.key === 'Escape') { e.preventDefault(); window.clearWorkspace(); } 
        });

        const input1 = document.getElementById('input-1');
        if(input1) {
            input1.addEventListener('input', function() {
                if (window.scanDebounceTimer) clearTimeout(window.scanDebounceTimer);
                window.scanDebounceTimer = setTimeout(() => {
                    if(window.dumpData.length > 0 && this.value.trim() !== "") { window.runPrecisionScanner(false); }
                }, 1000); 
            });
        }
        
        if (window.innerWidth <= 900) window.switchMobileTab('tools'); 
    }

    // --- CÁC HÀM HELPER KHÁC (SETUP) ---
    function setupClearButtons() {
        const newInput = document.getElementById('newProjectName'); const clearBtn = document.getElementById('clearNewProjectBtn'); if(!newInput || !clearBtn) return;
        newInput.addEventListener('input', function() { clearBtn.style.display = this.value ? 'block' : 'none'; });
        clearBtn.addEventListener('click', function(e) { e.stopPropagation(); newInput.value = ''; clearBtn.style.display = 'none'; newInput.focus(); });
    }
    function setupCustomDropdown() {
        const selected = document.getElementById("customSelectTrigger"); const items = document.getElementById("customSelectItems"); if(!selected || !items) return;
        selected.addEventListener("click", function(e) { e.stopPropagation(); window.playSound('click'); items.classList.toggle("select-hide"); selected.classList.toggle("select-arrow-active"); if(!items.classList.contains("select-hide")) setTimeout(() => { const searchInp = document.getElementById('projectSearchInput'); if(searchInp) searchInp.focus(); }, 100); });
        document.addEventListener("click", function(e) { if (!selected.contains(e.target) && !items.contains(e.target)) { items.classList.add("select-hide"); selected.classList.remove("select-arrow-active"); } });
    }
    function setupEditors() {
        const textarea = document.getElementById('input-1'); const highlight = document.getElementById('highlight-1'); if(!textarea || !highlight) return;
        const update = () => { let text = textarea.value; if(text[text.length-1] == "\n") text += " "; highlight.innerHTML = applySyntaxHighlighting(text); syncScroll(textarea, highlight); };
        textarea.addEventListener('input', update); textarea.addEventListener('scroll', () => syncScroll(textarea, highlight)); update(); 
    }
    function syncScroll(element, target) { target.scrollTop = element.scrollTop; target.scrollLeft = element.scrollLeft; }
    function applySyntaxHighlighting(text) {
        if (!text) return "";
        text = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        text = text.replace(/(".*?")/g, '<span class="s">$1</span>'); text = text.replace(/(\/\/.*)/g, '<span class="co">$1</span>'); text = text.replace(/\b(0x[0-9A-Fa-f]+|[0-9]+)\b/g, '<span class="n">$1</span>');
        const keywords = /\b(public|private|protected|static|void|bool|int|float|string|class|struct|namespace|using|import|include|return|const|new|this)\b/g; text = text.replace(keywords, '<span class="k">$1</span>'); 
        const controls = /\b(if|else|for|while|switch|case|break|continue)\b/g; text = text.replace(controls, '<span class="c">$1</span>'); 
        text = text.replace(/\b([A-Z][a-zA-Z0-9_]*)\b(?![^<]*>)/g, '<span class="t">$1</span>'); text = text.replace(/\b([a-zA-Z0-9_]+)(?=\()/g, '<span class="f">$1</span>'); return text;
    }

    window.runPrecisionScanner = function(playAudio = true) {
        if (window.dumpData.length === 0) { if(playAudio) { window.showNotify("Vui lòng chọn File Dump trước!", "error"); window.playSound('error'); } return; }
        const rawInput = document.getElementById('input-1').value; if (!rawInput.trim()) { if(playAudio) { window.showNotify("Vui lòng nhập Code để tìm!", "error"); window.playSound('error'); } return; }
        const firstLine = rawInput.split('\n')[0].trim(); const inputLines = rawInput.split('\n'); 
        window.foundOffsets = []; const uniqueOffsets = new Set(); document.querySelector('#resultTable tbody').innerHTML = ''; let contextClass = null; 
        inputLines.forEach(line => {
            if (line.trim().startsWith("// NAME:")) return; 
            const isLineCode = /^(public|private|protected|class|struct|void|bool|int|float|string|namespace|using|\/\/)/i.test(line.trim());
            if (!isLineCode && (line.trim() === window.selectedProjectName || line.trim() === firstLine)) return; 
            let customComment = ""; if (line.includes("//")) { const parts = line.split("//"); line = parts[0]; customComment = parts.slice(1).join("//").trim(); }
            line = line.trim(); if(!line) return;
            const clsMatch = line.match(/\s(class|struct)\s+([a-zA-Z0-9_<>@\u00A0-\uFFFF]+)/) || line.match(/^public\s+class\s+([a-zA-Z0-9_<>@\u00A0-\uFFFF]+)/);
            if (clsMatch) { contextClass = clsMatch.pop(); return; }
            let targetMethod = null; let targetArgs = null; let targetClass = contextClass;
            const openParen = line.indexOf('('); const closeParen = line.lastIndexOf(')');
            if (openParen !== -1 && closeParen !== -1 && closeParen > openParen) {
                const beforeParen = line.substring(0, openParen).trim(); const tokens = beforeParen.split(/[\s\t]+/); 
                if(tokens.length > 0) { targetMethod = tokens[tokens.length - 1]; if (['if', 'for', 'while', 'switch', 'catch'].includes(targetMethod)) { targetMethod = null; } }
                targetArgs = line.substring(openParen + 1, closeParen);
            } else {
                 const parts = line.split(/\s+/); if (parts.length >= 2) { let lastPart = parts[parts.length - 1]; if(lastPart.endsWith(';')) lastPart = lastPart.slice(0, -1); targetMethod = lastPart; } else if (parts.length === 1) { targetMethod = parts[0]; if(targetMethod.endsWith(';')) targetMethod = targetMethod.slice(0, -1); }
            }
            if (targetMethod) {
                let candidates = window.dumpData.filter(d => { const matchClass = targetClass ? (d.cls === targetClass) : true; return matchClass && d.method === targetMethod; });
                let finalResults = candidates; 
                if (candidates.length > 0 && targetArgs !== null) {
                    const normalize = (str) => { return str.replace(/\s+/g, '').replace(/=[^,)]+/g, '').toLowerCase(); }; const cleanInput = normalize(targetArgs);
                    const exactMatches = candidates.filter(c => { if (c.type !== 'method') return false; const dOpen = c.sig.indexOf('('); const dClose = c.sig.lastIndexOf(')'); if (dOpen !== -1 && dClose !== -1) { const dArgs = c.sig.substring(dOpen + 1, dClose); return normalize(dArgs) === cleanInput; } return false; });
                    if (exactMatches.length > 0) { finalResults = exactMatches; }
                }
                if (finalResults.length > 0) { finalResults.forEach(res => { if (!uniqueOffsets.has(res.offset)) { uniqueOffsets.add(res.offset); res.customComment = customComment; window.foundOffsets.push(res); renderRow(res); } }); } else { renderNotFound(targetClass || "???", targetMethod + (targetArgs ? `(...)` : "")); }
            }
        });
        document.getElementById('resultCount').innerText = `${window.foundOffsets.length} Tìm thấy`;
        generateQuickListText(); 
        if (window.selectedProjectName && window.foundOffsets.length > 0) window.saveProject(true); 
        if(window.foundOffsets.length > 0) { if(playAudio) { window.showNotify(`Tìm thấy ${window.foundOffsets.length} offset!`, "success"); window.playSound('success'); if(window.innerWidth <= 900) { setTimeout(() => window.switchMobileTab('results'), 500); } } } 
        else { if(playAudio) { window.showNotify("Không tìm thấy Offset nào!", "error"); window.playSound('error'); } }
    }

    function generateQuickListText() {
        if(window.foundOffsets.length === 0) { window.rawQuickListText = ""; return; }
        let quickListRaw = ""; let lastClass = ""; 
        window.foundOffsets.forEach((f, index) => { 
            const comment = f.customComment ? f.customComment : "(Không Ghi Chú)"; const fullClass = f.classSig ? f.classSig.split('//')[0].trim() : f.cls; 
            let cleanCode = f.sig.trim(); if (cleanCode.includes("//")) { cleanCode = cleanCode.split("//")[0].trim(); } const fullMethod = cleanCode; 
            if (fullClass !== lastClass) { if (lastClass !== "") { quickListRaw += "\n"; } quickListRaw += `${fullClass}\n\n`; lastClass = fullClass; } 
            quickListRaw += `${comment}\n`; quickListRaw += `//Offset : 0x${f.offset}\n`; quickListRaw += `${fullMethod}\n`; 
            if(index < window.foundOffsets.length - 1) { const nextItem = window.foundOffsets[index+1]; const nextClass = nextItem.classSig ? nextItem.classSig.split('//')[0].trim() : nextItem.cls; if(nextClass === fullClass) { quickListRaw += "\n"; } }
        });
        window.rawQuickListText = quickListRaw.trim(); 
    }

    function renderRow(item) { 
        const tbody = document.querySelector('#resultTable tbody'); 
        let commentHtml = ""; if (item.customComment) { commentHtml = `<span class="comment-badge"><i class="fa-solid fa-tag"></i> ${item.customComment}</span>`; }
        const sigHtml = applySyntaxHighlighting(item.sig); 
        let typeBadge = ''; if (item.type === 'field') { typeBadge = `<span class="type-badge variable"><i class="fa-solid fa-box-open"></i> FIELD</span>`; } else { typeBadge = `<span class="type-badge method"><i class="fa-solid fa-code"></i> METHOD</span>`; }
        const row = `<tr><td><div class="info-cell"><div class="class-badge"><i class="fa-solid fa-cube"></i> ${item.cls}</div><div class="method-name-highlight">${typeBadge} ${item.method} ${commentHtml}</div><div class="sig-txt">${sigHtml}</div></div></td><td style="vertical-align: middle;"><div class="offset-cell-wrapper"><div class="copy-tag" onclick="window.copyText(this, '0x${item.offset}')"><i class="fa-regular fa-copy"></i> <span style="font-family:'JetBrains Mono'; margin-left:5px;">0x${item.offset}</span></div></div></td></tr>`; 
        tbody.insertAdjacentHTML('beforeend', row); 
    }
    
    function renderNotFound(cls, method) { document.querySelector('#resultTable tbody').insertAdjacentHTML('beforeend', `<tr><td><div class="info-cell"><div class="class-badge" style="color:#ef4444; border-color:#ef4444; background:rgba(239, 68, 68, 0.1);">${cls}</div><div class="method-name-highlight" style="color:#ef4444; text-decoration: line-through;">${method}</div></div></td><td style="text-align: right; vertical-align: middle;"><span style="color:#ef4444; font-weight:bold; font-size:0.8rem; font-style:italic; display:inline-flex; align-items:center; gap:5px;"><i class="fa-solid fa-triangle-exclamation"></i> KHÔNG TÌM THẤY</span></td></tr>`); }

    // --- 6. CHECK CONFIG TỪ XA (CHẠY CUỐI CÙNG ĐỂ KHÔNG CHẶN UI) ---
    async function runCheckAndStart() {
        // --- 1. Load các hàm UI trước để tránh lỗi ---
        
        // --- 2. Check Config ---
        try {
            const response = await fetch(CONFIG_URL + '?t=' + new Date().getTime());
            if (response.ok) {
                const config = await response.json();
                if (config.status !== 'ACTION') {
                    // Nếu OFF -> Hiện màn hình bảo trì (Ghi đè body)
                    document.body.innerHTML = `
                        <style>
                            @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700&display=swap');
                            body { margin: 0; padding: 0; background-color: #0f172a; background-image: radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(168, 85, 247, 0.15) 0px, transparent 50%); font-family: 'Be Vietnam Pro', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; overflow: hidden; color: #fff; }
                            .maint-card { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 30px; padding: 50px 30px; text-align: center; max-width: 90%; width: 420px; box-shadow: 0 25px 50px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05); animation: float 6s ease-in-out infinite; display: flex; flex-direction: column; align-items: center; }
                            .icon-box { font-size: 4rem; color: #38bdf8; margin-bottom: 25px; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; background: rgba(56, 189, 248, 0.1); border-radius: 50%; box-shadow: 0 0 30px rgba(56, 189, 248, 0.2); border: 1px solid rgba(56, 189, 248, 0.3); }
                            .icon-box i { animation: spin 10s linear infinite; }
                            h1 { font-size: 1.6rem; font-weight: 800; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px; background: linear-gradient(135deg, #fff, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 0 30px rgba(56, 189, 248, 0.3); }
                            p { color: #94a3b8; font-size: 0.95rem; line-height: 1.6; margin-bottom: 35px; padding: 0 10px; }
                            .btn-retry { background: linear-gradient(90deg, #3b82f6, #38bdf8); border: none; padding: 14px 40px; color: white; border-radius: 16px; font-weight: 700; cursor: pointer; transition: all 0.3s; box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3); text-decoration: none; display: inline-flex; align-items: center; gap: 8px; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.5px; }
                            .btn-retry:hover { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(59, 130, 246, 0.5); }
                            .link-home { margin-top: 20px; color: #64748b; font-size: 0.85rem; text-decoration: none; transition: 0.3s; } .link-home:hover { color: #38bdf8; }
                            @keyframes spin { 100% { transform: rotate(360deg); } } @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                        </style>
                        <div class="maint-card"><div class="icon-box"><i class="fa-solid fa-gears"></i></div><h1>Bảo Trì Hệ Thống</h1><p>${config.message || "Chúng tôi đang nâng cấp hệ thống..."}</p><button class="btn-retry" onclick="location.reload()"><i class="fa-solid fa-rotate-right"></i> Thử Lại</button>${config.updateLink ? `<a href="${config.updateLink}" class="link-home" target="_blank">Trang Chủ / Hỗ Trợ</a>` : ''}</div>`;
                    return; // Dừng app
                }
            }
        } catch (e) {
            console.warn("Không tải được config, chạy mode offline:", e);
        }

        // --- 3. Nếu OK -> Khởi tạo App ---
        initApp();
    }

    // Chạy quy trình
    runCheckAndStart();

})();
