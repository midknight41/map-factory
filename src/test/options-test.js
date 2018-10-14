import {expect} from "code";
import * as Lab from "lab";
import getHelper from "lab-testing";
import createMapper from "../lib/index";
import existingSuite from "./suites/existing-modifier-suite";
import alwaysSuite from "./suites/always-modifier-suite";

const lab = exports.lab = Lab.script();
const testing = getHelper(lab);
const group = testing.createExperiment("The createMapper() method");

group("when setting options", () => {

  lab.test("sets the defaults correctly when no options are provided", () => {

    const map = createMapper();

    const mapping = map("a");

    expect(mapping).to.be.an.object();
    expect(mapping.alwaysSet).to.be.false();
    expect(mapping.alwaysTransform).to.be.false();
    expect(mapping.flatten).to.be.null();
    expect(mapping.flattenInverted).to.be.false();
  });

  lab.test("sets the defaults correctly when empty options are provided", () => {

    const map = createMapper({});

    const mapping = map("a");

    expect(mapping).to.be.an.object();
    expect(mapping.alwaysSet).to.be.false();
    expect(mapping.alwaysTransform).to.be.false();
    expect(mapping.flatten).to.be.null();
    expect(mapping.flattenInverted).to.be.false();
  });

  lab.test("sets the alwaysTransform option correctly", () => {

    const map = createMapper({alwaysTransform: true});

    const mapping = map("a");

    expect(mapping).to.be.an.object();
    expect(mapping.alwaysSet).to.be.false();
    expect(mapping.alwaysTransform).to.be.true();
    expect(mapping.flatten).to.be.null();
    expect(mapping.flattenInverted).to.be.false();
  });

  lab.test("sets the alwaysSet option correctly", () => {

    const map = createMapper({alwaysSet: true});

    const mapping = map("a");

    expect(mapping).to.be.an.object();
    expect(mapping.alwaysSet).to.be.true();
    expect(mapping.alwaysTransform).to.be.false();
    expect(mapping.flatten).to.be.null();
    expect(mapping.flattenInverted).to.be.false();
  });

  lab.test("sets the flattenInverted option correctly", () => {

    const map = createMapper({flattenInverted: true});

    const mapping = map("a");

    expect(mapping).to.be.an.object();
    expect(mapping.alwaysSet).to.be.false();
    expect(mapping.alwaysTransform).to.be.false();
    expect(mapping.flatten).to.be.null();
    expect(mapping.flattenInverted).to.be.true();
  });

  lab.test("sets the flatten option correctly", () => {

    const map = createMapper({flatten: true});

    const mapping = map("a");

    expect(mapping).to.be.an.object();
    expect(mapping.alwaysSet).to.be.false();
    expect(mapping.alwaysTransform).to.be.false();
    expect(mapping.flatten).to.be.true();
    expect(mapping.flattenInverted).to.be.false();
  });


  lab.test("the existing modifier sets more alwaysSet and alwaysTransform to false", () => {

    const map = createMapper({alwaysSet: true, alwaysTransform: true});

    const mapping = map("a").existing;

    expect(mapping).to.be.an.object();
    expect(mapping.alwaysSet).to.be.false();
    expect(mapping.alwaysTransform).to.be.false();
  });

  lab.test("the always modifier sets more alwaysSet and alwaysTransform to true", () => {

    const map = createMapper({alwaysSet: false, alwaysTransform: false});

    const mapping = map("a").always;

    expect(mapping).to.be.an.object();
    expect(mapping.alwaysSet).to.be.true();
    expect(mapping.alwaysTransform).to.be.true();
  });

});

