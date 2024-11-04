"use client";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  menuClasses,
  MenuItemStyles,
} from "react-pro-sidebar";
import { SidebarHeader } from "./components/SidebarHeader";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { colors } from "@/constants/colors";
import "./components/Sidebar.css";
import dashboard from "@/assets/dashboard.png";
import policy from "@/assets/policy.png";
import avatar from "@/assets/avatar.png";
import term from "@/assets/term.png";
import lawyer from "@/assets/lawyr.png";
import setting from "@/assets/set.png";
import logout from "@/assets/arrow.png";
import cases from "@/assets/manager.png";
import pre from "@/assets/pre.png";
import liti from "@/assets/liti.png";
import docs from "@/assets/docmnt.png";
import Image from "next/image";
import claim from "@/assets/claim.png";

import { useSession } from "next-auth/react";
const themes = {
  light: {
    sidebar: {
      backgroundColor: "#E1F1FA",
      color: "#000",
      borderRadius: "0 10px 10px 0",
    },
    menu: {
      menuContent: "#000",
      icon: colors.primary,
      hover: {
        backgroundColor: "colors.secondary",
        color: "#000",
      },
      disabled: {
        color: "#9fb6cf",
      },
    },
  },
};

// hex to rgba converter
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const SidebarComponent = ({
  toggled,
  setToggled,
  chatCount,
  setBroken,
}: {
  toggled: boolean;
  setToggled: (i: boolean) => void;
  setBroken: (i: boolean) => void;
  chatCount: any;
}) => {
  const { data } = useSession();
  const router = useRouter();
  const pathname: any = usePathname();
  // const navigate = useNavigate();
  // const location = useLocation();
  const seachParam = useSearchParams();
  const caseType = seachParam && seachParam.get("type");
  const [active, setActive] = useState("");
  const to = (url: string) => () => {
    router.push(url);
  };

  const menuItemStyles: MenuItemStyles = {
    root: {
      fontSize: "15px",
      fontWeight: 400,
    },
    icon: {
      color: themes.light.menu.icon,
      [`&.${menuClasses.disabled}`]: {
        color: themes.light.menu.disabled.color,
      },
    },
    SubMenuExpandIcon: {
      color: "#b6b7b9",
    },
    subMenuContent: ({ level }) => ({
      backgroundColor:
        level === 0
          ? hexToRgba(themes.light.menu.menuContent, 0.4)
          : "transparent",
    }),
    button: {
      [`&.${menuClasses.disabled}`]: {
        color: themes.light.menu.disabled.color,
      },
      "&:hover": {
        backgroundColor: hexToRgba(themes.light.menu.hover.backgroundColor, 1),
        color: themes.light.menu.hover.color,
      },
      [`&.ps-active`]: {
        backgroundColor: colors.secondary,
        color: "#000",
      },
    },
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
    }),
  };

  useEffect(() => {
    const parts = pathname?.split("/") ?? [];
    if (parts.length > 2) {
      const part = parts[2];
      setActive(part);
    } else {
      setActive("");
    }
  }, [pathname]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      className="sidebar-div"
    >
      <Sidebar
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        onBreakPoint={setBroken}
        breakPoint="md"
        className="client-sidebar h-100"
        backgroundColor={hexToRgba(themes.light.sidebar.backgroundColor, 1)}
        rootStyles={{
          color: themes.light.sidebar.color,
        }}
      >
        <div
          className="main-sidebar expert"
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
          }}
        >
          <SidebarHeader style={{ marginBottom: "24px", marginTop: "16px" }} />

          <div
            className="sidebar-navs"
            style={{ flex: 1, marginBottom: "32px" }}
          >
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem onClick={to("/client")} active={active === "dashboard"}>
                <span className="menu-icons">
                  {" "}
                  <Image src={dashboard} alt="" />{" "}
                </span>{" "}
                Dashboard
              </MenuItem>
            </Menu>

            <Menu menuItemStyles={menuItemStyles}>
              <SubMenu
                label="Case Management"
                defaultOpen={
                  caseType === "litigation" || caseType === "preLitigation"
                }
                icon={<Image src={cases} alt="" />}
              >
                <MenuItem
                  onClick={to("/expert/cases-list?type=preLitigation")}
                  active={caseType === "preLitigation"}
                  icon={<Image src={pre} alt="" />}
                >
                  Pre Litigation
                </MenuItem>
                <MenuItem
                  onClick={to("/expert/cases-list?type=litigation")}
                  active={caseType === "litigation"}
                  icon={<Image src={liti} alt="" />}
                >
                  Litigation
                </MenuItem>

                {/* <MenuItem
                  onClick={to("/expert/tasks")}
                  active={active === "tasks"}
                  icon={<Image src={pre} alt="" />}
                >
                  Task
                </MenuItem> */}
              </SubMenu>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/expert/tasks")}
                active={active === "tasks"}
              >
                <span className="menu-icons">
                  <Image src={docs} alt="" />
                </span>
                <span className="menu-content">Task Management</span>
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/expert/case-documents")}
                active={active === "case-documents"}
              >
                <span className="menu-icons">
                  {" "}
                  <Image src={docs} alt="" />{" "}
                </span>{" "}
                Document Management
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <SubMenu
                label="Lawyers"
                defaultOpen={
                  pathname?.startsWith("/expert/litigation-lawyers") ||
                  pathname?.startsWith("/expert/litigation-lawyers")
                }
                icon={<Image src={lawyer} alt="" />}
              >
                <MenuItem
                  onClick={to("/expert/litigation-lawyers")}
                  active={active === "litigation-lawyers"}
                  icon={<Image src={liti} alt="" />}
                >
                  Litigation
                </MenuItem>
                <MenuItem
                  onClick={to("/expert/pre-litigation-lawyers")}
                  active={active === "pre-litigation-lawyers"}
                  icon={<Image src={pre} alt="" />}
                >
                  Pre Litigation
                </MenuItem>
              </SubMenu>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/expert/claim-evaluation-report-list")}
                active={active === "claim-evaluation-report-list"}
              >
                <span className="menu-icons">
                  {" "}
                  <Image src={term} alt="" />{" "}
                </span>{" "}
                Claim Evaluation Report
              </MenuItem>
            </Menu>


            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/expert/case-requests")}
                active={active === "case-requests"}
              >
                <span className="menu-icons">
                  {" "}
                  <Image src={term} alt="" />{" "}
                </span>{" "}
                Case Requests
              </MenuItem>
            </Menu>



            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/expert/terms")}
                active={active === "terms"}
              >
                <span className="menu-icons">
                  {" "}
                  <Image src={term} alt="" />{" "}
                </span>{" "}
                Terms & Conditions
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/expert/privacy-policy")}
                active={active === "privacy-policy"}
              >
                <span className="menu-icons">
                  {" "}
                  <Image src={policy} alt="" />{" "}
                </span>{" "}
                Privacy Policy
              </MenuItem>
            </Menu>

            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/expert/notifications")}
                active={active === "notifications"}
              >
                <span className="menu-icons">
                  {" "}
                  <Image src={claim} alt="" />{" "}
                </span>{" "}
                Notifications
              </MenuItem>
            </Menu>

            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem onClick={to("/expert/chat")} active={active === "chat"}>
                <span className="menu-icons">
                  {" "}
                  <Image src={policy} alt="" />{" "}
                </span>{" "}
                Messages{" "}
                {chatCount > 0 ? (
                  <h5 className="sideabr-badge">
                    {chatCount}
                    <span className="badge badge badge-light"></span>
                  </h5>
                ) : null}
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <SubMenu label="Settings" icon={<Image src={setting} alt="" />}>
                <MenuItem
                  onClick={to("/expert/profile")}
                  active={active === "profile"}
                >
                  {" "}
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={to("/expert/change-password")}
                  active={active === "change-password"}
                >
                  {" "}
                  Change Password
                </MenuItem>
              </SubMenu>
            </Menu>
            {/*          
            <div className="sidebar-setting">SETTINGS</div>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem onClick={to("/client")} active={active === ""}>
                <span className="menu-icons">
                  {" "}
                  <Image src={user} alt="" />{" "}
                </span>{" "}
                Profile
              </MenuItem>
            </Menu> */}
            {/* <Menu menuItemStyles={menuItemStyles}>
              <MenuItem onClick={to("/expert")} active={active === ""}>
                <span className="menu-icons">
                  {" "}
                  <Image src={logout} alt="" />{" "}
                </span>{" "}
                Log out
              </MenuItem>
            </Menu> */}
            <hr></hr>
            <div className="relative bottom-side">
              <div className="sidebar-botttom-bx">
                <div className="sidebar-welcome d-flex align-items-center gap-3">
                  <Image className="avatar-ico" src={avatar} alt="" />
                  <div className="sidebar-content">
                    <p className="gray f-13 mb-0">Welcome back 👋</p>
                    <p className="semi-bold f-15 mb-0">
                      {data?.user?.firstName}
                    </p>
                  </div>
                </div>
              </div>
              <Menu menuItemStyles={menuItemStyles}>
                <MenuItem
                  className="bg-transparent p-0"
                  onClick={to("/expert")}
                  active={active === ""}
                >
                  <span className="menu-icons">
                    {" "}
                    <Image height={20} src={logout} alt="" />{" "}
                  </span>{" "}
                </MenuItem>
              </Menu>
            </div>
          </div>
        </div>
      </Sidebar>
    </motion.div>
  );
};
