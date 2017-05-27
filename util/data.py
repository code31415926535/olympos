import requests
import time
import sys

class User:
    def __init__(self):
        pass

    @staticmethod
    def auth(username, password):
        credentials = {
            "username": username,
            "password": password
        }

        response = requests.post(url=API_SERVER + "/auth", json=credentials)
        if response.status_code != 200:
            return response.status_code, None
        else:
            return response.status_code, response.json()

    @staticmethod
    def list_users(token):
        response = requests.get(url=API_SERVER + "/user", headers={"x-access-token": token})
        if response.status_code != 200:
            return response.status_code, None
        else:
            return response.status_code, response.json()

    @staticmethod
    def create_user(username, password, email):
        user = {
            "username": username,
            "password": password,
            "email": email
        }

        response = requests.post(url=API_SERVER + "/user", json=user)

        return response.status_code

    @staticmethod
    def change_user_permissions(token, username, permission):
        permission = {
            "permission": permission
        }

        response = requests.put(url=API_SERVER + "/user/{}/permission".format(username),
                                json=permission,
                                headers={"x-access-token": token})

        return response.status_code

    @staticmethod
    def get_user_by_username(token, username):
        response = requests.get(url=API_SERVER + "/user/{}".format(username),
                                headers={"x-access-token": token})

        if response.status_code != 200:
            return response.status_code, None
        else:
            return response.status_code, response.json()

    @staticmethod
    def delete_user_by_username(token, username):
        response = requests.delete(url=API_SERVER + "/user/{}".format(username),
                                   headers={"x-access-token": token})

        return response.status_code


class Env:
    def __init__(self):
        pass

    @staticmethod
    def create_env(name, image, description, out_mount, test_mount, token):
        env = {
            "name": name,
            "image": image,
            "description": description,
            "out_mount": out_mount,
            "test_mount": test_mount
        }
        response = requests.post(url=API_SERVER + "/env",
                                 json=env,
                                 headers={"x-access-token": token})

        return response.status_code

    @staticmethod
    def list_envs(token):
        response = requests.get(API_SERVER + "/env",
                                headers={"x-access-token": token})

        if response.status_code != 200:
            return response.status_code, None
        else:
            return response.status_code, response.json()

    @staticmethod
    def get_env_by_name(name, token):
        response = requests.get(url=API_SERVER + "/env/{}".format(name),
                                headers={"x-access-token": token})

        if response.status_code != 200:
            return response.status_code, None
        else:
            return response.status_code, response.json()

    @staticmethod
    def delete_env_by_name(name, token):
        response = requests.delete(url=API_SERVER + "/env/{}".format(name),
                                   headers={"x-access-token": token})

        return response.status_code


class Test:
    def __init__(self):
        pass

    @staticmethod
    def create_test(name, env, description, token):
        test = {
            "name": name,
            "env": env,
            "description": description
        }
        response = requests.post(url=API_SERVER + "/test", json=test,
                                 headers={"x-access-token": token})
        return response.status_code

    @staticmethod
    def list_tests(token):
        response = requests.get(API_SERVER + "/test",
                                headers={"x-access-token": token})

        if response.status_code != 200:
            return response.status_code, None
        else:
            return response.status_code, response.json()

    @staticmethod
    def get_test_by_name(name, token):
        response = requests.get(url=API_SERVER + "/test/{}".format(name),
                                headers={"x-access-token": token})

        if response.status_code != 200:
            return response.status_code, None
        else:
            return response.status_code, response.json()

    @staticmethod
    def delete_test_by_name(name, token):
        response = requests.delete(url=API_SERVER + "/test/{}".format(name),
                                   headers={"x-access-token": token})

        return response.status_code

    @staticmethod
    def get_files_by_test_name(name, token):
        response = requests.get(url=API_SERVER + "/test/{}/files".format(name),
                                headers={"x-access-token": token})

        if response.status_code != 200:
            return response.status_code, None
        else:
            return response.status_code, response.json()

    @staticmethod
    def create_file_by_test_name(name, filename, file_content, token):
        f = {
            "name": filename,
            "content": file_content
        }
        response = requests.post(url=API_SERVER + "/test/{}/files".format(name), json=f,
                                 headers={"x-access-token": token})

        return response.status_code


