# Static

Get the URL of a static asset

---

Install runtime helpers for Node

```bash
cd path/to/lambda
npm init -f
npm install @architect/functions
```

Install runtime helpers for Ruby

```bash
cd path/to/lambda
bundle init
bundle install --path vendor/bundle
bundle add architect-functions
```

Install runtime helpers for Python

```bash
cd path/to/lambda
pip install --target ./vendor architect-functions
```

---

## Get the URL for an asset on S3

Node

```javascript
let arc = require('@achitect/functions')

let avatar = arc.static('/avatar')
```

Ruby

```ruby
require 'architect/functions'

avatar = Arc.static '/avatar'
```

Python

```python
import arc.static

avatar = arc.static('/avatar')
```

---
