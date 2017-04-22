import os

from task import Task
from exception.exception import TaskExecutionException, TaskConfigurationException


class AssertFile(Task):
    """
        Check if two files are the same.

        arg:
          actual: <string>
          expected: <string>
    """
    def __init__(self):
        Task.__init__(self)
        self.actual = None
        self.expected = None

    def configure(self, arg):
        try:
            self.actual = arg.get("actual")
            self.expected = arg.get("expected")
        except:
            raise TaskConfigurationException(task=self.name, reason="Bad task arguments.")

    def execute(self):
        try:
            with open(os.path.expandvars(self.actual)) as fdActual:
                with open(os.path.expandvars(self.expected)) as fdExpected:
                    actual = fdActual.read()
                    expected = fdExpected.read()

                    fdActual.close()
                    fdExpected.close()

                    if actual == expected:
                        self.status_code = 0
                    else:
                        self.status_code = 1
        except Exception as exc:
            raise TaskExecutionException(task=self.name, error="Got exception: {}" .format(exc))

    def set_name(self):
        return "assert_file"
