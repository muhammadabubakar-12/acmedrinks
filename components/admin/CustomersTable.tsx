"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Users, Calendar } from "lucide-react";
import Image from "next/image";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    title: string;
    image: string;
  };
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: Date;
  items: OrderItem[];
}

interface Customer {
  id: string;
  name?: string;
  email: string;
  createdAt: Date;
  orders: Order[];
}

interface CustomersTableProps {
  customers: Customer[];
}

export default function CustomersTable({ customers }: CustomersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const calculateCustomerStats = (customer: Customer) => {
    const totalOrders = customer.orders.length;
    const totalSpent = customer.orders.reduce(
      (sum, order) => sum + order.total,
      0
    );
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    return {
      totalOrders,
      totalSpent,
      averageOrderValue,
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-2">
          View customer analytics and order history
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search customers by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Total Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Avg Order Value</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => {
              const stats = calculateCustomerStats(customer);
              return (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {customer.name || "Anonymous"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {customer.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{stats.totalOrders} orders</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(stats.totalSpent)}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(stats.averageOrderValue)}
                  </TableCell>
                  <TableCell>
                    {format(new Date(customer.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Customer Details Dialog */}
      <Dialog
        open={!!selectedCustomer}
        onOpenChange={() => setSelectedCustomer(null)}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Customer ID</h3>
                  <p className="text-sm text-gray-600 font-mono">
                    {selectedCustomer.id}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Joined</h3>
                  <p className="text-sm text-gray-600">
                    {format(new Date(selectedCustomer.createdAt), "PPP")}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Name</h3>
                  <p className="text-sm text-gray-600">
                    {selectedCustomer.name || "Anonymous"}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-sm text-gray-600">
                    {selectedCustomer.email}
                  </p>
                </div>
              </div>

              {/* Customer Stats */}
              <div>
                <h3 className="font-semibold mb-4">Customer Statistics</h3>
                <div className="grid grid-cols-3 gap-4">
                  {(() => {
                    const stats = calculateCustomerStats(selectedCustomer);
                    return (
                      <>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {stats.totalOrders}
                          </div>
                          <div className="text-sm text-blue-600">
                            Total Orders
                          </div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(stats.totalSpent)}
                          </div>
                          <div className="text-sm text-green-600">
                            Total Spent
                          </div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {formatCurrency(stats.averageOrderValue)}
                          </div>
                          <div className="text-sm text-purple-600">
                            Avg Order Value
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Order History */}
              <div>
                <h3 className="font-semibold mb-4">Order History</h3>
                {selectedCustomer.orders.length === 0 ? (
                  <p className="text-gray-500">No orders yet</p>
                ) : (
                  <div className="space-y-4">
                    {selectedCustomer.orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-medium">
                              Order #{order.id.slice(-8)}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {format(new Date(order.createdAt), "PPP")}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {formatCurrency(order.total)}
                            </div>
                            <Badge className="mt-1">{order.status}</Badge>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center space-x-3"
                            >
                              <div className="relative w-8 h-8">
                                <Image
                                  src={item.product.image}
                                  alt={item.product.title}
                                  fill
                                  className="object-cover rounded"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {item.product.title}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Qty: {item.quantity} ×{" "}
                                  {formatCurrency(item.price)}
                                </p>
                              </div>
                              <div className="text-sm font-medium">
                                {formatCurrency(item.price * item.quantity)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
