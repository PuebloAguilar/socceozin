
import React from 'react';
import { cn } from '../header/utils';

export type TestimonialAuthor = {
  name: string;
  title: string;
  company: string;
  image: string;
};

interface TestimonialCardProps {
  author: TestimonialAuthor;
  text: string;
  href?: string;
  className?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  author,
  text,
  href = '#',
  className,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href === '#') {
      e.preventDefault();
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        // Square dimensions for "window" effect: 320px x 320px
        'flex w-[320px] h-[320px] shrink-0 cursor-pointer flex-col justify-between gap-3 rounded-2xl border border-white/20 bg-neutral-950 p-6 transition-transform duration-300 ease-in-out hover:-translate-y-1',
        className
      )}
    >
      <div className="flex-1 flex flex-col justify-center pt-1">
         <p className="text-sm md:text-[15px] font-normal text-left text-neutral-300 leading-relaxed">"{text}"</p>
      </div>
      
      <div className="flex items-center gap-3 pt-3 border-t border-white/10">
        {/* Removed grayscale from the class list below */}
        <img src={author.image} alt={author.name} className="size-10 rounded-full object-cover border border-white/10" />
        <div className="flex flex-col text-left">
          <p className="font-semibold text-white text-sm">{author.name}</p>
          <p className="text-xs text-neutral-400">{author.title}, {author.company}</p>
        </div>
      </div>
    </a>
  );
};