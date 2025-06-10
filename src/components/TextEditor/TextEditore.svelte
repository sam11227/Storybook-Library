<script>
  import { onMount, afterUpdate } from "svelte";

  export let value = "";
  export let rows = "4";
  export let name = "";
  export let id = "";
  export let style = "";
  export let required = false;

  let editorContent = "";

  let isFocused = false;
  let hasContent = true;
  let editorElement;
  let showSettings = false;
  let showEmojiPicker = false;
  let copySuccess = false;

  $: {
    if (editorElement && value !== editorContent) {
      editorContent = value;
    }
  }

  function handleFocus() {
    isFocused = true;
  }

  function handleBlur() {
    isFocused = false;
  }

  function handleInput(event) {
    editorContent = event.target.innerHTML;
    value = editorContent;
    hasContent = editorContent.trim().length > 0;
  }

  function handleCopy() {
    if (editorElement) {
      const textToCopy = editorElement.innerText || editorElement.textContent;

      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          copySuccess = true;
          setTimeout(() => {
            copySuccess = false;
          }, 2000);
        })
        .catch((err) => {});
    }
  }

  function handleLocation() {}

  function handleMedia() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        insertTextAtCursor(`[Image: ${file.name}] `);
      }
    };
    input.click();
  }

  function handleCode() {}
  function handleEmoji() {}
  function handleList() {}

  function handleSettings() {}
  function handleCalendar() {
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    insertTextAtCursor(`[Date: ${dateStr}] `);
  }

  function handleDownload() {
    const blob = new Blob([editorElement.innerText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "editor-content.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function insertTextAtCursor(text) {
    if (!editorElement) return;

    editorElement.focus();

    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    const textNode = document.createTextNode(text);
    range.insertNode(textNode);

    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);

    handleInput({ target: editorElement });
  }

  onMount(() => {
    if (editorElement && value) {
      editorElement.innerHTML = value;
      editorContent = value;
    }
  });

  afterUpdate(() => {
    if (editorElement && value !== editorContent) {
      editorElement.innerHTML = value;
      editorContent = value;
    }
  });
</script>

<div class="text-editor-container" {style}>
  <div class="editor-wrapper" class:focused={isFocused} data-rows={rows}>
    <div class="toolbar">
      <button class="toolbar-button" on:click={handleCopy}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"
          ></path>
        </svg>
      </button>
      <button class="toolbar-button" on:click={handleLocation}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </button>
      <button class="toolbar-button" on:click={handleMedia}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      </button>
      <button class="toolbar-button" on:click={handleCode}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      </button>
      <button class="toolbar-button" on:click={handleEmoji} title="Add emoji">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
          <line x1="9" y1="9" x2="9.01" y2="9"></line>
          <line x1="15" y1="9" x2="15.01" y2="9"></line>
        </svg>
      </button>

      <span class="divider"></span>
      <button class="toolbar-button" on:click={handleList}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </button>
      <button class="toolbar-button" on:click={handleSettings}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
          ></path>
        </svg>
      </button>
      <button class="toolbar-button" on:click={handleCalendar}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </button>
      <button class="toolbar-button" on:click={handleDownload}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      </button>
    </div>
    <div
      class="editor-content"
      contenteditable="true"
      on:focus={handleFocus}
      on:blur={handleBlur}
      on:input={handleInput}
      bind:this={editorElement}
      {name}
      {id}
      role="textbox"
      aria-multiline="true"
      data-required={required}
    ></div>
  </div>
  <div class="input-badge">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="white"
      stroke="white"
      stroke-width="1.5"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
    </svg>
    <span>Input</span>
  </div>

  <textarea {name} {id} {required} bind:value style="display: none;"></textarea>
</div>

<style>
  .text-editor-container {
    position: relative;
    margin-bottom: 30px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  .editor-wrapper {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    overflow: hidden;
    background-color: #fff;
  }

  .editor-wrapper.focused {
    border-color: #a0aec0;
    box-shadow: 0 0 0 1px rgba(66, 153, 225, 0.5);
  }

  .toolbar {
    display: flex;
    padding: 8px;
    background-color: #f7fafc;
    border-bottom: 1px solid #e2e8f0;
  }

  .toolbar-button {
    background: none;
    border: none;
    border-radius: 4px;
    color: #4a5568;
    padding: 6px;
    margin-right: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .toolbar-button:hover {
    background-color: #edf2f7;
  }

  .divider {
    width: 1px;
    background-color: #e2e8f0;
    margin: 0 8px;
  }

  .editor-content {
    min-height: 150px;
    padding: 12px 16px;
    font-size: 16px;
    line-height: 1.5;
    color: #4a5568;
    outline: none;
  }
</style>
