import { Box } from "@chakra-ui/react";
import TransferData from "../data/TransferData";
import { useParams } from "react-router-dom";
export default function Transfer() {
  const { id } = useParams() as {[key: string]: string}
  return (
    <Box>
      <TransferData id={id}/>
    </Box>
  )
}
