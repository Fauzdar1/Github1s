/**
 * This function is called when the button in the popup is clicked by
 * the user.
 * It sends a message to the background.js to fire-up the event of
 * opening a Github1s tab.
 * Based on the response received, it shows a failure message in the
 * button's text to provide a feedback of failure.
 * In case of success, it does nothing, and the background.js opens
 * a new tab and switches to it.
 * @param e - Event of the button but useless in this scenario.
 */
function clickHandler(e) {
    //To generate random background gradient when button is clicked.
    //generate();

    chrome.runtime.sendMessage({directive: "popup-click", url: window.location.href}, function (response) {
        console.log(response.response);
        if (response.response === 'failure') {
            document.getElementById('click-me').innerHTML = 'This site is not github';
            setTimeout(() => {
                document.getElementById('click-me').innerHTML = 'Open Github1S';
            }, 2000);
        } else {
            this.close(); // close the popup when the background finishes processing request
        }
    });
}

/**
 * This is a system event fired-up when the popup is opened and the page is loaded to set
 * the onClick function of the button in this scenario.
 * The commented generate() can be directly called from here whenever
 * the popup is opened.
 * The Tab opening mechanism can also be directly linked to this when
 * the popup is opened, mentioned in the second commented paragraph
 */
document.addEventListener('DOMContentLoaded', function () {
    //To generate random background gradient when popup loads.
    //generate();

    //To directly open Github1s without popup when the extension is clicked.
    /*chrome.runtime.sendMessage({directive: "popup-click"}, function (response) {
        this.close(); // close the popup when the background finishes processing request
    });*/

    //Setting up the button's onClickListener
    document.getElementById('click-me').addEventListener('click', clickHandler);
})

/**
 * This function was used to generate random gradient background.
 * It is called when the popup is opened and it sets a background gradient
 * instead of the current background image.
 */
function generate() {

    let hexValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e"];

    function populate(a) {
        for (let i = 0; i < 6; i++) {
            let x = Math.round(Math.random() * 14);
            let y = hexValues[x];
            a += y;
        }
        return a;
    }

    let newColor1 = populate('#');
    let newColor2 = populate('#');
    let angle = Math.round(Math.random() * 360);

    document.getElementById("container").style.background = "linear-gradient(" + angle + "deg, " + newColor1 + ", " + newColor2 + ")";
}
