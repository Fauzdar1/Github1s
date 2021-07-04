// Extension event listeners are a little different from the patterns you may have seen in DOM or
// Node.js APIs. The below event listener registration can be broken in to 4 distinct parts:
//
// * chrome      - the global namespace for Chrome's extension APIs
// * runtime     – the namespace of the specific API we want to use
// * onInstalled - the event we want to subscribe to
// * addListener - what we want to do with this event
//
// See https://developer.chrome.com/docs/extensions/reference/events/ for additional details.

/**
 * This finds the current tab's URL and return it.
 * @param callback - Callback returns the URL as a String.
 */
async function getCurrentTabURl(callback) {
    let queryOptions = {active: true, currentWindow: true};
    let [tab] = await chrome.tabs.query(queryOptions);
    callback(tab.url);
}

/**
 * This performs the whole process of Finding the URL,
 * Checking it's validity as a Github URL and opens a new tab.
 * Also, it returns the result as 'success' or 'failure' to fire
 * some UI events in the popup.js.
 * @param callback - Returns the result as a String.
 */
function performTabOpeningTask(callback) {
    getCurrentTabURl((url) => {
        console.log(`Current Url: ${url}`);
        if (url && url.includes('github.com') && !url.includes('github.com/search')) {
            console.log('Opening tab');
            let newUrl = url.replace('github.com', 'github1s.com');
            let tab = chrome.tabs.create({url: newUrl, active: true});
            console.log(`Created tab ${tab.id}`);
            callback('success');
        } else {
            console.log('Not Github or Invalid URL');
            callback('failure');
        }
    });
}

/**
 * This is a system event fired on successful installation of the Extension.
 */
chrome.runtime.onInstalled.addListener(async () => {
    console.log('Github1s Successfully Installed');
});

/**
 * This is a system event fired on Keypress by the user.
 * The key shortcuts are placed in manifest.json.
 * It initiates the process of Opening Github1s by calling the
 * function performTabOpeningTask.
 * Also, it tries to display a notification in case of invalid URL
 * or not github but it doesn't work for now.
 */
chrome.commands.onCommand.addListener(function (command) {
    performTabOpeningTask((result) => {
        if (result === 'failure') {
            console.log('Displaying Notification');

            chrome.notifications.create(`my-notification-${Date.now()}`, {
                type: 'basic',
                iconUrl: "/icon128.png",
                title: 'Not Github',
                message: 'Hi, This page is not github.',
                priority: 2
            });
        }
    });
});

/**
 * This is a system event fired when a message has been passed to this
 * background.js from the frontend popup.js.
 * This is to call the Tab opening task when the user presses the
 * Open github button on the popup.
 * The directive here is to distinguish the working based on the
 * its value passed.
 * Also, it returns the result to the frontend as response object.
 */
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.directive) {
            case "popup-click":
                performTabOpeningTask((result) => {
                    sendResponse({response: result});
                });
                break;
            default:
                console.log("Unmatched request of '" + request + "' from script to background.js from " + sender);
        }
        // sendResponse({response: 'failure'});
        return true;
    }
);


