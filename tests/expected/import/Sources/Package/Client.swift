import Foundation
import Tea
import Import
import Pack

open class Client {
    public var _id: [String]?

    public var _str: String?

    public var _model: Pack.Local?

    public init(_ id: [String], _ str: String) throws {
        self._id = id
        self._str = str
        throw Tea.ReuqestError([
            "code": "SomeError",
            "messge": "ErrorMessage"
        ])
    }

    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public func testClient() async throws -> Void {
        var tmp: Import.Client? = nil
        tmp = try Import.Client()
    }

    public static func Sample(_ client: Import.Client?) -> Void {
        var runtime: Import.RuntimeObject = Import.RuntimeObject([:])
        var request: Import.Request = Import.Request([
            "accesskey": "accesskey",
            "region": "region"
        ])
        client.print(runtime as! Import.RuntimeObject)
    }
}
