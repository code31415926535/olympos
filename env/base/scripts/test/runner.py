import logging
import os

from configmap.configmap import ConfigMap
from config import TestConfig
from task_manager import TaskManager
from case import TestCase
from result import Result
from exception.exception import ConfigurationException, TaskExecutionException


class TestRunner(object):
    """
        Class that can run a given test.
        The flow is the following:
            - load config
            - prepare execution
            - load init tasks
            - load tests
            - run init tasks
            - run tests
            - get result
    """

    def __init__(self):
        self.config = None
        self.result = None
        self.init_tasks = []
        self.tests = []

    def load_config(self):
        self.config = TestConfig()
        self.config.load()

        logging.info("configuration loaded!")

    def prepare_execution(self):
        os.chdir(ConfigMap().test_dir())

        self.result = Result()

        logging.info("prepared execution!")

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
                test.add_before_execution_task(TaskManager.create_task(before_execution_task_definition))

            execute_task_definition = do.get(TestConfig.FieldExecute)
            if execute_task_definition is None:
                raise ConfigurationException(reason="No execute task!")
            logging.debug("execute: {}" .format(execute_task_definition))
            test.add_execute_task(TaskManager.create_task(execute_task_definition))

            evaluate_task_definition = do.get(TestConfig.FieldEvaluate)
            if evaluate_task_definition is None:
                raise ConfigurationException(reason="No evaluate task!")
            logging.debug("evaluate: {}" .format(evaluate_task_definition))
            test.add_evaluate_task(TaskManager.create_task(evaluate_task_definition))

            after_execution_task_definition = do.get(TestConfig.FieldAfterExecution)
            if after_execution_task_definition is not None:
                logging.debug("after execution: {}" .format(after_execution_task_definition))
                test.add_after_execution_task(TaskManager.create_task(after_execution_task_definition))

            self.tests.append(test)
            self.result.test_loaded()

        logging.info("test cases loaded!")

    def run_init_tasks(self):
        logging.debug("executing init tasks ...")
        for init_task in self.init_tasks:
            logging.debug("executing: {}" .format(init_task))
            init_task.execute()
            if init_task.get_status_code() != 0:
                raise TaskExecutionException(task=init_task.name, error="Return code: {}"
                                             .format(init_task.get_status_code()))
        logging.info("init tasks completed!")

    def run_tests(self):
        logging.debug("executing test cases ...")

        for test in self.tests:
            logging.debug("case: {}" .format(test.get_name()))
            try:
                test.run_before_execution_task()
                test.run_execute_task()
                passed = test.run_evaluate_task()
                test.run_after_execution_task()

                if passed is True:
                    self.result.case_done(test.get_name(), Result.StatusPassed)
                else:
                    self.result.case_done(test.get_name(), Result.StatusFailed)
            except TaskExecutionException as exc:
                logging.error(exc)
                logging.debug("skipping test: {}" .format(test.get_name()))

                self.result.case_done(test.get_name(), Result.StatusSkipped)

        logging.debug("test cases completed!")

    def get_result(self):
        return self.result
