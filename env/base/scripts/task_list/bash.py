import os

from task import Task
from exception.exception import TaskExecutionException, TaskConfigurationException


class Bash(Task):
    """
        Execute a bash command.

        arg:
          command: <string>
          args: [<string>]
    """
    def __init__(self):
        Task.__init__(self)
        self.command = ""

    def configure(self, arg):
        try:
            self.command = arg.get("command")
            for a in arg.get("args"):
                self.command = self.command + " " + a
        except:
            raise TaskConfigurationException(task=self.name, reason="Bad task arguments.")

    def execute(self):
        try:
            self.status_code = os.system(self.command)
            if self.status_code != 0:
                raise TaskExecutionException(task=self.name, error="Return code: {}" .format(self.status_code))
        except Exception as exc:
            raise TaskExecutionException(task=self.name, error="Got exception: {}" .format(exc))

    def set_name(self):
        return "bash"
