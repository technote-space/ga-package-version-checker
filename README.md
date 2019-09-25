# Package Version Checker

[![Build Status](https://github.com/technote-space/ga-package-version-checker/workflows/Build/badge.svg)](https://github.com/technote-space/ga-package-version-checker/actions)
[![Coverage Status](https://coveralls.io/repos/github/technote-space/ga-package-version-checker/badge.svg?branch=master)](https://coveralls.io/github/technote-space/ga-package-version-checker?branch=master)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/ga-package-version-checker/badge)](https://www.codefactor.io/repository/github/technote-space/ga-package-version-checker)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/ga-package-version-checker/blob/master/LICENSE)

*Read this in other languages: [English](README.md), [日本語](README.ja.md).*

GitHub Action to check package version before publish.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Screenshots](#screenshots)
- [Installation](#installation)
  - [Used in the release process](#used-in-the-release-process)
  - [Used when push](#used-when-push)
- [Options](#options)
  - [BRANCH_PREFIX](#branch_prefix)
  - [COMMIT_DISABLED](#commit_disabled)
  - [COMMIT_MESSAGE](#commit_message)
  - [PACKAGE_NAME](#package_name)
  - [PACKAGE_DIR](#package_dir)
  - [TEST_TAG_PREFIX](#test_tag_prefix)
- [Action event details](#action-event-details)
  - [Target events](#target-events)
- [Motivation](#motivation)
- [Addition](#addition)
  - [Commit](#commit)
  - [Tags](#tags)
- [Author](#author)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Screenshots
1. Running `GitHub Action`  

   ![Running](https://raw.githubusercontent.com/technote-space/ga-package-version-checker/images/screenshot-1.png)

1. Updated version of package.json and commit (if branch is not protected)  

   ![Updated](https://raw.githubusercontent.com/technote-space/ga-package-version-checker/images/screenshot-2.png)

## Installation
### Used in the release process
   e.g. `.github/workflows/release.yml`
   ```yaml
   on:
     push:
       tags:
         - 'v*'
   name: Publish Package
   jobs:
     release:
       name: Publish Package
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@master
           with:
             fetch-depth: 3

         # Use this GitHub Action
         - name: Check package version
           uses: technote-space/ga-package-version-checker@v1
           with:
             GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

         - name: Install Package dependencies
           run: yarn install
         - name: Build
           run: yarn build
         - name: Publish
           uses: actions/npm@master
           env:
             NPM_AUTH_TOKEN: ${{ secrets.NPM_AUTH_TOKEN }}
           with:
             args: publish
   ```

### Used when push
   e.g. `.github/workflows/check_version.yml`
   ```yaml
   on: push
   name: Check package version
   jobs:
     checkVersion:
       name: Check package version
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v1
           with:
             fetch-depth: 3

         # Use this GitHub Action
         - name: Check package version
           uses: technote-space/ga-package-version-checker@v1
           with:
             GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
             BRANCH_PREFIX: release/
   ```

## Options
### BRANCH_PREFIX
Branch name prefix.  
default: `''`  
e.g. `release/`

### COMMIT_DISABLED
Whether commit is disabled.  
default: `''`

### COMMIT_MESSAGE
Commit message of update package version commit.  
default: `'feat: Update package version'`

### PACKAGE_NAME
Package file name.  
default: `'package.json'`

### PACKAGE_DIR
Package directory.  
default: `''`

### TEST_TAG_PREFIX
Prefix for test tag.  
default: `''`  
e.g. `'test/'`

## Action event details
### Target events
- push: *
  - tags
    - semantic versioning tag (e.g. `v1.2.3`)
  - branches
    - `${BRANCH_PREFIX}${tag}`
      - tag: semantic versioning tag (e.g. `v1.2.3`)
      - e.g. branch: `release/v1.2.3`

## Motivation
If you forget to update the package.json version, publishing the npm package will fail.  

![Failed](https://raw.githubusercontent.com/technote-space/ga-package-version-checker/images/screenshot-4.png)

If you are invoking an action by pushing a tag, you have to do following steps again.

1. Delete pushed tag
1. Update package.json version
1. Commit and tag again
1. Push

This is very troublesome.

This `GitHub Action` updates the version in package.json based on the tag name automatically.  
So you don't have to worry about the version in package.json.  

This action also commits the change if the branch is not protected.  
If the branch is protected, this action just update the version in package.json.  

![Not commit](https://raw.githubusercontent.com/technote-space/ga-package-version-checker/images/screenshot-3.png)

## Addition
### Commit
Commit is valid when pushing to `default branch with tag` or `branch starting with ${BRANCH_PREFIX}`.

### Tags 
Tag name format must be [Semantic Versioning](https://semver.org/).  

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
