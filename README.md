# grizzly-pass

[![Build Status](https://travis-ci.org/p-jackson/grizzly-pass.svg?branch=master)](https://travis-ci.org/p-jackson/grizzly-pass) [![Coverage Status](https://coveralls.io/repos/github/p-jackson/grizzly-pass/badge.svg?branch=master)](https://coveralls.io/github/p-jackson/grizzly-pass?branch=master) ![Work in Progress](https://img.shields.io/badge/status-WIP-orange.svg)

A dashboard to show project health. It's a work in progress but you can see the
current state here:
[https://grizzly-pass.surge.sh](https://grizzly-pass.surge.sh)

If you drag drop a correctly formatted json file onto the page (you can find one
[here](./example/example.json)) then it will display those projects. Valid project
fields are:

- title (required, string)
- person (required, string)
- date (required, string in YYYY-MM-DD format)
- progress (required, number representing a percentage)
- health (required, one of "ontrack", "atrisk", "intervention" or "onhold")
- tags (optional, array of strings to be used as free-form tags on projects)

## Staging Server

You can see a recent build at
[https://grizzly-pass-staging.surge.sh/](https://grizzly-pass-staging.surge.sh/).

> The staging server doesn't show a good beta you can depend on, it just
> shows a recent development build from `master`.
