export const useText = () => {
  const { $t } = useRxI18n();
  const route = useRoute();
  const type = route.params.type;

  function mergeStyle(list1, list2) {
    return list1.map((item, index) => {
      return {
        ...item,
        ...list2[index]
      }
    })
  }

  return computed(() => {
    const exploreStyle = [
      {
        titleColor: '#111213',
        descColor: '#34393D',
        label: 'Placeholder',
        labelType: 'primary',
      },
      {
        titleColor: '#111213',
        descColor: '#34393D',
        label: 'Placeholder',
        labelType: 'outlined',
        wrapClass: "bg-white",
      },
      {
        label: 'Improve Efficiency',
        labelType: 'white',
        wrapClass: 'bg-[linear-gradient(261deg,_#373749_13.82%,_#2C2C3F_86.18%)] text-white',
      },
      {
        titleColor: '#111213',
        descColor: '#34393D',
        labelType: 'outlined',
        wrapClass: "bg-white",
      }
    ]

    switch (type) {
      case 'privacy-defense':
        return {
          primaryColor: '#11A3FD',
          title: $t('RoxyBrowser - 隐私防护解决方案'),
          label: 'For Privacy Defense',
          desc: $t('在隐私防护中，RoxyBrowser 通过先进的指纹技术，保护你的在线活动不被追踪，防止数据泄露，适用于个人用户、企业团队和隐私敏感场景。无论是日常浏览还是敏感操作，RoxyBrowser 都能为你提供无与伦比的隐私保障。'),
          exploreTitle: $t('打造坚不可摧的隐私防线'),
          exploreList: mergeStyle([
            {
              title: $t('扩展隐私防护能力'),
              desc: $t('通过先进的指纹微调技术，RoxyBrowser 为每个配置文件生成独特的数字身份，防止网站通过时区、字体或屏幕分辨率等特征追踪你，彻底切断隐私泄露的源头。'),
              image: 'solutions/privacy-defense/1'
            }
            ,
            {
              title: $t('隔离敏感操作'),
              desc: $t('RoxyBrowser 为每个账号创建独立的运行环境，确保敏感操作（如金融交易或数据传输）不被关联，保护你的隐私免受恶意追踪和数据窃取。'),
              image: 'solutions/privacy-defense/2'
            }
            ,
            {
              title: $t('屏蔽追踪器威胁'),
              desc: $t('RoxyBrowser 能够屏蔽多种追踪器，包括广告追踪、行为分析和第三方脚本，防止你的浏览习惯被记录，确保在线活动不留痕迹。'),
              image: 'solutions/privacy-defense/3'
            }
            ,
            {
              title: $t('深度匿名浏览'),
              desc: $t('RoxyBrowser 支持深度匿名浏览，结合代理面板和反追踪技术，隐藏你的真实IP地址和地理位置，让你在网络世界中自由穿梭，安全无忧。'),
              image: 'solutions/privacy-defense/4'
            }
          ], exploreStyle)
        };
      case 'social-networks':
        return {
          primaryColor: '#73BB81',
          title: $t('RoxyBrowser - 社交媒体解决方案'),
          label: 'For Social Media',
          desc: $t('社交媒体营销是一种通过在线社区、博客、百科等平台推广品牌的方式，它鼓励用户参与内容发布，以提高品牌知名度、触达新用户，从而增加产品销量。然而，运营大量社交媒体账号也存在一些风险。'),
          exploreTitle: $t('社媒营销应用与风险管理'),
          exploreList: mergeStyle(
            [
              {
                title: $t('账号铺量和曝光增加'),
                desc: $t('使用 RoxyBrowser，可以创建多个窗口，每个窗口指纹代表一个独立的身份。这样可以在社交媒体平台上运营多个账号，为推广的商品或服务铺量，增加产品或服务的曝光机会。'),
                image: 'solutions/social-networks/1'
            }
            ,
            {
              title: $t('自动化运营'),
              desc: $t('利用 RoxyBrowser的 RPA 自动化功能，可以解决重复性工作，如自动发布内容、自动回复用户等。通过预设任务和脚本，可以让账号运营事半功倍，提高运营效率。'),
              image: 'solutions/social-networks/2'
            }
            ,
            {
              title: $t('提升转化可能性'),
              desc: $t('通过 RoxyBrowser 进行多账号运营，可以获得更多的曝光机会，增加与潜在客户的接触频率。这大大提高了转化的概率，从而带来更多的商业效益。'),
              image: 'solutions/social-networks/3'
            }
            ,
            {
              title: $t('保护账号安全'),
              desc: $t('RoxyBrowser 提供了安全独立的环境，降低了账号被平台限制或遭受黑客批量攻击的风险，让您的账号稳定运营。'),
              image: 'solutions/social-networks/4'
            }
          ], exploreStyle)
        };
      case 'affiliate-market':
        return {
          primaryColor: '#EBA93F',
          title: $t('RoxyBrowser - 联盟营销解决方案'),
          label: 'For Affiliate Marketing',
          desc: $t('在联盟营销中，通过在博客、社媒等平台上推广产品或服务，推广者能够通过其推广链接获取佣金。由于联盟营销所需的投入较少，并且可选择的产品和服务种类繁多，因此理论上有较大的获利空间。'),
          exploreTitle: $t('打造联盟营销新高度'),
          exploreList: mergeStyle([
            {
              title: $t('扩展推广影响力'),
              desc: $t('通过构建账号矩阵，扩大推广范围，从而触及更广泛的潜在用户群，提升推广的影响力和曝光度。'),
              image: 'solutions/affiliate-market/1'
            }
            ,
            {
              title: $t('巩固品牌地位'),
              desc: $t('利用多个账号细分不同市场，增强品牌的权威性和专业性。这一策略有助于提升目标受众对品牌的信任，进而提高转化率。'),
              image: 'solutions/affiliate-market/2'
            }
            ,
            {
              title: $t('获取更多流量'),
              desc: $t('通过多个渠道运营多个账号，吸引更多流量，提高潜在客户的曝光率和转化率。这有助于增强推广效果，提高佣金收益。'),
              image: 'solutions/affiliate-market/3'
            }
            ,
            {
              title: $t('快速规模扩张'),
              desc: $t('在不增加基础投入的情况下，通过联盟营销迅速扩大规模。成本控制的同时实现更大规模的营销活动，进一步提升收益。'),
              image: 'solutions/affiliate-market/4'
            }
          ], exploreStyle)
        };
      case 'web-scraping':
        return {
          primaryColor: '#AA86F8',
          title: $t('RoxyBrowser - 数据采集解决方案'),
          label: 'For Web Scraping',
          desc: $t('在数据采集领域，RoxyBrowser 通过先进的指纹技术和高效性能，助力用户从多个平台快速获取数据，适用于市场研究、竞品分析和自动化采集场景。无论是小型团队还是大型企业，RoxyBrowser 都能为你提供安全高效的采集支持。'),
          exploreTitle: $t('高效采集，安全无忧'),
          exploreList: mergeStyle([
            {
              title: $t('扩展数据采集能力'),
              desc: $t('RoxyBrowser 利用先进的指纹技术，为每个采集任务生成独特的数字身份，绕过网站的反爬机制，确保数据采集过程稳定高效，不被封禁。'),
              image: 'solutions/web-scraping/1'
            }
            ,
            {
              title: $t('隔离采集任务'),
              desc: $t('RoxyBrowser 为每个采集任务创建独立的运行环境，避免任务间干扰，确保多线程采集的高效性，同时保护你的真实身份不被暴露。'),
              image: 'solutions/web-scraping/2'
            }
            ,
            {
              title: $t('屏蔽反爬限制'),
              desc: $t('RoxyBrowser 能够屏蔽常见的反爬机制，如 IP 限制和行为检测，结合代理面板，让你轻松获取目标数据。'),
              image: 'solutions/web-scraping/3'
            }
            ,
            {
              title: $t('深度自动化采集'),
              desc: $t('RoxyBrowser 支持 API 流程，结合自动化脚本，实现深度数据采集，无论是结构化数据还是动态内容，都能快速抓取，节省时间。'),
              image: 'solutions/web-scraping/4'
            }
          ], exploreStyle)
        };
      case 'e-commerce':
        return {
          primaryColor: '#11A3FD',
          title: $t('RoxyBrowser - 电商平台解决方案'),
          label: 'For E-commerce Platform',
          desc: $t('在跨境电商领域，成功的关键之一是能够安全且高效地管理多个店铺账户。RoxyBrowser 采用了创新策略，有效规避了像 Amazon、eBay、Etsy 等平台的高级账户识别机制，降低了账户被关联识别并封禁的风险。'),
          exploreTitle: $t('全面电商账号管理与安全策略'),
          exploreList: mergeStyle([
            {
              title: $t('创建隔离浏览器环境'),
              desc: $t('RoxyBrowser 允许用户针对每个店铺账号创建独立的测览器环境，通过模拟不同的地理位置、操作系统、浏览器类型等参数，显著降低账户间关联被识别的风险。'),
              image: 'solutions/e-commerce/1'
            }
            ,
            {
              title: $t('多账号管理'),
              desc: $t('使用 RoxyBrowser 管理多个店铺，扩展业务影响力，同时保障账户安全，避免关联性问题。为每个品牌设置独立店铺，并通过 RoxyBrowser进行管理，既保持了品牌的独立性，又确保了账户的安全。'),
              image: 'solutions/e-commerce/2'
            }
            ,
            {
              title: $t('自动化工作流程'),
              desc: $t('RoxyBrowser 支持自动化执行重复性任务，如产品浏览、搜索加购等操作。'),
              image: 'solutions/e-commerce/3'
            }
            ,
            {
              title: $t('账号共享与团队合作'),
              desc: $t('无论团队成员身处何地，RoxyBrowser 都能使他们在相同的浏览器环境下使用，提高了团队协作效率。'),
              image: 'solutions/e-commerce/4'
            }
          ], exploreStyle)
        };
      case 'crypto-gains':
        return {
          primaryColor: '#73BB81',
          title: $t('RoxyBrowser - 加密货币解决方案'),
          label: 'For Cryptocurrency',
          desc: $t('空投和赏金是加密货币领域常见的推广方式，在 IDO 抽签中，您可以使用多个账户增加被列入白名单的机会。但加密网站的检测方法与时俱进，即使账户合规也可能被限制，不过 RoxyBrowser 解决了这个问题。'),
          exploreTitle: $t('轻松赚取赏金和空投'),
          exploreList: mergeStyle([
            {
              title: $t('高匿指纹参数'),
              desc: $t('RoxyBrowser 通过修改数字指纹信息，为用户提供了一种高匿名访问的方式。这种匿名性对于保护用户加密货币交易、参与空投、申请白名单等活动时的隐私至关重要。'),
              image: 'solutions/crypto-gains/1'
            }
            ,
            {
              title: $t('自动化流程'),
              desc: $t('RoxyBrowser 的自动化工具可以配置自动申请参加空投、签到赚取赏金或参与加密社区活动等，这不仅提高了效率，还避免了因重复使用相同身份信息而被识别的风险。对于需要通过 KYC 验证的活动，可以杜绝数据泄露。'),
              image: 'solutions/crypto-gains/2'
            }
            ,
            {
              title: $t('推广加密货币项目'),
              desc: $t('对于加密货币项目的创始人或推广者，通过 RoxyBrowser 参与社区讨论、发布项目信息、参与网络营销活动等，可以在不暴露个人身份的情况下，扩大项目的影响力和认知度。'),
              image: 'solutions/crypto-gains/3'
            }
            ,
            {
              title: $t('身份保护'),
              desc: $t('在执行多账户策略、参与市场活动或推广项目时，使用 RoxyBrowser 可以有效防止个人信息泄露，不仅有助于维护投资者的隐私权，还能增强其在市场中的安全感和信心。'),
              image: 'solutions/crypto-gains/4'
            }
          ], exploreStyle)
        };
      case 'traffic-trade':
        return {
          primaryColor: '#EBA93F',
          title: $t('RoxyBrowser - 流量获利解决方案'),
          label: 'For Traffic Trade',
          desc: $t('在流量获利领域，RoxyBrowser 通过先进的指纹技术和稳定性能，助力用户在多平台实现流量变现，适用于广告投放、联盟营销和流量交易场景。无论是个人创业者还是企业团队，RoxyBrowser 都能为你提供高效的流量获利支持。'),
          exploreTitle: $t('释放流量价值，高效变现'),
          exploreList: mergeStyle([
            {
              title: $t('扩展流量获利能力'),
              desc: $t('RoxyBrowser 利用先进的指纹技术，为每个账号生成独特的数字身份，绕过平台的流量限制，确保广告投放和流量操作稳定运行，不被封禁。'),
              image: 'solutions/traffic-trade/1'
            }
            ,
            {
              title: $t('隔离流量操作'),
              desc: $t('RoxyBrowser 为每个流量任务创建独立的运行环境，避免账号关联，确保多账号操作的高效性，同时保护你的真实身份不被暴露。'),
              image: 'solutions/traffic-trade/2'
            }
            ,
            {
              title: $t('屏蔽平台限制'),
              desc: $t('RoxyBrowser 能够屏蔽平台的流量限制和行为检测，结合代理面板，隐藏你的操作痕迹，让你在广告投放和流量交易中自由运作。'),
              image: 'solutions/traffic-trade/3'
            }
            ,
            {
              title: $t('深度自动化获利'),
              desc: $t('RoxyBrowser 支持 API 流程，结合自动化脚本，实现流量操作的深度自动化，无论是批量投放广告还是管理联盟链接，都能高效完成。'),
              image: 'solutions/traffic-trade/4'
            }
          ], exploreStyle)
        };
      case 'ad-strategy':
        return {
          primaryColor: '#AA86F8',
          title: $t('RoxyBrowser - 广告投放解决方案'),
          label: 'For Advertising Placement',
          desc: $t('通过建立账号矩阵来优化投放策略是一种被广泛采用的方法，但同时也提高了账号风险，广告主易陷入账号封禁、投放效果下降等问题中，RoxyBrowser 完美解决了这一点。'),
          exploreTitle: $t('RoxyBrowser 如何助力广告投放'),
          exploreList: mergeStyle([
            {
              title: $t('精准定位'),
              desc: $t('在广告投放中，通过运营账号矩阵能够实现多次展示，有助于建立品牌的影响力和信任度，从而吸引更多的目标受众。'),
              image: 'solutions/ad-strategy/1'
            }
            ,
            {
              title: $t('提升曝光'),
              desc: $t('通过利用多个账号进行广告竞价，广告主可以增加竞争力，提高获得优质广告位的机会，从而增加广告曝光和点击率。'),
              image: 'solutions/ad-strategy/2'
            }
            ,
            {
              title: $t('实时调整'),
              desc: $t('在广告投放前，通过 RoxyBrowser 模拟不同用户的广告观看情况，广告主能够更好地评估广告定向效益，提高广告的精准度和回报率。'),
              image: 'solutions/ad-strategy/3'
            }
            ,
            {
              title: $t('智能分析'),
              desc: $t('通过调查竞争对手在地理位置和目标人群上的广告投放差异，广告主可以了解其市场布局，及时调整自己的投放策略，找到更有效的广告定位和目标受众，提升竞争力和市场份额。'),
              image: 'solutions/ad-strategy/4'
            }
          ], exploreStyle)
        }
    }
  });
};
