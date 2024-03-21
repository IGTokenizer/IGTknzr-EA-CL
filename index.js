const { Requester, Validator } = require('@chainlink/external-adapter')
const { getDescriptionValue } = require('./scrapper')
// Define custom error scenarios for the API.
// Return true for the adapter to retry.
const customError = (data) => {
  if (data.Response === 'Error') return true
  return false
}


//The customParams by the data I need
//The id of the instagram post
//The hash of the instagram post(ID to string)
//The access_token of the user, which will give me validating Its instagram account on the platform
//by the authentication tool instagram provides

const customParams = {
  id: ['id'],
  hash: ['hash']
}

const createRequest = (input, callback) => {
  // The Validator helps you validate the Chainlink request data
  const validator = new Validator(input, customParams)
  const jobRunID = validator.validated.id
  const hash = validator.validated.data.hash
  const id = validator.validated.data.id
  
  const instagramUrl = `https://www.instagram.com/p/${id}/`
  console.log('instagramUrl:', instagramUrl)

  const params = {
    id,
    hash
  }
  console.log('requestUrl:', instagramUrl)
  getDescriptionValue(instagramUrl)
  .then(descriptionValue => {
    console.log('Valor de la etiqueta meta "description":', descriptionValue);
    callback(200, {jobRunID, descriptionValue})
  })
  .catch(error => {
    console.error(error);
  });
}

// This is a wrapper to allow the function to work with
// GCP Functions
exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data)
  })
}

// This is a wrapper to allow the function to work with
// AWS Lambda
exports.handler = (event, context, callback) => {
  createRequest(event, (statusCode, data) => {
    callback(null, data)
  })
}

// This is a wrapper to allow the function to work with
// newer AWS Lambda implementations
exports.handlerv2 = (event, context, callback) => {
  createRequest(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false
    })
  })
}

// This allows the function to be exported for testing
// or for running in express
module.exports.createRequest = createRequest
