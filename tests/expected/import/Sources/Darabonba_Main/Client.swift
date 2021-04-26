import Foundation

open class Client {
    protected var _id: [String]?

    protected var _str: String?

    init(_ id: [String], _ str: String) {
        super.id = id
        super.str = str
        throw Tea.ClientError([
            "code": "SomeError",
            "messge": "ErrorMessage"
        ])
    }

    public static func Sample(_ client: Darabonba_Import.Client) -> Void {
        var runtime: Darabonba_Import.RuntimeObject = Darabonba_Import.RuntimeObject([])
        var request: Darabonba_Import.Request = Darabonba_Import.Request([
            "accesskey": "accesskey",
            "region": "region"
        ])
        client.print(runtime)
    }
}
