import { useContext, useEffect, useState } from 'react'
import { Box, Heading } from "@chakra-ui/react";
import Tabs from "../components/Tabs"
import ExtrinsicTable from "./ExtrinsicTable";
import { ApiContext } from '../context/ApiContext'
import { convertAmountLunes } from '../utils';
import Overview, { Data as OverviewData } from "../components/Overview";
import TransferAssetsTable from './TransferAssetsTable';

export default function AccountTransferAssetsData({ id }: Props) {

  const extrinsicFilter = { "signerId": { "equalTo": id.split("-")[0] } }
  const transferFilter = {
    "or": [
      {
        "from": {
          "equalTo": id.split("-")[0]
        }
      },
      {
        "to": {
          "equalTo": id.split("-")[0]
        }
      }
    ],
    "assetId": {
      "equalTo": id.split("-")[1]
    }
  }
  const tabsData = [
    { label: "Transfers Token", content: <TransferAssetsTable moreVariables={{ filter: transferFilter }} /> },
    { label: "Extrinsics", content: <ExtrinsicTable moreVariables={{ filter: extrinsicFilter }} /> },

  ]

  return (
    <Box>
      <Heading>Address: {id.split("-")[0]}</Heading>
      <br />
      <BlockOverview id={id} />
      <br />
      <Tabs data={tabsData} />
    </Box>
  )
}
function BlockOverview({ id }: Props) {
  const { api, apiReady } = useContext(ApiContext);
  const [overviewData, setOverviewData] = useState<OverviewData>([])
  useEffect(() => {
    getAccount();
  }, [apiReady])
  const getAccount = async () => {
    if (!api || !apiReady) return;
    const data: any = await api.query.assets.account(id.split("-")[1], id.split("-")[0]);
    console.log(data)
    let data_ = data.toHuman();

    const data_meta = await api.query.assets.metadata(id.split("-")[1])
    const token: any = data_meta.toHuman()
    let balance_ = convertAmountLunes(data_.balance.toString().replace(/,/g, ''), Number(token.decimals));

    let overviewData_: OverviewData = [
      { label: "Token Name", value: `${token.name}` },
      { label: "Balance", value: `${balance_} ${token.symbol}` },

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
