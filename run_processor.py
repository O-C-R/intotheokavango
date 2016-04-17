#!/usr/bin/env python3

import sys, importlib

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("[processor]")
        exit()
    processor_name = sys.argv[1]
    module_name = "processors.%s" % processor_name
    module = importlib.import_module(module_name)    

