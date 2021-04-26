import Foundation

open class Client : Darabonba_Import.Client {
    init(_ config: Darabonba_Import.Config) {
        super.init(config)
        super.endpointRule = "central"
        super.endpointMap = [
            "ap-northeast-1": "cusanalytic.aliyuncs.com",
            "ap-south-1": "cusanalytic.aliyuncs.com"
        ]
        @endpointMap["ap-northeast-1"]
        @endpointMap["ap-northeast-1"] = "";
        @endpointMap["test"] = "test"
        var b: B = B([])
        for a in b.mm {
            a.m[a.str]
        }
    }
}
