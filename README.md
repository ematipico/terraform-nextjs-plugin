# Terraform nextjs plugin

<p align="center">
	<img height=200 src="https://www.ongraph.com/wp-content/uploads/2018/02/nextjs_icon.png" width=200 />
	<img height=200 src="https://avatars0.githubusercontent.com/u/11051457?v=3&s=280" width=200 />
</p>

A plugin to generate terraform configuration from nextjs pages

[![Build Status](https://myburning.visualstudio.com/terraform-nextjs-plugin/_apis/build/status/ematipico.terraform-nextjs-plugin?branchName=master)](https://myburning.visualstudio.com/terraform-nextjs-plugin/_build/latest?definitionId=1&branchName=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/f77ac77e550449ffb821cd6e7cc4fd72)](https://www.codacy.com/app/ematipico/terraform-nextjs-plugin?utm_source=github.com&utm_medium=referral&utm_content=ematipico/terraform-nextjs-plugin&utm_campaign=Badge_Grade)

## The reason

Nextjs supports serverless pages, where it creates files that can be used by some lambdas to render the pages.
Unfortunately, here you are left alone. So here a solution for your troubles.

## Installation

```bash
npm i --save-dev @ematipico/terraform-nextjs-plugin
```

Or

```bash
yarn add --dev @ematipico/terraform-nextjs-plugin
```

## Usage

```js
const { generateResources } = require("@ematipico/terraform-nextjs-plugin");

const configuration = {
  gatewayKey: "AmazingWebsite",
  lambdaPath: "../../project/build",
  routes: [
    {
      prefix: "home",
      mappings: [
        {
          page: "/content", // physical name of the nextjs page
          route: "/beautiful-content" // the url of the page
        },
        {
          page: "/content", // physical name of the nextjs page
          route: "/beautiful-content", // the url of the page
          params: {
            myParam: false // it is not mandatory
          }
        }
      ]
    },
    {
      prefix: "blog",
      mappings: [
        {
          page: "/list",
          route: "/blog-list"
        },
        {
          page: "/singlePost",
          route: "/blog-list/article/:url"
        }
      ]
    }
  ]
};

const resources = generateResources(configuration); // inside resources you have the terraform json configuration
```

## Configuration

| Name         | Type                     | Description                                                                                                                                                                 |
| ------------ | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gatewayKey` | `string`                 | A name that will be prefixed to your resources. Usually it's the project name. Default value is `Terranext`.                                                                |
| `lambdaPath` | `string`                 | This is the path where the lambdas really are. Usually you will run `terraform` CLI from a different project/folder. So you need to tell `terraform` where these files are. |
| `routes`     | `Array<Mapping>|Mapping` | This is the structure of the routes that describe your pages.                                                                                                               |

### Mapping explained

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
