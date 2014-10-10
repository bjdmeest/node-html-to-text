var fs = require('fs');
var util = require('util');

var _ = require('underscore');
var _s = require('underscore.string');
var htmlparser = require("htmlparser");

var helper = require('./helper');
var format = require('./formatter');

// Which type of tags should not be parsed
var SKIP_TYPES = [
	'style',
	'script'
];

function htmlToText(html, options) {
	options = options || {};
	_.defaults(options, {
		wordwrap: 80,
		tables: []
	});

	var handler = new htmlparser.DefaultHandler(function (error, dom) {
		
	}, {
		verbose: true,
		ignoreWhitespace: true
	});
	new htmlparser.Parser(handler).parseComplete(html);
	
	var result = walkDom(filterBody(handler.dom), options);
	return _s.strip(result);
}

function filterBody(dom) {
	var result = null;
	function walk(dom) {
		if (result) return;
		_.each(dom, function(elem) {
			if (elem.name === 'body') {
				result = elem.children;
				return;
			}
			if (elem.children) walk(elem.children);
		});
	}
	walk(dom);
	return result || dom;
}

function containsTable(attr, tables) {
	if (tables === true) return true;

	function removePrefix(key) {
		return key.substr(1);
	}
	function checkPrefix(prefix) {
		return function(key) {
			return _s.startsWith(key, prefix);
		};
	}
	function filterByPrefix(tables, prefix) {
		return _(tables).chain()
						.filter(checkPrefix(prefix))
						.map(removePrefix)
						.value();
	}
	var classes = filterByPrefix(tables, '.');
	var ids = filterByPrefix(tables, '#');
	return attr && (_.include(classes, attr.class) || _.include(ids, attr.id));
}

function walkDom(dom, options) {
    var lastResult = '';
    return walk(dom, options);

    function walk(dom, options) {
        var result = '';
        var whiteSpaceRegex = /\S$/;
        var punctuationRegex = /^[\.,!\?%\*;:]/;
        _.each(dom, function(elem) {
            switch(elem.type) {
                case 'tag':
                    switch(elem.name.toLowerCase()) {
                        case 'a':
                            // Inline element needs a leading space if `result` currently
                            // doesn't end with whitespace
                            elem.needsSpace = whiteSpaceRegex.test(lastResult + result);
                            lastResult = format.anchor(elem, walk, options);
                            result += lastResult;
                            break;
                        case 'p':
                            lastResult = format.paragraph(elem, walk, options);
                            result += lastResult;
                            break;
                        case 'h1':
                        case 'h2':
                        case 'h3':
                        case 'h4':
                            lastResult = format.heading(elem, walk, options);
                            result += lastResult;
                            break;
                        case 'br':
                            lastResult = format.lineBreak(elem, walk, options);
                            result += lastResult;
                            break;
                        case 'hr':
                            lastResult = format.horizontalLine(elem, walk, options);
                            result += lastResult;
                            break;
                        case 'ul':
                            lastResult = format.unorderedList(elem, walk, options);
                            result += lastResult;
                            break;
                        case 'ol':
                            lastResult = format.orderedList(elem, walk, options);
                            result += lastResult;
                            break;
                        case 'table':
                            if (containsTable(elem.attribs, options.tables)) {
                                lastResult = format.table(elem, walk, options);
                                result += lastResult;
                                break;
                            }
                        default:
                            lastResult = walk(elem.children || [], options);
                            result += lastResult;
                    }
                    break;
                case 'text':
                    if (elem.raw !== '\r\n') {
                        // Text needs a leading space if `result` currently
                        // doesn't end with whitespace
                        if (!punctuationRegex.test(elem.raw)) {
                            elem.needsSpace = whiteSpaceRegex.test(lastResult + result);
                            // TODO problems with lists! lastResult is ' * item.', whilst intermediate is already next item prefix, i.e., ' * '
                        }
                        lastResult = format.text(elem, options);
                        result += lastResult;
                    }
                    break;
                default:
                    if (!_.include(SKIP_TYPES, elem.type)) {
                        lastResult = walk(elem.children || [], options);
                        result += lastResult;
                    }
            }
        });
        return result;
    }
}

exports.fromFile = function(file, options, callback) {
	if (!callback) {
		callback = options;
		options = {};
	}
	fs.readFile(file, 'utf8', function(err, str) {
		var result = htmlToText(str, options);
		return callback(null, result);
	});
};

exports.fromString = function(str, options) {
	return htmlToText(str, options || {});
};
