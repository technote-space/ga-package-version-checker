# Package Version Checker

[![Build Status](https://github.com/technote-space/ga-package-version-checker/workflows/Build/badge.svg)](https://github.com/technote-space/ga-package-version-checker/actions)
[![Coverage Status](https://coveralls.io/repos/github/technote-space/ga-package-version-checker/badge.svg?branch=master)](https://coveralls.io/github/technote-space/ga-package-version-checker?branch=master)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/ga-package-version-checker/badge)](https://www.codefactor.io/repository/github/technote-space/ga-package-version-checker)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/ga-package-version-checker/blob/master/LICENSE)

*Read this in other languages: [English](README.md), [日本語](README.ja.md).*

パッケージ公開前にパッケージのバージョンをチェックする GitHub Action

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [スクリーンショット](#%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88)
- [インストール](#%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB)
  - [リリースプロセスで使用](#%E3%83%AA%E3%83%AA%E3%83%BC%E3%82%B9%E3%83%97%E3%83%AD%E3%82%BB%E3%82%B9%E3%81%A7%E4%BD%BF%E7%94%A8)
  - [プッシュ時に使用](#%E3%83%97%E3%83%83%E3%82%B7%E3%83%A5%E6%99%82%E3%81%AB%E4%BD%BF%E7%94%A8)
- [オプション](#%E3%82%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%B3)
  - [BRANCH_PREFIX](#branch_prefix)
  - [COMMIT_DISABLED](#commit_disabled)
  - [COMMIT_MESSAGE](#commit_message)
  - [PACKAGE_NAME](#package_name)
  - [PACKAGE_DIR](#package_dir)
  - [TEST_TAG_PREFIX](#test_tag_prefix)
- [Action イベント詳細](#action-%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88%E8%A9%B3%E7%B4%B0)
  - [対象イベント](#%E5%AF%BE%E8%B1%A1%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88)
- [動機](#%E5%8B%95%E6%A9%9F)
- [補足](#%E8%A3%9C%E8%B6%B3)
  - [コミット](#%E3%82%B3%E3%83%9F%E3%83%83%E3%83%88)
  - [Tags](#tags)
- [Author](#author)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## スクリーンショット
1. `GitHub Action` 実行中  

   ![Running](https://raw.githubusercontent.com/technote-space/ga-package-version-checker/images/screenshot-1.png)

1. package.json のバージョンを更新 (ブランチが保護されていない場合)
  
   ![Updated](https://raw.githubusercontent.com/technote-space/ga-package-version-checker/images/screenshot-2.png)

## インストール
### リリースプロセスで使用
   例：`.github/workflows/release.yml`
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

### プッシュ時に使用
   例：`.github/workflows/check_version.yml`
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

## オプション
### BRANCH_PREFIX
ブランチプリフィックス  
default: `''`  
例：`release/`

### COMMIT_DISABLED
コミットが無効かどうか  
default: `''`

### COMMIT_MESSAGE
パッケージバージョン更新用コミットのメッセージ  
default: `'feat: Update package version'`

### PACKAGE_NAME
パッケージファイル名  
default: `'package.json'`

### PACKAGE_DIR
パッケージファイルが置かれたディレクトリ  
default: `''`

### TEST_TAG_PREFIX
テスト用タグのプリフィックス  
default: `''`  
例：`'test/'`

## Action イベント詳細
### 対象イベント
- push: *
  - tags
    - semantic versioning tag (例：`v1.2.3`)
  - branches
    - `${BRANCH_PREFIX}${tag}`
      - tag: semantic versioning tag (例：`v1.2.3`)
      - 例：branch: `release/v1.2.3`

## 動機
package.jsonバージョンの更新を忘れると、npmパッケージの公開は失敗します。

![Failed](https://raw.githubusercontent.com/technote-space/ga-package-version-checker/images/screenshot-4.png)

タグのプッシュでアクションを起動していた場合、

1. プッシュしたタグを削除
1. package.json のバージョンを更新
1. コミットして再度タグを付与
1. プッシュ

を再度行う必要があり、非常に面倒です。

この `GitHub Action` は、タグ名に基づいてpackage.jsonのバージョンを自動的に更新します。  
したがって、package.json のバージョンについて心配する必要はありません。  

また、ブランチが保護されていない場合、このアクションは変更をコミットします。  
ブランチが保護されている場合、このアクションは package.json のバージョンを更新するだけです。

## 補足
### コミット
コミットは『タグ付きのデフォルトブランチ(通常はmaster)』または『`${BRANCH_PREFIX}`から始まるブランチ』へのプッシュ時のみ有効です。

### Tags
タグ名は [Semantic Versioning](https://semver.org/) に従っている必要があります。  

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
