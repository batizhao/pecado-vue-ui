<template>
	<div class="icon-dialog">
		<el-dialog
			v-bind="$attrs"
			width="980px"
			:modal-append-to-body="false"
			v-on="$listeners"
			@open="onOpen"
			@close="onClose"
		>
			<div slot="title">
				选择图标
				<el-input
					v-model="key"
					size="mini"
					:style="{width: '260px'}"
					placeholder="请输入图标名称"
					prefix-icon="el-icon-search"
					clearable
				/>
			</div>
			<ul class="icon-ul">
				<li
					v-for="icon in iconList"
					:key="icon"
					:class="active===icon?'active-item':''"
					@click="onSelect(icon)"
				>
					<i :class="icon" />
					<div>{{icon}}</div>
				</li>
			</ul>
		</el-dialog>
	</div>
</template>
<script>
import iconList from '../../utils/icon.json'

const originList = iconList.map(name => `el-icon-${name}`)

export default {
	inheritAttrs: false,
	props: ['current'],
	data() {
		return {
			iconList: originList,
			active: null,
			key: ''
		}
	},
	watch: {
		key(val) {
			if (val) {
				this.iconList = originList.filter(name => name.indexOf(val) > -1)
			} else {
				this.iconList = originList
			}
		}
	},
	methods: {
		onOpen() {
			this.active = this.current
			this.key = ''
		},
		onClose() {},
		onSelect(icon) {
			this.active = icon
			this.$emit('select', icon)
			this.$emit('update:visible', false)
		}
	}
}
</script>
<style lang="scss" scoped>
.icon-ul {
	margin: 0;
	padding: 0;
	font-size: 0;
	li {
		display: inline-block;
		overflow: hidden;
		list-style-type: none;
		box-sizing: border-box;
		padding: 15px 6px 6px 6px;
		width: 16.66%;
		height: 108px;
		cursor: pointer;
		text-align: center;
		font-size: 14px;
		&:hover {
			background: #f2f2f2;
		}
		&.active-item {
			background: #e1f3fb;
			color: #7a6df0;
		}
		> i {
			line-height: 50px;
			font-size: 30px;
		}
	}
}
.icon-dialog {
	::v-deep .el-dialog {
		display: flex;
		overflow: hidden;
		flex-direction: column;
		box-sizing: border-box;
		margin-top: 4vh !important;
		margin-bottom: 0;
		border-radius: 8px;
		max-height: 92vh;
		.el-dialog__header {
			padding-top: 14px;
		}
		.el-dialog__body {
			overflow: auto;
			margin: 0 20px 20px 20px;
			padding: 0;
		}
	}
}
</style>
