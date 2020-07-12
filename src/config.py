from decouple import config

DEBUG = config("DEBUG", default=False, cast=bool)
