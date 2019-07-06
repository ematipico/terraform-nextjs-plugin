# Terraform nextjs plugin

<p align="center">
  <img height=200 src="https://www.ongraph.com/wp-content/uploads/2018/02/nextjs_icon.png" width=200 />
  <img height=200 src="https://avatars0.githubusercontent.com/u/11051457?v=3&s=280" width=200 />
</p>

A plugin to generate terraform configuration from nextjs pages

[![Build Status][build-status-azure]][build-status-azure-url]
[![Codacy Badge][code-quality]][code-quality-url]
[![npm][npm]][npm-url]
[![Conventional Commits][conventional]][conventional-url]
[![codecov][coverage]][coverage-url]

## The reason

Nextjs supports serverless pages, where it creates files that can be used by some lambdas to render the pages.
Unfortunately, here you are left alone. So here a solution for your troubles.

- [Installation](#installation)
- [Usage](#usage)
  - [Via CLI](#via-cli)
  - [Via API](#via-api)
- [Configuration](#configuration)
  - [Mapping explained](#mapping-explained)
- [Providers](#providers)
  - [AWS](#aws)

## Installation

```bash
npm i --save-dev @ematipico/terraform-nextjs-plugin
```

Or

```bash
yarn add --dev @ematipico/terraform-nextjs-plugin
```

**This package requires at least Next v8.**

## Usage

This library supports [cosmiconfig](https://github.com/davidtheclark/cosmiconfig): you just need to have a file called `terranextrc` that matches the criteria. This repository has [one](./terranextrc).

_**At the moment, the library assumes that you already run `next build` inside your project.**_

### Via CLI

You can use the simple CLI available. At moment you *can't* pass the `routes` parameter, you will need to use the config object or use the [API](#via-api).

Using the CLI will automatically emit the configuration files.

_**Arguments passed via CLI will *override* the ones that are defined inside the config file**_.

```bash
terranext --provider=AWS --gateway-key=CustomKey --next-dir-app=../../nextjs-project/
```

Or you can use the aliases:

```bash
terranext --provider=AWS -g=CustomKey -p=../../nextjs-project/
```

### Help section

```block

Usage
  $ terranext

Options
  --gateway-key, -g   The API Gateway key of the project. Default is "Terranext"
  --next-app-dir, -d  The path that Terraform CLI has to follow to reach the nextjs project.
  --provider          The Cloud provider to use when exporting the configuration

Examples
  $ terranext
  $ terranext --gateway-key=CustomKey --next-app-dir=../../nextjs-project/
  $ terranext --provider=AWS --next-app-dir=../../nextjs-project/
  $ terranext -g=CustomKey -d=../../nextjs-project/
```

### Via API

```js
const generateResources = require("@ematipico/terraform-nextjs-plugin");

const configuration = {
  gatewayKey: "AmazingWebsite",
  lambdaPath: "../../project/build",
  provider: "AWS"
};

const resources = generateResources(configuration); // inside resources you have the terraform json configuration
generateResources(configuration, true) // it creates two files
```

If the second argument is a boolean and it's `true`, the library will create two files:

- `gateway.terraform.tf.json`
- `lambdas.terraform.tf.json`

Having a suffix with `.tf.` will tell automatically to `terraform` that should be validated and planned.
It will be up to you to consume them in a proper way.

## Configuration

| Name         | Type                     | Description                                                                                                                                                                 |
| ------------ | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gatewayKey` | `string`                 | A name that will be prefixed to your resources. Usually it's the project name. Default value is `Terranext`.                                                                |
| `provider` | `string` | The Cloud Provider. Based on the value, a different configuration will be exported. Supported providers: `AWS` |
| `nextDirApp` | `string`                 | This is the path where the lambdas really are. Usually you will run `terraform` CLI from a different project/folder. So you need to tell `terraform` where these files are. |
| `routes`     | `Array<Mapping>`, `Mapping` | This is the structure of the routes that describe your pages.                                                                                                               |

### Mapping explained

These mappings are only needed if you have custom routes. If you don't, `routes` is not needed as this library is able to create mappings from the files that Nextjs generates.

Let's say we want to describe the following URLs:

- `/about-us/contacts`
- `/about-us/the-company`
- `/blog/first-blog-post`
- `/blog/second-blog-post`
- `/credits?hideComments`: here, `hideComments` is not mandatory. If it is mandatory, it will be marked `true` in the configuration

```js
const routes = [
  {
    prefix: "/about-us",
    mappings: [
      {
        route: "/contacts", // the URL
        page: "/companyContacts" // the nextjs file, inside pages folder, that is responsible to render this page
      },
      {
        route: "/the-company",
        page: "/aboutTheCompany"
      }
    ]
  },
  {
    prefix: "",
    mappings: [
      {
        route: "/blog/:url",
        page: "/blogPost"
      },
      {
        route: "/credits",
        page: "/credits",
        params: {
          hideComments: false
        }
      }
    ]
  }
];
```

## Providers

At the moment the project supports only AWS but it's up to support more providers in the future.

### AWS

Once you generate the resource files, you will need to consume them. Also, you will need to create the following resource:

```hcl
resource "aws_api_gateway_rest_api" "CustomKey" {
  name        = "WebApi"
  description = "Web API"
}

locals {
  groupname = "WebApi"
  lambda_iam_role = "arn:aws:iam::202020202020:role/lambda_execution_role"
  aws_region = "${data.aws_region.current.name}"
}
```

Please check the [integration](/integration/aws/api.tf) testing to see how to consume the configuration.

[build-status-azure]: https://myburning.visualstudio.com/terraform-nextjs-plugin/_apis/build/status/ematipico.terraform-nextjs-plugin?branchName=master
[build-status-azure-url]: https://myburning.visualstudio.com/terraform-nextjs-plugin/_build/latest?definitionId=1&branchName=master
[npm]: https://img.shields.io/npm/v/@ematipico/terraform-nextjs-plugin.svg
[npm-url]: https://www.npmjs.com/package/@ematipico/terraform-nextjs-plugin
[code-quality]: https://api.codacy.com/project/badge/Grade/f77ac77e550449ffb821cd6e7cc4fd72
[code-quality-url]: https://www.codacy.com/app/ematipico/terraform-nextjs-plugin?utm_source=github.com&utm_medium=referral&utm_content=ematipico/terraform-nextjs-plugin&utm_campaign=Badge_Grade
[conventional]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-green.svg
[conventional-url]: https://conventionalcommits.org
[coverage]: https://codecov.io/gh/ematipico/terraform-nextjs-plugin/branch/master/graph/badge.svg
[coverage-url]: https://codecov.io/gh/ematipico/terraform-nextjs-plugin