class Task:
    def __init__(self):
        pass

    @staticmethod
    def create_task(name, test, description, token):
        task = {
            "name": name,
            "test": test,
            "description": description
        }
        response = requests.post(url=API_SERVER + "/task", json=task,
                                 headers={"x-access-token": token})
        return response.status_code

    @staticmethod
    def list_tasks(token):
        response = requests.get(API_SERVER + "/task",
                                headers={"x-access-token": token})

        if response.status_code != 200:
            return response.status_code, None
        else:
            return response.status_code, response.json()

    @staticmethod
    def get_task_by_name(name, token):
        response = requests.get(url=API_SERVER + "/task/{}".format(name),
                                headers={"x-access-token": token})

        if response.status_code != 200:
            return response.status_code, None
        else:
            return response.status_code, response.json()

    @staticmethod
    def delete_task_by_name(name, token):
        response = requests.delete(url=API_SERVER + "/task/{}".format(name),
                                   headers={"x-access-token": token})

        return response.status_code

    @staticmethod
    def create_task_submission(name, filename, file_content, token):
        pl = {
            "name": filename,
            "content": file_content
        }
        response = requests.post(url=API_SERVER + "/task/{}/submission".format(name), json=pl,
                                 headers={"x-access-token": token})

        return response.status_code

    @staticmethod
    def list_task_submissions(name, token):
        response = requests.get(url=API_SERVER + "/task/{}/submission".format(name),
                                headers={"x-access-token": token})

        if response.status_code != 200:
            return response.status_code, None
        else:
            return response.status_code, response.json()


class Job:
    def __init__(self):
        pass

    @staticmethod
    def list_jobs(token):
        response = requests.get(API_SERVER + "/job",
                                headers={"x-access-token": token})

        if response.status_code != 200:
            return response.status_code, None
        else:
            return response.status_code, response.json()

    @staticmethod
    def get_job_by_uuid(uuid, token):
        response = requests.get(API_SERVER + "/job/{}".format(uuid),
                                headers={"x-access-token": token})

        if response.status_code != 200:
            return response.status_code, None
        else:
            return response.status_code, response.json()

    @staticmethod
    def get_job_result_by_uuid(uuid, token):
        response = requests.get(API_SERVER + "/job/{}/result".format(uuid),
                                headers={"x-access-token": token})

        if response.status_code != 200:
            return response.status_code, None
        else:
            return response.status_code, response.json()

    @staticmethod
    def post_job_result_by_uuid(uuid, token):
        job_result = {}

        response = requests.post(API_SERVER + "/job/{}/result".format(uuid), json=job_result,
                            headers={"x-access-token": token})

        return response.status_code

def expect(actual, expected, message):
    if actual != expected:
        print "{}: FAIL".format(message)
        print "   Got: {}".format(actual)
        print "   Expected: {}".format(expected)
        exit(1)

    print "{}: OK".format(message)


