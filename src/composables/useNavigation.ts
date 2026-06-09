import { ref } from "vue";

export const activeTab = ref<string>("dashboard");
export const drawer = ref<boolean>(false);

export const selectTab = (tab: string) => {
  activeTab.value = tab;
  drawer.value = false;
};
