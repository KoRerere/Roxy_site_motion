export const useText = (type: string) => {
  const { $t } = useRxI18n();

  const data = computed(() => {
    const commonData = {
      reasonsTitle: $t('为什么选择 RoxyBrowser'),
      reasonsList: [
        {
          title: $t('安全保障'),
          desc: $t('真实浏览器指纹，轻松通过网站检测。'),
          icon: 'feat-profile-template/reasons-1'
        },
        {
          title: $t('流程简化'),
          desc: $t('一机管理多账号，打造极致工作流。'),
          icon: 'feat-profile-template/reasons-2'
        },
        {
          title: $t('高效协同'),
          desc: $t('多窗口同步、API 自动化，提升团队效率。'),
          icon: 'feat-profile-template/reasons-3'
        },
        {
          title: $t('权限分配'),
          desc: $t('权限管理满足多样需求，保护账号数据安全。'),
          icon: 'feat-profile-template/reasons-4'
        },
        {
          title: $t('操作便捷'),
          desc: $t('功能布局直观便捷，操作简单轻松上手。'),
          icon: 'feat-profile-template/reasons-5'  
        },
        {
          title: $t('隐私保护'),
          desc: $t('防止网站追踪行为，保护个人信息安全。'),
          icon: 'feat-profile-template/reasons-6'
        }
      ],
    }
    switch (type) {
      case 'profile-template':
        return {
          title: $t("窗口模板$"),
          desc: $t('一键创建定制化浏览配置文件，确保完美一致性。'),
          coverImage: 'features/profile-template/index',
          primaryColor: '#11A3FD',
          exploreList: [
            {
              title: $t('快捷创建独立窗口'),
              titleColor: '#111213',
              desc: $t('一键批量创建独立浏览器窗口，凭借先进指纹模拟技术，确保每个窗口环境真实可靠。高效管理多账号，严防数据关联，全面守护操作安全，提升跨境电商与社媒营销等生产效率。'),
              descColor: '#34393D',
              label: 'Beach Create ',
              labelType: 'primary',
              image: 'features/profile-template/1'
            },
            {
              title: $t('精准管理多账号'),
              titleColor: '#111213',
              desc: $t('通过批量管理功能，轻松掌控成百上千个账号。实现添加标签、启动、关闭、导出等窗口操作的高效执行，显著减轻管理负担，确保操作一致性与准确性。实时监控各浏览器窗口状态，保障工作流程精准高效。'),
              descColor: '#34393D',
              label: 'Security',
              labelType: 'outlined',
              wrapClass: "bg-white",
              image: 'features/profile-template/2'
            },
            {
              title: $t('灵活窗口分配'),
              desc: $t('根据业务需求创建项目灵活分配窗口，精准设置窗口权限，守护重要数据安全。基于角色的权限管理，也可为指定项目或团队成员安装插件，大幅提升团队协作效率与整体安全性。'),
              label: 'Improve Efficiency',
              labelType: 'white',
              wrapClass: 'bg-[linear-gradient(261deg,_#373749_13.82%,_#2C2C3F_86.18%)] text-white',
              image: 'features/profile-template/3'
            },
            {
              title: $t('全场景高效运营'),
              titleColor: '#111213',
              desc: $t('RoxyBrowser 通过独立窗口环境实现多账号安全隔离，支持匿名浏览与自动化操作，覆盖团队协作、远程办公、跨境电商、社媒营销及账号养成等全业务场景，助力单一设备高效运营，节省大量费用和时间，守护数字身份安全。'),
              descColor: '#34393D',
              label: 'Effortlessly',
              labelType: 'outlined',
              wrapClass: "bg-white",
              image: 'features/profile-template/4'
            }
          ],
          exploreTitle: $t('解锁窗口的强大功能'),
          practicalSkillsTitle: $t('窗口创建的实用技巧'),
          practicalSkillsList: [
            {
              title: $t('窗口模板'),
              desc: $t('可将常用环境参数存为模板，便于快速创建。'),
              icon: 'feat-profile-template/profile-template'
            },
            {
              title: $t('批量导入'),
              desc: $t('可批量导入窗口，支持 Excel 和 txt 格式。'),
              icon: 'feat-profile-template/batch-import'
            },
            {
              title: $t('快捷设置'),
              desc: $t('为每个窗口选择保存的平台账号和代理资源，便于快速配置所需环境。'),
              icon: 'feat-profile-template/quick-setup'
            }
          ],
          fqaList: [
            {
              title: $t('什么是指纹浏览器窗口？'),
              desc: $t('窗口是指在指纹浏览器中创建的独立浏览环境。每个窗口都具有独特的浏览器指纹，这些窗口之间的数据是隔离的，从而避免不同账号之间的关联，保护用户隐私和账号安全。')
            },
            {
              title: $t('如何验证浏览器窗口的指纹？'),
              desc: $t('可通过在线指纹检测工具进行浏览器指纹参数验证，评估指纹特征的唯一性与环境真实性。')
            }
          ],
          ...commonData
        };
      case 'team-space':
        return {
          title: $t("团队空间$"),
          desc: $t('在自由的团队空间中无缝协作，提供便于使用角色权限。'),
          coverImage: 'features/team-space/index',
          primaryColor: '#73BB81',
          exploreTitle: $t('解锁团队协作的强大功能'),
          exploreList: [
            {
              title: $t('定制化工作空间'),
              titleColor: '#111213',
              desc: $t('RoxyBrowser 支持创建多个工作空间，每个工作空间数据与资源完全隔离。邀请成员协作时无需担心复杂权限配置，进而提高多项目管理效率。'),
              descColor: '#34393D',
              label: 'Customized',
              labelType: 'primary',
              image: 'features/team-space/1'
            },
            {
              title: $t('重要数据安全分配'),
              titleColor: '#111213',
              desc: $t('支持联盟营销，社媒运营、跨境电商店铺等多场景协作，灵活邀请成员加入特定项目，根据角色与职责分配权限，有效防止重要数据泄露与丢失。'),
              descColor: '#34393D',
              label: 'Security',
              labelType: 'outlined',
              wrapClass: "bg-white",
              image: 'features/team-space/2'
            },
            {
              title: $t('透明化操作日志'),
              desc: $t('管理员可以实时监控和全面记录团队成员的所有操作，确保工作流程的可控性，快速排除潜在风险，保障账户安全性。'),
              label: 'Operation Record',
              labelType: 'white',
              wrapClass: 'bg-[linear-gradient(261deg,_#373749_13.82%,_#2C2C3F_86.18%)] text-white',
              image: 'features/team-space/3'
            },
            {
              title: $t('团队多项目管理'),
              desc: $t('根据团队管理需求，灵活增加\"工作空间\" 和\"项目\"数量，按需分配已有平台账号、代理信息级拓展。'),
              label: 'Assignment',
              labelType: 'outlined',
              wrapClass: "bg-white",
              image: 'features/team-space/4'
            }
          ],
          practicalSkillsTitle: $t('高效协作的实用技巧'),
          practicalSkillsList: [
            {
              title: $t('一键邀请功能'),
              desc: $t('邀请团队成员时，支持同时分配至多个项目。'),
              icon: 'feat-profile-template/one-click-invitaion'
            },
            {
              title: $t('无限账号添加'),
              desc: $t('添加平台账号时无需担心数量限制。'),
              icon: 'feat-profile-template/unlimited-account-addition'
            },
            {
              title: $t('界面自定义'),
              desc: $t('根据操作习惯和优先级，自定义界面样式。'),
              icon: 'feat-profile-template/customizable-interface'
            }
          ],
          fqaList: [
            {
              title: $t('RoxyBrowser 团队协作的优点在哪里？'),
              desc: $t('RoxyBrowser 的团队协作功能可以通过共享的数据和资源，推进多项目同时进行，避免信息误差，提升整体业务效率。')
            },
            {
              title: $t('如何邀请团队成员加入我的项目？'),
              desc: $t('可以通过项目管理邀请新用户，输入被邀请用户的邮箱，设置用户权限，勾选对应的项目名称，点击发送邀请即可邀请团队成员加入您的项目。')
            },
            {
              title: $t('如何管理我的团队成员？'),
              desc: $t('在团队成员板块，您可以分类查看所有团队成员的状态，邀请和删除团队成员，变更权限和所处项目。')
            }
          ],
          ...commonData
        }
      case 'proxy-panel':
        return {
          title: $t("代理面板$"),
          desc: $t('轻松管理环境所需代理，保持匿名并突破限制。'),
          coverImage: 'features/proxy-panel/index',
          primaryColor: '#EBA93F',
          exploreTitle: $t('解锁代理资源的强大功能'),
          exploreList: [
            {
              title: $t('代理管理与检测'),
              titleColor: '#111213',
              desc: $t('内置多种 IP 查询渠道，支持一键快速检测代理连接状态与可用性。提供自定义排版功能，支持按国家/地区、代理类型、主机等条件筛选代理，轻松实现代理资源的高效管理。'),
              descColor: '#34393D',
              label: 'Customized',
              labelType: 'primary',
              image: 'features/proxy-panel/1'
            },
            {
              title: $t('兼容多种类型代理'),
              titleColor: '#111213',
              desc: $t('RoxyBrowser 支持添加多种代理类型，包括动态代理、静态代理，以及支持 HTTP、HTTPS、SOCKS5 和 SSH 协议，同时兼容 IPv4 和 IPv6 地址，满足多样化的网络需求。'),
              descColor: '#34393D',
              label: 'Security',
              labelType: 'outlined',
              wrapClass: "bg-white",
              image: 'features/proxy-panel/2'
            },
            {
              title: $t('无限存储灵活调用'),
              desc: $t('在 RoxyBrowser 中，添加和存储代理没有任何数量限制，用户可以自由管理并随时调用已保存的代理，确保用户在设置窗口时拥有更大的灵活性和便利性。'),
              label: 'Operation Record',
              labelType: 'white',
              wrapClass: 'bg-[linear-gradient(261deg,_#373749_13.82%,_#2C2C3F_86.18%)] text-white',
              image: 'features/proxy-panel/3'
            },
            {
              title: $t('批量设置高效管理'),
              desc: $t('RoxyBrowser 支持根据团队成员需求灵活分配和绑定代理资源，有效避免代理信息泄露，确保数据安全与隐私保护。同时，RoxyBrowser 支持批量添加代理和自动去重，操作简单便捷，显著提升代理管理效率，满足多样化需求。'),
              label: 'Assignment',
              labelType: 'outlined',
              wrapClass: "bg-white",
              image: 'features/proxy-panel/4'
            }
          ],
          fqaList: [
            {
              title: $t('绑定代理到浏览器窗口后需要注意什么？'),
              desc: $t('绑定代理至窗口后，请勿随意更改代理参数，以免 IP 变动触发账号封禁。对于 IP 稳定性要求高的平台，建议采用“一 IP 一账号”的绑定模式，并优先选择静态住宅代理，以确保账号安全与稳定性。')
            },
            {
              title: $t('代理检测失败怎么办？'),
              desc: $t('若发现代理检测失败时，请检查以下内容：\n1.确认本地网络连接正常；\n2.检查代理信息是否正确填写；\n3.与代理服务商确认提供的代理是否有效。\n确保基础设置无误且IP有效后，再次进行测试。')
            },
            {
              title: $t('静态代理和动态代理的区别是什么？'),
              desc: $t('静态代理使用固定 IP 地址，适合长期稳定的业务需求。动态代理 IP 会定期更换，通常适用于短期、高频的业务需求。')
            }
          ],
          ...commonData
        }
      case 'account-hub':
        return {
          title: $t("账号中心$"),
          desc: $t('在独立空间便捷配置多账号，分配至隔离且真实的环境。'),
          coverImage: 'features/account-hub/index',
          primaryColor: '#AA86F8',
          exploreTitle: $t('解锁多账号管理的强大功能'),
          exploreList: [
            {
              title: $t('无限账号存储'),
              titleColor: '#111213',
              desc: $t('轻松地将各平台上已有的账号添加 RoxyBrowser 中。随时修改或删除账号信息，保持账号列表的最新状态。'),
              descColor: '#34393D',
              label: 'Customized',
              labelType: 'primary',
              image: 'features/account-hub/1'
            },
            {
              title: $t('接收 2FA 验证码'),
              titleColor: '#111213',
              desc: $t('提供安全的 2FA 验证码接收服务，简化用户操作流程，适配社交媒体，电子商务等高安全需求场景。'),
              descColor: '#34393D',
              label: 'Security',
              labelType: 'outlined',
              wrapClass: "bg-white",
              image: 'features/account-hub/2'
            },
            {
              title: $t('支持账号备注'),
              desc: $t('添加账号后进行备注可清晰标识每个账号，减少重复核实，提高管理效率。'),
              label: 'Operation Record',
              labelType: 'white',
              wrapClass: 'bg-[linear-gradient(261deg,_#373749_13.82%,_#2C2C3F_86.18%)] text-white',
              image: 'features/account-hub/3'
            },
            {
              title: $t('账号关联状态'),
              desc: $t('监控账号与相应窗口的关联状态，避免因 IP 切换混乱而导致账号被封禁。'),
              label: 'Assignment',
              labelType: 'outlined',
              wrapClass: "bg-white",
              image: 'features/account-hub/4'
            }
          ],
          practicalSkillsTitle: $t('账号快速导入的实用技巧'),
          practicalSkillsList: [
            {
              title: $t('轻松创建窗口'),
              desc: $t('可直接导入已存储的账号以快速创建窗口。'),
              icon: 'feat-profile-template/effortless-profile-creation'
            },
            {
              title: $t('独立隔离的环境'),
              desc: $t('为每个窗口生成独立的浏览器环境，避免因账号关联而被封号。'),
              icon: 'feat-profile-template/unique-and-realistic-fingerprints'
            },
            {
              title: $t('快速筛选'),
              desc: $t('使用筛选功能，根据导入的账号轻松筛选已有窗口，从而提升管理效率。'),
              icon: 'feat-profile-template/quick-sorting'
            }
          ],
          fqaList: [
            {
              title: $t('我可以用 RoxyBrowser 管理跨境电商店铺吗？'),
              desc: $t('RoxyBrowser 是管理电商平台的理想工具，支持在多个跨境电商平台（如 Amazon、eBay、Etsy、Best Buy、Shopify 和 Wildberry）上进行店铺管理操作。')
            },
            {
              title: $t('我可以在 RoxyBrowser 导入已有窗口吗？'),
              desc: $t('您可以使用 RoxyBrowser 提供的 xlsx 或 txt 模板填写已有窗口信息（如操作系统、系统版本、代理类型、Cookie），并快速导入批量窗口。')
            },
            {
              title: $t('我可以用自动化工具管理多账号吗？'),
              desc: $t('RoxyBrowser 支持与 Selenium 等自动化工具集成，并支持同步器功能，帮助用户更高效地管理多个账号。')
            },
            {
              title: $t('切换设备时我的数据会自动恢复吗？'),
              desc: $t('RoxyBrowser 的云同步功能支持设备切换时数据自动恢复，保障多账号管理安全无忧。')
            },
            {
              title: $t('我可以调整窗口的指纹参数吗？'),
              desc: $t('是的，RoxyBrowser 是一款基于 Chromium 的指纹浏览器，为每个窗口提供超过 160 个可调参数，能够满足各种需求。')
            },
            {
              title: $t('我可以创建和管理多少个窗口？'),
              desc: $t('免费版支持创建 5 个窗口。如果您有更多窗口或功能需求，可前往价格方案页面，了解更多详细信息。')
            }
          ],
          ...commonData
        }
      case 'window-sync':
        return {
          title: $t("窗口同步$"),
          desc: $t('跨多窗口同步操作，优化工作流程。'),
          coverImage: 'features/window-sync/index',
          primaryColor: '#11A3FD',
          exploreTitle: $t('解锁窗口同步器的强大功能'),
          exploreList: [
            {
              title: $t('多窗口高效同步'),
              titleColor: '#111213',
              desc: $t('支持不同浏览器环境的窗口同步操作，如同时操作多个环境，大幅提升工作流程和生产效率。无论是多任务处理还是批量操作，都能轻松应对。'),
              descColor: '#34393D',
              label: 'Customized',
              labelType: 'primary',
              image: 'features/window-sync/1'
            },
            {
              title: $t('极简操作体验'),
              titleColor: '#111213',
              desc: $t('悬浮工作台设计，不遮挡画面，按键逻辑清晰，新手也能快速上手。无需复杂代码，打开同步器即可开始同步操作，体验流程无压力。'),
              descColor: '#34393D',
              label: 'Security',
              labelType: 'outlined',
              wrapClass: "bg-white",
              image: 'features/window-sync/2'
            },
            {
              title: $t('模拟操作自定义'),
              desc: $t('根据需求自定义鼠标点击、文本输入等操作的延迟设置，批量模拟真实用户行为，让多账号操作更自然、更安全。'),
              label: 'Operation Record',
              labelType: 'white',
              wrapClass: 'bg-[linear-gradient(261deg,_#373749_13.82%,_#2C2C3F_86.18%)] text-white',
              image: 'features/window-sync/3'
            },
            {
              title: $t('多场景适用'),
              desc: $t('支持无限窗口数量同步，无论是电商运营、社媒账号管理，都能高效完成任务。'),
              label: 'Assignment',
              labelType: 'outlined',
              wrapClass: "bg-white",
              image: 'features/window-sync/4'
            }
          ],
          practicalSkillsTitle: $t('窗口同步器的实用技巧'),
          practicalSkillsList: [
            {
              title: $t('多种同步操作'),
              desc: $t('支持标签页同步、文本输入预设、随机数字输入等多种同步操作。'),
              icon: 'feat-profile-template/diverse-sync-operations'
            },
            {
              title: $t('自定义快捷键'),
              desc: $t('根据日常习惯定制快捷键，让操作更便捷，无缝融入您的工作流。'),
              icon: 'feat-profile-template/shortcuts-customization'
            },
            {
              title: $t('定制窗口布局'),
              desc: $t('支持按需调整窗口大小、布局方式及主控窗口标签栏颜色，打造专属工作界面。'),
              icon: 'feat-profile-template/flexible-window-layout'
            }
          ],
          fqaList: [
            {
              title: $t('如何判断同时的窗口中，哪一个是主控窗口？'),
              desc: $t('默认情况下，主控窗口展示在显示器左上角，且标签栏为蓝色。')
            },
            {
              title: $t('窗口同步器对窗口数量有限制吗？'),
              desc: $t('使用窗口同步器时，无窗口数量限制，可自由同步多个窗口。请注意，目前仅 Windows 版本客户端支持窗口同步器功能。')
            },
            {
              title: $t('为什么在同步器界面选择多个窗口后不能开始同步？'),
              desc: $t('请确保被选中的窗口包含主控窗口。如果没有，请手动设置一个新的主控窗口。')
            }
          ],
          ...commonData
        }
      case 'api-flow':
        return {
          title: $t("API 流程$"),
          desc: $t('通过强大 API 集成，自动化复杂任务。'),
          coverImage: 'features/api-flow/index',
          primaryColor: '#73BB81',
          exploreTitle: $t('解锁 API 工具的强大功能'),
          exploreList: [
            {
              title: $t('任务流程自动化'),
              titleColor: '#111213',
              desc: $t('用户可通过 API 工具快速配置自动化任务流程，支持脚本或 HTTP 请求调用接口，灵活扩展复杂业务场景。以快速响应与高并发支持能力确保操作高效稳定，精准满足业务需求。'),
              descColor: '#34393D',
              label: 'Customized',
              labelType: 'primary',
              image: 'features/api-flow/1'
            },
            {
              title: $t('兼容多种框架'),
              titleColor: '#111213',
              desc: $t('支持 Selenium、Puppeteer、Playwright 等主流自动化框架，实现浏览器控制与数据抓取的无缝集成，优化自动化工作流，提升工作效率。'),
              descColor: '#34393D',
              label: 'Security',
              labelType: 'outlined',
              wrapClass: "bg-white",
              image: 'features/api-flow/2'
            },
            {
              title: $t('安全实时管控'),
              desc: $t('在怀疑 API 密钥泄露或团队成员变动时，可实时重置 API 密钥，确保数据安全。同时，根据业务需求随时控制 API 接口，灵活掌控业务流程，保障系统稳定运行。'),
              label: 'Operation Record',
              labelType: 'white',
              wrapClass: 'bg-[linear-gradient(261deg,_#373749_13.82%,_#2C2C3F_86.18%)] text-white',
              image: 'features/api-flow/3'
            },
            {
              title: $t('业务需求全覆盖'),
              desc: $t('通过 RoxyBrowser 的 API 工具，用户可轻松集成并实现多账号管理、数据采集、广告投放优化等操作，覆盖数据服务商、跨境电商、广告优化机构等多行业应用场景。'),
              label: 'Assignment',
              labelType: 'outlined',
              wrapClass: "bg-white",
              image: 'features/api-flow/4'
            }
          ],
          fqaList: [
            {
              title: $t('什么是 API 自动化？它有哪些用途？'),
              desc: $t('API 自动化是通过编程调用 API 接口，实现业务流程的自动执行，无需人工干预。用途包括但不限于：自动化数据抓取与同步，批量管理多账号或资源配置，与其他工具集成，构建自动化工作流。')
            },
            {
              title: $t('如何使用 API 获取数据？'),
              desc: $t('基本上是三个步骤：\n1.调用 API 接口并传递必要参数（如认证信息、查询条件）；\n2.解析 API 返回的数据格式（如 JSON、XML）；\n3.将数据存储至数据库或直接用于分析。')
            },
            {
              title: $t('重置 API 密钥会有什么影响？'),
              desc: $t('您可以在您觉得必要时随时重置对应工作空间的 API 密钥，但需要注意，重置 API 密钥后，所有使用旧密钥的请求将被拒绝，并记住同步更换依赖原密钥服务的秘钥。')
            },
            {
              title: $t('为什么我的 API 无法正常工作？'),
              desc: $t('当遇到 API 无法正常工作时，可以检查是否为以下原因：API 密钥过期，请求频率超限，参数格式错误，缺失必填字段，以及对应工作空间的 API 启用状态。')
            },
            {
              title: $t('API 使用中的常见限制与注意事项？'),
              desc: $t('API 请求频率与您的订阅方案有关，可以在订阅界面了解详情。为了您的数据安全，请妥善保管 API 密钥，避免泄露。')
            }
          ],
          ...commonData
        }
      default:
        return {};
    }
  })

  return reactive(data)
}