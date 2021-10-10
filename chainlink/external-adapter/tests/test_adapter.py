import pytest
import adapter

job_run_id = '1'


def adapter_setup(test_data):
    a = adapter.Adapter(test_data)
    return a.result

