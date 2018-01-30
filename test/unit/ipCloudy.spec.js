/* global require */

import test from 'ava'
import { keys } from 'lodash'
const flatCache = require('flat-cache')
const IpCloudy = require('../../src/ipCloudy.js')

test.beforeEach(t => {
    t.context.ipc = new IpCloudy()
    t.context.ipc.init()
})
test('constructor() | does not fail', t => {
    new IpCloudy()
    t.pass()
    // flatCache.clearAll()
})

test('init() | saves values to cache', async t => {
    let ipc = new IpCloudy()
    await ipc.init()

    let k = keys(ipc.cidrRangeCache.all())
    t.deepEqual(k, ['gce', 'aws', 'azure'])
})

test.todo('init() | uses saved to file cache if present')

test.todo('init() | saves new values to cache even with file when overriden')

test('check() | returns appropriate response for azure ip', async t => {
    let result = await t.context.ipc.check('13.70.64.1')
    t.is(result, 'azure')
})

test('check() | returns appropriate response for aws ip', async t => {
    let result = await t.context.ipc.check('54.173.231.161')
    t.is(result, 'aws')
})

test('check() | returns appropriate response for gce ip', async t => {
    let result = await t.context.ipc.check('104.196.27.39')
    t.is(result, 'gce')
})

test('check() | falls back to whois organization when enabled', async t => {
    let ipc = new IpCloudy({ whoisFallback: { enabled: true } })
    ipc.init()
    let result = await ipc.check('208.43.118.0')
    t.is(result, 'SoftLayer Technologies Inc. (SOFTL)')
})

test('check() | returns "unknown" if ip is not recognized', async t => {
    let result = await t.context.ipc.check('999.999.999.999')
    t.is(result, 'unknown')
})