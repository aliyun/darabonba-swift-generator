import Foundation

open class Client : Darabonba_Import.Client {
    protected var _configs: [Darabonba_Import.Config]?

    init(_ config: Darabonba_Import.Config) {
        super.init(config)
        @configs[0] = config
    }

    public func complex1(_ request: ComplexRequest, _ client: Darabonba_Import.Client) -> Darabonba_Import.RuntimeObject {
        request.validate()
        var _runtime: [String:Any] = [
            "timeouted": "retry"
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
                var name: String = "complex"
                var mapVal: [String:String] = [
                    "test": "ok"
                ]
                var moduleModelMapVal: [String:Darabonba_Import.RuntimeObject] = []
                var moduleMapVal: [String:Darabonba_Import.Client] = []
                var modelMapVal: [String:ComplexRequest] = []
                var subModelMapVal: [String:ComplexRequest.Header] = []
                var version: String = "/" + "2019-01-08" + super.pathname
                var mapAccess: String = @API[version]
                __request.protocol = super.protocol
                __request.port = 80
                __request.method = "GET"
                __request.pathname = "/" + super.pathname
                __request.query = Darabonba_Import.Client.query(Tea.Converter::merge([
                    "date": "2019",
                    "access": mapAccess,
                    "test": mapVal["test"]
                ], request.header))
                __request.body = Darabonba_Import.Client.body()
                _lastRequest = _request
                var _response: Tea.Response= Darabonba::doAction(_request, _runtime)
                if (true && true) {
                    return nil
                }
                else if (true || false) {
                    return Darabonba_Import.RuntimeObject([])
                }
                client.print(request, "1")
                client.printAsync(request, "1")
                super.hello(request, [
                    "1",
                    "2"
                ])
                super.hello(nil, nil)
                super.Complex3(nil)
                return RuntimeObject.fromMap([])
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

    public func Complex2(_ request: ComplexRequest, _ str: [String], _ val: [String:String]) -> [String:Any] {
        request.validate()
        var _request: Tea.Resquest = Tea.Resquest()
        var name: String = "complex"
        var config: Darabonba_Import.Config = Darabonba_Import.Config([])
        var client: Darabonba_Import.Client = Darabonba_Import.Client(config)
        __request.protocol = "HTTP"
        __request.port = 80
        __request.method = "GET"
        __request.pathname = "/"
        __request.query = Darabonba_Import.Client.query([
            "date": "2019",
            "version": "2019-01-08",
            "protocol": __request.protocol
        ])
        __request.body = Darabonba_Import.Client.body()
        var _lastRequest: Tea.Resquest = _request
        var _response: Tea.Response= Darabonba::doAction(_request)
    }

    public func Complex3(_ request: ComplexRequest) -> ComplexRequest {
        request.validate()
        var _request: Tea.Resquest = Tea.Resquest()
        var name: String = "complex"
        __request.protocol = super.TemplateString()
        __request.port = 80
        __request.method = "GET"
        __request.pathname = "/"
        __request.query = Darabonba_Import.Client.query([
            "date": "2019"
        ])
        __request.body = Darabonba_Import.Client.body()
        __request.headers["host"] = "hello";
        var _lastRequest: Tea.Resquest = _request
        var _response: Tea.Response= Darabonba::doAction(_request)
        var temp_str: String = "test " + String(100) + " " + String(true)
        var resp: Tea.Response = _response
        var req: Darabonba_Import.Request = Darabonba_Import.Request([
            "accesskey": request.accessKey,
            "region": resp.statusMessage
        ])
        super.array0(request)
        req.accesskey = "accesskey"
        req.accesskey = request.accessKey
        Darabonba_Import.Client.parse(#ComplexRequest::class)
        Darabonba_Import.Client.array(request, "1")
        Darabonba_Import.Client.asyncFunc()
        return ComplexRequest.fromMap(Tea.Converter::merge([], __request.query))
    }

    public func hello(_ request: [String:Any], _ strs: [String]) -> [String] {
        return super.array1()
    }

    public static func print(_ reqeust: Tea.Resquest, _ reqs: [ComplexRequest], _ response: Tea.Response, _ val: [String:String]) -> Darabonba_Import.Request {
        return Request.fromMap([])
    }

    public static func array0(_ req: [String:Any]) -> [Any] {
        var temp: Darabonba_Import.Config = Darabonba_Import.Config([])
        var anyArr: [Darabonba_Import.Config] = [
            temp
        ]
        return [Any]()
    }

    public static func array1() -> [String] {
        return [
            "1"
        ]
    }

    public static func arrayAccess() -> String {
        var configs: [String] = [
            "a",
            "b",
            "c"
        ]
        var config: String = configs[0]
        return config
    }

    public static func arrayAccess2() -> String {
        var data: [String:[String]] = [
            "configs": [
                "a",
                "b",
                "c"
            ]
        ]
        var config: String = data["configs"][0]
        return config
    }

    public static func arrayAccess3(_ request: ComplexRequest) -> String {
        var configVal: String = request.configs.value[0]
        return configVal
    }

    public static func arrayAccess4(_ request: ComplexRequest, _ config: String, _ index: Int32) -> Void {
        request.configs.value[index] = config
    }

    public static func arrayAssign(_ config: String) -> [String] {
        var configs: [String] = [
            "a",
            "b",
            "c"
        ]
        configs[3] = config
        return configs
    }

    public static func arrayAssign2(_ config: String) -> [String] {
        var data: [String:[String]] = [
            "configs": [
                "a",
                "b",
                "c"
            ]
        ]
        data["configs"][3] = config
        return data["configs"]
    }

    public static func arrayAssign3(_ request: ComplexRequest, _ config: String) -> Void {
        request.configs.value[0] = config
    }

    public static func mapAccess(_ request: ComplexRequest) -> String {
        var configInfo: String = request.configs.extra["name"]
        return configInfo
    }

    public static func mapAccess2(_ request: Darabonba_Import.Request) -> String {
        var configInfo: String = request.configs.extra["name"]
        return configInfo
    }

    public static func mapAccess3() -> String {
        var data: [String:[String:String]] = [
            "configs": [
                "value": "string"
            ]
        ]
        return data["configs"]["value"]
    }

    public static func mapAssign(_ request: ComplexRequest, _ name: String) -> Void {
        request.configs.extra["name"] = name;
    }

    public func TemplateString() -> String {
        return "/" + super.protocol
    }

    public func emptyModel() -> Void {
        ComplexRequest()
        ComplexRequest.Header()
    }

    public func tryCatch() -> Void {
        do {
            var str: String = super.TemplateString()
        }
        catch (Tea.SDKRuntimeError var err: Tea.SDKRuntimeError) {
            var error: Tea.ClientError = err
        }
        do {
            var strNoFinal: String = super.TemplateString()
        }
        catch (Tea.SDKRuntimeError var e: Tea.SDKRuntimeError) {
            var errorNoFinal: Tea.ClientError = e
        }
        do {
            var strNoCatch: String = super.TemplateString()
        }
        catch Error(e) { throw e}
    }
}
