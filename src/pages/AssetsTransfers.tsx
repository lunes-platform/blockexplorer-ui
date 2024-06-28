import { Box, Heading } from "@chakra-ui/react";

import TransferAssetsTable from '../data/TransferAssetsTable';

export default function AssetsTransfers() {
  return (
    <Box>
      <Heading>
        Transfers LUNES Token
      </Heading>
      <TransferAssetsTable />
    </Box>
  )
}
