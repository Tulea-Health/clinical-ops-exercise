import { Toolbar, Box } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import { LocalHospital } from "@mui/icons-material";

const Header = () => {
  return (
    <div>
      <AppBar
        position="static"
        sx={{
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          mb: 4,
        }}
      >
        <Toolbar sx={{ flexWrap: "wrap" }}>
          <Link href="/" color="inherit" style={{ textDecoration: "none" }} sx={{ flexGrow: 8, textAlign: "left" }}>
            <Box display="flex" alignItems="center">
              <LocalHospital sx={{ fontSize: 36 }} />
              <Box ml={1}>Clinical Ops</Box>
            </Box>
          </Link>
          <Button component={RouterLink} to="/contacts" color="inherit">
            Contacts
          </Button>
          <Button component={RouterLink} to="/tasks" color="inherit">
            Tasks
          </Button>
          <Button component={RouterLink} to="/projects" color="inherit">
            Projects
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
