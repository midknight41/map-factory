/* eslint-disable */
import Benchmark from "benchmark";
import createMapper from "../lib/index";

const existingMode = createMapper(false)
  .map("fieldName").to("field.name")
  .map("fieldId").to("field.id")
  .map(["fieldName", "fieldId"]).to("merged", (name, id) => { `${name}-${id}` });
const arrayFromExistingMode = createMapper(false)
  .map(["fieldName"]).to("field.name", value => value)
  .map(["fieldId"]).to("field.id", value => value)
  .map(["fieldName", "fieldId"]).to("merged", (name, id) => { `${name}-${id}` });
const experimentMode = createMapper(true)
  .map("fieldName").to("field.name", value => value)
  .map("fieldId").to("field.id", value => value)
  .map(["fieldName", "fieldId"]).to("merged", (name, id) => { `${name}-${id}` });
const arrayFromExperimentMode = createMapper(true)
  .map(["fieldName"]).to("field.name", value => value)
  .map(["fieldId"]).to("field.id", value => value)
  .map(["fieldName", "fieldId"]).to("merged", (name, id) => { `${name}-${id}` });

const source = {
  fieldName: "my name",
  fieldId: "abc"
};

existingMode.execute(source);
experimentMode.execute(source);
arrayFromExistingMode.execute(source);
arrayFromExperimentMode.execute(source);

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
  .add("using arrayMaps with old code", () => {
    arrayFromExistingMode.execute(source);
  })
  .add("using arrayMaps with new code", () => {
    arrayFromExperimentMode.execute(source);
  })
  .add("using experiment", () => {
    experimentMode.execute(source);
  })
  .add("just wrapping object-mapper", () => {
    existingMode.execute(source);
  })
  // add listeners
  .on("cycle", function (event) {
    console.log(String(event.target));
  })
  .on("complete", result => {
    // console.log("Fastest is", Benchmark.filter(result, "fastest")[0].name);
    console.log(suite["0"].name, suite["0"].count, suite["0"].times);
    console.log(suite["1"].name, suite["1"].count, suite["1"].times);
    console.log(suite["2"].name, suite["2"].count, suite["2"].times);
    console.log(suite["3"].name, suite["3"].count, suite["3"].times);
    console.log(suite["4"].name, suite["4"].count, suite["4"].times);

    // for(const item of result) {
    //   console.log(item.name, item.count);  
    // }
    // console.log("result", Benchmark.filter(result, "fastest"));
  })
  // run async
  .run({ "async": false });
