import Foundation

public class M : Tea.Model {
    public class SubM : Tea.Model {
    }
    public var subM: M.SubM?
}

public class Class_ : Tea.Model {
}

public class MyModel : Tea.Model {
    public class Submodel : Tea.Model {
        public var stringfield: String?
    }
    public class Subarraymodel : Tea.Model {
    }
    public var stringfield: String?

    public var bytesfield: [UInt8]?

    public var stringarrayfield: [String]?

    public var mapfield: [String:String]?

    public var name: String?

    public var submodel: MyModel.Submodel?

    public var submodelMap: [String:MyModel.Submodel]?

    public var mapModel: [String:M]?

    public var subarraymodel: [MyModel.Subarraymodel]?

    public var subarray: [M]?

    public var maparray: [[String:Any]]?

    public var moduleModelMap: [String:Darabonba_Import.Request]?

    public var subModelMap: [String:M.SubM]?

    public var modelMap: [String:M]?

    public var moduleMap: [String:Darabonba_Import.Client]?

    public var object: [String:Any]?

    public var readable: Stream?

    public var writable: Stream?

    public var existModel: M?

    public var request: Tea.Resquest?

    public var complexList: [[String]]?

    public var numberfield: Int?

    public var integerField: Int32?

    public var floatField: Double?

    public var doubleField: Double?

    public var longField: Int64?

    public var ulongField: Int64?

    public var int8Field: Int32?

    public var int16Field: Int32?

    public var int32Field: Int32?

    public var int64Field: Int64?

    public var uint8Field: Int32?

    public var uint16Field: Int32?

    public var uint32Field: Int32?

    public var uint64Field: Int64?

    public var link: String?
}
