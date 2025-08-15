

export const useGDPR = () => {
  const accept = () => {
    // google 分析用户行为 
    // const google = document.createElement('script')
    // google.src = 'https://www.googletagmanager.com/gtag/js?id=G-7D8MGG4CHF'
    // google.async = true
    // google.onload = () => {
    //   window.dataLayer = window.dataLayer || []; 
    //   function gtag(){dataLayer.push(arguments);} 
    //   gtag('js', new Date()); 
    //   gtag('config', 'G-7D8MGG4CHF');
    //   window.gtag = gtag;
    // }
    // document.body.appendChild(google);

    // ahrefs 分析用户量
    // const ahrefs = document.createElement('script')
    // ahrefs.src = 'https://analytics.ahrefs.com/analytics.js'
    // ahrefs.async = true
    // ahrefs.setAttribute('data-key', 'QYmnMtFWzDAGlkP8hAbbDw')
    // document.body.appendChild(ahrefs);
  }

  return accept
}

