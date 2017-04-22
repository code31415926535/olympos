import os


class ConfigMap(object):
    """
        Config map singleton used to store instance configuration.

        The following env is loaded:
            UUID:       unique id of the run
            TEST_ROOT:  root directory of the test files
            OUT_ROOT:   output directory where output files go
    """

    instance = None

    class __ConfigMap(object):
        def __init__(self):
            self.uuid = os.getenv("UUID")
            self.testDir = os.path.abspath(os.getenv("TEST_ROOT", "."))
            self.outDir = os.path.abspath(os.getenv("OUT_ROOT", "."))

    def __init__(self):
        if not ConfigMap.instance:
            ConfigMap.instance = ConfigMap.__ConfigMap()

    def uuid(self):
        return self.instance.uuid

    def test_dir(self):
        return self.instance.testDir

    def out_dir(self):
        return self.instance.outDir

