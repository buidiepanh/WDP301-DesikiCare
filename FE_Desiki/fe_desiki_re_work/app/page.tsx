"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { increment } from "@/slices/counterSlice";

export default function Home() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(increment());
  };
  return (
    <div className="w-full h-screen flex flex-col gap-10 items-center justify-center">
      <p className="font-bold text-5xl text-cyan-900">
        Hello, This is Developer!
      </p>
      <Button className="font-instrument" onClick={handleClick}>
        Click me
      </Button>
      <p>You have click {count} times!</p>
    </div>
  );
}
