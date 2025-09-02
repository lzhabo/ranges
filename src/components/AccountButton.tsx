import styled from "@emotion/styled";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import centerEllipsis from "../utils/centerEllipsis";

// const AccountButton = styled(AppKitAccountButton)`
//   .local-no-balance {
//     height: 64px;
//   }
// `;

const Root = styled.div`
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 16px;
  padding: 12px;
  height: 48px;
  gap: 2px;
  border-radius: 16px;
  background: #eaeeff;
  outline: none;
  color: #161616;
  font-weight: 700;
  line-height: 16px;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  box-sizing: border-box;
  border: 2px solid #eaeeff;
  :hover {
    border: 2px solid #bcc7ff;
  }
`;

const AccountButton = () => {
  const { address } = useAppKitAccount();
  const { open } = useAppKit();
  return (
    <Root onClick={() => open({ view: "Account" })}>
      {/* <img src={WalletIcon} alt="wallet" /> */}
      <div>{centerEllipsis(address ?? "", 8)}</div>
      {/* <img src={arrowIcon} className="menu-arrow" alt="arrow" /> */}
    </Root>
  );
};

export default AccountButton;
