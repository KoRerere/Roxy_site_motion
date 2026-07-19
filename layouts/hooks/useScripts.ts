const cnBrandName = 'Roxy浏览器'
// 兼容zh语言
function getLdJson(localeValue: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://roxybrowser.com/#website',
        'name': localeValue === 'zh' ? 'Roxy浏览器' : 'RoxyBrowser',
        'url': localeValue === 'en' ? 'https://roxybrowser.com' : `https://roxybrowser.com/${localeValue}`,
        ...(localeValue === 'zh'
          ? {
              alternateName: ['RoxyBrowser', 'RoxyBrowser指纹浏览器', 'Roxy指纹浏览器', 'Roxy AI 浏览器'],
            }
          : {}),
        'publisher': {
          '@id': 'https://roxybrowser.com/#organization',
        },
        'image': {
          '@type': 'ImageObject',
          'contentUrl': 'https://roxybrowser.com/logo.svg',
          'url': 'https://roxybrowser.com/logo.svg',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://roxybrowser.com/#organization',
        'name': 'Linkv Tech Pte. Ltd.',
        'url': 'https://roxybrowser.com',
        'logo': 'https://roxybrowser.com/logo2.svg',
        'image': {
          '@type': 'ImageObject',
          'contentUrl': 'https://roxybrowser.com/logo.svg',
          'url': 'https://roxybrowser.com/logo.svg',
        },
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': '20 Cecil Street, #14-00 & #15-00, PLUS Building',
          'addressLocality': 'Singapore',
          'postalCode': '049705',
          'addressCountry': 'SG',
        },
        'contactPoint': {
          '@type': 'ContactPoint',
          'telephone': '+447745818521',
          'contactType': 'customer service',
          'areaServed': 'Global',
          'availableLanguage': ['English', 'Chinese'],
        },
        'sameAs': [
          'https://www.crunchbase.com/organization/roxybrowser',
          'https://www.g2.com/products/roxybrowser/reviews',
          'https://www.getapp.com/all-software/a/roxybrowser/',
          'https://www.trustpilot.com/review/roxybrowser.com',
          'https://www.softwareadvice.com/product/526217-RoxyBrowser/',
          'https://huntscreens.com/en/products/roxybrowser',
          'https://crozdesk.com/software/roxybrowser',
          'https://www.producthunt.com/products/roxybrowser',
          'https://roxybrowser.en.uptodown.com/windows/download',
          'https://sourceforge.net/software/product/RoxyBrowser/',
          'https://www.capterra.com/p/10027461/RoxyBrowser/',
          'https://x.com/RoxyBrowser',
          'https://www.youtube.com/@RoxyBrowser',
          'https://tiktok.com/@roxybrowser',
          'https://www.facebook.com/roxybrowser/',
          'https://www.instagram.com/RoxyBrowser/',
          'https://www.scamadviser.com/check-website/roxybrowser.com',
          'https://www.apivoid.com/tools/website-trust-score/?domain=roxybrowser.com',
        ],
      },
      {
        '@type': 'Product',
        '@id': 'https://roxybrowser.com/#product',
        'name': 'RoxyBrowser',
        'image': {
          '@type': 'ImageObject',
          'contentUrl': 'https://roxybrowser.com/logo.svg',
          'url': 'https://roxybrowser.com/logo.svg',
        },
        'description': 'RoxyBrowser antidetect browser protects your digital identity and simplifies multi-accounting management with secure, unique browser fingerprints.',
        'brand': {
          '@type': 'Brand',
          'name': 'RoxyBrowser',
          'logo': 'https://roxybrowser.com/logo2.svg',
        },
        'url': 'https://roxybrowser.com',
        'offers': {
          '@type': 'Offer',
          'price': '0.80',
          'priceCurrency': 'USD',
          'url': 'https://roxybrowser.com/pricing',
          'availability': 'https://schema.org/InStock',
          'priceValidUntil': '2030-12-31',
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.7',
          'reviewCount': '45',
          'bestRating': '5',
          'worstRating': '1',
        },
        'review': [
          {
            '@type': 'Review',
            'author': {
              '@type': 'Person',
              'name': 'Delwar Z',
            },
            'reviewBody': 'I think Roxy is a great tool to use as a product promoter, it helps me to handle the process of account management, the previous hassle of managing multiple accounts became easy and secure with Roxy.',
            'reviewRating': {
              '@type': 'Rating',
              'ratingValue': '4.8',
              'bestRating': '5',
              'worstRating': '1',
            },
            'inLanguage': 'en',
            'url': 'https://www.g2.com/products/roxybrowser/reviews',
          },
          {
            '@type': 'Review',
            'author': {
              '@type': 'Person',
              'name': 'Thomas Jones',
            },
            'reviewBody': 'This fingerprint browser allows me to manage multiple social media accounts with just a laptop, which really helps in streamlining my community management. The interface is super user-friendly and convenient to operate.',
            'reviewRating': {
              '@type': 'Rating',
              'ratingValue': '4.5',
              'bestRating': '5',
              'worstRating': '1',
            },
            'inLanguage': 'en',
            'url': 'https://www.trustpilot.com/review/roxybrowser.com',
          },
        ],
      },
    ],
  }
}

