"use strict";

function assert(ok, msg) {
    if (!ok) throw new TypeError(msg);
}

function isInt(num) {
    return num % 1 === 0;
}

function Ration(policies) {
    assert(Array.isArray(policies), "Policies must be an array");

    for (var i = 0; i < policies.length; i++) {
        var policy = policies[i];
        assert(typeof policy === "object", "A policy must be an object");
        assert(typeof policy.label === "string", "Policy must have a label (string)");
        assert(isInt(policy.count), "Policy must have a count (int)");
        assert(isInt(policy.period), "Policy must have a period (int)");

        policy.period = parseInt(policy.period, 10);
    }

    this.policies = policies;
}

Ration.prototype = {
    check: function(stamps) {
        assert(Array.isArray(stamps), "Timestamps should be an array");
        assert(stamps.every(isInt), "Timestamps should be integers");
        stamps = stamps.map(function(t) {
            return parseInt(t, 10);
        });

        for (var i = 0; i < this.policies.length; i++) {
            var policy = this.policies[i];

            if (this._checkPolicy(policy, stamps)) {
                return new Error(policy.label);
            }
        }
    },

    _checkPolicy: function(policy, stamps) {
        var period = Date.now() - policy.period,
            count = 0;

        for (var i = 0; i < stamps.length; i++) {
            var ts = stamps[i];

            if (period < ts) {
                count++;

                if (count > policy.count) {
                    return true;
                }
            }
        }

        return false;
    }
};

module.exports = Ration;
