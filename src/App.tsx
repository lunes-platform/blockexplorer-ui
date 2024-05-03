import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage"
import Blocks from "./pages/Blocks";
import Extrinsics from "./pages/Extrinsics";
import Events from "./pages/Events";
import Transfers from "./pages/Transfers";
import Charts from "./pages/Charts";
import Block from "./pages/Block";
import Extrinsic from "./pages/Extrinsic";
import Account from "./pages/Account"
import Search from "./pages/Search";
import Transfer from "./pages/Transfer";
import { ApiContextProvider } from "./context/ApiContext";
import Richies from "./pages/Richies";


const linkPage = [
  {path: '/', component: <Homepage />},
  {path: '/blocks', component: <Blocks />},
  {path: '/extrinsics', component: <Extrinsics />},
  {path: '/events', component: <Events />},
  {path: '/transfers', component: <Transfers />},
  {path: '/charts', component: <Charts />},
  {path: '/block/:id', component: <Block />},
  {path: '/extrinsic/:id', component: <Extrinsic />},
  {path: '/account/:id', component: <Account />},
  {path: '/search/:id', component: <Search />},
  {path: '/tx/:id', component: <Transfer />},
  {path: '/rich', component: <Richies />},
  
]

function App() {
  return (
    <ApiContextProvider>
      <Router>
        <Navbar />
        <br />
        <Switch>
        {linkPage.map((obj) => {
            return (
              <Route exact path={obj.path} key={obj.path}>
                {obj.component}
              </Route>
            );
          })}
        </Switch>
       
      </Router>
    </ApiContextProvider>
  );
}

export default App;
