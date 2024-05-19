import Foundation
import Tea

open class Client {
    public init() throws {
    }

    public func isSet(_ a: Any) -> Bool {
        return true
    }

    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public func test() async throws -> Void {
        var res: Response = Response([:])
        var test: String = "test1" + (res.body!.name ?? "") + String(res.body!.len!)
        var req: Request = Request([:])
        req.b = res.body!.name
        req.b = "test2" + (res.body!.name ?? "") + String(res.body!.len!)
        var a: String = res.body!.name ?? ""
        if (isSet(res.body!)) {
            var b: String = res.body!.name ?? ""
        }
    }
}
