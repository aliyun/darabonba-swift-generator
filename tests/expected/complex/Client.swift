// This file is auto-generated, don't edit it. Thanks.

import Foundation
import Source
import Tea

open class Client {
    public init(config:Config) {
        super.init(config.toMap())
        super._protocol = config.protocol_
    }

    public func Complex1(request:ComplexRequest, client:Source) throws {
        try! request.validate()
        try! client.validate()
        var runtime_:[String:Any] = [
            "timeouted": "retry"
        ]
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
                var name:String = "complex"
                mapVal = [
                    "test": "ok"
                ]
                request_.protocol_ = super._protocol
                request_.port = request.num
                request_.method = "GET"
                request_.pathname = "/" + super._pathname + ""
                request_.query = [
                    "date": "2019"
                ]
                let response_ = TeaCore.doAction(request_, runtime_)
                if true && true {
                    return nil
                }
                else if true || false {
                    return Source.RuntimeObject()
                }
                client.print(request, "1")
                super.hello(request, [
                    "1",
                    "2"
                ])
                super.hello(nil, nil)
                return nil
                super.Complex3(nil)
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

    public func Complex2(request:ComplexRequest, str:[String], val:TeaModel) throws {
        try! request.validate()
        var request_ = TeaRequest()
        var _lastRequest = request_
        var name:String = "complex"
        var config = Source.Config()
        var client = Source(config)
        request_.protocol_ = "HTTP"
        request_.port = 80
        request_.method = "GET"
        request_.pathname = "/"
        request_.query = [
            "date": "2019",
            "protocol": request_.protocol_
        ]
        let response_ = TeaCore.doAction(request_)
    }

    public func Complex3(request:ComplexRequest) throws {
        try! request.validate()
        var request_ = TeaRequest()
        var _lastRequest = request_
        var name:String = "complex"
        request_.protocol_ = super.templateString()
        request_.port = 80
        request_.method = "GET"
        request_.pathname = "/"
        request_.body = "body"
        request_.query = [
            "date": "2019"
        ]
        let response_ = TeaCore.doAction(request_)
        var resp = response_
        var req = Source.Request(var , )
        Client.array0(request)
        req.accesskey = "accesskey"
        req.accesskey = request.accessKey
        Client.printNull()
        Source(request, "1").array(request, "1")
        return TeaModel.toModel(TeaConverter.merge(
            request_.query!
        ), ComplexRequest()) as? ComplexRequest
    }

    public func hello(request:[String:AnyObject], strs:[String]) throws {
    }

    public func print(reqeust:TeaRequest, reqs:[ComplexRequest], response:TeaResponse, val:TeaModel) throws {
    }

    public func printNull() throws {
    }

    public func array0(req:[String:AnyObject]) throws {
    }

    public func array1() throws {
    }

    public func templateString() throws {
    }
}
