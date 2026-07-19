export interface CommunityItem {
  name: string
  post: string
  link: string
  avatar: string
  body: string
}

const G2_COMMUNITY: readonly CommunityItem[] = [
  {
    name: 'Kent M.',
    post: '解决方案架构师',
    link: 'https://www.g2.com/products/roxybrowser/reviews/roxybrowser-review-12463716',
    avatar: '/home/community/g2-avatar/01.png',
    body:
      '在管理不同的资料和账号方面表现不错。经过初期的少量配置和一段时间的日常使用后，它就能顺利融入我的工作流，帮助我整体上更有条理。'
      + '它让我能在一个地方更实际地管理多个资料。最大的收益在于保持条理、减少了一部分重复的人工操作。',
  },
  {
    name: 'Luca P.',
    post: 'DEQUA Studio 首席运营官（曾任营销科技领域 CTO）',
    link: 'https://www.g2.com/products/roxybrowser/reviews/roxybrowser-review-11707530',
    avatar: '/home/community/g2-avatar/02.webp',
    body: `Roxy浏览器把"资料隔离"当作一等概念来设计。每个身份都从模板出发，并可以基于真实的参数信号（User Agent、语言、时区、WebRTC、Canvas、WebGL、音频等）进行细致调整，既能在大规模下保持配置一致，又能在关键点上做精准控制。
团队协作也很顺手：工作区按项目隔离数据，基于角色的共享让邀请成员、给到合适的资料权限变得很轻松，不会出现误触式的交叉访问。打开多个资料时，窗口同步功能省下大量重复动作，让 QA 执行、商品目录更新这类常见流程更快速、跨会话更一致。
面向自动化的 API 也是一大亮点。团队可以脚本化地完成整个资料生命周期，把浏览器接入调度器或测试执行器，非常适合从手工操作过渡到可复用的流水线。
上手门槛不高：永久免费套餐加上限时试用，足以在正式部署前完成充分评估。
安全与隐私显然是设计重点，而基于 Chromium 的底层也保证了对现代站点及团队日常依赖的扩展的良好兼容。`,
  },
  {
    name: 'Yamilis I.',
    post: '社交媒体专员',
    link: 'https://www.g2.com/products/roxybrowser/reviews/roxybrowser-review-11679641',
    avatar: '/home/community/g2-avatar/03.jpg',
    body:
      'Roxy浏览器让我们能在一台电脑上安全地管理多个游戏社区账号，不必频繁切换浏览器和设备。它在隔离浏览器指纹方面做得非常出色，我们几乎不再遇到"关联封号"的情况。'
      + '没有令人厌烦的点，甚至没有弹窗广告，页面干净清爽。'
      + '作为游戏运营，在使用 Roxy 之前最大的困扰是在各个平台之间来回切换账号。用上 Roxy 之后，我们可以安全地运营各平台账号，也就能放心地拓展业务。',
  },
  {
    name: 'Dileep M.',
    post: '产品经理',
    link: 'https://www.g2.com/products/roxybrowser/reviews/roxybrowser-review-11057050',
    avatar: '/home/community/g2-avatar/04.jpg',
    body:
      'Roxy浏览器新上线的"资料迁移"功能非常实用，可以直接把资料转移到新的环境中，省下大量重复操作。'
      + '与其他指纹浏览器相比，Roxy浏览器推出时间还不长，但它比大多数指纹浏览器更具创新力。'
      + 'Roxy 的客服团队是真的把真实用户体验放在第一位。有一次我反馈说备注显示功能不够方便——要把鼠标悬停两秒才看得到备注。让我惊讶的是，下一次更新中，Roxy 团队真的按我的建议进行了调整！他们改成了无延迟的即时显示，甚至让备注能够自动展开。对于我这种每天管理大量窗口的用户来说，这项改进简直是救星，查看窗口备注时省下大量时间。',
  },
  {
    name: 'Cat P.',
    post: '市场部负责人',
    link: 'https://www.g2.com/products/roxybrowser/reviews/roxybrowser-review-11026181',
    avatar: '/home/community/g2-avatar/05.jpg',
    body:
      '几个月来我一直用 Roxy 来管理我的 Facebook 账号。从免费版用到正式版，页面规划和整洁度都有了明显提升，但我更看重的是多账号管理中的安全与隐私。即便它的免费程度比以前低了一些，它仍然帮我节省了约 40% 的 Facebook 营销成本。$8/月的价格，就解决了我的账号营销管理问题。'
      + '它帮我降低了账号运营成本，内置的行业先进内核也让我访问网页更快更安全。',
  },
  {
    name: 'Keri J.',
    post: '设计与创意营销',
    link: 'https://www.g2.com/products/roxybrowser/reviews/roxybrowser-review-10919730',
    avatar: '/home/community/g2-avatar/06.jpg',
    body:
      '它的界面相对简洁，软件引擎优化得不错，还支持多种扩展插件（比如广告拦截工具等），能满足我在电商营销方面的需求，让我在推广商品时更有把握。我几乎每天都在用它。'
      + '它满足了我的电商运营与营销需求。需要给店铺拉人气时，我可以用它跑精准广告投放；在同时管理多个账号时，它能避免因关联风险导致的封号。它还能保护我的保密操作（例如竞品研究和价格监控），让我突破传统电商运营的限制。',
  },
  {
    name: 'Delwar Z.',
    post: '客户支持专员',
    link: 'https://www.g2.com/products/roxybrowser/reviews/roxybrowser-review-10994282',
    avatar: '/home/community/g2-avatar/07.jpg',
    body:
      '作为产品推广者，我觉得 Roxy 是一款非常好用的工具，能帮我处理账号管理的整个流程。过去多账号管理的麻烦事，在 Roxy 的帮助下变得轻松又安全。'
      + '在正式版发布前，我曾担心过 Roxy 的价格，但最终的定价并没有超出我的预期。没别的好说——Roxy 就是最好的指纹浏览器。'
      + '价格实惠、品质出色、功能完善。我主要用它来应对重复繁琐的多账号管理，它是我工作中最得力的助手。',
  },
  {
    name: 'Sainudheen G.',
    post: '产品销售',
    link: 'https://www.g2.com/products/roxybrowser/reviews/roxybrowser-review-10982333',
    avatar: '/home/community/g2-avatar/08.png',
    body:
      'Roxy 是一款安全可靠的浏览器，支持 Closet Tools、Simple Posher 等扩展插件。当我登录并使用窗口时，它会帮我修改独特的指纹，帮助我隐藏并保护账号。'
      + '一键配置随机指纹的功能让我不必亲自处理这些细节。点一下"一键配置"，Roxy 就能为我生成独一无二的指纹，让那些烦人的追踪站点找不到我。',
  },
  {
    name: 'Sondra H.',
    post: '市场经理',
    link: 'https://www.g2.com/products/roxybrowser/reviews/roxybrowser-review-11000436',
    avatar: '/home/community/g2-avatar/09.png',
    body:
      'Roxy 是我用过最好的多账号管理软件。响应迅速、延迟低，价格也很合理。我选择它，是为了在同时管理大量账号的情况下不被封号。'
      + 'Roxy 的团队支持非常快速；先进的指纹伪装技术让我安全地通过各种检测；窗口同步功能则让我能同时管理多个账号，为我节省了大量管理多账号的时间。',
  },
  {
    name: 'Kellynda O.',
    post: '产品销售经理',
    link: 'https://www.g2.com/products/roxybrowser/reviews/roxybrowser-review-11033780',
    avatar: '/home/community/g2-avatar/10.jpg',
    body:
      '我认为 Roxy浏览器是一款很有创新性的指纹浏览器，相比同等品质的产品要便宜许多。借助 Roxy 我可以隔离账号环境，大幅提升我的销售与营销效果。'
      + '没什么可挑剔的。我选 Roxy 的原因就是它的品质不逊于市面上流行的指纹浏览器，但价格要便宜得多。'
      + '软件内置的在线支持响应速度很快，使用过程中提出的问题都能得到解答。',
  },
  {
    name: 'Nowee K.',
    post: '销售经理',
    link: 'https://www.g2.com/products/roxybrowser/reviews/roxybrowser-review-10952691',
    avatar: '/home/community/g2-avatar/11.png',
    body:
      `Roxy 的团队响应很快，问题都能得到及时回复；我只需要一台设备加上 Roxy，就能注册并管理很多账号，而且不容易被封号——当我需要在不同网站上管理多个账号时尤其如此。`
      + '有了 Roxy，我可以为每个窗口创建独立的指纹环境，并在软件内轻松管理它们。',
  },
  {
    name: 'Basri B.',
    post: '人工智能开发工程师',
    link: 'https://www.g2.com/products/roxybrowser/reviews/roxybrowser-review-10973327',
    avatar: '/home/community/g2-avatar/12.png',
    body:
      'Roxy 改变了我管理社区账号的方式。多账号无缝衔接，让我可以同时推进不同的项目。整体体验非常出色，遇到疑问时 Roxy 团队总是最先出来帮我解决。'
      + '它用最简单的方式帮我处理繁琐的工作，把原本对我而言困难的任务变得轻松。',
  },
  {
    name: 'Eddi C.',
    post: '内容经理',
    link: 'https://www.g2.com/products/roxybrowser/reviews/roxybrowser-review-10953121',
    avatar: '/home/community/g2-avatar/13.png',
    body:
      '我特别喜欢 Roxy 的日志面板——一眼就能看到我做过什么，而且一目了然。使用起来很简单；如果多个人共用一个工作区，日志还会标明操作人的身份，这对于责任追溯和权限管理非常方便。'
      + '当我要管理众多账号时，不用再一个一个地记密码——它们都可以直接保存在平台账号内。',
  },
  {
    name: 'Rooft V.',
    post: '战略财务分析师',
    link: 'https://www.g2.com/products/roxybrowser/reviews/roxybrowser-review-10965335',
    avatar: '/home/community/g2-avatar/14.jpg',
    body:
      '我用过好几款反检测浏览器，但使用体验最好的就是 Roxy。它的响应速度和稳定性对我的业务至关重要，而且 Roxy 的客服团队回应问题的速度非常快。'
      + '没有什么可挑剔的，这是一款值得信赖的隐私浏览器。'
      + 'Roxy 帮我管理不同的企业账号并保障它们的安全，因为环境是彼此隔离的——我不必担心企业账号被病毒追踪或被竞争对手识别。',
  },
  {
    name: 'Jn W.',
    post: '软件开发工程师',
    link: 'https://www.g2.com/products/roxybrowser/reviews/roxybrowser-review-10986229',
    avatar: '/home/community/g2-avatar/15.jpg',
    body:
      '这款"任务型"浏览器针对 macOS 做了优化，而这是很多同类产品都没做到的。到目前为止没有遇到兼容性问题，体验很流畅。'
      + '它解决了我的加密难题。之前我得一个一个记录并保存 Instagram 账号的密码；用上 Roxy 之后，它替我完成这件事，也更加安全。',
  },
  {
    name: 'Adrin C.',
    post: '后端软件工程师',
    link: 'https://www.g2.com/products/roxybrowser/reviews/roxybrowser-review-10981972',
    avatar: '/home/community/g2-avatar/16.png',
    body:
      'Roxy 改变了我的工作流。从直观的界面到强大的安全特性，它是管理多账号和多资料的最佳工具。'
      + 'Roxy 给我一种别的指纹浏览器没有的安全感。当我有需要保密的内容时，这种安全感让我可以安心使用浏览器。',
  },
  {
    name: 'Tilman H.',
    post: '客户运营总监',
    link: 'https://www.g2.com/products/roxybrowser/reviews/roxybrowser-review-10986536',
    avatar: '/home/community/g2-avatar/17.png',
    body:
      'Roxy 提供了非常友好的定价方案，无论是个人还是团队都能找到合适的选择。它确实帮我保障了账号安全，大幅降低了账号被封的风险。'
      + '界面简洁而富有辨识度，我找不出可以挑剔的地方。'
      + '软件内置的内核非常稳定，每当我需要更新内核时，Roxy 团队总是第一时间发布更新。',
  },
  {
    name: 'Howlader G.',
    post: '计算机工程师',
    link: 'https://www.g2.com/products/roxybrowser/reviews/roxybrowser-review-10977746',
    avatar: '/home/community/g2-avatar/18.jpg',
    body:
      '这款产品拥有市面上最友好的界面之一，功能强大，选项也很丰富。无论是新手还是有经验的用户，都能轻松上手。'
      + '项目与标签功能不仅让我能轻松整理和归类任务，还极大简化了我的工作流程。',
  },
]

export function getG2Community(): readonly CommunityItem[] {
  return G2_COMMUNITY
}
