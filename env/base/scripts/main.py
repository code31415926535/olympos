import logging
import os
import sys
import json

from configmap.configmap import ConfigMap
from test.runner import TestRunner
from exception.exception import CustomException


def setup_logger():
    logging.basicConfig(format="%(asctime)s %(levelname)-8s %(message)s", level=logging.DEBUG)
    logging.debug("Logger configured!")


def terminate(e, result):
    if e is not None:
        result.set_result(e.code, e.message)
    else:
        result.set_result(0, "")

    outfile = os.path.join(ConfigMap().out_dir(), "result.json")
    with open(outfile, "w") as fd:
        fd.write(json.dumps(result.get_result()))

    if e is not None:
        logging.error("Encountered exception: {} with message: {}"
                      .format(e.code(), e.message()))
        sys.exit(1)
    else:
        logging.info("test case ran successfully!")
        sys.exit(0)


if __name__ == "__main__":
    setup_logger()

    runner = TestRunner()
    try:
        runner.load_config()
        runner.prepare_execution()
        runner.load_init_tasks()
        runner.load_tests()
        runner.run_init_tasks()
        runner.run_tests()
    except CustomException as exc:
        terminate(exc, runner.get_result())

    terminate(None, runner.get_result())
