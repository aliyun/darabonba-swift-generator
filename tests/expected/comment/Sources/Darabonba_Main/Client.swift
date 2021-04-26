import Foundation

open class Client {

    protected var _a: [String]?

    init() {
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

    public func testAPI() -> Void {
        var _runtime: [String:Any] = [
            "undefined": ,
            "undefined": 
        ]
        var _lastRequest: Tea.Resquest = nil
        var _lastException: Tea.SDKRuntimeError = nil
        var _now: Int32 = Tea.timeNow()
        var _retryTimes: Int32 = 0
        while (Darabonba.allowRetry(_runtime["retry"], _retryTimes, _now)) {
            if (_retryTimes > 0) {
                var _backoffTime: Int32 = Darabonba.getBackoffTime(_runtime["backoff"], _retryTimes)
                if (_backoffTime > 0) {
                    Darabonba.sleep(_backoffTime)
                }
            }
            _retryTimes = _retryTimes + 1
            do {
                var _request: Tea.Resquest = Tea.Resquest()
                var modelInstance: Test1 = Test1([
                    "undefined": ,
                    "test": "test",
                    "undefined": ,
                    "test2": "test2"
                ])
                var num: Int32 = 123
                super.staticFunc()
                _lastRequest = _request
                var _response: Tea.Response= Darabonba::doAction(_request, _runtime)
                super.testFunc("test", true)
                return nil
            }
            catch (Tea.SDKRuntimeError var e: Tea.SDKRuntimeError) {
                if (Darabonba.isRetryable(e)) {
                    _lastException = e
                    continue
                }
                throw e
            }
        }
        throw Tea.RequestUnretryableError(_lastRequest, _lastException)
    }

    public func testAPI2() -> Void {
        var _runtime: [String:Any] = [
            "undefined": ,
            "retry": true,
            "undefined": ,
            "undefined": 
        ]
        var _lastRequest: Tea.Resquest = nil
        var _lastException: Tea.SDKRuntimeError = nil
        var _now: Int32 = Tea.timeNow()
        var _retryTimes: Int32 = 0
        while (Darabonba.allowRetry(_runtime["retry"], _retryTimes, _now)) {
            if (_retryTimes > 0) {
                var _backoffTime: Int32 = Darabonba.getBackoffTime(_runtime["backoff"], _retryTimes)
                if (_backoffTime > 0) {
                    Darabonba.sleep(_backoffTime)
                }
            }
            _retryTimes = _retryTimes + 1
            do {
                var _request: Tea.Resquest = Tea.Resquest()
                var modelInstance: Test3 = Test3([
                    "undefined": 
                ])
                var bool: Bool = true
                if (bool) {
                }
                else {
                }
                super.testAPI()
                _lastRequest = _request
                var _response: Tea.Response= Darabonba::doAction(_request, _runtime)
            }
            catch (Tea.SDKRuntimeError var e: Tea.SDKRuntimeError) {
                if (Darabonba.isRetryable(e)) {
                    _lastException = e
                    continue
                }
                throw e
            }
        }
        throw Tea.RequestUnretryableError(_lastRequest, _lastException)
    }

    public static func staticFunc() -> Void {
        var a: [Any] = [
        ]
    }

    public static func testFunc(_ str: String, _ val: Bool) -> Void {
    }
}
