// This file is auto-generated, don't edit it. Thanks.

import Foundation
import Tea

open class Client {
    public init(config:Config) {
        super.init(config.toMap())
    }

    public func hello() throws {
        var request_ = TeaRequest()
        var _lastRequest = request_
        request_.method = "GET"
        request_.pathname = "/"
        request_.headers = [
            "host": "www.test.com"
        ]
        let response_ = TeaCore.doAction(request_)
        return nil
    }

    public func helloRuntime() throws {
        var runtime_:[String:Any] = []
        var _lastRequest:TeaRequest? = nil
        var _now:Int32 = Int32(Date().timeIntervalSince1970)
        var _retryTimes:Int = 0
        while TeaCore.allowRetry(runtime_["retry"], _retryTimes, _now) {
            if _retryTimes > 0 {
                var _backoffTime:Int = TeaCore.getBackoffTime(runtime_["backoff"], _retryTimes)
                if _backoffTime > 0 {
                    TeaCore.sleep(_backoffTime)
                }
            }
            _retryTimes = _retryTimes + 1
            do {
                var request_ = TeaRequest()
                _lastRequest = request_
                request_.method = "GET"
                request_.pathname = "/"
                request_.headers = [
                    "host": "www.test.com"
                ]
                test = nil
                test = [
                    "key": "value"
                ]
                let response_ = TeaCore.doAction(request_, runtime_)
                return nil
            }
            catch let e as TeaException {
                if TeaCore.isRetryable(e) {
                    continue
                }
                throw e
            }
        }
        throw TeaException.Unretryable(_lastRequest)
    }

    public func helloVirtualCall(m:M) throws {
        try! m.validate()
        var request_ = TeaRequest()
        var _lastRequest = request_
        request_.method = "GET"
        request_.pathname = "/"
        request_.headers = [
            "key": ""
        ]
        let response_ = TeaCore.doAction(request_)
        return nil
    }
}
