"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "./StoreCart";

type CartItemProps = {
  name: string;
  image: string;
  id: number;
  color: string;
  price: number;
  quantity?: number;
};

const AddToCart = ({
  color,
  id,
  image,
  name,
  price,
  quantity = 1,
}: CartItemProps) => {
  const CartItem = { color, id, name, price, image, quantity };
  const addItem = useCartStore((state) => state.addItem);

  return <Button onClick={() => addItem(CartItem)}>AddToCart</Button>;
};

export default AddToCart;
