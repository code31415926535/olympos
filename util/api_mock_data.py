import requests

API_SERVER = "http://localhost:8080"

gaia_env = {
            "name": "Gaia-0.1",
            "image": "olympos/gaia:0.1",
            "description": """Gaia is the base test environment provided with olympos. It is capable of testing "python 2.7", "c", and "c++" programs.
It has the following commands:
1. Bash: Execute a bash "command" with an "arg" list.
2. Assert File: Check if two files are equal.
""",
            "test_mount": "/mnt/test",
            "out_mount": "/mnt/out"
}

gaia_env_new = {
            "name": "Gaia-0.2",
            "image": "olympos/gaia:0.2",
            "description": """Gaia is the base test environment provided with olympos. It is capable of testing "python 2.7", "c", and "c++" programs.
It has the following commands:
1. Bash: Execute a bash "command" with an "arg" list.
2. Assert File: Check if two files are equal.
3. Gcc: Compile a c or cpp source file.
4. BashIO: Execute a bash "command" with an "arg" list while using "input" as the input file and "output" as the output file.
5. CompareFmt: Compare the contents of a file with the contents of another file based on a predefined format.
6. Python: Execute a python script.
7. PythonIO: Execute a python script while using "input" as the input file and "output" as the output file.
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

gcd_test_cpp = {
    "name": "Greatest Common Divisor Test",
    "description": """A test for a program that calculates the GCD of two numbers.
The tested program needs to read two numbers from 'stdin' and print the "GCD" of the two to 'stdout'.

The program needs to be written in c.
"""
}

gcd_cpp_config_file = {
        "name": "config.yaml",
        "content": """run:
  init:
    - name: "gcc"
      arg:
        target: "./gcd.c"
  test:
    - for:
        case: "relative-prime"
      do:
        execution:
          name: "bashio"
          arg:
            command: "./a"
            input: "./in/rel-prime.in"
            output: "./gcd.out"
        evaluation:
          name: "compare_fmt"
          arg:
            actual: "./gcd.out"
            expected: "./out/rel-prime.out"
            format: "%d"
    - for:
        case: "have-divisors"
      do:
        execution:
          name: "bashio"
          arg:
            command: "./a"
            input: "./in/have-div.in"
            output: "./gcd.out"
        evaluation:
          name: "compare_fmt"
          arg:
            actual: "./gcd.out"
            expected: "./out/have-div.out"
            format: "%d"
    - for:
        case: "one-divides-another"
      do:
        execution:
          name: "bashio"
          arg:
            command: "./a"
            input: "./in/oda.in"
            output: "./gcd.out"
        evaluation:
          name: "compare_fmt"
          arg:
            actual: "./gcd.out"
            expected: "./out/oda.out"
            format: "%d"
"""
    }

gcd_cpp_rel_prime_in = {
    "name": "/in/rel-prime.in",
    "content": """3 5"""
}

gcd_cpp_rel_prime_out = {
    "name": "/out/rel-prime.out",
    "content": """1"""
}

gcd_cpp_have_div_in = {
    "name": "/in/have-div.in",
    "content": """60 45"""
}

gcd_cpp_have_div_out = {
    "name": "/out/have-div.out",
    "content": """15"""
}

gcd_cpp_oda_in = {
    "name": "/in/oda.in",
    "content": """60 120"""
}

gcd_cpp_oda_out = {
    "name": "/out/oda.out",
    "content": """60"""
}

gcd_task = {
    "name": "Greatest Common Divisor",
    "description": """The task is to write a "c" program that reads 2 numbers and calculates their greatest common divisor.
""",
    "test": gcd_test_cpp
}

if __name__ == "__main__":
    print "Filling up with mock data"
    response = requests.post(url=API_SERVER + "/env", json=gaia_env)
    print "Status: {}".format(response.status_code)

    response = requests.post(url=API_SERVER + "/env", json=gaia_env_new)
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
