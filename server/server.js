const http = require('http')
const fs = require('fs')
const os = require('os')
const path = require('path')
const url = require('url')
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

    // In case of multiple writes to the same file by different connections
    // log file could corrupt since each 'thread' will have a different cursor and file descriptor
    // This lock ensures that only one 'thread' at a time can access to file
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

function serveFile(filename, response){
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            response.end()
            return
        }

        response.end(data)
    })
}

// Check if requested file is found
function checkRequestFile(request, response) {
    
    responseParams = {
        status: 404,
        redirect: undefined,
        body: undefined,
        serving: false
    }

    let uri = url.parse(request.url)
    let file = uri.pathname
    let filename = path.join(__dirname, '..', 'pages', file)
    let found = checkFileFS(filename)
    
    if (!found) {
        responseParams.body = `İstenilen dosya/sayfa '${file}' bulunamadı 😔`
        responseParams.status = 404
    } else {
        responseParams.status = 200
        responseParams.serving = true
        serveFile(filename, response)
    }

    return responseParams
}


function serverProcess(request, response) {
    
    let responseParams = checkRequestFile(request, response)
    
    response.writeHead(responseParams.status, {
        'Content-Type': 'text/html; charset=utf-8',
    })
    
    if (responseParams.body){
        response.write(responseParams.body)        
    }

    // file contents will be sent to client in time. Do not close connection
    if (!responseParams.serving){
        response.end()
    }

    logRequest(request, responseParams)
}

http.createServer(function (request, response) {
    
    serverProcess(request, response)

}).listen(8080)