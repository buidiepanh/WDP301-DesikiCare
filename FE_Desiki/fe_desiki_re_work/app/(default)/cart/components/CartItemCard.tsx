"use client";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/app/hooks";
import { removeItem, updateItemQuantity } from "@/slices/cartSlice";
import { categories } from "@/data/categories";

type CartItem = {
  cartItem: {
    _id: string;
    cartId: string;
    productId: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
  };
  product: {
    _id: string;
    categoryId: number;
    name: string;
    description: string;
    volume: number;
    salePrice: number;
    gameTicketReward: number;
    isDeactivated: boolean;
    createdAt: string;
    updatedAt: string;
    imageUrl: string;
  };
};

interface Props {
  item: CartItem;
  onUpdateQuantity: (item: CartItem, quantity: number) => Promise<void>;
  onRemoveItem: (item: CartItem) => Promise<void>;
  onRefreshCart: () => Promise<void>;
}

export const CartItemCard = ({
  item,
  onUpdateQuantity,
  onRemoveItem,
  onRefreshCart,
}: Props) => {
  // REDUX
  const dispatch = useAppDispatch();

  // STATES
  const [quantity, setQuantity] = useState(item.cartItem.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  // HOOKS
  useEffect(() => {
    setQuantity(item.cartItem.quantity);
  }, [item.cartItem.quantity]);

  // FUNCTIONS
  const getCategoryName = () => {
    // Tìm category trong categories data theo categoryId
    const foundCategory = categories.find(
      (cat) => cat._id === item.product.categoryId
    );
    return foundCategory?.name || "Unknown Category";
  };

  const handleQuantityUpdate = async () => {
    if (quantity === item.cartItem.quantity || quantity < 1) return;

    setIsUpdating(true);
    const originalQuantity = item.cartItem.quantity;

    try {
      // Optimistically update Redux first
      dispatch(
        updateItemQuantity({
          cartItemId: item.cartItem._id,
          quantity: quantity,
        })
      );

      await onUpdateQuantity(item, quantity);
      toast.success("Quantity updated successfully!");

      // Refresh cart to sync with server
      await onRefreshCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");

      // Revert the optimistic update
      dispatch(
        updateItemQuantity({
          cartItemId: item.cartItem._id,
          quantity: originalQuantity,
        })
      );
      setQuantity(originalQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleQuantityKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleQuantityUpdate();
    }
  };

  const handleRemoveItem = async () => {
    try {
      // Optimistically remove from Redux first
      dispatch(removeItem(item.cartItem._id));

      await onRemoveItem(item);
      toast.success("Item removed from cart!");

      // Refresh cart to sync with server
      await onRefreshCart();
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");

      // Refresh cart to revert the optimistic update
      await onRefreshCart();
    }
  };

  return (
    <div className="w-full grid grid-cols-12 p-4 border-b">
      <div className="col-span-2 flex items-center justify-start">
        <img
          src={item.product.imageUrl}
          alt={item.product.name}
          className="w-35 h-35 object-cover rounded"
        />
      </div>
      <div className="col-span-4 flex flex-col items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{item.product.name}</h3>
          <p className="text-sm text-gray-600">{getCategoryName()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 line-clamp-2">
            {item.product.description}
          </p>
        </div>
      </div>

      <div className="col-span-2 flex items-start px-10">
        <div className="flex items-center gap-2">
          <p className="font-semibold">Quantity</p>
          <div className="h-8 border-1 border-gray-300 flex items-center justify-center">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              onBlur={handleQuantityUpdate}
              onKeyPress={handleQuantityKeyPress}
              disabled={isUpdating}
              className="w-16 h-full text-center text-sm text-gray-600 border-none outline-none disabled:bg-gray-100"
            />
          </div>
        </div>
      </div>

      <div className="col-span-2 flex items-start gap-5 px-10">
        <div className="flex items-center gap-2">
          <p className="font-semibold">Unit Price</p>
          <div className="h-8 p-2 border-1 border-gray-300 flex items-center justify-center">
            <p className="text-sm text-gray-600">
              {item.product.salePrice.toLocaleString("vn")} đ
            </p>
          </div>
        </div>
      </div>

      <div className="col-span-2 flex flex-col items-end justify-between px-10">
        <p className="text-lg font-bold">
          {(item.product.salePrice * quantity).toLocaleString("vn")} đ
        </p>
        {/* Icon to remove cartItem from Cart */}
        <X
          className="cursor-pointer hover:text-red-500 transition-colors"
          onClick={handleRemoveItem}
        />
      </div>
    </div>
  );
};
