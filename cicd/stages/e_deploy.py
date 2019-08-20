#!/usr/bin/env python3
import sys
import json
from localpipelineutils.pipeline import Runner

def main(manifest, step):
    cmds = (
        # Deploy built artifacts to nexus. Both MANIFEST and $NEXUS_CREDS can be used in the cmds section.
        "curl -v -u $NEXUS_CREDS -X POST '"+manifest["nexus"]["url"]+"/service/rest/v1/components?repository="+manifest["nexus"]["repository"]+"' "
            "-F 'maven2.groupId="+manifest["nexus"]["group"]+"' "
            "-F 'maven2.artifactId="+manifest["name"]+"' "
            "-F 'maven2.version="+manifest["version"]+"' "
            # First Artifact Asset
            "-F 'maven2.asset1=@dist/"+manifest["artifacts"]['cfn']['file']+"' "
            "-F 'maven2.asset1.extension=zip' "
            "-F 'maven2.asset1.classifier="+manifest["artifacts"]['cfn']['classifier']+"' "
            # Second Artifact Asset
            "-F 'maven2.asset2=@dist/"+manifest["artifacts"]['app']['file']+"' "
            "-F 'maven2.asset2.extension=zip' "
            "-F 'maven2.asset2.classifier="+manifest["artifacts"]['app']['classifier']+"';"
        # Install warp if not already
        "pip3 install --upgrade code-warp --index-url=https://nexus3.ittools.cfahome.com/repository/python-all/simple;"
        # Deploy artifacts from nexus to amazon
        "warp -d -e "+manifest["environment"]+" -l " + manifest["artifacts"]['cfn']['artifact_url'] + " -f "+manifest["artifacts"]['app']['artifact_url']+";"
    )

    Runner(manifest=manifest, commands=cmds, step=step).run()


if __name__ == '__main__':
    print(sys.argv[1])
    main(json.loads(sys.argv[1]), sys.argv[0].split('/')[-1])
