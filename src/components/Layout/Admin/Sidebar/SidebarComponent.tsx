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
import { usePathname, useRouter } from "next/navigation";
import { colors } from "@/constants/colors";
import "./components/Sidebar.css";
import pre from "@/assets/pre.png";
import liti from "@/assets/liti.png";

import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import user from "@/assets/user.png";
import cases from "@/assets/chart.png";
import claim from "@/assets/set.png";
import privacy from "@/assets/policy.png";
import terms from "@/assets/term.png";
import dashboard from "@/assets/dashboard.png";
import { useSearchParams } from "next/navigation";

const themes = {
  light: {
    sidebar: {
      backgroundColor: "#E1F1FA",
      color: "#607489",
      borderRadius: "0 10px 10px 0",
    },
    menu: {
      menuContent: "#fbfcfd",
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
  setBroken,
}: {
  toggled: boolean;
  setToggled: (i: boolean) => void;
  setBroken: (i: boolean) => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  // const navigate = useNavigate();
  // const location = useLocation();
  const seachParam = useSearchParams();

  const caseType = seachParam && seachParam.get("type");

  const { data, update } = useSession();

  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    setUserData(data);
  }, [data]);

  const [active, setActive] = useState("");
  const to = (url: string) => () => {
    router.push(url);
  };

  const menuItemStyles: MenuItemStyles = {
    root: {
      fontSize: "13px",
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
      className="sidebar-div admin"
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
            height: "100vh",
          }}
        >
          <SidebarHeader style={{ marginBottom: "24px", marginTop: "16px" }} />

          <div
            className="sidebar-navs"
            style={{ flex: 1, marginBottom: "32px" }}
          >
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/admin/dashboard")}
                active={active === "dashboard"}
              >
                <span className="menu-icons">
                  <Image src={dashboard} alt="" />{" "}
                </span>
                <span className="menu-content">Dashboard</span>
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/admin/users")}
                active={active === "users"}
              >
                <span className="menu-icons">
                  <Image src={user} alt="" />{" "}
                </span>
                <span className="menu-content">User Management</span>
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
                  onClick={to("/admin/cases-list?type=preLitigation")}
                  active={caseType === "preLitigation"}
                  icon={<Image src={pre} alt="" />}
                >
                  Pre Litigation
                </MenuItem>
                <MenuItem
                  onClick={to("/admin/cases-list?type=litigation")}
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
                onClick={to("/admin/lawyers")}
                active={active === "lawyers"}
              >
                <span className="menu-icons">
                  <Image src={user} alt="" />{" "}
                </span>
                <span className="menu-content">Lawyer Management</span>
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/admin/cer-questions")}
                active={active === "cer-questions"}
              >
                <span className="menu-icons">
                  <Image src={user} alt="" />{" "}
                </span>
                <span className="menu-content">Claim Evaluation Questions</span>
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/admin/financial-template")}
                active={active === "financial-template"}
              >
                <span className="menu-icons">
                  <Image src={user} alt="" />{" "}
                </span>
                <span className="menu-content">Financial Template</span>
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/admin/tasks")}
                active={active === "tasks"}
              >
                <span className="menu-icons">
                  <Image src={user} alt="" />{" "}
                </span>
                <span className="menu-content">Task Management</span>
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/admin/pre-tasks")}
                active={active === "pre-tasks"}
              >
                <span className="menu-icons">
                  <Image src={user} alt="" />{" "}
                </span>
                <span className="menu-content">Pre-Assigned Tasks</span>
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/admin/case-managers")}
                active={active === "case-managers"}
              >
                <span className="menu-icons">
                  <Image src={user} alt="" />{" "}
                </span>
                <span className="menu-content">Case Managers</span>
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/admin/lawyer-types")}
                active={active === "lawyer-types"}
              >
                <span className="menu-icons">
                  <Image src={user} alt="" />{" "}
                </span>
                <span className="menu-content">lawyer Types</span>
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <SubMenu
                label="Document Management"
                icon={<Image src={claim} alt="" />}
              >
                <MenuItem
                  onClick={to("/admin/case-documents")}
                  active={active === "case-documents"}
                >
                  <span className="menu-icons">
                    <Image src={cases} alt="" />
                  </span>
                  <span className="menu-content">Pre-Litigation</span>
                </MenuItem>
                <MenuItem
                  onClick={to("/admin/lawyer-docs")}
                  active={active === "lawyer-docs"}
                >
                  <span className="menu-icons">
                    <Image src={cases} alt="" />
                  </span>
                  <span className="menu-content">Lawyer</span>
                </MenuItem>
              </SubMenu>
            </Menu>

            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/admin/notifications")}
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
                label="Documents"
                icon={<Image src={terms} alt="" />}
              >
                <MenuItem
                  onClick={to("/admin/privacy-policy")}
                  active={active === "privacy-policy"}
                >
                  <span className="menu-icons">
                    <Image src={privacy} alt="" />{" "}
                  </span>
                  <span className="menu-content">Privacy Policy</span>
                </MenuItem>
                <MenuItem
                  onClick={to("/admin/terms-conditions")}
                  active={active === "terms-conditions"}
                >
                  <span className="menu-icons">
                    <Image src={terms} alt="" />{" "}
                  </span>
                  <span className="menu-content">Terms & Conditions</span>
                </MenuItem>
                <MenuItem
                  onClick={to("/admin/financing-agreement")}
                  active={active === "financing-agreement"}
                >
                  <span className="menu-icons">
                    <Image src={terms} alt="" />{" "}
                  </span>
                  <span className="menu-content">Financing Agreement</span>
                </MenuItem>
                <MenuItem
                  onClick={to("/admin/mandate")}
                  active={active === "mandate"}
                >
                  <span className="menu-icons">
                    <Image src={terms} alt="" />{" "}
                  </span>
                  <span className="menu-content">Mandate</span>
                </MenuItem>
                <MenuItem
                  onClick={to("/admin/attorney")}
                  active={active === "attorney"}
                >
                  <span className="menu-icons">
                    <Image src={terms} alt="" />{" "}
                  </span>
                  <span className="menu-content">Attorney Engagement Letter</span>
                </MenuItem>
              </SubMenu>
            </Menu>


            <Menu menuItemStyles={menuItemStyles}>
              <SubMenu
                label="Settings"
                defaultOpen={
                  pathname?.startsWith("/admin/profile") ||
                  pathname?.startsWith("/admin/change-password")
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
                  onClick={to("/admin/profile")}
                  active={active === "profile"}
                >
                  <span className="menu-icons">
                    <Image src={cases} alt="" />
                  </span>
                  <span className="menu-content">Profile</span>
                </MenuItem>
                <MenuItem
                  onClick={to("/admin/general")}
                  active={active === "general"}
                >
                  <span className="menu-icons">
                    <Image src={cases} alt="" />
                  </span>
                  <span className="menu-content">General</span>
                </MenuItem>
                <MenuItem
                  onClick={to("/admin/change-password")}
                  active={active === "change-password"}
                >
                  <span className="menu-icons">
                    <Image src={cases} alt="" />
                  </span>
                  <span className="menu-content">Change Password</span>
                </MenuItem>
              </SubMenu>
            </Menu>
            {/* <Menu menuItemStyles={menuItemStyles}>
              <SubMenu
                label="USER MANAGEMENT"
                icon={<i className="fa-solid fa-gear"></i>}
              >
                <MenuItem onClick={to("/admin/users")}>
                  Client Management
                </MenuItem>
                <MenuItem onClick={to("/admin/dashboard")}>
                  Legal Expert Management
                </MenuItem>
                <MenuItem onClick={to("/admin/dashboard")}>
                  Lawyer Management
                </MenuItem>
              </SubMenu>
            </Menu> */}
            {/*
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/admin/cases")}
                active={active === "cases"}
                icon={<i className="fa-solid fa-user"></i>}
              >
                Cases
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/admin")}
                active={active === ""}
                icon={<i className="fa-solid fa-user"></i>}
              >
                Lawyer
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/admin")}
                active={active === ""}
                icon={<i className="fa-solid fa-user"></i>}
              >
                Documents
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/admin")}
                active={active === ""}
                icon={<i className="fa-solid fa-user"></i>}
              >
                Invoice
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/admin")}
                active={active === ""}
                icon={<i className="fa-solid fa-user"></i>}
              >
                Chat
              </MenuItem>
            </Menu>
            <div className="sidebar-setting">SETTINGS</div>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={to("/admin")}
                active={active === ""}
                icon={<i className="fa-solid fa-user"></i>}
              >
                Profile
              </MenuItem>
            </Menu>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                onClick={() => signOut()}
                active={active === ""}
                icon={<i className="fa-solid fa-user"></i>}
              >
                Log out
              </MenuItem>
            </Menu> */}
          </div>
        </div>
      </Sidebar>
    </motion.div>
  );
};
