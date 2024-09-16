<template>
  <div class="app-container home">
    <!-- Profile Section -->
    <el-row :gutter="20" class="profile-section">
      <el-col :span="24">
        <div class="profile-container">
          <img class="profile-avatar" src="@/assets/images/Linkw.png" alt="User Avatar" />
          <div class="profile-info">
            <h1 class="greeting">你好，{{ userName }}</h1>
            <p class="description">尽力而为，全力以赴~ <span v-if="quote">{{ quote }}</span></p>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- Emergency Contacts Table -->
    <el-row :gutter="20">
      <el-col :span="24">
        <h2>紧急联系人</h2>
        <el-table :data="contacts" style="width: 100%">
          <el-table-column prop="name" label="姓名" width="120"></el-table-column>
          <el-table-column prop="phone" label="电话" width="180"></el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- Update Information Section -->
    <el-row :gutter="20" class="update-section">
      <el-col :span="24">
        <h2>更新信息</h2>
        <el-timeline>
          <el-timeline-item v-for="log in updateLogs" :key="log.version" :timestamp="log.date">
            {{ log.version }} - {{ log.description }}
          </el-timeline-item>
        </el-timeline>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios';
// Data for the profile section
const userName = ref('');
const quote = ref('加油加油~')

// Data for emergency contacts
const contacts = ref([
  { name: 'Alex', phone: '6263653530' }
])

// Data for update logs
const updateLogs = ref([
  { version: '1.0.6.20', date: '2024/02/01 至 2025/02/17', description: '当前最新版本为v1.0.6.20，请更新至新版' },
  { version: '1.0.6.19', date: '2024/02/01 至 2025/02/17', description: '当前最新版本为v1.0.6.19，请更新至新版' },
  { version: '1.0.6.17', date: '2024/02/01 至 2025/02/17', description: '当前最新版本为v1.0.6.17，请更新至新版' },
  // Add more logs here...
])
// 发起请求获取用户信息
axios.get('/getInfo')
  .then(response => {
    console.log('User info:', response.data);
    // 你可以从 response.data 中获取用户信息并赋值给页面上的变量
  })
  .catch(error => {
    console.error('Failed to fetch user info:', error);
  });
</script>

<style scoped>
.home {
  padding: 20px;
}

.profile-section {
  margin-bottom: 20px;
}

.profile-container {
  display: flex;
  align-items: center;
}

.profile-avatar {
  width: 300px;
  height: 100px;

  margin-right: 20px;
}

.profile-info {
  display: flex;
  flex-direction: column;
}

.greeting {
  font-size: 24px;
  font-weight: bold;
}

.description {
  font-size: 16px;
  color: #888;
}

.update-section {
  margin-top: 40px;
}
</style>
