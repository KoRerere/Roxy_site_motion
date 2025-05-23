<template>
  <div 
    class="grid grid-cols-1 grid-rows-6 sm:grid-cols-2 sm:grid-rows-3 lg:grid-cols-3 lg:grid-rows-4 gap-3 xl:gap-5 mt-5 md:mt-12"
  >
    <div 
      :class="cn(
        'col-span-1 row-span-1 lg:col-span-1 lg:row-span-2 rounded-3 md:rounded-5 overflow-hidden',
        'pt-5 pb-8 px-5 md:pt-8 md:px-7 xl:pt-10 xl:pb-20 xl:px-9',
        'box-shadow linear-gradient-1 relative'
      )"
    >
      <div class="relative z-10 h-full">
        <slot name="one">
          1
        </slot>
      </div>

      <div class="absolute top-0 left-0 w-full bg-no-repeat bg-center z-9">
        <RxResponsiveImage name='home/profile-create' class="w-full" alt="" />
      </div>
    </div>

    <div 
      :class="cn(
        'col-span-1 row-span-1 lg:col-span-2 lg:row-span-1 rounded-3 md:rounded-5 overflow-hidden',
        'linear-gradient-3 text-white p-8px md:p-3'
      )"
    >
      <slot name="three">
        3
      </slot>
    </div>

    <div 
      :class="cn(
        'col-span-1 row-span-1 lg:col-span-2 lg:row-span-1 rounded-3 md:rounded-5 overflow-hidden',
        'box-shadow p-8px md:p-3 bg-[#F8FAFB]'
      )"
    >
      <slot name="four">
        4
      </slot>
    </div>

    <div :class="cn(
      'col-span-1 row-span-1 lg:col-span-2 lg:row-span-1 rounded-3 md:rounded-5 overflow-hidden',
      'linear-gradient-6 p-8px md:p-3'
      )">
      <slot name="six">
        6
      </slot>
    </div>

    <div :class="cn(
      'col-span-1 row-span-1 lg:col-span-1 lg:row-span-2 rounded-3 md:rounded-5 overflow-hidden',
      'box-shadow linear-gradient-5'
      )">
      <slot name="five">
        5
      </slot>
    </div>

    <div 
      :class="cn(
        'col-span-1 row-span-1 lg:col-span-2 lg:row-span-1 rounded-3 md:rounded-5 overflow-hidden',
        'box-shadow p-8px md:p-3 bg-[#F8FAFB]'
      )"
    >
      <slot name="two">
        2
      </slot>
    </div>

    
  </div>
</template>

<style scoped>
.linear-gradient-1 {
  /* bg-[url('/home/profile-create@2x.png')] */
  background: linear-gradient(180deg, rgba(220, 240, 255, 0.50) 0%, rgba(220, 240, 255, 0.00) 65%), #FFF;
}

.linear-gradient-3 {
  background: linear-gradient(261deg, #52B8F8 13.82%, #357BF5 86.18%), #FFF;
}

.linear-gradient-5 {
  background: linear-gradient(180deg, rgba(220, 240, 255, 0.50) 0%, rgba(220, 240, 255, 0.00) 65%), #FFF;
}

.linear-gradient-6 {
  background: linear-gradient(261deg, #373749 13.82%, #2C2C3F 86.18%), #FFF;
}

.box-shadow {
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.04);
}
</style>