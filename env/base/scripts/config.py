import os
import uuid

"""
Env needed:
    LAB_NAME: <lab name>
    LAB_VERSION: <lab version>
    LAB_ROOT: <lab root>
    LAB_OUT: <lab output dir>

    TEST_ROOT: <test root>
"""

config = {
        "lab": {
            "name": os.getenv("LAB_NAME", "base"),
            "version": os.getenv("LAB_VERSION", "1.0.0"),
            "root": os.path.abspath(os.getenv("LAB_ROOT", ".")),
            "out": os.path.abspath(os.getenv("LAB_OUT", "."))
        },
        "run": {
            "uuid": uuid.uuid4(),
            "root": os.path.abspath(os.getenv("TEST_ROOT", "."))
        }
}
