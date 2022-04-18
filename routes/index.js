var express = require('express');
var router = express.Router();
const axios = require('axios');
const {log} = require("debug");
const { randomUUID } = require('crypto');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Maica App'});
});

router.post('/PRODA-produce-OAuth', function (req, res, next) {

    let domain = req.body.mode === 'Live' ? 'https://proda.humanservices.gov.au' : 'https://vnd.proda.humanservices.gov.au';

    let clientId = req.body.clientId;
    let assertion = req.body.assertion;

    let endpoint = domain + '/mga/sps/oauth/oauth20/token';

    let body = `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&client_id=${clientId}&assertion=${assertion}`

    axios({
        method: 'post',
        url: endpoint,
        data: body,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(resp => {
            res.send(resp.data)
        })
        .catch(error => {
            console.error(error)
            res.send(error.response.data)
        })

});

router.post('/PRODA-activate-device', function (req, res, next) {

    let domain = req.body.mode === 'Live' ? 'https://5.rsp.humanservices.gov.au' : 'https://test.5.rsp.humanservices.gov.au';

    let endpoint = domain + '/piaweb/api/b2b/v1' +
        (req.body.isRefresh === 'true' ? ('/orgs/' + req.body.orgId) : '') +
        '/devices/' + req.body.deviceName + '/jwk'

    let headers = {
        'Content-Type': 'application/json',
        'dhs-auditId': req.body.orgId,
        'dhs-auditIdType': 'http://ns.humanservices.gov.au/audit/type/proda/organisation',
        'dhs-subjectId': req.body.deviceName,
        'dhs-subjectIdType': 'http://ns.humanservices.gov.au/audit/type/proda/device',
        'dhs-messageId': 'urn:uuid:' + randomUUID(),
        'dhs-correlationId': 'uuid:' + randomUUID(),
        'dhs-productId': 'Maica-Salesforce' + (req.body.mode != 'Live' ? '-Sandbox' : '')
    }

    let data = {
        'kty': 'RSA',
        'e': 'AQAB',
        'use': 'sig',
        'kid': req.body.deviceName,
        'alg': 'RS256',
        'n': req.body.publicKey
    }

    let body;

    if(req.body.isRefresh === 'true'){
        body = data;
    } else {
        body = {
            'orgId': req.body.orgId,
            'otac': req.body.activationCode,
            'key': data
        }
    }

    axios({
        method: 'put',
        url: endpoint,
        data: body,
        headers: headers
    })
        .then(resp => {
            res.send(resp.data)
        })
        .catch(error => {
            console.error(error)
            res.send(error.response.data)
        })

});

module.exports = router;
