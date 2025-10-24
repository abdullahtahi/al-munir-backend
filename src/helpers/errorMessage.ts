export const getErrorMessage = error => {
  const errorMessage = (error.errors &&  error.errors.length && error.errors[0].message) || error?.message;
  return {
    message:errorMessage
  };
};