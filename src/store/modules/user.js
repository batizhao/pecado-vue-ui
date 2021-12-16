import { login, logout } from '@/api/login'
import { getInfo } from '@/api/ims/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
    timestamp: '',
    user: {},
    loginFlag: false,
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_TIMESTAMP: (state, timestamp) => {
      state.timestamp = timestamp
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_LOGINFLAG: (state, loginFlag) => {
      state.loginFlag = loginFlag
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 登录
    async Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
          setToken(res.data.token)
          commit('SET_TOKEN', res.data.token)
          let time = (new Date()).getTime()
          commit('SET_TIMESTAMP', time + res.data.expire*1000)
          commit('SET_LOGINFLAG', false)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 保存用户账号密码
    SaveUser({ commit }, userInfo) {
      commit('SET_USER', userInfo)
    },
    SetLoginFlag({ commit }, loginFlag) {
      commit('SET_LOGINFLAG', loginFlag)
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(res => {
          const me = res.data.user
          const avatar = me.avatar == "" ? require("@/assets/images/profile.jpg") : me.avatar;
          if (res.data.roles && res.data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.data.roles)
            commit('SET_PERMISSIONS', res.data.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_NAME', me.username)
          commit('SET_AVATAR', avatar)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
