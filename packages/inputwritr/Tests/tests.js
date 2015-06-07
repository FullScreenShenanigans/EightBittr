var keys = {},
    triggers = {
		"onkeydown": {
			"left": function () {
				keys.left = "down";
			},
			"right": function () {
				keys.right = "down";
			}
		},
		"onkeyup": {
			"left": function () {
				keys.left = "up";
			},
			"right": function () {
				keys.right = "up";
			}
		}
	},
	aliases = {
		"left": [65, 37],
		"right": [68, 39]
	},
	keyAliasesToCodes = undefined,
	keyCodesToAliases = undefined,
	canTrigger = undefined,
	isRecording = undefined,
	getTimestamp;

if (typeof performance === "undefined") {
    getTimestamp = function () {
        return Date.now();
    };
} else {
    getTimestamp = (
        performance.now
        || (performance).webkitNow
        || (performance).mozNow
        || (performance).msNow
        || (performance).oNow
    ).bind(performance);
}

describe("constructor", function () {
	it("throws errors when not given triggers", function () {
		chai.expect(function () {
			new InputWritr.InputWritr({});
		}).to.throw("No triggers given to InputWritr.");
	});
});