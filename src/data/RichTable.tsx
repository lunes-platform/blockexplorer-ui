import { gql, useQuery } from "@apollo/client";
import { PAGINATION_PART_OF_QUERY,AccountLink } from "../utils";
import RTable from "./RTable";


export default function RichTable({moreVariables, noMore}: Props) {
  const query = gql`
    query Accounts($first: Int, $orderBy: [AccountsOrderBy!], $after: Cursor) {
      query {
        accounts(first: $first, orderBy: $orderBy, after: $after) {
          ${PAGINATION_PART_OF_QUERY}
          nodes {
            id
            balance           
          }
        }
      }
    }
  `
  const variables = {
    "first": 100,
    "orderBy": ["BALANCE_DESC"],
    ...moreVariables
  }

  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Address", accessor: "address"},
    { Header: "Balance", accessor: "balance" },    
  ];
  const { loading, error, data, fetchMore } = useQuery(query, {variables: variables});

  const rData =
    data &&
    data.query.accounts.nodes.map(
      (d: any, index:number) => ({
        id: (index+1).toString(),
        address: AccountLink(d.id),
        balance: `${Math.ceil(d.balance/100000000)} LUNES`
      })
    );

  const loadMore = () => {
    fetchMore({
      variables: {after: data.query.accounts.pageInfo.endCursor}
    })
    console.log(`Load more after ${data.query.accounts.pageInfo.endCursor}`)
  }

  return (
    <RTable  {...{data, rData, columns, loadMore, loading, noMore, hasNextPage: data?.query.accounts.pageInfo.hasNextPage }}/>
  )
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
