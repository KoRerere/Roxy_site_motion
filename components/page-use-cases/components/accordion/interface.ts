import type { Component, VNode } from 'vue';

export interface AccordionProps {
  items: {
    title: string | Component | (() => VNode),
    desc: string | Component | (() => VNode),
    key?: string
  }[]
}