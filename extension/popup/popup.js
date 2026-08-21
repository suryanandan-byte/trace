import { sendBrowserData } from "../api/backend.js";
let currentTab = null;

// ------------------------------------
// Get current active tab
// ------------------------------------

async function getCurrentTab() {

    const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    return tabs[0];
}


// ------------------------------------
// Get viewport information
// ------------------------------------

async function getViewport(tabId) {

    const results = await chrome.scripting.executeScript({
        target: {
            tabId: tabId
        },

        func: () => {

            return {
                width: window.innerWidth,
                height: window.innerHeight
            };

        }
    });

    return results[0].result;
}


// ------------------------------------
// Display page information
// ------------------------------------

async function loadPageInformation() {

    try {

        currentTab = await getCurrentTab();

        if (!currentTab) {

            setStatus("Unable to detect current tab");

            return;
        }


        // URL

        document.getElementById("page-url").textContent =
            currentTab.url || "Unavailable";


        // Title

        document.getElementById("page-title").textContent =
            currentTab.title || "Unavailable";


        // Tab ID

        document.getElementById("tab-id").textContent =
            currentTab.id;


        // Viewport

        try {

            const viewport = await getViewport(currentTab.id);

            document.getElementById("viewport").textContent =
                `${viewport.width} × ${viewport.height}`;

        } catch (error) {

            document.getElementById("viewport").textContent =
                "Unavailable";

            console.error("Viewport error:", error);
        }


        setStatus("Ready");

    } catch (error) {

        console.error(error);

        setStatus("Failed to detect page");

    }
}


// ------------------------------------
// Set status text
// ------------------------------------

function setStatus(message) {

    document.getElementById("status").textContent = message;
}


// ------------------------------------
// Analyze button
// ------------------------------------

document
    .getElementById("analyze-btn")
    .addEventListener("click", async () => {

        if (!currentTab) {

            setStatus("No page detected");

            return;
        }


        const button = document.getElementById("analyze-btn");

        button.disabled = true;

        setStatus("Sending data to backend...");


        try {

            const viewport = await getViewport(currentTab.id);


            const browserData = {

                url: currentTab.url,

                title: currentTab.title,

                tab_id: currentTab.id,

                viewport: {

                    width: viewport.width,

                    height: viewport.height

                }

            };


            console.log(
                "Sending browser data:",
                browserData
            );


            const response = await sendBrowserData(browserData);
            console.log(
                "Backend response:",
                response
            );


            setStatus(
                "✓ Successfully sent to backend"
            );


        } catch (error) {

            console.error(error);

            setStatus(
                "❌ Backend connection failed"
            );

        } finally {

            button.disabled = false;

        }

    });


// ------------------------------------
// Load information when popup opens
// ------------------------------------

loadPageInformation();