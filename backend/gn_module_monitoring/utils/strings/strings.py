"""
libs.strings

By default, uses `en-gb.json` file inside the `strings` top-level folder.

If language changes, set `libs.strings.default_locale` and run `libs.strings.refresh()`.
"""
import json,os

default_locale = "en-gb"
cached_strings = {}
dir = os.path.dirname(os.path.realpath(__file__))
# parent_dir = os.path.abspath(os.path.join(dir, os.pardir))
def refresh():
    print("Refreshing...")
    global cached_strings
    with open(os.path.join(dir,f"{default_locale}.json")) as f:
        cached_strings = json.load(f)


def gettext(name):
    return cached_strings[name]


refresh()
