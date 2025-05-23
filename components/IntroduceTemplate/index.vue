<template>
  <section style="background: linear-gradient(0deg, #F8FAFB 0%, #F8FAFB 100%), #1E1C31;">
    <HeaderTemplate 
      :title="title" 
      :desc="desc"
      :coverImage="coverImage" 
      :primaryColor="primaryColor"
    />
    <Container>
      <Explore 
        :list="exploreList" 
        :title="exploreTitle" 
        :primaryColor="primaryColor"
      />
      <div class="mt-10 sm:mt-20 mb-10">
        <PracticalSkills 
          :list="practicalSkillsList" 
          :title="practicalSkillsTitle" 
          :primaryColor="primaryColor"
          v-if="practicalSkillsTitle"
        />
      </div>

      <div class="py-10">
        <PanelDownload>RoxyBrowser</PanelDownload> 
      </div>
    </Container>
  </section>
  
  <div style="background: radial-gradient(100% 100% at 50% 0%, #E8EFF2 0%, #FFF 100%)">
    <Faq :fqa-list="fqaList" v-if="fqaList.length > 0" class="fqa-container py-10 sm:pt-20" />
  
    <Container class="pb-10 md:pb-20" tag="section">
      <Reasons :list="reasonsList" :title="reasonsTitle" v-if="reasonsTitle" />
    </Container>

    <PanelDownload2 />
  </div>
</template>

<script setup>
import HeaderTemplate from './header-template.vue'
import Explore from './Explore.vue'
import Reasons from './Reasons.vue'
import PracticalSkills from './PracticalSkills.vue'

const props = defineProps({
  // label: {
  //   type: String,
  //   default: ''
  // },
  title: {
    type: String,
    default: ''
  },
  desc: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  primaryColor: {
    type: String,
    default: '#12A3FC'
  },
  exploreTitle: {
    type: String,
    default: ''
  },
  exploreList: {
    type: Array,
    default: () => []
  },
  practicalSkillsTitle: {
    type: String,
    default: ''
  },
  practicalSkillsList: {
    type: Array,
    default: () => []
  },
  fqaList: {
    type: Array,
    default: () => []
  },
  reasonsTitle: {
    type: String,
    default: ''
  },
  reasonsList: {
    type: Array,
    default: () => []
  },
})

</script>