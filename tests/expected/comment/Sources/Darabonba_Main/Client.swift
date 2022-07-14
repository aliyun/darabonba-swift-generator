import Foundation
import Tea
import DarabonbaImport

open class Client {

    public var _a: [String]?

    init() throws -> {
        var str: String = "sss"
        var modelInstance: Test1 = Test1([
            "test": "test",
            "undefined": ,
            "test2": "test2",
            "undefined": 
        ])
        var array: [Any] = [
            "string",
            300
        ]
    }

    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public func testAPI() async throws -> Void {
        var _runtime: [String: Any] = [
            "undefined": ,
            "undefined": 
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
                var modelInstance: Test1 = Test1([
                    "undefined": ,
                    "test": "test",
                    "undefined": ,
                    "test2": "test2"
                ])
                var num: Int32 = 123
                staticFunc()
                _lastRequest = _request
                var _response: Tea.TeaResponse = try await Tea.TeaCore.doAction(_request, _runtime)
                try await testFunc("test", true)
                return nil
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

    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public func testAPI2() async throws -> Void {
        var _runtime: [String: Any] = [
            "undefined": ,
            "retry": true,
            "undefined": ,
            "undefined": 
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
                var modelInstance: Test3 = Test3([
                    "undefined": 
                ])
                var bool: Bool = true
                if (bool) {
                }
                else {
                }
                try await testAPI()
                _lastRequest = _request
                var _response: Tea.TeaResponse = try await Tea.TeaCore.doAction(_request, _runtime)
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

    public static func staticFunc() -> Void {
        var a: [Any] = [
        ]
    }

    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public static func testFunc(_ str: String?, _ val: Bool?) async throws -> Void {
    }
}
