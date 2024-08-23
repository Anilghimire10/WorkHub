import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import New from "./pages/new/New";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { userInputs } from "./formSource";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/Authcontext";
import { bookingColumns, busColumns, userColumns } from "./datatablesource";
import NewBus from "./pages/newBus/NewBus";
import EditBus from "./pages/editbus/EditBus";
import EditBook from "./pages/editbook/EditBook";

// Import new components
import Withdraws from "./pages/withdraws/Withdraws";
import Portfolios from "./pages/portfolios/Portfolios";
import Gigs from "./pages/gigs/Gigs";
import Invoices from "./pages/invoices/Invoices";
import Orders from "./pages/orders/Orders";
import Refunds from "./pages/refunds/Refunds";
import Reviews from "./pages/reviews/Reviews";
import Categories from "./pages/categories/Categories";
import Reports from "./pages/reports/Reports";
import Conversations from "./pages/conversations/Conversations";
import User from "./pages/user/User";

function App() {
  const { darkMode } = useContext(DarkModeContext);

  const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
      console.log("User is not authenticated, redirecting to login.");
      return <Navigate to="/login" />;
    }

    console.log("User is authenticated, rendering protected route.");
    return children;
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="users">
            <Route
              index
              element={
                <ProtectedRoute>
                  <List columns={userColumns} />
                </ProtectedRoute>
              }
            />
            <Route
              path="new"
              element={
                <ProtectedRoute>
                  <New inputs={userInputs} title="Add New User" />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="bus">
            <Route
              index
              element={
                <ProtectedRoute>
                  <List columns={busColumns} />
                </ProtectedRoute>
              }
            />
            <Route
              path="new"
              element={
                <ProtectedRoute>
                  <NewBus />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bus/edit/:id"
              exact
              element={
                <ProtectedRoute>
                  <EditBus />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="book">
            <Route
              index
              element={
                <ProtectedRoute>
                  <List columns={bookingColumns} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book/edit/:id"
              exact
              element={
                <ProtectedRoute>
                  <EditBook />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Add new routes here */}
          <Route
            path="withdraws"
            element={
              <ProtectedRoute>
                <Withdraws />
              </ProtectedRoute>
            }
          />
          <Route
            path="portfolios"
            element={
              <ProtectedRoute>
                <Portfolios />
              </ProtectedRoute>
            }
          />
          <Route
            path="gigs"
            element={
              <ProtectedRoute>
                <Gigs />
              </ProtectedRoute>
            }
          />
          <Route
            path="user"
            element={
              <ProtectedRoute>
                <User />
              </ProtectedRoute>
            }
          />
          <Route
            path="invoices"
            element={
              <ProtectedRoute>
                <Invoices />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="refunds"
            element={
              <ProtectedRoute>
                <Refunds />
              </ProtectedRoute>
            }
          />
          <Route
            path="reviews"
            element={
              <ProtectedRoute>
                <Reviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="categories"
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="conversations"
            element={
              <ProtectedRoute>
                <Conversations />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
