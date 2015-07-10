/*!
 * google-apps-admin-sdk
 * Copyright(c) 2012 Randal Truong <randal@lever.co>
 * MIT Licensed
 */

var request = require('request');

module.exports = {
  Client: Client
, CalendarResource: CalendarResource
}

function Client(appDomain, accessToken, refreshToken, clientId, clientSecret) {
  this.appDomain = appDomain
  this.accessToken = accessToken;
  this.refreshToken = refreshToken;
  this.clientId = clientId;
  this.clientSecret = clientSecret;

  this.protocol = 'https://';
  this.host = 'apps-apis.google.com';
  this.endpoint = '/a/feeds/';
  this.headers = {
    'Authorization': 'Bearer ' + this.accessToken
  };

  this.calendarResource = new CalendarResource(this);
}

Client.prototype.setAccessToken = function (accessToken) {
  this.accessToken = accessToken
  this.headers = {
    'Authorization': 'Bearer ' + this.accessToken
  };
}

function CalendarResource(client) {
  this.client = client;
  this.apiPath = 'calendar/resource/2.0/'
}

// API Methods matching https://developers.google.com/admin-sdk/calendar-resource/
//https://apps-apis.google.com/a/feeds/calendar/resource/2.0/example.com/
CalendarResource.prototype.list = function(qs, cb) {
  return this.client.request('GET', this.apiPath + this.client.appDomain + '/', null, qs, cb);
};

/**
 * The main function that does all the work. The client really shouldn't call this.
 * @param method {String} HTTP method
 * @param resource {String} the resource
 * @param body {Object} entity body for POST and PUT requests. Must be buffer or string.
 * @param {Object} qs object containing querystring values to be appended to the uri
 * @param cb {Function} callback for the request
 * @return
 */
Client.prototype.request = function (method, resource, body, qs, cb) {
  var self = this;

  if (typeof cb === 'undefined') {
    cb = qs;
    qs = {};
  }

  if (typeof body === 'function' && !cb) {
    cb = body;
    body = null;
  } else if (body !== null && typeof body === 'object') {
    body = JSON.stringify(body);
  }

  var url = '';
  url = url.concat(
    this.protocol,
    this.host,
    this.endpoint,
    resource);

  qs.alt = 'json'
  var opts = {
    url: url,
    method: method,
    headers: this.headers,
    qs: qs
  };

  if (body) {
    opts.body = body
  }

  // Response cb handles json responses as well as refreshing token if possible
  var responseCb = function (error, response, body) {
    console.log('responseCb', error, response && response.statusCode, response && response.headers, body)

    // console.log('responseCb', error, response.headers, body)
    // Try to parse json responses, and creates an error if response code is not 200
    if (response && response.headers['content-type'] && (response.headers['content-type'].indexOf('application/json') !== -1)) {
      try {
        body = JSON.parse(body)
        if (!error && response.statusCode !== 200) {
          error = new Error(body.error.message);
        }
      } catch (e) {
      }
    }

    return cb(error, response, body);
  };

  console.log('making request with opts', opts)
  return request(opts, responseCb);
};



