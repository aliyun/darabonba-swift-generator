import Foundation

public class A : Tea.Model {
    public var m: [String:String]?

    public var str: String?
}

public class B : Tea.Model {
    public var mm: [A]?
}
