import Foundation
import Tea
import DarabonbaImport

public class A : Tea.TeaModel {
    public var m: [String: String]?

    public var str: String?

    public override init() {
        super.init()
    }

    public init(_ dict: [String: Any]) {
        super.init()
        self.fromMap(dict)
    }

    public override func validate() throws -> Void {
        try self.validateRequired(self.m, "m")
        try self.validateRequired(self.str, "str")
    }

    public override func toMap() -> [String : Any] {
        var map = super.toMap()
        if self.m != nil {
            map["m"] = self.m!
        }
        if self.str != nil {
            map["str"] = self.str!
        }
        return map
    }

    public override func fromMap(_ dict: [String: Any?]?) -> Void {
        guard let dict else { return }
        if let value = dict["m"] as? [String: String] {
            self.m = value
        }
        if let value = dict["str"] as? String {
            self.str = value
        }
    }
}

public class B : Tea.TeaModel {
    public var mm: [A]?

    public override init() {
        super.init()
    }

    public init(_ dict: [String: Any]) {
        super.init()
        self.fromMap(dict)
    }

    public override func validate() throws -> Void {
        try self.validateRequired(self.mm, "mm")
    }

    public override func toMap() -> [String : Any] {
        var map = super.toMap()
        if self.mm != nil {
            var tmp : [Any] = []
            for k in self.mm! {
                tmp.append(k.toMap())
            }
            map["mm"] = tmp
        }
        return map
    }

    public override func fromMap(_ dict: [String: Any?]?) -> Void {
        guard let dict else { return }
        if let value = dict["mm"] as? [Any?] {
            var tmp : [A] = []
            for v in value {
                if v != nil {
                    var model = A()
                    if v != nil {
                        model.fromMap(v as? [String: Any?])
                    }
                    tmp.append(model)
                }
            }
            self.mm = tmp
        }
    }
}
