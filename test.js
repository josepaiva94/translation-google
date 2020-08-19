const test = require('ava');

const {getCode, isSupported, translate} = require('.');

test('translate without any options', async t => {
    try {
        const result = await translate('vertaler');

        t.is(result.text, 'translator');
        t.false(result.from.language.didYouMean);
        t.is(result.from.language.iso, 'nl');
        t.false(result.from.text.autoCorrected);
        t.is(result.from.text.value, '');
        t.false(result.from.text.didYouMean);
    } catch (error) {
        t.fail(error.code);
    }
});

test('translate from auto to dutch', async t => {
    try {
        const result = await translate('translate', {from: 'auto', to: 'nl'});

        t.is(result.text, 'vertalen');
        t.false(result.from.language.didYouMean);
        t.is(result.from.language.iso, 'en');
        t.false(result.from.text.autoCorrected);
        t.is(result.from.text.value, '');
        t.false(result.from.text.didYouMean);
    } catch (error) {
        t.fail(error.code);
    }
});

test('translate some english text setting the source language as portuguese', async t => {
    try {
        const result = await translate('translator', {from: 'pt', to: 'nl'});

        t.true(result.from.language.didYouMean);
        t.is(result.from.language.iso, 'en');
    } catch (error) {
        t.fail(error.code);
    }
});

test('translate some misspelled english text to dutch', async t => {
    try {
        const result = await translate('I spea Dutch', {from: 'en', to: 'nl'});

        if (result.from.text.autoCorrected || result.from.text.didYouMean) {
            t.is(result.from.text.value, 'I [speak] Dutch');
        } else {
            t.fail();
        }
    } catch (error) {
        t.fail(error.code);
    }
});

test('translate some text and get the raw output alongside', async t => {
    try {
        const result = await translate('vertaler', {raw: true});
        t.truthy(result.raw);
    } catch (error) {
        t.fail(error.code);
    }
});

test('test a supported language – by code', t => {
    t.true(isSupported('en'));
});

test('test an unsupported language – by code', t => {
    t.false(isSupported('js'));
});

test('test a supported language – by name', t => {
    t.true(isSupported('english'));
});

test('test an unsupported language – by name', t => {
    t.false(isSupported('javascript'));
});

test('get a language code by its name', t => {
    t.is(getCode('english'), 'en');
});

test('get an unsupported language code by its name', t => {
    t.false(getCode('javascript'));
});

test('get a supported language code by code', t => {
    t.is(getCode('en'), 'en');
});

test('call getCode with \'undefined\'', t => {
    t.is(getCode(undefined), false);
});

test('call getCode with \'null\'', t => {
    t.is(getCode(null), false);
});

test('call getCode with an empty string', t => {
    t.is(getCode(''), false);
});

test('call getCode with no arguments', t => {
    t.is(getCode(), false);
});

test('try to translate from an unsupported language', async t => {
    try {
        await translate('something', {from: 'js', to: 'en'});
        t.fail();
    } catch (error) {
        t.is(error.code, 400);
        t.is(error.message, 'The language \'js\' is not supported');
    }
});

test('try to translate to an unsupported language', async t => {
    try {
        await translate('something', {from: 'en', to: 'js'});
        t.fail();
    } catch (error) {
        t.is(error.code, 400);
        t.is(error.message, 'The language \'js\' is not supported');
    }
});

test('translate from dutch to english using language names instead of codes', async t => {
    try {
        const result = await translate('iets', {from: 'dutch', to: 'english'});
        t.is(result.from.language.iso, 'nl');
        t.is(result.text, 'something');
    } catch (error) {
        t.fail(error.code);
    }
});
