import json
import requests

API_SERVER ="http://localhost:8080"


def env_test():
    print "--------------"
    print "All envs"
    response = requests.get(API_SERVER + "/env")
    print response.json()

    print "--------------"
    print "Create env"
    env = {
        "name": "test-env",
        "image": "test-env:latest"
    }
    response = requests.post(url=API_SERVER + "/env", json=env)
    print response.status_code

    print "--------------"
    print "Recreating env"
    env = {
        "name": "test-env",
        "image": "test-env:latest"
    }
    response = requests.post(url=API_SERVER + "/env", json=env)
    print response.status_code

    print "--------------"
    print "All envs"
    response = requests.get(API_SERVER + "/env")
    print response.json()

    print "--------------"
    print "Env by name"
    response = requests.get(url=API_SERVER + "/env/test-env")
    print response.json()

    print "--------------"
    print "Delete env"
    response = requests.delete(url=API_SERVER + "/env/test-env")
    print response.status_code


def test_test():
    print "--------------"
    print "All tests"
    response = requests.get(API_SERVER + "/test")
    print json.dumps(response.json(), indent=4)

    print "--------------"
    print "Create test"
    test = {
        "name": "test-test",
        "env": {
            "name": "test-env",
            "image": "test-env:latest"
        },
        "description": "A test that is used for nothing",
        "config": "No config for now"
    }
    response = requests.post(url=API_SERVER + "/test", json=test)
    print response.status_code

    print "--------------"
    print "Recreate test"
    test = {
        "name": "test-test",
        "env": {
            "name": "test-env",
            "image": "test-env:latest"
        },
        "description": "A test that is used for nothing",
        "config": "No config for now"
    }
    response = requests.post(url=API_SERVER + "/test", json=test)
    print response.status_code

    print "--------------"
    print "All tests"
    response = requests.get(API_SERVER + "/test")
    print json.dumps(response.json(), indent=4)

    print "--------------"
    print "Test by name"
    response = requests.get(url=API_SERVER + "/test/test-test")
    print json.dumps(response.json(), indent=4)

    print "--------------"
    print "Delete test"
    response = requests.delete(url=API_SERVER + "/test/test-test")
    print response.status_code

if __name__ == "__main__":
    # env_test()
    test_test()