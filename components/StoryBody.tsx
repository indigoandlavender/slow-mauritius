'use client';

interface StoryBodyProps {
  content: string;
}

export default function StoryBody({ content }: StoryBodyProps) {
  if (!content) return null;

  // Split by double newlines for paragraphs
  const paragraphs = content.split(/\n\n+/).filter(Boolean);

  return (
    <div className="prose prose-lg max-w-none">
      {paragraphs.map((paragraph, index) => {
        // Check if it's a blockquote (starts with >)
        if (paragraph.trim().startsWith('>')) {
          const quoteText = paragraph.trim().replace(/^>\s*/, '');
          return (
            <blockquote
              key={index}
              className="border-l-2 border-white/20 pl-6 my-8 text-xl italic text-white/70"
            >
              {quoteText}
            </blockquote>
          );
        }

        // Check if it's a heading (starts with ##)
        if (paragraph.trim().startsWith('## ')) {
          const headingText = paragraph.trim().replace(/^##\s*/, '');
          return (
            <h2
              key={index}
              className="font-serif text-2xl text-white mt-12 mb-6"
            >
              {headingText}
            </h2>
          );
        }

        // Regular paragraph
        return (
          <p
            key={index}
            className="text-white/70 leading-relaxed mb-6"
          >
            {paragraph}
          </p>
        );
      })}
    </div>
  );
}
