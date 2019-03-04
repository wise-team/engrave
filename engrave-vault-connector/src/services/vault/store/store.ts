const secrets = require('@cloudreach/docker-secrets');

var options = {
    apiVersion: 'v1',
    endpoint: 'http://vault:8200',
    token: secrets.VAULT_TOKEN
};

var store = require("node-vault")(options);

export default store;