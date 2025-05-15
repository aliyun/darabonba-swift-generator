import Foundation
import Tea
import DarabonbaImport

public class Protocol_ : Tea.TeaModel {
    public class Test : Tea.TeaModel {
        public var m: M?

        public override init() {
            super.init()
        }

        public init(_ dict: [String: Any]) {
            super.init()
            self.fromMap(dict)
        }

        public override func validate() throws -> Void {
            try self.validateRequired(self.m, "m")
            try self.m?.validate()
        }

        public override func toMap() -> [String : Any] {
            var map = super.toMap()
            if self.m != nil {
                map["m"] = self.m?.toMap()
            }
            return map
        }

        public override func fromMap(_ dict: [String: Any?]?) -> Void {
            guard let dict else { return }
            if let value = dict["m"] as? [String: Any?] {
                var model = M()
                model.fromMap(value)
                self.m = model
            }
        }
    }
    public var Test: Protocol_.Test?

    public override init() {
        super.init()
    }

    public init(_ dict: [String: Any]) {
        super.init()
        self.fromMap(dict)
    }

    public override func validate() throws -> Void {
        try self.validateRequired(self.Test, "Test")
        try self.Test?.validate()
    }

    public override func toMap() -> [String : Any] {
        var map = super.toMap()
        if self.Test != nil {
            map["Test"] = self.Test?.toMap()
        }
        return map
    }

    public override func fromMap(_ dict: [String: Any?]?) -> Void {
        guard let dict else { return }
        if let value = dict["Test"] as? [String: Any?] {
            var model = Protocol_.Test()
            model.fromMap(value)
            self.Test = model
        }
    }
}

public class M : Tea.TeaModel {
    public class SubM : Tea.TeaModel {

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
            return map
        }

        public override func fromMap(_ dict: [String: Any?]?) -> Void {
            guard let dict else { return }
        }
    }
    public var subM: M.SubM?

    public override init() {
        super.init()
    }

    public init(_ dict: [String: Any]) {
        super.init()
        self.fromMap(dict)
    }

    public override func validate() throws -> Void {
        try self.validateRequired(self.subM, "subM")
        try self.subM?.validate()
    }

    public override func toMap() -> [String : Any] {
        var map = super.toMap()
        if self.subM != nil {
            map["subM"] = self.subM?.toMap()
        }
        return map
    }

    public override func fromMap(_ dict: [String: Any?]?) -> Void {
        guard let dict else { return }
        if let value = dict["subM"] as? [String: Any?] {
            var model = M.SubM()
            model.fromMap(value)
            self.subM = model
        }
    }
}

public class Class_ : Tea.TeaModel {

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
        return map
    }

    public override func fromMap(_ dict: [String: Any?]?) -> Void {
        guard let dict else { return }
    }
}

public class MyModel : Tea.TeaModel {
    public class Submodel : Tea.TeaModel {
        public var stringfield: String?

        public override init() {
            super.init()
        }

        public init(_ dict: [String: Any]) {
            super.init()
            self.fromMap(dict)
        }

        public override func validate() throws -> Void {
            try self.validateRequired(self.stringfield, "stringfield")
        }

        public override func toMap() -> [String : Any] {
            var map = super.toMap()
            if self.stringfield != nil {
                map["stringfield"] = self.stringfield!
            }
            return map
        }

        public override func fromMap(_ dict: [String: Any?]?) -> Void {
            guard let dict else { return }
            if let value = dict["stringfield"] as? String {
                self.stringfield = value
            }
        }
    }
    public class Subarraymodel : Tea.TeaModel {

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
            return map
        }

