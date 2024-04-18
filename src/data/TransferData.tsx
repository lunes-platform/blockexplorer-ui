import { gql, useQuery } from "@apollo/client";
import { Box, Heading } from "@chakra-ui/react";
import Overview, {Data as OverviewData} from "../components/Overview";
import Tabs from "../components/Tabs"
import { PAGINATION_PART_OF_QUERY, decAddress, timeSince } from "../utils";
import EventTable from "./EventTable";
import ExtrinsicTable from "./ExtrinsicTable";
import TransferTable from "./TransferTable";


export default function TransferData({id}: Props) {

  const moreVariables = {"hash": {"equalTo": id}}
  const query = gql`
  query Extrinsics($first: Int, $orderBy: [ExtrinsicsOrderBy!], $filter: ExtrinsicFilter, $after: Cursor) {
    query {
      extrinsics(first: $first, orderBy: $orderBy, filter: $filter, after: $after) {
        ${PAGINATION_PART_OF_QUERY}
        nodes {
          id
          hash
          section
          method
          success
          events {
            totalCount
          }
          block {
            id
            number
            timestamp
          }         
        }
      }
    }
  }
`
const variables = {
  "first": 1,
  "orderBy": ["BLOCK_NUMBER_DESC", "INDEX_DESC"],
  "filter":moreVariables
}
const { loading, error, data } = useQuery(query, {variables: variables});
  if(!data) return <></>
  console.log(data.query.extrinsics.nodes[0].id)
  const filter = {"id": {"equalTo":  data.query.extrinsics.nodes[0].id}}
  const filter_ = {"extrinsicId": {"equalTo": data.query.extrinsics.nodes[0].id}}
  const tabsData = [
    {label: "Transfers", content: <TransferTable moreVariables={{filter}}/>},
    {label: "Events", content: <EventTable moreVariables={{filter: filter_}} />},
   
  ]

  return(
    <Box>
      <Heading>Extrinsic #{data.query.extrinsics.nodes[0].id}</Heading>
      <br />
      <ExtrinsicOverview data={data.query.extrinsics.nodes[0]} />
      <br />
      <Tabs data={tabsData} />
    </Box>
  )
}


function ExtrinsicOverview({data}: PropsData) {
 
let overviewData: OverviewData = []
if (data) {
  overviewData = [
    {label: "Timestamp (UTC)", value: data.block.timestamp},
    {label: "Block", value: data.block.id},
    {label: "Hash", value: data.hash},
    {label: "Module", value: data.section},
    {label: "Call", value: data.method},
    {label: "Sender", value: data.signerId},
    {label: "Events", value: data.events.totalCount},
    {label: "Age", value: timeSince(data.block.timestamp)},
  ]
}

return (
  <Overview data={overviewData} />
)
}

interface Props {
  id: string
}
interface PropsData {
  data: any
}