def test_user():
    # auth
    status, _ = User.auth(50, 50)
    expect(status, 400, "auth should return bad request with invalid parameters")
    time.sleep(0.1)

    status, _ = User.auth("user", "user")
    expect(status, 401, "auth should return unauthorized if user doesn't exists")
    time.sleep(0.1)

    status, token_json = User.auth(admin_user, admin_password)
    expect(status, 200, "auth should return 200 when credentials are ok")
    time.sleep(0.1)
    token = token_json["value"]

    # get all users
    status, _ = User.list_users("asdf")
    expect(status, 401, "get users should return 401 when token is invalid")
    time.sleep(0.1)

    status, users = User.list_users(token)
    expect(status, 200, "get users should return 200 when token is ok")
    expect(len(users), 2, "get users should return all users when token is ok")
    expect('password' in users[0].keys(), False, "user data should not contain password")
    time.sleep(0.1)

    # create user
    status = User.create_user(None, "something", "something@example.com")
    expect(status, 400, "create user should return bad request when parameters are invalid")
    time.sleep(0.1)

    status = User.create_user(admin_user, "password", "admin@example.com")
    expect(status, 409, "create user should return conflict when user already exists")
    time.sleep(0.1)

    status = User.create_user("testUser", "testPassword", "admin@example.com")
    expect(status, 201, "create user should return 201 when everything is ok")
    time.sleep(0.1)

    # get user by na1e
    status, _ = User.get_user_by_username("asdf", "whatever")
    expect(status, 401, "get user by name should return unauthorized when token is not ok")
    time.sleep(0.1)

    status, _ = User.get_user_by_username(token, "someUser")
    expect(status, 404, "get user by name should return not found when user doesn't exists")
    time.sleep(0.1)

    status, user = User.get_user_by_username(token, "testUser")
    expect(status, 200, "get user by name should return 200 when there is a user")
    expect(user is None, False, "user is not None")
    time.sleep(0.1)

    # change user permissions
    status = User.change_user_permissions(token, "testUser", "ahbla")
    expect(status, 400, "change user permissions should return bad request when permission is invalid")
    time.sleep(0.1)

    no_perm_token = User.auth("testUser", "testPassword")
    status = User.change_user_permissions(no_perm_token, "testUser", admin_user)
    expect(status, 401, "change user permissions should 401 if unauthorized token is provided")
    time.sleep(0.1)

    status = User.change_user_permissions(token, "somebody", admin_user)
    expect(status, 404, "change user permissions should return 404 when user doesn't exists")
    time.sleep(0.1)

    status = User.change_user_permissions(token, "testUser", "student")
    expect(status, 200, "change user permissions should return 200 if everything is fine")
    time.sleep(0.1)

    # delete user
    status = User.delete_user_by_username(token, "testUser")
    expect(status, 200, "delete user should work if everything is fine")
    time.sleep(0.1)


def test_env():
    status, token_json = User.auth(admin_user, admin_password)
    token = token_json["value"]
    time.sleep(0.1)

    # create env
    status = Env.create_env("testEnv", "testEnv:latest", "Something", "/mnt/out", "/mnt/test", token)
    expect(status, 201, "create env should create env when everything is ok")
    time.sleep(0.1)

    status = Env.create_env(543, "testEnv:latest", "Something", "/mnt/out", "/mnt/test", token)
    expect(status, 400, "create env should return bad request when params are wrong")
    time.sleep(0.1)

    status = Env.create_env("testEnv", "testEnv:latest", "Something", "/mnt/out", "/mnt/test", "asdf")
    expect(status, 401, "create env should return unauthorized when token is invalid")
    time.sleep(0.1)

    status = Env.create_env("testEnv", "testEnv:latest", "Something", "/mnt/out", "/mnt/test", token)
    expect(status, 409, "create env should return conflict when env already exists")
    time.sleep(0.1)

    # list envs
    status, _ = Env.list_envs("asdf")
    expect(status, 401, "lsit envs should return unauthorized when token is invalid")
    time.sleep(0.1)

    status, envs = Env.list_envs(token)
    expect(status, 200, "list envs should return 200 when token is good")
    expect(len(envs), 1, "all envs should be returned")
    time.sleep(0.1)

    # get env by name
    status, _ = Env.get_env_by_name("testEnv", "asdf")
    expect(status, 401, "get env should return unauthorized when token is invalid")
    time.sleep(0.1)

    status, _ = Env.get_env_by_name("someEnv", token)
    expect(status, 404, "get env should return not found if env doesn't exist")
    time.sleep(0.1)

    status, _ = Env.get_env_by_name("testEnv", token)
    expect(status, 200, "get env should return 200 when everything is fine")
    time.sleep(0.1)

    # delete env
    status = Env.delete_env_by_name("testEnv", "something")
    expect(status, 401, "delete env returns unauthorized if token is invalid")
    time.sleep(0.1)

    status = Env.delete_env_by_name("someEnv", token)
    expect(status, 404, "delete env should return not found when env doesn't exist")
    time.sleep(0.1)

    status = Env.delete_env_by_name("testEnv", token)
    expect(status, 200, "delete env should return 200 when everything is fine")


