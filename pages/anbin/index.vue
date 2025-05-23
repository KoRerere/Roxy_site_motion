<template>
  <!-- <div class="mt-200px">
    <Table />

    <Container>
      <div class="h-20">
    
      </div>

      <div class="mt-20">
        <div class="grid grid-cols-5 border border-solid border-red-500">
          <div v-for="item in packages" :key="item.name" class="text-center package-panel">
            {{ item.name }}
          </div>
        </div>
        <RxSlider2 
          v-model="profile" 
          :scale="0.015"
          :min="10"
          :max="100000" 
          :marks="profileMarks" 
          :step="{ ...profileSteps }" 
          :group="packages"
          :mark-formatter="markFormatter" 
        />
      </div>
    </Container>
  </div> -->
  <div class="h-200px"></div>
  <Container>
    <PricingTable />
    <PricingButtonGroup />
  </Container>
</template>

<script setup>
import RxSlider2 from './rx-slider2.vue'
import RxSlider from './rx-slider.vue'
import { 
  markFormatter
} from '@/components/page-pricing/configs'
import PricingTable from '@/components/page-pricing-2/pricing-table.vue'
import PricingButtonGroup from '@/components/page-pricing-2/pricing-button-group.vue'

const profileMarks = [0, 5, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000];
const profileSteps = {
  0: 5, 5: 5, 10: 40, 50: 50, 100: 100,
  500: 100, 1000: 100, 5000: 100,
  10000: 100, 50000: 100, 100000: 100
}

const value = ref(10)

const profile = ref(10)

const packages = [
  {
    name: 'Free',
    min: 0,
    max: 10,
    setp: {
      0: 5,
      5: 5
    }
  },
  {
    name: 'Basic',
    min: 10,
    max: 100,
    setp: {
      10: 40,
      50: 50
    }
  },
  {
    name: 'Pro',
    min: 100,
    max: 1000,
    setp: {
      100: 100,
      500: 100
    }
  },
  {
    name: 'Business',
    min: 1000,
    max: 10000,
    setp: {
      1000: 100,
      5000: 100
    }
  },
  {
    name: 'Enterprise',
    min: 10000,
    max: 100000,
    setp: {
      10000: 100,
      50000: 100
    }
  }
];

let prev = 0;
const xAxis = [];
for (let i = 0; i < packages.length; i++) {
  const item = packages[i];
  const { setp } = item;
  const _setp = Object.keys(setp);
  const l = _setp.length;
  let n = 20 / l;
  for (let j = 0; j < l; j++) {
    xAxis.push({
      value: prev + (n * j),
      name: _setp[j]
    })
  }
  prev += 20;
}
console.log('xAxis', xAxis)
// console.log('prev', prev)
// console.log('profiles', profiles)



</script>

<style scoped lang="scss">
.package-panel:not(:last-child) {
  border-right: 1px solid black;
}
</style>
