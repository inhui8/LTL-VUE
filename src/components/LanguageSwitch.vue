<template>
    <el-dropdown trigger="click" @command="changeLanguage">
      <div class="language-icon-style">
        <svg-icon class-name="language-icon" icon-class="language" />
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item in languageOptions"
            :key="item.value"
            :disabled="currentLanguage === item.value"
            :command="item.value"
          >
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { ElMessage } from 'element-plus';
  import zhLocale from 'element-plus/es/locale/lang/zh-cn';
  import enLocale from 'element-plus/es/locale/lang/en';
  
  const { t, locale } = useI18n(); // 从 vue-i18n 获取 locale 相关的函数
  
  const languageOptions = ref([
    { label: '简体中文', value: 'zh' },
    { label: 'English', value: 'en' },
  ]);
  
  const currentLanguage = ref(localStorage.getItem('lang') || 'zh'); // 从 localStorage 获取当前语言
  
  // 切换语言
  function changeLanguage(lang) {
    console.log(`Changing language to: ${lang}`); // Debug 输出
    currentLanguage.value = lang;
    localStorage.setItem('lang', lang); // 将语言存储在 localStorage 中
    locale.value = lang; // 更新 vue-i18n 的 locale
    updateElementLocale(lang); // 更新 Element Plus 语言
    ElMessage.success(t('message.languageChanged')); // 显示切换成功的消息
  }
  
  // 更新 Element Plus 的语言
  function updateElementLocale(lang) {
    const localeSetting = lang === 'zh' ? zhLocale : enLocale;
    console.log('Setting Element Plus locale to:', localeSetting); // Debug 输出
    localeSetting.name = lang; // 设置语言名称
    locale.value = localeSetting;
    
    // 为了确保 Vue 和 Element Plus 都成功切换语言，可以在这里先刷新页面
    location.reload(); // 刷新页面应用新语言
  }
  </script>
  
  <style scoped>
  .language-icon-style {
    font-size: 18px;
    line-height: 50px;
    padding-right: 7px;
  }
  </style>
  