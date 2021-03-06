# translation-google [adapted from Wilson Wu's package](https://github.com/wilsonwu/translation-google)
<a href="https://www.npmjs.com/package/@paiva/translation-google"><img src="https://img.shields.io/npm/dt/@paiva/translation-google.svg" alt="Downloads"></a>
<a href="https://www.npmjs.com/package/@paiva/translation-google"><img src="https://img.shields.io/npm/v/@paiva/translation-google.svg" alt="Version"></a>
<a href="https://www.npmjs.com/package/@paiva/translation-google"><img src="https://img.shields.io/npm/l/@paiva/translation-google.svg" alt="License"></a>
[![Coverage Status](https://coveralls.io/repos/github/josepaiva94/translation-google/badge.svg?branch=master)](https://coveralls.io/github/josepaiva94/translation-google?branch=master)

A Google Translate API:

## Features 

- Translate all languages that Google Translate supports.
- Support different area (Support Chinese user, in China Mainland could set the suffix to `'cn'` to make it work)
- Support for proxy agents

## Live Demo with Nodejs
[![Edit translation-google-demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/paiva-translation-google-demo-137ds)

## Install 

```
npm install translation-google
```

## Usage

From automatic language detection to Chinese:

``` js
const {translate} = require('@paiva/translation-google');

translate('This is Google Translate', {to: 'zh-cn'}).then(res => {
    console.log(res.text);
    //=> 这是Google翻译
    console.log(res.from.language.iso);
    //=> en
}).catch(err => {
    console.error(err);
});
```

For Chinese user, try this:

``` js
const {translate} = require('@paiva/translation-google');

translate('This is Google Translate', {to: 'zh-cn', suffix: 'cn'}).then(res => {
    console.log(res.text);
    //=> 这是Google翻译
    console.log(res.from.language.iso);
    //=> en
}).catch(err => {
    console.error(err);
});
```

Sometimes, the API will not use the auto corrected text in the translation:

``` js
translate('This is Google Translat', {from: 'en', to: 'zh-cn'}).then(res => {
    console.log(res);
    console.log(res.text);
    //=> 这是Google翻译
    console.log(res.from.text.autoCorrected);
    //=> false
    console.log(res.from.text.value);
    //=> This is Google [Translate]
    console.log(res.from.text.didYouMean);
    //=> true
}).catch(err => {
    console.error(err);
});
```

Proxying requests through Tor rotator to overcome quota limit:

``` bash
# use docker image for Tor cluster
docker run -d -p 5566:5566 -p 4444:4444 --env tors=25 mattes/rotating-proxy
```

``` js
const {translate} = require('@paiva/translation-google');
const {HttpsProxyAgent} = require('https-proxy-agent');

translate('This is Google Translate', {
    to: 'zh-cn',
    agent: new HttpsProxyAgent('http://localhost:8118')
}).then(res => {
    console.log(res.text);
    //=> 这是Google翻译
    console.log(res.from.language.iso);
    //=> en
}).catch(err => {
    console.error(err);
});
```

## API

### translate(text, options)

#### text

Type: `string`

The text to be translated

#### options

Type: `object`

##### suffix

Type: `string` Default: `com`

The TLD to use. By default, it is `com`, but a Chinese user, in China Mainland, could set the suffix to `'cn'` to make it work.

##### from

Type: `string` Default: `auto`

The `text` language. Must be `auto` or one of the codes/names (not case sensitive) contained in [languages.js](https://github.com/matheuss/google-translate-api/blob/master/languages.js)

##### to

Type: `string` Default: `en`

The language in which the text should be translated. Must be one of the codes/names (not case sensitive) contained in [languages.js](https://github.com/matheuss/google-translate-api/blob/master/languages.js).

##### raw

Type: `boolean` Default: `false`

If `true`, the returned object will have a `raw` property with the raw response (`string`) from Google Translate.

##### agent

Type: `object` Default: `undefined`

An object representing `http`, `https` and `http2` keys for `http.Agent`, `https.Agent` and `http2wrapper.Agent` instance. This allows to proxy the requests.

### Returns an `object`:

- `text` *(string)* – The translated text.
- `from` *(object)*
  - `language` *(object)*
    - `didYouMean` *(boolean)* - `true` if the API suggest a correction in the source language
    - `iso` *(string)* - The [code of the language](https://github.com/matheuss/google-translate-api/blob/master/languages.js) that the API has recognized in the `text`
  - `text` *(object)*
    - `autoCorrected` *(boolean)* – `true` if the API has auto corrected the `text`
    - `value` *(string)* – The auto corrected `text` or the `text` with suggested corrections
    - `didYouMean` *(booelan)* – `true` if the API has suggested corrections to the `text`
- `raw` *(string)* - If `options.raw` is true, the raw response from Google Translate servers. Otherwise, `''`.

Note that `res.from.text` will only be returned if `from.text.autoCorrected` or `from.text.didYouMean` equals to `true`. In this case, it will have the corrections delimited with brackets (`[ ]`):

``` js
translate('This is Google Translat').then(res => {
    console.log(res.from.text.value);
    //=> This is [Google Translate]
}).catch(err => {
    console.error(err);
});
```
Otherwise, it will be an empty `string` (`''`).

## License

MIT
