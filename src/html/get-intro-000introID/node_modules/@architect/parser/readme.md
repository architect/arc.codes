# <kbd>:cloud_with_lightning: @architect/parser</kbd>

> `.arc` is a simplistic text format for storing structured data; `@architect/parser` is a function that accepts text and returns a plain JavaScript `Object`

[ ![Codeship Status for arc-repos/arc-parser](https://app.codeship.com/projects/8ac91c80-4f9d-0135-36b3-22bcd0c3040e/status?branch=master)](https://app.codeship.com/projects/234098)

The format:

- Starts with a `@section`
- Sections start with `@`
- Sections contain either scalar values, `Vector` or `Map`
- Scalar values are either `String`, `Number` or `Boolean`
- `Vector` values are space seperated scalar values on a single line
- A `Map` is defined by a scalar value followed by Vectors indented two spaces
- Comments follow # symbols

### Install

  npm i arc-parser

### Example Usage

```javascript
var parser = require('arc-parser')
var fs = require('fs')
var text = fs.readFileSync('./some-arc-file.txt').toString()
var result = parse(text)
```

### Example

Input

```
# this is a comment
@section-one
simple-string-value # String
another-value 
4.2 # Number
true # Boolean

@another-section-of-vectors
vector of values 
vector tuple

@this-section-has-a-map
hello-world
  name some-value
```

Output
```javascript
{
  "section-one": [
    "simple-string-value",
    "another-value",
    4.2,
    true
  ],
  "another-section-of-vectors": [
    ["vector", "of", "values"],
    ["vector", "tuple"]
  ],
  "this-section-has-a-map": [{
    "hello-world": {
      "name": "some-value"
    }
  }]
}
```
