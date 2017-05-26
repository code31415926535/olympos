import requests

hello_world_ok_submission = {
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

hello_world_compile_err_submission = {
            "name": "hello.c",
            "content": """#include <stdio.h>

int main() {
    FILE *f;
    FILE *g;
asd
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

response = requests.post(url="http://localhost:8080/task/Hello World/submission", json=hello_world_ok_submission)
print response
