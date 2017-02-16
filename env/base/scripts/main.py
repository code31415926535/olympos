import logging
import os
import sys
import json
import time

import task
from config import config

init_tasks = []
case_tasks = {}

runs = 0
passes = 0

result = {
    "uuid": config.get("run").get("uuid").__str__(),
    "cases": {}
}

class EXIT_STATUS():
    OK = 0
    LAB_ERROR = 1
    CONFIG_ERROR = 2
    RUN_ERROR = 3


def terminate(code=0, message="-"):
    """
    Terminate the test run.
    :param code: The program exit code.
    :param message: The program exit message.
    """

    global result

    result["result"] = {
        "code": code,
        "message": message
    }

    output_file = os.path.join(config.get("lab").get("out"), "res.json")
    with open(output_file, "wb") as fd:
        json.dump(result, fd)
        fd.close()

    if code == 0:
        logging.info("Execution finished with code 0")
        sys.exit(0)
    else:
        logging.fatal("Fatal error occurred!")
        logging.fatal("Exit code: {}" .format(code))
        logging.fatal("Message: {}" .format(message))
        sys.exit(code)


def config_logger():
    # Configure logging
    logfile = os.path.join(config.get("lab").get("out"), "log.out")
    logging.basicConfig(format="%(asctime)s %(levelname)-8s %(message)s", level=logging.DEBUG, filename=logfile)

    logging.info("Stared lab {}:{}" .format(config.get("lab").get("name"), config.get("lab").get("version")))
    logging.debug("Test uuid is {}" .format(config.get("run").get("uuid")))
    logging.debug("Lab root is set to {}" .format(config.get("lab").get("root")))


def load_config():
    global result
    # Parse test case configuration
    logging.info("Parsing test case configuration...")

    config_file = os.path.join(config.get("run").get("root"), "config.json")
    if os.path.isfile(config_file) is False:
        terminate(EXIT_STATUS.LAB_ERROR, "config.json not found in {}" .format(config.get("lab").get("root")))

    with open(config_file) as fd:
        cfg = json.load(fd)
        fd.close()

    logging.info("Loading init tasks...")
    for i in cfg["init"]:
        t = task.create_task(i)
        init_tasks.append(t)

    logging.info("Loading test cases...")
    for i in cfg["tests"]:
        pre = None
        pre_cfg = i["pre"]
        if pre_cfg is not None:
            pre = task.create_task(pre_cfg)

        run = None
        run_cfg = i["run"]
        if run_cfg is not None:
            run = task.create_task(run_cfg)
        else:
            terminate(EXIT_STATUS.CONFIG_ERROR, "No run task!")

        eval = None
        eval_cfg = i["eval"]
        if eval_cfg is not None:
            eval = task.create_task(eval_cfg)
        else:
            terminate(EXIT_STATUS.CONFIG_ERROR, "No eval task!")

        post = None
        post_cfg = i["post"]
        if post_cfg is not None:
            post = task.create_task(post_cfg)

        for case in i["cases"]:
            case_tasks[case] = {
                "pre": pre,
                "run": run,
                "eval": eval,
                "post": post
            }

    logging.info("Test cases loaded!")


def run_init():
    logging.info("Running init tasks...")
    i = None
    try:
        for i in init_tasks:
            logging.debug(i)
            i.execute()
    except:
        logging.critical("Failed at task {}" .format(i))
        terminate(code=EXIT_STATUS.RUN_ERROR, message="Failed to initialize tests.")

    logging.info("Init finished successfully!")


def run_all():
    global passes, runs
    logging.info("Started running tests...")

    for i in case_tasks:
        passed = run_case(i)
        if passed:
            passes += 1
        runs += 1

    logging.info("Test successfully executed")


def run_case(case):
    global result
    os.environ["TEST_CASE"] = case

    logging.info("Running case {}" .format(case))
    tasks = case_tasks[case]
    res = False

    if tasks["pre"] is not None:
        logging.info("Running pre task ...")
        logging.debug(tasks["pre"])
        try:
            tasks["pre"].execute()
        except Exception as e:
            logging.critical("Failed at task {} got exception {}" .format(tasks["pre"], e))
            terminate(EXIT_STATUS.RUN_ERROR, "Failed to run tests!")

    if tasks["run"] is not None:
        logging.info("Running test ...")
        logging.debug(tasks["run"])
        try:
            start_time = time.clock()
            tasks["run"].execute()
            duration = time.clock() - start_time
            # TODO: Use duration for something
            logging.info("Run took {}" .format(duration))
        except Exception as e:
            logging.critical("Failed at task {} got exception {}".format(tasks["run"], e))
            terminate(EXIT_STATUS.RUN_ERROR, "Failed to run tests!")

    if tasks["eval"] is not None:
        logging.info("Evaluating test ...")
        logging.debug(tasks["eval"])
        try:
            (res, msg) = tasks["eval"].execute()
        except Exception as e:
            logging.critical("Failed at task {} got exception {}".format(tasks["eval"], e))
            terminate(EXIT_STATUS.RUN_ERROR, "Failed to run tests!")

    if tasks["post"] is not None:
        logging.info("Running post task ...")
        logging.debug(tasks["post"])
        try:
            tasks["post"].execute()
        except Exception as e:
            logging.critical("Failed at task {} got exception {}" .format(tasks["post"], e))
            terminate(EXIT_STATUS.RUN_ERROR, "Failed to run tests!")

    result["cases"][case] = {}
    result["cases"][case]["result"] = res
    result["cases"][case]["message"] = msg
    result["cases"][case]["runtime"] = "{0:.2f} ms" .format(duration * 1000)
    return res

if __name__ == "__main__":
    config_logger()
    load_config()
    os.chdir(os.path.expandvars("${TEST_ROOT}"))
    run_init()
    run_all()

    logging.info("{} passed out of {}" .format(passes, runs))

    # Run finished
    terminate(code=EXIT_STATUS.OK)
