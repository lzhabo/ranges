import styled from "@emotion/styled";
import { Box, Button, MenuItem, Select, TextField, Typography } from "@mui/material";
import { AppKitAccountButton, AppKitConnectButton, useAppKitAccount } from "@reown/appkit/react";
import { observer } from "mobx-react-lite";

const Root = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Swap = observer(() => {
    const { isConnected, address } = useAppKitAccount();
    console.log(isConnected, address);
    return (
        <Root>
            <Typography variant="h4" gutterBottom>
                Swap
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                <Select defaultValue="WAVES" variant="outlined">
                    <MenuItem value="WAVES">WAVES</MenuItem>
                    <MenuItem value="PUZZLE">PUZZLE</MenuItem>
                </Select>
                <TextField label="Amount" variant="outlined" />
                {isConnected ? <>
                    <Button variant="contained" color="primary">
                        Swap
                    </Button>
                    <AppKitAccountButton />
                </>
                    :
                    <AppKitConnectButton />
                }
            </Box>
        </Root>
    );
});

export default Swap;