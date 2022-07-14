import Foundation
import Tea

open class Client {
    public static func hello() -> Void {
        return nil
    }

    public static func helloMap() -> [String: String] {
        var m: [String: String] = [:]
        return Tea.TeaConverter.merge([
            "key": "value",
            "key-1": "value-1"
        ], m)
    }

    public static func helloArrayMap() -> [[String: String]] {
        return [
            [
                "key": "value"
            ]
        ]
    }

    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public static func helloParams(_ a: String?, _ b: String?) async throws -> Void {
        var x: Bool = false
        var y: Bool = true
        var z: Bool = false
        if (x && y || !z) {}
    }

    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public static func helloInterface() async throws -> Void {
        throw Tea.TeaError("Un-implemented")
    }

    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public static func helloTest(_ a: String?) async throws -> String {
        return a as! String
    }

    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public static func equalString(_ a: String?, _ b: String?) async throws -> Bool {
        return true
    }

    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public static func helloTestNestReturn(_ a: String?, _ b: String?) async throws -> Bool {
        return try await equalString(try await helloTest(a), try await helloTest(b))
    }

    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public static func helloTestNestDeclar(_ a: String?, _ b: String?) async throws -> Bool {
        var tmp: Bool = try await equalString(try await helloTest(a), try await helloTest(b))
        return tmp as! Bool
    }

    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public static func helloTestNestIf(_ a: String?, _ b: String?) async throws -> Bool {
        if (try await equalString(try await helloTest(a), try await helloTest(b))) {
            return true
        }
        return false
    }

    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public static func helloTestNestFor(_ a: String?, _ b: String?) async throws -> Bool {
        while (try await equalString(try await helloTest(a), try await helloTest(b))) {
            return true
        }
        return false
    }

    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public static func helloTestNestFor1(_ a: String?, _ b: String?) async throws -> Bool {
        while (try await equalString(try await helloTest(a), try await helloTest(b))) {
            return true
        }
        return false
    }

    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public static func throwsFunc1() async throws -> Void {
        throw Tea.ReuqestError([
            "code": ""
        ])
    }

    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public static func throwsFunc2() async throws -> Void {
        try await throwsFunc1()
    }
}
