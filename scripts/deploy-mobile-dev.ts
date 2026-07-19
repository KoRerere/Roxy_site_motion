import { deploy } from './deploy-util'

deploy({
  name: 'roxy_home_m_dev',
  displayName: '移动端测试',
  isProd: false,
  remotePath: '/var/www',
  ecosystem: {
    env: {
      PORT: 3006,
    },
  },
  ssh: {
    host: '8.218.38.36',
    username: 'root',
    password: 'K9#b$mP2*vQ',
  },
})
