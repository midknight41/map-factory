import { expect, fail } from "code";
import * as Lab from "lab";
import getHelper from "lab-testing";
import manyMappings from "./suites/many-mappings-suite";
import createMapper from "../lib";
import flattenDeep from "lodash.flattendeep";

const lab = exports.lab = Lab.script();
const testing = getHelper(lab);
const group = testing.createExperiment("arrays", "array of arrays");

const groups = ["arrays", "array of arrays"];


group("when mapping from a larger to a small array", () => {

  const src = {
    one: [{
      two: [
        { three: [{ value: "A" }, { value: "B" }] },
        { three: [{ value: "C" }, { value: "D" }] }
      ]
    },
    {
      two: [
        { three: [{ value: "A1" }, { value: "B1" }] },
        { three: [{ value: "C1" }, { value: "D1" }] }
      ]
    }]
  };

  const expected = {
    one: [
      { two: [{ value: "A" }, { value: "B" }, { value: "C" }, { value: "D" }] },
      { two: [{ value: "A1" }, { value: "B1" }, { value: "C1" }, { value: "D1" }] }
    ]
  };

  lab.test("or() mode works when the first get fails", done => {

    const mapper = createMapper();

    const actual = mapper
      .map("fish").or("one[].two[].three[].value").to("one[].two[].value")
      .execute(src);

    expect(actual).to.equal(expected);

    return done();
  });

  lab.test("or() mode works when the second get succeeds", done => {

    const mapper = createMapper();

    const actual = mapper
      .map("one[].two[].three[].value").or("fish").to("one[].two[].value")
      .execute(src);

    expect(actual).to.equal(expected);

    return done();
  });

  lab.test("missing data works as expected", done => {

    const emptySource = {
      one: [{ two: [{ three: [] }, { three: [] }, { three: null }, undefined, null] }]
    };

    const mapper = createMapper();

    const actual = mapper
      .map("one[].two[].three[]").to("one[].two[]")
      .execute(emptySource);

    expect(actual).to.equal({});

    return done();
  });
});


const valueToValueTests = [
  {
    NAME: "1 level to 2 levels",
    SOURCE: {
      one: [{ value: "A" }, { value: "B" }]
    },
    EXPECTED: {
      one: [{ two: [{ value: "A" }, { value: "B" }] }]
    },
    MAPPINGS: [
      {
        from: "one[].value",
        to: "one[].two[].value"
      }]
  },
  {
    NAME: "2 levels to 1 level",
    SOURCE: {
      one: [
        { two: [{ value: "A" }, { value: "B" }] },
        { two: [{ value: "C" }, { value: "D" }] }
      ]
    },
    EXPECTED: {
      one: [{ value: "A" }, { value: "B" }, { value: "C" }, { value: "D" }]
    },
    MAPPINGS: [
      {
        from: "one[].two[].value",
        to: "one[].value"
      }]
  },
  {
    NAME: "2 levels to 2 levels",
    SOURCE: {
      one: [
        { two: [{ value: "A" }, { value: "B" }] },
        { two: [{ value: "C" }, { value: "D" }] }
      ]
    },
    EXPECTED: {
      one: [
        { two: [{ value: "A" }, { value: "B" }] },
        { two: [{ value: "C" }, { value: "D" }] }
      ]
    },
    MAPPINGS: [
      {
        from: "one[].two[].value",
        to: "one[].two[].value"
      }]
  },
  {
    NAME: "2 level to 3 levels",
    SOURCE: {
      one: [
        { two: [{ value: "A" }, { value: "B" }] },
        { two: [{ value: "C" }, { value: "D" }] }
      ]
    },
    EXPECTED: {
      one: [{
        two: [{ three: [{ value: "A" }, { value: "B" }] }]
      },
      {
        two: [{ three: [{ value: "C" }, { value: "D" }] }]
      }]
    },
    MAPPINGS: [
      {
        from: "one[].two[].value",
        to: "one[].two[].three[].value"
      }]
  },
  {
    NAME: "3 level to 2 levels",
    SOURCE: {
      one: [{
        two: [
          { three: [{ value: "A" }, { value: "B" }] },
          { three: [{ value: "C" }, { value: "D" }] }
        ]
      },
      {
        two: [
          { three: [{ value: "A1" }, { value: "B1" }] },
          { three: [{ value: "C1" }, { value: "D1" }] }
        ]
      }]
    },
    EXPECTED: {
      one: [
        { two: [{ value: "A" }, { value: "B" }, { value: "C" }, { value: "D" }] },
        { two: [{ value: "A1" }, { value: "B1" }, { value: "C1" }, { value: "D1" }] }
      ]
    },
    MAPPINGS: [
      {
        from: "one[].two[].three[].value",
        to: "one[].two[].value"
      }]
  },
  {
    NAME: "3 level to 1 levels",
    SOURCE: {
      one: [{
        two: [
          { three: [{ value: "A" }, { value: "B" }] },
          { three: [{ value: "C" }, { value: "D" }] }
        ]
      },
      {
        two: [
          { three: [{ value: "A1" }, { value: "B1" }] },
          { three: [{ value: "C1" }, { value: "D1" }] }
        ]
      }]
    },
    EXPECTED: {
      one: [
        { value: "A" },
        { value: "B" },
        { value: "C" },
        { value: "D" },
        { value: "A1" },
        { value: "B1" },
        { value: "C1" },
        { value: "D1" }
      ]
    },
    MAPPINGS: [
      {
        from: "one[].two[].three[].value",
        to: "one[].value"
      }]
  }
];

