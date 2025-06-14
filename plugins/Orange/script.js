//文字変わらん＋はみ出す＋

document.addEventListener('DOMContentLoaded', function() {
    const editor = document.getElementById('text-editor');
    const reflectButton = document.getElementById('reflect-button');
    const fontSelect = document.getElementById('font-select');
    const fontSizeSelect = document.getElementById('font-size-select');

    reflectButton.addEventListener('click', function() {
        const content = editor.innerHTML;
        const updatedContent = transformContent(content);

        if (content !== updatedContent) {
            editor.innerHTML = updatedContent;
            placeCaretAtEnd(editor);
        }
    });

    fontSelect.addEventListener('change', function() {
        editor.style.fontFamily = fontSelect.value;
    });

    fontSizeSelect.addEventListener('change', function() {
        editor.style.fontSize = fontSizeSelect.value;
    });

    function transformContent(content) {
        return content.replace(/【(.*?)】/g, '【<span class="orange">$1</span>】');
    }

    function placeCaretAtEnd(el) {
        el.focus();
        if (typeof window.getSelection !== "undefined" && typeof document.createRange !== "undefined") {
            const range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
});
