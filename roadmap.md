# Feature Roadmap

- ~~Absorb *object-mapper* to allow more control over mapping behaviour.~~
- ~~```mapper.each``` will accept null or undefined values to simplify working with multiple mappers.~~
- ~~Option to supress transforms if the source data is not available.~~
- ~~Option to supress set (which may create some structure) being called when source data is not available.~~
- ~~```map("from").always.to("to")``` will override the default behaviour (or behaviour set in the options) and force set and transform to be called.~~
- ~~```map("from").existing.to("to")``` will override the default behaviour (or behaviour set in the options) and supress set and transform being called.~~
~~- Map fields conditionally based on the value of another field. ```map("a").acceptIf("c", c => c < 123).to("")``` and ```map("a").rejectIf("c", c => c < 123).to("")```~~
~~- Set a field value that has no source value. ```mapper.set("a", 2)``` or ```mapper.set("a", () => 2)```~~
- Allow ```map()``` to reference the root object.
- Filter array values for uniqueness. ```map("a[]").uniquely().to("[]")```
- Option to implicitly map all fields that haven't be explicitly mapped. (```removing``` feature does this for the most part already)
- Add aggregate methods like sum() avg() etc.
- Allow a mapping to accept a default value. Maybe like: ```map("from").to("to").defaultsTo("item not found")```
