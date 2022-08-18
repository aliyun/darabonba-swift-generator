import Foundation
import Tea

open class Client {
    public init() throws {
    }

    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public func hello() async throws -> Void {
        var _request: Tea.TeaRequest = Tea.TeaRequest()
        _request.method = "GET"
        _request.pathname = "/"
        _request.headers = [
            "host": "www.test.com"
        ]
        var _lastRequest: Tea.TeaRequest = _request
        var _response: Tea.TeaResponse = try await Tea.TeaCore.doAction(_request)
        return nil
    }

    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public func helloRuntime() async throws -> Void {
        var _runtime: [String: Any] = [
            "timeouted": "retry",
            "ignoreSSL": true,
            "keepAlive": false
        ]
        var _lastRequest: Tea.TeaRequest? = nil
        var _lastException: Tea.TeaError? = nil
        var _now: Int32 = Tea.TeaCore.timeNow()
        var _retryTimes: Int32 = 0
        while (Tea.TeaCore.allowRetry(_runtime["retry"], _retryTimes, _now)) {
            if (_retryTimes > 0) {
                var _backoffTime: Int32 = Tea.TeaCore.getBackoffTime(_runtime["backoff"], _retryTimes)
                if (_backoffTime > 0) {
                    Tea.TeaCore.sleep(_backoffTime)
                }
            }
            _retryTimes = _retryTimes + 1
            do {
                var _request: Tea.TeaRequest = Tea.TeaRequest()
                _request.method = "GET"
                _request.pathname = "/"
                _request.headers = [
                    "host": "www.test.com"
                ]
                _lastRequest = _request
                var _response: Tea.TeaResponse = try await Tea.TeaCore.doAction(_request, _runtime)
                throw Tea.ReuqestError([
                    "code": _response.statusCode,
                    "message": "message",
                    "data": [
                        "test": "test"
                    ]
                ])
            }
            catch {
                if (Tea.TeaCore.isRetryable(error)) {
                    _lastException = error as! Tea.RetryableError
                    continue
                }
                throw error
            }
        }
        throw Tea.UnretryableError(_lastRequest, _lastException)
    }
}
