import React from 'react'
import { connect } from 'react-redux'
import { login, getUser } from './service'
import { Form, Input, Button, Checkbox, message } from 'antd'
import { changeMenu } from '@/utils/action'
import { StyleLogin } from './style'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      account: {
        username: '',
        password: ''
      }
    }
  }

  componentDidMount() {
    this.props.changeMenu('login')
    const { user } = this.props
    if (user) this.props.history.replace('/')
  }

  handleSubmit = async e => {
    e.preventDefault()
    const { account } = this.state
    if (account.username === '') {
      message.warning('请输入用户名')
      return
    }
    if (account.password === '') {
      message.warning('请输入密码')
      return
    }
    const res = await login(account)
    localStorage.setItem('AI_ADC_TOKEN', res.token)
    const user = await getUser(res.token)
    localStorage.setItem('AI_ADC_USER', JSON.stringify(user))
    // 登录完成，需要router重新初始化
    window.location.href = '/'
  }

  onFormInput = (key, value) => {
    const { account } = this.state
    account[key] = value
    this.setState({ account })
  }

  render() {
    const { account } = this.state

    return (
      <StyleLogin>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            <h2 style={{ color: '#fff' }}>Login</h2>
          </Form.Item>
          <Form.Item>
            <Input
              value={account.username}
              onChange={e => this.onFormInput('username', e.target.value)}
              placeholder='Username'
            />
          </Form.Item>
          <Form.Item>
            <Input.Password
              value={account.password}
              onChange={e => this.onFormInput('password', e.target.value)}
              placeholder='Password'
            />
          </Form.Item>
          <Form.Item>
            <Checkbox defaultChecked={true}>Remember me</Checkbox>
            <Button type='primary' htmlType='submit'>
              Login
            </Button>
          </Form.Item>
        </Form>
      </StyleLogin>
    )
  }
}

const mapStateToProps = state => ({
  user: state.Init.user
})
const mapDispatchToProps = { changeMenu }
export default connect(mapStateToProps, mapDispatchToProps)(Login)
