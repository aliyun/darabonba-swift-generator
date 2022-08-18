import Foundation
import Tea
import DarabonbaImport

open class Client : DarabonbaImport.Client {
    public override init(_ config: DarabonbaImport.Config) throws {
        try super.init(config)
    }
}
