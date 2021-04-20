// This file is auto-generated, don't edit it. Thanks.

import Foundation
import Tea

open class ComplexRequest : TeaModel {
    @objc public var accessKey:String = "";

    @objc public var Body:readable = Data;

    @objc public var Strs:[String:Any] = [String:NSObject]();

    @objc public var header:Any = nil;

    @objc public var num:Int = 0;

    @objc public var client:Source? = nil;

    @objc public var Part:[String:Any] = [String:NSObject]();

    public override init() {
        super.init();
        self.__name["Body"] = "Body";
        self.__name["Strs"] = "Strs";
        self.__name["header"] = "header";
        self.__name["Part"] = "Part";
        self.__required["accessKey"] = true;
        self.__required["Body"] = true;
        self.__required["Strs"] = true;
        self.__required["header"] = true;
        self.__required["num"] = true;
        self.__required["client"] = true;
    }
}
