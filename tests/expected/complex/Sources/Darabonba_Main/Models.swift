import Foundation

public class ComplexRequest : Tea.Model {
    public class Header : Tea.Model {
        public var content: String?
    }
    public class Configs : Tea.Model {
        public var key: String?

        public var value: [String]?

        public var extra: [String:String]?
    }
    public class Part : Tea.Model {
        public var partNumber: String?
    }
    public var duplicatName: Darabonba_Import.Complexrequest?

    public var accessKey: String?

    public var body: Stream?

    public var strs: [String]?

    public var header: ComplexRequest.Header?

    public var Num: Int?

    public var configs: ComplexRequest.Configs?

    public var part: [ComplexRequest.Part]?
}
