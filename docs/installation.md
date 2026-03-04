---
title: Promptfoo'yu Yükleme
description: npm, npx veya Homebrew kullanarak promptfoo'yu nasıl yükleyeceğinizi öğrenin. Promptfoo'yu komut satırı kullanımı için veya projenizde bir kütüphane olarak ayarlayın.
keywords: [yükleme, kurulum, npm, npx, homebrew, windows, yapılandırma, promptfoo]
sidebar_position: 4
---

import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Kurulum

[npm](https://nodejs.org/en/download), [npx](https://nodejs.org/en/download) veya [Homebrew](https://brew.sh) (Mac, Linux) kullanarak promptfoo'yu yükleyin:

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
npm ve npx, [Node.js](https://nodejs.org/en/download) 20.20+ veya 22.22+ gerektirir.
:::

Promptfoo'yu projenizde bir kütüphane olarak kullanmak için `npm install promptfoo --save` komutunu çalıştırın.

## Kurulumu Doğrulama

Promptfoo'nun doğru şekilde yüklendiğini doğrulamak için şunu çalıştırın:

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

Bu, promptfoo'nun mevcut sürüm numarasını göstermelidir.

## Promptfoo'yu Çalıştırma

Kurulumdan sonra, promptfoo'yu çalıştırarak kullanmaya başlayabilirsiniz:

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

Bu, `promptfooconfig.yaml` dosyası oluşturma sürecinde size rehberlik edecektir.

İlk değerlendirmenizi çalıştırmak için bir kılavuz için lütfen [Başlarken rehberimize](./getting-started.md) bakın.

## Ayrıca Bakınız

- [Başlarken](./getting-started.md)
- [Sorun Giderme](./usage/troubleshooting.md)
- [Katkıda Bulunma](./contributing.md)