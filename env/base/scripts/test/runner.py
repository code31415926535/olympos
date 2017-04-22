import logging
import os

from config import TestConfig
from task_manager import TaskManager
from case import TestCase
from exception.exception import ConfigurationException


class TestRunner(object):
    """
        Class that can run a given test.
        The flow is the following:
            - load config
            - load init tasks
            - load tests
            - run init tasks
            - run tests
            - get result
    """

    def __init__(self):
        self.config = None
        self.init_tasks = []
        self.tests = []

    def load_config(self):
        self.config = TestConfig()
        self.config.load()

        logging.info("configuration loaded!")

    def load_init_tasks(self):
        logging.debug("loading init tasks ...")

        init_task_list = self.config.get_init_tasks()
        for init_task_definition in init_task_list:
            logging.debug("loading: {}" .format(init_task_definition))
            self.init_tasks.append(TaskManager.create_task(init_task_definition))

        logging.info("init tasks loaded!")

    def load_tests(self):
        logging.debug("loading test cases ...")

        test_definitions = self.config.get_tests()
        for test_definition in test_definitions:
            case = test_definition.get(TestConfig.FieldFor).get(TestConfig.FieldCase)
            do = test_definition.get(TestConfig.FieldDo)
            test = TestCase(case)

            before_execution_task_definition = do.get(TestConfig.FieldBeforeExecution)
            if before_execution_task_definition is not None:
                logging.debug("before execution: {}" .format(before_execution_task_definition))
                test.add_after_execution_task(TaskManager.create_task(before_execution_task_definition))

            execute_task_definition = do.get(TestConfig.FieldExecute)
            if execute_task_definition is None:
                raise ConfigurationException(reason="No execute task!")
            logging.debug("execute: {}" .format(execute_task_definition))
            test.add_execute_task(TaskManager.create_task(execute_task_definition))

            evaluate_task_definition = do.get(TestConfig.FieldEvaluate)
            if evaluate_task_definition is None:
                raise ConfigurationException(reason="No evaluate task!")
            logging.debug("evaluate: {}" .format(evaluate_task_definition))

            after_execution_task_definition = do.get(TestConfig.FieldAfterExecution)
            if after_execution_task_definition is not None:
                logging.debug("after execution: {}" .format(after_execution_task_definition))
                test.add_after_execution_task(TaskManager.create_task(after_execution_task_definition))

            self.tests.append(test)

    def run_init_tasks(self):
        for init_task in self.init_tasks:
            print init_task

    def run_tests(self):
        for test in self.tests:
            test.run_before_execution_task()
            test.run_execute_task()
            test.run_evaluate_task()
            test.run_after_execution_task()

    def get_result(self):
        pass
