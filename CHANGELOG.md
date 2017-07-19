### 2.3.0

Add ```chain``` method to the mapper which allows you to chain multiple mappers together and execute sequentially.

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
