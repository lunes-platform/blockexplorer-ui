import { useContext, useEffect, useState } from 'react'
import { Box, Heading } from "@chakra-ui/react";
import Tabs from "../components/Tabs"
import ExtrinsicTable from "./ExtrinsicTable";
import TransferTable from "./TransferTable";
import { ApiContext } from '../context/ApiContext'
import { convertAmountLunes } from '../utils';
import Overview, {Data as OverviewData} from "../components/Overview";

export default function ExtrinsicData({id}: Props) {
  
  const extrinsicFilter = {"signerId": {"equalTo": id}}
  const transferFilter = {
    "or": [
      {
        "fromId": {
          "equalTo": id
        }
      },
      {
        "toId": {
          "equalTo": id
        }
      }
    ]
  }
  const tabsData = [
    {label: "Transfers", content: <TransferTable moreVariables={{filter: transferFilter}}/>},  
    {label: "Extrinsics", content: <ExtrinsicTable moreVariables={{filter: extrinsicFilter}}/>},
   
  ]

  return(
    <Box>
      <Heading>Address: {id}</Heading>
      <br />
      <BlockOverview id={id}/>
      <br />
      <Tabs data={tabsData} />
    </Box>
  )
}
function BlockOverview({id}: Props) {
  const { api, apiReady } = useContext(ApiContext);
  const [overviewData, setOverviewData] = useState<OverviewData>([])
  useEffect(()=>{
    getAccount();
  },[apiReady])
  const getAccount = async () =>{
    if(!api || !apiReady) return;
    console.log(id)
    const data: any = await api.query.system.account(id);
    console.log(data)
     let balance_ = convertAmountLunes(data.data.free.toHuman());
     let balance_block_ = convertAmountLunes(data.data.feeFrozen.toHuman());  
     let nonce  = data.nonce.toHuman();
     let overviewData_: OverviewData = [
      {label: "Nonce", value: `${nonce}`},       
      {label: "Reserved", value: `${balance_block_} LUNES`},
      {label: "Balance", value: `${balance_ - balance_block_} LUNES`},       
      
      ]
      setOverviewData(overviewData_)
  }

  return (
    <Overview data={overviewData} />
  )

}
interface Props {
  id: string
}
