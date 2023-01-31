# class APIError(Exception):
#     """All custom API Exceptions"""
#     pass


class InvalidUsage(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload


    def to_dict(self):
        rv = {}
        # rv['payload'] = dict(self.payload or ())
        rv["payload"] = self.payload
        rv["message"] = self.message
        rv["status_code"] = self.status_code
        return (rv,self.status_code)


class APIAuthError(Exception):
    """Custom Authentication Error Class."""

    code = 403
    description = "Authentication Error"
