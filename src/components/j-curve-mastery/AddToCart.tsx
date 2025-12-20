"use client";

import { Button } from "@/components/ui/button";
import { GetProductBySlug } from "./data";

interface Props {
  product: GetProductBySlug;
}
const AddToCart = ({ product }: Props) => {
  return <Button>AddToCart</Button>;
};

export default AddToCart;
