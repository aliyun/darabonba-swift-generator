import Foundation
import Tea
import DarabonbaSource
import DarabonbaImport

open class Client {
    @available(macOS 10.15, iOS 13, tvOS 13, watchOS 6, *)
    public static func emptyModel() async throws -> Void {
        DarabonbaImport.Client.test()
        DarabonbaSource.Client.test()
    }
}
