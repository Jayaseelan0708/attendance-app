from uuid import UUID

# to verify the sid is valid or not(company service)
def is_valid_uuid(val: str):
    try:
        UUID(val)
        return True
    except ValueError:
        return False

#  to verify weather the who logged in (company service)
def is_valid_token(request):
    try:
        token = request.headers.get('Authorization')
        # Write mysql query to validate the token - Table name: login_devices
        return True
    except Exception:
       return False