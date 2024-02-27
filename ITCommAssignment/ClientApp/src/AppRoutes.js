import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import { Assignment1 } from "./components/Assignment1"
import Chat from './components/Chat';
import NestedGrid from './components/NestedGrid';
import ExcelImport from './components/ExcelImport';


const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
      path: '/assignment1',
      element: <Assignment1 />
    },
    {
        path: '/assignment2',
        element: <Chat />
    },
    {
        path: '/assignment3',
        element: <NestedGrid />
    }, {
        path: '/assignment4',
        element: <ExcelImport />
    },
  {
    path: '/fetch-data',
    element: <FetchData />
  }
];

export default AppRoutes;
