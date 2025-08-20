<script setup lang="ts">
import cover1 from '@/assets/images/functions/ip-fingerprint-guard-cover-1.png'
import cover2 from '@/assets/images/functions/ip-fingerprint-guard-cover-2.png'
import cover3 from '@/assets/images/functions/ip-fingerprint-guard-cover-3.png'
import TryItNow from '~/components/page-use-cases/components/TryItNow.vue'

const features = [
  {
    title: $t('Support Any Proxy, Any IP On Demand'),
    description: $t('RoxyBrowser lets you instantly access any IP worldwide, exactly where you need it. Whether residential, mobile, or datacenter proxies, choose freely and switch locations in seconds.'),
    cover: cover1,
    details: [
      {
        label: $t('Any Proxy Type:'),
        description: $t('Residential, mobile, or datacenter.'),
      },
      {
        label: $t('Global Reach:'),
        description: $t('Target IPs from 195+ countries on demand.'),
      },
      {
        label: $t('Precision Matching:'),
        description: $t('Lock specific cities or ISPs for local authenticity.'),
      },
    ],
  },
  {
    title: $t('Change Fingerprints, Be Truly Authentic'),
    description: $t('RoxyBrowser auto-generates unique, proxy-matched fingerprints for every session, mimicking real users down to the smallest detail. No more "proxy patterns" or fingerprint mismatches.'),
    cover: cover2,
    reverse: true,
    details: [
      {
        label: $t('Dynamic Fingerprints:'),
        description: $t('GPU, fonts, OS – all randomized per IP.'),
      },
      {
        label: $t('Perfect IP-Fingerprint Sync:'),
        description: $t('Eliminates detection red flags.'),
      },
      {
        label: $t('Custom or Auto:'),
        description: $t('Build manually or generate in one click.'),
      },
    ],
  },

  {
    title: $t('Use Multiple Profiles for Isolate Tasks'),
    description: $t('Run unlimited independent browsing sessions side-by-side. Each RoxyBrowser window operates with its own dedicated IP + fingerprint combo. No overlaps, no cross-contamination.'),
    cover: cover3,
    details: [
      {
        label: $t('Separate Identities:'),
        description: $t('Unique IP + fingerprint for every tab.'),
      },
      {
        label: $t('Zero Data Leaks:'),
        description: $t('Strict digital isolation between sessions.'),
      },
      {
        label: $t('Bulk Operation Ready:'),
        description: $t('Manage 100+ accounts/tasks simultaneously.'),
      },
    ],
  },

]
</script>

<template>
  <div class="ip-fingerprint-guard">
    <div class="title">
      {{ $t('RoxyBrowser Changes IPs & Fingerprints in One Secure System') }}
    </div>
    <div class="description">
      {{ $t("Changing IP address is only half the battle. RoxyBrowser ensures your fingerprint changes with it, so platforms won't flag mismatches or trigger bans.") }}
    </div>
    <div class="features">
      <div v-for="feature in features" :key="feature.title" class="feature-item" :class="{ reverse: feature.reverse }">
        <div class="feature-item-content">
          <div class="feature-item-title">
            {{ feature.title }}
          </div>
          <div class="feature-item-description">
            {{ feature.description }}
          </div>
          <div class="feature-item-details">
            <div v-for="detail in feature.details" :key="detail.label" class="feature-item-detail">
              <rx-icon-svg-icon name="base/rx_ic_check_fill" />
              <div class="feature-item-detail-label">
                {{ detail.label }}
              </div>
              <div class="feature-item-detail-description">
                {{ detail.description }}
              </div>
            </div>
          </div>
          <TryItNow type="primary" class="w-fit" />
        </div>
        <img :src="feature.cover" :alt="feature.title" class="feature-item-cover"></img>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ip-fingerprint-guard {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(100%, 1280px);
  container-type: inline-size;
}

.title {
  color: var(--colors-text-text-primary, #111213);
  text-align: center;

  /* H3 */
  font-family: Archivo;
  font-size: var(--Heading-H3, 40px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-H3, 48px); /* 120% */
  letter-spacing: -0.8px;
}

.description {
  margin-top: 8px;
  color: var(--colors-text-text-tertiary, #575d60);
  text-align: center;
  font-family: Inter;
  font-size: var(--body, 18px);
  font-style: normal;
  font-weight: 400;
  line-height: var(--line-body, 28px); /* 155.556% */
  letter-spacing: -0.054px;
}

.features {
  margin-top: 48px;
}

.feature-item {
  display: flex;
  width: 100%;

  &.reverse {
    flex-direction: row-reverse;
  }
}

.feature-item-content {
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 50%;
}

.feature-item-cover {
  width: 50%;
}

@container (max-width: 1080px) {
  .feature-item {
    flex-wrap: wrap;
  }

  .feature-item-content,
  .feature-item-cover {
    width: 100%;
  }
}

.feature-item-title {
  color: var(--colors-text-text-primary, #111213);

  /* H4 */
  font-family: Archivo;
  font-size: var(--Heading-H4, 36px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-H4, 48px); /* 133.333% */
}

.feature-item-description {
  color: var(--colors-text-text-secondary, #34393d);

  /* body */
  font-family: Inter;
  font-size: var(--body, 18px);
  font-style: normal;
  font-weight: 400;
  line-height: var(--line-body, 28px); /* 155.556% */
}

.feature-item-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-item-detail {
  display: flex;
  gap: 12px;
}
</style>
