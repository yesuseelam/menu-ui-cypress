#!/usr/bin/env python3
import sys
import json
from localpipelineutils.pipeline import Runner

def main(manifest, step):

    cmds = (
        "apt-get update -y;"
        "apt-get install -y zip;"

        # Create cloudformation artifact
        f"echo '{json.dumps(manifest)}' > ./cicd/manifest.json;"
        "zip -r ./dist/"+manifest["artifacts"]['cfn']['file']+" ./cicd -x manifest.jsonnet;"
        "rm ./cicd/manifest.json;"

        # Create app artifact
        f"cd {manifest['name']}; npm install;"
        +manifest['environment_vars'][manifest['environment']]['ng_build_cmd'] + ";"
        f"cd dist/;"
        "zip -r ../../dist/" + manifest['artifacts']['app']['file'] + " ./*; cd ../../..; ls -la;"
    )

    Runner(manifest=manifest, commands=cmds, step=step).run()


if __name__ == '__main__':
    print(sys.argv[1])
    main(json.loads(sys.argv[1]), sys.argv[0].split('/')[-1])
