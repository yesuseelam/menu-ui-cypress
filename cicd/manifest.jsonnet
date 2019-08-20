local package_json = std.native('getPackageJson')('menu-ui/package.json');

{
    "name": "menu-ui",
    "systemTag": "EMM",
    "snUserGroup": "Menu Pod",
    "version": "0.9.71" + $.environment_vars[$.environment].version_suffix,
    "artifacts" : {
        "cfn" : {
            "classifier" : "",
            "file" : $.name + "-" + $.version + ".zip",
            "type" : "zip",
            "artifact_url" : $.nexus.url + "/repository/" + $.nexus.repository + "/" + std.strReplace($.nexus.group, ".", "/") + "/" + $.name + "/" + $.version + "/" + self.file
        },
        "app" : self.cfn {
            "classifier" : "ui",
            "file" : $.name + "-" + $.version + "-" + self.classifier + ".zip",
            "type" : "zip",
            } 
    },
    "components": [
        {
            "type": "cloudformation",
            "script_name": "cicd/cloudformation/cloudformation.json",
            "name": $.environment + "-" + $.name ,
            "regions": "us-east-1",
            "Parameters": [
                {
                    "ParameterKey": "Name",
                    "ParameterValue": $.name
                },
                {
                    "ParameterKey": "Environment",
                    "ParameterValue": $.environment
                },
                {
                    "ParameterKey": "AppArtifact",
                    "ParameterValue": $.name +"/"+ $.artifacts.app.file
                },
                {
                    "ParameterKey": "WarpAccountAlias",
                    "ParameterValue": std.extVar("nonprod_account_alias")
                },
                {
                    "ParameterKey": "CurrentAccountAlias",
                    "ParameterValue": std.extVar("account_alias")
                },
                {
                    "ParameterKey": "CFAlias",
                    "ParameterValue": $.environment_vars[$.environment].cloudfront_alias
                },
                {
                    "ParameterKey": "AcmCertArn",
                    "ParameterValue": $.environment_vars[$.environment].acm_cert_arn
                },
                {
                    "ParameterKey": "HostedZoneId",
                    "ParameterValue": $.environment_vars[$.environment].route53_hosted_zone_id
                },
                {
                    "ParameterKey": "ForceCall",
                    "ParameterValue": std.native('randomString')()
                }

            ],
            "TimeoutInMinutes": 40,
            "EnableTerminationProtection": false,
            "DisableRollback": false
        }
    ],
    "environment": std.extVar("environment"),
    "pipeline" : {
        "docker_image" : {
            "a_init.py": "node:12",
            "b_test.py": "node:12",
            "c_build.py": "node:12",
            "d_sonar.py": "node:12",
            "e_deploy.py": ""
        }
    },
    "nexus" : {
        "group" : "com.cfa.tsc.menu.menu-ui", // This defines a group/category for your artifact in the nexus repo
        "repository" : $.environment_vars[$.environment].nexus_repository,
        "url" : "https://nexus3.ittools.cfahome.com"        
    },
    "jenkins" : {
        "slack_channel" : "menu-deployment",
        "slack_messages" : {
            "start" : {
                "enabled" : true,
                "message" : "Pipeline started"
            }, 
            "complete" : {
                "enabled" : true,
                "message" : "Pipeline complete"
            },
            "fail" : {
                "enabled" : true,
                "message" : "Pipeline failed"
            }
        },
    },
    "sonarqube" : {
        "server_url":"https://sonar.ittools.cfahome.com", // The url of your sonar server
        "project_key": $.name, // A project key must be unique and must not change over time.
        "project_name": $.name, // The name of your project
        "project_sources":"./menu-ui/src", // comma separated list of source code folders relative to current folder
        "project_tags":"menu-pod", // comma separated list of tags
        "project_version": $.version,
        "wait_for_quality_gate": false,
        // "coverage_report_path": "./coverage.xml",  // Leave blank if no coverage report
        // "coverage_report_type": "python.coverage"// python.coverage, javascript.lcov, junit, etc. See more here for each plugin language type https://docs.sonarqube.org/display/PLUG/SonarSource+Plugins
    },
    "environment_vars" : {
        "dev" : {
            "nexus_repository" : "artifacts-snapshot",
            "version_suffix" : '-' + $.environment + std.native('gitCommitHash')(),
            "ng_build_cmd" : "npm run build:dev",
            "cloudfront_alias": "menu.restsolutions-dev.cfadevelop.com",
            "acm_cert_arn": "arn:aws:acm:us-east-1:234202894283:certificate/dd7a1e00-74de-4d13-bd9c-4eb5ef94df21",
            "route53_hosted_zone_id": "Z9E6OSW4A3IP8"
        },
        "test" : {
            "nexus_repository" : "artifacts-snapshot",
            "version_suffix" : '-' + $.environment + std.native('gitCommitHash')(),
            "ng_build_cmd" : "npm run build:test",
            "cloudfront_alias": "menu.restsolutions-test.cfadevelop.com",
            "acm_cert_arn": "arn:aws:acm:us-east-1:234202894283:certificate/0bb0eb2a-7161-44dd-860d-38e8d210a542",
            "route53_hosted_zone_id": "Z3SQSGPQLLVI74"
        },
        "uat" : {
            "nexus_repository" : "artifacts-snapshot",
            "version_suffix" : '-' + $.environment + std.native('gitCommitHash')(),
            "ng_build_cmd" : "npm run build:uat",
            "cloudfront_alias": "menu.restsolutions-uat.cfadevelop.com",
            "acm_cert_arn": "arn:aws:acm:us-east-1:234202894283:certificate/0901d169-0805-414b-9341-5d7d8ede0543",
            "route53_hosted_zone_id": "ZRPJMT2NKJV8V"
        },
        "prod" : {
            "nexus_repository" : "artifacts-release",
            "version_suffix" : "",
            "ng_build_cmd" : "npm run build:prod",
            "cloudfront_alias": "menu.restsolutions.cfahome.com",
            "acm_cert_arn": "arn:aws:acm:us-east-1:898324486314:certificate/c57aab61-914e-4655-b8ba-a1c25c1c7f49",
            "route53_hosted_zone_id": "Z3SIPH5TIWOA0B"
        }
    }
}
