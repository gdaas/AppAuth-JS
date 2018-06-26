"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("./logger");
/**
 * Authorization Service notifier.
 * This manages the communication of the AuthorizationResponse to the 3p client.
 */
var AuthorizationNotifier = /** @class */ (function () {
    function AuthorizationNotifier() {
        this.listener = null;
    }
    AuthorizationNotifier.prototype.setAuthorizationListener = function (listener) {
        this.listener = listener;
    };
    /**
     * The authorization complete callback.
     */
    AuthorizationNotifier.prototype.onAuthorizationComplete = function (request, response, error) {
        if (this.listener) {
            // complete authorization request
            this.listener(request, response, error);
        }
    };
    return AuthorizationNotifier;
}());
exports.AuthorizationNotifier = AuthorizationNotifier;
/**
 * Window opener notifier.
 * This manages the communication of the opening of a new browser window.
 */
var WindowOpenerNotifier = /** @class */ (function () {
    function WindowOpenerNotifier() {
        this.listener = null;
    }
    WindowOpenerNotifier.prototype.setWindowOpenerListener = function (listener) {
        this.listener = listener;
    };
    WindowOpenerNotifier.prototype.onWindowOpen = function (link) {
        if (this.listener) {
            // complete authorization request
            this.listener(link);
        }
    };
    return WindowOpenerNotifier;
}());
exports.WindowOpenerNotifier = WindowOpenerNotifier;
// TODO(rahulrav@): add more built in parameters.
/* built in parameters. */
exports.BUILT_IN_PARAMETERS = ['redirect_uri', 'client_id', 'response_type', 'state', 'scope'];
/**
 * Defines the interface which is capable of handling an authorization request
 * using various methods (iframe / popup / different process etc.).
 */
