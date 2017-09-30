/* eslint-disable */
import Benchmark from "benchmark";
import createMapper from "../lib/index";

const mapper = createMapper()
  .map("fieldName").to("field.name")
  .map("fieldId").to("field.id")
  .map(["fieldName", "fieldId"]).to("merged", (name, id) => { `${name}-${id}` });

const source = {
  fieldName: "my name",
  fieldId: "abc"
};

mapper.execute(source);

const suite = new Benchmark.Suite();

// add tests
suite
  .add("map and run", () => {
    const map = createMapper();

    map("fieldName").to("field.name", value => value);
    map("fieldId").to("field.id", value => value);
    map(["fieldName", "fieldId"]).to("merged", (name, id) => { `${name}-${id}` });

    map.execute(source);
  })
  // .add("using arrayMaps with old code", () => {
  //   arrayFromExistingMode.execute(source);
  // })
  // .add("using arrayMaps with new code", () => {
  //   arrayFromExperimentMode.execute(source);
  // })
  // .add("using experiment", () => {
  //   experimentMode.execute(source);
  // })
  .add("just wrapping object-mapper", () => {
    mapper.execute(source);
  })
  // add listeners
  .on("cycle", function (event) {
    console.log(String(event.target));
  })
  .on("complete", result => {
    console.log(suite["0"].name, suite["0"].count, suite["0"].times);
    console.log(suite["1"].name, suite["1"].count, suite["1"].times);

  })
  // run async
  .run({ "async": false });
