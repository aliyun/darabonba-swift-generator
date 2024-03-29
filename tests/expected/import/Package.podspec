Pod::Spec.new do |spec|

  spec.name         = "Package"
  spec.version      = "0.0.1"
  spec.license      = "Apache 2.0"
  spec.summary      = "Darabonba Package SDK"
  spec.homepage     = "https://github.com/aliyun/package" 
  spec.author       = { "Alibaba Cloud SDK" => "sdk-team@alibabacloud.com" }

  spec.source       = { :git => spec.homepage + '.git', :tag => spec.version }
  spec.source_files = 'Sources/**/*.swift'

  spec.ios.framework   = 'Foundation'

  spec.ios.deployment_target     = '13.0'
  spec.osx.deployment_target     = '10.15'
  spec.watchos.deployment_target = '6.0'
  spec.tvos.deployment_target    = '13.0'

  spec.dependency 'Tea',  '~> 1.0.0'
  spec.dependency 'Import',  '~> 0.0.1'
  spec.dependency 'Pack',  '~> 0.0.1'

  spec.swift_version='5.6'
end
