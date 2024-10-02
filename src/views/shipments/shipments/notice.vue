<template>
    <div class="custom-footer">
      <h2 class="footer-title"><strong>注意事项：</strong></h2>
  
      <!-- 货物信息 -->
      <h3><strong>货物信息</strong></h3>
      <p>LTL货物建议体积不超过15cbm(约8板),重量不超过5吨(11000lbs),若超出可分批报价或参考。</p>
      <p>仓库地址尺寸边长不超过240CM,单件限重2吨以内。</p>
      <p>非仓库地址货物尺寸单件第一边长不超过240CM,第二边长不超过120CM,单件限重一吨以内。</p>
      <p>非商业地址有额外费用，例：工地，展馆，医院，学校，住宅等。</p>
      <p>特殊货物需要单询，例：显示屏，功放，假发等。</p>
  
      <!-- 运输信息 -->
      <h3><strong>运输信息</strong></h3>
      <p>LTL仅在工作日提/送。</p>
      <p>参考中转时间不含提/送日。</p>
  
      <!-- 报价信息 -->
      <h3><strong>报价信息</strong></h3>
      <p>参考价格可能会有轻微浮动，受燃油，天气等因素影响，建议预留核算成本浮动空间。</p>
      <p>建议选择预约后派送,最大程度避免dry run fee。</p>
      <p>散货包装类型默认pallet(48*40inch)。</p>
      <p>重量需要包含托盘平均(50lbs/单个托盘)。</p>
      <p>参考报价不含保险。</p>
  
      <!-- 附加要求 -->
      <h3><strong>附加要求</strong></h3>
      <p>若不清晰收货方卸货条件,建议勾选liftgate+appt。</p>
      <p>若收货地址为住宅,需勾选residential+liftgate+appt。</p>
      <p>限制性地址需勾选limited access + liftgate+appt。</p>
      <p>默认送货时间为9am-4pm,若有特殊预约流程或交仓要求,需单询。</p>
    </div>
  </template>
  
  <script setup>
  // No special logic needed for now
  </script>
  
  <style scoped>
  .custom-footer {
    margin-top: 40px;
    padding: 20px;
    background-color: #f9f9f9;
    border-top: 1px solid #e0e0e0;
  }
  
  .footer-title {
    color: #333;
    margin-bottom: 10px;
  }
  
  .custom-footer h3 {
    margin-top: 20px;
    margin-bottom: 10px;
    color: #555;
  }
  
  .custom-footer p {
    margin: 5px 0;
    color: #666;
    line-height: 1.5;
  }
  </style>
  