group("when executing with options set, the single source mapper", () => {

  lab.test("suppresses a transform when the source value is not present", () => {

    const source = {
      "my": {
        "source": {
          "is": {}
        }
      }
    };

    const expected = {
      "your": {
        "source": {
          "is": {}
        }
      }
    };

    const map = createMapper({alwaysTransform: false, alwaysSet: true});

    map("my.source.is.missing").to("your.source.is.missing", () => {
      return "found";
    });

    const actual = map.execute(source);

    expect(actual).to.equal(expected);
  });

  lab.test("suppresses a set when the source value is not present", () => {

    const source = {
      "my": {
        "source": {
          "is": {}
        }
      }
    };

    const expected = {
    };

    const map = createMapper({alwaysTransform: false, alwaysSet: false});
    let count = 0;

    map("my.source.is.missing").to("your.source.is.missing", () => {
      count++;
      return "found";
    });

    const actual = map.execute(source);

    expect(actual).to.equal(expected);
    expect(count).to.equal(0);
  });

  lab.test("a set is not supressed when the source value is not present if a transform returns a value", () => {

    const source = {
      "my": {
        "source": {
          "is": {}
        }
      }
    };

    const expected = {
      "your": {
        "source": {
          "is": {
            "missing": "found"
          }
        }
      }
    };

    const map = createMapper({alwaysTransform: true, alwaysSet: false});

    map("my.source.is.missing").to("your.source.is.missing", () => {
      return "found";
    });

    const actual = map.execute(source);

    expect(actual).to.equal(expected);
  });

  lab.test("if a transform returns undefined a set will be called", () => {

    const source = {
      "my": {
        "source": {
          "is": {}
        }
      }
    };

    const expected = {
      "your": {
        "source": {
          "is": {}
        }
      }
    };

    const map = createMapper({alwaysTransform: true, alwaysSet: true});

    map("my.source.is.missing").to("your.source.is.missing", () => {
      return undefined;
    });

    const actual = map.execute(source);

    expect(actual).to.equal(expected);
  });

  lab.test("if source value is false set will be called", () => {

    const source = {
      "my": {
        "source": {
          "is": {
            "missing": false
          }
        }
      }
    };

    const expected = {
      "your": {
        "source": {
          "is": {
            "missing": false
          }
        }
      }
    };

    const map = createMapper({alwaysTransform: false, alwaysSet: false});

    map("my.source.is.missing").to("your.source.is.missing");

    const actual = map.execute(source);

    expect(actual).to.equal(expected);
  });

  group("multiple mappings and arrays", () => {
    lab.test("when two mappings have an array as the first mapping", () => {

      const mapper = createMapper({alwaysSet: true});

      const source = {
        foo: 0,
        bar: []
      };

      const expected = {bar: [], foo: 0};

      mapper
        .map("bar").to("bar[]")
        .map("foo");

      const actual = mapper.execute(source);

      expect(actual).to.equal(expected);

    });

    lab.test("when two mappings have an array as the second mapping", () => {

      const mapper = createMapper({alwaysSet: true});

      const source = {
        foo: 0,
        bar: []
      };

      const expected = {bar: [], foo: 0};

      mapper
        .map("foo")
        .map("bar").to("bar[]");

      const actual = mapper.execute(source);

      expect(actual).to.equal(expected);

    });

  });


});

group("when executing with options set, the multi source mapper", () => {

  lab.test("suppresses a transform when the source values are all not present", () => {

    const source = {
      "my": {
        "source": {
          "is": {}
        },
        "other": {
          "source": {
            "is": {}
          }
        }
      }
    };

    const expected = {
      "your": {
        "source": {
          "is": {}
        }
      }
    };

    const map = createMapper({alwaysTransform: false, alwaysSet: true});

    map(["my.source.is.missing", "my.other.source.is.missing"]).to("your.source.is.missing", () => {
      return "found";
    });

    const actual = map.execute(source);

    expect(actual).to.equal(expected);
  });

  lab.test("suppresses a set if a transform returns null", () => {

    const source = {
      "my": {
        "source": {
          "is": {}
        },
        "other": {
          "source": {
            "is": {
              "here": "value"
            }
          }
        }
      }
    };

    const expected = {
    };

    const map = createMapper({alwaysTransform: false, alwaysSet: false});
    let count = 0;

    map(["my.source.is.missing", "my.other.source.is.here"]).to("your.source.is.missing", () => {
      count++;
      return null;
    });

    const actual = map.execute(source);

    expect(actual).to.equal(expected);
    expect(count).to.equal(1);
  });

  lab.test("suppresses a set if a transform returns undefined", () => {

    const source = {
      "my": {
        "source": {
          "is": {}
        },
        "other": {
          "source": {
            "is": {
              "here": "value"
            }
          }
        }
      }
    };

    const expected = {
    };

    const map = createMapper({alwaysTransform: false, alwaysSet: false});

    let count = 0;

    map(["my.source.is.missing", "my.other.source.is.here"]).to("your.source.is.missing", () => {
      count++;
      return undefined;
    });

    const actual = map.execute(source);

    expect(actual).to.equal(expected);
    expect(count).to.equal(1);
  });

  lab.test("a transform executes when one source value is present", () => {

    const source = {
      "my": {
        "source": {
          "is": {
            "here": "value"
          }
        },
        "other": {
          "source": {
            "is": {}
          }
        }
      }
    };

    const expected = {
      "your": {
        "source": {
          "is": {
            "here": "found"
          }
        }
      }
    };

    const map = createMapper({alwaysTransform: false, alwaysSet: true});

    map(["my.source.is.here", "my.other.source.is.missing"]).to("your.source.is.here", () => {
      return "found";
    });

    const actual = map.execute(source);

    expect(actual).to.equal(expected);
  });
});

