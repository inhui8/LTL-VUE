<template>
    <div class="container">
      <h1>报价结果</h1>
      <el-table :data="tableData" style="width: 100%">
        <!-- Dynamically generate columns based on data keys -->
        <el-table-column
          v-for="(value, key) in tableData[0]" 
          :key="key"
          :prop="key"
          :label="formatLabel(key)"
        />
      </el-table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  
  const tableData = ref([]);
  
  // Function to format keys to readable labels
  const formatLabel = (key) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };
  
  const loadData = async () => {
    try {
      const response = await fetchQuoteResults(); // Fetch data from the backend API
      tableData.value = response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  onMounted(() => {
    loadData(); // Load data when the component is mounted
  });
  </script>
  
  <style scoped>
  .container {
    max-width: 1200px;
    margin: 20px auto;
  }
  </style>
  