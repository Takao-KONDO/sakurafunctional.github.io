"use strict";

exports.__esModule = true;
// istanbul ignore next

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _helpersReact = require("../../helpers/react");

var react = _interopRequireWildcard(_helpersReact);

var _types = require("../../../types");

/**
 * [Please add a description.]
 */

var t = _interopRequireWildcard(_types);

var JSX_ANNOTATION_REGEX = /^\*\s*@jsx\s+([^\s]+)/;

var metadata = {
  group: "builtin-advanced"
};

/**
 * [Please add a description.]
 */

exports.metadata = metadata;
var visitor = require("../../helpers/build-react-transformer")({

  /**
   * [Please add a description.]
   */

  pre: function pre(state) {
    var tagName = state.tagName;
    var args = state.args;
    if (react.isCompatTag(tagName)) {
      args.push(t.literal(tagName));
    } else {
      args.push(state.tagExpr);
    }
  },

  /**
   * [Please add a description.]
   */

  post: function post(state, file) {
    state.callee = file.get("jsxIdentifier");
  }
});

/**
 * [Please add a description.]
 */

exports.visitor = visitor;
visitor.Program = function (node, parent, scope, file) {
  var id = file.opts.jsxPragma;

  for (var i = 0; i < file.ast.comments.length; i++) {
    var comment = file.ast.comments[i];
    var matches = JSX_ANNOTATION_REGEX.exec(comment.value);
    if (matches) {
      id = matches[1];
      if (id === "React.DOM") {
        throw file.errorWithNode(comment, "The @jsx React.DOM pragma has been deprecated as of React 0.12");
      } else {
        break;
      }
    }
  }

  file.set("jsxIdentifier", id.split(".").map(t.identifier).reduce(function (object, property) {
    return t.memberExpression(object, property);
  }));
};