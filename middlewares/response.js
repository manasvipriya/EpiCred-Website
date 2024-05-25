const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

exports.Response = {
  Ok: (data) => {
    return { success: true, status: HTTP_STATUS.OK, message: "Ok", ...data };
  },
  Created: (data) => {
    return {
      success: true,
      status: HTTP_STATUS.CREATED,
      message: "Created",
      ...data,
    };
  },
  ServerError: (data) => {
    return {
      success: false,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: "ServerError",
      ...data,
    };
  },
  BadRequest: (data) => {
    return {
      success: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "BadRequest",
      ...data,
    };
  },
  Unauthorized: (data) => {
    return {
      success: false,
      status: HTTP_STATUS.UNAUTHORIZED,
      message: "Unauthorized",
      ...data,
    };
  },
  Forbidden: (data) => {
    return {
      success: false,
      status: HTTP_STATUS.FORBIDDEN,
      message: "Forbidden",
      ...data,
    };
  },
  NotFound: (data) => {
    return {
      success: false,
      status: HTTP_STATUS.NOT_FOUND,
      message: "NotFound",
      ...data,
    };
  },
  TooManyRequests: (data) => {
    return {
      success: false,
      status: HTTP_STATUS.TOO_MANY_REQUESTS,
      message: "TooManyRequests",
      ...data,
    };
  },
  Success: (res) => {
    return (data) => {
      return res.status(data?.status ?? HTTP_STATUS.OK).send(data);
    };
  },
  Error: (res) => {
    return (data) => {
      return res
        .status(data?.status ?? HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(data);
    };
  },
};
