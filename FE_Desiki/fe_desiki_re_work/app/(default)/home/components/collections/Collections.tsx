"use client";

import Image from "next/image";

const collectionData = [
  {
    collectionName: "The Ordinary",
    collectionDescription:
      "lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    collectionLogo: "/images/decoration/home/collection/collection1/logo.png",
    sideImage: "/images/decoration/home/collection/collection1/sideImage.png",
    gridImages: [
      "/images/decoration/home/collection/collection1/1.png",
      "/images/decoration/home/collection/collection1/2.png",
      "/images/decoration/home/collection/collection1/3.png",
      "/images/decoration/home/collection/collection1/4.png",
    ],
  },
  {
    collectionName: "Adora",
    collectionDescription:
      "lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    collectionLogo: "/images/decoration/home/collection/collection2/logo.png",
    sideImage: "/images/decoration/home/collection/collection2/sideImage.png",
    gridImages: [
      "/images/decoration/home/collection/collection2/1.png",
      "/images/decoration/home/collection/collection2/2.png",
      "/images/decoration/home/collection/collection2/3.png",
      "/images/decoration/home/collection/collection2/4.png",
    ],
  },
];

type CollectionItemProps = {
  collection: {
    collectionName: string;
    collectionDescription: string;
    collectionLogo: string;
    sideImage: string;
    gridImages: string[];
  };
  index: number;
};

const CollectionItem: React.FC<CollectionItemProps> = ({
  collection,
  index,
}) => {
  const isEven = index % 2 === 0;

  if (isEven) {
    return (
      <div className="w-full flex flex-col px-10">
        <div className="flex items-center justify-between w-full">
          <div>
            <p>{collection.collectionDescription}</p>
          </div>
          <div className="flex items-center gap-4">
            <Image
              src={collection.collectionLogo}
              alt={collection.collectionName}
              width={301}
              height={108}
              className="object-cover"
            />
            <div className="flex flex-col items-start gap-3">
              <p className="text-[12px] font-bold text-gray-400">COLLECTION</p>
              <p className="text-[20px] font-bold text-black">
                {collection.collectionName}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full flex items-center justify-between mt-6">
          <div>
            <Image
              src={collection.sideImage}
              alt={collection.collectionName}
              width={362}
              height={500}
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {collection.gridImages.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`${collection.collectionName} image ${index + 1}`}
                width={232}
                height={232}
                className="object-cover"
              />
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full flex flex-col px-10">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-start gap-3">
              <p className="text-[12px] font-bold text-gray-400">COLLECTION</p>
              <p className="text-[20px] font-bold text-black">
                {collection.collectionName}
              </p>
            </div>
            <Image
              src={collection.collectionLogo}
              alt={collection.collectionName}
              width={301}
              height={108}
              className="object-cover"
            />
          </div>
          <div>
            <p>{collection.collectionDescription}</p>
          </div>
        </div>

        <div className="w-full flex items-center justify-between mt-6">
          <div className="grid grid-cols-2 gap-4 mt-4">
            {collection.gridImages.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`${collection.collectionName} image ${index + 1}`}
                width={232}
                height={232}
                className="object-cover"
              />
            ))}
          </div>
          <div>
            <Image
              src={collection.sideImage}
              alt={collection.collectionName}
              width={362}
              height={500}
              className="object-cover"
            />
          </div>
        </div>
      </div>
    );
  }
};

export const Collections = () => {
  return (
    <div className="w-full flex flex-col gap-16 font-instrument px-10 py-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold">Collections</h2>
      </div>

      {/* Collections List */}
      <div className="flex w-full items-center justify-center">
        <div className="w-10/12 flex flex-col gap-16">
          {collectionData.map((collection, index) => (
            <CollectionItem
              key={collection.collectionName}
              collection={collection}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
