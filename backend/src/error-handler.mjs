const errorHandler = (error, request, response, next) => {
  console.error(error.stack);
  response.status(500).json({ error: 'Internal Server Error' });
};

export default errorHandler;