def test_test():
    # setup
    _, token_json = User.auth(admin_user, admin_password)
    time.sleep(0.1)
    token = token_json["value"]
    _ = User.create_user("testUser", "password", "test@example.com")
    _, no_perm_token_json = User.auth("testUser", "password")
    no_perm_token = no_perm_token_json["value"]
    _ = Env.create_env("testEnv", "testEnv:latest", "Something", "/mnt/out", "/mnt/test", token)
    env = {
        "name": "testEnv",
        "image": "testEnv:latest",
        "description": "Something",
        "out_mount": "/mnt/out",
        "test_mount": "/mnt/test"
    }
    time.sleep(0.1)

    # create test
    status = Test.create_test("testTest", "bad env", "some description", token)
    expect(status, 400, "create test should return bad request if env is not an object")
    time.sleep(0.1)

    status = Test.create_test(5312, env, "some description", token)
    expect(status, 400, "create test should return bad request if parameters are not valid")
    time.sleep(0.1)

    status = Test.create_test("testTest", env, "some description", no_perm_token)
    expect(status, 401, "create test should return unauthorized if user lacks permissions")
    time.sleep(0.1)

    status = Test.create_test("testTest", env, "some description", token)
    expect(status, 201, "create test should return 201 when everything is fine")
    time.sleep(0.1)

    status = Test.create_test("testTest", env, "some description", token)
    expect(status, 409, "create test should return conflict when test already exists")
    time.sleep(0.1)

    # list tests
    status, _ = Test.list_tests(no_perm_token)
    expect(status, 401, "list tests should return unauthorized if user lacks permissions")
    time.sleep(0.1)

    status, tests = Test.list_tests(token)
    expect(status, 200, "list tests should return 200 when everything is fine")
    expect(len(tests), 1, "list tests should return all tests")
    time.sleep(0.1)

    # get test by name
    status, _ = Test.get_test_by_name("testTest", no_perm_token)
    expect(status, 401, "get test by name should return unauthorized if user lacks permissions")
    time.sleep(0.1)

    status, _ = Test.get_test_by_name("someTest", token)
    expect(status, 404, "get test by name should return not found if test doesn't exists")
    time.sleep(0.1)

    status, _ = Test.get_test_by_name("testTest", token)
    expect(status, 200, "get test by name should return 200 when everything is fine")
    time.sleep(0.1)

    # create file by test name
    status = Test.create_file_by_test_name("testTest", "in.txt", 30, token)
    expect(status, 400, "create test file should return bad request if file format is invalid")
    time.sleep(0.1)

    status = Test.create_file_by_test_name("testTest", "in.txt", "30", no_perm_token)
    expect(status, 401, "create test file should return unauthorized if user lacks permissions")
    time.sleep(0.1)

    status = Test.create_file_by_test_name("someTest", "in.txt", "10", token)
    expect(status, 404, "create test file should return not found if test doesn't exist")
    time.sleep(0.1)

    status = Test.create_file_by_test_name("testTest", "in.txt", "10", token)
    expect(status, 201, "create test file should return 201 if everything is fine")
    time.sleep(0.1)

    # get files by test name
    status, _ = Test.get_files_by_test_name("testTest", no_perm_token)
    expect(status, 401, "get test files should return unauthorized if user lacks permissions")
    time.sleep(0.1)

    status, _ = Test.get_files_by_test_name("someTest", token)
    expect(status, 404, "get test files should return not found if test doesn't exist")
    time.sleep(0.1)

    status, files = Test.get_files_by_test_name("testTest", token)
    expect(status, 200, "get test files should return 200 if everything is fine")
    expect(len(files), 1, "get test files should return all files")
    time.sleep(0.1)

    # delete test
    status = Test.delete_test_by_name("testTest", no_perm_token)
    expect(status, 401, "delete test should return unauthorized if user lacks permissions")
    time.sleep(0.1)

    status = Test.delete_test_by_name("someTest", token)
    expect(status, 404, "delete test should return not found when test doesn't exist")
    time.sleep(0.1)

    status = Test.delete_test_by_name("testTest", token)
    expect(status, 200, "delete test should return 200 if everything is fine")
    time.sleep(0.1)

    # cleanup
    User.delete_user_by_username(token, "testUser")
    Env.delete_env_by_name("testEnv", token)


