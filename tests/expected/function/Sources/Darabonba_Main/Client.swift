import Foundation

open class Client {
    public static func hello() -> Void {
        return nil
    }

    public static func helloMap() -> [String:String] {
        var m: [String:String] = []
        return Tea.Converter::merge([
            "key": "value",
            "key-1": "value-1"
        ], m)
    }

    public static func helloArrayMap() -> [[String:String]] {
        return [
            [
                "key": "value"
            ]
        ]
    }

    public static func helloParams(_ a: String, _ b: String) -> Void {
        var x: Bool = false
        var y: Bool = true
        var z: Bool = false
        if (x && y || !z) {}
    }

    public static func helloInterface() -> Void {
        throw Tea.SDKRuntimeError('Un-implemented')
    }
}
