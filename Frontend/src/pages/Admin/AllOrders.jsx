import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const AllOrders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const { accessToken } = useSelector((state) => state.user);

  useEffect(() => {
    if (!accessToken) {
      console.log("No access token yet, skipping fetch");
      return;
    }
    const getAllOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/admin/order/getAllOrders",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        );
        console.log(res.data);

        if (res.data.success) {
          setAllOrders(res.data.orders);
        }
      } catch (error) {
        console.error("Failed to fetch all orders", error);
      }
    };

    getAllOrders();
  }, [accessToken]);

  return (
    <>
      <div className="admin-container flex flex-col items-center justify-center px-2 py-4 mt-10">
        <div className=" w-full max-w-full md:max-w-[85%] lg:max-w-[90%] overflow-x-auto">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-4">
            All Orders
          </h2>

          <TableContainer
            component={Paper}
            sx={{
              overflowX: "auto",
              maxWidth: "100%",
              "&::-webkit-scrollbar": {
                height: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#ccc",
                borderRadius: "4px",
              },
            }}
          >
            <Table sx={{ minWidth: "900px" }} aria-label="simple table">
              <TableHead>
                <TableRow className="bg-[#E7F0DC] ">
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Product</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="center">Total Price</TableCell>
                  <TableCell align="center">Order Date</TableCell>
                  <TableCell align="center">Order Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allOrders.flatMap((order) =>
                  order.cartItems.map((item) => (
                    <TableRow key={`${order._id}-${item._id}`}>
                      <TableCell align="center">{order.userId.email}</TableCell>
                      <TableCell align="center">
                        {item.productId.title}
                      </TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="center">
                        {item.totalItemPrice}
                      </TableCell>
                      <TableCell align="center">
                        {new Date(order.createdAt).toLocaleDateString("en-GB")}
                      </TableCell>
                      <TableCell align="center">{order.orderStatus}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
};

export default AllOrders;