def test_task():
    # setup
    _, token_json = User.auth(admin_user, admin_password)
    time.sleep(0.1)
    token = token_json["value"]
    _ = User.create_user("testUser", "password", "test@example.com")
    _, no_perm_token_json = User.auth("testUser", "password")
    no_perm_token = no_perm_token_json["value"]
    status = Env.create_env("someTestEnv", "someTestEnv:latest", "Something", "/mnt/out", "/mnt/test", token)
    expect(status, 201, "created test env")
    time.sleep(0.1)
    env = {
        "name": "someTestEnv",
        "image": "someTestEnv:latest",
        "description": "Something",
        "out_mount": "/mnt/out",
        "test_mount": "/mnt/test"
    }
    time.sleep(0.1)
    status = Test.create_test("testTest", env, "some description", token)
    expect(status, 201, "created test test")
    test = {
        "name": "testTest",
        "env": env,
        "description": "some description"
    }
    time.sleep(1)

    # create task
    status = Task.create_task("testTask", test, "some task", token)
    expect(status, 201, "create task should create task when everything is ok")
    time.sleep(0.1)

    status = Task.create_task(543, test, "some task", token)
    expect(status, 400, "create task should return bad request when params are wrong")
    time.sleep(0.1)

    status = Task.create_task("testTask", "something", "some task", token)
    expect(status, 400, "create task should return bad request when test is wrong")
    time.sleep(0.1)

    status = Task.create_task("testTask", test, "some task", no_perm_token)
    expect(status, 401, "create task should return unauthorized when token is invalid")
    time.sleep(0.1)

    status = Task.create_task("testTask", test, "some task", token)
    expect(status, 409, "create task should return conflict when env already exists")
    time.sleep(0.1)

    # list envs
    status, _ = Task.list_tasks("asdf")
    expect(status, 401, "list tasks should return unauthorized when token is invalid")
    time.sleep(0.1)

    status, tasks = Task.list_tasks(token)
    expect(status, 200, "list tasks should return 200 when token is good")
    expect(len(tasks), 1, "all task should be returned")
    time.sleep(0.1)

    status, _ = Task.list_tasks(no_perm_token)
    expect(status, 200, "list tasks should return 200 even if user has lowest permissions")
    time.sleep(0.1)

    # get task by name
    status, _ = Task.get_task_by_name("testTask", "asdf")
    expect(status, 401, "get task should return unauthorized when token is invalid")
    time.sleep(0.1)

    status, _ = Task.get_task_by_name("someTask", token)
    expect(status, 404, "get task should return not found if task doesn't exist")
    time.sleep(0.1)

    status, _ = Task.get_task_by_name("testTask", token)
    expect(status, 200, "get task should return 200 when everything is fine")
    time.sleep(0.1)

    status, _ = Task.get_task_by_name("testTask", no_perm_token)
    expect(status, 200, "get task should return 200 even when user has lowest permissions")
    time.sleep(0.1)

    # get task submissions
    status, _ = Task.list_task_submissions("testTask", no_perm_token)
    expect(status, 401, "get task submissions should return unauthorized if user lacks permissions")
    time.sleep(0.1)

    status, _ = Task.list_task_submissions("someTask", token)
    expect(status, 404, "get task submissions should return not found if task doesn't exist")
    time.sleep(0.1)

    status, tasks = Task.list_task_submissions("testTask", token)
    expect(status, 200, "get task submissions should return 200 if everything is fine")
    expect(len(tasks), 0, "get task submissions should return empty array")
    time.sleep(0.1)

    # delete task
    status = Task.delete_task_by_name("testTask", "something")
    expect(status, 401, "delete task should return unauthorized if token is invalid")
    time.sleep(0.1)

    status = Task.delete_task_by_name("someTask", token)
    expect(status, 404, "delete task should return not found when task doesn't exist")
    time.sleep(0.1)

    status = Task.delete_task_by_name("testTask", token)
    expect(status, 200, "delete task should return 200 when everything is fine")
    time.sleep(0.1)

    # cleanup
    User.delete_user_by_username(token, "testUser")
    Test.delete_test_by_name("testTest", token)
    Env.delete_env_by_name("testEnv", token)


