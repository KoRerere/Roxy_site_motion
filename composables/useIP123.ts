import { countryCode } from '@/store';

export const useIP123 = () => {
  onMounted(async () => {
    try {
      if (countryCode.value) return;
      const result = await fetch('https://ip234.in/ip.json');
      console.log('result', result)
      if (result.ok) {
        const data = await result.json();
        countryCode.value = data.country_code;
      }
    } catch(err) {

    }
  })
}