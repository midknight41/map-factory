### 3.7.5

Fixed a bug where ```{"alwaysSet":true}``` was not setting an empty array in all use cases.

### 3.7.4

Upgraded dependencies and changed the build to only support node 8 and higher.

### 3.7.3

npm audit fixes.

### 3.7.2

fixed a bug with pipeline transformations.

### 3.7.1

Fixed a bug when traversing an array of a non-existing object.

### 3.7.0

The ```notFound``` transform function for the ```to()``` method will now supply the the type of non-value they discovered (```null``` or ```undefined```).

Fixed a bug where the ```set``` method could not be used after the ```map``` method.

### 3.6.1

Fixed a bug with the keep method.

```js
const source = {
  "foo": {
      "foo1": "bar",
       "bar": "bar"
  }
}
mapper.map("foo").keep(["foo1", "foo2"]);

// foo2 should not exist here

 {
  "foo": {
      "foo1": "bar",
       "foo2": undefined
  }
}
```

### 3.6.0

The ```to()``` method now takes a optional ```notFound``` transform that allows for basic conditional logic to be applied. For convenience, you can also supply a basic value.

```js

const mapper = createMapper();

// These two mappings are logically equivalent
mapper
  .map("amount").to("data", amount => `£${amount}`, () => "£0");
  .map("amount").to("data", amount => `£${amount}`, "£0");

```

### 3.5.0

The source field for the ```map()``` method is now optional. If omitted, the method will get the entire source object. This is quite useful when combined with pipeline transformations.

```js
const mapper = createMapper();

mapper
  .map().to("data");
  .execute({"a": "b"})

/*
  {
    data: {"a": "b"}
  }
*/
```

### 3.4.0

Added the ```keep()``` pipeline transformation.