// 国内站
function getLdChinaJson() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://roxybrowser.cn/#website',
        'name': cnBrandName,
        'alternateName': ['RoxyBrowser', 'RoxyBrowser指纹浏览器', 'Roxy指纹浏览器', 'Roxy AI 浏览器'],
        'url': 'https://roxybrowser.cn',
        'publisher': {
          '@id': 'https://roxybrowser.cn/#organization',
        },
        'image': {
          '@type': 'ImageObject',
          'contentUrl': 'https://roxybrowser.cn/logo.svg',
          'url': 'https://roxybrowser.cn/logo.svg',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://roxybrowser.cn/#organization',
        'name': '矩阵智核科技（深圳）有限公司',
        'url': 'https://roxybrowser.cn',
        'logo': 'https://roxybrowser.cn/logo2.svg',
        'image': {
          '@type': 'ImageObject',
          'contentUrl': 'https://roxybrowser.cn/logo.svg',
          'url': 'https://roxybrowser.cn/logo.svg',
        },
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': '深南大道6033号金运世纪大厦19D',
          'addressLocality': '深圳市',
          'postalCode': '518000',
          'addressCountry': 'CN',
        },
        'contactPoint': {
          '@type': 'ContactPoint',
          'telephone': '0755-26407635',
          'contactType': 'customer service',
          'areaServed': 'CN',
          'availableLanguage': [
            'Chinese',
          ],
        },
        'sameAs': [
          'https://www.crunchbase.com/organization/roxybrowser',
          'https://www.g2.com/products/roxybrowser/reviews',
          'https://www.getapp.com/all-software/a/roxybrowser/',
          'https://www.trustpilot.com/review/roxybrowser.cn',
          'https://www.softwareadvice.com/product/526217-RoxyBrowser/',
          'https://huntscreens.com/en/products/roxybrowser',
          'https://crozdesk.com/software/roxybrowser',
          'https://www.producthunt.com/products/roxybrowser',
          'https://roxybrowser.en.uptodown.com/windows/download',
          'https://sourceforge.net/software/product/RoxyBrowser/',
          'https://www.capterra.com/p/10027461/RoxyBrowser/',
          'https://x.com/RoxyBrowser',
          'https://www.youtube.com/@RoxyBrowser',
          'https://tiktok.com/@roxybrowser',
          'https://www.facebook.com/roxybrowser/',
          'https://www.instagram.com/RoxyBrowser/',
          'https://www.scamadviser.com/check-website/roxybrowser.cn',
          'https://www.apivoid.com/tools/website-trust-score/?domain=roxybrowser.cn',
        ],
      },
      {
        '@type': 'Product',
        '@id': 'https://roxybrowser.cn/#product',
        'name': cnBrandName,
        'image': {
          '@type': 'ImageObject',
          'contentUrl': 'https://roxybrowser.cn/logo.svg',
          'url': 'https://roxybrowser.cn/logo.svg',
        },
        'description': '正在寻找解决海外社媒矩阵与跨境电商多账号防封的方案？Roxy浏览器是行业内首家融合AI Agent智能体与最新内核的防检测指纹超级浏览器，底层超200+参数定制的指纹伪装技术，完美解决全平台多开账号的防关联难题，助您安全、高效地批量管理账号，立即下载体验！',
        'brand': {
          '@type': 'Brand',
          'name': cnBrandName,
          'logo': 'https://roxybrowser.cn/logo2.svg',
        },
        'url': 'https://roxybrowser.cn',
        'offers': {
          '@type': 'Offer',
          'price': '0.80',
          'priceCurrency': 'CNY',
          'url': 'https://roxybrowser.cn/pricing',
          'availability': 'https://schema.org/InStock',
          'priceValidUntil': '2030-12-31',
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.7',
          'reviewCount': '45',
          'bestRating': '5',
          'worstRating': '1',
        },
        'review': [
          {
            '@type': 'Review',
            'author': {
              '@type': 'Person',
              'name': 'Delwar Z',
            },
            'reviewBody': '作为一名推广人员，我认为Roxy是一款非常棒的工具,它帮我轻松搞定了多账号管理的流程，以往管理多个账号的繁琐工作，有了Roxy后变得既简单又安全。',
            'reviewRating': {
              '@type': 'Rating',
              'ratingValue': '4.8',
              'bestRating': '5',
              'worstRating': '1',
            },
            'inLanguage': 'zh-CN',
            'url': 'https://www.g2.com/products/roxybrowser/reviews',
          },
          {
            '@type': 'Review',
            'author': {
              '@type': 'Person',
              'name': 'Thomas Jones',
            },
            'reviewBody': '这款指纹浏览器让我只用一台笔记本电脑就能管理多个社媒账号，极大地简化了我的社群运营工作。它的界面非常直观友好，操作起来也特别方便。',
            'reviewRating': {
              '@type': 'Rating',
              'ratingValue': '4.5',
              'bestRating': '5',
              'worstRating': '1',
            },
            'inLanguage': 'en',
            'url': 'https://www.trustpilot.com/review/roxybrowser.com',
          },
        ],
      },
    ],
  }
}

