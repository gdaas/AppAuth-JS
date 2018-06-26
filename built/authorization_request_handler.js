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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aG9yaXphdGlvbl9yZXF1ZXN0X2hhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYXV0aG9yaXphdGlvbl9yZXF1ZXN0X2hhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7R0FZRzs7QUFNSCxtQ0FBNkI7QUF3QjdCOzs7R0FHRztBQUNIO0lBQUE7UUFDVSxhQUFRLEdBQStCLElBQUksQ0FBQztJQWtCdEQsQ0FBQztJQWhCQyx3REFBd0IsR0FBeEIsVUFBeUIsUUFBK0I7UUFDdEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDM0IsQ0FBQztJQUVEOztPQUVHO0lBQ0gsdURBQXVCLEdBQXZCLFVBQ0ksT0FBNkIsRUFDN0IsUUFBb0MsRUFDcEMsS0FBOEI7UUFDaEMsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLGlDQUFpQztZQUNqQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDekM7SUFDSCxDQUFDO0lBQ0gsNEJBQUM7QUFBRCxDQUFDLEFBbkJELElBbUJDO0FBbkJZLHNEQUFxQjtBQXFCbEM7OztHQUdHO0FBQ0g7SUFBQTtRQUNVLGFBQVEsR0FBOEIsSUFBSSxDQUFDO0lBWXJELENBQUM7SUFWQyxzREFBdUIsR0FBdkIsVUFBd0IsUUFBOEI7UUFDcEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDM0IsQ0FBQztJQUVELDJDQUFZLEdBQVosVUFBYSxJQUFZO1FBQ3ZCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixpQ0FBaUM7WUFDakMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNyQjtJQUNILENBQUM7SUFDSCwyQkFBQztBQUFELENBQUMsQUFiRCxJQWFDO0FBYlksb0RBQW9CO0FBZWpDLGlEQUFpRDtBQUNqRCwwQkFBMEI7QUFDYixRQUFBLG1CQUFtQixHQUFHLENBQUMsY0FBYyxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBRXBHOzs7R0FHRztBQUNIO0lBQ0UscUNBQW1CLEtBQXVCLEVBQVksY0FBK0I7UUFBbEUsVUFBSyxHQUFMLEtBQUssQ0FBa0I7UUFBWSxtQkFBYyxHQUFkLGNBQWMsQ0FBaUI7UUFFckYsaURBQWlEO1FBQ3ZDLGFBQVEsR0FBK0IsSUFBSSxDQUFDO1FBRTVDLHlCQUFvQixHQUE4QixJQUFJLENBQUM7SUFMdUIsQ0FBQztJQU96Rjs7T0FFRztJQUNPLHFEQUFlLEdBQXpCLFVBQ0ksYUFBZ0QsRUFDaEQsT0FBNkI7UUFDL0IseUJBQXlCO1FBQ3pCLHFDQUFxQztRQUNyQyxJQUFJLFVBQVUsR0FBYztZQUMxQixZQUFZLEVBQUUsT0FBTyxDQUFDLFdBQVc7WUFDakMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxRQUFRO1lBQzNCLGFBQWEsRUFBRSxPQUFPLENBQUMsWUFBWTtZQUNuQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUs7WUFDcEIsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLO1NBQ3JCLENBQUM7UUFFRixtQkFBbUI7UUFDbkIsSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFO1lBQ2xCLEtBQUssSUFBSSxLQUFLLElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRTtnQkFDaEMsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDeEMsdUNBQXVDO29CQUN2QyxJQUFJLDJCQUFtQixDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7d0JBQzFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO3FCQUMzQztpQkFDRjthQUNGO1NBQ0Y7UUFFRCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM3QyxJQUFJLE9BQU8sR0FBRyxhQUFhLENBQUMscUJBQXFCLENBQUM7UUFDbEQsSUFBSSxHQUFHLEdBQU0sT0FBTyxTQUFJLEtBQU8sQ0FBQztRQUNoQyxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFRDs7T0FFRztJQUNILDRFQUFzQyxHQUF0QztRQUFBLGlCQWdCQztRQWZDLDZEQUE2RDtRQUM3RCw0Q0FBNEM7UUFDNUMsWUFBRyxDQUFDLHdFQUF3RSxDQUFDLENBQUM7UUFDOUUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEIsWUFBRyxDQUFDLDRHQUN1QyxDQUFDLENBQUM7U0FDOUM7UUFDRCxPQUFPLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFBLE1BQU07WUFDcEQsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDWCxZQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQzthQUNwQztZQUNELElBQUksTUFBTSxJQUFJLEtBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQzNCLEtBQUksQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUN0RjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0gsOERBQXdCLEdBQXhCLFVBQXlCLFFBQStCO1FBQ3RELElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzNCLENBQUM7SUFFRDs7T0FFRztJQUNILDZEQUF1QixHQUF2QixVQUF3QixRQUE4QjtRQUNwRCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsUUFBUSxDQUFDO1FBQ3JDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQWVILGtDQUFDO0FBQUQsQ0FBQyxBQTNGRCxJQTJGQztBQTNGcUIsa0VBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBJbmMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHRcbiAqIGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGVcbiAqIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyXG4gKiBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7QXV0aG9yaXphdGlvblJlcXVlc3QsIEF1dGhvcml6YXRpb25SZXF1ZXN0SnNvbn0gZnJvbSAnLi9hdXRob3JpemF0aW9uX3JlcXVlc3QnO1xuaW1wb3J0IHtBdXRob3JpemF0aW9uRXJyb3IsIEF1dGhvcml6YXRpb25FcnJvckpzb24sIEF1dGhvcml6YXRpb25SZXNwb25zZSwgQXV0aG9yaXphdGlvblJlc3BvbnNlSnNvbn0gZnJvbSAnLi9hdXRob3JpemF0aW9uX3Jlc3BvbnNlJztcbmltcG9ydCB7QXV0aG9yaXphdGlvblNlcnZpY2VDb25maWd1cmF0aW9ufSBmcm9tICcuL2F1dGhvcml6YXRpb25fc2VydmljZV9jb25maWd1cmF0aW9uJztcbmltcG9ydCB7Y3J5cHRvR2VuZXJhdGVSYW5kb20sIFJhbmRvbUdlbmVyYXRvcn0gZnJvbSAnLi9jcnlwdG9fdXRpbHMnO1xuaW1wb3J0IHtsb2d9IGZyb20gJy4vbG9nZ2VyJztcbmltcG9ydCB7UXVlcnlTdHJpbmdVdGlsc30gZnJvbSAnLi9xdWVyeV9zdHJpbmdfdXRpbHMnO1xuaW1wb3J0IHtTdHJpbmdNYXB9IGZyb20gJy4vdHlwZXMnO1xuXG4vKipcbiAqIFRoaXMgdHlwZSByZXByZXNlbnRzIGEgbGFtYmRhIHRoYXQgY2FuIHRha2UgYW4gQXV0aG9yaXphdGlvblJlcXVlc3QsXG4gKiBhbmQgYW4gQXV0aG9yaXphdGlvblJlc3BvbnNlIGFzIGFyZ3VtZW50cy5cbiAqL1xuZXhwb3J0IHR5cGUgQXV0aG9yaXphdGlvbkxpc3RlbmVyID1cbiAgICAocmVxdWVzdDogQXV0aG9yaXphdGlvblJlcXVlc3QsXG4gICAgIHJlc3BvbnNlOiBBdXRob3JpemF0aW9uUmVzcG9uc2V8bnVsbCxcbiAgICAgZXJyb3I6IEF1dGhvcml6YXRpb25FcnJvcnxudWxsKSA9PiB2b2lkO1xuXG5leHBvcnQgdHlwZSBXaW5kb3dPcGVuZXJMaXN0ZW5lciA9IChsaW5rOiBzdHJpbmcpID0+IHZvaWQ7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIHN0cnVjdHVyYWwgdHlwZSBob2xkaW5nIGJvdGggYXV0aG9yaXphdGlvbiByZXF1ZXN0IGFuZCByZXNwb25zZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBdXRob3JpemF0aW9uUmVxdWVzdFJlc3BvbnNlIHtcbiAgcmVxdWVzdDogQXV0aG9yaXphdGlvblJlcXVlc3Q7XG4gIHJlc3BvbnNlOiBBdXRob3JpemF0aW9uUmVzcG9uc2V8bnVsbDtcbiAgZXJyb3I6IEF1dGhvcml6YXRpb25FcnJvcnxudWxsO1xufVxuXG4vKipcbiAqIEF1dGhvcml6YXRpb24gU2VydmljZSBub3RpZmllci5cbiAqIFRoaXMgbWFuYWdlcyB0aGUgY29tbXVuaWNhdGlvbiBvZiB0aGUgQXV0aG9yaXphdGlvblJlc3BvbnNlIHRvIHRoZSAzcCBjbGllbnQuXG4gKi9cbmV4cG9ydCBjbGFzcyBBdXRob3JpemF0aW9uTm90aWZpZXIge1xuICBwcml2YXRlIGxpc3RlbmVyOiBBdXRob3JpemF0aW9uTGlzdGVuZXJ8bnVsbCA9IG51bGw7XG5cbiAgc2V0QXV0aG9yaXphdGlvbkxpc3RlbmVyKGxpc3RlbmVyOiBBdXRob3JpemF0aW9uTGlzdGVuZXIpIHtcbiAgICB0aGlzLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGF1dGhvcml6YXRpb24gY29tcGxldGUgY2FsbGJhY2suXG4gICAqL1xuICBvbkF1dGhvcml6YXRpb25Db21wbGV0ZShcbiAgICAgIHJlcXVlc3Q6IEF1dGhvcml6YXRpb25SZXF1ZXN0LFxuICAgICAgcmVzcG9uc2U6IEF1dGhvcml6YXRpb25SZXNwb25zZXxudWxsLFxuICAgICAgZXJyb3I6IEF1dGhvcml6YXRpb25FcnJvcnxudWxsKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubGlzdGVuZXIpIHtcbiAgICAgIC8vIGNvbXBsZXRlIGF1dGhvcml6YXRpb24gcmVxdWVzdFxuICAgICAgdGhpcy5saXN0ZW5lcihyZXF1ZXN0LCByZXNwb25zZSwgZXJyb3IpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFdpbmRvdyBvcGVuZXIgbm90aWZpZXIuXG4gKiBUaGlzIG1hbmFnZXMgdGhlIGNvbW11bmljYXRpb24gb2YgdGhlIG9wZW5pbmcgb2YgYSBuZXcgYnJvd3NlciB3aW5kb3cuXG4gKi9cbmV4cG9ydCBjbGFzcyBXaW5kb3dPcGVuZXJOb3RpZmllciB7XG4gIHByaXZhdGUgbGlzdGVuZXI6IFdpbmRvd09wZW5lckxpc3RlbmVyfG51bGwgPSBudWxsO1xuXG4gIHNldFdpbmRvd09wZW5lckxpc3RlbmVyKGxpc3RlbmVyOiBXaW5kb3dPcGVuZXJMaXN0ZW5lcikge1xuICAgIHRoaXMubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgfVxuXG4gIG9uV2luZG93T3BlbihsaW5rOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5saXN0ZW5lcikge1xuICAgICAgLy8gY29tcGxldGUgYXV0aG9yaXphdGlvbiByZXF1ZXN0XG4gICAgICB0aGlzLmxpc3RlbmVyKGxpbmspO1xuICAgIH1cbiAgfVxufVxuXG4vLyBUT0RPKHJhaHVscmF2QCk6IGFkZCBtb3JlIGJ1aWx0IGluIHBhcmFtZXRlcnMuXG4vKiBidWlsdCBpbiBwYXJhbWV0ZXJzLiAqL1xuZXhwb3J0IGNvbnN0IEJVSUxUX0lOX1BBUkFNRVRFUlMgPSBbJ3JlZGlyZWN0X3VyaScsICdjbGllbnRfaWQnLCAncmVzcG9uc2VfdHlwZScsICdzdGF0ZScsICdzY29wZSddO1xuXG4vKipcbiAqIERlZmluZXMgdGhlIGludGVyZmFjZSB3aGljaCBpcyBjYXBhYmxlIG9mIGhhbmRsaW5nIGFuIGF1dGhvcml6YXRpb24gcmVxdWVzdFxuICogdXNpbmcgdmFyaW91cyBtZXRob2RzIChpZnJhbWUgLyBwb3B1cCAvIGRpZmZlcmVudCBwcm9jZXNzIGV0Yy4pLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQXV0aG9yaXphdGlvblJlcXVlc3RIYW5kbGVyIHtcbiAgY29uc3RydWN0b3IocHVibGljIHV0aWxzOiBRdWVyeVN0cmluZ1V0aWxzLCBwcm90ZWN0ZWQgZ2VuZXJhdGVSYW5kb206IFJhbmRvbUdlbmVyYXRvcikge31cblxuICAvLyBub3RpZmllciBzZW5kIHRoZSByZXNwb25zZSBiYWNrIHRvIHRoZSBjbGllbnQuXG4gIHByb3RlY3RlZCBub3RpZmllcjogQXV0aG9yaXphdGlvbk5vdGlmaWVyfG51bGwgPSBudWxsO1xuXG4gIHByb3RlY3RlZCB3aW5kb3dPcGVuZXJOb3RpZmllcjogV2luZG93T3BlbmVyTm90aWZpZXJ8bnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEEgdXRpbGl0eSBtZXRob2QgdG8gYmUgYWJsZSB0byBidWlsZCB0aGUgYXV0aG9yaXphdGlvbiByZXF1ZXN0IFVSTC5cbiAgICovXG4gIHByb3RlY3RlZCBidWlsZFJlcXVlc3RVcmwoXG4gICAgICBjb25maWd1cmF0aW9uOiBBdXRob3JpemF0aW9uU2VydmljZUNvbmZpZ3VyYXRpb24sXG4gICAgICByZXF1ZXN0OiBBdXRob3JpemF0aW9uUmVxdWVzdCkge1xuICAgIC8vIGJ1aWxkIHRoZSBxdWVyeSBzdHJpbmdcbiAgICAvLyBjb2VyY2UgdG8gYW55IHR5cGUgZm9yIGNvbnZlbmllbmNlXG4gICAgbGV0IHJlcXVlc3RNYXA6IFN0cmluZ01hcCA9IHtcbiAgICAgIHJlZGlyZWN0X3VyaTogcmVxdWVzdC5yZWRpcmVjdFVyaSxcbiAgICAgIGNsaWVudF9pZDogcmVxdWVzdC5jbGllbnRJZCxcbiAgICAgIHJlc3BvbnNlX3R5cGU6IHJlcXVlc3QucmVzcG9uc2VUeXBlLFxuICAgICAgc3RhdGU6IHJlcXVlc3Quc3RhdGUsXG4gICAgICBzY29wZTogcmVxdWVzdC5zY29wZVxuICAgIH07XG5cbiAgICAvLyBjb3B5IG92ZXIgZXh0cmFzXG4gICAgaWYgKHJlcXVlc3QuZXh0cmFzKSB7XG4gICAgICBmb3IgKGxldCBleHRyYSBpbiByZXF1ZXN0LmV4dHJhcykge1xuICAgICAgICBpZiAocmVxdWVzdC5leHRyYXMuaGFzT3duUHJvcGVydHkoZXh0cmEpKSB7XG4gICAgICAgICAgLy8gY2hlY2sgYmVmb3JlIGluc2VydGluZyB0byByZXF1ZXN0TWFwXG4gICAgICAgICAgaWYgKEJVSUxUX0lOX1BBUkFNRVRFUlMuaW5kZXhPZihleHRyYSkgPCAwKSB7XG4gICAgICAgICAgICByZXF1ZXN0TWFwW2V4dHJhXSA9IHJlcXVlc3QuZXh0cmFzW2V4dHJhXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgcXVlcnkgPSB0aGlzLnV0aWxzLnN0cmluZ2lmeShyZXF1ZXN0TWFwKTtcbiAgICBsZXQgYmFzZVVybCA9IGNvbmZpZ3VyYXRpb24uYXV0aG9yaXphdGlvbkVuZHBvaW50O1xuICAgIGxldCB1cmwgPSBgJHtiYXNlVXJsfT8ke3F1ZXJ5fWA7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wbGV0ZXMgdGhlIGF1dGhvcml6YXRpb24gcmVxdWVzdCBpZiBuZWNlc3NhcnkgJiB3aGVuIHBvc3NpYmxlLlxuICAgKi9cbiAgY29tcGxldGVBdXRob3JpemF0aW9uUmVxdWVzdElmUG9zc2libGUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgLy8gY2FsbCBjb21wbGV0ZSBhdXRob3JpemF0aW9uIGlmIHBvc3NpYmxlIHRvIHNlZSB0aGVyZSBtaWdodFxuICAgIC8vIGJlIGEgcmVzcG9uc2UgdGhhdCBuZWVkcyB0byBiZSBkZWxpdmVyZWQuXG4gICAgbG9nKGBDaGVja2luZyB0byBzZWUgaWYgdGhlcmUgaXMgYW4gYXV0aG9yaXphdGlvbiByZXNwb25zZSB0byBiZSBkZWxpdmVyZWQuYCk7XG4gICAgaWYgKCF0aGlzLm5vdGlmaWVyKSB7XG4gICAgICBsb2coYE5vdGlmaWVyIGlzIG5vdCBwcmVzZW50IG9uIEF1dGhvcml6YXRpb25SZXF1ZXN0IGhhbmRsZXIuXG4gICAgICAgICAgTm8gZGVsaXZlcnkgb2YgcmVzdWx0IHdpbGwgYmUgcG9zc2libGVgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY29tcGxldGVBdXRob3JpemF0aW9uUmVxdWVzdCgpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgIGxvZyhgTm8gcmVzdWx0IGlzIGF2YWlsYWJsZSB5ZXQuYCk7XG4gICAgICB9XG4gICAgICBpZiAocmVzdWx0ICYmIHRoaXMubm90aWZpZXIpIHtcbiAgICAgICAgdGhpcy5ub3RpZmllci5vbkF1dGhvcml6YXRpb25Db21wbGV0ZShyZXN1bHQucmVxdWVzdCwgcmVzdWx0LnJlc3BvbnNlLCByZXN1bHQuZXJyb3IpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGRlZmF1bHQgQXV0aG9yaXphdGlvbiBTZXJ2aWNlIG5vdGlmaWVyLlxuICAgKi9cbiAgc2V0QXV0aG9yaXphdGlvbk5vdGlmaWVyKG5vdGlmaWVyOiBBdXRob3JpemF0aW9uTm90aWZpZXIpOiB2b2lkIHtcbiAgICB0aGlzLm5vdGlmaWVyID0gbm90aWZpZXI7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgd2luZG93IG9wZW4gbm90aWZpZXIuXG4gICAqL1xuICBzZXRXaW5kb3dPcGVuZXJOb3RpZmllcihub3RpZmllcjogV2luZG93T3BlbmVyTm90aWZpZXIpOiBBdXRob3JpemF0aW9uUmVxdWVzdEhhbmRsZXIge1xuICAgIHRoaXMud2luZG93T3BlbmVyTm90aWZpZXIgPSBub3RpZmllcjtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlcyBhbiBhdXRob3JpemF0aW9uIHJlcXVlc3QuXG4gICAqL1xuICBhYnN0cmFjdCBwZXJmb3JtQXV0aG9yaXphdGlvblJlcXVlc3QoXG4gICAgICBjb25maWd1cmF0aW9uOiBBdXRob3JpemF0aW9uU2VydmljZUNvbmZpZ3VyYXRpb24sXG4gICAgICByZXF1ZXN0OiBBdXRob3JpemF0aW9uUmVxdWVzdCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhbiBhdXRob3JpemF0aW9uIGZsb3cgY2FuIGJlIGNvbXBsZXRlZCwgYW5kIGNvbXBsZXRlcyBpdC5cbiAgICogVGhlIGhhbmRsZXIgcmV0dXJucyBhIGBQcm9taXNlPEF1dGhvcml6YXRpb25SZXF1ZXN0UmVzcG9uc2U+YCBpZiByZWFkeSwgb3IgYSBgUHJvbWlzZTxudWxsPmBcbiAgICogaWYgbm90IHJlYWR5LlxuICAgKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IGNvbXBsZXRlQXV0aG9yaXphdGlvblJlcXVlc3QoKTogUHJvbWlzZTxBdXRob3JpemF0aW9uUmVxdWVzdFJlc3BvbnNlfG51bGw+O1xufVxuIl19