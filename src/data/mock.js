/** 演示用静态数据 */
export const publicCases = [
  {
    id: 'SL-2026-0102',
    type: '邻里纠纷',
    acceptedAt: '2026-03-28',
    mediators: '张**、李**',
    status: '调解中',
  },
  {
    id: 'SL-2026-0098',
    type: '物业矛盾',
    acceptedAt: '2026-03-25',
    mediators: '王**',
    status: '已办结',
  },
]

export const processNodes = [
  { time: '2026-03-28 09:30', title: '受理登记', detail: '属地群英已确认承接' },
  { time: '2026-03-29 14:00', title: '现场调解', detail: '双方到场，乡贤主持' },
  { time: '2026-03-30 10:00', title: '跟进协调', detail: '电话沟通补充意见' },
]

export const resultsPublic = [
  {
    id: 'SL-2026-0098',
    type: '物业矛盾',
    closedAt: '2026-03-27',
    summary: '就公共区域堆放问题达成清理与巡查约定，双方签字确认。',
  },
]

export const myCases = [
  {
    id: 'SL-2026-0105',
    title: '楼道杂物堆放',
    status: '待调解',
    nextStep: '4月3日 15:00 社区调解室',
  },
]

export const qunyingInbox = [
  {
    id: 'SL-2026-0106',
    summary: '相邻漏水争议，诉求：修复并赔偿部分损失',
    submittedAt: '2026-04-01',
    aiHint: '争议焦点：责任认定、损失范围；可参考相邻关系、物权相关条文。',
  },
]

export const lawArticles = [
  { id: 1, title: '民法典·相邻关系（节选）', snippet: '不动产权利人应当为相邻权利人用水、排水、通行等提供必要便利……' },
  { id: 2, title: '人民调解法·调解原则', snippet: '人民调解委员会调解民间纠纷，应当遵循自愿、合法、平等原则……' },
]

export const templates = ['邻里纠纷调解协议书', '物业纠纷调解协议书', '家庭矛盾调解记录表']

export const adminStats = {
  total: 128,
  resolvedRate: 94.5,
  satisfaction: 4.7,
  byType: [
    { name: '邻里', value: 42 },
    { name: '物业', value: 31 },
    { name: '家庭', value: 28 },
    { name: '其他', value: 27 },
  ],
}

export const courses = [
  { title: '调解程序与笔录规范', duration: '25 分钟', type: '视频' },
  { title: '常见物业纠纷法律要点', duration: '18 分钟', type: '直播回放' },
]
