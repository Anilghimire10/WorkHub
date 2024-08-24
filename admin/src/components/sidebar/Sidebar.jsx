import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DescriptionIcon from "@mui/icons-material/Description";
import RateReviewIcon from "@mui/icons-material/RateReview";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      icon: "question",
      title: "Confirm Logout",
      text: "Are you sure you want to logout?",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "No, Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setTimeout(() => {
          Swal.fire({
            icon: "success",
            title: "Logout Successful",
            text: "You have been successfully logged out.",
          });
          navigate("/login");
        }, 1500);
      }
    });
  };

  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <h1>WorkHub</h1>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          {/* DASHBOARD */}
          <p className="title">DASHBOARD</p>
          <li>
            <Link to="/" style={{ textDecoration: "none" }}>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </Link>
          </li>

          {/* LISTS */}
          <p className="title">LISTS</p>
          <li>
            <Link to="/user" style={{ textDecoration: "none" }}>
              <PersonOutlineIcon className="icon" />
              <span>Users</span>
            </Link>
          </li>
          <li>
            <Link to="/gigs" style={{ textDecoration: "none" }}>
              <AssignmentTurnedInIcon className="icon" />
              <span>Gigs</span>
            </Link>
          </li>
          <li>
            <Link to="/invoices" style={{ textDecoration: "none" }}>
              <ReceiptIcon className="icon" />
              <span>Payment Details</span>
            </Link>
          </li>
          <li>
            <Link to="/orders" style={{ textDecoration: "none" }}>
              <DescriptionIcon className="icon" />
              <span>Orders</span>
            </Link>
          </li>
          <li>
            <Link to="/reviews" style={{ textDecoration: "none" }}>
              <RateReviewIcon className="icon" />
              <span>Reviews</span>
            </Link>
          </li>
          {/* ADMIN */}
          <p className="title">ADMIN</p>
          <li onClick={handleLogout}>
            <ExitToAppIcon className="icon" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
