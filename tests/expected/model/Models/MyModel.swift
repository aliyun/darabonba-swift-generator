// This file is auto-generated, don't edit it. Thanks.

import Foundation
import Tea

open class MyModel : TeaModel {
    @objc public var stringfield:String = "";

    @objc public var stringarrayfield:[String:Any] = [String:NSObject]();

    @objc public var mapfield:map = [String:Any]();

    @objc public var realName:String = "";

    @objc public var submodel:Any = nil;

    @objc public var object:[String:AnyObject]? = nil;

    @objc public var numberfield:Int = 0;

    @objc public var readable:readable = Data;

    @objc public var request:TeaRequest? = nil;

    public override init() {
        super.init();
        self.__name["realName"] = "realName";
        self.__required["stringfield"] = true;
        self.__required["stringarrayfield"] = true;
        self.__required["mapfield"] = true;
        self.__required["realName"] = true;
        self.__required["submodel"] = true;
        self.__required["object"] = true;
        self.__required["numberfield"] = true;
        self.__required["readable"] = true;
        self.__required["request"] = true;
    }
}
