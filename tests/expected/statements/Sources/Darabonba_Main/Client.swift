import Foundation

open class Client {
    init() {
    }

    public func hello() -> Void {
        var _request: Tea.Resquest = Tea.Resquest()
        __request.method = "GET"
        __request.pathname = "/"
        __request.headers = [
            "host": "www.test.com"
        ]
        if (true) {
            __request.headers["host"] = "www.test2.com";
        }
        var _lastRequest: Tea.Resquest = _request
        var _response: Tea.Response= Darabonba::doAction(_request)
        if (true) {
            throw TeaError.runtimeError(_request, _response)
        }
        else {
            true
        }
        super.helloIf()
        !false
        var a: String = nil
        a = "string"
        return nil
    }

    public static func helloIf() -> Void {
        if (true) {}
        if (true) {}
        else if (true) {}
        else {}
    }

    public static func helloThrow() -> Void {
        throw Tea.ClientError([])
    }

    public static func helloForBreak() -> Void {
        for item in [Any]() {
            break
        }
    }

    public static func helloWhile() -> Void {
        while (true) {
            break
        }
    }

    public static func helloDeclare() -> Void {
        var hello: String = "world"
        var helloNull: String = nil
        hello = "hehe"
    }
}
