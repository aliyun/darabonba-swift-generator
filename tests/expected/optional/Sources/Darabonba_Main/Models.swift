import Foundation
import Tea

public class Request : Tea.TeaModel {
    public var a: [String: String]?

    public var b: String?

    public var c: Int?

    public override init() {
        super.init()
    }

    public init(_ dict: [String: Any]) {
        super.init()
        self.fromMap(dict)
    }

    public override func validate() throws -> Void {
    }

    public override func toMap() -> [String : Any] {
        var map = super.toMap()
        if self.a != nil {
            map["a"] = self.a!
        }
        if self.b != nil {
            map["b"] = self.b!
        }
        if self.c != nil {
            map["c"] = self.c!
        }
        return map
    }

    public override func fromMap(_ dict: [String: Any?]?) -> Void {
        guard let dict else { return }
        if let value = dict["a"] as? [String: String] {
            self.a = value
        }
        if let value = dict["b"] as? String {
            self.b = value
        }
        if let value = dict["c"] as? Int {
            self.c = value
        }
    }
}

public class Response : Tea.TeaModel {
    public class Body : Tea.TeaModel {
        public var name: String?

        public var len: Int64?

        public override init() {
            super.init()
        }

        public init(_ dict: [String: Any]) {
            super.init()
            self.fromMap(dict)
        }

        public override func validate() throws -> Void {
        }

        public override func toMap() -> [String : Any] {
            var map = super.toMap()
            if self.name != nil {
                map["name"] = self.name!
            }
            if self.len != nil {
                map["len"] = self.len!
            }
            return map
        }

        public override func fromMap(_ dict: [String: Any?]?) -> Void {
            guard let dict else { return }
            if let value = dict["name"] as? String {
                self.name = value
            }
            if let value = dict["len"] as? Int64 {
                self.len = value
            }
        }
    }
    public var header: [String: String]?

    public var body: Response.Body?

    public override init() {
        super.init()
    }

    public init(_ dict: [String: Any]) {
        super.init()
        self.fromMap(dict)
    }

    public override func validate() throws -> Void {
        try self.body?.validate()
    }

    public override func toMap() -> [String : Any] {
        var map = super.toMap()
        if self.header != nil {
            map["header"] = self.header!
        }
        if self.body != nil {
            map["body"] = self.body?.toMap()
        }
        return map
    }

    public override func fromMap(_ dict: [String: Any?]?) -> Void {
        guard let dict else { return }
        if let value = dict["header"] as? [String: String] {
            self.header = value
        }
        if let value = dict["body"] as? [String: Any?] {
            var model = Response.Body()
            model.fromMap(value)
            self.body = model
        }
    }
}
