<script setup lang="ts">
import { RxIcon } from '~/components/rx-icon'

const reasons = [
  {
    title: $t('Bypass Geoblocks'),
    description: $t('Access shows, sites, or services blocked in your region.'),
    icon: 'functions/rx_ic_address',
  },
  {
    title: $t('Stay Private Online'),
    description: $t('Hide your identity to avoid tracking and stay anonymous.'),
    icon: 'functions/rx_ic_shield',
  },

  {
    title: $t('Get Around IP Bans'),
    description: $t('Switch IPs to bypass firewalls, rate limits, or blacklists.'),
    icon: 'functions/rx_ic_bypass',
  },
  {
    title: $t('Run Multiple Accounts'),
    description: $t('Manage multiple accounts without triggering platform bans.'),
    icon: 'functions/rx_ic_people',
  },
  {
    title: $t('Scrape Data Safely'),
    description: $t('Rotate IPs to collect data without getting blocked or flagged. '),
    icon: 'functions/rx_ic_random',
  },
  {
    title: $t('Mimic Real Users'),
    description: $t('Make your activities look human to avoid bot detection.'),
    icon: 'functions/rx_ic_user',
  },
]
</script>

<template>
  <div class="why-change-your-ip-address">
    <div class="title">
      {{ $t('Why Change Your IP Address?') }}
    </div>
    <div class="description">
      {{ $t("These might be the reasons you're considering it. Whether it's for access, privacy, or account safety, it all starts with your IP.") }}
    </div>
    <div class="reasons">
      <div v-for="reason in reasons" :key="reason.title" class="reason">
        <div class="reason-header">
          <RxIcon :name="reason.icon" size="36" />
          <div class="reason-title">
            {{ reason.title }}
          </div>
        </div>
        <div class="reason-content">
          <div class="reason-description">
            {{ reason.description }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.why-change-your-ip-address {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(100%, 1280px);
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
}

.reasons {
  width: 100%;
  margin-top: 48px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(348px, 1fr));
}

.reason {
  display: flex;
  height: 220px;
  padding: 40px;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  flex: 1 0 0;
  border: 2px solid rgba(226, 233, 238, 0);

  &:hover {
    border: 2px solid rgba(226, 233, 238, 0);
    background:
      linear-gradient(142deg, rgba(18, 163, 252, 0.2) 0%, rgba(18, 163, 252, 0) 44.02%),
      var(--colors-background-bg-block, #f1f5f8);
  }
}

.reason-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reason-title {
  color: var(--colors-text-text-secondary, #34393d);
  font-family: Archivo;
  font-size: var(--Heading-H6, 24px);
  font-style: normal;
  font-weight: 500;
  line-height: var(--line-H6, 36px); /* 150% */
}

.reason-description {
  color: var(--colors-text-text-secondary, #34393d);

  /* body */
  font-family: Inter;
  font-size: var(--body, 18px);
  font-style: normal;
  font-weight: 400;
  line-height: var(--line-body, 28px); /* 155.556% */
}
</style>
