import Vue from 'vue'
import Parser from '@/components/CodeEditor/components/parser/Parser.vue'
import D2Crud from '@d2-projects/d2-crud'
Vue.use(D2Crud)
Vue.component('parser',Parser)
