var express = require('express');
var router = express.Router();
const axios = require('axios');
const {log} = require("debug");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Maica App'});
});

router.post('/produceOAuthProduceOAuth', function (req, res, next) {

    let domain = req.body.mode === 'live' ? 'https://proda.humanservices.gov.au' : 'https://vnd.proda.humanservices.gov.au';

    let clientId = req.body.clientId;
    let assertion = req.body.assertion;

    let endpoint = domain + '/mga/sps/oauth/oauth20/token';

    let body = `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&client_id=${clientId}&assertion=${assertion}`

    console.log(body);

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
            res.send(error)
        })

});

/*
req.setMethod('PUT');

        req.setEndpoint(
            settings.Device_Activation_Endpoint__c +
                '/piaweb/api/b2b/v1' +
                (isRefresh == true ? ('/orgs/' + settings.Organisation_ID__c) : '') +
                '/devices/' + settings.Device_Name__c + '/jwk'
        );

        req.setHeader('Content-Type', 'application/json');
        req.setHeader('dhs-auditId', settings.Organisation_ID__c);
        req.setHeader('dhs-auditIdType', 'http://ns.humanservices.gov.au/audit/type/proda/organisation');
        req.setHeader('dhs-subjectId', settings.Device_Name__c);
        req.setHeader('dhs-subjectIdType', 'http://ns.humanservices.gov.au/audit/type/proda/device');
        req.setHeader('dhs-messageId', 'urn:uuid:' + vertic_Utils.strings.newUuid());
        req.setHeader('dhs-correlationId', 'uuid:' + vertic_Utils.strings.newUuid());
        req.setHeader('dhs-productId', 'Maica-Salesforce' + (vertic_Utils.orgs.isSandbox() ? '-Sandbox' : ''));

        vertic_DTO keyDTO = new vertic_DTO();
        keyDTO.put('kty', 'RSA');
        keyDTO.put('e', 'AQAB');
        keyDTO.put('use', 'sig');
        keyDTO.put('kid', settings.Device_Name__c);
        keyDTO.put('alg', 'RS256');
        keyDTO.put('n', settings.Public_Key__c);

        vertic_DTO requestDTO = new vertic_DTO();
        if (isRefresh == true) {
            requestDTO = keyDTO;
        } else {
            requestDTO.put('orgId', settings.Organisation_ID__c);
            requestDTO.put('otac', settings.Device_Activation_Code__c);
            requestDTO.put('key', keyDTO.getMap());
        }

 */

module.exports = router;
