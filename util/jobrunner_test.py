import json
import requests
import time

test_job_json = {
    "uuid": "test_job_json_uuid",
    "status": "running",
    "test": {
        "config": [
            {
                "key": "TEST_ROOT",
                "value": "/test"
            },
            {
                "key": "OUT_ROOT",
                "value": "/out"
            }
        ],
        "env": {
            "name": "base",
            "image": "olympos/gaia:latest"
        },
        "files": [{
            "name": "config.yaml",
            "content": "TODO: FILL THIS IN"
        }, {
            "name": "/in/case-yes.txt",
            "content": "3"
        }, {
            "name": "/in/case-no.txt",
            "content": "4"
        }, {
            "name": "/out/case-yes.txt",
            "content": "yes"
        }, {
            "name": "/out/case-no.txt",
            "content": "no"
        }]
    },
    "submission": {
        "file": {
            "name": "test-submission.c",
            "content": "TODO: FILL THIS IN"
        }
    }
}


def run_test_job():
    response = requests.post(url="http://localhost:8087", json=test_job_json)
    print response

run_test_job()