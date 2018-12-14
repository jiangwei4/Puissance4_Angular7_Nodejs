# SimpleDB.js

Simplistic Node.js database model.

## Install

> npm install --save https://github.com/lp1dev/simpledb.js.git

## Example

```javascript

const db = require('simpledb')

db.initSync('database.json') // Initialize the database

db.set('users', [{"username": "lp1", "language": "Python"}])

db.get('users') // [{"username": "lp1", "language": "Python"}]

db.write() // Write your changes to database.json
