import { Box } from "@chakra-ui/react";
import AccountTransferAssetsData from "../data/AccountTransferAssetsData";
import { useParams } from "react-router-dom";

export default function AccountTransferAssets() {
  const { id } = useParams() as { [key: string]: string }
  return (
    <Box>
      <AccountTransferAssetsData id={id} />
    </Box>
  )
}
