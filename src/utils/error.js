const handleError = (err) => {
  if (err.name == "ValidationError") {
    return {
      status: 400,
      data: err,
    };
  } else {
    return {
      status: 500,
      data: "Internal server error",
    };
  }
};

module.exports = { handleError };
