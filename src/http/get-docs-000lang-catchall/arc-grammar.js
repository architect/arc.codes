module.exports = function(hljs) {
    return {
      case_insensitive: true,
      builtins: [
          "@app",
          "@aws",
          "@cdn",
          "@events",
          "@http",
          "@indexes",
          "@proxy",
          "@queues",
          "@scheduled",
          "@static",
          "@tables",
          "@ws"
      ].join(' '),
      keywords: [
          "get",
          "post",
          "put",
          "patch",
          "delete",
          "options",
          "head",
          "any",
          "region",
          "profile",
          "runtime",
          "bucket",
          "http",
          "httpv1",
          "rest",
          "apigateway",
          "fingerprint",
          "folder"
      ].join(' '),
      contains: [
        {
          className: 'string',
          begin: "'", end: "'"
        },
        hljs.COMMENT(
          '#', // begin
          'null', // end
        )
      ]
    }
}
