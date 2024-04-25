const getAdminCookie = () => {
    const jwtAdminToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`jwtAdminToken=`))
      ?.split("=")[1];
  
    const adminHeaders = {
      headers: {
        jwtAdminToken,
      },
    };
  
    return adminHeaders;
  };
  
  export default getAdminCookie;
  