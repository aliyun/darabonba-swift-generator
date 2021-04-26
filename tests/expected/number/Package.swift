// swift-tools-version:5.1
// The swift-tools-version declares the minimum version of Swift required to build this package.
import PackageDescription

let package = Package(
        name: "Darabonba_Main",
        products: [
            .library(
                    name: "Darabonba_Main",
                    targets: ["Darabonba_Main"])
        ],
        dependencies: [
            // Dependencies declare other packages that this package depends on.
            .package(url: "https://github.com/darabonba/Number.git", from: "0.0.0"),
        ],
        targets: [
            .target(
                    name: "Darabonba_Main",
                    dependencies: ["Darabonba_Number"]),
        ]
)
