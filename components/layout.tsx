import * as React from "react";
import Link from "next/link";
import {
  Container,
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";

export default function Layout({ children }) {
  return (
    <Container>
      <Box sx={{ flexGrow: 1, mb: 5 }}>
        <AppBar position="static">
          <Toolbar>
            <Link href="/" passHref>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Oregon Humane Society Dogs
              </Typography>
            </Link>
          </Toolbar>
        </AppBar>
      </Box>
      {children}
    </Container>
  );
}
