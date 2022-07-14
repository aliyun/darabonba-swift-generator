// swift-tools-version:5.6
// The swift-tools-version declares the minimum version of Swift required to build this package.
import PackageDescription

let package = Package(
        name: "Package",
        platforms: [.macOS(.v10_15),
                    .iOS(.v13),
                    .tvOS(.v13),
                    .watchOS(.v6)],
        products: [
            .library(
                    name: "Package",
                    targets: ["Package"])
        ],
        dependencies: [
            // Dependencies declare other packages that this package depends on.
            .package(url: "https://github.com/aliyun/tea-swift.git", from: "1.0.0"),
            .package(url: "https://github.com/aliyun/import", from: "0.0.1"),
            .package(url: "https://github.com/aliyun/package", from: "0.0.1"),
        ],
        targets: [
            .target(
                    name: "Package",
                    dependencies: [
                        .product(name: "Tea", package: "tea-swift"),
                        .product(name: "Import", package: "import"),
                        .product(name: "Pack", package: "package")
                    ]),
        ],
        swiftLanguageVersions: [.v5]
)
