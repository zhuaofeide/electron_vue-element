/**
 * Created by 23535 on 2018/4/25.
 */
import {URLLIST, TASKURL} from '../../../api/config'
import axios from 'axios'
import stores from 'store'
// 获取列表
export function homeList() {
  return axios.get(URLLIST + `?limit=200&offset=0&ordering=-id`)
}
// 获取用户信息
export function getUser() {
  if (stores.get('userInfor')) {
    return stores.get('userInfor')
  }
}
// 获取统计结果
export function getTaskResult() {
  if (!stores.get('taskId')) {
    return false
  }
  let id = stores.get('taskId').id
  return axios.get(TASKURL + id)
}
// 更新个人进度信息
export function getProgress() {
  if (!stores.get('taskId')) {
    return false
  }
  let id = stores.get('taskId').id
  return axios.get(TASKURL + id)
}
