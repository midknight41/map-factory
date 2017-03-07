/* eslint-disable */
import Benchmark from "benchmark";
import createMapper from "../lib/index";


const buildObject = createMapper(false)
  .map("fieldName").to("field.name")
  .map("fieldId").to("field.id");

const getSetApproach = createMapper(false)
  .map(["fieldName"]).to("field.name", value => value)
  .map(["fieldId"]).to("field.id", value => value);

const experiment = createMapper(true)
  .map("fieldName").to("field.name", value => value)
  .map("fieldId").to("field.id", value => value);


const source = {
  fieldName: "my name",
  fieldId: "abc"
};

buildObject.execute(source);
experiment.execute(source);
getSetApproach.execute(source);

const suite = new Benchmark.Suite();

// add tests
suite
  .add("using experiment", () => {
    experiment.execute(source);
  })
  .add("using get and set KeyValue", () => {
    getSetApproach.execute(source);
  })
  .add("just wrapping object-mapper", () => {
    buildObject.execute(source);
  })
  .add("map and run", () => {
    const map = createMapper();

    for (let i = 0; i < 100000; i++) {

    }

    map("fieldName").to("field.name", value => value);
    map("fieldId").to("field.id", value => value);

  })
  // add listeners
  .on("cycle", function (event) {
    console.log(String(event.target));
  })
  .on("complete", result => {
    // console.log("Fastest is", Benchmark.filter(result, "fastest")[0].name);
    console.log("re", result);
    
    for(const item of result) {
      console.log(item.name, item.count);  
    }
    // console.log("result", Benchmark.filter(result, "fastest"));
  })
  // run async
  .run({ "async": false });
