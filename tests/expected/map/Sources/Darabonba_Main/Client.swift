import Foundation
import Tea
import DarabonbaImport

open class Client : DarabonbaImport.Client {
    public var _test: String?

    public override init(_ config: DarabonbaImport.Config) throws {
        try super.init(config)
        self._endpointRule = "central"
        self._endpointMap = [
            "ap-northeast-1": "cusanalytic.aliyuncs.com",
            "ap-south-1": "cusanalytic.aliyuncs.com"
        ]
        _endpointMap["ap-northeast-1"]
        _endpointMap["ap-northeast-1"] = "";
        _endpointMap["test"] = "test"
        self._test = "test"
        var b: B = B([:])
        for a in b.mm {
            a.m[a.str ?? ""]
        }
        test(nil)
    }

    public func test(_ str: String) -> Void {
        return nil
    }
}
