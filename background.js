browser.contextMenus.create({
    id: "save-and-name-tabs",
    title: "Save Tabs in Sequence",
    contexts: ["tab"],
});

/**
 * Listener that will fire the save function from the tab menu
 * @param {browser.contextMenu} info The context menu button that fired
 * @param {browser.tabs} tab Selected tab where menu was spawned
 */
browser.contextMenus.onClicked.addListener((info, tab) => {
    getSelectedTabs().then((tabs) => {
        tabs.forEach((tab) => {
            browser.tabs.captureTab(tab.id).then((mimeType) => {
                // Building the new filename string
                let dataType = mimeType.split(';')[0];
                let typeArray = dataType.split('/');
                let fileExtension = typeArray[typeArray.length -1];
                let oldName = (tab.title).split(' ')[0] + "." + fileExtension;

                // New filename
                let newName = `Window${tab.windowId}-savedTab${tab.id}.${fileExtension}`;

                // Debug string
                console.log(`Old (tabId ${tab.id}): ${oldName} -- New: ${newName}`);

                // Download the asset
                downloadFromUrl(tab.url, newName);
            });
        });
    });
});

/**
 * =========================================================
 * HELPER FUNCTIONS
 * =========================================================
*/

/**
 * Returns all selected/highlighted tabs in the current window.
 * @returns {Array.<browser.tabs>}
 */
function getSelectedTabs() {
    return browser.tabs.query({currentWindow: true, highlighted: true,});
}

/**
 * Calls the browser's download on a given URL
 * @param {string} address A string URL to be downloaded
 * @param {string} saveName Output filename for the item
 */
function downloadFromUrl(address, saveName) {
    browser.downloads.download({
        url : address,
        filename: saveName
    });
}
