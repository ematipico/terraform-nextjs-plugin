# Terraform nextjs plugin

A plugin to generate terraform configuration from nextjs pages

[![Build Status](https://myburning.visualstudio.com/terraform-nextjs-plugin/_apis/build/status/ematipico.terraform-nextjs-plugin?branchName=master)](https://myburning.visualstudio.com/terraform-nextjs-plugin/_build/latest?definitionId=1&branchName=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/f77ac77e550449ffb821cd6e7cc4fd72)](https://www.codacy.com/app/ematipico/terraform-nextjs-plugin?utm_source=github.com&utm_medium=referral&utm_content=ematipico/terraform-nextjs-plugin&utm_campaign=Badge_Grade)

## The reason

Nextjs supports serverless pages, where it creates files that can be used by some lambdas to render the pages.
Unfortunately, here you are left alone. So here a solution for your troubles.

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
          page: "/content?queryParam", // physical name of the nextjs page
          route: "/beautiful-content" // the url of the page
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

const resources = generateResources(configuration) // inside resources you have the terraform json configuration
```
