var request = require('request');

function Client(accessToken) {
  this.accessToken = accessToken;
  this.request = request.defaults({
    baseUrl: 'https://www.googleapis.com/admin',
    auth: {
      bearer: this.accessToken
    },
    json: true
  });

  this.calendarResource = new CalendarResource(this);
}

function CalendarResource(client) {
  this.client = client;
  this.resourcePath = '/directory/v1/customer/my_customer/resources/calendars'
}

/*
* Gets a list of calendar resources for authenticated user's account.
*
* @option [object] qs
* @option [string] qs.pageToken
* @option [number] qs.maxResults
*
* API Endpoint: https://www.googleapis.com/admin/directory/v1/customer/[customer_id]/resources/calendars
* API Documentation: https://developers.google.com/admin-sdk/directory/v1/reference/resources/calendars/list
* Example Response:
* {
*   "kind": "admin#directory#resources#calendars#calendarResourcesList",
*   "etag": etag,
*   "nextPageToken": string,
*   "items": [
*     resources.calendars Resource
*   ]
* }
*/
CalendarResource.prototype.list = function(qs, cb) {
  if (typeof qs === 'function') {
    cb = qs
    qs = {}
  }
  return this.client.request({method: 'GET', uri: this.resourcePath, qs: qs}, cb)
};

module.exports = Client
