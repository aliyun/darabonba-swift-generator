import Foundation
import Tea

open class Client {
    public var _test: String?

    public init() throws {
    }

    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public func hello(_ body: String) async throws -> Void {
        var _request: Tea.TeaRequest = Tea.TeaRequest()
        _request.method = "GET"
        _request.pathname = "/"
        _request.headers = [
            "host": "www.test.com"
        ]
        _request.body = Tea.TeaCore.toReadable("test")
        var test: String? = nil
        _request.body = Tea.TeaCore.toReadable(test as! String)
        _request.body = Tea.TeaCore.toReadable(body as! String)
        if (true) {
            _request.headers["host"] = "www.test2.com";
        }
        var _lastRequest: Tea.TeaRequest = _request
        var _response: Tea.TeaResponse = try await Tea.TeaCore.doAction(_request)
        if (true) {
            throw Tea.RetryableError()
        }
        else {
            true
        }
        Client.helloIf()
        !false
        var a: String? = nil
        a = "string"
        return nil
    }

    public static func helloIf() -> Void {
        if (true) {}
        if (true) {}
        else if (true) {}
        else {}
    }

    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public func helloAsync() async throws -> Void {
        var test: String = self._test ?? ""
        self._test = "test"
        helloSync(self._test ?? "")
        Client.helloDeclare(self._test)
    }

    public func helloSync(_ test: String) -> Void {
        var str: String = test as! String
    }

    public static func helloThrow() throws -> Void {
        throw Tea.ReuqestError([:])
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

    public static func helloDeclare(_ test: String?) -> String {
        var hello: String = "world"
        var helloNull: String? = nil
        hello = "hehe"
        return test as! String
    }

    public static func trycatch() throws -> Void {
        do {
            var a: String = "test"
        }
        catch {
            if error is Tea.TeaError {
                var b: String = "test"
                var e: Tea.ReuqestError = error as! Tea.ReuqestError
            } else {
                throw error
            }
        }
        defer {
            var c: String = "test"
        }
    }
}
