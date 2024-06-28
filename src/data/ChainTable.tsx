import { useContext, useEffect, useState } from "react";
import Table from "../components/Table";

import { ApiContext } from '../context/ApiContext'
import { FormatMiles, convertAmountLunes } from "../utils";
import Loading from "../components/Loading";

const SUPPLY_INITIAL = process.env.REACT_APP_SUPPLY || 200000000

export default function ChainTable() {
  const { api, apiReady } = useContext(ApiContext);
  const [dataLunes, setDataLunes] = useState([])

  const getChainLunes = async () => {
    if (!api || !apiReady) return;
    const data: any = await api.query.balances.totalIssuance()
    const totalBurn = Number(SUPPLY_INITIAL) - (convertAmountLunes(data.toString()))
    const percentBurn = ((totalBurn / Number(SUPPLY_INITIAL))) * 100
    console.log(SUPPLY_INITIAL)
    console.log(Math.ceil(totalBurn))
    console.log(percentBurn + "%")
    const dataAccount: any = await api.query.system.account(process.env.REACT_APP_ADDRESS_FIN || "");
    let balance_ = convertAmountLunes(dataAccount.data.free.toHuman());
    const totalLunes = Math.ceil(convertAmountLunes(data.toString()) - balance_);
    console.log("balance_", balance_)
    console.log('convertAmountLunes(data.toString())', convertAmountLunes(data.toString()))
    let d = {
      supply: `${FormatMiles(SUPPLY_INITIAL.toString())} LUNES`,
      burn: totalBurn.toFixed(8) + " LUNES",
      percent: percentBurn.toFixed(10) + "%",
      total: FormatMiles(totalLunes.toString()) + " LUNES",
      target: "50.000.000 LUNES",
    }
    let lisD: any = [];
    lisD.push(d)
    setDataLunes(lisD)
  }
  useEffect(() => {
    getChainLunes();
  }, [apiReady])
  const columns = [
    { Header: "Supply Chain Initial", accessor: "supply" },
    { Header: "Burn Now", accessor: "burn" },
    { Header: "% Burn", accessor: "percent" },
    { Header: "Target Supply Chain", accessor: "target" },
    { Header: "Total Circulate", accessor: "total" },

  ];




  return (
    dataLunes.length !== 0 ? <Table columns={columns} data={dataLunes} /> : <Loading />
  )
}


