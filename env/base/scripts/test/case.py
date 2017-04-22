

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
        pass

    def run_execute_task(self):
        pass

    def run_evaluate_task(self):
        pass

    def run_after_execution_task(self):
        pass

    def get_name(self):
        return self.name
