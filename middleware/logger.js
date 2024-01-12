// Custom logger middleware

const {format} = require('date-fns')
const {v4: uuid} = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

// Custom logger middleware 
const logEvents = async (message, logFileName) => {
  const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss') // format current date and time
  const logItem = `${dateTime}\t${uuid()}\t${message}\n` // create log item

  try {
    if(!fs.existsSync(path.join(__dirname, '..', 'logs'))){
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs')) // create logs folder if it doesn't exist
    }
    await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem) // append log item to log file
  } catch (err) {
    console.error(err)
  }
}

const logger = (req, res, next) => { // log request method, url and origin
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
  console.log(`${req.method}\t${req.path}`);
  next() // pass control to next handler
}

module.exports = {logEvents, logger }
