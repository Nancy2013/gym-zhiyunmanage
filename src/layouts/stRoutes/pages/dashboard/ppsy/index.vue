<template>
    <div class="dashboard-echarts">
      <a-row :gutter="16">
        <a-col :span="12">
          <div class="echarts-item">
            <div class="echarts-item-title">
              <div class="dzIcon-box">
                <img class="dzIcon" :src="moduleIcons.cl.icon" />
              </div>
              品牌产量分析
            </div>
            <div class="echarts-item-selects">
              <a-select
                style="width: 132px"
                placeholder="请选择时间"
                value="1"
                :options="[{ value: '1', label: '近半年' }]"
              ></a-select>
            </div>
            <div class="echarts-item-diagram" id="echartId"></div>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="echarts-item">
            <div class="echarts-item-title">
              <div class="dzIcon-box">
                <img class="dzIcon" :src="moduleIcons.sy.icon" />
              </div>
              溯源数据分析
            </div>
            <div class="echarts-item-diagram">
              <div class="diagram-pie" id="pieChartId"></div>
              <div class="diagram-linear" id="linearChartId"></div>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
</template>

<script lang="ts">
import Index from './index'
export default Index;
</script>

<style lang="less" scoped>
.dashboard {
  padding: 0 24px;
  background-color: #F7F8FA;
  .dzIcon-box{
    display: inline-block;
    width: 35px;
    height: 35px;
    background: #F6F7FB;
    border-radius: 50%;
    text-align: center;
    line-height: 35px;
    margin-right: 10px;
  }
  .dzIcon {
    width: 20px;
    height: 20px;
  }
  // 图表
  &-echarts {
    margin: 20px 0px;
    .echarts-item {
      padding-bottom: 10px;
      background: #fff;
      position: relative;
      &-title {
        font-size: 20px;
        font-weight: bold;
        color: #151515;
        padding: 10px 24px;
        border: 1px solid #DCDEE0;
      }
      &-selects {
        position: absolute;
        top: 15px;
        right: 15px;
      }
      &-diagram {
        padding: 20px 10px 10px 10px;
        height: 350px;
        .diagram-pie {
          width: 250px;
          height: 100%;
          display: inline-block;
        }
        .diagram-linear {
          width: calc(100% - 250px);
          height: 100%;
          display: inline-block;
        }
      }
    }
  }
}

</style >