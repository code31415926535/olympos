import json
import requests
import time

hello_world_env_json = {
            "name": "Gaia",
            "image": "olympos/gaia:latest",
            "description": """Gaia is the base test environment provided with olympos.
It is capable of testing "python 2.7", "c", and "c++" programs.
""",
            "test_mount": "/mnt/test",
            "out_mount": "/mnt/out"
}

hello_world_test_json = {
    "name": "Hello World Test",
    "description": """Hello world is one of the demo tests provided with olympos.

The tested program needs to read a line from "hello.in" and print it to "hello.out".
Only one test case exists containing "hello-world".
""",
    "env": hello_world_env_json,
    "files": [{
        "name": "config.yaml",
        "content": """run:
  init:
    - name: "bash"
      arg:
        command: "gcc"
        args: [ "./hello.c", "-o", "./a"]
  test:
    - for:
        case: "hello-world"
      do:
        beforeExecution:
          name: "bash"
          arg:
            command: "cp"
            args: ["./in/hello1.in", "./hello.in"]
        execution:
          name: "bash"
          arg:
            command: "./a"
            args: []
        evaluation:
          name: "assert_file"
          arg:
            actual: "./hello.out"
            expected: "./out/hello1.out"
        afterExecution:
          name: "bash"
          arg:
            command: "rm"
            args: ["./hello.out"]
"""
    }, {
        "name": "/in/hello1.in",
        "content": """hello-world"""
    }, {
        "name": "/out/hello1.out",
        "content": """hello-world"""
    }]
}

hello_world_job_json = {
    "uuid": "572a4187-8a1e-47b7-b963-7a93a9adae30",
    "status": "running",
    "test": hello_world_test_json,
    "submission": {
        "file": {
            "name": "hello.c",
            "content": """#include <stdio.h>

int main() {
    FILE *f;
    FILE *g;

    char msg[100];
    f = fopen("hello.in", "r");
    if (f == NULL) {
        exit(1);
    }

    fgets(msg, 101, f);
    fclose(f);

    g = fopen("hello.out", "w");
    if (g == NULL) {
        exit(1);
    }

    fprintf(g, "%s", msg);
    fclose(g);
}
"""
        }
    }
}


def run_test_job():
    response = requests.post(url="http://localhost:8087", json=hello_world_job_json)
    print response

run_test_job()
