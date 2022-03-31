<template>
    <div>
        <el-form size="small" label-width="90px">
            <form-basic-setting>
            <el-form-item label="显示间断点">
                <el-switch v-model="activeData['show-stops']" />
            </el-form-item>
            <el-form-item label="范围选择">
                <el-switch v-model="activeData.range" />
            </el-form-item>
            <el-form-item label="是否禁用">
                <el-switch v-model="activeData.disabled" />
            </el-form-item>
            <el-form-item label="默认值">
                <el-input-number
                    :value="setDefaultValue(activeData.__config__.defaultValue)"
                    placeholder="请输入默认值"
                    @input="onDefaultValueInput"
                />
            </el-form-item>
            <el-form-item label="最大值">
                <el-input-number v-model="activeData.max" placeholder="最大值" />
            </el-form-item>
            <el-form-item label="最小值">
                <el-input-number v-model="activeData.min" placeholder="最小值" />
            </el-form-item>
            <el-form-item label="步长">
                <el-input-number v-model="activeData.step" placeholder="步数" />
            </el-form-item>
            </form-basic-setting>
        </el-form>
    </div>
</template>
<script>
import formBasicSetting from './formBasicSetting.vue'
import { setDefaultValue,onDefaultValueInput } from './utils'
import { isNumberStr } from '../../../utils/index'
import mixins from './mixins'
export default {
    props: {
        value: {
        type: Object
        }
    },
    mixins:[mixins],
    data(){
        return{
            currentTab: 'field',
        }
    },
    methods:{
        setDefaultValue,
        onDefaultValueInput,
        onSwitchValueInput(val, name) {
			if (['true', 'false'].indexOf(val) > -1) {
				this.$set(this.activeData, name, JSON.parse(val))
			} else {
				this.$set(this.activeData, name, isNumberStr(val) ? +val : val)
			}
		},
    },
    computed: {
        
    },
    components:{
        formBasicSetting
    }
}
</script>