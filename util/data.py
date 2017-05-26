import json
import requests
import time
import sys

API_SERVER = "http://localhost:8080"


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

    status, token_json = User.auth("admin", "admin")
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

    status = User.create_user("admin", "password", "admin@example.com")
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
    status = User.change_user_permissions(no_perm_token, "testUser", "admin")
    expect(status, 401, "change user permissions should 401 if unauthorized token is provided")
    time.sleep(0.1)

    status = User.change_user_permissions(token, "somebody", "admin")
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
    status, token_json = User.auth("admin", "admin")
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
    _, token_json = User.auth("admin", "admin")
    time.sleep(0.1)
    token = token_json["value"]
    _ = User.create_user("testUser", "password", "test@example.com")
    _, no_perm_token = User.auth("testUser", "password")
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

    # cleanup
    User.delete_user_by_username(token, "testUser")
    Env.delete_env_by_name("testEnv", token)


def run_tests():
    test_user()
    test_env()
    test_test()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print "Usage python data.py <test | production>"
        exit(1)

    if sys.argv[1] == "test":
        run_tests()
        exit(0)

    if sys.argv[1] == "production":
        pass

    print "Usage python data.py <test | production>"
