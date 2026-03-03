---
title: "Promptfoo'yu Yükleme"
description: "`npm`, `npx` veya Homebrew kullanarak `promptfoo` nasıl yükleneceğini öğrenin. Komut satırında kullanım veya projenizde bir kütüphane olarak kurulum adımları."
keywords: [kurulum, yükleme, npm, npx, homebrew, windows, kurulum, promptfoo]
sidebar_position: 4
---

import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Yükleme

`promptfoo`'yu [npm](https://nodejs.org/en/download), [npx](https://nodejs.org/en/download) veya [Homebrew](https://brew.sh) ile (Mac, Linux) yükleyin:

<Tabs groupId="promptfoo-command">
  <TabItem value="npm" label="npm" default>
    ```bash
    npm install -g promptfoo
    ```
  </TabItem>
  <TabItem value="npx" label="npx">
    ```bash
    npx promptfoo@latest
    ```
  </TabItem>
  <TabItem value="brew" label="brew">
    ```bash
    brew install promptfoo
    ```
  </TabItem>
</Tabs>

:::note
`npm` ve `npx` için [Node.js](https://nodejs.org/en/download) 20.20+ veya 22.22+ gereklidir.
:::

`promptfoo`'yu projenizde bir kütüphane olarak kullanmak için şu komutu çalıştırın: `npm install promptfoo --save`.

## Yüklemeyi Doğrulama

`promptfoo`'nun doğru şekilde yüklendiğini doğrulamak için şu komutu çalıştırın:

<Tabs groupId="promptfoo-command">
  <TabItem value="npm" label="npm" default>
    ```bash
    promptfoo --version
    ```
  </TabItem>
  <TabItem value="npx" label="npx">
    ```bash
    npx promptfoo@latest --version
    ```
  </TabItem>
  <TabItem value="brew" label="brew">
    ```bash
    promptfoo --version
    ```
  </TabItem>
</Tabs>

Bu komut `promptfoo`'nun yüklü sürüm numarasını göstermelidir.

## Promptfoo'yu Çalıştırma

Yüklemeden sonra `promptfoo` kullanmaya başlamak için şu komutları çalıştırabilirsiniz:

<Tabs groupId="promptfoo-command">
  <TabItem value="npm" label="npm" default>
    ```bash
    promptfoo init
    ```
  </TabItem>
  <TabItem value="npx" label="npx">
    ```bash
    npx promptfoo@latest init
    ```
  </TabItem>
  <TabItem value="brew" label="brew">
    ```bash
    promptfoo init
    ```
  </TabItem>
</Tabs>

Bu, `promptfooconfig.yaml` dosyasını oluşturma sürecinde size adım adım rehberlik edecektir.

İlk değerlendirmenizi çalıştırma rehberi için [Başlarken](./getting-started.md) sayfasına bakın.

## Ayrıca bakınız

- [Başlarken](./getting-started.md)
- [Sorun Giderme](./usage/troubleshooting.md)
- [Katkıda Bulunma](./contributing.md)