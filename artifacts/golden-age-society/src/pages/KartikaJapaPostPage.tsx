import React from 'react';
import { Link, useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageHero } from '@/components/visual/PageHero';
import { useKartikaDocumentHead } from '@/hooks/useKartikaDocumentHead';
import {
  type ArticleBlock,
  type Run,
  KARTIKA_BYLINE,
  KARTIKA_MAHA_MANTRA_LINES,
  KARTIKA_SITE_LABEL,
  KARTIKA_SITE_URL,
  KARTIKA_TITLE,
  kartikaAfterSecondQuote,
  kartikaBeforeFirstQuote,
  kartikaBetweenQuotes,
  kartikaClass,
} from '@/content/kartikaJapaPost';

function Runs({ runs }: { runs: Run[] }) {
  return (
    <>
      {runs.map((run, index) => {
        if (run.kind === 'text') return <React.Fragment key={index}>{run.text}</React.Fragment>;
        if (run.kind === 'strong') return <strong key={index}>{run.text}</strong>;
        if (run.external) {
          return (
            <a key={index} href={run.href} target="_blank" rel="noopener noreferrer" className={kartikaClass.link}>
              {run.text}
            </a>
          );
        }
        return (
          <Link key={index} href={run.href} className={kartikaClass.link}>
            {run.text}
          </Link>
        );
      })}
    </>
  );
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case 'p':
      return (
        <p className={kartikaClass.p}>
          <Runs runs={block.inlines} />
        </p>
      );
    case 'h2':
      return <h2 className={kartikaClass.h2}>{block.text}</h2>;
    case 'h3':
      return <h3 className={kartikaClass.h3}>{block.text}</h3>;
    case 'ul':
      return (
        <ul className={kartikaClass.ul}>
          {block.items.map((item, index) => (
            <li key={index}>
              <Runs runs={item} />
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol className={kartikaClass.ol}>
          {block.items.map((item, index) => (
            <li key={index}>
              <Runs runs={item} />
            </li>
          ))}
        </ol>
      );
    case 'mantra':
      return (
        <p className={kartikaClass.mantra}>
          <strong>
            {KARTIKA_MAHA_MANTRA_LINES[0]}
            <br />
            {KARTIKA_MAHA_MANTRA_LINES[1]}
          </strong>
        </p>
      );
    case 'signoff':
      return (
        <p className={kartikaClass.signoff}>
          <strong>Hare Krishna,</strong>
          <br />
          <strong>The Golden Age Society</strong>
          <br />
          <a href={KARTIKA_SITE_URL} className={kartikaClass.link}>
            {KARTIKA_SITE_LABEL}
          </a>
        </p>
      );
    default: {
      const neverBlock: never = block;
      throw new Error(`Unknown article block ${JSON.stringify(neverBlock)}`);
    }
  }
}

function ArticleBlocks({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => (
        <Block key={`${block.type}-${index}`} block={block} />
      ))}
    </>
  );
}

export default function KartikaJapaPostPage() {
  useKartikaDocumentHead();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <PageHero kicker="Kartik month 2026" title={KARTIKA_TITLE} subtitle={KARTIKA_BYLINE} />
      <article className={kartikaClass.article}>
        <ArticleBlocks blocks={kartikaBeforeFirstQuote} />
        {/* TEACHER QUOTE: add later */}
        <ArticleBlocks blocks={kartikaBetweenQuotes} />
        {/* TEACHER QUOTE: add later */}
        <ArticleBlocks blocks={kartikaAfterSecondQuote} />
      </article>
      <Footer onSponsorClick={() => navigate('/donate')} />
    </div>
  );
}