const isChinaSite = process.env.SITE_VARIANT === 'china'
export function useScripts() {
  const scripts = reactive<any[]>([])
  const { public: { ENV } } = useRuntimeConfig()
  const route = useRoute()
  const isDev = ENV === 'development'
  const { locale } = useRxI18n()

  if (!route.path.includes('/blog/')) {
    scripts.push({
      type: 'application/ld+json',
      textContent: JSON.stringify(isChinaSite ? getLdChinaJson() : getLdJson(locale.value), null, 2),
    })
  }

  if (isDev) {
    // 测试环境下使用 ahrefs 做 seo 分析
    scripts.push({
      'src': 'https://analytics.ahrefs.com/analytics.js',
      // 我的 wXLWCudG6spgd7KI+fS04A
      'data-key': 'pWhhdvWZr/fhpDi51co32A',
      'async': true,
    })
  }
  else {
    if (!isChinaSite) {
      scripts.push({
        'type': 'text/plain',
        'data-category': 'analytics',
        'textContent': `
          (function(m,e,t,r,i,k,a){
              m\[i\]=m\[i\]||function(){(m\[i\].a=m\[i\].a||\[\]).push(arguments)};
              m\[i\].l=1\*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts\[j\].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)\[0\],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
          })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=105906815', 'ym');
          ym(105906815, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});
        `,
      })
      scripts.push({
        'type': 'text/plain',
        'data-category': 'analytics',
        'textContent': `
          (function(c,l,a,r,i,t,y){ c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)}; t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i; y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y); })(window, document, "clarity", "script", "sk7g3nawyf");
        `,
      })
      scripts.push({
        'type': 'text/plain',
        'data-category': 'analytics',
        'src': 'https://www.googletagmanager.com/gtag/js?id=G-7D8MGG4CHF',
        'async': true,
      })
      scripts.push({
        'type': 'text/plain',
        'data-category': 'analytics',
        'textContent': `
        window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-7D8MGG4CHF');
        `,
      })
    }
    else {
      // 国内gtag
      scripts.push({
        'type': 'text/javascript',
        'data-category': 'analytics',
        'async': true,
        'src': 'https://www.googletagmanager.com/gtag/js?id=G-8WB93ZK2SQ',
      })
      scripts.push({
        'type': 'text/javascript',
        'data-category': 'analytics',
        'textContent': `
          window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);} gtag('js', new Date());  gtag('config', 'G-8WB93ZK2SQ');
        `,
      })

      scripts.push({
        'type': 'text/javascript',
        'data-category': 'analytics',
        'textContent': `
          var _hmt = _hmt || [];
          (function() {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?685a894827a9e0f2679e9c8b2a8d5459";
            var s = document.getElementsByTagName("script")[0]; 
            s.parentNode.insertBefore(hm, s);
          })();
        `,
      })
    }
  }

  return scripts
}
