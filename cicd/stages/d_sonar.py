#!/usr/bin/env python3
import json
import sys
from localpipelineutils.pipeline import Runner
from localpipelineutils.sonar import waitForQualityGate


def main(manifest, step):

    cmds = (
        "npm install -g sonarqube-scanner;"
         # Ensure project exists in sonar
        f"curl -u $SONAR_TOKEN: -X POST '{manifest['sonarqube']['server_url']}/api/projects/create?name={manifest['sonarqube']['project_name']}&project={manifest['sonarqube']['project_key']}';"
        # Ensure project is tagged properly in sonar
        f"curl -u $SONAR_TOKEN: -X POST '{manifest['sonarqube']['server_url']}/api/project_tags/set?project={manifest['sonarqube']['project_key']}&tags={manifest['sonarqube']['project_tags']}';"

        # Run Sonar Scanner
        f"sonar-scanner -X -Dsonar.host.url='{manifest['sonarqube']['server_url']}' "
        f"-Dsonar.projectKey='{manifest['sonarqube']['project_key']}' "
        f"-Dsonar.sources='{manifest['sonarqube']['project_sources']}' "
        f"-Dsonar.projectName='{manifest['sonarqube']['project_name']}' "
        f"-Dsonar.projectVersion='{manifest['sonarqube']['project_version']}' "
        f"-Dsonar.login=$SONAR_TOKEN "
        # f"-Dsonar.exclusions=**/*_test.go,**/cicd/** "
        # f"-Dsonar.tests=. "
        # f"-Dsonar.test.inclusions=**/*_test.go "
        # f"-Dsonar.test.exclusions=**/cicd/** "
        # f"-Dsonar.{manifest['sonarqube']['coverage_report_type']}.reportPaths='{manifest['sonarqube']['coverage_report_path']}' " # Comment this line out if not doing CODE COVERAGE.
        f";"
    )

    Runner(manifest=manifest, commands=cmds, step=step).run()
    if manifest['sonarqube']['wait_for_quality_gate']:
        waitForQualityGate(manifest['sonarqube']['project_key'])

if __name__ == '__main__':
    main(json.loads(sys.argv[1]), sys.argv[0].split('/')[-1])
