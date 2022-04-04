var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: '127.0.0.1:900',
    log: 'trace',
    apiVersion: '7.16.0', // use the same version of your Elasticsearch instance
});

client.ping({
    requestTimeout: 1000
}, (error) => {
    if (error) {
        console.trace('elasticsearch cluster is down!');
    } else {
        console.log('All is well');
    }
});

module.exports = client;
