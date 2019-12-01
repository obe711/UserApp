import React, { useContext } from "react";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { PageContext } from "../Context/SiteContext";

const Copyright = () => {
  const { siteName, siteUrl } = useContext(PageContext);
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href={siteUrl}>
        {siteName}
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export default Copyright;
