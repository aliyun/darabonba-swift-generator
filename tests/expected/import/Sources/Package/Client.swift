import Foundation
import Tea
import Import
import Pack

open class Client {
    public var _id: [String]?

    public var _str: String?

    public var _model: Pack.Local?

    init(_ id: [String], _ str: String) throws -> {
        self._id = id as! [String]
        self._str = str as! String
        throw Tea.ReuqestError([
            "code": "SomeError",
            "messge": "ErrorMessage"
        ])
    }

    public static func Sample(_ client: Import.Client?) -> Void {
        var runtime: Import.RuntimeObject = Import.RuntimeObject([:])
        var request: Import.Request = Import.Request([
            "accesskey": "accesskey",
            "region": "region"
        ])
        client.print(runtime)
    }
}