        public override func fromMap(_ dict: [String: Any?]?) -> Void {
            guard let dict else { return }
        }
    }
    public var stringfield: String?

    public var bytesfield: [UInt8]?

    public var stringarrayfield: [String]?

    public var mapfield: [String: String]?

    public var name: String?

    public var submodel: MyModel.Submodel?

    public var submodelMap: [String: MyModel.Submodel]?

    public var mapModel: [String: M]?

    public var subarraymodel: [MyModel.Subarraymodel]?

    public var subarray: [M]?

    public var maparray: [[String: Any]]?

    public var moduleModelMap: [String: DarabonbaImport.Request]?

    public var subModelMap: [String: M.SubM]?

    public var modelMap: [String: M]?

    public var moduleMap: [String: DarabonbaImport.Client]?

    public var object: [String: Any]?

    public var readable: InputStream?

    public var writable: OutputStream?

    public var existModel: M?

    public var request: Tea.TeaRequest?

    public var complexList: [[String]]?

    public var modelComplexList: [[M]]?

    public var numberfield: Int?

    public var integerField: Int?

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

    public var classEndTime: String?

    public var maxLength: String?

    public var minLength: String?

    public var maximum: Int64?

    public var minimum: Int64?

    public var keyword: Protocol_.Test?

    public override init() {
        super.init()
    }

    public init(_ dict: [String: Any]) {
        super.init()
        self.fromMap(dict)
    }

    public override func validate() throws -> Void {
        try self.validateRequired(self.stringfield, "stringfield")
        try self.validateRequired(self.bytesfield, "bytesfield")
        try self.validateRequired(self.stringarrayfield, "stringarrayfield")
        try self.validateRequired(self.mapfield, "mapfield")
        try self.validateRequired(self.name, "name")
        try self.validateRequired(self.submodel, "submodel")
        try self.submodel?.validate()
        try self.validateRequired(self.submodelMap, "submodelMap")
        try self.validateRequired(self.mapModel, "mapModel")
        try self.validateRequired(self.subarraymodel, "subarraymodel")
        try self.validateRequired(self.subarray, "subarray")
        try self.validateRequired(self.maparray, "maparray")
        try self.validateRequired(self.moduleModelMap, "moduleModelMap")
        try self.validateRequired(self.subModelMap, "subModelMap")
        try self.validateRequired(self.modelMap, "modelMap")
        try self.validateRequired(self.moduleMap, "moduleMap")
        try self.validateRequired(self.object, "object")
        try self.validateRequired(self.readable, "readable")
        try self.validateRequired(self.writable, "writable")
        try self.validateRequired(self.existModel, "existModel")
        try self.existModel?.validate()
        try self.validateRequired(self.request, "request")
        try self.request?.validate()
        try self.validateRequired(self.complexList, "complexList")
        try self.validateRequired(self.modelComplexList, "modelComplexList")
        try self.validateRequired(self.numberfield, "numberfield")
        try self.validateRequired(self.integerField, "integerField")
        try self.validateRequired(self.floatField, "floatField")
        try self.validateRequired(self.doubleField, "doubleField")
        try self.validateRequired(self.longField, "longField")
        try self.validateRequired(self.ulongField, "ulongField")
        try self.validateRequired(self.int8Field, "int8Field")
        try self.validateRequired(self.int16Field, "int16Field")
        try self.validateRequired(self.int32Field, "int32Field")
        try self.validateRequired(self.int64Field, "int64Field")
        try self.validateRequired(self.uint8Field, "uint8Field")
        try self.validateRequired(self.uint16Field, "uint16Field")
        try self.validateRequired(self.uint32Field, "uint32Field")
        try self.validateRequired(self.uint64Field, "uint64Field")
        if self.classEndTime != nil {
            try self.validatePattern(self.classEndTime, "classEndTime", "\\d{4}[-]\\d{1,2}[-]\\d{1,2}(\\s\\d{2}:\\d{2}(:\\d{2})?)?")
        }
        if self.maxLength != nil {
            try self.validateMaxLength(self.maxLength, "maxLength", 10)
        }
        if self.minLength != nil {
            try self.validateMinLength(self.minLength, "minLength", 0)
        }
        if self.maximum != nil {
            try self.validateMaximum(self.maximum as! NSNumber, "maximum", 99000000)
        }
        if self.minimum != nil {
            try self.validateMinimum(self.minimum as! NSNumber, "minimum", 0)
        }
        try self.keyword?.validate()
    }

    public override func toMap() -> [String : Any] {
        var map = super.toMap()
        if self.stringfield != nil {
            map["stringfield"] = self.stringfield!
        }
        if self.bytesfield != nil {
            map["bytesfield"] = self.bytesfield!
        }
        if self.stringarrayfield != nil {
            map["stringarrayfield"] = self.stringarrayfield!
        }
        if self.mapfield != nil {
            map["mapfield"] = self.mapfield!
        }
        if self.name != nil {
            map["realName"] = self.name!
        }
        if self.submodel != nil {
            map["submodel"] = self.submodel?.toMap()
        }
        if self.submodelMap != nil {
            var tmp : [String: Any] = [:]
            for (k, v) in self.submodelMap! {
                tmp[k] = v.toMap()
            }
            map["submodelMap"] = tmp
        }
        if self.mapModel != nil {
            var tmp : [String: Any] = [:]
            for (k, v) in self.mapModel! {
                tmp[k] = v.toMap()
            }
            map["mapModel"] = tmp
        }
        if self.subarraymodel != nil {
            var tmp : [Any] = []
            for k in self.subarraymodel! {
                tmp.append(k.toMap())
            }
            map["subarraymodel"] = tmp
        }
        if self.subarray != nil {
            var tmp : [Any] = []
            for k in self.subarray! {
                tmp.append(k.toMap())
            }
            map["subarray"] = tmp
        }
        if self.maparray != nil {
            map["maparray"] = self.maparray!
        }
        if self.moduleModelMap != nil {
            var tmp : [String: Any] = [:]
            for (k, v) in self.moduleModelMap! {
                tmp[k] = v.toMap()
            }
            map["moduleModelMap"] = tmp
        }
        if self.subModelMap != nil {
            var tmp : [String: Any] = [:]
            for (k, v) in self.subModelMap! {
                tmp[k] = v.toMap()
            }
            map["subModelMap"] = tmp
        }
        if self.modelMap != nil {
            var tmp : [String: Any] = [:]
            for (k, v) in self.modelMap! {
                tmp[k] = v.toMap()
            }
            map["modelMap"] = tmp
        }
        if self.moduleMap != nil {
            map["moduleMap"] = self.moduleMap!
        }
        if self.object != nil {
            map["object"] = self.object!
        }
        if self.readable != nil {
            map["readable"] = self.readable!
        }
        if self.writable != nil {
            map["writable"] = self.writable!
        }
        if self.existModel != nil {
            map["existModel"] = self.existModel?.toMap()
        }
        if self.request != nil {
            map["request"] = self.request?.toMap()
        }
        if self.complexList != nil {
            map["complexList"] = self.complexList!
        }
        if self.modelComplexList != nil {
            var tmp : [Any] = []
            for k in self.modelComplexList! {
                var l1 : [Any] = []
                for k1 in k {
                    l1.append(k1.toMap())
                }
                tmp.append(l1)
            }
            map["modelComplexList"] = tmp
        }
        if self.numberfield != nil {
            map["numberfield"] = self.numberfield!
        }
        if self.integerField != nil {
            map["integerField"] = self.integerField!
        }
        if self.floatField != nil {
            map["floatField"] = self.floatField!
        }
        if self.doubleField != nil {
            map["doubleField"] = self.doubleField!
        }
        if self.longField != nil {
            map["longField"] = self.longField!
        }
        if self.ulongField != nil {
            map["ulongField"] = self.ulongField!
        }
        if self.int8Field != nil {
            map["int8Field"] = self.int8Field!
        }
        if self.int16Field != nil {
            map["int16Field"] = self.int16Field!
        }
        if self.int32Field != nil {
            map["int32Field"] = self.int32Field!
        }
        if self.int64Field != nil {
            map["int64Field"] = self.int64Field!
        }
        if self.uint8Field != nil {
            map["uint8Field"] = self.uint8Field!
        }
        if self.uint16Field != nil {
            map["uint16Field"] = self.uint16Field!
        }
        if self.uint32Field != nil {
            map["uint32Field"] = self.uint32Field!
        }
        if self.uint64Field != nil {
            map["uint64Field"] = self.uint64Field!
        }
        if self.link != nil {
            map["link"] = self.link!
        }
        if self.classEndTime != nil {
            map["class_end_time"] = self.classEndTime!
        }
        if self.maxLength != nil {
            map["max-length"] = self.maxLength!
        }
        if self.minLength != nil {
            map["min-length"] = self.minLength!
        }
        if self.maximum != nil {
            map["maximum"] = self.maximum!
        }
        if self.minimum != nil {
            map["minimum"] = self.minimum!
        }
        if self.keyword != nil {
            map["keyword"] = self.keyword?.toMap()
        }
        return map
    }

    public override func fromMap(_ dict: [String: Any?]?) -> Void {
        guard let dict else { return }
        if let value = dict["stringfield"] as? String {
            self.stringfield = value
        }
        if let value = dict["bytesfield"] as? [UInt8] {
            self.bytesfield = value
        }
        if let value = dict["stringarrayfield"] as? [String] {
            self.stringarrayfield = value
        }
        if let value = dict["mapfield"] as? [String: String] {
            self.mapfield = value
        }
        if let value = dict["realName"] as? String {
            self.name = value
        }
        if let value = dict["submodel"] as? [String: Any?] {
            var model = MyModel.Submodel()
            model.fromMap(value)
            self.submodel = model
        }
        if let value = dict["submodelMap"] as? [String: Any?] {
            var tmp : [String: MyModel.Submodel] = [:]
            for (k, v) in value {
                if v != nil {
                    var model = MyModel.Submodel()
                    model.fromMap(v as? [String: Any?])
                    tmp[k] = model
                }
            }
            self.submodelMap = tmp
        }
        if let value = dict["mapModel"] as? [String: Any?] {
            var tmp : [String: M] = [:]
            for (k, v) in value {
                if v != nil {
                    var model = M()
                    model.fromMap(v as? [String: Any?])
                    tmp[k] = model
                }
            }
            self.mapModel = tmp
        }
        if let value = dict["subarraymodel"] as? [Any?] {
            var tmp : [MyModel.Subarraymodel] = []
            for v in value {
                if v != nil {
                    var model = MyModel.Subarraymodel()
                    if v != nil {
                        model.fromMap(v as? [String: Any?])
                    }
                    tmp.append(model)
                }
            }
            self.subarraymodel = tmp
        }
        if let value = dict["subarray"] as? [Any?] {
            var tmp : [M] = []
            for v in value {
                if v != nil {
                    var model = M()
                    if v != nil {
                        model.fromMap(v as? [String: Any?])
                    }
                    tmp.append(model)
                }
            }
            self.subarray = tmp
        }
        if let value = dict["maparray"] as? [[String: Any]] {
            self.maparray = value
        }
        if let value = dict["moduleModelMap"] as? [String: Any?] {
            var tmp : [String: DarabonbaImport.Request] = [:]
            for (k, v) in value {
                if v != nil {
                    var model = DarabonbaImport.Request()
                    model.fromMap(v as? [String: Any?])
                    tmp[k] = model
                }
            }
            self.moduleModelMap = tmp
        }
        if let value = dict["subModelMap"] as? [String: Any?] {
            var tmp : [String: M.SubM] = [:]
            for (k, v) in value {
                if v != nil {
                    var model = M.SubM()
                    model.fromMap(v as? [String: Any?])
                    tmp[k] = model
                }
            }
            self.subModelMap = tmp
        }
        if let value = dict["modelMap"] as? [String: Any?] {
            var tmp : [String: M] = [:]
            for (k, v) in value {
                if v != nil {
                    var model = M()
                    model.fromMap(v as? [String: Any?])
                    tmp[k] = model
                }
            }
            self.modelMap = tmp
        }
        if let value = dict["moduleMap"] as? [String: DarabonbaImport.Client] {
            self.moduleMap = value
        }
        if let value = dict["object"] as? [String: Any] {
            self.object = value
        }
        if let value = dict["readable"] as? InputStream {
            self.readable = value
        }
        if let value = dict["writable"] as? OutputStream {
            self.writable = value
        }
        if let value = dict["existModel"] as? [String: Any?] {
            var model = M()
            model.fromMap(value)
            self.existModel = model
        }
        if let value = dict["request"] as? [String: Any?] {
            var model = Tea.TeaRequest()
            model.fromMap(value)
            self.request = model
        }
        if let value = dict["complexList"] as? [[String]] {
            self.complexList = value
        }
        if let value = dict["modelComplexList"] as? [Any?] {
            var tmp : [[M]] = []
            for v in value {
                if v != nil {
                    var l1 : [M] = []
                    for v1 in v as! [Any?] {
                        if v1 != nil {
                            var model = M()
                            if v1 != nil {
                                model.fromMap(v1 as? [String: Any?])
                            }
                            l1.append(model)
                        }
                    }
                    tmp.append(l1)
                }
            }
            self.modelComplexList = tmp
        }
        if let value = dict["numberfield"] as? Int {
            self.numberfield = value
        }
        if let value = dict["integerField"] as? Int {
            self.integerField = value
        }
        if let value = dict["floatField"] as? Double {
            self.floatField = value
        }
        if let value = dict["doubleField"] as? Double {
            self.doubleField = value
        }
        if let value = dict["longField"] as? Int64 {
            self.longField = value
        }
        if let value = dict["ulongField"] as? Int64 {
            self.ulongField = value
        }
        if let value = dict["int8Field"] as? Int32 {
            self.int8Field = value
        }
        if let value = dict["int16Field"] as? Int32 {
            self.int16Field = value
        }
        if let value = dict["int32Field"] as? Int32 {
            self.int32Field = value
        }
        if let value = dict["int64Field"] as? Int64 {
            self.int64Field = value
        }
        if let value = dict["uint8Field"] as? Int32 {
            self.uint8Field = value
        }
        if let value = dict["uint16Field"] as? Int32 {
            self.uint16Field = value
        }
        if let value = dict["uint32Field"] as? Int32 {
            self.uint32Field = value
        }
        if let value = dict["uint64Field"] as? Int64 {
            self.uint64Field = value
        }
        if let value = dict["link"] as? String {
            self.link = value
        }
        if let value = dict["class_end_time"] as? String {
            self.classEndTime = value
        }
        if let value = dict["max-length"] as? String {
            self.maxLength = value
        }
        if let value = dict["min-length"] as? String {
            self.minLength = value
        }
        if let value = dict["maximum"] as? Int64 {
            self.maximum = value
        }
        if let value = dict["minimum"] as? Int64 {
            self.minimum = value
        }
        if let value = dict["keyword"] as? [String: Any?] {
            var model = Protocol_.Test()
            model.fromMap(value)
            self.keyword = model
        }
    }
}
