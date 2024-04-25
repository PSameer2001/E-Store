const getUserCookie = () => {
  const jwtToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`jwtToken=`))
    ?.split("=")[1];

  const userHeaders = {
    headers: {
      jwtToken,
    },
  };

  return userHeaders;
};

export default getUserCookie;
