/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

"use strict";

// Make this available to both AMD and CJS environments
define(function (require, exports, module) {
  // Dependencies
  const PropTypes = require("resource://devtools/client/shared/vendor/react-prop-types.js");
  const {
    span,
  } = require("resource://devtools/client/shared/vendor/react-dom-factories.js");
  // Utils
  const {
    wrapRender,
  } = require("resource://devtools/client/shared/components/reps/reps/rep-utils.js");
  const PropRep = require("resource://devtools/client/shared/components/reps/reps/prop-rep.js");
  const {
    MODE,
  } = require("resource://devtools/client/shared/components/reps/reps/constants.js");

  /**
   * Renders an entry of a Map, (Local|Session)Storage, Header or FormData entry.
   */
  GripEntry.propTypes = {
    object: PropTypes.object,
    mode: PropTypes.oneOf(Object.values(MODE)),
    onDOMNodeMouseOver: PropTypes.func,
    onDOMNodeMouseOut: PropTypes.func,
    onInspectIconClick: PropTypes.func,
  };

  function GripEntry(props) {
    const { object } = props;

    let { key, value } = object.preview;
    if (key && key.getGrip) {
      key = key.getGrip();
    }
    if (value && value.getGrip) {
      value = value.getGrip();
    }

    return span(
      {
        className: "objectBox objectBox-map-entry",
      },
      PropRep({
        ...props,
        name: key,
        object: value,
        equal: " \u2192 ",
        title: null,
        suppressQuotes: false,
      })
    );
  }

  function supportsObject(grip, noGrip = false) {
    if (noGrip === true) {
      return false;
    }
    return (
      grip &&
      (grip.type === "formDataEntry" ||
        grip.type === "highlightRegistryEntry" ||
        grip.type === "mapEntry" ||
        grip.type === "storageEntry" ||
        grip.type === "urlSearchParamsEntry") &&
      grip.preview
    );
  }

  // Exports from this module
  module.exports = {
    rep: wrapRender(GripEntry),
    supportsObject,
  };
});
