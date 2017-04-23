from exception.exception import TaskExecutionException


class TestCase(object):
    """
        Test case object that defines and executes a test case.

        The test case lifecycle is:
            - create test (name).
            - [add task].
            - run "beforeExecution" tasks.
            - run "execute" tasks.
            - run "evaluate" tasks.
            - run "afterExecution" tasks.
    """

    def __init__(self, name):
        self.name = name
        self.beforeExecution = None
        self.execute = None
        self.evaluate = None
        self.afterExecution = None

    def add_before_execution_task(self, task):
        self.beforeExecution = task

    def add_execute_task(self, task):
        self.execute = task

    def add_evaluate_task(self, task):
        self.evaluate = task

    def add_after_execution_task(self, task):
        self.afterExecution = task

    def run_before_execution_task(self):
        if self.beforeExecution is not None:
            self.beforeExecution.execute()
            if self.beforeExecution.get_status_code() != 0:
                raise TaskExecutionException(task=self.beforeExecution.name, error="Return code: {}"
                                             .format(self.beforeExecution.get_status_code()))

    def run_execute_task(self):
        self.execute.execute()
        if self.execute.get_status_code() != 0:
            raise TaskExecutionException(task=self.execute.name, error="Return code: {}"
                                         .format(self.execute.get_status_code()))

    def run_evaluate_task(self):
        self.evaluate.execute()
        if self.evaluate.get_status_code() != 0:
            return False
        return True

    def run_after_execution_task(self):
        if self.afterExecution is not None:
            self.afterExecution.execute()
            if self.afterExecution.get_status_code() != 0:
                raise TaskExecutionException(task=self.afterExecution.name, error="Return code: {}"
                                             .format(self.afterExecution.get_status_code()))

    def get_name(self):
        return self.name
