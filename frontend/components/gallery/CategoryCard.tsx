import Image from "next/image";

type CategoryCardProps = {
  title: string;
  count: number;
  imageSrc: string;
  large?: boolean;
};

export default function CategoryCard({
  title,
  count,
  imageSrc,
  large = false,
}: CategoryCardProps) {
  return (
    <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl">
      {/* Count Badge */}
      <div className="absolute top-6 left-6 z-10">
        <span className="bg-orange-500 text-white text-lg font-bold px-4 py-2 rounded-full shadow-md">
          {count}
        </span>
      </div>

      {/* Image */}
      <div className="relative h-full w-full">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover"
          sizes="33vw, 25vw"
        />
      </div>

      {/* Title Overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 pt-20">
        <h3
          className={`font-bold text-white ${large ? "text-5xl" : "text-3xl"}`}
        >
          {title}
        </h3>
        <p className={`text-white/90 ${large ? "text-xl" : "text-lg"}`}>
          Worefall
        </p>
      </div>
    </div>
  );
}
