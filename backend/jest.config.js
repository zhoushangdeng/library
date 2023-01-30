module.exports = {
  // 是否输出代码测试覆盖率报告
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // 输出测试报告文件
  "reporters": [
    "default",
    ["jest-html-reporter", {
      //输出页面标题
      pageTitle: "library测试报告",
      //输出测试报告的路径。
      outputPath: 'testReport/JesttestReport.html',
      //为每个失败的测试输出详细的失败消息。
      includeFailureMsg: true,
      // 超时报告时间
      // executionTimeWarningThreshold: 3
    }]
  ]
};
