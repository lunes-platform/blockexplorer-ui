import { gql, useQuery } from "@apollo/client";
import { PAGINATION_PART_OF_QUERY, timeSince, BlockLink, ExtrinsicLink, AccountLink, AccountAssetLink, convertAmountLunes } from "../utils";
import RTable from "./RTable";

export default function TransferAssetsTable({ moreVariables, noMore }: Props) {

  const query = gql`
   query AssetTransfers($first: Int, $orderBy: [AssetTransfersOrderBy!], $filter: AssetTransferFilter, $after: Cursor) {
      query {
         assetTransfers(first: $first, orderBy: $orderBy, filter: $filter, after: $after) {
          ${PAGINATION_PART_OF_QUERY}
          nodes {
            id
            from
            to
            amount
            assetId
            extrinsicIndex
            eventIndex
            block {
              id
              number
              timestamp
            }
            asset{
              id
              name
              symbol
              decimals
            }
          }
        }
      }
    }
  `
  const variables = {
    "first": 20,
    "orderBy": ["BLOCK_NUMBER_DESC", "EVENT_INDEX_DESC"],
    ...moreVariables
  }

  const columns = [
    { Header: "Time", accessor: "time" },
    { Header: "Token", accessor: "token" },
    { Header: "Extrinsic Id", accessor: "id" },
    { Header: "Block", accessor: "block" },
    { Header: "From", accessor: "from" },
    { Header: "To", accessor: "to" },
    { Header: "Value", accessor: "value" }
  ];
  const { loading, error, data, fetchMore } = useQuery(query, { variables: variables });

  const loadMore = () => {
    fetchMore({
      variables: { after: data.query.assetTransfers.pageInfo.endCursor }
    })
    console.log(`Load more after ${data.query.assetTransfers.pageInfo.endCursor}`)
  }

  const rData =
    data &&
    data.query.assetTransfers.nodes.map(
      (d: TransferAssetData) => ({
        time: timeSince(d.block.timestamp),
        token: d.asset.name,
        id: ExtrinsicLink(d.id),
        block: BlockLink(d.block.id),
        from: AccountAssetLink(`${d.from}-${d.assetId}`),
        to: AccountAssetLink(`${d.to}-${d.assetId}`),
        value: `${convertAmountLunes(d.amount.toString(), Number(d.asset.decimals))} ${d.asset.symbol}`
      })
    );



  return (
    <RTable  {...{ data, rData, columns, loadMore, loading, noMore, hasNextPage: data?.query.assetTransfers.pageInfo.hasNextPage }} />
  )
}

interface TransferAssetData {
  id: string
  assetId: string
  token: string
  from: string
  to: string
  amount: number
  eventIndex: number
  block: {
    id: string
    number: number
    timestamp: string
  }
  asset: {
    id: string
    name: string
    symbol: string
    decimals: number
  }
}

interface Props {
  noMore?: boolean
  moreVariables?: {
    first?: number
    after?: string
    filter?: any
    orderBy?: any
  }
}
