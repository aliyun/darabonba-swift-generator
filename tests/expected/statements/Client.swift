// This file is auto-generated, don't edit it. Thanks.

import Foundation
import Tea

open class Client {
    public init(config:Config) {
        super.init(config.toMap())
    }

    public func hello() throws {
        var request_ = TeaRequest()
        var _lastRequest = request_
        request_.method = "GET"
        request_.pathname = "/"
        request_.headers = [
            "host": "www.test.com"
        ]
        if true {
            request_.headers["host"] = "www.test2.com"
        }
        let response_ = TeaCore.doAction(request_)
        Client.helloIf()
        return nil
    }

    public func helloIf() throws {
    }

    public func helloThrow() throws {
    }

    public func helloForBreak() throws {
    }

    public func helloWhile() throws {
    }

    public func helloDeclare() throws {
    }
}
