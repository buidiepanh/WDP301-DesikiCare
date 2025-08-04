"use client";
import { useAppSelector } from "@/app/hooks";
import { apiRequest, loginRequiredApi } from "@/lib/axiosInstance";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, MapPin, Phone, User, Star } from "lucide-react";
import { toast } from "sonner";

type DeliveryAddress = {
  deliveryAddress: {
    _id: string;
    accountId: string;
    provinceCode: string;
    districtCode: string;
    wardCode: string;
    addressDetailDescription: string;
    receiverName: string;
    receiverPhone: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

type NewDeliveryAddress = {
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  addressDetailDescription: string;
  receiverName: string;
  receiverPhone: string;
  isDefault: boolean;
};

type Province = {
  name: string;
  code: number;
  code_name: string;
  division_type: string;
  phone_code: number;
  districts: District[];
};

type District = {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  short_codename: string;
  wards: Ward[];
};

type Ward = {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  short_codename: string;
};

export default function MyDeliveryAddressesPage() {
  // REDUX
  const userInfo = useAppSelector((state) => state.user.info);

  // STATES
  const [deliveryAddresses, setDeliveryAddresses] = useState<DeliveryAddress[]>(
    []
  );
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProvincesLoading, setIsProvincesLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [formData, setFormData] = useState<NewDeliveryAddress>({
    provinceCode: "",
    districtCode: "",
    wardCode: "",
    addressDetailDescription: "",
    receiverName: "",
    receiverPhone: "",
    isDefault: false,
  });
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(
    null
  );
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null
  );

  // HOOKS
  useEffect(() => {
    // Fetch provinces ngay khi component mount
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (userInfo?._id) {
      fetchDeliveryAddresses();
    }
  }, [userInfo?._id]);

  // FUNCTIONS
  const fetchProvinces = async () => {
    if (provinces.length > 0) return; // Tránh fetch lại nếu đã có data

    setIsProvincesLoading(true);
    try {
      const response = await fetch(
        "https://provinces.open-api.vn/api/v1/?depth=3"
      );
      if (response.ok) {
        const data = await response.json();
        setProvinces(data);
        console.log("Provinces loaded:", data.length);
      } else {
        throw new Error("Failed to fetch provinces");
      }
    } catch (error) {
      console.error("Error fetching provinces:", error);
      toast.error("Failed to load provinces data");
    } finally {
      setIsProvincesLoading(false);
    }
  };

  const fetchDeliveryAddresses = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest({
        instance: loginRequiredApi,
        method: "GET",
        url: `Account/accounts/${userInfo?._id}/deliveryAddresses`,
      });
      if (response) {
        console.log("Delivery addresses response:", response.deliveryAddresses);
        setDeliveryAddresses(response.deliveryAddresses);
      }
    } catch (error) {
      console.error("Failed to fetch delivery addresses:", error);
      toast.error("Failed to load delivery addresses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      const response = await apiRequest({
        instance: loginRequiredApi,
        method: "PUT",
        url: `Account/deliveryAddresses/${addressId}/set-default`,
      });
      if (response) {
        fetchDeliveryAddresses();
        toast.success("Default address updated successfully");
      }
    } catch (error) {
      console.error("Failed to set default address:", error);
      toast.error("Failed to set default address");
    }
  };

  const handleCreateNewAddress = async (newAddress: NewDeliveryAddress) => {
    setIsCreating(true);
    try {
      const response = await apiRequest({
        instance: loginRequiredApi,
        method: "POST",
        url: `Account/accounts/${userInfo?._id}/deliveryAddresses`,
        data: {
          deliveryAddress: newAddress,
        },
      });
      if (response) {
        fetchDeliveryAddresses();
        setIsDialogOpen(false);
        resetForm();
        toast.success("New address created successfully");
      }
    } catch (error) {
      console.error("Failed to create new address:", error);
      toast.error("Failed to create new address");
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      provinceCode: "",
      districtCode: "",
      wardCode: "",
      addressDetailDescription: "",
      receiverName: "",
      receiverPhone: "",
      isDefault: false,
    });
    setSelectedProvince(null);
    setSelectedDistrict(null);
  };

  const handleOpenDialog = () => {
    // Provinces đã được fetch ở useEffect, không cần fetch lại
    setIsDialogOpen(true);
  };

  // Helper functions to get names from codes
  const getProvinceName = (code: string) => {
    if (provinces.length === 0) return "Loading...";
    const province = provinces.find((p) => p.code.toString() === code);
    return province?.name || `Province ${code}`;
  };

  const getDistrictName = (provinceCode: string, districtCode: string) => {
    if (provinces.length === 0) return "Loading...";
    const province = provinces.find((p) => p.code.toString() === provinceCode);
    const district = province?.districts.find(
      (d) => d.code.toString() === districtCode
    );
    return district?.name || `District ${districtCode}`;
  };

  const getWardName = (
    provinceCode: string,
    districtCode: string,
    wardCode: string
  ) => {
    if (provinces.length === 0) return "Loading...";
    const province = provinces.find((p) => p.code.toString() === provinceCode);
    const district = province?.districts.find(
      (d) => d.code.toString() === districtCode
    );
    const ward = district?.wards.find((w) => w.code.toString() === wardCode);
    return ward?.name || `Ward ${wardCode}`;
  };

  const getFullAddress = (address: DeliveryAddress) => {
    const ward = getWardName(
      address.deliveryAddress.provinceCode,
      address.deliveryAddress.districtCode,
      address.deliveryAddress.wardCode
    );
    const district = getDistrictName(
      address.deliveryAddress.provinceCode,
      address.deliveryAddress.districtCode
    );
    const province = getProvinceName(address.deliveryAddress.provinceCode);

    return `${address.deliveryAddress.addressDetailDescription}, ${ward}, ${district}, ${province}`;
  };

  const handleProvinceChange = (value: string) => {
    const province = provinces.find((p) => p.code.toString() === value);
    setSelectedProvince(province || null);
    setSelectedDistrict(null);
    setFormData((prev) => ({
      ...prev,
      provinceCode: value,
      districtCode: "",
      wardCode: "",
    }));
  };

  const handleDistrictChange = (value: string) => {
    const district = selectedProvince?.districts.find(
      (d) => d.code.toString() === value
    );
    setSelectedDistrict(district || null);
    setFormData((prev) => ({
      ...prev,
      districtCode: value,
      wardCode: "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.provinceCode ||
      !formData.districtCode ||
      !formData.wardCode ||
      !formData.addressDetailDescription ||
      !formData.receiverName ||
      !formData.receiverPhone
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    handleCreateNewAddress(formData);
  };

  const AddressSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            My Delivery Addresses
          </h1>
          <p className="text-gray-600 mt-1">Manage your delivery addresses</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleOpenDialog}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-none w-[90vw] max-h-[90vh] overflow-y-auto sm:w-[85vw] lg:w-[80vw] xl:w-[75vw]"
            style={{
              maxWidth: "calc(100vw - 2rem) !important",
              width: "90vw !important",
            }}
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Add New Delivery Address
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="receiverName" className="text-sm font-medium">
                    Receiver Name *
                  </Label>
                  <Input
                    id="receiverName"
                    value={formData.receiverName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        receiverName: e.target.value,
                      }))
                    }
                    placeholder="Enter receiver name"
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="receiverPhone"
                    className="text-sm font-medium"
                  >
                    Phone Number *
                  </Label>
                  <Input
                    id="receiverPhone"
                    value={formData.receiverPhone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        receiverPhone: e.target.value,
                      }))
                    }
                    placeholder="Enter phone number"
                    className="h-11"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="province" className="text-sm font-medium">
                    Province/City *
                  </Label>
                  <Select
                    value={formData.provinceCode}
                    onValueChange={handleProvinceChange}
                    disabled={isProvincesLoading}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue
                        placeholder={
                          isProvincesLoading ? "Loading..." : "Select province"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem
                          key={province.code}
                          value={province.code.toString()}
                        >
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district" className="text-sm font-medium">
                    District *
                  </Label>
                  <Select
                    value={formData.districtCode}
                    onValueChange={handleDistrictChange}
                    disabled={!selectedProvince}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedProvince?.districts.map((district) => (
                        <SelectItem
                          key={district.code}
                          value={district.code.toString()}
                        >
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ward" className="text-sm font-medium">
                    Ward *
                  </Label>
                  <Select
                    value={formData.wardCode}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, wardCode: value }))
                    }
                    disabled={!selectedDistrict}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select ward" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedDistrict?.wards.map((ward) => (
                        <SelectItem
                          key={ward.code}
                          value={ward.code.toString()}
                        >
                          {ward.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressDetail" className="text-sm font-medium">
                  Detailed Address *
                </Label>
                <Textarea
                  id="addressDetail"
                  value={formData.addressDetailDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      addressDetailDescription: e.target.value,
                    }))
                  }
                  placeholder="Enter house number, street name, etc."
                  className="min-h-[100px] resize-none"
                  required
                />
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isDefault: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <Label
                  htmlFor="isDefault"
                  className="text-sm font-medium cursor-pointer"
                >
                  Set as default address
                </Label>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="px-6 py-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="px-6 py-2"
                >
                  {isCreating ? "Creating..." : "Create Address"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Addresses List */}
      <div className="space-y-4">
        {isLoading || provinces.length === 0 ? (
          <AddressSkeleton />
        ) : deliveryAddresses.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No delivery addresses
              </h3>
              <p className="text-gray-600 mb-4">
                Add your first delivery address to start ordering.
              </p>
              <Button
                onClick={handleOpenDialog}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add New Address
              </Button>
            </CardContent>
          </Card>
        ) : (
          deliveryAddresses.map((address) => (
            <Card key={address.deliveryAddress._id} className="relative">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">
                          {address.deliveryAddress.receiverName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">
                          {address.deliveryAddress.receiverPhone}
                        </span>
                      </div>
                      {address.deliveryAddress.isDefault && (
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800 border-green-200"
                        >
                          <Star className="h-3 w-3 mr-1" />
                          Default
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <p className="text-gray-700 leading-relaxed">
                        {getFullAddress(address)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    {!address.deliveryAddress.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleSetDefaultAddress(address.deliveryAddress._id)
                        }
                        className="text-xs"
                      >
                        Set as Default
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
