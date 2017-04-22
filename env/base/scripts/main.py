import logging
import os
import sys

from configmap.configmap import ConfigMap
from test.runner import TestRunner
from exception.exception import CustomException


def setup_logger():
    # Configure logging
    logfile = os.path.join(ConfigMap().out_dir(), "out.log")
    logging.basicConfig(format="%(asctime)s %(levelname)-8s %(message)s", level=logging.DEBUG, filename=logfile)
    logging.debug("Logger configured!")


def terminate(e, result):
    logging.error("Encountered exception: {} with message: {}"
                  .format(e.code(), e.message()))

    # TODO: result
    print result

    sys.exit(1)


def finalize(result):
    print result
    pass

if __name__ == "__main__":
    setup_logger()

    runner = TestRunner()
    try:
        runner.load_config()
        runner.load_init_tasks()
        runner.load_tests()
        runner.run_init_tasks()
        runner.run_tests()
    except CustomException as exc:
        terminate(exc, runner.get_result())

    finalize(runner.get_result())
