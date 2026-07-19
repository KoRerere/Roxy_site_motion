declare module 'markdown-it-attrs' {
  import MarkdownIt from 'markdown-it';
  
  interface MarkdownItAttrsOptions {
    leftDelimiter?: string;
    rightDelimiter?: string;
    allowedAttributes?: string[];
  }
  
  function markdownItAttrs(md: MarkdownIt, options?: MarkdownItAttrsOptions): void;
  export = markdownItAttrs;
}

declare module 'markdown-it-video' {
  import MarkdownIt from 'markdown-it';
  
  interface MarkdownItVideoOptions {
    youtube?: {
      width?: string;
      height?: string;
    };
    [key: string]: any;
  }
  
  function markdownItVideo(md: MarkdownIt, options?: MarkdownItVideoOptions): void;
  export = markdownItVideo;
}
