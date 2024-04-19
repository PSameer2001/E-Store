import * as React from "react";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";

export default function CountCard({ data }) {
  return (
    <React.Fragment>
      <h4>{data.title}</h4>
      <Typography component="p" variant="h4">
        {data.count}
      </Typography>
      {data.redirect !== "" && (
        <div>
          <Link  to={data.redirect}>
            View
          </Link>
        </div>
      )}
    </React.Fragment>
  );
}
