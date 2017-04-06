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
