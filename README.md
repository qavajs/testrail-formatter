## @qavajs/testrail-service
This package is formatter for Test Rail

### install
`npm install @qavajs/testrail-service

### configuration

add formatter to config.js
```javascript
module.exports = {
    default: {
        format: [
            '@qavajs/testrail-service'
        ],
        formatOptions: {
            trConfig: {
                baseURL: 'https://you-baseURL.testrail.io/',
                userName: 'your user name',
                pass: 'your password',
                runId: 'run ID in test rail'
            },
        }
    }
}
```
