import Foundation

open class Client {
    protected var _a: String?

    init() {
    }

    public func testAPI() -> Void {
        var _runtime: [String:Any] = []
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
                _lastRequest = _request
                var _response: Tea.Response= Darabonba::doAction(_request, _runtime)
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

    public static func testFunc() -> Void {
    }
}
