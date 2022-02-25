<template>
  <span>
    <el-divider direction="vertical"></el-divider>
    <el-dropdown>
      <span class="el-dropdown-link">
          更多 <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <slot></slot>
      </el-dropdown-menu>
    </el-dropdown>
  </span>
</template>