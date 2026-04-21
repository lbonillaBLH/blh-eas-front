import { createBrowserRouter } from "react-router-dom";
import { AuthenticatedMenu } from "./components/layoutComponents";
import { Login } from "./pages";
import { CreateExpensePage, ListExpensePage, DetailsExpensePage, ReportPage } from "./pages/eas";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Login/>,
    },
    {
      path: "/eas",
      element: <AuthenticatedMenu/>,
      children: [
        {
          path: "",
          element: <ListExpensePage/>
        },
        {
          path: "create",
          element: <CreateExpensePage/>
        },
        {
          path: ":expenseId",
          element: <DetailsExpensePage/>
        },
        {
          path: "report",
          element: <ReportPage/>
        }
      ]
    }
  ]
);

export default router;