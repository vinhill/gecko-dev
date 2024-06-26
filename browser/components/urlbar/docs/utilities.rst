Utilities
=========

Various modules provide shared utilities to the other components:

`UrlbarPrefs.sys.mjs <https://searchfox.org/mozilla-central/source/browser/components/urlbar/UrlbarPrefs.sys.mjs>`_
-------------------------------------------------------------------------------------------------------------------

Implements a Map-like storage or urlbar related preferences. The values are kept
up-to-date.

.. code:: JavaScript

  // Always use browser.urlbar. relative branch, except for the preferences in
  // PREF_OTHER_DEFAULTS.
  UrlbarPrefs.get("delay"); // Gets value of browser.urlbar.delay.

.. note::

  Newly added preferences should always be properly documented in UrlbarPrefs.

`UrlbarUtils.sys.mjs <https://searchfox.org/mozilla-central/source/browser/components/urlbar/UrlbarUtils.sys.mjs>`_
-------------------------------------------------------------------------------------------------------------------

Includes shared utils and constants shared across all the components.
