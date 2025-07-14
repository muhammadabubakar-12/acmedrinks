"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUpload from "@/components/ImageUpload";

export default function AdminContent() {
  const [formData, setFormData] = useState({
    title: "",
    header: "",
    description: "",
    price: "",
    capacity: "",
    material: "",
    flavor: "",
    energy: "",
    coldRetention: "",
  });
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageUrl) {
      alert("Please upload a product image");
      return;
    }

    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("header", formData.header);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
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

    formDataToSend.append("imageUrl", imageUrl);

    const response = await fetch("/api/admin/products", {
      method: "POST",
      body: formDataToSend,
    });

    if (response.ok) {
      setFormData({
        title: "",
        header: "",
        description: "",
        price: "",
        capacity: "",
        material: "",
        flavor: "",
        energy: "",
        coldRetention: "",
      });
      setImageUrl("");
      alert("Product created successfully!");
    } else {
      const errorData = await response.json().catch(() => ({}));
      alert(errorData.error || "Failed to create product");
    }

    setLoading(false);
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Create New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <Label htmlFor="header">Header (Rating + Price)</Label>
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

            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-900"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
