import type { Component } from "vue";


export interface HeaderPanelProps {
  title: string;
  desc: string;
  coverImage: string;
  primaryColor: string;
}

export interface IntroduceProps {
  title: string;
  desc: string;
  primaryColor: string;
  items: {
    title: string;
    desc: string | Component;
    image: string;
    textColor?: string;
    wrapperClass?: string;
  }[]
}

export interface Introduce2Props {
  title: string;
  desc: string;
  image: string;
  primaryColor: string;
  alt: string;
}

export interface FAQProps {
  title: string;
  desc: string;
  items: {
    title: string;
    desc: string | Component; 
  }[]
}

export interface WhyChooseProps {
  title: string;
  desc: string;
  items: {
    icon: string;
    title: string;
    desc: string | Component;
  }[]
}

export interface FooterPanelProps {
  title: string;
  desc: string;
  alt: string;
}