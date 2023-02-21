import Foundation
import Tea

public class Test : Tea.TeaModel {
    public var test: String?

    public override init() {
        super.init()
    }

    public init(_ dict: [String: Any]) {
        super.init()
        self.fromMap(dict)
    }

    public override func validate() throws -> Void {
        try self.validateRequired(self.test, "test")
    }

    public override func toMap() -> [String : Any] {
        var map = super.toMap()
        if self.test != nil {
            map["test"] = self.test!
        }
        return map
    }

    public override func fromMap(_ dict: [String: Any]) -> Void {
        if dict.keys.contains("test") && dict["test"] != nil {
            self.test = dict["test"] as! String
        }
    }
}
