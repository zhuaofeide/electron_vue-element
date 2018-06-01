/**
 * Created by 23535 on 2018/5/2.
 */
import Vue from 'vue'
import stores from 'store'
import * as d3 from 'd3'
import { URLLIST, TITLELIST, TileUrl, URLRESULT, SCREENSHORTS, ERR_OK, DELETE_OK } from '../../../api/config'
import { mapGetters, mapMutations } from 'vuex'
import { getUser, homeList } from '../getData/getlist'
import Scroll from '@/components/scroll/scroll'
import vueSlider from 'vue-slider-component'
import vPatient from '@/components/patientInformation/index.vue'
import vIssued from '@/components/doctorIssued/index.vue'
import vCard from '@/components/patientCard/index.vue'
import vJud from '@/components/judGment/index.vue'
import vSpin from '@/components/spin/spin.vue'
import {
  Table,
  Dropdown,
  Icon,
  DropdownMenu,
  DropdownItem,
  Checkbox,
  Tree,
  CheckboxGroup,
  Spin,
  LoadingBar,
  Circle
} from 'iview'
Vue.component('Table', Table)
Vue.component('Dropdown', Dropdown)
Vue.component('Icon', Icon)
Vue.component('DropdownMenu', DropdownMenu)
Vue.component('DropdownItem', DropdownItem)
Vue.component('Checkbox', Checkbox)
Vue.component('Tree', Tree)
Vue.component('CheckboxGroup', CheckboxGroup)
Vue.component('Spin', Spin)
Vue.component('LoadingBar', LoadingBar)
Vue.component('vCircle', Circle)
export const mainMixin = {
  components: {
    Scroll,
    vueSlider,
    vSpin,
    vPatient,
    vIssued,
    vCard,
    vJud
  },

  data () {
    return {
      username: '李医生',
      userMsg: {},
      actionsLoad: true,
      pullingUp: true,
      beforeScroll: true,
      hasMore: true,
      reportText: '展开报告',
      leftText: '收起病例',
      leftText2: '展开标本',
      vertical: 'vertical',
      checked: false,
      codes: false,
      loading: true,
      show: false,
      status: true,
      status2: false,
      inner: false,
      single: false,
      white: true,
      selected: false,
      cadWidth: 0.0005,
      sliderValue: 1,
      min: 0.5,
      max: 40,
      active: true,
      isActive: false,
      style: {
        backgroundImage: 'linear-gradient( #292C31 100%, #2D3035 100%)',
        borderRadius: '10px'
      },
      style1: {
        background: '#999999'
      },
      style2: {
        backgroundImage: 'linear-gradient( #292C31 100%, #2D3035 100%)',
        borderRadius: '10px'
      },
      style3: {
        background: '#999999',
        border: '1px solid #999999'
      },
      columns: [
        {
          title: '病理号',
          key: 'case_number',
          align: 'center',
          render: (h, params) => {
            const row = params.row;
            const text = row.case_number === null ? '-' : row.case_number;
            return h('span', {
              props: {
                type: ''
              }
            }, text)
          }
        },
        {
          title: '智能诊断',
          key: 'results',
          align: 'center',
          render: (h, params) => {
            const row = params.row.result
            let text = ''
            if (row) {
              text = row.tag_status
            } else {
              text = '-'
            }
            return h('span', {
              props: {
                type: ''
              }
            }, text)
          },
          filters: [
            {
              label: 'NORMAL',
              value: 'NORMAL'
            },
            {
              label: 'SCG',
              value: 'SCG'
            },
            {
              label: 'HSIL',
              value: 'HSIL'
            },
            {
              label: 'ASCH',
              value: 'ASCH'
            },
            {
              label: 'LSIL',
              value: 'LSIL'
            },
            {
              label: 'ASCUS',
              value: 'ASCUS'
            },
            {
              label: 'AGC2',
              value: 'AGC2'
            },
            {
              label: 'AGC1',
              value: 'AGC1'
            },
            {
              label: 'VIRUS',
              value: 'VIRUS'
            },
            {
              label: 'ACTINO',
              value: 'ACTINO'
            },
            {
              label: 'CC',
              value: 'CC'
            },
            {
              label: 'TRI',
              value: 'TRI'
            },
            {
              label: 'FUNGI',
              value: 'FUNGI'
            },
            {
              label: 'EC',
              value: 'EC'
            }
          ],
          filterMethod (value, row) {
            console.log(row)
            return row.result.tag_status.indexOf(value) > -1;
          }
        },
        // {
        //   title: '送检单号',
        //   key: 'accession_number',
        //   align: 'center',
        //   render: (h, params) => {
        //     const row = params.row;
        //     const text = row.accession_number === null ? '-' : row.accession_number;
        //     return h('span', {
        //       props: {
        //         type: ''
        //       }
        //     }, text)
        //   }
        // },
        {
          title: '姓名',
          key: 'name',
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const text = row.name === null || row.name === '' ? '-' : row.name
            return h('span', {
              props: {
                type: ''
              }
            }, text)
          }
        },
        {
          title: '算法状态',
          key: 'algorithm_status',
          align: 'center',
          render: (h, params) => {
            const row = params.row;
            let text = ''
            switch (row.algorithm_status) {
              case 'done':
                text = '已完成'
                break;
              case 'pre-queue':
                text = '未进行'
                break;
              case 'running':
                text = '进行中'
                break;
              case 'failed':
                text = '失败'
                break;
              case 'queuing':
                text = '排队中'
                break;
              case 'waiting':
                text = '等待中'
                break;
              default:
                text = '-'
            }
            return h('span', {
              props: {
                type: ''
              }
            }, text)
          }
        }
      ],
      columns2: [
        {
          type: 'index',
          width: 40,
          align: 'center'
        },
        {
          title: '标记类型',
          key: 'color',
          align: 'left',
          render: (h, params) => {
            let color = params.row.color
            let text = ''
            switch (color) {
              case '#000':
                text = 'NORMAL'
                break;
              case '#B71C1C':
                text = 'SCC'
                break;
              case '#ffcdd2':
                text = 'ASCUS'
                break;
              case '#e57373':
                text = 'LSIL'
                break;
              case '#f44336':
                text = 'ASCH'
                break;
              case '#d32f2f':
                text = 'HSIL'
                break;
              case '#f57c00':
                text = 'AGC1'
                break;
              case '#e65100':
                text = 'AGC2'
                break;
              case '#0d47a1':
                text = 'EC'
                break;
              case '#d1c4e9':
                text = 'FUNGI'
                break;
              case '#9575cd':
                text = 'TRI'
                break;
              case '#673ab7':
                text = 'CC'
                break;
              case '#512da8':
                text = 'ACTINO'
                break;
              case '#311b92':
                text = 'VIRUS'
                break;
            }
            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
          },
          filters: [
            {
              label: 'NORMAL',
              value: '#000'
            },
            {
              label: 'SCC',
              value: '#B71C1C'
            },
            {
              label: 'ASCUS',
              value: '#ffcdd2'
            },
            {
              label: 'LSIL',
              value: '#e57373'
            },
            {
              label: 'ASCH',
              value: '#f44336'
            },
            {
              label: 'HSIL',
              value: '#b71c1c'
            },
            {
              label: 'AGC1',
              value: '#f57c00'
            },
            {
              label: 'AGC2',
              value: '#e65100'
            },
            {
              label: 'EC',
              value: '#0d47a1'
            },
            {
              label: 'FUNGI',
              value: '#d1c4e9'
            },
            {
              label: 'TRI',
              value: '#9575cd'
            },
            {
              label: 'CC',
              value: '#673ab7'
            },
            {
              label: 'ACTINO',
              value: 'ACTINO'
            },
            {
              label: 'VIRUS',
              value: 'VIRUS'
            }
          ],
          filterMethod (value, row) {
            return row.color.indexOf(value) > -1;
          }
        }
      ],
      satisfied: true, // 满意
      satistatus: false,
      unsatisfied: false,
      unsatistatus: false,
      Group2: ['见宫颈管 / 移行区成分'],
      Group3: [],
      Group4: [],
      group2: false,
      group3: false,
      Cacucount: 0,
      counts: 0,
      items1: [],
      items2: [],
      items3: [],
      items4: [],
      items5: [],
      items6: [],
      miniImg: [],
      miniBlobImg: [],
      comment: '',
      defaultComment: '',
      suggestions: '',
      userResult: '',
      dataUrl: {},
      d3Rect: [],
      map: [], // 切片
      more: false,
      objs: [],
      diagnosticResult: [],
      glandular: [], // 腺细胞
      squamous: [], // 鳞状细胞
      cancer: [], // 肿瘤
      pathogens: [], // 病原体
      atrophy: [], // 萎缩
      noseen: [] // 未见
    }
  },

  filters: {
    // 进度
    filterProgress(value) {
      if (value === 0 || value === null) {
        return 0
      }
      return (value * 100).toFixed(0)
    },
//      缩放值
    filterFun(value) {
      let toFixedNum = Number(value).toFixed(3);
      return toFixedNum.substring(0, toFixedNum.toString().length - 4)
    },
//      截图id
    PrefixInteger(value) {
      let len = value.toString().length;
      while (len < 2) {
        value = '0' + value;
        len++;
      }
      return value;
    },
    // 过滤无信息状态
    msgFun(value) {
      if (value === '') {
        let texts = '无'
        return texts
      }
      if (value === null) {
        let texts = '无'
        return texts
      }
      if (value === '') {
        let texts = '无'
        return texts
      }
      return value
    },
//      时间过滤
    timeFun(value) {
      if (value) {
        return value.substring(0, 10)
      } else {
        return '无'
      }
    }
  },

  created() {
    this.probeType = 3
    this.listenScroll = true
    this.pullingUp = true
    this.$nextTick(() => {
      this.getList()
      this.getInfor()
    })
  },

  methods: {
// 左侧表格
    selectOne(e) {
      console.log(this.testMsg)
      let that = this
      that.glandular = []
      that.squamous = []
      that.cancer = []
      that.pathogens = []
      that.atrophy = []
      that.noseen = []
      that.CalculationId = e.result.id
      that.CalculationInfor = e.id
      if (e.result) {
        let AlgorithmId = {
          resultsId: this.CalculationId,
          inforId: this.CalculationInfor
        }
        this.setAlgorithm(AlgorithmId)
        this.selectedMap(e.result.id, e.id) // 获取瓦图数据
        this.getReport(e.result.id) // 获取报告数据
        this.getInformations(e.id) // 更新进度
      }
    },

// 获取病人信息
    getInformations(id) {
      let that = this
      that.$http.get(URLLIST + id + `/`).then((res) => {
        console.log(res, '更新个人信息数据')
        if (res.status === ERR_OK) {
          that.lisData = res.data
          that.userMsg = res.data
          that.CalculationInfor = res.data.id
          that.CalculationId = res.data.result.id
          that.statusCalcu = res.data.algorithm_status // 算法状态
          if (that.statusCalcu === 'running') {
            that.percent = res.data.progress // 进度
            return
          }
          if (that.statusCalcu === 'queuing') {
            that.percent = 0 // 进度
            return
          }
          if (that.statusCalcu === 'done') {
            that.percent = 1 // 进度pre-queue
            return
          }
          if (that.statusCalcu === 'pre-queue') {
            return that.percent = 0 // 进度
          }
          if (that.statusCalcu === 'failed') {
            return that.percent = res.data.progress // 进度
          }
        } else {
        }
      }).catch(error => {
        console.log(error)
      })
    },

// 查看病史
    viewReport () {
      this.more = !this.more
    },

//  获取报告数据
    getReport(id) {
      let that = this
      that.$http.get(URLRESULT + id + `/`, {
        limit: 50
      }).then((res) => {
         console.log(res, '报告数据')
        if (res.status === ERR_OK) {
          // that.userMsg = res.data.information // 个人信息
          that.userResult = res.data.tag_status // 结果报告
          that.actionsLoad = false
          that.putData = res.data // 修改数据
          that.nodeData = res.data.report.children // 节点数据
          if (that.nodeData) {
            // console.log(that.nodeData)
            that.getHeight()
            that.inner = false
            that.items1 = this.nodeData[0]
            that.items2 = this.nodeData[1]
            that.items3 = this.nodeData[2]
            that.items4 = this.nodeData[3]
            that.items5 = this.nodeData[4]
            that.items6 = this.nodeData[5]
          }
          that.suggestions = res.data.suggestion // 建议
          if (res.data.comment) {
            that.comment = res.data.comment // 判断意见结果
            console.log(that.comment)
          }
          if (res.data.sample_quality) {
            that.unsatisfied = res.data.sample_quality.notsatisfied

            if (res.data.sample_quality.cervical) {
              that.Group2 = res.data.sample_quality.cervical
            }

            if (res.data.sample_quality.satisfaction === false || res.data.sample_quality.satisfaction === true) {
              that.satisfied = res.data.sample_quality.satisfaction
            }
          }
          that.miniImg = []
          if (res.data.images.length > 0) {
            // console.log(res.data.images)
            res.data.images.forEach((item, index) => {
              // console.log(item)
              that.miniImg.push(item)
            })
            if (that.miniImg.length > 4) {
              that.miniImg = that.miniImg.slice(0, 4)
            }
          }
//            this.setList(res.data.information)
        } else {
        }
      }).catch(error => {
        console.log(error)
      })
    },

// input值
    changeValue(values) {
      this.suggestions = values
    },

//   生成报告
    printReport() {
      if (this.lisData.result) {
        let that = this
        // this.noseen + this.glandular + this.squamous + this.cancer + this.pathogens + this.atrophy
        // console.log(this.noseen)
        // console.log(this.glandular)
        // console.log(this.cancer)
        // console.log(this.pathogens)
        // console.log(this.atrophy)
        // if (this.noseen === false && !this.glandular && !this.cancer && !this.pathogens && !this.atrophy) {
        //   return Message.error('未勾选任何结果')
        // }
        let data = {
          value: null,
          expand: true,
          id: this.putData.report.id,
          name: this.putData.report.name,
          title: this.putData.report.title,
          type: this.putData.report.type,
          children: {
            0: that.items1,
            1: that.items2,
            2: that.items3,
            3: that.items4,
            4: that.items5,
            5: that.items6
          }
        }
        let id = this.lisData.result.id
        that.$http.put(URLRESULT + id + `/`, {
          information_id: this.putData.information_id,
          suggestion: that.suggestions,
          sample_quality: {
            satisfaction: that.satisfied,
            notsatisfied: that.unsatisfied,
            cervical: that.Group2,
            quantity: that.Group3
          },
          report: data,
          comment: that.testMsg
        }).then((res) => {
          // console.log(res, 'put结果')
          if (res.status === ERR_OK) {
            // console.log(res)
            that.putImg(id)
          } else {
          }
        }).catch(error => {
          console.log(error)
        })
      }
    },

//      选中截图
    select(index, item) {
      this.selected = index
//        this.overlay.resize()
      d3.select('.graph-svg-component').remove()
      this.d3Rect.selectAll('rect').remove()
//        this.map .destroy()
      this.map.open({type: 'image', url: item.raw_file_path})
//        this.map.imageLoader.addJob({src: item.src, callback() { that.map.open({type: 'image', url :item.src}) }});
    },

//          删除截图
    remove(index, item) {
      console.log(item)
      let that = this
      this.miniImg.splice(index, 1)
      this.miniBlobImg.splice(index, 1)
      console.log(this.miniBlobImg)
      that.$http.delete(SCREENSHORTS + item.id + `/`).then((res) => {
        console.log(res, '删除')
        if (res.status === DELETE_OK) {
        } else {
        }
      }).catch(error => {
        console.log(error)
      })
    },

//      截图
    shortImg() {
      let img = this.map.drawer.canvas.toDataURL('image/png');
//        console.log(img);
      this.dataUrl.id = this.count++
      this.miniImg.push({id: this.dataUrl.id, raw_file_path: img})
      let that = this
      that.map.drawer.canvas.toBlob(function(blob) {
        that.dataUrl.id = that.count++
        that.miniBlobImg.push({id: that.dataUrl.id, raw_file_path: blob})
      }, 'image/jpeg', 0.95);
    },

// 截图提交
    putImg(id) {
      let that = this
      let lists = that.miniBlobImg
      // console.log(lists)
      if (lists.length === 0) {
        stores.set('reportId', that.algorithm.resultsId)
        that.$router.push('/report')
      } else {
        for (let i = 0; i < lists.length; i++) {
          let listItem = that.miniBlobImg[i].raw_file_path
          // console.log(listItem)
          let formData = new FormData()
          let file = new File([listItem], 'file.jpeg', {type: 'image/jpeg'})
          formData.append('raw_file_path', file)
          formData.append('result_id', id);
          let request = new XMLHttpRequest();
          request.open('POST', SCREENSHORTS)
          request.setRequestHeader(
            'Authorization', `JWT ${stores.get('tokenData').token}`
          );
          request.send(formData)
          request.onreadystatechange = function () {
            // console.log(request.responseText)
            if (request.status === 201) {
              stores.set('reportId', that.algorithm.resultsId)
//                console.log(request.responseText)
              that.$router.push('/report')
            }
          }
        }
      }
    },

// 获取左侧列表数据
    getList() {
      let that = this
      that.loading = true
      homeList().then((res) => {
        console.log(res, '左侧数据')
        that.loading = false
        if (res.status === ERR_OK) {
          that.data1 = res.data.results
          that.counts = res.data.count
          that.Cacucount = 0
          that.data1.forEach((item, index) => {
            if (item.algorithm_status === 'done') {
              that.Cacucount++
            }
          })
        } else {
        }
      }).catch(error => {
        this.loading = false
        console.log(error)
      })
    },

//  获取信息
    getInfor() {
      this.username = getUser().username
    },

// 收起左侧
    closeLeft() {
      let that = this
      that.refresh()
      that.status = !that.status
      if (that.status) {
        that.refresh()
        that.leftText = '收起病例'
      } else {
        that.leftText = '展开病例'
      }
    },

// 收起左侧
    closeLeft2() {
      let that = this
      that.status2 = !that.status2
      if (that.status2) {
        that.refresh()
        that.leftText2 = '收起标记'
      } else {
        that.leftText2 = '展开标记'
      }
    },

// 收起右侧
    closeRight() {
      let that = this
      that.inner = !that.inner
      if (that.inner) {
        that.refresh()
        that.reportText = '收起报告'
      } else {
        that.reportText = '展开报告'
      }
    },

// 调整高度
    getHeight() {
      this.$refs.item1.style.height = 30 + 'px';
      this.$refs.item3.style.marginTop = -135 + 'px';
      this.$refs.item5.style.marginTop = -44 + 'px';
    },

// 二维码
    createCode() {
      this.codes = !this.codes
    },

// 报告单显示
    checkReport() {
      this.checked = !this.checked
    },

//  关闭报告单
    closeReport() {
      this.checked = false
    },

// 移入
    removeImg(index, item) {
      this.show = index
    },

// 移出
    unShowImg(index, item) {
      this.show = !index
    },

//  缩放值
    sliderClick(value) {
      this.map.viewport.zoomTo(value, null, true)
    },

//      滑动缩放
    changes(value) {
      console.log(value)
      this.map.viewport.zoomTo(value, null, true)
    },

//      注销
    logout() {
      stores.remove('tipStatus')
      stores.remove('tokenData')
      stores.remove('userInfor')
      this.$router.push({path: `/login`})
    },

//      返回主页
    back() {
      this.$router.push('/home')
    },

// 下拉
    scroll(pos) {
      this.scrollY = pos.y
//        console.log(this.scrollY)
    },

//  刷新
    refresh() {
      this.$refs.leftWrapper.refresh()
      this.$refs.rightWrapper.refresh()
    },

//  加载更多
    loadMore() {
      console.log('加载更多')
//        if (!this.hasMore) {
//          return
//        }
//        const url = URL + `patients/`
//        let data = {
//          limit: 10
//        }
//        this.limit++
//        let that = this
//        axios.get(url, data).then(function (response) {
//          if (response.status === ERR_OK) {
//            console.log(response)
//            that.patientList = that.patientList.concat(response.data.results)
//            that._checkMore(response)
//          }
//        }).catch(function (error) {
//          console.log(error)
//        })
    },

//  下拉监听
    listScroll() {
      this.$emit('listScroll')
    },

// 报告单 //////////////////////////
//   满意
    satisfie(item) {
      this.unsatisfied = !item
    },

// 不满意
    unsatisfie(item) {
      this.satisfied = !item
    },

//    见宫颈管
    qul2(item) {
      if (item[0]) {
        // console.log(this.Group3)
        this.Group3 = []
      }
    },

// 未见宫颈
    qul3(item) {
      if (item[0]) {
        // console.log(this.Group3)
        this.Group2 = []
      }
    },

//      未见
    getTrees() {
      let code = this.$refs.Tree1.getCheckedNodes()
       // console.log(code)
      let that = this
      that.noseen = []
      if (code.length !== 0) {
        that.noseen.push(code[0].name)
      }
    },

//      鳞状细胞
    getTrees2() {
      let code = this.$refs.Tree2.getCheckedNodes()
      let that = this
      that.squamous = []
      if (code.length > 1) {
        code.forEach((item, index) => {
          // console.log(item.name)
          that.squamous.push(item.name)
        })
      }
      if (code.length === 1) {
        // console.log(code[0].name)
        that.squamous.push(code[0].name)
      }
      if (!code.length) {
        that.squamous = []
        // console.log(code)
      }
    },

//      腺细胞
    getTrees3() {
      let code = this.$refs.Tree3.getCheckedNodes()
      let that = this
      that.glandular = []
      if (code.length > 1) {
        code.forEach((item, index) => {
          // console.log(item.name)
         that.glandular.push(item.name)
        })
      }
      if (code.length === 1) {
        // console.log(code[0].name)
       that.glandular.push(code[0].name)
      }
      if (!code.length) {
        that.glandular = []
        // console.log(code)
      }
    },

//      生物病原体
    getTrees4() {
      let code = this.$refs.Tree4.getCheckedNodes()
       // console.log(code)
      let that = this
      that.pathogens = []
      if (code.length > 1) {
        code.forEach((item, index) => {
          // console.log(item.name)
          that.pathogens.push(item.name)
        })
      }
      if (code.length === 1) {
        // console.log(code[0].name)
        that.pathogens.push(code[0].name)
      }
      if (!code.length) {
        that.pathogens = []
        // console.log(code)
      }
    },

//      非肿瘤性
    getTrees5() {
      let code = this.$refs.Tree5.getCheckedNodes()
      let that = this
      that.cancer = []
      if (code.length > 1) {
        code.forEach((item, index) => {
          // console.log(item.name)
          that.cancer.push(item.name)
        })
      }
      if (code.length === 1) {
        // console.log(code[0].name)
        that.cancer.push(code[0].name)
      }
      if (!code.length) {
        that.cancer = []
      }
    },

//      萎缩
    getTrees6() {
      let code = this.$refs.Tree6.getCheckedNodes()
      // console.log(code)
      let that = this
      that.atrophy = []
      if (code.length) {
        that.atrophy.push(code[0].name)
      }
    },

// 瓦片图数据
    selectedMap(id, InforId) {
      let that = this
      that.$http.get(TITLELIST + id + `/`).then((res) => {
        if (res.status === ERR_OK) {
          console.log(res, '更新算法统计')
          that.labels = res.data.cad.classification
          let datas = res.data.cad.predictions
          that.predictions = res.data.cad.predictions
          if (res.data.cad.predictions && res.data.cad.groups) {
            that.cadArrs = []
            that.staticGroup = []
            let groups = res.data.cad.groups
            groups.forEach((item, index) => {
              that.staticGroup.push(item)
              that.cadArrs = that.cadArrs.concat(datas[item.label])
            })
          } else {
            that.cadArrs = []
            that.staticGroup = []
          }
          if (this.map.open(TileUrl + InforId + `/`)) {
            that.cadArrs = that.cadArrs.slice(0, 500)
//              console.log(that.cadArrs)
            that.svgLoad2(that.cadArrs)
            that.statistics(that.staticGroup)
            //            瓦图改变
            that.changeTiles()
//            瓦图打开
            that.openTiles()
          }
        } else {
        }
      })
        .catch(error => {
          console.log(error)
        })
    },

// 瓦图改变
    changeTiles() {
      let that = this
      that.map.addHandler('viewport-change', function (event) {
//            that.value = event.eventSource.viewport.getZoom()
        let values = event.eventSource.viewport.getZoom()
        that.sliderValue = parseInt(values * 100) / 100
//                console.log(that.map.viewport.getZoom())
//          console.log(that.cadArrs)
//          if (!that.cads.length) {
//            return false
//          }
        if (that.map.viewport.getZoom() < 3) {
//            console.log(event.eventSource.viewport.getZoom())
          that.cadWidth = 0.004
          that.d3Rect.selectAll('rect')
            .style('stroke-width', that.cadWidth)
            .style('fill', function (d, i) {
              return d.color
            })
            .style('opacity', '0.65')
            .attr('x', function (d, i) {
              return d.X - 0.25 * d.width
            })
            .attr('y', function (d, i) {
              return d.Y - 0.25 * d.height
            })
            .attr('width', function(d, i) {
              return d.width * 1.5
            })
            .attr('height', function(d, i) {
              return d.height * 1.5
            })
        }
        else {
          // console.log(that.d3Rect.selectAll('rect'))
          that.d3Rect.selectAll('rect')
            .style('fill', 'none')
            .style('stroke', function (d, i) {
              return d.color
            })
            .style('stroke-width', 0.0005)
            .attr('x', function (d, i) {
              return d.X
            })
            .attr('y', function (d, i) {
              return d.Y
            })
            .attr('width', function(d, i) {
              return d.width
            })
            .attr('height', function(d, i) {
              return d.height
            })
        }
      });
    },

//      瓦图打开
    openTiles() {
      let that = this
      that.map.addHandler('open', function (event) {
//          console.log('瓦图打开')
//          that.value = event.eventSource.viewport.getZoom()
        let values = event.eventSource.viewport.getZoom()
        that.sliderValue = parseInt(values * 100) / 100
//              that.map.viewport.zoomTo(10)
//              console.log(event.eventSource.viewport.getZoom())
        if (!that.cads.length) {
          return false
        }
        if (that.map.viewport.getZoom() < 3) {
          that.cadWidth = 0.004
          that.d3Rect.selectAll('rect')
            .style('stroke-width', that.cadWidth)
            .style('fill', function (d, i) {
              return d.color
            })
            .style('opacity', '0.6')
            .attr('x', function (d, i) {
              return d.X - 0.25 * d.width
            })
            .attr('y', function (d, i) {
              return d.Y - 0.25 * d.height
            })
            .attr('width', function(d, i) {
              return d.width * 1.5
            })
            .attr('height', function(d, i) {
              return d.height * 1.5
            })
//                console.log(update1)
        }
        else {
          that.d3Rect.selectAll('rect')
            .style('stroke-width', 0.0005)
            .style('fill', 'none')
            .style('stroke', function (d, i) {
              return d.color
            })
            .attr('x', function (d, i) {
              return d.X
            })
            .attr('y', function (d, i) {
              return d.Y
            })
            .attr('width', function(d, i) {
              return d.width
            })
            .attr('height', function(d, i) {
              return d.height
            })
        }
      });
    },

// 渲染算法数据
    svgLoad(cads) {
      let that = this
//        console.log(cads, '初始数据')
      that.data2 = cads
      that.overlay = that.map.svgOverlay() // svg
      that.d3Rect = d3.select(that.overlay.node())
//        console.log(that.overlay)
      let RectG = that.d3Rect.selectAll('.line')
        .data(cads)
        .enter().append('g')
        .attr('class', 'line')
//        console.log(RectG)
      RectG
        .append('rect')
        .attr('class', 'negative')
        .style('fill', 'none')
        .style('stroke', function (d, i) {
          return d.color
        })
        .style('stroke-width', that.cadWidth)
        .attr('x', function (d, i) {
          return d.X
        })
        .attr('y', function (d, i) {
          return d.Y
        })
        .attr('width', function (d, i) {
          return d.width
        })
        .attr('height', function (d, i) {
          return d.height
        })
    },

//      更新算法数据
    svgLoad2(cads) {
      let that = this
      that.data2 = cads
//        console.log(cads, '更新的数据')
      that.overlay = that.map.svgOverlay(); // svg
      that.overlay.resize()
      that.d3Rect = d3.select(that.overlay.node())
      let update1 = that.d3Rect.selectAll('rect')
      update1.remove()
      if (!cads.length) {
        return false
      }
      let update = that.d3Rect.selectAll('rect').data(cads)
      update.enter() // 新增的数据
        .append('rect')
        .attr('class', 'new')
        .style('fill', 'none')
        .style('stroke', function (d, i) {
          return d.color
        })
        .style('stroke-width', that.cadWidth)
        .attr('x', function(d, i) {
          return d.X
        })
        .attr('y', function(d, i) {
          return d.Y
        })
        .attr('width', function(d, i) {
          return d.width
        })
        .attr('height', function(d, i) {
          return d.height
        })
    },

//      筛选算法数据
    svgLoad3(cads) {
      let that = this
      that.data2 = cads
//        console.log(cads, '更新的数据')
//        console.log(that.d3Rect)
      that.overlay = that.map.svgOverlay() // svg
      that.overlay.resize()
      that.d3Rect = d3.select(that.overlay.node())
      let update1 = that.d3Rect.selectAll('rect')
      update1.remove()
      let update = that.d3Rect.selectAll('rect').data(cads)
      update.enter() // 新增的数据
        .append('rect')
        .attr('class', 'new')
        .style('fill', 'none')
        .style('stroke', function (d, i) {
          return d.color
        })
        .style('stroke-width', that.cadWidth)
        .attr('x', function(d, i) {
          return d.X
        })
        .attr('y', function(d, i) {
          return d.Y
        })
        .attr('width', function(d, i) {
          return d.width
        })
        .attr('height', function(d, i) {
          return d.height
        })
    },

    ...mapMutations({
      setList: 'SET_SINGER',
      setAlgorithm: 'SET_AlGOR_MODE',
      setCurrent: 'SET_CURRENT'
    })
  },
  computed: {
    comments() {
      return this.comment
    },
    testMsg() {
       // console.log(this.comment, '获取的数据')
        return this.noseen + this.glandular + this.squamous + this.cancer + this.pathogens + this.atrophy
    },
    ...mapGetters([
      'list',
      'sockets',
      'algorithm',
      'listIds',
      'currentList',
      'homesokets'
    ])
  }
}
