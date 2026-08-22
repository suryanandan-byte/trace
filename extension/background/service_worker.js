import * as cdp from './cdp.js';

console.log("Trace2Prompt background service worker started");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "START_TRACE") {
        cdp.attachDebugger(message.tabId).then((success) => {
            sendResponse({ success });
        });
        return true; // Keep message channel open for async response
    }
    
    if (message.type === "STOP_TRACE") {
        cdp.detachDebugger(message.tabId).then((success) => {
            sendResponse({ success });
        });
        return true;
    }
    
    if (message.type === "GET_TRACE_STATUS") {
        sendResponse({
            isAttached: cdp.getAttachedTabId() === message.tabId,
            requestCount: cdp.getRequestCount()
        });
    }
});