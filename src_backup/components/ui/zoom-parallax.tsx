import * as React from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

interface ParallaxItem {
	src?: string;
  carousel?: string[];
	alt?: string;
  className?: string;
}

interface ZoomParallaxProps {
	/** Array of images or carousels to be displayed in the parallax effect max 7 items */
	items: ParallaxItem[];
}

const ImageOrCarousel = ({ item }: { item: ParallaxItem }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (item.carousel && item.carousel.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % item.carousel!.length);
      }, 1500);
      return () => clearInterval(timer);
    }
  }, [item.carousel]);

  if (item.carousel) {
    return (
      <div className="relative h-full w-full bg-black/20">
        {item.carousel.map((src, i) => (
          <motion.img
            key={src}
            src={src}
            initial={{ opacity: 0 }}
            animate={{ opacity: i === currentIndex ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 h-full w-full object-contain p-2"
            alt={`${item.alt || 'Carousel image'} ${i + 1}`}
          />
        ))}
      </div>
    );
  }

  return (
    <img
      src={item.src || '/placeholder.svg'}
      alt={item.alt || 'Parallax image'}
      className={`h-full w-full ${item.src?.includes('robot') ? 'object-cover' : 'object-contain p-2'}`}
    />
  );
};

export function ZoomParallax({ items }: ZoomParallaxProps) {
	const container = useRef(null);
	const { scrollYProgress } = useScroll({
		target: container,
		offset: ['start start', 'end end'],
	});

	const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
	const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
	const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
	const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
	const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

	const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

	return (
		<div ref={container} className="relative h-[300vh]">
			<div className="sticky top-0 h-screen overflow-hidden">
				{items.map((item, index) => {
					const scale = scales[index % scales.length];

					return (
						<motion.div
							key={index}
							style={{ scale }}
							className={`absolute top-0 flex h-full w-full items-center justify-center ${index === 1 ? '[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]' : ''} ${index === 2 ? '[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]' : ''} ${index === 3 ? '[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]' : ''} ${index === 4 ? '[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]' : ''} ${index === 5 ? '[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]' : ''} ${index === 6 ? '[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]' : ''} `}
						>
							<div className={`relative h-[25vh] w-[25vw] overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-black ${item.className || ''}`}>
								<ImageOrCarousel item={item} />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
							</div>
						</motion.div>
					);
				})}
			</div>
		</div>
	);
}
