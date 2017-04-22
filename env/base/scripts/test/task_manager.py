from task_list.__task__ import Map
from config import TestConfig


class TaskManager:

    def __init__(self):
        pass

    @staticmethod
    def create_task(task_definition):
        name = task_definition.get(TestConfig.FieldName)
        arg = task_definition.get(TestConfig.FieldArg)

        task = Map.get(name)()
        task.configure(arg)

        return task
