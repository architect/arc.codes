# `preferences.arc`

## Set environment variables

You can set environment variables for your project by using the [`arc env` CLI command](/reference/cli/env). This CLI command will generate a `preferences.arc` *(or `pref.arc` if you prefer)* file inside the root of your project that handles the environment variables for the three different stages of your development environment.


- `@testing` (local)
- `@staging`
- `@production`

> `preferences.arc` replaces the now deprecated `.arc-env` file.

## Example

An example `preferences.arc` file in the root of your project to load environment variables locally in the sandbox. 


```arc
@testing
FOO 1

@staging
FOO 2

@production
FOO 3
```

---