def create_mock_users(token):
    status = User.create_user("phil", "password", "phil@olympos.com")
    expect(status, 201, "creating teacher user")
    time.sleep(0.1)

    status = User.change_user_permissions(token, "phil", "teacher")
    expect(status, 200, "giving permission to teacher")
    time.sleep(0.1)

    status = User.create_user("hercules", "password", "hercules@olympos.com")
    expect(status, 201, "creating first student user")
    time.sleep(0.1)

    status = User.change_user_permissions(token, "hercules", "student")
    expect(status, 200, "giving permission to first student")
    time.sleep(0.1)

    status = User.create_user("odysseus", "password", "odysseus@olympos.com")
    expect(status, 201, "creating second student user")
    time.sleep(0.1)

    status = User.change_user_permissions(token, "odysseus", "student")
    expect(status, 200, "giving permission to second student")
    time.sleep(0.1)


# MOCK DATA START
envs = [{
            "name": "Gaia-0.1",
            "image": "olympos/gaia:0.1",
            "description": """Gaia is the base test environment provided with olympos. It is capable of testing "python 2.7", "c", and "c++" programs.
It has the following commands:
1. Bash: Execute a bash "command" with an "arg" list.
2. Assert File: Check if two files are equal.
""",
            "test_mount": "/mnt/test",
            "out_mount": "/mnt/out"
}, {
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
}]

tests = [{
    # Hello World Test
    "test": {
        "name": "Hello World Test",
        "description": """Hello world is one of the demo tests provided with olympos.
The tested program needs to read a line from "hello.in" and print it to "hello.out". Only one test case exists containing "hello-world".
This is one of the simplest tests, since it only uses 2 tasks: "bash" and "assert_file".
""",
        "env": envs[0],
    },
    # Hello World Test files
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
}, {
    # Greatest Common Divisor Test
    "test": {
        "name": "Greatest Common Divisor Test",
        "description": """A test for a program that calculates the GCD of two numbers.
The tested program needs to read two numbers from 'stdin' and print the "GCD" of the two to 'stdout'.

The program needs to be written in c.
""",
        "env": envs[1]
    },
    "files": [{
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
    }, {
        "name": "/in/rel-prime.in",
        "content": """3 5"""
    }, {
        "name": "/out/rel-prime.out",
        "content": """1"""
    }, {
        "name": "/in/have-div.in",
        "content": """60 45"""
    }, {
        "name": "/out/have-div.out",
        "content": """15"""
    }, {
        "name": "/in/oda.in",
        "content": """60 120"""
    }, {
        "name": "/out/oda.out",
        "content": """60"""
    }]
}]

tasks = [{
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
    "test": tests[0]["test"]
}, {
    "name": "Greatest Common Divisor",
    "description": """The task is to write a "c" program that reads 2 numbers and calculates their greatest common divisor.
""",
    "test": tests[1]["test"]
}]

submissions = [{
    "username": "hercules",
    "password": "password",
    "file": {
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
    },
    "toTask": "Hello World"
}, {
    "username": "hercules",
    "password": "password",
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
    },
    "toTask": "Hello World"
}]

# MOCK DATA END


def create_mock_data(token):
    for env in envs:
        status = Env.create_env(env["name"],
                                env["image"],
                                env["description"],
                                env["out_mount"],
                                env["test_mount"],
                                token)
        expect(status, 201, "creating env {}".format(env["name"]))
        time.sleep(0.1)

    for testData in tests:
        test = testData["test"]
        files = testData["files"]
        status = Test.create_test(test["name"],
                                  test["env"],
                                  test["description"],
                                  token)
        expect(status, 201, "creating test {}".format(test["name"]))
        time.sleep(0.1)

        for f in files:
            status = Test.create_file_by_test_name(test["name"],
                                                   f["name"],
                                                   f["content"],
                                                   token)
            expect(status, 201, "creating file {}".format(f["name"]))

    for task in tasks:
        status = Task.create_task(task["name"],
                                  task["test"],
                                  task["description"],
                                  token)
        expect(status, 201, "creating task {}".format(task["name"]))
        time.sleep(0.1)


