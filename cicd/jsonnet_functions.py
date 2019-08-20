def foo():
    return "FOO"

def concat(x, y):
    return '/{}::{}/'.format(x, y)

def gitCommitHash():
    import subprocess
    try:
        output = subprocess.check_output(
            ['/bin/bash', '-c', 'set -e; git rev-parse --short HEAD']
        )
        return f"-{output.decode('UTF-8').strip()}"
    except:
        return ""

def getPackageJson(path):
    import json
    try:
        with open(path) as json_file:  
            data = json.load(json_file)
        return data
    except:
        return ""


def randomString():
    import random
    import string
    return ''.join([random.choice(string.ascii_letters + string.digits) for i in range(20)])

native_callbacks = {
    'concat': (('x', 'y'), concat),
    'foo': ((), foo),
    'gitCommitHash': ((), gitCommitHash),
    'getPackageJson': (('path',), getPackageJson),
    'randomString': ((), randomString)
}

