class Result(object):
    """
        Class to store the result of execution in a structured form.

        Structure:
        total: int
        passed: int
        failed: int
        skipped: int
        cases: [
            name: string
            status: string
        ]
        result:
            status_code: int
            message: string
    """

    StatusSkipped = "skipped"
    StatusPassed = "passed"
    StatusFailed = "failed"

    def __init__(self):
        self.result = {
            "total": 0,
            "passed": 0,
            "failed": 0,
            "skipped": 0,
            "cases": [],
            "result": {
                "status_code": 256,
                "message": "unknown status code"
            }
        }
        self.remaining = 0

    def test_loaded(self):
        self.result["total"] += 1
        self.remaining += 1

    def skip_remaining(self):
        self.result["skipped"] = self.remaining

    def case_done(self, name, status):
        self.result[status] += 1

        self.result["cases"].append({
            "name": name,
            "status": status
        })

        self.remaining -= 1

    def get_result(self):
        return self.result

    def set_result(self, status, message):
        self.result["result"] = {
            "status_code": status,
            "message": message
        }