let requestCount = 0;
let attachedTabId = null;

export async function attachDebugger(tabId) {
    if (attachedTabId === tabId) return true;
    
    // Detach if already attached to another tab
    if (attachedTabId) {
        await detachDebugger(attachedTabId);
    }
    
    try {
        await chrome.debugger.attach({ tabId }, "1.3");
        attachedTabId = tabId;
        requestCount = 0; // reset count
        
        // Enable network domain
        await chrome.debugger.sendCommand({ tabId }, "Network.enable");
        
        console.log("Debugger attached to tab:", tabId);
        return true;
    } catch (err) {
        console.error("Failed to attach debugger:", err);
        return false;
    }
}

export async function detachDebugger(tabId) {
    if (attachedTabId !== tabId) return true;
    try {
        await chrome.debugger.detach({ tabId });
        attachedTabId = null;
        console.log("Debugger detached from tab:", tabId);
        return true;
    } catch (err) {
        console.error("Failed to detach:", err);
        return false;
    }
}

function onDebuggerEvent(source, method, params) {
    if (source.tabId !== attachedTabId) return;
    
    if (method === "Network.requestWillBeSent") {
        requestCount++;
        const requestInfo = {
            url: params.request.url,
            method: params.request.method,
            resourceType: params.type,
            requestId: params.requestId,
            timestamp: params.timestamp
        };
        console.log("Captured Request:", requestInfo);
        
        // Notify popup if it's open
        chrome.runtime.sendMessage({
            type: "NETWORK_REQUEST_COUNT",
            count: requestCount
        }).catch(() => {
            // Ignore error if popup is closed
        });
    }
}

// Add listener once when the module loads
chrome.debugger.onEvent.addListener(onDebuggerEvent);

export function getRequestCount() {
    return requestCount;
}

export function getAttachedTabId() {
    return attachedTabId;
}