valueToValueTests.map(({ NAME, SOURCE, EXPECTED, MAPPINGS }) => {

  const labels = flattenDeep([groups, ["with value source and value target", NAME]]);

  manyMappings.run(lab, {
    LABELS: labels, SOURCE, EXPECTED, MAPPINGS
  });

});

const valueToArrayTests = [
  {
    NAME: "1 level to 2 levels",
    SOURCE: {
      one: [{ value: "A" }, { value: "B" }]
    },
    EXPECTED: {
      one: [{ two: ["A", "B"] }]
    },
    MAPPINGS: [
      {
        from: "one[].value",
        to: "one[].two[]"
      }]
  },
  {
    NAME: "2 levels to 1 levels",
    SOURCE: {
      one: [
        { two: [{ value: "A" }, { value: "B" }] },
        { two: [{ value: "C" }, { value: "D" }] }
      ]
    },
    EXPECTED: {
      one: ["A", "B", "C", "D"]
    },
    MAPPINGS: [
      {
        from: "one[].two[].value",
        to: "one[]"
      }]
  },
  {
    NAME: "2 levels to 2 levels",
    SOURCE: {
      one: [
        { two: [{ value: "A" }, { value: "B" }] },
        { two: [{ value: "C" }, { value: "D" }] }
      ]
    },
    EXPECTED: {
      one: [{ two: ["A", "B"] }, { two: ["C", "D"] }]
    },
    MAPPINGS: [
      {
        from: "one[].two[].value",
        to: "one[].two[]"
      }]
  },
  {
    NAME: "2 level to 3 levels",
    SOURCE: {
      one: [
        { two: [{ value: "A" }, { value: "B" }] },
        { two: [{ value: "C" }, { value: "D" }] }
      ]
    },
    EXPECTED: {
      one: [{
        two: [{ three: ["A", "B"] }]
      },
      {
        two: [{ three: ["C", "D"] }]
      }]
    },
    MAPPINGS: [
      {
        from: "one[].two[].value",
        to: "one[].two[].three[]"
      }]
  },
  {
    NAME: "3 level to 2 levels",
    SOURCE: {
      one: [{
        two: [
          { three: [{ value: "A" }, { value: "B" }] },
          { three: [{ value: "C" }, { value: "D" }] }
        ]
      },
      {
        two: [
          { three: [{ value: "A1" }, { value: "B1" }] },
          { three: [{ value: "C1" }, { value: "D1" }] }
        ]
      }]
    },
    EXPECTED: {
      one: [{ two: ["A", "B", "C", "D"] }, { two: ["A1", "B1", "C1", "D1"] }]
    },
    MAPPINGS: [
      {
        from: "one[].two[].three[].value",
        to: "one[].two[]"
      }]
  },
  {
    NAME: "3 level to 1 level",
    SOURCE: {
      one: [{
        two: [
          { three: [{ value: "A" }, { value: "B" }] },
          { three: [{ value: "C" }, { value: "D" }] }
        ]
      },
      {
        two: [
          { three: [{ value: "A1" }, { value: "B1" }] },
          { three: [{ value: "C1" }, { value: "D1" }] }
        ]
      }]
    },
    EXPECTED: {
      one: ["A", "B", "C", "D", "A1", "B1", "C1", "D1"]
    },
    MAPPINGS: [
      {
        from: "one[].two[].three[].value",
        to: "one[]"
      }]
  },
  {
    NAME: "3 level to 0 level",
    SOURCE: {
      one: [{
        two: [
          { three: [{ value: "A" }, { value: "B" }] },
          { three: [{ value: "C" }, { value: "D" }] }
        ]
      },
      {
        two: [
          { three: [{ value: "A1" }, { value: "B1" }] },
          { three: [{ value: "C1" }, { value: "D1" }] }
        ]
      }]
    },
    EXPECTED: ["A", "B", "C", "D", "A1", "B1", "C1", "D1"],
    MAPPINGS: [
      {
        from: "one[].two[].three[].value",
        to: "[]"
      }]
  }

];
valueToArrayTests.map(({ NAME, SOURCE, EXPECTED, MAPPINGS }) => {

  const labels = flattenDeep([groups, ["with value source and with array target", NAME]]);
  manyMappings.run(lab, {
    LABELS: labels, SOURCE, EXPECTED, MAPPINGS
  });

});


