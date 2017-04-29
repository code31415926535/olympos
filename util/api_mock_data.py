import requests

API_SERVER = "http://localhost:8080"

gaia_env = {
            "name": "Gaia-standard",
            "image": "olympos/gaia:latest",
            "description": """Gaia-standard is the base test environment provided with olympos. It is capable of testing "python 2.7", "c", and "c++" programs.
It has the following commands:
1. Bash: Execute a bash "command" with an "arg" list.
2. Assert File: Check if two files are equal.
""",
            "test_mount": "/mnt/test",
            "out_mount": "/mnt/out"
}

hello_world_test = {
    "name": "Hello World Test",
    "description": """Hello world is one of the demo tests provided with olympos.
The tested program needs to read a line from "hello.in" and print it to "hello.out". Only one test case exists containing "hello-world".
This is one of the simplest tests, since it only uses 2 tasks: "bash" and "assert_file".
""",
    "env": gaia_env,
}

hello_world_config_file = {
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
    }

hello_world_input_file = {
    "name": "/in/hello1.in",
    "content": """hello-world"""
}

hello_world_output_file = {
    "name": "/out/hello1.out",
    "content": """hello-world"""
}

hello_world_task = {
    "name": "Hello World",
    "description": """Hello World is the test task for olympos.
The task is to implement a "c" program that reads a line of text from "hello.in" and writes it to "hello.out".

The name of the file has to be "hello.c".

Since this is the test task, here is a solution to it to test it out:

#include <stdio.h>

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

Note: You should try out different solutions to see how the system behaves.
""",
    "test": hello_world_test
}

if __name__ == "__main__":
    print "Filling up with mock data"
    response = requests.post(url=API_SERVER + "/env", json=gaia_env)
    print "Status: {}".format(response.status_code)

    response = requests.post(url=API_SERVER + "/test", json=hello_world_test)
    print "Status: {}".format(response.status_code)

    response = requests.post(url=API_SERVER + "/test/Hello World Test/files", json=hello_world_config_file)
    print "Status: {}".format(response.status_code)

    response = requests.post(url=API_SERVER + "/test/Hello World Test/files", json=hello_world_input_file)
    print "Status: {}".format(response.status_code)

    response = requests.post(url=API_SERVER + "/test/Hello World Test/files", json=hello_world_output_file)
    print "Status: {}".format(response.status_code)

    response = requests.post(url=API_SERVER + "/task", json=hello_world_task)
    print "Status: {}".format(response.status_code)
