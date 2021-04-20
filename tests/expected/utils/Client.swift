// This file is auto-generated, don't edit it. Thanks.

import Foundation
import Tea

open class Client {
    public init(config:Config) {
        super.init(config.toMap())
        if config == nil {
            throw TeaException.Error([
                "name": "ParameterMissing",
                "message": "'config' can not be unset"
            ])
        }
        if config.domainId.isEmpty {
            throw TeaException.Error([
                "name": "ParameterMissing",
                "message": "'config.domainId' can not be empty"
            ])
        }
    }
}
