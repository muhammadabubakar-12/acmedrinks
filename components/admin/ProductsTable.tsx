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
import { Search, Edit, Trash2, Plus, Package } from "lucide-react";
import Image from "next/image";
import ImageUpload from "@/components/ImageUpload";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Product {
  id: string;
  title: string;
  slug: string;
  header: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  specs: any;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductsTableProps {
  products: Product[];
}

export default function ProductsTable({ products }: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    header: "",
    description: "",
    price: "",
    stock: "",
    capacity: "",
    material: "",
    flavor: "",
    energy: "",
    coldRetention: "",
  });
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      header: product.header,
      description: product.description,
      price: product.price.toString(),
      stock: (product.stock || 0).toString(),
      capacity: product.specs.Capacity || "",
      material: product.specs.Material || "",
      flavor: product.specs.Flavor || "",
      energy: product.specs.Energy || "",
      coldRetention: product.specs["Cold Retention"] || "",
    });
    setImageUrl(product.image);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("header", formData.header);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("stock", formData.stock);
    formDataToSend.append(
      "specs",
      JSON.stringify({
        Capacity: formData.capacity,
        Material: formData.material,
        Flavor: formData.flavor,
        Energy: formData.energy,
        "Cold Retention": formData.coldRetention,
      })
    );

    if (imageUrl) {
      formDataToSend.append("imageUrl", imageUrl);
    }

    const url = editingProduct
      ? `/api/admin/products/${editingProduct.id}`
      : "/api/admin/products";

    const method = editingProduct ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      body: formDataToSend,
    });

    if (response.ok) {
      setFormData({
        title: "",
        header: "",
        description: "",
        price: "",
        stock: "",
        capacity: "",
        material: "",
        flavor: "",
        energy: "",
        coldRetention: "",
      });
      setImageUrl("");
      setEditingProduct(null);
      setShowAddDialog(false);
      window.location.reload(); // Refresh to show updated data
    } else {
      const errorData = await response.json().catch(() => ({}));
      alert(errorData.error || "Failed to save product");
    }

    setLoading(false);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const response = await fetch(`/api/admin/products/${productId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      window.location.reload();
    } else {
      alert("Failed to delete product");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-2">Manage your product inventory</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="relative w-12 h-12">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{product.title}</div>
                    <div className="text-sm text-gray-500">
                      {product.header}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(product.price)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={product.stock > 0 ? "default" : "destructive"}
                  >
                    {product.stock} in stock
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(product.createdAt), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Product Dialog */}
      <Dialog
        open={showAddDialog || !!editingProduct}
        onOpenChange={() => {
          setShowAddDialog(false);
          setEditingProduct(null);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="ACME ASCENT - Premium Energy Drink"
                  required
                />
              </div>
              <div>
                <Label htmlFor="header">Header</Label>
                <Input
                  id="header"
                  value={formData.header}
                  onChange={(e) =>
                    setFormData({ ...formData, header: e.target.value })
                  }
                  placeholder="(4.5 / 120 reviews) $49.99"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Elevate your energy game..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="49.99"
                  required
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  placeholder="100"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: e.target.value })
                  }
                  placeholder="500ml"
                  required
                />
              </div>
              <div>
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  value={formData.material}
                  onChange={(e) =>
                    setFormData({ ...formData, material: e.target.value })
                  }
                  placeholder="Aluminum Can"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="flavor">Flavor</Label>
                <Input
                  id="flavor"
                  value={formData.flavor}
                  onChange={(e) =>
                    setFormData({ ...formData, flavor: e.target.value })
                  }
                  placeholder="Citrus Mint"
                  required
                />
              </div>
              <div>
                <Label htmlFor="energy">Energy</Label>
                <Input
                  id="energy"
                  value={formData.energy}
                  onChange={(e) =>
                    setFormData({ ...formData, energy: e.target.value })
                  }
                  placeholder="120mg Natural Caffeine"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="coldRetention">Cold Retention</Label>
              <Input
                id="coldRetention"
                value={formData.coldRetention}
                onChange={(e) =>
                  setFormData({ ...formData, coldRetention: e.target.value })
                }
                placeholder="Up to 8 hours"
                required
              />
            </div>

            <ImageUpload onImageUploaded={setImageUrl} required />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddDialog(false);
                  setEditingProduct(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Saving..."
                  : editingProduct
                  ? "Update Product"
                  : "Create Product"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
