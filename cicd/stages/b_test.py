#!/usr/bin/env python3
import sys
import json
from localpipelineutils.pipeline import Runner

def main(manifest, step):

    cmds = (
        ""
        # Security Scan Maybe
        #"npm run-script test"

        ""
    )

    Runner(manifest=manifest, commands=cmds, step=step).run()


if __name__ == '__main__':
    print(sys.argv[1])
    main(json.loads(sys.argv[1]), sys.argv[0].split('/')[-1])
