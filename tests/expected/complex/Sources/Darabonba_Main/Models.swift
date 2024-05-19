import Foundation
import Tea
import DarabonbaImport

public class ComplexRequest : Tea.TeaModel {
    public class Header : Tea.TeaModel {
        public var content: String?

        public override init() {
            super.init()
        }

        public init(_ dict: [String: Any]) {
            super.init()
            self.fromMap(dict)
        }

        public override func validate() throws -> Void {
            try self.validateRequired(self.content, "content")
        }

        public override func toMap() -> [String : Any] {
            var map = super.toMap()
            if self.content != nil {
                map["Content"] = self.content!
            }
            return map
        }

        public override func fromMap(_ dict: [String: Any]) -> Void {
            if dict.keys.contains("Content") {
                self.content = dict["Content"] as! String
            }
        }
    }
    public class Configs : Tea.TeaModel {
        public var key: String?

        public var value: [String]?

        public var extra: [String: String]?

        public override init() {
            super.init()
        }

        public init(_ dict: [String: Any]) {
            super.init()
            self.fromMap(dict)
        }

        public override func validate() throws -> Void {
            try self.validateRequired(self.key, "key")
            try self.validateRequired(self.value, "value")
            try self.validateRequired(self.extra, "extra")
        }

        public override func toMap() -> [String : Any] {
            var map = super.toMap()
            if self.key != nil {
                map["key"] = self.key!
            }
            if self.value != nil {
                map["value"] = self.value!
            }
            if self.extra != nil {
                map["extra"] = self.extra!
            }
            return map
        }

        public override func fromMap(_ dict: [String: Any]) -> Void {
            if dict.keys.contains("key") {
                self.key = dict["key"] as! String
            }
            if dict.keys.contains("value") {
                self.value = dict["value"] as! [String]
            }
            if dict.keys.contains("extra") {
                self.extra = dict["extra"] as! [String: String]
            }
        }
    }
    public class Part : Tea.TeaModel {
        public var partNumber: String?

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
            if self.partNumber != nil {
                map["PartNumber"] = self.partNumber!
            }
            return map
        }

