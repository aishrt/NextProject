import styled from '@emotion/styled';
import React from 'react';
import logo from "@/assets/admin-logo.png";

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const StyledSidebarHeader = styled.div`
  height: 74px;
  display: flex;
  align-items: center;
  padding: 0 20px;

  > div {
    width: 100%;
    overflow: hidden;
  }
`;

const StyledLogo = styled.div`
  width: 100%;
  min-width: 35px;
  height: 75px;
  min-height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  }
`;

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ children, ...rest }) => {
  return (
    <StyledSidebarHeader {...rest} className='sidebar-header'>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <StyledLogo><img height="100%"  src="/admin-logo.png" alt="Workflow" /></StyledLogo>
      </div>
    </StyledSidebarHeader>
  );
};
