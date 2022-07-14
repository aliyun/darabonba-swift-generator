import Foundation
import Tea
import DarabonbaNumber

open class Client {
    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public static func main(_ args: [String]?) async throws -> Void {
        var a: String = "123"
        var b: Int32 = DarabonbaNumber.Client.parseInt(a)
        var c: Double = DarabonbaNumber.Client.parseFloat(a)
        var d: Double = DarabonbaNumber.Client.parseDouble(a)
        var e: Int64 = DarabonbaNumber.Client.itol(b)
        var f: Int64 = DarabonbaNumber.Client.parseLong(a)
        var g: Int64 = DarabonbaNumber.Client.add(e, f)
        g = DarabonbaNumber.Client.sub(e, f)
        g = DarabonbaNumber.Client.mul(e, f)
        var z: Double = DarabonbaNumber.Client.div(e, f)
        var h: Bool = DarabonbaNumber.Client.gt(e, f)
        h = DarabonbaNumber.Client.gte(e, f)
        h = DarabonbaNumber.Client.lt(e, f)
        h = DarabonbaNumber.Client.lte(e, f)
    }
}