group("when executing with options set, the or-mode source map", () => {

  lab.test("a transform executes when no sources are present but alwaysTransform is true", () => {

    const source = {
      "my": {
        "source": {
          "is": {}
        },
        "other": {
          "source": {
            "is": {}
          }
        }
      }
    };

    const expected = {
      "your": {
        "source": {
          "is": {
            "here": "found"
          }
        }
      }
    };

    const map = createMapper({alwaysTransform: true, alwaysSet: false});

    map("my.source.is.here").or("my.other.source.is.missing").to("your.source.is.here", () => {
      return "found";
    });

    const actual = map.execute(source);

    expect(actual).to.equal(expected);
  });

  lab.test("a transform does not execute when no sources are present and alwaysTransform is false", () => {
    const source = {
      "my": {
        "source": {
          "is": {}
        },
        "other": {
          "source": {
            "is": {}
          }
        }
      }
    };

    const expected = {};

    const map = createMapper({alwaysTransform: false, alwaysSet: false});

    map("my.source.is.here").or("my.other.source.is.missing").to("your.source.is.here", () => {
      return "whoops";
    });

    const actual = map.execute(source);

    expect(actual).to.equal(expected);
  });

  lab.test("no set is called when no values are present and alwaysSet is false", () => {

    const source = {
      "my": {
        "source": {
          "is": {}
        },
        "other": {
          "source": {
            "is": {}
          }
        }
      }
    };

    const expected = {};

    const map = createMapper({alwaysTransform: false, alwaysSet: false});

    map("my.source.is.here").or("my.other.source.is.missing").to("your.source.is.here");

    const actual = map.execute(source);

    expect(actual).to.equal(expected);
  });

  lab.test("set is called when no values are present but alwaysSet is true", () => {

    const source = {
      "my": {
        "source": {
          "is": {}
        },
        "other": {
          "source": {
            "is": {}
          }
        }
      }
    };

    const expected = {
      "your": {
        "source": {
          "is": {}
        }
      }
    };
    const map = createMapper({alwaysTransform: false, alwaysSet: true});

    map("my.source.is.here").or("my.other.source.is.missing").to("your.source.is.here");

    const actual = map.execute(source);

    expect(actual).to.equal(expected);
  });

});

group("the always modifier", () => {

  alwaysSuite.run(lab, {OPTIONS: null});
  alwaysSuite.run(lab, {});
  alwaysSuite.run(lab, {OPTIONS: {alwaysTransform: false, alwaysSet: false}});
  alwaysSuite.run(lab, {OPTIONS: {alwaysTransform: false, alwaysSet: true}});
  alwaysSuite.run(lab, {OPTIONS: {alwaysTransform: true, alwaysSet: false}});
  alwaysSuite.run(lab, {OPTIONS: {alwaysTransform: false, alwaysSet: true}});

});

group("the existing modifier", () => {

  existingSuite.run(lab, {OPTIONS: null});
  existingSuite.run(lab, {});
  existingSuite.run(lab, {OPTIONS: {alwaysTransform: false, alwaysSet: false}});
  existingSuite.run(lab, {OPTIONS: {alwaysTransform: false, alwaysSet: true}});
  existingSuite.run(lab, {OPTIONS: {alwaysTransform: true, alwaysSet: false}});
  existingSuite.run(lab, {OPTIONS: {alwaysTransform: false, alwaysSet: true}});

});

group("the failureTransform as a option for default use", () => {
  lab.test("should use the global failure transformed if its defined and failure transform is not provided as part of the mapping", () => {
    const source = {
      "foo": "name1",
      "bar": "name2",
      "fooNull": null
    };

    const expected = {
      "foo1": "bar",
      "foo2": "bar",
      "foo3": "from global",
      "fooOr": "from global",
      "foo4": "from global",
      "foo5": "from global",
      "fooNull": "foo"
    };

    const mapper = createMapper({failureTransform: val => val === null ? "foo" : "from global"});

    mapper
      .map("foo1").to("foo1", null, "bar")
      .map("foo2").to("foo2", null, () => "bar")
      .map("foo2").to("foo5")
      .map(["foo1", "foo2"]).to("foo3", () => "check")
      .map("foo1").or("foo2").to("fooOr")
      .map("foo4").always.to("foo4")
      .map("fooNull").to("fooNull");

    const actual = mapper.execute(source);

    expect(actual).to.equal(expected);
  });
});
