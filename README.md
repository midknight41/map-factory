# map-factory
A simple utility to map data from an existing object to a new one. This is an alternative interface for the excellent [object-mapper](http://www.npmjs.com/object-mapper).

### Map a source field to the same object structure
Mapping is explicit so unmapped fields are discarded.

```js
const createMapper = require("map-factory");

const source = {
  "fieldName": "name1",
  "fieldId": "123",
  "fieldDescription": "description"
};

const map = createMapper(source);

map("fieldName");
map("fieldId");

const result = map.execute();
console.log(result);

/*
  {
    "fieldName": "name1",
    "fieldId": "123"
  }
*/
```

### Map a source field to a different object structure  
Of course, we probably want a different structure for our target object.

```js
const createMapper = require("map-factory");

const source = {
  "fieldName": "name1",
  "fieldId": "123",
  "fieldDescription": "description"
};

const map = createMapper(source);

map("fieldName").to("field.name");
map("fieldId").to("field.id");

const result = map.execute();
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
### Supports deep references for source and target objects  

```js
const createMapper = require("map-factory");

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

const map = createMapper(source);

map("person.email").to("user.login");
map("account.id").to("user.accountId");
map("account.entitlements.[].name").to("user.entitlements");

const result = map.execute();
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

   const map = createMapper(source);

   map("articles.[0]").to("topStory");

   const result = map.execute();
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

    const map = createMapper(source);

    map("articles.[0]").to("topStory");
    map("articles").to("otherStories", articles => {

      // We don't want to include the top story
      articles.shift();

      return articles;

    });

    const result = map.execute();
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

### Select from multiple sources at once
You can also provide an array or source fields and they can be extracted together. You must provide a transform for the target field.
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

const map = createMapper(source);

map(["apples.count", "oranges.count"]).to("fruit.count", (appleCount, orangeCount) => {

  return appleCount + orangeCount;

});

const result = map.execute();
console.log(result);

/*
  {
    fruit: {
    count: 7
    }
  }
*/

```
