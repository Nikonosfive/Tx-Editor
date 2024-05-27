document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');
    const charCount = document.getElementById('char-count');
    const fontSelect = document.getElementById('font-select');
    const fontSizeInput = document.getElementById('font-size');
    const toggleDarkModeBtn = document.getElementById('toggle-dark-mode');
    const editorContainer = document.getElementById('editor-container');
    const titleInput = document.getElementById('title-input');
    const fileInput = document.getElementById('file-input');
    const saveButton = document.getElementById('save-button');
    let autoSaveTimeout;

    // リアルタイム文字数カウント
    editor.addEventListener('input', () => {
        charCount.textContent = `文字数: ${editor.value.length}`;
        resetAutoSaveTimer();
    });

    // フォント変更
    fontSelect.addEventListener('change', () => {
        editor.style.fontFamily = fontSelect.value;
    });

    // フォントサイズ変更
    fontSizeInput.addEventListener('input', () => {
        editor.style.fontSize = `${fontSizeInput.value}px`;
    });

    // ダークモード切替
    toggleDarkModeBtn.addEventListener('click', () => {
        editorContainer.classList.toggle('dark-mode');
    });

    // 自動保存機能
    function autoSave() {
        localStorage.setItem('editorContent', editor.value);
        localStorage.setItem('editorTitle', titleInput.value);
        console.log('内容が自動保存されました');
    }

    function resetAutoSaveTimer() {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(autoSave, 30000); // 30秒後に自動保存
    }

    // ページロード時に保存された内容をロード
    const savedContent = localStorage.getItem('editorContent');
    const savedTitle = localStorage.getItem('editorTitle');
    if (savedContent) {
        editor.value = savedContent;
        charCount.textContent = `文字数: ${savedContent.length}`;
    }
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
                editor.value = e.target.result;
                charCount.textContent = `文字数: ${editor.value.length}`;
            };
            reader.readAsText(file);
        }
    });

    // テキストファイルとして保存する機能
    saveButton.addEventListener('click', () => {
        const blob = new Blob([editor.value], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${titleInput.value || 'untitled'}.txt`;
        link.click();
    });
});
