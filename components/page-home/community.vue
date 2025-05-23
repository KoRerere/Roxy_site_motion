<template>
  <h2 class="text-center text-primary section-title pt-10 md:pt-20">
    {{ $t('社区用户对 RoxyBrowser 的评价') }}
  </h2>

  <div
    class="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg"
  >
    <Marquee v-for="(c, index) in community" :key="index" :reverse="index % 2 === 0">
      <figure
        class="py-6 px-5 border-solid border-1 bg-white border-[rgba(0_0_0_/_0.1)] flex flex-col gap-4 rounded-4 w-340px"
        v-for="item in c"
        :key="item.name"
      >
        <div class="flex flex-row items-center gap-3">
          <img
            :src="item.avatar"
            class="rounded-full"
            width="44"
            height="44"
            alt=""
          />
          <div class="flex flex-col gap-6px">
            <span class="font-[Archivo] font-700">
              {{ item.name }}
            </span>
            <p class="text-14px text-[#575D60]">{{ item.post }}</p>
          </div>
        </div>
        <blockquote 
          class="text-[#34393D] font-400 ellipsis-4 leading-[1.5]"
        >{{ item.body }}</blockquote>
      </figure>
    </Marquee>

    <!-- Left Gradient -->
    <!-- <div
      class="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"
    ></div> -->

    <!-- Right Gradient -->
    <!-- <div
      class="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"
    ></div> -->
  </div>
</template>

<script setup>
import Marquee from './components/Marquee.vue'

const community = computed(() => {
  const __community = [
    {
      "name": "Michael Carter",
      "post": $t("CTO, WEB3 行业"),
      "avatar": "/home/community/avatar01.png",
      "body": $t("我真的很喜欢 RoxyBrowser 的直观设计，用起来完全没有任何麻烦。即使是新手也能很快上手，这真的是一个大加分。它帮助我轻松、高效地管理我的在线业务，让我的工作变得更简单。")
    },
    {
      "name": "James Brown",
      "post": $t("CEO, 电商行业"),
      "avatar": "/home/community/avatar02.png",
      "body": $t("RoxyBrowser彻底改变了我管理在线存在的方式。多个账户的无缝集成使同时处理不同项目变得轻而易举，并且用户体验也是顶尖的。平台的设计简洁明了，各种功能也很容易上手，即使是非技术背景的用户也能轻松使用。")
    },
    {
      "name": "Daniel Smith",
      "post": $t("Product Manager, 社媒运营"),
      "avatar": "/home/community/avatar03.png",
      "body": $t("这个产品有市场上最友好的界面，功能强大，而且提供了很多丰富的选项。无论是初学者还是有经验的用户都能轻松上手。其中的项目和标签功能不仅让我能够轻松组织和分类任务，还大大简化了我的工作流程。")
    },
    {
      "name": "Andrew Johnson",
      "post": $t("Lead Developer, 数据抓取"),
      "avatar": "/home/community/avatar04.png",
      "body": $t("我非常感谢 RoxyBrowser 对用户安全的重视。凭借内置的隐私功能和定期更新，我在浏览网络时，对我的数据安全充满信心。")
    },
    {
      "name": "Robert Davis",
      "post": $t("Marketing Director, 广告行业"),
      "avatar": "/home/community/avatar05.png",
      "body": $t("我们使用 RoxyBrowser 进行社交媒体管理，并向所有客户推荐它，因为个人资料的转移非常方便、可靠和安全。RoxyBrowser 不仅支持多个社交平台的无缝集成，还能轻松处理跨平台的数据同步。其强大的加密技术确保了数据在传输过程中的安全性")
    },
    {
      "name": "William Taylor",
      "post": $t("Software Engineer, 电商行业"),
      "avatar": "/home/community/avatar06.png",
      "body": $t("RoxyBrowser 的自定义选项非常出色。我可以针对具体需求，精细调整每个配置文件的设置，这种灵活性极大地提高了我的工作效率。无论是管理不同的任务，还是优化个人的浏览体验，RoxyBrowser 都能提供强大的支持，使我的工作流程变得更加顺畅和高效。")
    },
    {
      "name": "Emma Thompson",
      "post": $t("UX Designer, 社媒运营"),
      "avatar": "/home/community/avatar07.png",
      "body": $t("RoxyBrowser 的客户支持非常出色；每次我遇到问题时，都能得到及时的帮助。这不仅增强了我对产品的信任，也让我更愿意向他人推荐它。RoxyBrowser 团队的专业素养和响应速度总是让我印象深刻，无论是通过电子邮件、电话还是在线聊天，他们都能迅速解决我的问题")
    },
    {
      "name": "Sophia Wilson",
      "post": $t("Content Strategist, 广告"),
      "avatar": "/home/community/avatar08.png",
      "body": $t("我试过各种反检测浏览器，但 RoxyBrowser 脱颖而出，因为它的速度和可靠性对我的业务至关重要。")
    },
    {
      "name": "Sarah Lee",
      "post": $t("Digital Marketer，广告行业"),
      "avatar": "/home/community/avatar09.png",
      "body": $t("支持团队非常出色！他们响应迅速，为各种问题提供清晰的解决方案。无论是技术故障还是简单咨询，他们的帮助总是顶级的。")
    },
    {
      "name": "Michael Brown",
      "post": $t("Web Developer，数字营销行业"),
      "avatar": "/home/community/avatar10.png",
      "body": $t("窗口同步器是一个改变游戏规则的功能。它让我能够轻松管理多个配置文件，节省了我数小时的手动工作。跨配置文件同步无缝且高效。")
    },
    {
      "name": "Emma Thompson",
      "post": $t("UX Designer，社交媒体行业"),
      "avatar": "/home/community/avatar11.png",
      "body": $t("API 集成非常强大。它允许我们自动化复杂任务，并与其他工具无缝集成。")
    },
    {
      "name": "John Carter",
      "post": $t("E-commerce Manager，零售行业"),
      "avatar": "/home/community/avatar12.png",
      "body": $t("生成的指纹能够毫无失败地通过所有主要检测测试。这种匿名性水平对我们来说至关重要，而 RoxyBrowser 每次都完美交付。")
    },
    {
      "name": "Laura Martinez",
      "post": $t("SEO Specialist，旅游行业"),
      "avatar": "/home/community/avatar13.png",
      "body": $t("管理多个账号从未如此简单。每个配置文件独立运行，浏览器确保我们的账号保持安全且不被检测。")
    },
    {
      "name": "David Wilson",
      "post": $t("Data Analyst，金融服务行业"),
      "avatar": "/home/community/avatar14.png",
      "body": $t("RoxyBrowser 非常适合团队协作。独立的工作空间和灵活的权限设置让我们能够轻松合作，同时不损害安全性。")
    },
    {
      "name": "Laura Martinez",
      "post": $t("Content Strategist，旅游行业"),
      "avatar": "/home/community/avatar15.png",
      "body": $t("RoxyBrowser 彻底改变了我们的工作流程。从直观的界面到强大的安全功能，它是管理多个账号和配置文件的最佳工具。")
    },
    {
      "name": "Michael Brown",
      "post": $t("Web Developer，医疗保健行业"),
      "avatar": "/home/community/avatar16.png",
      "body": $t("我强烈推荐 RoxyBrowser。先进的技术与出色的技术支持相结合，使其成为管理多个在线账号的必备工具。")
    }
  ]

  // 平分了这个数组
  const half = Math.ceil(__community.length / 2)
  return [
    __community.slice(0, half),
    __community.slice(half)
  ]
})

</script>


