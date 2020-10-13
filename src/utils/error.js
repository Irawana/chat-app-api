const handleError = (err) => {
  if (err.name == "ValidationError") {
    return {
      status: 400,
      message: err,
    };
  } else {
    return {
      status: 500,
      message: "Internal server error",
    };
  }
};

module.exports = { handleError };
