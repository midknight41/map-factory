# map-factory
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
- [Working with multiple source objects](#dealing-with-multiple-sources-of-data)

See [Change Log](./CHANGELOG.md) for changes from previous versions.
## How to install

```
npm install map-factory
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
map("account.entitlements.[].name").to("user.entitlements");

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
map("articles.[0]").to("topStory");

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

### Transformations
More complicated transformations can be handled by providing a function. The selected source data will be passed to the function.

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
map("articles.[0]").to("topStory");
map("articles").to("otherStories", articles => {

  // We don't want to include the top story in with the other stories
  articles.shift();

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

## Common patterns
### Dealing with multiple sources of data
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

This module is an alternative interface for the excellent [object-mapper](http://www.npmjs.com/object-mapper).
