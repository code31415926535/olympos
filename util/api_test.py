import json
import requests
import time

API_SERVER ="http://localhost:8080"
SEPARATOR = "-------------------------"


class Env:
    def __init__(self):
        pass

    @staticmethod
    def create(name, image, description):
        print SEPARATOR
        print "Creating env"
        env = {
            "name": name,
            "image": image,
            "description": description
        }
        response = requests.post(url=API_SERVER + "/env", json=env)
        print "Status: {}" .format(response.status_code)
        print SEPARATOR
        return env

    @staticmethod
    def get_all():
        print SEPARATOR
        print "Getting all envs"
        response = requests.get(API_SERVER + "/env")
        print json.dumps(response.json(), indent=4)
        print SEPARATOR

    @staticmethod
    def get_by_name(name):
        print SEPARATOR
        print "Getting env by name: {}" .format(name)
        response = requests.get(url=API_SERVER + "/env/{}" .format(name))
        print json.dumps(response.json(), indent=4)
        print SEPARATOR
        return response.json()

    @staticmethod
    def delete_by_name(name):
        print SEPARATOR
        print "Deleting env by name: {}".format(name)
        response = requests.delete(url=API_SERVER + "/env/{}".format(name))
        print response.status_code
        print SEPARATOR


class Test:
    def __init__(self):
        pass

    @staticmethod
    def create(name, env, description):
        print SEPARATOR
        print "Create test"
        test = {
            "name": name,
            "env": env,
            "description": description
        }
        response = requests.post(url=API_SERVER + "/test", json=test)
        print response.status_code
        print SEPARATOR
        return test

    @staticmethod
    def get_all():
        print SEPARATOR
        print "Getting all tests"
        response = requests.get(API_SERVER + "/test")
        print json.dumps(response.json(), indent=4)
        print SEPARATOR

    @staticmethod
    def get_by_name(name):
        print SEPARATOR
        print "Getting test by name: {}" .format(name)
        response = requests.get(url=API_SERVER + "/test/{}" .format(name))
        print json.dumps(response.json(), indent=4)
        print SEPARATOR
        return response.json()

    @staticmethod
    def delete_by_name(name):
        print SEPARATOR
        print "Delete test by name: {}" .format(name)
        response = requests.delete(url=API_SERVER + "/test/{}" .format(name))
        print response.status_code
        print SEPARATOR

    @staticmethod
    def get_all_files(name):
        print SEPARATOR
        print "Getting all files for test: {}" .format(name)
        response = requests.get(url=API_SERVER + "/test/{}/files" .format(name))
        print json.dumps(response.json(), indent=4)
        print SEPARATOR

    @staticmethod
    def create_file(name, filename, file_content):
        print SEPARATOR
        print "Creating file for test: {}" .format(name)
        file = {
            "name": filename,
            "content": file_content
        }
        response = requests.post(url=API_SERVER + "/test/{}/files" .format(name), json=file)
        print response.status_code
        print SEPARATOR


class Task:
    def __init__(self):
        pass

    @staticmethod
    def create(name, test, description):
        print SEPARATOR
        print "Create task"
        task = {
            "name": name,
            "test": test,
            "description": description
        }
        response = requests.post(url=API_SERVER + "/task", json=task)
        print response.status_code
        print SEPARATOR
        return task

    @staticmethod
    def get_all():
        print SEPARATOR
        print "Getting all tasks"
        response = requests.get(API_SERVER + "/task")
        print json.dumps(response.json(), indent=4)
        print SEPARATOR

    @staticmethod
    def get_by_name(name):
        print SEPARATOR
        print "Getting task by name: {}" .format(name)
        response = requests.get(url=API_SERVER + "/task/{}" .format(name))
        print json.dumps(response.json(), indent=4)
        print SEPARATOR
        return response.json()

    @staticmethod
    def delete_by_name(name):
        print SEPARATOR
        print "Delete task by name: {}" .format(name)
        response = requests.delete(url=API_SERVER + "/task/{}" .format(name))
        print response.status_code
        print SEPARATOR


def env_regression():
    print "Create valid"
    Env.create("Main", "main:latest", "Main test environment")
    print "Create invalid"
    Env.create("Hi", None, "Side test environment")
    print "Create already existing"
    Env.create("Main", "main:latest", "Main test environment")
    print "Get All"
    Env.get_all()
    print "Get valid"
    Env.get_by_name("Main")
    print "Get invalid"
    Env.get_by_name("Something")
    print "Delete valid"
    Env.delete_by_name("Main")
    print "Delete invalid"
    Env.delete_by_name("Something")
    print "Nothing should be left"
    Env.get_all()


def test_regression():
    print "Creating env for test"
    env = Env.create("Main", "main:latest", "Main test environment")
    print "Creating valid test"
    Test.create("Gcc", env, "Main test test")
    print "Recreating test"
    Test.create("Gcc", env, "Main test test")
    print "Creating test with invalid env"
    Test.create("Gcc2", {"name": "Whatever"}, "Second test env, runs on main also")
    print "Get all tests"
    Test.get_all()
    print "Get by valid name"
    Test.get_by_name("Gcc")
    print "Get by invalid name"
    Test.get_by_name("Something")

    print "Getting files by valid name"
    Test.get_all_files("Gcc")
    print "Getting all files by invalid name"
    Test.get_all_files("Something")

    print "Add valid file to valid test"
    Test.create_file("Gcc", "config.json", "{name:value}")
    Test.create_file("Gcc", "in.txt", "3")
    Test.create_file("Gcc", "out.txt", "3")

    print "Getting files by valid name"
    Test.get_all_files("Gcc")

    print "Delete by name valid name"
    Test.delete_by_name("Gcc")
    print "Delete by invalid name"
    Test.delete_by_name("Something")
    print "Removing env for test"
    Env.delete_by_name("Main")


def task_regression():
    print "Creating env for test"
    env = Env.create("Main", "main:latest", "Main test environment")
    print "Creating test for task"
    test = Test.create("Gcc", env, "Main test test")

    print "Create valid task"
    Task.create("Echo", test, "This should only echo")
    print "Recreate task"
    Task.create("Echo", test, "This should only echo")
    print "Create task with invalid test"
    Task.create("Something", {"key":"value"}, "What")

    print "Get all tasks"
    Task.get_all()
    print "Get by valid name"
    Task.get_by_name("Echo")
    print "Get by invalid name"
    Task.get_by_name("Whatever")

    print "Delete valid"
    Task.delete_by_name("Echo")
    print "Delete by invalid"
    Task.delete_by_name("Something")

    print "Removing test for task"
    Test.delete_by_name("Gcc")
    print "Removing env for test"
    Env.delete_by_name("Main")


def full_regression():
    env_regression()
    time.sleep(2)
    test_regression()
    time.sleep(2)
    task_regression()

if __name__ == "__main__":
    full_regression()
