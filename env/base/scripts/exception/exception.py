from enum import Enum


class ErrorCodes(Enum):
    UnknownError = "UnknownError"
    LoadConfigurationError = "LoadConfigurationError"
    TaskConfigurationError = "TaskConfigurationError"
    TaskExecutionError = "TaskExecutionError"


class CustomException(Exception):
    def __init__(self, message="Unknown Error", code=ErrorCodes.UnknownError):
        self.__message = message
        self.__code = code
        super(CustomException, self).__init__(self.__message)

    def message(self):
        return self.__message

    def code(self):
        return self.__code


class ConfigurationException(CustomException):
    def __init__(self, reason=""):
        super(ConfigurationException, self).__init__(
            message="Failed to load configuration, reason: [{}]".format(reason),
            code=ErrorCodes.LoadConfigurationError
        )


class TaskConfigurationException(CustomException):
    def __init__(self, task=None, reason=""):
        super(TaskConfigurationException, self).__init__(
            message="Failed to configure task {}, reason: [{}]".format(task, reason),
            code=ErrorCodes.TaskConfigurationError
        )


class TaskExecutionException(Exception):
    def __init__(self, task=None, error=""):
        super(TaskExecutionException, self).__init__(
            message="Failed executing task {}, got error: [{}]".format(task, error),
            code=ErrorCodes.TaskExecutionError
        )
