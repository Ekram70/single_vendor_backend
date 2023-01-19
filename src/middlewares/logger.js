const logger = require('morgan');
const fs = require('fs');
const path = require('path');

logger.token('origin', (req) => req.headers.origin);
logger.token('error', (req) => req.error.name);
logger.token('message', (req) => req.error.name);

const logAccessToFile = logger(
    '[:date[web]] \t :remote-addr \t :method \t :url \t HTTP/:http-version \t :status \t :origin',
    {
        stream: fs.createWriteStream(path.join(__dirname, '..', '..', 'logs', 'access.txt'), {
            flags: 'a'
        })
    }
);

const logToConsole = logger('[:date[iso]] - :method - :url - :status - :origin');

const logErrorToFile = logger('[:date[web]] \t :error \t :message', {
    stream: fs.createWriteStream(path.join(__dirname, '..', '..', 'logs', 'error.txt'), {
        flags: 'a'
    })
});

module.exports = {
    logAccessToFile,
    logToConsole,
    logErrorToFile
};
