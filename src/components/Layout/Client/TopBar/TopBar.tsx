"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
// import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "./topbar.css";
import NotificationBar from "@/components/NotificationBar";
import { axios } from "@/utils/axios";
import bell from "@/assets/bell.png";
import Image from "next/image";
import { useNotifications } from "@/queries/notifications";
import { CircularProgress } from "@mui/material";

export default function TopBar({
  toggled,
  broken,
  setToggled,
}: {
  toggled: boolean;
  broken: boolean;
  setToggled: (i: boolean) => void;
}) {
  const { data: session, status } = useSession();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  // const navigate = useNavigate();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const router = useRouter();

  const { data: NotificationData, isLoading, refetch } = useNotifications();
  const unreadNotifications =
    NotificationData?.data?.filter((i) => !i.isRead) ?? [];

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [isOpen, setIsModalOpen] = React.useState<boolean>(false);
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const logout = () => {
    handleMenuClose();
    signOut();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    refetch();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  // const GetNotifications = () => {
  //   axios
  //     .get(
  //       `/api/notifications/list?user_id=${session?.user?._id}&role=${session?.user?.role}`
  //     )
  //     .then((res: any) => {
  //       setNotifications(res);
  //     });
  // };

  React.useEffect(() => {
    if (session?.user?._id) {
      refetch();
    }
  }, [session]);
  const openProfile = (event: React.MouseEvent<HTMLElement>) => {
    // handleMobileMenuOpen(event);
    router.push("/client/profile");
  };
  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={openProfile}>Profile</MenuItem>
      <MenuItem onClick={logout}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={openProfile}>Profile</MenuItem>
      <MenuItem onClick={logout}>Logout</MenuItem>
    </Menu>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <div className="top-header">
          <AppBar color="default" position="static" className="admin-header">
            <div className="left-header-side d-flex align-items-center">
              {window.location.pathname == "/client/dashboard" && (
                <span className="page-title f-18 bold">Dashboard</span>
              )}
            </div>
            <Toolbar>
              {broken && (
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  sx={{ mr: 2 }}
                  onClick={() => setToggled(!toggled)}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Box sx={{ flexGrow: 1 }} />
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                }}
              >
                <span
                  className="ml-3 me-3 relative"
                  onClick={handleOpenModal}
                  role="img"
                  aria-label="Ring Icon"
                >
                  {/* <Image src={bell} className="note-ico" alt="" /> */}
                  <i className="fa-regular fa-bell dark f-24"></i>
                  {unreadNotifications?.length > 0 ? (
                    <span className="note-count">
                      {unreadNotifications?.length}
                    </span>
                  ) : (
                    ""
                  )}
                </span>

                {/* {status === "authenticated" && (
                  <Typography>{session?.user.name}</Typography>
                )} */}
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle style={{ height: "30px", width: "30px" }} />
                </IconButton>
              </Box>

              {/* Replace with your actual bell icon */}
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>
          {renderMobileMenu}
          {renderMenu}
        </div>
      </Box>
      <NotificationBar
        role={"client"}
        handleCloseModal={handleCloseModal}
        data={unreadNotifications}
        isOpen={isOpen}
        isLoading={isLoading}
      />
    </motion.div>
  );
}
