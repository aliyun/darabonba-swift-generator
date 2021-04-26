import Foundation

open class Client {
    public static func main(_ args: [String]) -> Void {
        var a: String = "123"
        var b: Int32 = Darabonba_Number.Client.parseInt(a)
        var c: Double = Darabonba_Number.Client.parseFloat(a)
        var d: Double = Darabonba_Number.Client.parseDouble(a)
        var e: Int64 = Darabonba_Number.Client.itol(b)
        var f: Int64 = Darabonba_Number.Client.parseLong(a)
        var g: Int64 = Darabonba_Number.Client.add(e, f)
        g = Darabonba_Number.Client.sub(e, f)
        g = Darabonba_Number.Client.mul(e, f)
        var z: Double = Darabonba_Number.Client.div(e, f)
        var h: Bool = Darabonba_Number.Client.gt(e, f)
        h = Darabonba_Number.Client.gte(e, f)
        h = Darabonba_Number.Client.lt(e, f)
        h = Darabonba_Number.Client.lte(e, f)
    }
}
