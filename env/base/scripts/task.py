import os
import logging


class Task(object):
    def __init__(self):
        pass

    def execute(self):
        raise NotImplementedError("This method needs to be implemented by every task.")


class TaskConfigurationError(Exception):
    def __init__(self, message):
        super(TaskConfigurationError, self).__init__(message)


class BadTaskArgumentsError(Exception):
    def __init__(self, message):
        super(BadTaskArgumentsError, self).__init__(message)


class TaskExecutionError(Exception):
    def __init__(self, message):
        super(TaskExecutionError, self).__init__(message)


# Commands
class Execute(Task):

    def __init__(self, arg):
        Task.__init__(self)

        try:
            self.command = arg["command"]
            for i in arg["args"]:
                self.command = self.command + " " + i
        except:
            raise BadTaskArgumentsError("Bad arguments for task 'exec'")

    def __str__(self):
        return "Execute[{}]" .format(self.command)

    def execute(self):
        try:
            parsed = os.path.expandvars(self.command)
            logging.debug(parsed)
            ret = os.system(parsed)
            if ret != 0:
                raise TaskExecutionError("Failed to execute command {}. Non-zero return value {}" .format(self.command, ret))
            logging.debug("OS returned {}" .format(ret))
        except Exception as e:
            raise TaskExecutionError("Failed to execute command {}. Received error {}" .format(self.command, e))


# Evaluation
class Assert(Task):

    def __init__(self, arg):
        Task.__init__(self)

        try:
            self.actual = arg["actual"]
            self.expected = arg["expected"]
        except:
            raise BadTaskArgumentsError("Bad arguments for task 'assert'")

    def __str__(self):
        return "Assert[{} {}]" .format(self.actual, self.expected)

    def execute(self):
        with open(os.path.expandvars(self.actual)) as fdActual:
            with open(os.path.expandvars(self.expected)) as fdExpected:
                actual = fdActual.read()
                expected = fdExpected.read()

                fdActual.close()
                fdExpected.close()

                if actual == expected:
                    return True, {}
                else:
                    return False, {"actual": actual, "expected": expected}


def create_task(task_json):

    if task_json["type"] == "exec":
        task = Execute(task_json["arg"])
    elif task_json["type"] == "assert":
        task = Assert(task_json["arg"])
    else:
        raise TaskConfigurationError("No such task {}" .format(task_json.type))

    return task
