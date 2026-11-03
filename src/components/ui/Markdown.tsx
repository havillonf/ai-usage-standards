import type {AnchorHTMLAttributes, ReactNode} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {Link} from 'react-router';

/** Link que usa o roteador para rotas internas e abre externas em nova aba. */
export function LinkInteligente({href = '', children, ...resto}: AnchorHTMLAttributes<HTMLAnchorElement>): ReactNode {
  if (href.startsWith('/')) {
    return (
      <Link to={href} {...resto}>
        {children}
      </Link>
    );
  }
  if (href.startsWith('#')) {
    return (
      <a href={href} {...resto}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...resto}>
      {children}
    </a>
  );
}

/** Renderiza trechos curtos de Markdown dos roteiros. */
export default function Markdown({children, inline = false}: {children: string; inline?: boolean}): ReactNode {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({href, children}) => <LinkInteligente href={href}>{children}</LinkInteligente>,
        ...(inline ? {p: ({children}) => <>{children}</>} : {}),
      }}>
      {children}
    </ReactMarkdown>
  );
}
