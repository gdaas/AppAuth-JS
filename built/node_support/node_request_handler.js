"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_utils_1 = require("./crypto_utils");
/*
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */
// TypeScript typings for `opener` are not correct and do not export it as module
var opener = require("opener");
var hapi_1 = require("hapi");
var EventEmitter = require("events");
var query_string_utils_1 = require("../query_string_utils");
var authorization_request_handler_1 = require("../authorization_request_handler");
var authorization_response_1 = require("../authorization_response");
var logger_1 = require("../logger");
var ServerEventsEmitter = /** @class */ (function (_super) {
    __extends(ServerEventsEmitter, _super);
    function ServerEventsEmitter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ServerEventsEmitter.ON_UNABLE_TO_START = 'unable_to_start';
    ServerEventsEmitter.ON_AUTHORIZATION_RESPONSE = 'authorization_response';
    return ServerEventsEmitter;
}(EventEmitter));
var NodeBasedHandler = /** @class */ (function (_super) {
    __extends(NodeBasedHandler, _super);
    function NodeBasedHandler(
    // default to port 8000
    httpServerPort, utils, generateRandom) {
        if (httpServerPort === void 0) { httpServerPort = 8000; }
        if (utils === void 0) { utils = new query_string_utils_1.BasicQueryStringUtils(); }
        if (generateRandom === void 0) { generateRandom = crypto_utils_1.nodeCryptoGenerateRandom; }
        var _this = _super.call(this, utils, generateRandom) || this;
        _this.httpServerPort = httpServerPort;
        // the handle to the current authorization request
        _this.authorizationPromise = null;
        return _this;
    }
    NodeBasedHandler.prototype.performAuthorizationRequest = function (configuration, request) {
        var _this = this;
        // use opener to launch a web browser and start the authorization flow.
        // start a web server to handle the authorization response.
        var server = new hapi_1.Server({ port: this.httpServerPort });
        var emitter = new ServerEventsEmitter();
        this.authorizationPromise = new Promise(function (resolve, reject) {
            emitter.once(ServerEventsEmitter.ON_UNABLE_TO_START, function () {
                reject("Unable to create HTTP server at port " + _this.httpServerPort);
            });
            emitter.once(ServerEventsEmitter.ON_AUTHORIZATION_RESPONSE, function (result) {
                // resolve pending promise
                resolve(result);
                // complete authorization flow
                _this.completeAuthorizationRequestIfPossible();
            });
        });
        server.route({
            method: 'GET',
            path: '/',
            handler: function (hapiRequest, hapiResponse) {
                // Unsafe cast. :(
                var queryParams = hapiRequest.query;
                var state = queryParams['state'];
                var code = queryParams['code'];
                var error = queryParams['error'];
                logger_1.log('Handling Authorization Request ', queryParams, state, code, error);
                var authorizationResponse = null;
                var authorizationError = null;
                if (error) {
                    // get additional optional info.
                    var errorUri = queryParams['error_uri'];
                    var errorDescription = queryParams['error_description'];
                    authorizationError = new authorization_response_1.AuthorizationError(error, errorDescription, errorUri, state);
                }
                else {
                    authorizationResponse = new authorization_response_1.AuthorizationResponse(code, state);
                }
                var completeResponse = {
                    request: request,
                    response: authorizationResponse,
                    error: authorizationError
                };
                emitter.emit(ServerEventsEmitter.ON_AUTHORIZATION_RESPONSE, completeResponse);
                server.stop();
                return 'Close your browser to continue';
            }
        });
        server
            .start()
            .then(function () {
            var url = _this.buildRequestUrl(configuration, request);
            logger_1.log('Making a request to ', request, url);
            if (_this.windowOpenerNotifier) {
                _this.windowOpenerNotifier.onWindowOpen(url);
            }
            else {
                opener(url);
            }
        })
            .catch(function (error) {
            logger_1.log('Something bad happened ', error);
        });
    };
    NodeBasedHandler.prototype.completeAuthorizationRequest = function () {
        if (!this.authorizationPromise) {
            return Promise.reject('No pending authorization request. Call performAuthorizationRequest() ?');
        }
        return this.authorizationPromise;
    };
    return NodeBasedHandler;
}(authorization_request_handler_1.AuthorizationRequestHandler));
exports.NodeBasedHandler = NodeBasedHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZV9yZXF1ZXN0X2hhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbm9kZV9zdXBwb3J0L25vZGVfcmVxdWVzdF9oYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLCtDQUEwRDtBQUMxRDs7Ozs7Ozs7Ozs7O0dBWUc7QUFFSCxpRkFBaUY7QUFDakYsK0JBQWtDO0FBQ2xDLDZCQUF1RTtBQUN2RSxxQ0FBdUM7QUFDdkMsNERBQWdGO0FBS2hGLGtGQUkwQztBQUMxQyxvRUFLbUM7QUFLbkMsb0NBQWdDO0FBRWhDO0lBQWtDLHVDQUFZO0lBQTlDOztJQUdBLENBQUM7SUFGUSxzQ0FBa0IsR0FBRyxpQkFBaUIsQ0FBQztJQUN2Qyw2Q0FBeUIsR0FBRyx3QkFBd0IsQ0FBQztJQUM5RCwwQkFBQztDQUFBLEFBSEQsQ0FBa0MsWUFBWSxHQUc3QztBQUVEO0lBQXNDLG9DQUEyQjtJQUkvRDtJQUNFLHVCQUF1QjtJQUNoQixjQUFxQixFQUM1QixLQUFxRCxFQUNyRCxjQUF5QztRQUZsQywrQkFBQSxFQUFBLHFCQUFxQjtRQUM1QixzQkFBQSxFQUFBLFlBQThCLDBDQUFxQixFQUFFO1FBQ3JELCtCQUFBLEVBQUEsaUJBQWlCLHVDQUF3QjtRQUozQyxZQU1FLGtCQUFNLEtBQUssRUFBRSxjQUFjLENBQUMsU0FDN0I7UUFMUSxvQkFBYyxHQUFkLGNBQWMsQ0FBTztRQUw5QixrREFBa0Q7UUFDbEQsMEJBQW9CLEdBQXdELElBQUksQ0FBQzs7SUFTakYsQ0FBQztJQUVELHNEQUEyQixHQUEzQixVQUNFLGFBQWdELEVBQ2hELE9BQTZCO1FBRi9CLGlCQWlGQztRQTdFQyx1RUFBdUU7UUFDdkUsMkRBQTJEO1FBQzNELElBQU0sTUFBTSxHQUFHLElBQUksYUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBRXpELElBQU0sT0FBTyxHQUFHLElBQUks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LHVEQUE0QixHQUF0QztRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUU7WUFDOUIsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUNuQix3RUFBd0UsQ0FDekUsQ0FBQztTQUNIO1FBRUQsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUM7SUFDbkMsQ0FBQztJQUNILHVCQUFDO0FBQUQsQ0FBQyxBQXpHRCxDQUFzQywyREFBMkIsR0F5R2hFO0FBekdZLDRDQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJhbmRvbUdlbmVyYXRvciB9IGZyb20gJy4uL2NyeXB0b191dGlscyc7XG5pbXBvcnQgeyBub2RlQ3J5cHRvR2VuZXJhdGVSYW5kb20gfSBmcm9tICcuL2NyeXB0b191dGlscyc7XG4vKlxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIEluYy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdFxuICogaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZVxuICogTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXJcbiAqIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLy8gVHlwZVNjcmlwdCB0eXBpbmdzIGZvciBgb3BlbmVyYCBhcmUgbm90IGNvcnJlY3QgYW5kIGRvIG5vdCBleHBvcnQgaXQgYXMgbW9kdWxlXG5pbXBvcnQgb3BlbmVyID0gcmVxdWlyZSgnb3BlbmVyJyk7XG5pbXBvcnQgeyBSZXF1ZXN0LCBTZXJ2ZXJPcHRpb25zLCBTZXJ2ZXIsIFJlc3BvbnNlVG9vbGtpdCB9IGZyb20gJ2hhcGknO1xuaW1wb3J0ICogYXMgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgeyBCYXNpY1F1ZXJ5U3RyaW5nVXRpbHMsIFF1ZXJ5U3RyaW5nVXRpbHMgfSBmcm9tICcuLi9xdWVyeV9zdHJpbmdfdXRpbHMnO1xuaW1wb3J0IHtcbiAgQXV0aG9yaXphdGlvblJlcXVlc3QsXG4gIEF1dGhvcml6YXRpb25SZXF1ZXN0SnNvblxufSBmcm9tICcuLi9hdXRob3JpemF0aW9uX3JlcXVlc3QnO1xuaW1wb3J0IHtcbiAgQXV0aG9yaXphdGlvblJlcXVlc3RIYW5kbGVyLFxuICBBdXRob3JpemF0aW9uUmVxdWVzdFJlc3BvbnNlLFxuICBCVUlMVF9JTl9QQVJBTUVURVJTXG59IGZyb20gJy4uL2F1dGhvcml6YXRpb25fcmVxdWVzdF9oYW5kbGVyJztcbmltcG9ydCB7XG4gIEF1dGhvcml6YXRpb25FcnJvcixcbiAgQXV0aG9yaXphdGlvblJlc3BvbnNlLFxuICBBdXRob3JpemF0aW9uUmVzcG9uc2VKc29uLFxuICBBdXRob3JpemF0aW9uRXJyb3JKc29uXG59IGZyb20gJy4uL2F1dGhvcml6YXRpb25fcmVzcG9uc2UnO1xuaW1wb3J0IHtcbiAgQXV0aG9yaXphdGlvblNlcnZpY2VDb25maWd1cmF0aW9uLFxuICBBdXRob3JpemF0aW9uU2VydmljZUNvbmZpZ3VyYXRpb25Kc29uXG59IGZyb20gJy4uL2F1dGhvcml6YXRpb25fc2VydmljZV9jb25maWd1cmF0aW9uJztcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4uL2xvZ2dlcic7XG5cbmNsYXNzIFNlcnZlckV2ZW50c0VtaXR0ZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBzdGF0aWMgT05fVU5BQkxFX1RPX1NUQVJUID0gJ3VuYWJsZV90b19zdGFydCc7XG4gIHN0YXRpYyBPTl9BVVRIT1JJWkFUSU9OX1JFU1BPTlNFID0gJ2F1dGhvcml6YXRpb25fcmVzcG9uc2UnO1xufVxuXG5leHBvcnQgY2xhc3MgTm9kZUJhc2VkSGFuZGxlciBleHRlbmRzIEF1dGhvcml6YXRpb25SZXF1ZXN0SGFuZGxlciB7XG4gIC8vIHRoZSBoYW5kbGUgdG8gdGhlIGN1cnJlbnQgYXV0aG9yaXphdGlvbiByZXF1ZXN0XG4gIGF1dGhvcml6YXRpb25Qcm9taXNlOiBQcm9taXNlPEF1dGhvcml6YXRpb25SZXF1ZXN0UmVzcG9uc2UgfCBudWxsPiB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIC8vIGRlZmF1bHQgdG8gcG9ydCA4MDAwXG4gICAgcHVibGljIGh0dHBTZXJ2ZXJQb3J0ID0gODAwMCxcbiAgICB1dGlsczogUXVlcnlTdHJpbmdVdGlscyA9IG5ldyBCYXNpY1F1ZXJ5U3RyaW5nVXRpbHMoKSxcbiAgICBnZW5lcmF0ZVJhbmRvbSA9IG5vZGVDcnlwdG9HZW5lcmF0ZVJhbmRvbVxuICApIHtcbiAgICBzdXBlcih1dGlscywgZ2VuZXJhdGVSYW5kb20pO1xuICB9XG5cbiAgcGVyZm9ybUF1dGhvcml6YXRpb25SZXF1ZXN0KFxuICAgIGNvbmZpZ3VyYXRpb246IEF1dGhvcml6YXRpb25TZXJ2aWNlQ29uZmlndXJhdGlvbixcbiAgICByZXF1ZXN0OiBBdXRob3JpemF0aW9uUmVxdWVzdFxuICApIHtcbiAgICAvLyB1c2Ugb3BlbmVyIHRvIGxhdW5jaCBhIHdlYiBicm93c2VyIGFuZCBzdGFydCB0aGUgYXV0aG9yaXphdGlvbiBmbG93LlxuICAgIC8vIHN0YXJ0IGEgd2ViIHNlcnZlciB0byBoYW5kbGUgdGhlIGF1dGhvcml6YXRpb24gcmVzcG9uc2UuXG4gICAgY29uc3Qgc2VydmVyID0gbmV3IFNlcnZlcih7IHBvcnQ6IHRoaXMuaHR0cFNlcnZlclBvcnQgfSk7XG5cbiAgICBjb25zdCBlbWl0dGVyID0gbmV3IFNlcnZlckV2ZW50c0VtaXR0ZXIoKTtcblxuICAgIHRoaXMuYXV0aG9yaXphdGlvblByb21pc2UgPSBuZXcgUHJvbWlzZTxBdXRob3JpemF0aW9uUmVxdWVzdFJlc3BvbnNlPihcbiAgICAgIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgZW1pdHRlci5vbmNlKFNlcnZlckV2ZW50c0VtaXR0ZXIuT05fVU5BQkxFX1RPX1NUQVJULCAoKSA9PiB7XG4gICAgICAgICAgcmVqZWN0KGBVbmFibGUgdG8gY3JlYXRlIEhUVFAgc2VydmVyIGF0IHBvcnQgJHt0aGlzLmh0dHBTZXJ2ZXJQb3J0fWApO1xuICAgICAgICB9KTtcbiAgICAgICAgZW1pdHRlci5vbmNlKFxuICAgICAgICAgIFNlcnZlckV2ZW50c0VtaXR0ZXIuT05fQVVUSE9SSVpBVElPTl9SRVNQT05TRSxcbiAgICAgICAgICAocmVzdWx0OiBhbnkpID0+IHtcbiAgICAgICAgICAgIC8vIHJlc29sdmUgcGVuZGluZyBwcm9taXNlXG4gICAgICAgICAgICByZXNvbHZlKHJlc3VsdCBhcyBBdXRob3JpemF0aW9uUmVxdWVzdFJlc3BvbnNlKTtcbiAgICAgICAgICAgIC8vIGNvbXBsZXRlIGF1dGhvcml6YXRpb24gZmxvd1xuICAgICAgICAgICAgdGhpcy5jb21wbGV0ZUF1dGhvcml6YXRpb25SZXF1ZXN0SWZQb3NzaWJsZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgc2VydmVyLnJvdXRlKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICBwYXRoOiAnLycsXG4gICAgICBoYW5kbGVyOiAoaGFwaVJlcXVlc3Q6IFJlcXVlc3QsIGhhcGlSZXNwb25zZTogUmVzcG9uc2VUb29sa2l0KSA9PiB7XG4gICAgICAgIC8vIFVuc2FmZSBjYXN0LiA6KFxuICAgICAgICBsZXQgcXVlcnlQYXJhbXMgPSAoaGFwaVJlcXVlc3QucXVlcnkgYXMgYW55KSBhcyBBdXRob3JpemF0aW9uUmVzcG9uc2VKc29uICZcbiAgICAgICAgICBBdXRob3JpemF0aW9uRXJyb3JKc29uO1xuICAgICAgICBsZXQgc3RhdGUgPSBxdWVyeVBhcmFtc1snc3RhdGUnXTtcbiAgICAgICAgbGV0IGNvZGUgPSBxdWVyeVBhcmFtc1snY29kZSddO1xuICAgICAgICBsZXQgZXJyb3IgPSBxdWVyeVBhcmFtc1snZXJyb3InXTtcbiAgICAgICAgbG9nKCdIYW5kbGluZyBBdXRob3JpemF0aW9uIFJlcXVlc3QgJywgcXVlcnlQYXJhbXMsIHN0YXRlLCBjb2RlLCBlcnJvcik7XG4gICAgICAgIGxldCBhdXRob3JpemF0aW9uUmVzcG9uc2U6IEF1dGhvcml6YXRpb25SZXNwb25zZSB8IG51bGwgPSBudWxsO1xuICAgICAgICBsZXQgYXV0aG9yaXphdGlvbkVycm9yOiBBdXRob3JpemF0aW9uRXJyb3IgfCBudWxsID0gbnVsbDtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgLy8gZ2V0IGFkZGl0aW9uYWwgb3B0aW9uYWwgaW5mby5cbiAgICAgICAgICBsZXQgZXJyb3JVcmkgPSBxdWVyeVBhcmFtc1snZXJyb3JfdXJpJ107XG4gICAgICAgICAgbGV0IGVycm9yRGVzY3JpcHRpb24gPSBxdWVyeVBhcmFtc1snZXJyb3JfZGVzY3JpcHRpb24nXTtcbiAgICAgICAgICBhdXRob3JpemF0aW9uRXJyb3IgPSBuZXcgQXV0aG9yaXphdGlvbkVycm9yKFxuICAgICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgICBlcnJvckRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgZXJyb3JVcmksXG4gICAgICAgICAgICBzdGF0ZVxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXV0aG9yaXphdGlvblJlc3BvbnNlID0gbmV3IEF1dGhvcml6YXRpb25SZXNwb25zZShjb2RlISwgc3RhdGUhKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY29tcGxldGVSZXNwb25zZSA9IHtcbiAgICAgICAgICByZXF1ZXN0OiByZXF1ZXN0LFxuICAgICAgICAgIHJlc3BvbnNlOiBhdXRob3JpemF0aW9uUmVzcG9uc2UsXG4gICAgICAgICAgZXJyb3I6IGF1dGhvcml6YXRpb25FcnJvclxuICAgICAgICB9IGFzIEF1dGhvcml6YXRpb25SZXF1ZXN0UmVzcG9uc2U7XG4gICAgICAgIGVtaXR0ZXIuZW1pdChcbiAgICAgICAgICBTZXJ2ZXJFdmVudHNFbWl0dGVyLk9OX0FVVEhPUklaQVRJT05fUkVTUE9OU0UsXG4gICAgICAgICAgY29tcGxldGVSZXNwb25zZVxuICAgICAgICApO1xuICAgICAgICBzZXJ2ZXIuc3RvcCgpO1xuICAgICAgICByZXR1cm4gJ0Nsb3NlIHlvdXIgYnJvd3NlciB0byBjb250aW51ZSc7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBzZXJ2ZXJcbiAgICAgIC5zdGFydCgpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIGxldCB1cmwgPSB0aGlzLmJ1aWxkUmVxdWVzdFVybChjb25maWd1cmF0aW9uLCByZXF1ZXN0KTtcbiAgICAgICAgbG9nKCdNYWtpbmcgYSByZXF1ZXN0IHRvICcsIHJlcXVlc3QsIHVybCk7XG4gICAgICAgIGlmICh0aGlzLndpbmRvd09wZW5lck5vdGlmaWVyKSB7XG4gICAgICAgICAgdGhpcy53aW5kb3dPcGVuZXJOb3RpZmllci5vbldpbmRvd09wZW4odXJsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvcGVuZXIodXJsKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgIGxvZygnU29tZXRoaW5nIGJhZCBoYXBwZW5lZCAnLCBlcnJvcik7XG4gICAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjb21wbGV0ZUF1dGhvcml6YXRpb25SZXF1ZXN0KCk6IFByb21pc2U8QXV0aG9yaXphdGlvblJlcXVlc3RSZXNwb25zZSB8IG51bGw+IHtcbiAgICBpZiAoIXRoaXMuYXV0aG9yaXphdGlvblByb21pc2UpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcbiAgICAgICAgJ05vIHBlbmRpbmcgYXV0aG9yaXphdGlvbiByZXF1ZXN0LiBDYWxsIHBlcmZvcm1BdXRob3JpemF0aW9uUmVxdWVzdCgpID8nXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmF1dGhvcml6YXRpb25Qcm9taXNlO1xuICB9XG59XG4iXX0=