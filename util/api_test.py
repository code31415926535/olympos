import json
import requests
import time

API_SERVER = "http://localhost:8080"
SEPARATOR = "-------------------------"


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
        print "Getting task by name: {}".format(name)
        response = requests.get(url=API_SERVER + "/task/{}".format(name))
        print json.dumps(response.json(), indent=4)
        print SEPARATOR
        return response.json()

    @staticmethod
    def delete_by_name(name):
        print SEPARATOR
        print "Delete task by name: {}".format(name)
        response = requests.delete(url=API_SERVER + "/task/{}".format(name))
        print response.status_code
        print SEPARATOR

    @staticmethod
    def create_submission(name, filename, file_content):
        print SEPARATOR
        print "Creating submission for task: {}".format(name)
        pl = {
            "file": {
                "name": filename,
                "content": file_content
            }
        }
        response = requests.post(url=API_SERVER + "/task/{}/submission".format(name), json=pl)
        print response.status_code
        print SEPARATOR

    @staticmethod
    def get_all_submission(name):
        print SEPARATOR
        print "Getting all submissions for task: {}".format(name)
        response = requests.get(url=API_SERVER + "/task/{}/submission".format(name))
        print json.dumps(response.json(), indent=4)
        print SEPARATOR


class Job:
    def __init__(self):
        pass

    @staticmethod
    def get_all():
        print SEPARATOR
        print "Getting all jobs ..."
        response = requests.get(url=API_SERVER + "/job")
        print json.dumps(response.json(), indent=4)
        print SEPARATOR


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
    Task.create("Something", {"key": "value"}, "What")

    print "Get all tasks"
    Task.get_all()
    print "Get by valid name"
    Task.get_by_name("Echo")
    print "Get by invalid name"
    Task.get_by_name("Whatever")

    # Submission
    print "Create submission valid name"
    Task.create_submission("Echo", "echo.cpp", "some content, I don't really care")
    Task.create_submission("Echo", "echo.cpp", "some content, I don't really care")
    print "Create submission invalid task"
    Task.create_submission("something", "echo.cpp", "some content, I don't really care")
    print "Get all submissions"
    Task.get_all_submission("Echo")

    # Delete
    print "Delete valid"
    Task.delete_by_name("Echo")
    print "Delete by invalid"
    Task.delete_by_name("Something")

    print "Removing test for task"
    Test.delete_by_name("Gcc")
    print "Removing env for test"
    Env.delete_by_name("Main")


def job_regression():
    print "Getting all jobs"
    Job.get_all()


def full_regression():
    env_regression()
    time.sleep(2)
    test_regression()
    time.sleep(2)
    task_regression()
    time.sleep(2)
    job_regression()


if __name__ == "__main__":
    full_regression()
