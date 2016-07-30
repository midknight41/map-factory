"use strict"

module.exports = exports = class BlogRepo {

  getUser(userId) {
    return new Promise((resolve, reject) => {
      process.nextTick(() => {
        return resolve({
          "id": 1,
          "name": "foo",
          "email": "foo@foobar.com"
        });
      });
    });
  }

}
