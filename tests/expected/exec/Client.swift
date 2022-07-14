#!/usr/bin/env xcrun swift

import Cocoa
import Foundation
import Tea

open class Client {
    public static func test(_ str: String?) throws -> String {
        return str + "\n"
    }

    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public static func main(_ args: [String]?) async throws -> Void {
        var str: String = "test"
        str = try test(str)
    }
}

Client.main(CommandLine.arguments)
