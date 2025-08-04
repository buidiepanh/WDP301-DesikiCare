import Image from "next/image";
import Link from "next/link";
import React from "react";

const SubNav = () => {
  return (
    <div className="w-full px-10 grid md:grid-cols-2 sm:grid-cols-1  gap-10">
      <div className="bg-[#EAE5E2] h-[374px] p-5 relative flex flex-col">
        <p className="text-[24px] font-semibold text-black">Play Mini-games</p>
        <p className="text-[12px] font-medium text-gray-500 mt-3">
          Play games and earn rewards
        </p>
        <Image
          src="/images/decoration/home/subNav/games.png"
          alt="Image 1"
          width={202}
          height={202}
          className="object-cover rounded-lg absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />

        <Link
          href="/mini-games"
          className="absolute bottom-6 right-7 font-medium text-[16px] hover:underline cursor-pointer"
        >
          Play Now
        </Link>
      </div>
      <div className="bg-[#C4DAE6] h-[374px] p-5 relative flex flex-col">
        <p className="text-[24px] font-semibold text-black">Take Quiz</p>
        <p className="text-[12px] font-medium text-gray-500 mt-3">
          Find Your Skin Types and Skin Statuses
        </p>
        <Image
          src="/images/decoration/home/subNav/quiz.png"
          alt="Image 1"
          width={128.19}
          height={192.29}
          className="object-cover rounded-lg absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
        <Link
          href="/quiz"
          className="absolute bottom-6 right-7 font-medium text-[16px] hover:underline cursor-pointer"
        >
          Take Quiz Now
        </Link>
      </div>
    </div>
  );
};

export default SubNav;
