export const arc = `@app
arc-codes

@aws
region us-west-2
profile openjsf

@static
fingerprint true

@http
get /docs/:lang/*
get /api/package
any /*
get /landing
`

export const cloudformation = {
  'AWSTemplateFormatVersion': '2010-09-09',
  'Transform': 'AWS::Serverless-2016-10-31',
  'Description': 'Example: arc.codes website',
  'Resources': {
    'Role': {
      'Type': 'AWS::IAM::Role',
      'Properties': {
        'AssumeRolePolicyDocument': {
          'Version': '2012-10-17',
          'Statement': [
            {
              'Effect': 'Allow',
              'Principal': {
                'Service': 'lambda.amazonaws.com'
              },
              'Action': 'sts:AssumeRole'
            }
          ]
        },
        'Policies': [
          {
            'PolicyName': 'ArcGlobalPolicy',
            'PolicyDocument': {
              'Statement': [
                {
                  'Effect': 'Allow',
                  'Action': [
                    'logs:CreateLogGroup',
                    'logs:CreateLogStream',
                    'logs:PutLogEvents',
                    'logs:DescribeLogStreams'
                  ],
                  'Resource': 'arn:aws:logs:*:*:*'
                }
              ]
            }
          },
          {
            'PolicyName': 'ArcStaticBucketPolicy',
            'PolicyDocument': {
              'Statement': [
                {
                  'Effect': 'Allow',
                  'Action': [
                    's3:GetObject',
                    's3:PutObject',
                    's3:PutObjectAcl',
                    's3:DeleteObject',
                    's3:ListBucket'
                  ],
                  'Resource': [
                    {
                      'Fn::Sub': [
                        'arn:aws:s3:::${bukkit}',
                        {
                          'bukkit': {
                            'Ref': 'StaticBucket'
                          }
                        }
                      ]
                    },
                    {
                      'Fn::Sub': [
                        'arn:aws:s3:::${bukkit}/*',
                        {
                          'bukkit': {
                            'Ref': 'StaticBucket'
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    },
    'StaticBucketParam': {
      'Type': 'AWS::SSM::Parameter',
      'Properties': {
        'Type': 'String',
        'Name': {
          'Fn::Sub': [
            '/${AWS::StackName}/static/${key}',
            {
              'key': 'bucket'
            }
          ]
        },
        'Value': {
          'Ref': 'StaticBucket'
        }
      }
    },
    'StaticFingerprintParam': {
      'Type': 'AWS::SSM::Parameter',
      'Properties': {
        'Type': 'String',
        'Name': {
          'Fn::Sub': [
            '/${AWS::StackName}/static/${key}',
            {
              'key': 'fingerprint'
            }
          ]
        },
        'Value': 'true'
      }
    },
    'ParameterStorePolicy': {
      'Type': 'AWS::IAM::Policy',
      'DependsOn': 'Role',
      'Properties': {
        'PolicyName': 'ArcParameterStorePolicy',
        'PolicyDocument': {
          'Statement': [
            {
              'Effect': 'Allow',
              'Action': [
                'ssm:GetParametersByPath',
                'ssm:GetParameter'
              ],
              'Resource': {
                'Fn::Sub': [
                  'arn:aws:ssm:${AWS::Region}:${AWS::AccountId}:parameter/${AWS::StackName}',
                  {}
                ]
              }
            },
            {
              'Effect': 'Allow',
              'Action': [
                'ssm:GetParametersByPath',
                'ssm:GetParameter'
              ],
              'Resource': {
                'Fn::Sub': [
                  'arn:aws:ssm:${AWS::Region}:${AWS::AccountId}:parameter/${AWS::StackName}/*',
                  {}
                ]
              }
            },
            {
              'Effect': 'Allow',
              'Action': [
                'ssm:GetParametersByPath',
                'ssm:GetParameter'
              ],
              'Resource': {
                'Fn::Sub': [
                  'arn:aws:ssm:${AWS::Region}:${AWS::AccountId}:parameter/${AWS::StackName}/*/*',
                  {}
                ]
              }
            }
          ]
        },
        'Roles': [
          {
            'Ref': 'Role'
          }
        ]
      }
    },
    'HTTP': {
      'Type': 'AWS::Serverless::HttpApi',
      'Properties': {
        'StageName': '$default',
        'DefinitionBody': {
          'openapi': '3.0.1',
          'info': {
            'title': {
              'Ref': 'AWS::StackName'
            }
          },
          'paths': {
            '/docs/{lang}/{proxy+}': {
              'get': {
                'x-amazon-apigateway-integration': {
                  'payloadFormatVersion': '2.0',
                  'type': 'aws_proxy',
                  'httpMethod': 'POST',
                  'uri': {
                    'Fn::Sub': 'arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${GetDocsLangCatchallHTTPLambda.Arn}/invocations'
                  },
                  'connectionType': 'INTERNET'
                }
              }
            },
            '/api/package': {
              'get': {
                'x-amazon-apigateway-integration': {
                  'payloadFormatVersion': '2.0',
                  'type': 'aws_proxy',
                  'httpMethod': 'POST',
                  'uri': {
                    'Fn::Sub': 'arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${GetApiPackageHTTPLambda.Arn}/invocations'
                  },
                  'connectionType': 'INTERNET'
                }
              }
            },
            '/landing': {
              'get': {
                'x-amazon-apigateway-integration': {
                  'payloadFormatVersion': '2.0',
                  'type': 'aws_proxy',
                  'httpMethod': 'POST',
                  'uri': {
                    'Fn::Sub': 'arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${GetLandingHTTPLambda.Arn}/invocations'
                  },
                  'connectionType': 'INTERNET'
                }
              }
            },
            '/{proxy+}': {
              'x-amazon-apigateway-any-method': {
                'x-amazon-apigateway-integration': {
                  'payloadFormatVersion': '2.0',
                  'type': 'aws_proxy',
                  'httpMethod': 'POST',
                  'uri': {
                    'Fn::Sub': 'arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${AnyCatchallHTTPLambda.Arn}/invocations'
                  },
                  'connectionType': 'INTERNET'
                }
              }
            },
            '/_static/{proxy+}': {
              'get': {
                'x-amazon-apigateway-integration': {
                  'payloadFormatVersion': '1.0',
                  'type': 'http_proxy',
                  'httpMethod': 'GET',
                  'uri': {
                    'Fn::Sub': [
                      'https://${bukkit}.s3.${AWS::Region}.amazonaws.com/{proxy}',
                      {
                        'bukkit': {
                          'Ref': 'StaticBucket'
                        }
                      }
                    ]
                  },
                  'connectionType': 'INTERNET',
                  'timeoutInMillis': 30000
                }
              }
            }
          }
        }
      }
    },
    'GetDocsLangCatchallHTTPLambda': {
      'Type': 'AWS::Serverless::Function',
      'Properties': {
        'Handler': 'index.handler',
        'CodeUri': '/var/task/src/http/get-docs-000lang-catchall',
        'Runtime': 'nodejs20.x',
        'Architectures': [
          'arm64'
        ],
        'MemorySize': 1152,
        'EphemeralStorage': {
          'Size': 512
        },
        'Timeout': 5,
        'Environment': {
          'Variables': {
            'ARC_APP_NAME': 'arc-codes',
            'ARC_ENV': 'staging',
            'ARC_ROLE': {
              'Ref': 'Role'
            },
            'ARC_SESSION_TABLE_NAME': 'jwe',
            'ARC_STACK_NAME': {
              'Ref': 'AWS::StackName'
            },
            'ARC_STATIC_BUCKET': {
              'Ref': 'StaticBucket'
            }
          }
        },
        'Role': {
          'Fn::Sub': [
            'arn:aws:iam::${AWS::AccountId}:role/${roleName}',
            {
              'roleName': {
                'Ref': 'Role'
              }
            }
          ]
        },
        'Events': {
          'GetDocsLangCatchallHTTPEvent': {
            'Type': 'HttpApi',
            'Properties': {
              'Path': '/docs/{lang}/{proxy+}',
              'Method': 'GET',
              'ApiId': {
                'Ref': 'HTTP'
              }
            }
          }
        }
      },
      'ArcMetadata': {
        'pragma': 'http',
        'name': 'get /docs/:lang/*',
        'method': 'get',
        'path': '/docs/:lang/*'
      }
    },
    'GetApiPackageHTTPLambda': {
      'Type': 'AWS::Serverless::Function',
      'Properties': {
        'Handler': 'index.handler',
        'CodeUri': '/var/task/src/http/get-api-package',
        'Runtime': 'nodejs20.x',
        'Architectures': [
          'arm64'
        ],
        'MemorySize': 1152,
        'EphemeralStorage': {
          'Size': 512
        },
        'Timeout': 5,
        'Environment': {
          'Variables': {
            'ARC_APP_NAME': 'arc-codes',
            'ARC_ENV': 'staging',
            'ARC_ROLE': {
              'Ref': 'Role'
            },
            'ARC_SESSION_TABLE_NAME': 'jwe',
            'ARC_STACK_NAME': {
              'Ref': 'AWS::StackName'
            },
            'ARC_STATIC_BUCKET': {
              'Ref': 'StaticBucket'
            }
          }
        },
        'Role': {
          'Fn::Sub': [
            'arn:aws:iam::${AWS::AccountId}:role/${roleName}',
            {
              'roleName': {
                'Ref': 'Role'
              }
            }
          ]
        },
        'Events': {
          'GetApiPackageHTTPEvent': {
            'Type': 'HttpApi',
            'Properties': {
              'Path': '/api/package',
              'Method': 'GET',
              'ApiId': {
                'Ref': 'HTTP'
              }
            }
          }
        }
      },
      'ArcMetadata': {
        'pragma': 'http',
        'name': 'get /api/package',
        'method': 'get',
        'path': '/api/package'
      }
    },
    'GetLandingHTTPLambda': {
      'Type': 'AWS::Serverless::Function',
      'Properties': {
        'Handler': 'index.handler',
        'CodeUri': '/var/task/src/http/get-landing',
        'Runtime': 'nodejs20.x',
        'Architectures': [
          'arm64'
        ],
        'MemorySize': 1152,
        'EphemeralStorage': {
          'Size': 512
        },
        'Timeout': 5,
        'Environment': {
          'Variables': {
            'ARC_APP_NAME': 'arc-codes',
            'ARC_ENV': 'staging',
            'ARC_ROLE': {
              'Ref': 'Role'
            },
            'ARC_SESSION_TABLE_NAME': 'jwe',
            'ARC_STACK_NAME': {
              'Ref': 'AWS::StackName'
            },
            'ARC_STATIC_BUCKET': {
              'Ref': 'StaticBucket'
            }
          }
        },
        'Role': {
          'Fn::Sub': [
            'arn:aws:iam::${AWS::AccountId}:role/${roleName}',
            {
              'roleName': {
                'Ref': 'Role'
              }
            }
          ]
        },
        'Events': {
          'GetLandingHTTPEvent': {
            'Type': 'HttpApi',
            'Properties': {
              'Path': '/landing',
              'Method': 'GET',
              'ApiId': {
                'Ref': 'HTTP'
              }
            }
          }
        }
      },
      'ArcMetadata': {
        'pragma': 'http',
        'name': 'get /landing',
        'method': 'get',
        'path': '/landing'
      }
    },
    'AnyCatchallHTTPLambda': {
      'Type': 'AWS::Serverless::Function',
      'Properties': {
        'Handler': 'index.handler',
        'CodeUri': '/var/task/src/http/any-catchall',
        'Runtime': 'nodejs20.x',
        'Architectures': [
          'arm64'
        ],
        'MemorySize': 1152,
        'EphemeralStorage': {
          'Size': 512
        },
        'Timeout': 5,
        'Environment': {
          'Variables': {
            'ARC_APP_NAME': 'arc-codes',
            'ARC_ENV': 'staging',
            'ARC_ROLE': {
              'Ref': 'Role'
            },
            'ARC_SESSION_TABLE_NAME': 'jwe',
            'ARC_STACK_NAME': {
              'Ref': 'AWS::StackName'
            },
            'ARC_STATIC_BUCKET': {
              'Ref': 'StaticBucket'
            },
            'ARC_STATIC_SPA': false
          }
        },
        'Role': {
          'Fn::Sub': [
            'arn:aws:iam::${AWS::AccountId}:role/${roleName}',
            {
              'roleName': {
                'Ref': 'Role'
              }
            }
          ]
        },
        'Events': {
          'AnyCatchallHTTPEvent': {
            'Type': 'HttpApi',
            'Properties': {
              'Path': '/{proxy+}',
              'Method': 'ANY',
              'ApiId': {
                'Ref': 'HTTP'
              }
            }
          }
        }
      },
      'ArcMetadata': {
        'pragma': 'http',
        'name': 'any /*',
        'method': 'any',
        'path': '/*'
      }
    },
    'StaticBucket': {
      'Type': 'AWS::S3::Bucket',
      'Properties': {
        'OwnershipControls': {
          'Rules': [
            {
              'ObjectOwnership': 'BucketOwnerEnforced'
            }
          ]
        },
        'WebsiteConfiguration': {
          'IndexDocument': 'index.html',
          'ErrorDocument': '404.html'
        },
        'PublicAccessBlockConfiguration': {
          'BlockPublicAcls': false,
          'BlockPublicPolicy': false,
          'IgnorePublicAcls': false,
          'RestrictPublicBuckets': false
        }
      }
    },
    'StaticBucketPolicy': {
      'Type': 'AWS::S3::BucketPolicy',
      'Properties': {
        'Bucket': {
          'Ref': 'StaticBucket'
        },
        'PolicyDocument': {
          'Version': '2012-10-17',
          'Statement': [
            {
              'Action': [
                's3:GetObject'
              ],
              'Effect': 'Allow',
              'Principal': '*',
              'Resource': [
                {
                  'Fn::Sub': [
                    'arn:aws:s3:::${bukkit}/*',
                    {
                      'bukkit': {
                        'Ref': 'StaticBucket'
                      }
                    }
                  ]
                }
              ],
              'Sid': 'PublicReadGetObject'
            }
          ]
        }
      }
    }
  },
  'Outputs': {
    'API': {
      'Description': 'API Gateway (HTTP)',
      'Value': {
        'Fn::Sub': [
          'https://${ApiId}.execute-api.${AWS::Region}.amazonaws.com',
          {
            'ApiId': {
              'Ref': 'HTTP'
            }
          }
        ]
      }
    },
    'ApiId': {
      'Description': 'API ID (ApiId)',
      'Value': {
        'Ref': 'HTTP'
      }
    },
    'BucketURL': {
      'Description': 'Bucket URL',
      'Value': {
        'Fn::Sub': [
          'http://${bukkit}.s3-website-${AWS::Region}.amazonaws.com',
          {
            'bukkit': {
              'Ref': 'StaticBucket'
            }
          }
        ]
      }
    }
  }
}
