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
