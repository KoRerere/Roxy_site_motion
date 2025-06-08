export const useScripts = () => {
  const scripts = reactive<any[]>([]);
  const { public: { ENV } } = useRuntimeConfig()
  const isDev = ENV == 'development';

  // scripts.push({
  //   id: 'livechat-script',
  //   textContent: `
  //     window.__lc = window.__lc || {};
  //     window.__lc.license = 18087441;
  //     window.__lc.integration_name = "manual_channels";
  //     window.__lc.product_name = "livechat";
  //     ;(function(n, t, c) {
  //         function i(n) {
  //             return e._h ? e._h.apply(null, n) : e._q.push(n)
  //         }
  //         var e = {
  //             _q: [],
  //             _h: null,
  //             _v: "2.0",
  //             on: function() {
  //                 i(["on", c.call(arguments)])
  //             },
  //             once: function() {
  //                 i(["once", c.call(arguments)])
  //             },
  //             off: function() {
  //                 i(["off", c.call(arguments)])
  //             },
  //             get: function() {
  //                 if (!e._h)
  //                     throw new Error("[LiveChatWidget] You can't use getters before load.");
  //                 return i(["get", c.call(arguments)])
  //             },
  //             call: function() {
  //                 i(["call", c.call(arguments)])
  //             },
  //             init: function() {
  //                 const currentScript = document.getElementById('livechat-script');
  //                 console.log(currentScript)
  //                 var n = t.createElement("script");
  //                 n.type = "text/javascript",
  //                 n.src = "https://cdn.livechatinc.com/tracking.js",
  //                 t.head.appendChild(n)
  //             }
  //         };
  //         !n.__lc.asyncInit && e.init(),
  //         n.LiveChatWidget = n.LiveChatWidget || e
  //     }(window, document, [].slice))
  //     var random2 = Math.round(Math.random() * 100000000);
  //     LiveChatWidget.call("set_session_variables", {
  //         username: "[roxy]-游客",
  //         Account_ID: random2
  //     });
  //     LiveChatWidget.call("set_customer_name", "[roxy]-游客");
  //   `
  // })

  if (isDev) {
    // 测试环境下使用 ahrefs 做 seo 分析
    scripts.push({
      src: 'https://analytics.ahrefs.com/analytics.js',
      // 我的 wXLWCudG6spgd7KI+fS04A
      'data-key': 'pWhhdvWZr/fhpDi51co32A',
      async: true
    })
  } 

  return scripts
}
