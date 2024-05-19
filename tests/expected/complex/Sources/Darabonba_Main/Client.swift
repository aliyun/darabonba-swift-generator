import Foundation
import Tea
import DarabonbaImport

open class Client : DarabonbaImport.Client {
    public var _Strs: [String]?

    public var _compleList: [[String]]?

    public var _endpointMap: [String: String]?

    public var _configs: [DarabonbaImport.Config]?

    public override init(_ config: DarabonbaImport.Config) throws {
        try super.init(config)
        _configs[0] = config as! DarabonbaImport.Config
    }

    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public func complex1(_ request: ComplexRequest, _ client: DarabonbaImport.Client) async throws -> DarabonbaImport.RuntimeObject {
        try request.validate()
        var _runtime: [String: Any] = [
            "timeouted": "retry"
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
                var name: String = "complex"
                var read: InputStream? = nil
                var byt: [UInt8]? = nil
                var moduleModelMapVal: [String: DarabonbaImport.RuntimeObject] = [:]
                var moduleMapVal: [String: DarabonbaImport.Client] = [:]
                var modelMapVal: [String: ComplexRequest] = [:]
                var subModelMapVal: [String: ComplexRequest.Header] = [:]
                var version: String = "/" + "2019-01-08" + (self._pathname ?? "")
                var mapAccess: String = _API[version as! String] ?? ""
                var reqMap: [String: ComplexRequest]? = nil
                var mapString: [String: String] = [
                    "str": request.accessKey ?? ""
                ]
                var inte: Int = 1
                var a: Int = 1
                var b: Int32? = nil
                b = Int32(a)
                var c: Int32 = Int32(a)
                Client.intToInt32(a)
                var mapVal: [String: Any] = [
                    "read": read as! InputStream,
                    "test": "{"test":"ok"}",
                    "b": request.b!,
                    "num": request.Num!,
                    "u16": request.u16!,
                    "u32": request.u32!,
                    "u64": request.u64!,
                    "u16List": request.uint16List ?? [],
                    "u32List": request.uint32List ?? [],
                    "u64List": request.uint64List ?? [],
                    "i64List": request.int64List ?? [],
                    "i16List": request.int16List ?? [],
                    "i32List": request.int32List ?? [],
                    "intList": request.intList ?? [],
                    "stringList": request.stringList ?? [],
                    "i32": request.i32!,
                    "booleantList": request.booleantList ?? [],
                    "floatList": request.floatList ?? [],
                    "float64List": request.f64List ?? [],
                    "f32": request.f32!,
                    "f64": request.f64!,
                    "i64": request.i64!
                ]
                var req: ComplexRequest = ComplexRequest([
                    "b": false,
                    "Num": 10,
                    "i32": a as! Int,
                    "intList": [
                        10,
                        11
                    ],
                    "stringList": [
                        "10",
                        "11"
                    ],
                    "booleantList": [
                        true,
                        false
                    ]
                ])
                self._Strs = request.strs
                _endpointMap[self._protocol ?? ""]
                _endpointMap["test"] = "ok";
                request.strs = self._Strs
                _request.protocol_ = self._protocol ?? ""
                _request.port = 80
                _request.method = "GET"
                _request.pathname = "/" + (self._pathname ?? "")
                _request.query = DarabonbaImport.Client.query(Tea.TeaConverter.merge([
                    "date": "2019",
                    "access": mapAccess as! String,
                    "test": mapVal["test"]!
                ], request.header!))
                _request.body = DarabonbaImport.Client.body()
                var tmp: [String: Any] = Tea.TeaConverter.merge([:], _request.query, _request.headers, _request)
                client.print(request, req.accessKey ?? "")
                _lastRequest = _request
                var _response: Tea.TeaResponse = try await Tea.TeaCore.doAction(_request, _runtime)
                if (true && true) {
                    return nil
                }
                else if (true || false) {
                    return DarabonbaImport.RuntimeObject([:])
                }
                client.print(request, "1")
                try await client.printAsync(request, "1")
                try await hello(request, [
                    "1",
                    "2"
                ], nil)
                try await hello(nil, nil, nil)
                var tmp: [String: Any] = [:]
                return Tea.TeaConverter.fromMap(DarabonbaImport.RuntimeObject(), tmp)
                try await Complex3(nil)
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
    public func Complex2(_ request: ComplexRequest, _ str: [String], _ val: [String: String]) async throws -> [String: Any] {
        try request.validate()
        var _request: Tea.TeaRequest = Tea.TeaRequest()
        var name: String = "complex"
        var config: DarabonbaImport.Config = DarabonbaImport.Config([:])
        var client: DarabonbaImport.Client = try DarabonbaImport.Client(config)
        _request.protocol_ = "HTTP"
        _request.port = 80
        _request.method = "GET"
        _request.pathname = "/"
        _request.query = DarabonbaImport.Client.query([
            "date": "2019",
            "version": "2019-01-08",
            "protocol": _request.protocol_
        ])
        _request.body = DarabonbaImport.Client.body()
        var _lastRequest: Tea.TeaRequest = _request
        var _response: Tea.TeaResponse = try await Tea.TeaCore.doAction(_request)
    }

    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public func ComplexMap() async throws -> [String: Any] {
        var _runtime: [String: Any] = [:]
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

    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public func Complex3(_ request: ComplexRequest) async throws -> ComplexRequest {
        try request.validate()
        var _request: Tea.TeaRequest = Tea.TeaRequest()
        var name: String = "complex"
        _request.protocol_ = try await TemplateString()
        _request.port = 80
        _request.method = "GET"
        _request.pathname = "/"
        _request.query = DarabonbaImport.Client.query([
            "date": "2019"
        ])
        _request.body = DarabonbaImport.Client.body()
        _request.headers["host"] = "hello";
        var _lastRequest: Tea.TeaRequest = _request
        var _response: Tea.TeaResponse = try await Tea.TeaCore.doAction(_request)
        var temp_str: String = "test " + String(100) + " " + String(true)
        var resp: Tea.TeaResponse = _response as! Tea.TeaResponse
        var req: DarabonbaImport.Request = DarabonbaImport.Request([
            "accesskey": request.accessKey ?? "",
            "region": resp.statusMessage ?? ""
        ])
        Client.array0(request)
        req.accesskey = "accesskey"
        req.accesskey = request.accessKey
        DarabonbaImport.Client.parse(ComplexRequest)
        DarabonbaImport.Client.array(request, "1")
        try await DarabonbaImport.Client.asyncFunc()
        try await tryCatch()
        try throwsFunc()
        _response.statusCode
        var tmp: [String: Any] = Tea.TeaConverter.merge([:], _request.query)
        return Tea.TeaConverter.fromMap(ComplexRequest(), tmp)
    }

    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public func hello(_ request: [String: Any], _ strs: [String], _ complexList: [[String]]) async throws -> [String] {
        var a: [[String]]? = nil
        return Client.array1()
    }

    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public static func print(_ reqeust: Tea.TeaRequest?, _ reqs: [ComplexRequest]?, _ response: Tea.TeaResponse?, _ val: [String: String]?) async throws -> DarabonbaImport.Request {
        var tmp: [String: Any] = [:]
        return Tea.TeaConverter.fromMap(DarabonbaImport.Request(), tmp)
    }

    public static func intToInt32(_ a: Int32?) throws -> Void {
        throw Tea.TeaError("Un-implemented")
    }

    public static func array0(_ req: [String: Any]?) -> [Any] {
        var list: [String]? = nil
        list = [
            "test"
        ]
        var temp: DarabonbaImport.Config = DarabonbaImport.Config([:])
        var anyArr: [DarabonbaImport.Config] = [
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
        return config as! String
    }

    public static func arrayAccess2() -> String {
        var data: [String: [String]] = [
            "configs": [
                "a",
                "b",
                "c"
            ]
        ]
        var config: String = data["configs"][0]
        return config as! String
    }

    public static func arrayAccess3(_ request: ComplexRequest?) -> String {
        var configVal: String = request.configs.value[0]
        return configVal as! String
    }

    public static func arrayAccess4(_ request: ComplexRequest?, _ config: String?, _ index: Int32?) -> Void {
        request.configs.value[index] = config as! String
    }

    public static func arrayAssign(_ config: String?) -> [String] {
        var configs: [String] = [
            "a",
            "b",
            "c"
        ]
        configs[3] = config as! String
        return configs as! [String]
    }

    public static func arrayAssign2(_ config: String?) -> [String] {
        var data: [String: [String]] = [
            "configs": [
                "a",
                "b",
                "c"
            ]
        ]
        data["configs"][3] = config as! String
        return data["configs"] ?? []
    }

    public static func arrayAssign3(_ request: ComplexRequest?, _ config: String?) -> Void {
        request.configs.value[0] = config as! String
    }

    public static func mapAccess(_ request: ComplexRequest?) -> String {
        var configInfo: String = request.configs!.extra!["name"] ?? ""
        return configInfo as! String
    }

    public static func mapAccess2(_ request: DarabonbaImport.Request?) -> String {
        var configInfo: String = request.configs!.extra!["name"] ?? ""
        return configInfo as! String
    }

    public static func mapAccess3() -> String {
        var data: [String: [String: String]] = [
            "configs": [
                "value": "string"
            ]
        ]
        return data["configs"]["value"] ?? ""
    }

    public static func mapAccess4(_ request: ComplexRequest?) -> String {
        var key: String = "name"
        var model: String = request.modelMap![key as! String]!
        var configInfo: String = request.configs!.extra![key as! String] ?? ""
        return configInfo as! String
    }

    public static func mapAssign(_ request: ComplexRequest?, _ name: String?) -> Void {
        var map: [String: String] = [:]
        request.configs.extra["name"] = name as! String;
        var key: String = "name"
    }

    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public func TemplateString() async throws -> String {
        return "/\n" + (self._protocol ?? "")
    }

    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public func emptyModel() async throws -> Void {
        ComplexRequest()
        ComplexRequest.Header()
    }

    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public func tryCatch() async throws -> Void {
        do {
            var str: String = try await TemplateString()
        }
        catch {
            if error is Tea.TeaError {
                var err = error as! Tea.TeaError
                var error: Tea.ReuqestError = err as! Tea.ReuqestError
            } else {
                throw error
            }
        }
        defer {
            var final_: String = "ok"
        }
        do {
            var strNoFinal: String = try await TemplateString()
        }
        catch {
            if error is Tea.TeaError {
                var e = error as! Tea.TeaError
                var errorNoFinal: Tea.ReuqestError = e as! Tea.ReuqestError
            } else {
                throw error
            }
        }
        do {
            var strNoCatch: String = try await TemplateString()
        }
        catch { throw error }
        defer {
            var finalNoCatch: String = "ok"
        }
    }

    public func throwsFunc() throws -> String {
        return "/" + (self._protocol ?? "")
    }

    public func throwsFunc1() throws -> String {
        return ""
    }

    public func throwsFunc2() throws -> Void {
        throw Tea.ReuqestError([
            "code": ""
        ])
    }

    public func throwsFunc3() throws -> String {
        throw Tea.ReuqestError([
            "code": ""
        ])
    }

    public static func func_() throws -> String {
        throw Tea.TeaError("Un-implemented")
    }
}
