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
import docs from "@/assets/docs.png";
import dashboard from "@/assets/dashboard.png";
import claim from "@/assets/claim.png";
import truck from "@/assets/truck.png";
import avatar from "@/assets/avatar.png";
import logout from "@/assets/arrow.png";
import cases from "@/assets/chart.png";
import Image from "next/image";
import policy from "@/assets/policy.png";
import term from "@/assets/term.png";
import { useSession } from "next-auth/react";
import axios from "axios";
import { count } from "console";

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
  const seachParam = useSearchParams();
  const caseType = seachParam && seachParam.get("type");

  const [active, setActive] = useState("");
  const to = (url: string) => () => {
    router.push(url);
  };
  let countdata: any = {
    count: 0,
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
    if (parts && parts.length > 2) {
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
          className="main-sidebar"
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
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
                <span className="menu-content">Dashboard</span>
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
                  onClick={to(`/client/cases-list?type=preLitigation`)}
                  active={caseType === "preLitigation"}
                >
                  <span className="menu-icons">
                    <Image src={cases} alt="" />
                  </span>
                  <span className="menu-content">Prelitigation</span>
                </MenuItem>
                <MenuItem
                  onClick={to("/client/cases-list?type=litigation")}
                  active={caseType == "litigation"}
                >
                  <span className="menu-icons">
                    <Image src={cases} alt="" />
                  </span>
                  <span className="menu-content">Litigation</span>
                </MenuItem>
              </SubMenu>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/client/create-case")}
                active={active === "create-case"}
              >
                <span className="menu-icons">
                  <Image src={cases} alt="" />
                </span>
                <span className="menu-content">Create Case</span>
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/client/tasks")}
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
                onClick={to("/client/case-documents")}
                active={active === "case-documents"}
              >
                <span className="menu-icons">
                  <Image src={docs} alt="" />
                </span>
                <span className="menu-content">Document Management</span>
              </MenuItem>
            </Menu>
            {/* <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/client/representative-indivisual")}
                active={active === "representative-indivisual"}
              >
                <span className="menu-icons">
                  <Image src={truck} alt="" />
                </span>
                <span className="menu-content">
                  Representative Indvidual Management
                </span>
              </MenuItem>
            </Menu> */}
            <Menu menuItemStyles={menuItemStyles}>
              <SubMenu
                label="Claim Evaluation Report"
                defaultOpen={
                  pathname && pathname.startsWith("/client/litigation")
                }
                icon={<Image src={claim} alt="" />}
              >
                <MenuItem
                  onClick={to("/client/claim-evaluation-report-list")}
                  active={active === "claim-evaluation-report-list"}
                >
                  <span className="menu-icons">
                    <Image src={claim} alt="" />
                  </span>
                  <span className="menu-content">Prelitigation</span>
                </MenuItem>
                {/* <MenuItem
                  onClick={to("/client/litigation")}
                  active={active === "litigation"}
                >
                  <span className="menu-icons">
                    <Image src={claim} alt="" />
                  </span>
                  <span className="menu-content">Litigation</span>
                </MenuItem> */}
              </SubMenu>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <SubMenu
                label="Lawyers"
                defaultOpen={pathname?.startsWith("/lawyer")}
                icon={<Image src={claim} alt="" />}
              >
                <MenuItem>
                  <span className="menu-icons">
                    <Image src={claim} alt="" />
                  </span>
                  <span className="menu-content">Prelitigation</span>
                </MenuItem>
                <MenuItem>
                  <span className="menu-icons">
                    <Image src={claim} alt="" />
                  </span>
                  <span className="menu-content">Litigation</span>
                </MenuItem>
              </SubMenu>
            </Menu>

            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/client/terms")}
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
                onClick={to("/client/privacy-policy")}
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
              <MenuItem onClick={to("/client/chat")} active={active === "chat"}>
                <span className="menu-icons">
                  {" "}
                  <Image src={claim} alt="" />{" "}
                </span>{" "}
                Messages
                {chatCount > 0 ? (
                  <h5 className="sideabr-badge">
                    {chatCount}
                    <span className="badge badge badge-light"></span>
                  </h5>
                ) : null}
              </MenuItem>
            </Menu>
            <hr></hr>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/client/notifications")}
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
              <SubMenu
                label="Settings"
                defaultOpen={
                  pathname?.startsWith("/client/profile") ||
                  pathname?.startsWith("/client/change-password")
                }
                icon={<Image src={claim} alt="" />}
              >
                {/* <MenuItem>
                  {" "}
                  <span className="menu-icons">
                    <Image src={claim} alt="" />
                  </span>{" "}
                  Notification
                </MenuItem> */}
                <MenuItem
                  onClick={to("/client/profile")}
                  active={active === "profile"}
                >
                  <span className="menu-icons">
                    <Image src={cases} alt="" />
                  </span>
                  <span className="menu-content">Profile</span>
                </MenuItem>
                <MenuItem
                  onClick={to("/client/change-password")}
                  active={active === "change-password"}
                >
                  <span className="menu-icons">
                    <Image src={cases} alt="" />
                  </span>
                  <span className="menu-content">Change Password</span>
                </MenuItem>
              </SubMenu>
            </Menu>
            <hr></hr>
            <div className="relative bottom-side">
              <div className="sidebar-botttom-bx">
                <div className="sidebar-welcome d-flex align-items-center gap-3">
                  <Image className="avatar-ico" src={avatar} alt="" />
                  <div className="sidebar-content">
                    <p className="gray f-13 mb-0">Welcome back 👋</p>
                    <p className="semi-bold f-15 mb-0">
                      {data?.user?.firstName ?? ""}
                    </p>
                  </div>
                </div>
              </div>
              <Menu menuItemStyles={menuItemStyles}>
                <MenuItem
                  onClick={to("/client/dashboard")}
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
