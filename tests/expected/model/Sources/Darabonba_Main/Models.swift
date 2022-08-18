import Foundation
import Tea
import DarabonbaImport

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

        public override func fromMap(_ dict: [String: Any]) -> Void {
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

    public override func fromMap(_ dict: [String: Any]) -> Void {
        if dict.keys.contains("subM") {
            var model = M.SubM()
            model.fromMap(dict["subM"] as! [String: Any])
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

    public override func fromMap(_ dict: [String: Any]) -> Void {
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

        public override func fromMap(_ dict: [String: Any]) -> Void {
            if dict.keys.contains("stringfield") {
                self.stringfield = dict["stringfield"] as! String
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

        public override func fromMap(_ dict: [String: Any]) -> Void {
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
        return map
    }

    public override func fromMap(_ dict: [String: Any]) -> Void {
        if dict.keys.contains("stringfield") {
            self.stringfield = dict["stringfield"] as! String
        }
        if dict.keys.contains("bytesfield") {
            self.bytesfield = dict["bytesfield"] as! [UInt8]
        }
        if dict.keys.contains("stringarrayfield") {
            self.stringarrayfield = dict["stringarrayfield"] as! [String]
        }
        if dict.keys.contains("mapfield") {
            self.mapfield = dict["mapfield"] as! [String: String]
        }
        if dict.keys.contains("realName") {
            self.name = dict["realName"] as! String
        }
        if dict.keys.contains("submodel") {
            var model = MyModel.Submodel()
            model.fromMap(dict["submodel"] as! [String: Any])
            self.submodel = model
        }
        if dict.keys.contains("submodelMap") {
            var tmp : [String: MyModel.Submodel] = [:]
            for (k, v) in dict["submodelMap"] as! [String: MyModel.Submodel] {
                var model = MyModel.Submodel()
                model.fromMap(v as! [String: Any])
                tmp[k] = model
            }
            self.submodelMap = tmp
        }
        if dict.keys.contains("mapModel") {
            var tmp : [String: M] = [:]
            for (k, v) in dict["mapModel"] as! [String: M] {
                var model = M()
                model.fromMap(v as! [String: Any])
                tmp[k] = model
            }
            self.mapModel = tmp
        }
        if dict.keys.contains("subarraymodel") {
            self.subarraymodel = dict["subarraymodel"] as! [MyModel.Subarraymodel]
        }
        if dict.keys.contains("subarray") {
            self.subarray = dict["subarray"] as! [M]
        }
        if dict.keys.contains("maparray") {
            self.maparray = dict["maparray"] as! [[String: Any]]
        }
        if dict.keys.contains("moduleModelMap") {
            var tmp : [String: DarabonbaImport.Request] = [:]
            for (k, v) in dict["moduleModelMap"] as! [String: DarabonbaImport.Request] {
                var model = DarabonbaImport.Request()
                model.fromMap(v as! [String: Any])
                tmp[k] = model
            }
            self.moduleModelMap = tmp
        }
        if dict.keys.contains("subModelMap") {
            var tmp : [String: M.SubM] = [:]
            for (k, v) in dict["subModelMap"] as! [String: M.SubM] {
                var model = M.SubM()
                model.fromMap(v as! [String: Any])
                tmp[k] = model
            }
            self.subModelMap = tmp
        }
        if dict.keys.contains("modelMap") {
            var tmp : [String: M] = [:]
            for (k, v) in dict["modelMap"] as! [String: M] {
                var model = M()
                model.fromMap(v as! [String: Any])
                tmp[k] = model
            }
            self.modelMap = tmp
        }
        if dict.keys.contains("moduleMap") {
            self.moduleMap = dict["moduleMap"] as! [String: DarabonbaImport.Client]
        }
        if dict.keys.contains("object") {
            self.object = dict["object"] as! [String: Any]
        }
        if dict.keys.contains("readable") {
            self.readable = dict["readable"] as! InputStream
        }
        if dict.keys.contains("writable") {
            self.writable = dict["writable"] as! OutputStream
        }
        if dict.keys.contains("existModel") {
            var model = M()
            model.fromMap(dict["existModel"] as! [String: Any])
            self.existModel = model
        }
        if dict.keys.contains("request") {
            var model = Tea.TeaRequest()
            model.fromMap(dict["request"] as! [String: Any])
            self.request = model
        }
        if dict.keys.contains("complexList") {
            self.complexList = dict["complexList"] as! [[String]]
        }
        if dict.keys.contains("numberfield") {
            self.numberfield = dict["numberfield"] as! Int
        }
        if dict.keys.contains("integerField") {
            self.integerField = dict["integerField"] as! Int
        }
        if dict.keys.contains("floatField") {
            self.floatField = dict["floatField"] as! Double
        }
        if dict.keys.contains("doubleField") {
            self.doubleField = dict["doubleField"] as! Double
        }
        if dict.keys.contains("longField") {
            self.longField = dict["longField"] as! Int64
        }
        if dict.keys.contains("ulongField") {
            self.ulongField = dict["ulongField"] as! Int64
        }
        if dict.keys.contains("int8Field") {
            self.int8Field = dict["int8Field"] as! Int32
        }
        if dict.keys.contains("int16Field") {
            self.int16Field = dict["int16Field"] as! Int32
        }
        if dict.keys.contains("int32Field") {
            self.int32Field = dict["int32Field"] as! Int32
        }
        if dict.keys.contains("int64Field") {
            self.int64Field = dict["int64Field"] as! Int64
        }
        if dict.keys.contains("uint8Field") {
            self.uint8Field = dict["uint8Field"] as! Int32
        }
        if dict.keys.contains("uint16Field") {
            self.uint16Field = dict["uint16Field"] as! Int32
        }
        if dict.keys.contains("uint32Field") {
            self.uint32Field = dict["uint32Field"] as! Int32
        }
        if dict.keys.contains("uint64Field") {
            self.uint64Field = dict["uint64Field"] as! Int64
        }
        if dict.keys.contains("link") {
            self.link = dict["link"] as! String
        }
        if dict.keys.contains("class_end_time") {
            self.classEndTime = dict["class_end_time"] as! String
        }
        if dict.keys.contains("max-length") {
            self.maxLength = dict["max-length"] as! String
        }
        if dict.keys.contains("min-length") {
            self.minLength = dict["min-length"] as! String
        }
        if dict.keys.contains("maximum") {
            self.maximum = dict["maximum"] as! Int64
        }
        if dict.keys.contains("minimum") {
            self.minimum = dict["minimum"] as! Int64
        }
    }
}
