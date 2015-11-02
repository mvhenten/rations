"use strict";
var ms = require("milliseconds");
var Ration = require("../index");
var test = require("tape");

test("Should limit within policy", function(assert) {
    var ration = new Ration([{
        label: "Only ten things per day",
        count: 10,
        period: ms.days(1)
    }, {
        label: "Only three things per hour",
        count: 3,
        period: ms.hours(1),
    }, {
        label: "Only one thing per minute",
        count: 1,
        period: ms.minutes(1)
    }]);

    var cases = [{
        label: "Assorted timestamps within bounds yield no err",
        err: undefined,
        stamps: [
            Date.now() - ms.days(1),
            Date.now() - ms.days(2),
            Date.now() - ms.days(3),
            Date.now() - ms.minutes(1),
            Date.now() - ms.minutes(2),
            Date.now() - ms.hours(1),
        ],
    },
    {
        label: "Exceeds the hourly limit",
        err: "Only three things per hour",
        stamps: [
            Date.now() - ms.minutes(1),
            Date.now() - ms.minutes(2),
            Date.now() - ms.minutes(3),
            Date.now() - ms.minutes(4),
        ],
    },
    {
        label: "Exceeds the minute limit",
        err: "Only one thing per minute",
        stamps: [
            Date.now() - ms.seconds(10),
            Date.now() - ms.seconds(20),
        ],
    },
    {
        label: "Exceeds the dayly limit",
        err: "Only ten things per day",
        stamps: [
            Date.now() - ms.minutes(1),
            Date.now() - ms.minutes(2),
            Date.now() - ms.minutes(3),
            Date.now() - ms.hours(1),
            Date.now() - ms.hours(1),
            Date.now() - ms.hours(1),
            Date.now() - ms.hours(1),
            Date.now() - ms.hours(1),
            Date.now() - ms.hours(1),
            Date.now() - ms.hours(1),
            Date.now() - ms.hours(1),
        ],
    }
    ];

    cases.forEach(function(testCase) {
        var err = ration.check(testCase.stamps);

        if (testCase.err) {
            assert.ok(err instanceof Error, "err isa Error");
            assert.equal(err.message, testCase.err, testCase.label);
            return;
        }
        assert.ok(!err, testCase.label);

    });



    assert.end();

});