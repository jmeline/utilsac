import { performance } from "perf_hooks";
import { createPerformanceTest, runAll } from "leistung";

import { deepCopy } from "../../utility.js";


const deepCopyJSON = x => JSON.parse(JSON.stringify(x));

const a = {
    b: 7,
    c: "",
    d: "ddddd",
    e: {
        f: {},
        g: "g",
        z: { z: { z: { z: { eq: null, o: -45 } } } }
    },
    h: [5, 43]
};

let b;

const JSONCopyTest = {
    name: 'JSONCopy',
    code: (shared, finish) => {
        b = deepCopyJSON(a);
        finish();
    }
};

const deepCopyTest = {
    name: 'deepCopy',
    code: (shared, finish) => {
        b = deepCopy(a);
        finish();
    }
};

const testSuite = createPerformanceTest({
    tests: [JSONCopyTest, deepCopyTest],
    maxTime: 50,
    nowReferential: performance.now,
});
runAll(testSuite);