More details can found in the [Pipeline Transformations](README.md#pipeline-transformations) section of the README.

### 3.3.0

Added ```compact()```, ```first()```, and ```last()``` Pipeline Transformations for more detailed control over arrays.

More details can found in the [Pipeline Transformations](README.md#pipeline-transformations) section of the README.

### 3.2.0

Mapping can now be conditionally based on other values in the source document using ```acceptIf()``` and ```rejectIf()```.

More details can found in the [Pipeline Transformations](README.md#pipeline-transformations) section of the README.

### 3.1.0

New ```set()``` feature to allow you to set a value on the target object without requiring a source field.

```js
mapper
  .set("my.target.mappingStatus", "mapped");

// OR

mapper
  .set("my.target.id", () => createId());
```

### 3.0.0

Fixes a bug when dealing with arrays of arrays with mapping fields involved in parent-child relationships. This is a breaking change as the values supplied to transforms must preserve a nested array structure to be properly set on the target object. The 2.x versions did not preserve this structure.

The ```getValue``` function will also preserve this structure too.

```js

  const createMapper = require("map-factory");

  let mapper = createMapper();
  let src = {
    one: [
      { name: "first", two: [{ three: { value1: "A1", value2: "A2" } }, { three: { value1: "B1", value2: "B2" } }] },
      { name: "second", two: [{ three: { value1: "C1", value2: "C2" } }, { three: { value1: "D1", value2: "D2" } }] }
    ]
  };

  mapper
    .map("one[].name").to("combined[].name")
    .map("one[].two[].three[].value1").to("combined[].values[]", value => {

      // A transform in v2 received ["A1","B1","C1","D1"]
      // The transform in v3 will now receive [["A1","B1"],["C1","D1"]]
      return value;

    });

  let actual = mapper.execute(src);

  // The broken result in v2 {"combined":[{"name":"first","values":[["A1","B1","C1","D1"]]},{"name":"second"}]}
  // The correct result in v3 {"combined":[{"name":"first","values":["A1","B1"]},{"name":"second","values":["C1","D1"]}]}
```

Additionally the ```with()``` modifier has been added that will allow more fine grain control when working with arrays of arrays. More details can be found in the [README](README.md#working-with-arrays-of-arrays).

### 2.4.1

Fixed bug where ```each()``` returned a null when supplied with an empty array instead of returing an empty array.

### 2.4.0

Added the ```removing()``` method that allows you to specify which fields you don't want instead of explicitly stating the fields you do want.

```js

const mapper = createMapper();

const src = {
  user: {
    name: "Tim",
    occupation: "Enchanter",
    password: "scary bunny"
  }
};

mapper
  .map("user").removing("password").to("user");
  .execute(src);

/*
The expected result is:

{
  user: {
    name: "Tim",
    occupation: "Enchanter"
  }
}

*/

```

### 2.3.1

Fixed a bug where an array of undefined values was calling the transform and set when it shouldn't have.

### 2.3.0

Added ```chain``` method to the mapper which allows you to chain multiple mappers together and execute sequentially.

```js
const source = {
  "foo": "bar",
  "bar": "foo"
};

 const mapper = createMapper();
 const secondaryMapper = createMapper();

mapper.map("foo");
secondaryMapper.map("foo").to("bar");

const result = mapper.chain(secondaryMapper).execute(source);

/**
The expected result will be
{
  "bar": "bar"
}
**/

```

### 2.2.0

Added ```executeAsync()``` to the mapper which will return a Promise.

### 2.1.2

Corrected TypeScript definitions.

### 2.1.1

Put some dev dependencies back where they belong.

### 2.1.0

Exposes the main two underlying functions: ```getValue``` and ```setValue```.

See [README](README.md#extras) for more details.

### 2.0.3

Removed some debugging code that was accidentally left in.

### 2.0.2

Made the babel output ES5 to allow use in the browser.

### 2.0.1

Screwed up with publishing 2.0.0. This fixed that.

### 2.0.0

In ```v1``` the default behaviour was the equivalent of setting the options as ```{alwaysTransform: true, alwaysSet: true}```. In ```v2``` the default behaviour is now the equivalent of setting the options as ```{alwaysTransform: false, alwaysSet: false}```. 

We feel these are generally better defaults. This is a **breaking** change.

If you prefer the ```v1``` behaviour you just need to change your code as follows:

#### Old Code
```js
const mapper = createMapper();
```

#### New Code
```js
const options = {
  alwaysTransform: true,
  alwaysSet: true
};

const mapper = createMapper(options);
```

Additionally, the ```v1``` behaviour would consider a null an acceptable value if a ```?``` was appended to the ```to()``` field. In ```v2``` this behaviour will only work in combination with the ```always``` flag.

#### Old Code
```js
map("foo.bar").to("bar.bar?");
```

#### New Code
```js
map("foo.bar").always.to("bar.bar?");
```

### 1.7.2

Bug-fix to make *or mode* respect behaviour modifiers. 

### 1.7.1

Bug-fix for ```always``` and ```existing``` modifiers.

### 1.7.0

Introduced behaviour modifiers to make map-factory more flexible. See [README](README.md#behaviour) for more details.

#### Modify default behaviour

```js
const createMapper = require("map-factory");

const options = {
  alwaysTransform: false,
  alwaysSet: false
};

const mapper = createMapper(options);
```
#### Modify behaviour on a single mapping

```js
const createMapper = require("map-factory");

const mapper = createMapper(options);

mapper
  .map("a").always.to("b")
  .map("c").existing.to("d");
```

### 1.6.3
Set experimental flag to eliminate some of the object-mapper code

### 1.6.2
Remove object-mapper dependency

### 1.6.1
Fixed regression in experimental mode

### 1.6.0
Added experimental mode to begin absorbing object-mapper into code base 

```js

const mapper = createMapper({ experimental:true });

```

### 1.5.0
Converted code from TypeScript to ES6 with babel

### 1.4.1 
Fixed bug where you couldn't map from the same source field more than once.

### 1.4.0
Added the chainable ```or()``` method to select from alterate source fields.

```js

const mapper = createMapper();

mapper
	.map("occupier").or("tenant").or("leasee").to("occupier");

```

### 1.3.0

Added the ```each()``` method to help when working with multiple mappers and arrays.

### 1.2.3

Actually fixed the links in the docs

### 1.2.2

Tried and failed to fix links in docs

### 1.2.1

Improved documentation

### 1.2.0

Add map method which will improve readability in some use cases
Added support for fluent coding style

### 1.1.0

Added feature to ```map.execute``` which allows you to provide an existing object as the target object.

### 1.0.1

Previous version did not publish properly.

### 1.0.0

Semver MAJOR: moved ```source``` to ```map.execute()```;

#### old code
```js
const createMapper = require("map-factory");

const source = {
 "fieldName": "name1",
 "fieldId": "123",
 "fieldDescription": "description"
};

// Prevents you from reusing the mapper
const map = createMapper(source);

map("fieldName").to("field.name");
map("fieldId").to("field.id");

const result = map.execute();
console.log(result);
```

#### new code
```js
const createMapper = require("map-factory");

const source = {
  "fieldName": "name1",
  "fieldId": "123",
  "fieldDescription": "description"
};

const map = createMapper();

map("fieldName").to("field.name");
map("fieldId").to("field.id");

// mapper can now be reused
const result = map.execute(source);
console.log(result);
```
