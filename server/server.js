const http = require('http')
const fs = require('fs')
const os = require('os')
const path = require('path')
const RWLock = require('rwlock')

const logFileName = path.join(__dirname, '..', 'logfile.log')
console.log("Logs will be saved to file: ", logFileName)
const logFileLock = new RWLock()

async function logRequest(request, responseParams) {
    
    let requestInfo = {
        sender: request.headers['user-agent'],
        url: request.url,
        responseStatus: responseParams.status,
    }

    let dump = JSON.stringify(requestInfo) + os.EOL

    logFileLock.writeLock(function (release) {

        fs.appendFile(logFileName, dump, 'utf-8', function (err) {
            if (err)
                console.log('Critical FS error')
            
            release()
        })
    })
}

function checkFileFS(filename) {
    return fs.existsSync(filename);
}

// Check if requested file is found
function checkRequestFile(request) {
    
    responseParams = {
        status: 404,
        body: 'Not found'
    }

    file = request.url.substring(1)
    let filename = path.join(__dirname, '..', 'pages', file)
    let found = checkFileFS(filename)
    
    if (!found) {
        responseParams.body = `İstenilen dosya/sayfa '${file}' bulunamadı 😔`
    } else {
        responseParams.body = `Getirdim getirdim 🥳, şuan buradasın: ${file}`
        responseParams.status = 200
    }

    return responseParams
}


function serverProcess(request, response) {
    
    let responseParams = checkRequestFile(request)
    
    response.writeHead(responseParams.status, {
        'Content-Length': Buffer.byteLength(responseParams.body),
        'Content-Type': 'text/plain; charset=utf-8',
        'User-Agent': 'Mozilla/5.0'
    })
    response.write(responseParams.body)

    response.end()

    logRequest(request, responseParams)
}

http.createServer(function (request, response) {
    
    serverProcess(request, response)

}).listen(8080)