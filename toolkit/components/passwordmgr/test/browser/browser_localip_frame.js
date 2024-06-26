"use strict";

add_setup(async () => {
  // We do not want http://example.com etc. to be upgraded to https
  await SpecialPowers.pushPrefEnv({
    set: [["dom.security.https_first", false]],
  });

  const login1 = LoginTestUtils.testData.formLogin({
    origin: "http://10.0.0.0",
    formActionOrigin: "https://example.org",
    username: "username1",
    password: "password1",
  });
  const login2 = LoginTestUtils.testData.formLogin({
    origin: "https://example.org",
    formActionOrigin: "https://example.org",
    username: "username2",
    password: "password2",
  });
  await Services.logins.addLogins([login1, login2]);
});

add_task(async function test_warningForLocalIP() {
  let tests = [
    /* when the url of top-level and iframe are both ip address, do not show insecure warning */
    {
      top: "http://192.168.0.0",
      iframe: "http://10.0.0.0",
      expected: `[originaltype="loginWithOrigin"]`,
    },
    {
      top: "http://192.168.0.0",
      iframe: "https://example.org",
      expected: `[type="insecureWarning"]`,
    },
    {
      top: "http://example.com",
      iframe: "http://10.0.0.0",
      expected: `[type="insecureWarning"]`,
    },
    {
      top: "http://example.com",
      iframe: "http://example.org",
      expected: `[type="insecureWarning"]`,
    },
  ];

  for (let test of tests) {
    let urlTop = test.top + DIRECTORY_PATH + "empty.html";
    let urlIframe =
      test.iframe + DIRECTORY_PATH + "insecure_test_subframe.html";

    let tab = await BrowserTestUtils.openNewForegroundTab(gBrowser, urlTop);
    let browser = tab.linkedBrowser;

    await SpecialPowers.spawn(browser, [urlIframe], async url => {
      await new content.Promise(resolve => {
        let ifr = content.document.createElement("iframe");
        ifr.onload = resolve;
        ifr.src = url;
        content.document.body.appendChild(ifr);
      });
    });

    let popup = document.getElementById("PopupAutoComplete");
    Assert.ok(popup, "Got popup");

    let ifr = browser.browsingContext.children[0];
    Assert.ok(ifr, "Got iframe");

    let popupShown = openACPopup(
      popup,
      tab.linkedBrowser,
      "#form-basic-username",
      ifr
    );
    await popupShown;

    let item = popup.querySelector(test.expected);
    Assert.ok(item, "Got expected richlistitem");

    await BrowserTestUtils.waitForCondition(
      () => !item.collapsed,
      "Wait for autocomplete to show"
    );

    await closePopup(popup);
    BrowserTestUtils.removeTab(tab);
  }
});