        public override func fromMap(_ dict: [String: Any]) -> Void {
            if dict.keys.contains("PartNumber") {
                self.partNumber = dict["PartNumber"] as! String
            }
        }
    }
    public class ComplexList : Tea.TeaModel {
        public var name: String?

        public var code: Int32?

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
                map["Name"] = self.name!
            }
            if self.code != nil {
                map["Code"] = self.code!
            }
            return map
        }

        public override func fromMap(_ dict: [String: Any]) -> Void {
            if dict.keys.contains("Name") {
                self.name = dict["Name"] as! String
            }
            if dict.keys.contains("Code") {
                self.code = dict["Code"] as! Int32
            }
        }
    }
    public var duplicatName: DarabonbaImport.Complexrequest?

    public var accessKey: String?

    public var body: InputStream?

    public var strs: [String]?

    public var header: ComplexRequest.Header?

    public var Num: Int?

    public var configs: ComplexRequest.Configs?

    public var part: [ComplexRequest.Part]?

    public var i64: Int64?

    public var f64: Double?

    public var b: Bool?

    public var f32: Double?

    public var f64List: [Double]?

    public var floatList: [Double]?

    public var booleantList: [Bool]?

    public var i32: Int32?

    public var stringList: [String]?

    public var intList: [Int]?

    public var int32List: [Int32]?

    public var int16List: [Int32]?

    public var int64List: [Int64]?

    public var uint64List: [Int64]?

    public var uint32List: [Int32]?

    public var uint16List: [Int32]?

    public var u64: Int64?

    public var u32: Int32?

    public var u16: Int32?

    public var obj: [String: Any]?

    public var any: Any?

    public var byt: [UInt8]?

    public var req: Tea.TeaRequest?

    public var resp: Tea.TeaResponse?

    public var map: [String: String]?

    public var anyMap: [String: Any]?

    public var numMap: [String: Int]?

    public var modelMap: [String: DarabonbaImport.Request]?

    public var request: DarabonbaImport.Request?

    public var client: DarabonbaImport.Client?

    public var instance: DarabonbaImport.Request.Instance?

    public var complexList: [[[ComplexRequest.ComplexList]]]?

    public var complexList1: [[[String: String]]]?

    public override init() {
        super.init()
    }

    public init(_ dict: [String: Any]) {
        super.init()
        self.fromMap(dict)
    }

    public override func validate() throws -> Void {
        try self.validateRequired(self.duplicatName, "duplicatName")
        try self.duplicatName?.validate()
        try self.validateRequired(self.accessKey, "accessKey")
        try self.validateRequired(self.body, "body")
        try self.validateRequired(self.strs, "strs")
        try self.validateRequired(self.header, "header")
        try self.header?.validate()
        try self.validateRequired(self.Num, "Num")
        try self.validateRequired(self.configs, "configs")
        try self.configs?.validate()
        try self.validateRequired(self.i64, "i64")
        try self.validateRequired(self.f64, "f64")
        try self.validateRequired(self.b, "b")
        try self.validateRequired(self.f32, "f32")
        try self.validateRequired(self.f64List, "f64List")
        try self.validateRequired(self.floatList, "floatList")
        try self.validateRequired(self.booleantList, "booleantList")
        try self.validateRequired(self.i32, "i32")
        try self.validateRequired(self.stringList, "stringList")
        try self.validateRequired(self.intList, "intList")
        try self.validateRequired(self.int32List, "int32List")
        try self.validateRequired(self.int16List, "int16List")
        try self.validateRequired(self.int64List, "int64List")
        try self.validateRequired(self.uint64List, "uint64List")
        try self.validateRequired(self.uint32List, "uint32List")
        try self.validateRequired(self.uint16List, "uint16List")
        try self.validateRequired(self.u64, "u64")
        try self.validateRequired(self.u32, "u32")
        try self.validateRequired(self.u16, "u16")
        try self.validateRequired(self.obj, "obj")
        try self.validateRequired(self.any, "any")
        try self.validateRequired(self.byt, "byt")
        try self.validateRequired(self.req, "req")
        try self.req?.validate()
        try self.validateRequired(self.resp, "resp")
        try self.resp?.validate()
        try self.validateRequired(self.map, "map")
        try self.validateRequired(self.anyMap, "anyMap")
        try self.validateRequired(self.numMap, "numMap")
        try self.validateRequired(self.modelMap, "modelMap")
        try self.validateRequired(self.request, "request")
        try self.request?.validate()
        try self.validateRequired(self.client, "client")
        try self.validateRequired(self.instance, "instance")
        try self.instance?.validate()
        try self.validateRequired(self.complexList, "complexList")
        try self.validateRequired(self.complexList1, "complexList1")
    }

    public override func toMap() -> [String : Any] {
        var map = super.toMap()
        if self.duplicatName != nil {
            map["duplicatName"] = self.duplicatName?.toMap()
        }
        if self.accessKey != nil {
            map["accessKey"] = self.accessKey!
        }
        if self.body != nil {
            map["Body"] = self.body!
        }
        if self.strs != nil {
            map["Strs"] = self.strs!
        }
        if self.header != nil {
            map["header"] = self.header?.toMap()
        }
        if self.Num != nil {
            map["Num"] = self.Num!
        }
        if self.configs != nil {
            map["configs"] = self.configs?.toMap()
        }
        if self.part != nil {
            var tmp : [Any] = []
            for k in self.part! {
                tmp.append(k.toMap())
            }
            map["Part"] = tmp
        }
        if self.i64 != nil {
            map["i64"] = self.i64!
        }
        if self.f64 != nil {
            map["f64"] = self.f64!
        }
        if self.b != nil {
            map["b"] = self.b!
        }
        if self.f32 != nil {
            map["f32"] = self.f32!
        }
        if self.f64List != nil {
            map["f64List"] = self.f64List!
        }
        if self.floatList != nil {
            map["floatList"] = self.floatList!
        }
        if self.booleantList != nil {
            map["booleantList"] = self.booleantList!
        }
        if self.i32 != nil {
            map["i32"] = self.i32!
        }
        if self.stringList != nil {
            map["stringList"] = self.stringList!
        }
        if self.intList != nil {
            map["intList"] = self.intList!
        }
        if self.int32List != nil {
            map["int32List"] = self.int32List!
        }
        if self.int16List != nil {
            map["int16List"] = self.int16List!
        }
        if self.int64List != nil {
            map["int64List"] = self.int64List!
        }
        if self.uint64List != nil {
            map["uint64List"] = self.uint64List!
        }
        if self.uint32List != nil {
            map["uint32List"] = self.uint32List!
        }
        if self.uint16List != nil {
            map["uint16List"] = self.uint16List!
        }
        if self.u64 != nil {
            map["u64"] = self.u64!
        }
        if self.u32 != nil {
            map["u32"] = self.u32!
        }
        if self.u16 != nil {
            map["u16"] = self.u16!
        }
        if self.obj != nil {
            map["obj"] = self.obj!
        }
        if self.any != nil {
            map["any"] = self.any!
        }
        if self.byt != nil {
            map["byt"] = self.byt!
        }
        if self.req != nil {
            map["req"] = self.req?.toMap()
        }
        if self.resp != nil {
            map["resp"] = self.resp?.toMap()
        }
        if self.map != nil {
            map["map"] = self.map!
        }
        if self.anyMap != nil {
            map["anyMap"] = self.anyMap!
        }
        if self.numMap != nil {
            map["numMap"] = self.numMap!
        }
        if self.modelMap != nil {
            var tmp : [String: Any] = [:]
            for (k, v) in self.modelMap! {
                tmp[k] = v.toMap()
            }
            map["modelMap"] = tmp
        }
        if self.request != nil {
            map["request"] = self.request?.toMap()
        }
        if self.client != nil {
            map["client"] = self.client!
        }
        if self.instance != nil {
            map["instance"] = self.instance?.toMap()
        }
        if self.complexList != nil {
            var tmp : [Any] = []
            for k in self.complexList! {
                var l1 : [Any] = []
                for k1 in k {
                    var l2 : [Any] = []
                    for k2 in k1 {
                        l2.append(k2.toMap())
                    }
                    l1.append(l2)
                }
                tmp.append(l1)
            }
            map["complexList"] = tmp
        }
        if self.complexList1 != nil {
            map["complexList1"] = self.complexList1!
        }
        return map
    }

    public override func fromMap(_ dict: [String: Any]) -> Void {
        if dict.keys.contains("duplicatName") {
            var model = DarabonbaImport.Complexrequest()
            model.fromMap(dict["duplicatName"] as! [String: Any])
            self.duplicatName = model
        }
        if dict.keys.contains("accessKey") {
            self.accessKey = dict["accessKey"] as! String
        }
        if dict.keys.contains("Body") {
            self.body = dict["Body"] as! InputStream
        }
        if dict.keys.contains("Strs") {
            self.strs = dict["Strs"] as! [String]
        }
        if dict.keys.contains("header") {
            var model = ComplexRequest.Header()
            model.fromMap(dict["header"] as! [String: Any])
            self.header = model
        }
        if dict.keys.contains("Num") {
            self.Num = dict["Num"] as! Int
        }
        if dict.keys.contains("configs") {
            var model = ComplexRequest.Configs()
            model.fromMap(dict["configs"] as! [String: Any])
            self.configs = model
        }
        if dict.keys.contains("Part") {
            var tmp : [ComplexRequest.Part] = []
            for v in dict["Part"] as! [Any] {
                var model = ComplexRequest.Part()
                if v != nil {
                    model.fromMap(v as! [String: Any])
                }
                tmp.append(model)
            }
            self.part = tmp
        }
        if dict.keys.contains("i64") {
            self.i64 = dict["i64"] as! Int64
        }
        if dict.keys.contains("f64") {
            self.f64 = dict["f64"] as! Double
        }
        if dict.keys.contains("b") {
            self.b = dict["b"] as! Bool
        }
        if dict.keys.contains("f32") {
            self.f32 = dict["f32"] as! Double
        }
        if dict.keys.contains("f64List") {
            self.f64List = dict["f64List"] as! [Double]
        }
        if dict.keys.contains("floatList") {
            self.floatList = dict["floatList"] as! [Double]
        }
        if dict.keys.contains("booleantList") {
            self.booleantList = dict["booleantList"] as! [Bool]
        }
        if dict.keys.contains("i32") {
            self.i32 = dict["i32"] as! Int32
        }
        if dict.keys.contains("stringList") {
            self.stringList = dict["stringList"] as! [String]
        }
        if dict.keys.contains("intList") {
            self.intList = dict["intList"] as! [Int]
        }
        if dict.keys.contains("int32List") {
            self.int32List = dict["int32List"] as! [Int32]
        }
        if dict.keys.contains("int16List") {
            self.int16List = dict["int16List"] as! [Int32]
        }
        if dict.keys.contains("int64List") {
            self.int64List = dict["int64List"] as! [Int64]
        }
        if dict.keys.contains("uint64List") {
            self.uint64List = dict["uint64List"] as! [Int64]
        }
        if dict.keys.contains("uint32List") {
            self.uint32List = dict["uint32List"] as! [Int32]
        }
        if dict.keys.contains("uint16List") {
            self.uint16List = dict["uint16List"] as! [Int32]
        }
        if dict.keys.contains("u64") {
            self.u64 = dict["u64"] as! Int64
        }
        if dict.keys.contains("u32") {
            self.u32 = dict["u32"] as! Int32
        }
        if dict.keys.contains("u16") {
            self.u16 = dict["u16"] as! Int32
        }
        if dict.keys.contains("obj") {
            self.obj = dict["obj"] as! [String: Any]
        }
        if dict.keys.contains("any") {
            self.any = dict["any"] as! Any
        }
        if dict.keys.contains("byt") {
            self.byt = dict["byt"] as! [UInt8]
        }
        if dict.keys.contains("req") {
            var model = Tea.TeaRequest()
            model.fromMap(dict["req"] as! [String: Any])
            self.req = model
        }
        if dict.keys.contains("resp") {
            var model = Tea.TeaResponse()
            model.fromMap(dict["resp"] as! [String: Any])
            self.resp = model
        }
        if dict.keys.contains("map") {
            self.map = dict["map"] as! [String: String]
        }
        if dict.keys.contains("anyMap") {
            self.anyMap = dict["anyMap"] as! [String: Any]
        }
        if dict.keys.contains("numMap") {
            self.numMap = dict["numMap"] as! [String: Int]
        }
        if dict.keys.contains("modelMap") {
            var tmp : [String: DarabonbaImport.Request] = [:]
            for (k, v) in dict["modelMap"] as! [String: Any] {
                if v != nil {
                    var model = DarabonbaImport.Request()
                    model.fromMap(v as! [String: Any])
                    tmp[k] = model
                }
            }
            self.modelMap = tmp
        }
        if dict.keys.contains("request") {
            var model = DarabonbaImport.Request()
            model.fromMap(dict["request"] as! [String: Any])
            self.request = model
        }
        if dict.keys.contains("client") {
            self.client = dict["client"] as! DarabonbaImport.Client
        }
        if dict.keys.contains("instance") {
            var model = DarabonbaImport.Request.Instance()
            model.fromMap(dict["instance"] as! [String: Any])
            self.instance = model
        }
        if dict.keys.contains("complexList") {
            var tmp : [[[ComplexRequest.ComplexList]]] = []
            for v in dict["complexList"] as! [Any] {
                var l1 : [[ComplexRequest.ComplexList]] = []
                for v1 in v as! [Any] {
                    var l2 : [ComplexRequest.ComplexList] = []
                    for v2 in v1 as! [Any] {
                        var model = ComplexRequest.ComplexList()
                        if v2 != nil {
                            model.fromMap(v2 as! [String: Any])
                        }
                        l2.append(model)
                    }
                    l1.append(l2)
                }
                tmp.append(l1)
            }
            self.complexList = tmp
        }
        if dict.keys.contains("complexList1") {
            self.complexList1 = dict["complexList1"] as! [[[String: String]]]
        }
    }
}

public class Response : Tea.TeaModel {
    public var instance: ComplexRequest.Part?

    public override init() {
        super.init()
    }

    public init(_ dict: [String: Any]) {
        super.init()
        self.fromMap(dict)
    }

    public override func validate() throws -> Void {
        try self.validateRequired(self.instance, "instance")
        try self.instance?.validate()
    }

    public override func toMap() -> [String : Any] {
        var map = super.toMap()
        if self.instance != nil {
            map["instance"] = self.instance?.toMap()
        }
        return map
    }

    public override func fromMap(_ dict: [String: Any]) -> Void {
        if dict.keys.contains("instance") {
            var model = ComplexRequest.Part()
            model.fromMap(dict["instance"] as! [String: Any])
            self.instance = model
        }
    }
}
