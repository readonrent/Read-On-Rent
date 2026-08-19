import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import BookCard from './BookCard';
import { getBooks, getPremiumBooks, getCartoonBooks } from '../services/api';
import { FALLBACK_BOOKS } from '../data/books';

function Shelf({ title, emoji, books, viewAllHref, bento }) {
  if (!books?.length) return null;
  
  return (
    <section className="max-w-7xl mx-auto px-5 py-14 border-b border-ink/10 dark:border-paper/10">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="font-display font-bold text-4xl">
            <span className="text-2xl">{emoji}</span> {title}
          </h2>
        </div>
        <Link 
          to={viewAllHref} 
          className="flex items-center gap-1 font-display font-bold text-blaze hover:gap-2 transition-all duration-200"
        >
          View All <ArrowRight size={16} />
        </Link>
      </div>
      
      <div className={`grid gap-5 ${
        bento 
          ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-max' 
          : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
      }`}>
        {books.slice(0, 8).map((b, i) => (
          <BookCard 
            key={b._id || i} 
            book={b} 
            size={bento && i === 0 ? 'lg' : 'md'} 
          />
        ))}
      </div>
    </section>
  );
}

export default function PopularBooks() {
  const [popular, setPopular] = useState(FALLBACK_BOOKS);
  const [premium, setPremium] = useState(FALLBACK_BOOKS.filter(b => b.isPremium));
  const [cartoons, setCartoons] = useState(FALLBACK_BOOKS.filter(b => b.category === 'Comics & Cartoons'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fallback pehle set karo, then fetch from backend
    setLoading(true);
    
    Promise.all([
      getBooks({ limit: 8 }).catch(() => ({ data: FALLBACK_BOOKS })),
      getPremiumBooks().catch(() => ({ data: FALLBACK_BOOKS.filter(b => b.isPremium) })),
      getCartoonBooks().catch(() => ({ data: FALLBACK_BOOKS.filter(b => b.category === 'Comics & Cartoons') })),
    ]).then(([popRes, premRes, cartRes]) => {
      setPopular(popRes.data?.books ?? popRes.data ?? FALLBACK_BOOKS);
      setPremium(premRes.data?.books ?? premRes.data ?? FALLBACK_BOOKS.filter(b => b.isPremium));
      setCartoons(cartRes.data?.books ?? cartRes.data ?? FALLBACK_BOOKS.filter(b => b.category === 'Comics & Cartoons'));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-14">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-ink/10 dark:bg-paper/10 rounded w-40"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-ink/10 dark:bg-paper/10 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Shelf title="Popular Books" emoji="🔥" books={popular} viewAllHref="/books" bento={true} />
      <Shelf title="Premium Picks" emoji="✨" books={premium} viewAllHref="/books?premium=true" />
      <Shelf title="Comics & Cartoons" emoji="🦸‍♂️" books={cartoons} viewAllHref="/books?category=Comics%20%26%20Cartoons" />
    </>
  );
}