const arrayToValueTests = [
  {
    NAME: "1 level to 2 levels",
    SOURCE: {
      one: ["A", "B"]
    },
    EXPECTED: {
      one: [{ two: [{ value: "A" }, { value: "B" }] }]
    },
    MAPPINGS: [
      {
        from: "one[]",
        to: "one[].two[].value"
      }]
  },
  {
    NAME: "2 levels to 1 level",
    SOURCE: {
      one: [
        { two: ["A", "B"] },
        { two: ["C", "D"] }
      ]
    },
    EXPECTED: {
      one: [{ value: "A" }, { value: "B" }, { value: "C" }, { value: "D" }]
    },
    MAPPINGS: [
      {
        from: "one[].two[]",
        to: "one[].value"
      }]
  },
  {
    NAME: "2 levels to 2 levels",
    SOURCE: {
      one: [
        { two: ["A", "B"] },
        { two: ["C", "D"] }
      ]
    },
    EXPECTED: {
      one: [
        { two: [{ value: "A" }, { value: "B" }] },
        { two: [{ value: "C" }, { value: "D" }] }
      ]
    },
    MAPPINGS: [
      {
        from: "one[].two[]",
        to: "one[].two[].value"
      }]
  },
  {
    NAME: "2 level to 3 levels",
    SOURCE: {
      one: [
        { two: ["A", "B"] },
        { two: ["C", "D"] }
      ]
    },
    EXPECTED: {
      one: [{
        two: [{ three: [{ value: "A" }, { value: "B" }] }]
      },
      {
        two: [{ three: [{ value: "C" }, { value: "D" }] }]
      }]
    },
    MAPPINGS: [
      {
        from: "one[].two[]",
        to: "one[].two[].three[].value"
      }]
  },
  {
    NAME: "3 level to 2 levels",
    SOURCE: {
      one: [{
        two: [
          { three: ["A", "B"] },
          { three: ["C", "D"] }
        ]
      },
      {
        two: [
          { three: ["A1", "B1"] },
          { three: ["C1", "D1"] }
        ]
      }]
    },
    EXPECTED: {
      one: [
        { two: [{ value: "A" }, { value: "B" }, { value: "C" }, { value: "D" }] },
        { two: [{ value: "A1" }, { value: "B1" }, { value: "C1" }, { value: "D1" }] }
      ]
    },
    MAPPINGS: [
      {
        from: "one[].two[].three[]",
        to: "one[].two[].value"
      }]
  },
  {
    NAME: "3 level to 1 levels",
    SOURCE: {
      one: [{
        two: [
          { three: ["A", "B"] },
          { three: ["C", "D"] }
        ]
      },
      {
        two: [
          { three: ["A1", "B1"] },
          { three: ["C1", "D1"] }
        ]
      }]
    },
    EXPECTED: {
      one: [
        { value: "A" },
        { value: "B" },
        { value: "C" },
        { value: "D" },
        { value: "A1" },
        { value: "B1" },
        { value: "C1" },
        { value: "D1" }
      ]
    },
    MAPPINGS: [
      {
        from: "one[].two[].three[]",
        to: "one[].value"
      }]
  }
];

