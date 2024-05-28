document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');
    const charCount = document.getElementById('char-count');
    const byteCount = document.getElementById('byte-count');
    const fontSelect = document.getElementById('font-select');
    const fontSizeInput = document.getElementById('font-size');
    const toggleDarkModeBtn = document.getElementById('toggle-dark-mode');
    const editorContainer = document.getElementById('editor-container');
    const titleInput = document.getElementById('title-input');
    const fileInput = document.getElementById('file-input');
    const saveButton = document.getElementById('save-button');
    const encodingSelect = document.getElementById('encoding-select');
    const addStickyNoteButton = document.getElementById('add-sticky-note');
    let autoSaveTimeout;

    // リアルタイム文字数とバイト数カウント
    editor.addEventListener('input', () => {
        const text = editor.innerText;
        charCount.textContent = `文字数: ${text.length}`;
        byteCount.textContent = `バイト数: ${new Blob([text]).size}`;
        resetAutoSaveTimer();
    });

    // フォント変更
    fontSelect.addEventListener('change', () => {
        editor.style.fontFamily = fontSelect.value;
    });

    // フォントサイズ変更
    fontSizeInput.addEventListener('input', () => {
        const fontSize = `${fontSizeInput.value}px`;
        editor.style.fontSize = fontSize;
    });

    // ダークモード切替
    toggleDarkModeBtn.addEventListener('click', () => {
        editorContainer.classList.toggle('dark-mode');
    });

    // 自動保存機能
    function autoSave() {
        localStorage.setItem('editorContent', editor.innerHTML);
        localStorage.setItem('editorTitle', titleInput.value);
        console.log('内容が自動保存されました');
    }

    function resetAutoSaveTimer() {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(autoSave, 15000); // 15秒後に自動保存
    }

    // ページロード時に自動保存された内容を復元
    const savedContent = localStorage.getItem('editorContent');
    if (savedContent) {
        editor.innerHTML = savedContent;
        const text = editor.innerText;
        charCount.textContent = `文字数: ${text.length}`;
        byteCount.textContent = `バイト数: ${new Blob([text]).size}`;
    }

    const savedTitle = localStorage.getItem('editorTitle');
    if (savedTitle) {
        titleInput.value = savedTitle;
    }

    // 初期設定の適用
    editor.style.fontFamily = fontSelect.value;
    editor.style.fontSize = `${fontSizeInput.value}px`;

    resetAutoSaveTimer();

    // ファイル読み込み機能
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                editor.innerText = e.target.result;
                const text = editor.innerText;
                charCount.textContent = `文字数: ${text.length}`;
                byteCount.textContent = `バイト数: ${new Blob([text]).size}`;
            };
            reader.readAsText(file);
        }
    });

    // エンコーディングに基づいてテキストをエンコードする関数
    function encodeText(text, encoding) {
        switch (encoding) {
            case 'shift-jis':
                return Encoding.convert(text, 'SJIS');
            case 'jis':
                return Encoding.convert(text, 'ISO-2022-JP');
            case 'ascii':
                return Encoding.convert(text, 'ASCII');
            case 'euc':
                return Encoding.convert(text, 'EUCJP');
            case 'ebcdic':
                // EBCDIC conversion might not be supported by encoding.js
                // If it is supported by another library, integrate it accordingly.
                // Assuming Encoding.convert can handle it here for demonstration:
                return Encoding.convert(text, 'EBCDIC');
            case 'utf-8':
            default:
                return new TextEncoder().encode(text);
        }
    }

    // テキストファイルとして保存する機能
    saveButton.addEventListener('click', () => {
        const encoding = encodingSelect.value;
        const encodedText = encodeText(editor.innerText, encoding);
        const blob = new Blob([encodedText], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${titleInput.value || 'untitled'}.txt`;
        link.click();
    });

    // 付箋を追加する機能
    addStickyNoteButton.addEventListener('click', () => {
        const stickyNote = document.createElement('div');
        stickyNote.className = 'sticky-note';
        stickyNote.contentEditable = 'true';
        stickyNote.innerHTML = '<span class="delete-note">✖</span><div class="note-content" contenteditable="true">付箋内容</div>';
        
        const deleteButton = stickyNote.querySelector('.delete-note');
        deleteButton.addEventListener('click', () => {
            stickyNote.remove();
        });

        editor.appendChild(stickyNote);
        
        stickyNote.style.left = '50px';
        stickyNote.style.top = '50px';

        // 付箋のドラッグ機能を追加
        stickyNote.onmousedown = function(event) {
            dragStickyNote(stickyNote, event);
        };

        stickyNote.ondragstart = function() {
            return false;
        };
    });

    // 付箋のドラッグ機能
    function dragStickyNote(note, event) {
        let shiftX = event.clientX - note.getBoundingClientRect().left;
        let shiftY = event.clientY - note.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            note.style.left = pageX - shiftX + 'px';
            note.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        note.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            note.onmouseup = null;
        };
    }
});
