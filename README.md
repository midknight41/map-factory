# map-factory

[![Coverage Status](https://coveralls.io/repos/github/midknight41/map-factory/badge.svg?branch=master)](https://coveralls.io/github/midknight41/map-factory?branch=master) [![Build](https://api.travis-ci.org/midknight41/map-factory.svg?branch=master)](https://travis-ci.org/midknight41/map-factory) [![Deps](https://david-dm.org/midknight41/map-factory.svg)](https://david-dm.org/midknight41/map-factory#info=dependencies) [![devDependency Status](https://david-dm.org/midknight41/map-factory/dev-status.svg)](https://david-dm.org/midknight41/map-factory#info=devDependencies)

A simple utility to map data from an existing object to a new one. This is an alternative interface for the excellent [object-mapper](http://www.npmjs.com/object-mapper).

See [Change Log](./CHANGELOG.md) for changes from previous versions.

## Map a source field to the same object structure

Mapping is explicit so unmapped fields are discarded.

```js
const createMapper = require("map-factory");

const source = {
  "fieldName": "name1",
  "fieldId": "123",
  "fieldDescription": "description"
};

const map = createMapper();

map("fieldName");
map("fieldId");

const result = map.execute(source);
console.log(result);

/*
  {
    "fieldName": "name1",
    "fieldId": "123"
  }
*/
```

## Map a source field to a different object structure

Of course, we probably want a different structure for our target object.

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

const result = map.execute(source);
console.log(result);

/*
  {
    "field": {
      "name": "name1",
      "id": "123"
    }
  }
*/
```

## Supports deep references for source and target objects

```js
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
console.log(result);

/*
  {
    "user": {
      "login": "john@someplace.com",
      "accountId": "abc123",
      "entitlements": ["game-1", "game-2"]
    }
  }
*/
```

You can also reference specific items in an array.

```js
const createMapper = require("map-factory");

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
console.log(result);

/*
{
  "topStory": {
    "id": 1,
    "title": "Top Article",
    "author": "Joe Doe",
    "body": "..."
  }
}
*/
```

More complicated transformations can be handled by providing a function.

```js
const createMapper = require("map-factory");

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

  // We don't want to include the top story
  articles.shift();

  return articles;

});

const result = map.execute(source);
console.log(result);

/*
  {
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
  }
*/
```

An existing object can be provided as the target object.

```js
const createMapper = require("map-factory");

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
console.log(result);

/*
  {
    "existing": "data",
    "field": {
        "name": "name1",
        "id": "123"
    }
  }
*/

```

## Select from multiple sources at once

You can also provide an array of source fields and they can be extracted together if you provide a transform for the target field.

```js
const createMapper = require("map-factory");

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
console.log(result);

/*
  {
    fruit: {
    count: 7
    }
  }
*/

```

## Common patterns

### Dealing with multiple sources of data

There are two ways to deal with multiple sources of data. The first method is useful when you are retrieving all of your data at once. It involves taking your source data and appending it all onto a single object.

The advantage of this method is that you can create a single transform mapping object which is used to map all of your data together and that you do not have to mutate your objects.

The other option is to decorate your existing data objects in a piece by piece fashion using the merge ability. For instance,

```js

getPost(id) {
  return Q.all([
      this.blogRepos.getPost(id),
      this.blogRepos.getPostComments(id)
    ]).
    .spread((post, comments) => this.postMapper.execute({post, comments}))
    .then(decoratePostAuthor);
}
```

And here is an example of how a service that implements this pattern could look.

```js
class BlogService {

  constructor() {
    this.blogRepos = new BlogRepositior();

    // initialise mappers
    this.postMapper = createMapper();
    this.postMapper("post.body").to("blog.post");
    this.postMapper("comments").to("blog.post.comments");
    this.postMapper("comments.topComment").to("blog.post.comments[0]");

    this.postAuthorMapper = createMapper();
    this.postAuthorMapper("user.id").to("blog.author.id");
    this.postAuthorMapper("user.name").to("blog.author.name");
    this.postAuthorMapper("user.email").to("blog.author.email");
  }

  decoratePostAuthor(post) {
    return this.blogRepos.getUser(post.author.id)
      .then(user => this.postAuthorMapper.execute(post, user));
  }

  getPost(id) {
    return Q.all([
        this.blogRepos.getPost(id),
        this.blogRepos.getPostComments(id)
      ]).
      .spread((post, comments) => this.postMapper.execute({post, comments}));
  }
}
```
