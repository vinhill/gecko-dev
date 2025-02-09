/*
 * Bug 1330882 - A test case for opening new windows as rounded size when
 *   fingerprinting resistance is enabled.
 */

const CC = Components.Constructor;

let gMaxAvailWidth;
let gMaxAvailHeight;

add_setup(async function () {
  await SpecialPowers.pushPrefEnv({
    set: [["privacy.resistFingerprinting", true]],
  });

  // Calculate the maximum available size.
  let maxAvailSize = await calcMaximumAvailSize();

  gMaxAvailWidth = maxAvailSize.maxAvailWidth;
  gMaxAvailHeight = maxAvailSize.maxAvailHeight;
});

add_task(async function test_new_window() {
  // Open a new window.
  let win = await BrowserTestUtils.openNewBrowserWindow();

  // Load a page and verify its window size.
  let tab = await BrowserTestUtils.openNewForegroundTab(
    win.gBrowser,
    TEST_PATH + "file_dummy.html"
  );

  await SpecialPowers.spawn(
    tab.linkedBrowser,
    [{ gMaxAvailWidth, gMaxAvailHeight }],
    async function (input) {
      let windowWaived = content.wrappedJSObject.window;
      is(
        windowWaived.screen.width,
        input.gMaxAvailWidth,
        "The screen.width has a correct rounded value"
      );
      is(
        windowWaived.screen.height,
        input.gMaxAvailHeight,
        "The screen.height has a correct rounded value"
      );
      is(
        windowWaived.innerWidth,
        input.gMaxAvailWidth,
        "The window.innerWidth has a correct rounded value"
      );
      is(
        windowWaived.innerHeight,
        input.gMaxAvailHeight,
        "The window.innerHeight has a correct rounded value"
      );
    }
  );

  BrowserTestUtils.removeTab(tab);
  await BrowserTestUtils.closeWindow(win);
});
