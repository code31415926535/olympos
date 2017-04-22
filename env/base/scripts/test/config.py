import logging
import os
import yaml

from configmap.configmap import ConfigMap
from exception.exception import ConfigurationException


class TestConfig(object):
    """
        Test configuration object. Parses the test definition yaml file and creates the
        logic of the test.

        The config file has the following structure:
        run:
          init: [<TaskDefinition>]
          test: [
            for:
                case: string
            do:
              beforeExecution: <TaskDefinition>
              execute: <TaskDefinition>
              evaluate: <TaskDefinition>
              afterExecution: <TaskDefinition>
          ]

        TaskDefinition:
            name: <string>
            arg: dict{}
    """

    FieldRun = "run"
    FieldInit = "init"
    FieldTest = "test"
    FieldFor = "for"
    FieldCase = "case"
    FieldDo = "do"

    FieldBeforeExecution = "beforeExecution"
    FieldExecute = "execution"
    FieldEvaluate = "evaluation"
    FieldAfterExecution = "afterExecution"

    FieldName = "name"
    FieldArg = "arg"

    def __init__(self):
        self.__configuration = {}

    def load(self):
        config_file = os.path.join(ConfigMap().test_dir(), "config.yaml")
        if os.path.isfile(config_file) is False:
            raise ConfigurationException(reason="File not found: {}" .format(config_file))

        cfg = None
        with open(config_file) as fd:
            try:
                cfg = yaml.load(fd)
            except yaml.YAMLError as exc:
                logging.error(exc)
                raise ConfigurationException(reason="Failed to parse configuration file")

            fd.close()

        self.__configuration = cfg
        logging.debug("loaded config file: {}" .format(config_file))

    def get_init_tasks(self):
        return self.__configuration.get(TestConfig.FieldRun).get(TestConfig.FieldInit)

    def get_tests(self):
        return self.__configuration.get(TestConfig.FieldRun).get(TestConfig.FieldTest)
