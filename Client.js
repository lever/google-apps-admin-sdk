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
  this.buildingResource = new BuildingResource(this);
}

function CalendarResource(client) {
  this.client = client;
  this.resourcePath = '/directory/v1/customer/my_customer/resources/calendars'
}

function BuildingResource(client) {
  this.client = client
  this.resourcePath = '/directory/v1/customer/my_customer/resources/buildings'
}

function list(qs, cb) {
  if (typeof qs === 'function') {
    cb = qs
    qs = {}
  }
  return this.client.request({method: 'GET', uri: this.resourcePath, qs: qs}, cb)
};

function get(resourceId, qs, cb) {
  if (typeof qs === 'function') {
    cb = qs
    qs = {}
  }
  // We do not use url.resolve becuase if the resourceId contains a leading slash,
  // we would end up with an incorrect url.
  var requestUrl = this.resourcePath + '/' + resourceId
  return this.client.request({method: 'GET', uri: requestUrl, qs: qs}, cb)
}

/*
* Gets a list of calendar resources for authenticated user's account.
*
* @param [object] qs
* @option [string] qs.pageToken
* @option [number] qs.maxResults
* @callback (err, resources)
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
CalendarResource.prototype.list = list

/*
* Gets a list of building resources for authenticated user's account.
*
* @param [object] qs
* @option [string] qs.pageToken
* @option [number] qs.maxResults
* @callback (err, resources)
*
* API Endpoint: https://www.googleapis.com/admin/directory/v1/customer/[customer_id]/resources/buildings
* API Documentation: https://developers.google.com/admin-sdk/directory/v1/reference/resources/buildings/list
* Example Response:
* {
*   "kind": "admin#directory#resources#buildings#buildingsList",
*   "etag": etag,
*   "nextPageToken": string,
*   "buildings": [
*     resources.buildings Resource
*   ]
* }
*/
BuildingResource.prototype.list = list

/*
* Gets a single building resource from an authenticated user's account.
*
* @param [string] resourceId The id of the resource to be retrieved
* @param [object] qs
* @option [string] qs.pageToken
* @option [number] qs.maxResults
* @callback (err, resource)
*
* API Endpoint: https://www.googleapis.com/admin/directory/v1/customer/[customer_id]/resources/buildings/[building_id]
* API Documentation: https://developers.google.com/admin-sdk/directory/v1/reference/resources/buildings/get
* Example Response:
* {
*   "kind": "admin#directory#resources#buildings#Building",
*   "etags": etag,
*   "buildingId": string,
*   "buildingName": string,
*   "description": string,
*   "coordinates": {
*     "latitude": double,
*     "longitude": double
*   },
*   "floorNames": [
*     string
*   ]
* }
*/
BuildingResource.prototype.get = get

module.exports = Client
