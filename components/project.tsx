"use client";

import { useRef, useState } from "react";
import { projectsData } from "@/lib/data";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from 'next/navigation';
import { BsArrowRight, BsEye } from "react-icons/bs";

type ProjectProps = (typeof projectsData)[number] & { hasDetailedCaseStudy?: boolean };

export default function Project({
  id,
  title,
  description,
  tags,
  imageUrl,
  hasDetailedCaseStudy,
}: ProjectProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  // Scroll-based reveal only
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["0 1", "1.1 1"],
  });
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const yProgress = useTransform(scrollYProgress, [0, 1], [40, 0]);

  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      style={{
        scale: scaleProgress,
        opacity: opacityProgress,
        y: yProgress,
      }}
      className="mb-6 sm:mb-8 last:mb-0"
    >
      <motion.div
        style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--glass-shadow)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative rounded-2xl overflow-hidden group cursor-default"
        whileHover={{
          boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 40px rgba(0,212,255,0.1)',
          y: -4,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Gradient top accent */}
        <div
          className="absolute top-0 left-0 w-full h-0.5 z-10"
          style={{ background: 'linear-gradient(90deg, transparent, #00D4FF, #4A90E2, transparent)' }}
        />

        <div className="flex flex-col sm:flex-row sm:min-h-[24rem]">
          {/* Content */}
          <div className="flex flex-col justify-between p-7 sm:p-10 sm:w-[55%] sm:group-even:ml-auto sm:group-even:order-2">
            <div>
              <h3
                className="text-xl sm:text-2xl font-bold mb-3 transition-all duration-300"
                style={{
                  ...(isHovered ? {
                    background: 'linear-gradient(135deg, #00D4FF, #4A90E2)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  } : {
                    color: 'var(--color-text-primary)',
                  })
                }}
              >
                {title}
              </h3>
              <p className="text-[var(--color-text-secondary)] text-sm sm:text-base leading-relaxed line-clamp-4">
                {description}
              </p>
            </div>

            <div>
              {/* Tags */}
              <ul className="flex flex-wrap gap-1.5 mt-4 mb-5">
                {tags.map((tag, index) => (
                  <li
                    key={index}
                    className="px-2.5 py-1 text-[0.65rem] uppercase tracking-wider font-semibold rounded-full"
                    style={{
                      background: 'rgba(0,212,255,0.08)',
                      border: '1px solid rgba(0,212,255,0.2)',
                      color: '#00D4FF',
                    }}
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <motion.button
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white"
                style={{
                  background: 'linear-gradient(135deg, #00D4FF 0%, #4A90E2 100%)',
                  boxShadow: '0 4px 15px rgba(0,212,255,0.3)',
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 8px 25px rgba(0,212,255,0.5)',
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (hasDetailedCaseStudy) {
                    router.push(`/projects/${id}`);
                  } else {
                    router.push(`/projects?id=${id}`);
                  }
                }}
              >
                <BsEye className="text-sm" />
                View {hasDetailedCaseStudy ? 'Case Study' : 'Project'}
                <BsArrowRight className="text-xs" />
              </motion.button>
            </div>
          </div>

          {/* Image */}
          <div className="relative hidden sm:block sm:w-[45%] overflow-hidden sm:group-even:order-1">
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[var(--color-bg)]/30 z-[1] pointer-events-none sm:group-even:bg-gradient-to-r" />
            <Image
              src={imageUrl}
              alt={`${title} project preview`}
              fill
              sizes="(max-width: 640px) 0vw, 45vw"
              quality={90}
              className="object-cover object-top transition-all duration-700 group-hover:scale-105"
            />
            {/* Image overlay on hover */}
            <motion.div
              className="absolute inset-0 z-[2]"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(74,144,226,0.15))' }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
