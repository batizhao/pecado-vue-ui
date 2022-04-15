<template>
    <div>
        <el-form size="small" label-width="90px">
            <form-basic-setting>
            <el-form-item label="允许半选">
                <el-switch v-model="activeData['allow-half']" />
            </el-form-item>
            <el-form-item label="辅助文字">
                <el-switch v-model="activeData['show-text']" />
            </el-form-item>
            <el-form-item label="显示分数">
                <el-switch v-model="activeData['show-score']" />
            </el-form-item>
            <el-form-item label="是否禁用">
                <el-switch v-model="activeData.disabled" />
            </el-form-item>
            <el-form-item label="最大值">
                <el-input-number v-model="activeData.max" placeholder="最大值" />
            </el-form-item>
            </form-basic-setting>
        </el-form>
    </div>
</template>
<script>
import mixins from './mixins'
import formBasicSetting from './formBasicSetting.vue'
export default {
    components: {
        formBasicSetting
    },
    mixins:[mixins],
    data(){
        return{
            currentTab: 'field',
        }
    },
    methods:{
    }
}
</script>