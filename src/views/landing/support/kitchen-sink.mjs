export const arc = `@app
kitchen-sink

@static
fingerprint true

@http
get /
get /likes
post /likes

@tables
likes
  likeID *String

@tables-streams
likes

@tables-indexes
likes
  date *String

@ws
action
connect
default
disconnect

@events
hit-counter

@scheduled
daily-affirmation rate(1 day)
`


export const cloudformation = {
  'AWSTemplateFormatVersion': '2010-09-09',
  'Transform': 'AWS::Serverless-2016-10-31',
  'Description': 'Example: kitchen sink',
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
          },
          {
            'PolicyName': 'ArcDynamoPolicy',
            'PolicyDocument': {
              'Statement': [
                {
                  'Effect': 'Allow',
                  'Action': 'dynamodb:*',
                  'Resource': [
                    {
                      'Fn::Sub': [
                        'arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/${tablename}',
                        {
                          'tablename': {
                            'Ref': 'LikesTable'
                          }
                        }
                      ]
                    },
                    {
                      'Fn::Sub': [
                        'arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/${tablename}/*',
                        {
                          'tablename': {
                            'Ref': 'LikesTable'
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  'Effect': 'Deny',
                  'Action': 'dynamodb:DeleteTable',
                  'Resource': {
                    'Fn::Sub': 'arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/*'
                  }
                }
              ]
            }
          },
          {
            'PolicyName': 'ArcSimpleNotificationServicePolicy',
            'PolicyDocument': {
              'Statement': [
                {
                  'Effect': 'Allow',
                  'Action': [
                    'sns:Publish'
                  ],
                  'Resource': {
                    'Fn::Sub': [
                      'arn:aws:sns:${AWS::Region}:${AWS::AccountId}:${AWS::StackName}*',
                      {}
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    },
    'LikesParam': {
      'Type': 'AWS::SSM::Parameter',
      'Properties': {
        'Type': 'String',
        'Name': {
          'Fn::Sub': [
            '/${AWS::StackName}/tables/${tablename}',
            {
              'tablename': 'likes'
            }
          ]
        },
        'Value': {
          'Ref': 'LikesTable'
        }
      }
    },
    'HitCounterEventTopicParam': {
      'Type': 'AWS::SSM::Parameter',
      'Properties': {
        'Type': 'String',
        'Name': {
          'Fn::Sub': [
            '/${AWS::StackName}/events/${event}',
            {
              'event': 'hit-counter'
            }
          ]
        },
        'Value': {
          'Ref': 'HitCounterEventTopic'
        }
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
            '/likes': {
              'get': {
                'x-amazon-apigateway-integration': {
                  'payloadFormatVersion': '2.0',
                  'type': 'aws_proxy',
                  'httpMethod': 'POST',
                  'uri': {
                    'Fn::Sub': 'arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${GetLikesHTTPLambda.Arn}/invocations'
                  },
                  'connectionType': 'INTERNET'
                }
              },
              'post': {
                'x-amazon-apigateway-integration': {
                  'payloadFormatVersion': '2.0',
                  'type': 'aws_proxy',
                  'httpMethod': 'POST',
                  'uri': {
                    'Fn::Sub': 'arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${PostLikesHTTPLambda.Arn}/invocations'
                  },
                  'connectionType': 'INTERNET'
                }
              }
            },
            '/': {
              'get': {
                'x-amazon-apigateway-integration': {
                  'payloadFormatVersion': '2.0',
                  'type': 'aws_proxy',
                  'httpMethod': 'POST',
                  'uri': {
                    'Fn::Sub': 'arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${GetIndexHTTPLambda.Arn}/invocations'
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
    'GetLikesHTTPLambda': {
      'Type': 'AWS::Serverless::Function',
      'Properties': {
        'Handler': 'index.handler',
        'CodeUri': '/var/task/src/http/get-likes',
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
            'ARC_APP_NAME': 'hello',
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
            'ARC_WSS_URL': {
              'Fn::Sub': [
                'wss://${WS}.execute-api.${AWS::Region}.amazonaws.com/staging',
                {}
              ]
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
          'GetLikesHTTPEvent': {
            'Type': 'HttpApi',
            'Properties': {
              'Path': '/likes',
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
        'name': 'get /likes',
        'method': 'get',
        'path': '/likes'
      }
    },
    'GetIndexHTTPLambda': {
      'Type': 'AWS::Serverless::Function',
      'Properties': {
        'Handler': 'index.handler',
        'CodeUri': '/var/task/src/http/get-index',
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
            'ARC_APP_NAME': 'hello',
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
            'ARC_WSS_URL': {
              'Fn::Sub': [
                'wss://${WS}.execute-api.${AWS::Region}.amazonaws.com/staging',
                {}
              ]
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
          'GetIndexHTTPEvent': {
            'Type': 'HttpApi',
            'Properties': {
              'Path': '/',
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
        'name': 'get /',
        'method': 'get',
        'path': '/'
      }
    },
    'PostLikesHTTPLambda': {
      'Type': 'AWS::Serverless::Function',
      'Properties': {
        'Handler': 'index.handler',
        'CodeUri': '/var/task/src/http/post-likes',
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
            'ARC_APP_NAME': 'hello',
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
            'ARC_WSS_URL': {
              'Fn::Sub': [
                'wss://${WS}.execute-api.${AWS::Region}.amazonaws.com/staging',
                {}
              ]
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
          'PostLikesHTTPEvent': {
            'Type': 'HttpApi',
            'Properties': {
              'Path': '/likes',
              'Method': 'POST',
              'ApiId': {
                'Ref': 'HTTP'
              }
            }
          }
        }
      },
      'ArcMetadata': {
        'pragma': 'http',
        'name': 'post /likes',
        'method': 'post',
        'path': '/likes'
      }
    },
    'LikesTable': {
      'Type': 'AWS::DynamoDB::Table',
      'Properties': {
        'KeySchema': [
          {
            'AttributeName': 'likeID',
            'KeyType': 'HASH'
          }
        ],
        'AttributeDefinitions': [
          {
            'AttributeName': 'likeID',
            'AttributeType': 'S'
          },
          {
            'AttributeName': 'date',
            'AttributeType': 'S'
          }
        ],
        'BillingMode': 'PAY_PER_REQUEST',
        'GlobalSecondaryIndexes': [
          {
            'IndexName': 'date-index',
            'KeySchema': [
              {
                'AttributeName': 'date',
                'KeyType': 'HASH'
              }
            ],
            'Projection': {
              'ProjectionType': 'ALL'
            }
          }
        ],
        'StreamSpecification': {
          'StreamViewType': 'NEW_AND_OLD_IMAGES'
        }
      }
    },
    'HitCounterEventLambda': {
      'Type': 'AWS::Serverless::Function',
      'Properties': {
        'Handler': 'index.handler',
        'CodeUri': '/var/task/src/events/hit-counter',
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
            'ARC_APP_NAME': 'hello',
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
            'ARC_WSS_URL': {
              'Fn::Sub': [
                'wss://${WS}.execute-api.${AWS::Region}.amazonaws.com/staging',
                {}
              ]
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
          'HitCounterEvent': {
            'Type': 'SNS',
            'Properties': {
              'Topic': {
                'Ref': 'HitCounterEventTopic'
              }
            }
          }
        }
      },
      'ArcMetadata': {
        'pragma': 'events',
        'name': 'hit-counter'
      }
    },
    'HitCounterEventTopic': {
      'Type': 'AWS::SNS::Topic',
      'Properties': {
        'DisplayName': 'HitCounter',
        'Subscription': []
      }
    },
    'DailyAffirmationScheduledLambda': {
      'Type': 'AWS::Serverless::Function',
      'Properties': {
        'Handler': 'index.handler',
        'CodeUri': '/var/task/src/scheduled/daily-affirmation',
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
            'ARC_APP_NAME': 'hello',
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
            'ARC_WSS_URL': {
              'Fn::Sub': [
                'wss://${WS}.execute-api.${AWS::Region}.amazonaws.com/staging',
                {}
              ]
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
        'Events': {}
      },
      'ArcMetadata': {
        'pragma': 'scheduled',
        'name': 'daily-affirmation'
      }
    },
    'DailyAffirmationScheduledEvent': {
      'Type': 'AWS::Events::Rule',
      'Properties': {
        'ScheduleExpression': 'rate(1 day)',
        'Targets': [
          {
            'Arn': {
              'Fn::GetAtt': [
                'DailyAffirmationScheduledLambda',
                'Arn'
              ]
            },
            'Id': 'DailyAffirmationScheduledLambda'
          }
        ]
      }
    },
    'DailyAffirmationScheduledPermission': {
      'Type': 'AWS::Lambda::Permission',
      'Properties': {
        'Action': 'lambda:InvokeFunction',
        'FunctionName': {
          'Ref': 'DailyAffirmationScheduledLambda'
        },
        'Principal': 'events.amazonaws.com',
        'SourceArn': {
          'Fn::GetAtt': [
            'DailyAffirmationScheduledEvent',
            'Arn'
          ]
        }
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
    },
    'LikesTableStreamLambda': {
      'Type': 'AWS::Serverless::Function',
      'Properties': {
        'Handler': 'index.handler',
        'CodeUri': '/var/task/src/tables-streams/likes',
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
            'ARC_APP_NAME': 'hello',
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
            'ARC_WSS_URL': {
              'Fn::Sub': [
                'wss://${WS}.execute-api.${AWS::Region}.amazonaws.com/staging',
                {}
              ]
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
        'Events': {}
      },
      'ArcMetadata': {
        'pragma': 'tables-streams',
        'name': 'likes'
      }
    },
    'LikesTableStreamEvent': {
      'Type': 'AWS::Lambda::EventSourceMapping',
      'Properties': {
        'BatchSize': 10,
        'EventSourceArn': {
          'Fn::GetAtt': [
            'LikesTable',
            'StreamArn'
          ]
        },
        'FunctionName': {
          'Fn::GetAtt': [
            'LikesTableStreamLambda',
            'Arn'
          ]
        },
        'StartingPosition': 'TRIM_HORIZON'
      }
    },
    'WS': {
      'Type': 'AWS::ApiGatewayV2::Api',
      'Properties': {
        'Name': 'HelloWebsocketStaging',
        'ProtocolType': 'WEBSOCKET',
        'RouteSelectionExpression': '$request.body.action'
      }
    },
    'WebsocketDeployment': {
      'Type': 'AWS::ApiGatewayV2::Deployment',
      'DependsOn': [
        'ConnectWSRoute',
        'DefaultWSRoute',
        'DisconnectWSRoute'
      ],
      'Properties': {
        'ApiId': {
          'Ref': 'WS'
        }
      }
    },
    'WebsocketStage': {
      'Type': 'AWS::ApiGatewayV2::Stage',
      'Properties': {
        'StageName': 'staging',
        'DeploymentId': {
          'Ref': 'WebsocketDeployment'
        },
        'ApiId': {
          'Ref': 'WS'
        }
      }
    },
    'WebSocketPolicy': {
      'Type': 'AWS::IAM::Policy',
      'DependsOn': 'Role',
      'Properties': {
        'PolicyName': 'ArcWebSocketPolicy',
        'PolicyDocument': {
          'Statement': [
            {
              'Effect': 'Allow',
              'Action': [
                'execute-api:Invoke',
                'execute-api:ManageConnections'
              ],
              'Resource': [
                {
                  'Fn::Sub': [
                    'arn:aws:execute-api:${AWS::Region}:*:${api}/*',
                    {
                      'api': {
                        'Ref': 'WS'
                      }
                    }
                  ]
                }
              ]
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
    'ActionWSLambda': {
      'Type': 'AWS::Serverless::Function',
      'Properties': {
        'Handler': 'index.handler',
        'CodeUri': '/var/task/src/ws/action',
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
            'ARC_APP_NAME': 'hello',
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
            'ARC_WSS_URL': {
              'Fn::Sub': [
                'wss://${WS}.execute-api.${AWS::Region}.amazonaws.com/staging',
                {}
              ]
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
        'Events': {}
      },
      'ArcMetadata': {
        'pragma': 'ws',
        'name': 'action'
      }
    },
    'ActionWSRoute': {
      'Type': 'AWS::ApiGatewayV2::Route',
      'Properties': {
        'ApiId': {
          'Ref': 'WS'
        },
        'RouteKey': 'action',
        'OperationName': 'ActionWSRoute',
        'Target': {
          'Fn::Join': [
            '/',
            [
              'integrations',
              {
                'Ref': 'ActionWSIntegration'
              }
            ]
          ]
        }
      }
    },
    'ActionWSIntegration': {
      'Type': 'AWS::ApiGatewayV2::Integration',
      'Properties': {
        'ApiId': {
          'Ref': 'WS'
        },
        'IntegrationType': 'AWS_PROXY',
        'IntegrationUri': {
          'Fn::Sub': [
            'arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${ActionWSLambda.Arn}/invocations',
            {}
          ]
        }
      }
    },
    'ActionWSPermission': {
      'Type': 'AWS::Lambda::Permission',
      'DependsOn': [
        'WS',
        'ActionWSLambda'
      ],
      'Properties': {
        'Action': 'lambda:InvokeFunction',
        'FunctionName': {
          'Ref': 'ActionWSLambda'
        },
        'Principal': 'apigateway.amazonaws.com'
      }
    },
    'ConnectWSLambda': {
      'Type': 'AWS::Serverless::Function',
      'Properties': {
        'Handler': 'index.handler',
        'CodeUri': '/var/task/src/ws/connect',
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
            'ARC_APP_NAME': 'hello',
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
            'ARC_WSS_URL': {
              'Fn::Sub': [
                'wss://${WS}.execute-api.${AWS::Region}.amazonaws.com/staging',
                {}
              ]
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
        'Events': {}
      },
      'ArcMetadata': {
        'pragma': 'ws',
        'name': 'connect'
      }
    },
    'ConnectWSRoute': {
      'Type': 'AWS::ApiGatewayV2::Route',
      'Properties': {
        'ApiId': {
          'Ref': 'WS'
        },
        'RouteKey': '$connect',
        'OperationName': 'ConnectWSRoute',
        'Target': {
          'Fn::Join': [
            '/',
            [
              'integrations',
              {
                'Ref': 'ConnectWSIntegration'
              }
            ]
          ]
        }
      }
    },
    'ConnectWSIntegration': {
      'Type': 'AWS::ApiGatewayV2::Integration',
      'Properties': {
        'ApiId': {
          'Ref': 'WS'
        },
        'IntegrationType': 'AWS_PROXY',
        'IntegrationUri': {
          'Fn::Sub': [
            'arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${ConnectWSLambda.Arn}/invocations',
            {}
          ]
        }
      }
    },
    'ConnectWSPermission': {
      'Type': 'AWS::Lambda::Permission',
      'DependsOn': [
        'WS',
        'ConnectWSLambda'
      ],
      'Properties': {
        'Action': 'lambda:InvokeFunction',
        'FunctionName': {
          'Ref': 'ConnectWSLambda'
        },
        'Principal': 'apigateway.amazonaws.com'
      }
    },
    'DefaultWSLambda': {
      'Type': 'AWS::Serverless::Function',
      'Properties': {
        'Handler': 'index.handler',
        'CodeUri': '/var/task/src/ws/default',
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
            'ARC_APP_NAME': 'hello',
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
            'ARC_WSS_URL': {
              'Fn::Sub': [
                'wss://${WS}.execute-api.${AWS::Region}.amazonaws.com/staging',
                {}
              ]
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
        'Events': {}
      },
      'ArcMetadata': {
        'pragma': 'ws',
        'name': 'default'
      }
    },
    'DefaultWSRoute': {
      'Type': 'AWS::ApiGatewayV2::Route',
      'Properties': {
        'ApiId': {
          'Ref': 'WS'
        },
        'RouteKey': '$default',
        'OperationName': 'DefaultWSRoute',
        'Target': {
          'Fn::Join': [
            '/',
            [
              'integrations',
              {
                'Ref': 'DefaultWSIntegration'
              }
            ]
          ]
        }
      }
    },
    'DefaultWSIntegration': {
      'Type': 'AWS::ApiGatewayV2::Integration',
      'Properties': {
        'ApiId': {
          'Ref': 'WS'
        },
        'IntegrationType': 'AWS_PROXY',
        'IntegrationUri': {
          'Fn::Sub': [
            'arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${DefaultWSLambda.Arn}/invocations',
            {}
          ]
        }
      }
    },
    'DefaultWSPermission': {
      'Type': 'AWS::Lambda::Permission',
      'DependsOn': [
        'WS',
        'DefaultWSLambda'
      ],
      'Properties': {
        'Action': 'lambda:InvokeFunction',
        'FunctionName': {
          'Ref': 'DefaultWSLambda'
        },
        'Principal': 'apigateway.amazonaws.com'
      }
    },
    'DisconnectWSLambda': {
      'Type': 'AWS::Serverless::Function',
      'Properties': {
        'Handler': 'index.handler',
        'CodeUri': '/var/task/src/ws/disconnect',
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
            'ARC_APP_NAME': 'hello',
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
            'ARC_WSS_URL': {
              'Fn::Sub': [
                'wss://${WS}.execute-api.${AWS::Region}.amazonaws.com/staging',
                {}
              ]
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
        'Events': {}
      },
      'ArcMetadata': {
        'pragma': 'ws',
        'name': 'disconnect'
      }
    },
    'DisconnectWSRoute': {
      'Type': 'AWS::ApiGatewayV2::Route',
      'Properties': {
        'ApiId': {
          'Ref': 'WS'
        },
        'RouteKey': '$disconnect',
        'OperationName': 'DisconnectWSRoute',
        'Target': {
          'Fn::Join': [
            '/',
            [
              'integrations',
              {
                'Ref': 'DisconnectWSIntegration'
              }
            ]
          ]
        }
      }
    },
    'DisconnectWSIntegration': {
      'Type': 'AWS::ApiGatewayV2::Integration',
      'Properties': {
        'ApiId': {
          'Ref': 'WS'
        },
        'IntegrationType': 'AWS_PROXY',
        'IntegrationUri': {
          'Fn::Sub': [
            'arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${DisconnectWSLambda.Arn}/invocations',
            {}
          ]
        }
      }
    },
    'DisconnectWSPermission': {
      'Type': 'AWS::Lambda::Permission',
      'DependsOn': [
        'WS',
        'DisconnectWSLambda'
      ],
      'Properties': {
        'Action': 'lambda:InvokeFunction',
        'FunctionName': {
          'Ref': 'DisconnectWSLambda'
        },
        'Principal': 'apigateway.amazonaws.com'
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
    'HitCounterEventTopic': {
      'Description': 'An SNS Topic',
      'Value': {
        'Ref': 'HitCounterEventTopic'
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
    },
    'WSS': {
      'Description': 'WebSocket Endpoint',
      'Value': {
        'Fn::Sub': [
          'wss://${WS}.execute-api.${AWS::Region}.amazonaws.com/staging',
          {}
        ]
      }
    }
  }
}