var AuthorizationRequestHandler = /** @class */ (function () {
    function AuthorizationRequestHandler(utils, generateRandom) {
        this.utils = utils;
        this.generateRandom = generateRandom;
        // notifier send the response back to the client.
        this.notifier = null;
        this.windowOpenerNotifier = null;
    }
    /**
     * A utility method to be able to build the authorization request URL.
     */
    AuthorizationRequestHandler.prototype.buildRequestUrl = function (configuration, request) {
        // build the query string
        // coerce to any type for convenience
        var requestMap = {
            redirect_uri: request.redirectUri,
            client_id: request.clientId,
            response_type: request.responseType,
            state: request.state,
            scope: request.scope
        };
        // copy over extras
        if (request.extras) {
            for (var extra in request.extras) {
                if (request.extras.hasOwnProperty(extra)) {
                    // check before inserting to requestMap
                    if (exports.BUILT_IN_PARAMETERS.indexOf(extra) < 0) {
                        requestMap[extra] = request.extras[extra];
                    }
                }
            }
        }
        var query = this.utils.stringify(requestMap);
        var baseUrl = configuration.authorizationEndpoint;
        var url = baseUrl + "?" + query;
        return url;
    };
    /**
     * Completes the authorization request if necessary & when possible.
     */
    AuthorizationRequestHandler.prototype.completeAuthorizationRequestIfPossible = function () {
        var _this = this;
        // call complete authorization if possible to see there might
        // be a response that needs to be delivered.
        logger_1.log("Checking to see if there is an authorization response to be delivered.");
        if (!this.notifier) {
            logger_1.log("Notifier is not present on AuthorizationRequest handler.\n          No delivery of result will be possible");
        }
        return this.completeAuthorizationRequest().then(function (result) {
            if (!result) {
                logger_1.log("No result is available yet.");
            }
            if (result && _this.notifier) {
                _this.notifier.onAuthorizationComplete(result.request, result.response, result.error);
            }
        });
    };
    /**
     * Sets the default Authorization Service notifier.
     */
    AuthorizationRequestHandler.prototype.setAuthorizationNotifier = function (notifier) {
        this.notifier = notifier;
        return this;
    };
    /**
     * Sets the window open notifier.
     */
    AuthorizationRequestHandler.prototype.setWindowOpenerNotifier = function (notifier) {
        this.windowOpenerNotifier = notifier;
        return this;
    };
    return AuthorizationRequestHandler;
}());
exports.AuthorizationRequestHandler = AuthorizationRequestHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aG9yaXphdGlvbl9yZXF1ZXN0X2hhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYXV0aG9yaXphdGlvbl9yZXF1ZXN0X2hhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7R0FZRzs7QUFNSCxtQ0FBNkI7QUF3QjdCOzs7R0FHRztBQUNIO0lBQUE7UUFDVSxhQUFRLEdBQStCLElBQUksQ0FBQztJQWtCdEQsQ0FBQztJQWhCQyx3REFBd0IsR0FBeEIsVUFBeUIsUUFBK0I7UUFDdEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDM0IsQ0FBQztJQUVEOztPQUVHO0lBQ0gsdURBQXVCLEdBQXZCLFVBQ0ksT0FBNkIsRUFDN0IsUUFBb0MsRUFDcEMsS0FBOEI7UUFDaEMsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLGlDQUFpQztZQUNqQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDekM7SUFDSCxDQUFDO0lBQ0gsNEJBQUM7QUFBRCxDQUFDLEFBbkJELElBbUJDO0FBbkJZLHNEQUFxQjtBQXFCbEM7OztHQUdHO0FBQ0g7SUFBQTtRQUNVLGFBQVEsR0FBOEIsSUFBSSxDQUFDO0lBWXJELENBQUM7SUFWQyxzREFBdUIsR0FBdkIsVUFBd0IsUUFBOEI7UUFDcEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDM0IsQ0FBQztJQUVELDJDQUFZLEdBQVosVUFBYSxJQUFZO1FBQ3ZCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixpQ0FBaUM7WUFDakMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNyQjtJQUNILENBQUM7SUFDSCwyQkFBQztBQUFELENBQUMsQUFiRCxJQWFDO0FBYlksb0RBQW9CO0FBZWpDLGlEQUFpRDtBQUNqRCwwQkFBMEI7QUFDYixRQUFBLG1C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biAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdFxuICogaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZVxuICogTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXJcbiAqIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHtBdXRob3JpemF0aW9uUmVxdWVzdCwgQXV0aG9yaXphdGlvblJlcXVlc3RKc29ufSBmcm9tICcuL2F1dGhvcml6YXRpb25fcmVxdWVzdCc7XG5pbXBvcnQge0F1dGhvcml6YXRpb25FcnJvciwgQXV0aG9yaXphdGlvbkVycm9ySnNvbiwgQXV0aG9yaXphdGlvblJlc3BvbnNlLCBBdXRob3JpemF0aW9uUmVzcG9uc2VKc29ufSBmcm9tICcuL2F1dGhvcml6YXRpb25fcmVzcG9uc2UnO1xuaW1wb3J0IHtBdXRob3JpemF0aW9uU2VydmljZUNvbmZpZ3VyYXRpb259IGZyb20gJy4vYXV0aG9yaXphdGlvbl9zZXJ2aWNlX2NvbmZpZ3VyYXRpb24nO1xuaW1wb3J0IHtjcnlwdG9HZW5lcmF0ZVJhbmRvbSwgUmFuZG9tR2VuZXJhdG9yfSBmcm9tICcuL2NyeXB0b191dGlscyc7XG5pbXBvcnQge2xvZ30gZnJvbSAnLi9sb2dnZXInO1xuaW1wb3J0IHtRdWVyeVN0cmluZ1V0aWxzfSBmcm9tICcuL3F1ZXJ5X3N0cmluZ191dGlscyc7XG5pbXBvcnQge1N0cmluZ01hcH0gZnJvbSAnLi90eXBlcyc7XG5cbi8qKlxuICogVGhpcyB0eXBlIHJlcHJlc2VudHMgYSBsYW1iZGEgdGhhdCBjYW4gdGFrZSBhbiBBdXRob3JpemF0aW9uUmVxdWVzdCxcbiAqIGFuZCBhbiBBdXRob3JpemF0aW9uUmVzcG9uc2UgYXMgYXJndW1lbnRzLlxuICovXG5leHBvcnQgdHlwZSBBdXRob3JpemF0aW9uTGlzdGVuZXIgPVxuICAgIChyZXF1ZXN0OiBBdXRob3JpemF0aW9uUmVxdWVzdHxzdHJpbmcsXG4gICAgIHJlc3BvbnNlPzogQXV0aG9yaXphdGlvblJlc3BvbnNlfG51bGwsXG4gICAgIGVycm9yPzogQXV0aG9yaXphdGlvbkVycm9yfG51bGwpID0+IHZvaWQ7XG5cbmV4cG9ydCB0eXBlIFdpbmRvd09wZW5lckxpc3RlbmVyID0gKGxpbms6IHN0cmluZykgPT4gdm9pZDtcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgc3RydWN0dXJhbCB0eXBlIGhvbGRpbmcgYm90aCBhdXRob3JpemF0aW9uIHJlcXVlc3QgYW5kIHJlc3BvbnNlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEF1dGhvcml6YXRpb25SZXF1ZXN0UmVzcG9uc2Uge1xuICByZXF1ZXN0OiBBdXRob3JpemF0aW9uUmVxdWVzdDtcbiAgcmVzcG9uc2U6IEF1dGhvcml6YXRpb25SZXNwb25zZXxudWxsO1xuICBlcnJvcjogQXV0aG9yaXphdGlvbkVycm9yfG51bGw7XG59XG5cbi8qKlxuICogQXV0aG9yaXphdGlvbiBTZXJ2aWNlIG5vdGlmaWVyLlxuICogVGhpcyBtYW5hZ2VzIHRoZSBjb21tdW5pY2F0aW9uIG9mIHRoZSBBdXRob3JpemF0aW9uUmVzcG9uc2UgdG8gdGhlIDNwIGNsaWVudC5cbiAqL1xuZXhwb3J0IGNsYXNzIEF1dGhvcml6YXRpb25Ob3RpZmllciB7XG4gIHByaXZhdGUgbGlzdGVuZXI6IEF1dGhvcml6YXRpb25MaXN0ZW5lcnxudWxsID0gbnVsbDtcblxuICBzZXRBdXRob3JpemF0aW9uTGlzdGVuZXIobGlzdGVuZXI6IEF1dGhvcml6YXRpb25MaXN0ZW5lcikge1xuICAgIHRoaXMubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYXV0aG9yaXphdGlvbiBjb21wbGV0ZSBjYWxsYmFjay5cbiAgICovXG4gIG9uQXV0aG9yaXphdGlvbkNvbXBsZXRlKFxuICAgICAgcmVxdWVzdDogQXV0aG9yaXphdGlvblJlcXVlc3QsXG4gICAgICByZXNwb25zZTogQXV0aG9yaXphdGlvblJlc3BvbnNlfG51bGwsXG4gICAgICBlcnJvcjogQXV0aG9yaXphdGlvbkVycm9yfG51bGwpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5saXN0ZW5lcikge1xuICAgICAgLy8gY29tcGxldGUgYXV0aG9yaXphdGlvbiByZXF1ZXN0XG4gICAgICB0aGlzLmxpc3RlbmVyKHJlcXVlc3QsIHJlc3BvbnNlLCBlcnJvcik7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogV2luZG93IG9wZW5lciBub3RpZmllci5cbiAqIFRoaXMgbWFuYWdlcyB0aGUgY29tbXVuaWNhdGlvbiBvZiB0aGUgb3BlbmluZyBvZiBhIG5ldyBicm93c2VyIHdpbmRvdy5cbiAqL1xuZXhwb3J0IGNsYXNzIFdpbmRvd09wZW5lck5vdGlmaWVyIHtcbiAgcHJpdmF0ZSBsaXN0ZW5lcjogV2luZG93T3BlbmVyTGlzdGVuZXJ8bnVsbCA9IG51bGw7XG5cbiAgc2V0V2luZG93T3BlbmVyTGlzdGVuZXIobGlzdGVuZXI6IFdpbmRvd09wZW5lckxpc3RlbmVyKSB7XG4gICAgdGhpcy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB9XG5cbiAgb25XaW5kb3dPcGVuKGxpbms6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0aGlzLmxpc3RlbmVyKSB7XG4gICAgICAvLyBjb21wbGV0ZSBhdXRob3JpemF0aW9uIHJlcXVlc3RcbiAgICAgIHRoaXMubGlzdGVuZXIobGluayk7XG4gICAgfVxuICB9XG59XG5cbi8vIFRPRE8ocmFodWxyYXZAKTogYWRkIG1vcmUgYnVpbHQgaW4gcGFyYW1ldGVycy5cbi8qIGJ1aWx0IGluIHBhcmFtZXRlcnMuICovXG5leHBvcnQgY29uc3QgQlVJTFRfSU5fUEFSQU1FVEVSUyA9IFsncmVkaXJlY3RfdXJpJywgJ2NsaWVudF9pZCcsICdyZXNwb25zZV90eXBlJywgJ3N0YXRlJywgJ3Njb3BlJ107XG5cbi8qKlxuICogRGVmaW5lcyB0aGUgaW50ZXJmYWNlIHdoaWNoIGlzIGNhcGFibGUgb2YgaGFuZGxpbmcgYW4gYXV0aG9yaXphdGlvbiByZXF1ZXN0XG4gKiB1c2luZyB2YXJpb3VzIG1ldGhvZHMgKGlmcmFtZSAvIHBvcHVwIC8gZGlmZmVyZW50IHByb2Nlc3MgZXRjLikuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBdXRob3JpemF0aW9uUmVxdWVzdEhhbmRsZXIge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdXRpbHM6IFF1ZXJ5U3RyaW5nVXRpbHMsIHByb3RlY3RlZCBnZW5lcmF0ZVJhbmRvbTogUmFuZG9tR2VuZXJhdG9yKSB7fVxuXG4gIC8vIG5vdGlmaWVyIHNlbmQgdGhlIHJlc3BvbnNlIGJhY2sgdG8gdGhlIGNsaWVudC5cbiAgcHJvdGVjdGVkIG5vdGlmaWVyOiBBdXRob3JpemF0aW9uTm90aWZpZXJ8bnVsbCA9IG51bGw7XG5cbiAgcHJvdGVjdGVkIHdpbmRvd09wZW5lck5vdGlmaWVyOiBXaW5kb3dPcGVuZXJOb3RpZmllcnxudWxsID0gbnVsbDtcblxuICAvKipcbiAgICogQSB1dGlsaXR5IG1ldGhvZCB0byBiZSBhYmxlIHRvIGJ1aWxkIHRoZSBhdXRob3JpemF0aW9uIHJlcXVlc3QgVVJMLlxuICAgKi9cbiAgcHJvdGVjdGVkIGJ1aWxkUmVxdWVzdFVybChcbiAgICAgIGNvbmZpZ3VyYXRpb246IEF1dGhvcml6YXRpb25TZXJ2aWNlQ29uZmlndXJhdGlvbixcbiAgICAgIHJlcXVlc3Q6IEF1dGhvcml6YXRpb25SZXF1ZXN0KSB7XG4gICAgLy8gYnVpbGQgdGhlIHF1ZXJ5IHN0cmluZ1xuICAgIC8vIGNvZXJjZSB0byBhbnkgdHlwZSBmb3IgY29udmVuaWVuY2VcbiAgICBsZXQgcmVxdWVzdE1hcDogU3RyaW5nTWFwID0ge1xuICAgICAgcmVkaXJlY3RfdXJpOiByZXF1ZXN0LnJlZGlyZWN0VXJpLFxuICAgICAgY2xpZW50X2lkOiByZXF1ZXN0LmNsaWVudElkLFxuICAgICAgcmVzcG9uc2VfdHlwZTogcmVxdWVzdC5yZXNwb25zZVR5cGUsXG4gICAgICBzdGF0ZTogcmVxdWVzdC5zdGF0ZSxcbiAgICAgIHNjb3BlOiByZXF1ZXN0LnNjb3BlXG4gICAgfTtcblxuICAgIC8vIGNvcHkgb3ZlciBleHRyYXNcbiAgICBpZiAocmVxdWVzdC5leHRyYXMpIHtcbiAgICAgIGZvciAobGV0IGV4dHJhIGluIHJlcXVlc3QuZXh0cmFzKSB7XG4gICAgICAgIGlmIChyZXF1ZXN0LmV4dHJhcy5oYXNPd25Qcm9wZXJ0eShleHRyYSkpIHtcbiAgICAgICAgICAvLyBjaGVjayBiZWZvcmUgaW5zZXJ0aW5nIHRvIHJlcXVlc3RNYXBcbiAgICAgICAgICBpZiAoQlVJTFRfSU5fUEFSQU1FVEVSUy5pbmRleE9mKGV4dHJhKSA8IDApIHtcbiAgICAgICAgICAgIHJlcXVlc3RNYXBbZXh0cmFdID0gcmVxdWVzdC5leHRyYXNbZXh0cmFdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBxdWVyeSA9IHRoaXMudXRpbHMuc3RyaW5naWZ5KHJlcXVlc3RNYXApO1xuICAgIGxldCBiYXNlVXJsID0gY29uZmlndXJhdGlvbi5hdXRob3JpemF0aW9uRW5kcG9pbnQ7XG4gICAgbGV0IHVybCA9IGAke2Jhc2VVcmx9PyR7cXVlcnl9YDtcbiAgICByZXR1cm4gdXJsO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbXBsZXRlcyB0aGUgYXV0aG9yaXphdGlvbiByZXF1ZXN0IGlmIG5lY2Vzc2FyeSAmIHdoZW4gcG9zc2libGUuXG4gICAqL1xuICBjb21wbGV0ZUF1dGhvcml6YXRpb25SZXF1ZXN0SWZQb3NzaWJsZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAvLyBjYWxsIGNvbXBsZXRlIGF1dGhvcml6YXRpb24gaWYgcG9zc2libGUgdG8gc2VlIHRoZXJlIG1pZ2h0XG4gICAgLy8gYmUgYSByZXNwb25zZSB0aGF0IG5lZWRzIHRvIGJlIGRlbGl2ZXJlZC5cbiAgICBsb2coYENoZWNraW5nIHRvIHNlZSBpZiB0aGVyZSBpcyBhbiBhdXRob3JpemF0aW9uIHJlc3BvbnNlIHRvIGJlIGRlbGl2ZXJlZC5gKTtcbiAgICBpZiAoIXRoaXMubm90aWZpZXIpIHtcbiAgICAgIGxvZyhgTm90aWZpZXIgaXMgbm90IHByZXNlbnQgb24gQXV0aG9yaXphdGlvblJlcXVlc3QgaGFuZGxlci5cbiAgICAgICAgICBObyBkZWxpdmVyeSBvZiByZXN1bHQgd2lsbCBiZSBwb3NzaWJsZWApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb21wbGV0ZUF1dGhvcml6YXRpb25SZXF1ZXN0KCkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgbG9nKGBObyByZXN1bHQgaXMgYXZhaWxhYmxlIHlldC5gKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZXN1bHQgJiYgdGhpcy5ub3RpZmllcikge1xuICAgICAgICB0aGlzLm5vdGlmaWVyLm9uQXV0aG9yaXphdGlvbkNvbXBsZXRlKHJlc3VsdC5yZXF1ZXN0LCByZXN1bHQucmVzcG9uc2UsIHJlc3VsdC5lcnJvcik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgZGVmYXVsdCBBdXRob3JpemF0aW9uIFNlcnZpY2Ugbm90aWZpZXIuXG4gICAqL1xuICBzZXRBdXRob3JpemF0aW9uTm90aWZpZXIobm90aWZpZXI6IEF1dGhvcml6YXRpb25Ob3RpZmllcik6IEF1dGhvcml6YXRpb25SZXF1ZXN0SGFuZGxlciB7XG4gICAgdGhpcy5ub3RpZmllciA9IG5vdGlmaWVyO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHdpbmRvdyBvcGVuIG5vdGlmaWVyLlxuICAgKi9cbiAgc2V0V2luZG93T3BlbmVyTm90aWZpZXIobm90aWZpZXI6IFdpbmRvd09wZW5lck5vdGlmaWVyKTogQXV0aG9yaXphdGlvblJlcXVlc3RIYW5kbGVyIHtcbiAgICB0aGlzLndpbmRvd09wZW5lck5vdGlmaWVyID0gbm90aWZpZXI7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogTWFrZXMgYW4gYXV0aG9yaXphdGlvbiByZXF1ZXN0LlxuICAgKi9cbiAgYWJzdHJhY3QgcGVyZm9ybUF1dGhvcml6YXRpb25SZXF1ZXN0KFxuICAgICAgY29uZmlndXJhdGlvbjogQXV0aG9yaXphdGlvblNlcnZpY2VDb25maWd1cmF0aW9uLFxuICAgICAgcmVxdWVzdDogQXV0aG9yaXphdGlvblJlcXVlc3QpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYW4gYXV0aG9yaXphdGlvbiBmbG93IGNhbiBiZSBjb21wbGV0ZWQsIGFuZCBjb21wbGV0ZXMgaXQuXG4gICAqIFRoZSBoYW5kbGVyIHJldHVybnMgYSBgUHJvbWlzZTxBdXRob3JpemF0aW9uUmVxdWVzdFJlc3BvbnNlPmAgaWYgcmVhZHksIG9yIGEgYFByb21pc2U8bnVsbD5gXG4gICAqIGlmIG5vdCByZWFkeS5cbiAgICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBjb21wbGV0ZUF1dGhvcml6YXRpb25SZXF1ZXN0KCk6IFByb21pc2U8QXV0aG9yaXphdGlvblJlcXVlc3RSZXNwb25zZXxudWxsPjtcbn1cbiJdfQ==