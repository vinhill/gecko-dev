/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var EXPORTED_SYMBOLS = ["TestFile"];

const Assert = {
  ok(cond, text) {
    // we don't have the test harness' utilities in this scope, so we need this
    // little helper. In the failure case, the exception is propagated to the
    // caller in the main run_test() function, and the test fails.
    if (!cond)
      throw "Failed check: " + text;
  }
};

var TestFile = {
  doTest: function(cb) {
    // throw if anything goes wrong

    // find the current directory path
    var file = Cc["@mozilla.org/file/directory_service;1"]
               .getService(Ci.nsIProperties)
               .get("CurWorkD", Ci.nsIFile);
    file.append("xpcshell.toml");

    // should be able to construct a file
    var f1, f2;
    Promise.all([
      File.createFromFileName(file.path).then(f => { f1 = f; }),
      File.createFromNsIFile(file).then(f => { f2 = f; }),
    ])
    .then(() => {
      // do some tests
      Assert.ok(f1 instanceof File, "Should be a DOM File");
      Assert.ok(f2 instanceof File, "Should be a DOM File");

      Assert.ok(f1.name == "xpcshell.toml", "Should be the right file");
      Assert.ok(f2.name == "xpcshell.toml", "Should be the right file");

      Assert.ok(f1.type == "", "Should be the right type");
      Assert.ok(f2.type == "", "Should be the right type");
    })
    .then(() => {
      var threw = false;
      try {
        // Needs a ctor argument
        var f7 = new File();
      } catch (e) {
        threw = true;
      }
      Assert.ok(threw, "No ctor arguments should throw");

      var threw = false;
      try {
        // Needs a valid ctor argument
        var f7 = new File(Date(132131532));
      } catch (e) {
        threw = true;
      }
      Assert.ok(threw, "Passing a random object should fail");

      // Directories fail
      var dir = Cc["@mozilla.org/file/directory_service;1"]
                  .getService(Ci.nsIProperties)
                  .get("CurWorkD", Ci.nsIFile);
      return File.createFromNsIFile(dir)
    })
    .then(() => {
      Assert.ok(false, "Can't create a File object for a directory");
    }, () => {
      Assert.ok(true, "Can't create a File object for a directory");
    })
    .then(() => {
      cb(true);
    });
  },
};
