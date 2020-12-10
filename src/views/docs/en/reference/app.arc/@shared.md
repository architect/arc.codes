---
title: '@shared'
description: Configure src/shared code
---

`@shared` pragma allows you to configure the location of shared code to copy into functions for deployment

### Syntax

- Lowercase alphanumeric string
- Maximum of 20 characters
- Dashes are allowed; underscores are not allowed
- Must begin with a letter

### Example

This `app.arc` file:

```arc
@app
testapp

@shared
src path/to/code
```

```json
{
  "app": "myapp",
  "shared": {
    "src": "path/to/code"
  }
}
```

```yaml
app: myapp
shared:
  - src: path/to/code
```

