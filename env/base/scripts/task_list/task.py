class Task(object):
    """
        Abstract task class. Each task has to implement this in order to be runnable.
    """
    def __init__(self):
        self.status_code = 0
        self.name = self.set_name()

    def configure(self, arg):
        """
            Configure task.
        :param arg: dict{}
        :raise: TaskConfigurationException
        """
        pass

    def execute(self):
        """
            Execute task.
        :raise: TaskExecutionException
        """
        pass

    def get_status_code(self):
        """
            Task status code. If task status code is non-zero it means the task wasn't successful.

            This is mainly used for evaluation tasks, when the status_code of 0 means 'passed'
            and other status codes mean 'fail'.
        :return: int
        """
        return self.status_code

    def set_name(self):
        """
            Return the name of the task.
        :return: string
        """
        pass
