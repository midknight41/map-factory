# map-factory

[![Greenkeeper badge](https://badges.greenkeeper.io/midknight41/map-factory.svg)](https://greenkeeper.io/)
[![Coverage Status](https://coveralls.io/repos/github/midknight41/map-factory/badge.svg?branch=master)](https://coveralls.io/github/midknight41/map-factory?branch=master) [![Build](https://api.travis-ci.org/midknight41/map-factory.svg?branch=master)](https://travis-ci.org/midknight41/map-factory) [![Deps](https://david-dm.org/midknight41/map-factory.svg)](https://david-dm.org/midknight41/map-factory#info=dependencies) [![devDependency Status](https://david-dm.org/midknight41/map-factory/dev-status.svg)](https://david-dm.org/midknight41/map-factory#info=devDependencies)

[![NPM](https://nodei.co/npm/map-factory.png?downloads=true)](https://www.npmjs.com/package/map-factory/)

A simple object mapping utility that makes it easy to map data from one object to another. **map-factory** provides a fluent interface and supports deep references, custom transformations, and object merging.

#### Features
- Deep references with dot notation
- Custom transformations
- Fluent (chainable) interface
- Select from multiple source fields in a single statement

#### Examples
- [Mapping data to a new structure](#mapping-data-to-a-new-structure)
- [Working with arrays](#working-with-arrays)
- [Transformations](#transformations)
- [Pipeline Transformations](#pipeline-transformations)
- [Working with multiple source objects](#dealing-with-multiple-sources-of-data)

See [Change Log](./CHANGELOG.md) for changes from previous versions.

## How to install

```
npm install map-factory -S
```

## Getting Started

**map-factory** supports two similar interfaces. Which you use is up to you and your use case. There is no functional difference.

The basic syntax is:

```js
const createMapper = require("map-factory");

const map = createMapper();

map("sourceField").to("source.field");
map("sourceId").to("source.id");

const result = map.execute(source);
```

Alternatively you can use the fluent interface which supports method chaining. This syntax is better when you need to refer to multiple mappers in your code.

```js
const createMapper = require("map-factory");

const mapper = createMapper();

mapper
  .map("sourceField").to("source.field")
  .map("sourceId").to("source.id");

const result = mapper.execute(source);
```

### Syntax

Below are some examples of the syntax used to get and set data with *map-factory*. More details examples can be found in the [examples](#examples) section.

Consider this object:

```js
const source = {
  my: {
    deep: {
      object: { name: "john" },
      value: "abc",
      array: [
        { value: 1 },
        { value: 2 },
        { value: 3 }
      ]
    },
    other: {
      array: [4, 5, 6]
    }
  }
};
```

Query | Description | Result
--- | ---: | ---:
my.deep.object | Select a nested object | ```{ name: "john" }```
my.deep.value | Select the value of a single property on a nested object | ```"abc"```
my.deep.array | Select all items in an array of objects | ```[{ value: 1 }, { value: 2 }, { value: 3 }]```
my.deep.array[].value | Select the ```value``` property from all items in an array | ```[1,2,3]```
my.other.array | Select all items from a value array | ```[4,5,6]```
my.deep.array[0] | Select an item in an array by index | ```{ value: 1 }```

### Basic Example
```js
const createMapper = require("map-factory");
const assert = require("assert");

const source = {
  my: {
    deep: {
      object: { name: "john" },
      value: "abc",
      array: [
        { value: 1 },
        { value: 2 },
        { value: 3 }
      ]
    },
    other: {
      array: [4, 5, 6]
    }
  }
};

const mapper = createMapper();

mapper
  .map("my.deep.value").to("example.basic.value")
  .map("my.deep.object").to("example.basic.object")
  .map("my.deep.array[0]").to("example.arrays.first")
  .map("my.deep.array").to("example.arrays.items")
  .map("my.deep.array[].value").to("example.arrays.values")
  .map("my.other.array").to("example.arrays.valueArray");

const actual = mapper.execute(source);

const expected = {
  example: {
    basic: {
      value: "abc",
      object: { name: "john" }
    },
    arrays: {
      first: { value: 1 },
      items: [
        { value: 1 },
        { value: 2 },
        { value: 3 }
      ],
      values: [1, 2, 3],
      valueArray: [4, 5, 6]
    }
  }
};

assert.deepEqual(actual, expected);
```

Sometimes you may want to reference the entire root object as opposed to individual fields. This can be achieved by omitting the source field on the ```map()``` method:

```js
const createMapper = require("map-factory");
const assert = require("assert");

const source = {
  "name": "Tim",
  "job": "Enchanter",
  "account": {
    "userId": "tim1987",
    "email": "tim@enchanter.com"
  }
};

const mapper = createMapper();

mapper
  .map().to("raw") // <= omitting the source field will copy the source object
  .map("user.email").to("email")

const actual = mapper.execute(source);

const expected = {
  "raw": {
    "name": "Tim",
    "job": "Enchanter",
    "account": {
      "userId": "tim1987",
      "email": "tim@enchanter.com"
    }
  },
  "email": "tim@enchanter.com"
};

assert.deepEqual(actual, expected);
``` 

## Behaviour

By default, **map-factory** will: 

- only call a transform (if one has been provided) if a source value was found in the source object.
- only create a nested structure if a source value was found on the source object. 

While this default is good some use cases it is not suitable for all use cases. To cater for this, behaviour modifiers are available.

### Modify default behaviour

The ```createMapper()``` function takes an (optional) options parameter that will override the default behaviour.

- **alwaysTransform: boolean**
  - if *true* then a transform will always be called even if the source value was not available on the source object.
  - if *false* then a transform will only be called if the source value was available on the source object.

- **alwaysSet: boolean**
  - if *true* then nested structure will be created even if the source value was not available on the source object.
  - if *false* then structure will only be create if the source value was available on the source object.

```js
const createMapper = require("map-factory");

const options = {
  alwaysTransform: true,
  alwaysSet: true
};

const mapper = createMapper(options);
```
### Modify behaviour on a single mapping

Additionally, you can also modify the behaviour on an individual mapping by using the ```always``` or ```existing``` modifiers on the mapping like this:

```js
const createMapper = require("map-factory");

const mapper = createMapper();

mapper
  .map("a").always.to("b")
  .map("c").existing.to("d");
```

- The ```always``` modifier is the equivalent of setting the ```alwaysTransform``` **and** ```alwaysSet``` options to true.
- The ```existing``` modifier is the equivalent of setting the ```alwaysTransform``` **and** ```alwaysSet``` options to false.

## Extras

The core functions that power **map-factory** can be used directly if required.

```js
const { getValue, setValue } = require("map-factory");

const obj = {
  my: {
    deep: {
      value: "here"
    }
  }
};

const value = getValue(obj, "my.deep.value");
assert.equal(value, "here");

const expected = {
  my: {
    example: {
      set: "done"
    }
  }
};

const actual = setValue({}, "my.example.set", "done");
assert.deepEqual(actual, expected);

```

If working with multiple mappers you can chain them together in a pipe-like manner. Be aware that the `chain()` method mutates the original mapper and establishes a permanent connection between the two mappers.

```js
const source = {
  "foo": "bar",
  "bar": "foo"
};

const expected = {
  "bar": "bar"
};

 const mapper = createMapper();
 const secondaryMapper = createMapper();

mapper.map("foo");
secondaryMapper.map("foo").to("bar");

const actual = mapper.chain(secondaryMapper).execute(source);
assert.deepEqual(actual, expected);
```

If you want to append additional fields to the target object you can use ```set()```:

```js

// Using a static value
mapper
  .set("my.target.mappingStatus", "mapped");

// or using a function
mapper
  .set("my.target.id", () => createId());
```

## Examples

### Mapping data to a new structure

**map-factory** supports deep object references for both source and target fields via dot notation. Mapping is explicit so unmapped fields are discarded.

```js
const createMapper = require("map-factory");
const assert = require("assert");

const source = {
  "fieldName": "name1",
  "fieldId": "123",
  "fieldDescription": "description"
};

const map = createMapper();
map("fieldName").to("field.name");
map("fieldId").to("field.id");

const result = map.execute(source);

assert.deepEqual(result, {
  "field": {
    "name": "name1",
    "id": "123"
  }
});
```

The ```to()``` is optional so if you want to just want to copy a subset of fields to a new object you can do the following:

```js
const createMapper = require("map-factory");
const assert = require("assert");

const source = {
  "fieldName": "name1",
  "fieldId": "123",
  "fieldDescription": "description"
};

const map = createMapper();
map("fieldName");
map("fieldId");

const result = map.execute(source);

assert.deepEqual(result, {
  "fieldName": "name1",
  "fieldId": "123"
});
```

### Working with arrays
You can use ```[]``` to traverse the entries in an array. For example, here you can transform an array of objects to an array of strings.

```js
const createMapper = require("map-factory");
const assert = require("assert");

const source = {
  "person": {
    "name": "John",
    "email": "john@someplace.com",
    "phone": "(712) 123 4567"
  },
  "account": {
    "id": "abc123",
    "entitlements": [{
      "id": 1,
      "name": "game-1"
    },
      {
        "id": 2,
        "name": "game-2"
      }]
  }
};

const map = createMapper();
map("person.email").to("user.login");
map("account.id").to("user.accountId");
map("account.entitlements[].name").to("user.entitlements");

const result = map.execute(source);

assert.deepEqual(result, {
  "user": {
    "login": "john@someplace.com",
    "accountId": "abc123",
    "entitlements": ["game-1", "game-2"]
  }
});
```

You can also reference specific items in an array.

```js
const createMapper = require("map-factory");
const assert = require("assert");

const source = {
  "articles": [
    {
      "id": 1,
      "title": "Top Article",
      "author": "Joe Doe",
      "body": "..."
    },
    {
      "id": 2,
      "title": "Second Article",
      "author": "Joe Doe",
      "body": "..."
    }
  ]
};

const map = createMapper();
map("articles[0]").to("topStory");

const result = map.execute(source);

assert.deepEqual(result, {
  "topStory": {
    "id": 1,
    "title": "Top Article",
    "author": "Joe Doe",
    "body": "..."
  }
});
```
#### Working with arrays of arrays

When working with arrays of arrays, **map-factory** tries to figure out what array shape is appropriate and will automatically flatten arrays when appropriate.

When attempting to flatten 3 or more levels of nesting it becomes impossible to predict the desired outcome as more than one outcome can be considered correct.

By default, flattening will be applied at the deepest level of the arrays structure. For example:

```js
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

const mapper = createMapper();

mapper
  .map("one[].two[].three[].value").to("one[].two[]")

const result = mapper.execute(src);

/*
{
  one: [
    { two: ["A", "B", "C", "D"] }, 
    { two: ["A1", "B1", "C1", "D1"] }
  ]
}
*/
```

In some cases this default behaviour may not be the desired result. You can change the behaviour to flatten the array from the most shallow level by using the ```flattenInverted``` option. This can be supplied the ```createMapper``` function (which affects all mappings) or using the ```with``` method as below.

```js
const mapper = createMapper();

const options = { flattenInverted: true };

mapper
  .map("one[].two[].three[].value").with(options).to("one[].two[]")

const result = mapper.execute(src);

/*
{
  "one": [
    { "two": ["A", "B"] },
    { "two": ["C", "D"] },
    { "two": ["A1", "B1"] },
    { "two": ["C1", "D1"] }
  ]
}
*/
```
The flattening behaviour can also be turned off if desired. A transform can be used to manipulate the values yourself.

```js
const mapper = createMapper();

const options = { flatten: false };

mapper
  .map("one[].two[].three[].value").with(options).to("one[].two[]", values => {

    // manipulate the result if necessary.
    return values;

  });

const result = mapper.execute(src);

/*
{
  "one":[
    {"two":[["A","B"],["C","D"]]},
    {"two":[["A1","B1"],["C1","D1"]]}
   ]
}
*/
```

**map-factory** also provides the ```each()``` method to help work with arrays and multiple mappers. This is useful when child objects within your main object have the same structure.

```js
const createMapper = require("map-factory");
const assert = require("assert");

const source = {
  one: [{value: "a", drop: "me" }, {value: "b", drop: "me"  }, {value: "c", drop: "me"  }],
  two: [{value: "a", drop: "me"  }, {value: "b", drop: "me"  }, {value: "c", drop: "me"  }],
  three: [{value: "a", drop: "me"  }, {value: "b", drop: "me"  }, {value: "c", drop: "me"  }]
};

const mainMapper = createMapper();
const childMapper = createMapper();

childMapper
  .map("value").to("item");

mainMapper
  .map("one").to("one", array => childMapper.each(array))
  .map("two").to("two", array => childMapper.each(array))
  .map("three").to("three", array => childMapper.each(array));

const actual = mainMapper.execute(source);

assert.deepEqual(actual, {
  one: [{item: "a" }, {item: "b" }, {item: "c" }],
  two: [{item: "a" }, {item: "b" }, {item: "c" }],
  three: [{item: "a" }, {item: "b" }, {item: "c" }]
});
```

If you are using using Promises with **map-factory** you can use ```executeAsync``` which returns a promise.

```js
const createMapper = require("map-factory");

const mapper = createMapper();

mapper
  .map("sourceField").to("source.field")
  .map("sourceId").to("source.id");

mapper.executeAsync(source)
  .then(result = > {
    console.log(result);
  });
```

### Transformations
More complicated transformations can be handled by providing a function. The selected source data will be passed to the function.

It is worth looking at the [behaviour](#behaviour) section to understand when a transform will be called.

```js
const createMapper = require("map-factory");
const assert = require("assert");

const source = {
  "articles": [
    {
      "id": 1,
      "title": "Top Article",
      "author": "Joe Doe",
      "body": "..."
    },
    {
      "id": 2,
      "title": "Second Article",
      "author": "Joe Doe",
      "body": "..."
    }
  ]
};

const map = createMapper();
map("articles[0]").to("topStory");
map("articles").to("otherStories", articles => {

  if (articles) {

    // We don't want to include the top story in with the other stories
    articles.shift();

  }

  return articles;

});

const result = map.execute(source);
assert.deepEqual(result, {
  "topStory": {
    "id": 1,
    "title": "Top Article",
    "author": "Joe Doe",
    "body": "..."
  },
  "otherStories": [
    {
      "id": 2,
      "title": "Second Article",
      "author": "Joe Doe",
      "body": "..."
    }
  ]
});
```

The ```to()``` method also takes a optional ```notFound``` transform that allows for basic conditional logic to be applied. This will be called if the source is ```null``` or ```undefined```. For convenience, you can also supply a basic value.

```js

const mapper = createMapper();

mapper
  .map("amount").to("data", amount => `£${amount}`, value => {
    
    // Only set the string on a null not an undefined
    if (value === null) {
      return "£0";
    }
    
    return value;

    });

```

The discoverd non-value will be passed to the ```notFound``` function in case further interrogation is required.

```js

const mapper = createMapper();
const src = {
  amount: null
};

// These two mappings are logically equivalent
mapper
  .map("amount").to("data", amount => `£${amount}`, () => "£0");
  .map("amount").to("data", amount => `£${amount}`, "£0");

```





You can also provide an array of source fields and they can be extracted together if you provide a transform for the target field.

```js
const createMapper = require("map-factory");
const assert = require("assert");

const source = {
  "apples": {
    "count": 3
  },
  "oranges": {
    "count": 4
  }
};

const map = createMapper();

map(["apples.count", "oranges.count"]).to("fruit.count", (appleCount, orangeCount) => {

  return appleCount + orangeCount;

});

const result = map.execute(source);

assert.deepEqual(result, {
  fruit: {
  count: 7
  }
});
```

If, however, you are trying to pick from one source or another source field, **map-factory** provides a bit of syntax sugar to make things a bit easier. Transformations are supported with this method too.

```js
const createMapper = require("map-factory");
const assert = require("assert");

const source = {
  "leasee": "Mr. Man"
};

const map = createMapper();

map("occupier").or("leasee").or("tenant").to("occupier");

const result = map.execute(source);

assert.deepEqual(result, {
  "occupier": "Mr. Man"
});
```

## Pipeline Transformations
A pipeline transformation is applied after a source field is selected and modifies the data or behaviour in some way.

### removing(fieldsToRemove: string[])

- ```fieldsToRemove```: An array of field names.

Implicit mapping behaviour can be achieved using the ```removing()``` method. Removing can take either a single field name or an array of field names.

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
  .map("user").removing(["password"]).to("user");
  .execute(src);

/*
{
  user: {
    name: "Tim",
    occupation: "Enchanter"
  }
}
*/
```

### keep(fieldsToKeep: string[])

- ```fieldsToKeep```: An array of field names.

The inverse of the ```removing()``` method. ```keep()``` can take either a single field name or an array of field names.

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
  .map("user").keep(["name", "occupation"]).to("user");
  .execute(src);

/*
{
  user: {
    name: "Tim",
    occupation: "Enchanter"
  }
}
*/
```

### acceptIf(comparingKey: string, comparision: function|any)

This method allows you to filter the mapped source data based on another field value on the source object.

- ```comparingKey```: The source field for the conditional logic. Please note the ```comparingKey``` cannot include an array at present.
- ```comparision```: A function that will be passed the value of ```comparingKey``` that should return ```true``` for the mapping to proceed. A non-function value can be supplied instead which will do a simple equal comparision (===) if that's all you need to do.
```js
const mapper = createMapper();

const src = [{
  ownershipType: "leasehold",
  amount: 235240,
  leaseLength: "99 Years"
},{
  ownershipType: "freehold",
  amount: 275240,
  leaseLength: "N/A"
}];

mapper
  .map("amount").to("sale.amount")
  .map("ownershipType").to("ownership.type")
  .map("leaseLength").acceptIf("ownershipType", "leasehold").to("lease.length");

const result = mapper.each(src);
/*
[ { sale: { amount: 235240 },
    ownership: { type: 'leasehold' },
    lease: { length: '99 Years' } 
  },
  { 
    sale: { amount: 275240 },
    ownership: { type: 'freehold' } 
  } 
]
*/
```

Here's the same example but using a function for comparision:
```js
mapper
  .map("amount").to("sale.amount")
  .map("ownershipType").to("ownership.type")
  .map("leaseLength").acceptIf("ownershipType", type => type === "leasehold").to("lease.length");
```

### rejectIf(comparingKey: string, comparision: function|any)

This method allows you to filter the mapped source data based on another field value on the source object. This method has the opposite behaviour of ```acceptIf()```.

- ```comparingKey```: The source field for the conditional logic. Please note the ```comparingKey``` cannot include an array at present.
- ```comparision```: A function that will be passed the value of ```comparingKey``` that should return ```true``` to cancel the mapping. A non-function value can be supplied instead which will do a simple equal comparision (===) if that's all you need to do.

```js
const mapper = createMapper();

const src = [{
  ownershipType: "leasehold",
  amount: 235240,
  leaseLength: "99 Years"
},{
  ownershipType: "freehold",
  amount: 275240,
  leaseLength: "N/A"
}];

mapper
  .map("amount").to("sale.amount")
  .map("ownershipType").to("ownership.type")
  .map("leaseLength").rejectIf("ownershipType", "freehold").to("lease.length");

const result = mapper.each(src);
/*
[ { sale: { amount: 235240 },
    ownership: { type: 'leasehold' },
    lease: { length: '99 Years' } 
  },
  { 
    sale: { amount: 275240 },
    ownership: { type: 'freehold' } 
  } 
]
*/
```

Here's the same example but using a function for comparision:
```js
mapper
  .map("amount").to("sale.amount")
  .map("ownershipType").to("ownership.type")
  .map("leaseLength").rejectIf("ownershipType", type => type === "freehold").to("lease.length");
```

### first()

Selects the first item from an array.

```js
const input = ["a", "b", "c"];

mapper = createMapper();

mapper
  .map("[]").first().to("data")
  .execute(input);

/*
  {data: "a"}
*/
```

### last()

Selects the last item from an array.

```js
const input = ["a", "b", "c"];

mapper = createMapper();

mapper
  .map("[]").last().to("data")
  .execute(input);

/*
  {data: "c"}
*/
```

### compact()

Removes all *falsy* items from an array.

```js
const input = [null, "a", false, "b", undefined, "c"];

mapper = createMapper();

mapper
  .map("[]").compact()
  .execute(input);

/*
  ["a", "b", "c"]
*/
```

### sort(comparer?: function)

Sorts the array in the *Ascending* order. You can also pass in a comparer for sorting on the basis of comparisons.

```js
const input = {
  "foo": [{"x": 4}, {"x": 2}],
  "bar": [4, 2]
};

mapper = createMapper();

mapper
  .map("foo").sort(item => item.x)
  .map("bar").sort()
  .execute(input);

/*
{
  "foo": [{"x": 2}, {"x": 4}],
  "bar": [2, 4]
};
*/
```

### reverseSort(comparer?: function)

Sorts the array in the *Descending* order. You can also pass in a comparer for sorting on the basis of comparisons.

```js
const input = {
  "foo": [{"x": 2}, {"x": 4}],
  "bar": [2, 4]
};

mapper = createMapper();

mapper
  .map("foo").reverseSort(item => item.x)
  .map("bar").reverseSort()
  .execute(input);

/*
{
  "foo": [{"x": 4}, {"x": 2}],
  "bar": [4, 2]
};
*/
```

## Dealing with multiple sources of data
There are two ways to deal with multiple sources of data.
- Combine your data in to a single object before mapping
- Use multiple mappers and combine the objects as you go

#### Combine data first
This method is useful when you are retrieving all of your data at once. It involves taking your source data and appending it all onto a single object.

The advantage of this method is that you can create a single transform mapping object which is used to map all of your data together and that you do not have to mutate your objects.

We'd recommend this approach for most use cases.

```js
const createMapper = require("map-factory");
const assert = require("assert");

// assume the following inputs
const post = {
  "body": "<p>Some Text</p>"
};

const comments = {
  "list": ["not too bad", "pretty good", "awful"]
};

const user = {
  "id": 123,
  "name": "John Doe",
  "email": "john.doe@nobody.com"
};

// combine multiple objects into a single source object
const source = { post, comments, user };

const map = createMapper();

map("post.body").to("blog.post.text");
map("comments.list").to("blog.post.comments");
map("comments.list[0]").to("blog.post.topComment");
map("user.id").to("blog.author.id");
map("user.name").to("blog.author.name");
map("user.email").to("blog.author.email");

const result = map.execute(source);

assert.deepEqual(result, {
  "blog": {
    "post":
    {
      "text": "<p>Some Text</p>",
      "comments": ["not too bad", "pretty good", "awful"],
      "topComment": "not too bad"
    },
    "author": {
      "id": 123,
      "name": "John Doe",
      "email": "john.doe@nobody.com"
    }
  }
});
```

An existing object can be provided as the target object.

```js
const createMapper = require("map-factory");
const assert = require("assert");

const source = {
     "fieldName": "name1",
     "fieldId": "123",
     "fieldDescription": "description"
   };

const destination = {
 "existing": "data"
};

const map = createMapper();
map("fieldName").to("field.name");
map("fieldId").to("field.id");

const result = map.execute(source, destination);

assert.deepEqual(result, {
  "existing": "data",
  "field": {
      "name": "name1",
      "id": "123"
  }
});
```

#### Merge objects with multiple mappers
The other option is to decorate your existing data objects in a piece by piece fashion using the merge ability. Note that when using a named mapper like ```postMapper``` the code reads better when you use the explicit ```map()``` method.

```js
const createMapper = require("map-factory");
const assert = require("assert");

// assume the following inputs
const post = {
  "body": "<p>Some Text</p>"
};

const comments = {
  "list": ["not too bad", "pretty good", "awful"]
};

const user = {
  "id": 123,
  "name": "John Doe",
  "email": "john.doe@nobody.com"
};

const postMapper = createMapper();
const commentMapper = createMapper();
const authorMapper = createMapper();

postMapper
  .map("body").to("blog.post.text");

commentMapper
  .map("list").to("blog.post.comments")
  .map("list[0]").to("blog.post.topComment");

authorMapper
  .map("id").to("blog.author.id")
  .map("name").to("blog.author.name")
  .map("email").to("blog.author.email");

let result = postMapper.execute(post);
result = commentMapper.execute(comments, result);
result = authorMapper.execute(user, result);

assert.deepEqual(result, {
  "blog": {
    "post": {
      "text": "<p>Some Text</p>",
      "comments": [
        "not too bad",
        "pretty good",
        "awful"
      ],
      "topComment": "not too bad"
    },
    "author": {
      "id": 123,
      "name": "John Doe",
      "email": "john.doe@nobody.com"
    }
  }
});
```

The above approach appears untidy when compared with combining the data into a single object but it is useful in situations where your mapping logic is distributed.
For example, a mapper used within a class may build its map in the constructor and execute the mapper in a method.

```js
const createMapper = require("map-factory");
const assert = require("assert");
const BlogRepo = require("./artifacts/mock-blog-repo");

class BlogService {

  constructor(blogRepos) {
    this.blogRepos = blogRepos;

    // initialise mapper
    this.authorMapper = createMapper()
      .map("id").to("blog.author.id")
      .map("name").to("blog.author.name")
      .map("email").to("blog.author.email");
  }

  // Here post is created somewhere else and we are extending it with user information
  decorateBlogPostWithAuthor(userId, post) {
    return this.blogRepos.getUser(userId)
      .then(user => this.authorMapper.execute(user, post));
  }

}

const blogService = new BlogService(new BlogRepo());

const post = {
  "blog": {
    "post": {
      "id": 10,
      "title": "Foo bar baz",
      "post": "<p>Foo bar baz</p><Foo bar baz</p>"
    }
  }
}

return blogService.decorateBlogPostWithAuthor(1, post)
  .then(result => {
    assert.deepEqual(result, {
      "blog": {
        "post": {
          "id": 10,
          "title": "Foo bar baz",
          "post": "<p>Foo bar baz</p><Foo bar baz</p>"
        },
        "author": {
          "id": 1,
          "name": "foo",
          "email": "foo@foobar.com"
        }
      }
    });
  });
```

This module was inspired by and based on the excellent [object-mapper](http://www.npmjs.com/object-mapper).