def mock_submissions():
    for submission in submissions:
        status, auth_token_json = User.auth(submission["username"],
                                            submission["password"])
        expect(status, 200, "authenticate user: {}".format(submission["username"]))
        token = auth_token_json["value"]
        time.sleep(0.1)

        status = Task.create_task_submission(submission["toTask"],
                                             submission["file"]["name"],
                                             submission["file"]["content"],
                                             token)
        expect(status, 201, "submit solution to task {}".format(submission["toTask"]))
        time.sleep(1)


def test_job():
    _, token_json = User.auth("phil", "password")
    token = token_json["value"]
    time.sleep(0.1)
    _, no_perm_token_json = User.auth("hercules", "password")
    no_perm_token = no_perm_token_json["value"]
    time.sleep(0.1)

    # get all jobs
    status, _ = Job.list_jobs(no_perm_token)
    expect(status, 401, "get all jobs should return unauthorized if user lacks permissions")
    time.sleep(0.1)

    status, jobs = Job.list_jobs(token)
    expect(status, 200, "get all jobs should return 200 when everything is fine")
    expect(len(jobs), len(submissions), "get all jobs should return all jobs")
    uuid = jobs[0]["uuid"]
    time.sleep(0.1)

    # get job by uuid
    status, _ = Job.get_job_by_uuid(uuid, no_perm_token)
    expect(status, 401, "get job by uuid should return unauthorized if user lacks permissions")
    time.sleep(0.1)

    status, _ = Job.get_job_by_uuid("some-id", token)
    expect(status, 404, "get job by uuid should return not found when job doesn't exist")
    time.sleep(0.1)

    status, _ = Job.get_job_by_uuid(uuid, token)
    expect(status, 200, "get job by uuid should return 200 when everything is fine")
    time.sleep(0.1)

    # post job result by uuid
    status = Job.post_job_result_by_uuid(uuid, token)
    expect(status, 401, "post job result should return unauthorized for every user expect jobrunner")
    time.sleep(0.1)

    # get job result by uuid
    status, _ = Job.get_job_result_by_uuid(uuid, "asdf")
    expect(status, 401, "get job result by uuid should return unauthorized when token is not valid")
    time.sleep(0.1)

    status, _ = Job.get_job_result_by_uuid("some-id", no_perm_token)
    expect(status, 404, "get job result by uuid should return not found if job doesn't exist")
    time.sleep(0.1)

    status, _ = Job.get_job_result_by_uuid(uuid, no_perm_token)
    expect(status, 200, "get job result should return 200 even if user has low permissions")
    time.sleep(0.1)

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print "Usage python data.py <test-api | add-mock-data | test-run> <admin_user> <admin_password> <api_endpoint>"
        exit(1)

    admin_user = sys.argv[2]
    admin_password = sys.argv[3]
    API_SERVER = sys.argv[4]

    if sys.argv[1] == "test-api":
        print "Testing user endpoints ..."
        test_user()
        print "OK!"
        time.sleep(1)

        print "Testing env endpoints ..."
        test_env()
        print "OK!"
        time.sleep(1)

        print "Testing test endpoints ..."
        test_test()
        print "OK!"
        time.sleep(1)

        print "Testing task endpoints ..."
        test_task()
        print "OK!"
        time.sleep(1)
        exit(0)

    if sys.argv[1] == "add-mock-data":
        st, token_json = User.auth(admin_user, admin_password)
        expect(st, 200, "Authenticating")
        tkn = token_json["value"]
        time.sleep(0.1)

        print "Creating mock users ..."
        create_mock_users(tkn)
        print "DONE!"
        print "NOTE: These users are used to showcase the functions of the olympos testing framework " \
              "(and some tests as well). You should delete them."

        print "Creating mock data ..."
        create_mock_data(tkn)
        print "DONE!"
        print "You can use these examples as reference for your own project. :)"

        exit(0)

    if sys.argv[1] == "test-run":
        print "Submitting mock solutions ..."
        mock_submissions()
        print "Waiting for jobs to run ..."
        time.sleep(5)
        test_job()
        print "DONE!"

        exit(0)

    print "Usage python data.py <test-api | add-mock-data | test-run> <admin_user> <admin_password> <api_endpoint>"