arrayToValueTests.map(({ NAME, SOURCE, EXPECTED, MAPPINGS }) => {

  const labels = flattenDeep([groups, ["with array source and value target", NAME]]);

  manyMappings.run(lab, {
    LABELS: labels, SOURCE, EXPECTED, MAPPINGS
  });

});

const arrayToArrayTests = [
  {
    NAME: "1 level to 2 levels",
    SOURCE: {
      one: ["A", "B"]
    },
    EXPECTED: {
      one: [{ two: ["A", "B"] }]
    },
    MAPPINGS: [
      {
        from: "one[]",
        to: "one[].two[]"
      }]
  },
  {
    NAME: "2 levels to 1 levels",
    SOURCE: {
      one: [
        { two: ["A", "B"] },
        { two: ["C", "D"] }
      ]
    },
    EXPECTED: {
      one: ["A", "B", "C", "D"]
    },
    MAPPINGS: [
      {
        from: "one[].two[]",
        to: "one[]"
      }]
  },
  {
    NAME: "2 levels to 2 levels",
    SOURCE: {
      one: [
        { two: ["A", "B"] },
        { two: ["C", "D"] }
      ]
    },
    EXPECTED: {
      one: [{ two: ["A", "B"] }, { two: ["C", "D"] }]
    },
    MAPPINGS: [
      {
        from: "one[].two[]",
        to: "one[].two[]"
      }]
  },
  {
    NAME: "2 level to 3 levels",
    SOURCE: {
      one: [
        { two: ["A", "B"] },
        { two: ["C", "D"] }
      ]
    },
    EXPECTED: {
      one: [{
        two: [{ three: ["A", "B"] }]
      },
      {
        two: [{ three: ["C", "D"] }]
      }]
    },
    MAPPINGS: [
      {
        from: "one[].two[]",
        to: "one[].two[].three[]"
      }]
  },
  {
    NAME: "3 level to 2 levels",
    SOURCE: {
      one: [{
        two: [
          { three: ["A", "B"] },
          { three: ["C", "D"] }
        ]
      },
      {
        two: [
          { three: ["A1", "B1"] },
          { three: ["C1", "D1"] }
        ]
      }]
    },
    EXPECTED: {
      one: [{ two: ["A", "B", "C", "D"] }, { two: ["A1", "B1", "C1", "D1"] }]
    },
    MAPPINGS: [
      {
        from: "one[].two[].three[]",
        to: "one[].two[]"
      }]
  },
  {
    NAME: "3 level to 1 level",
    SOURCE: {
      one: [{
        two: [
          { three: ["A", "B"] },
          { three: ["C", "D"] }
        ]
      },
      {
        two: [
          { three: ["A1", "B1"] },
          { three: ["C1", "D1"] }
        ]
      }]
    },
    EXPECTED: {
      one: ["A", "B", "C", "D", "A1", "B1", "C1", "D1"]
    },
    MAPPINGS: [
      {
        from: "one[].two[].three[]",
        to: "one[]"
      }]
  }
];

arrayToArrayTests.map(({ NAME, SOURCE, EXPECTED, MAPPINGS }) => {

  const labels = flattenDeep([groups, ["with array source and with array target", NAME]]);

  manyMappings.run(lab, {
    LABELS: labels, SOURCE, EXPECTED, MAPPINGS
  });

});

// Data for parent and child tests
const source = {
  foo: [
    { "name": "a", "things": ["a1", "a2"] },
    { "name": "b", "things": ["b1", "b2"] }
  ]
};

const expected = {
  bar: [{
    label: "a",
    values: ["a1", "a2"]
  },
  {
    label: "b",
    values: ["b1", "b2"]
  }
  ]
};

manyMappings.run(lab, {
  LABELS: ["arrays", "array of arrays", "parent and child - normal order"],
  MAPPINGS: [
    { from: "foo[].name", to: "bar[].label" },
    { from: "foo[].things[]", to: "bar[].values[]" }
  ],
  SOURCE: source,
  EXPECTED: expected
});

manyMappings.run(lab, {
  LABELS: ["arrays", "array of arrays", "parent and child - inverted order"],
  MAPPINGS: [
    { from: "foo[].things[]", to: "bar[].values[]" },
    { from: "foo[].name", to: "bar[].label" }
  ],
  SOURCE: source,
  EXPECTED: expected
});
