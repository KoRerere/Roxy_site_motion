export const useRoxyI18n = () => {
  const { t, ...rest } = useI18n();
  return {
    $t: t,
    ...rest,
  }
}