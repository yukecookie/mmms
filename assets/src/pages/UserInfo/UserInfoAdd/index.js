/**
 * author: 朱港回
 * time: 2019/03/26
 * feature: 会员信息添加
 */

import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { formatMessage } from 'umi/locale';
import { Form, Button, message, Modal, Divider } from 'antd';
import BasePageComponent from '../../BasePageComponent';
import { queryUserNameVerify } from '@/services/userInfo';
import styles from './UserInfoAdd.less';
import showCreateModal from '@/utils/CreateModal';

const namespace = 'userInfoAdd';

@connect(state => ({
  [namespace]: state[namespace],
  loading: state.loading,
  currentUser: state.user.currentUser,
}))
@Form.create()
class UserInfoAdd extends BasePageComponent {
  constructor(props) {
    const rowKey = 'cardNum';
    super(props, {
      namespace,
      rowKey,
      styles,
    });
  }

  componentDidMount() {
    this.loadInitData();
  }

  // 刷新
  loadInitData = () => {
    this.props.dispatch({
      type: `${namespace}/fetchList`,
    });
  };

  // 手机号码校验 格式与重复
  handleMobileVerify = (rule, value, callback) => {
    const re = /^(?=\d{11}$)^1(?:3\d|4[57]|5[^4\D]|66|7[^249\D]|8\d|9[89])\d{8}$/;
    if (!re.test(value)) {
      callback('手机号格式不正确');
    } else {
      this.props
        .dispatch({
          type: `${namespace}/fetchMobileVerify`,
          payload: { mobile: value },
        })
        .then(res => {
          if (res.isExistence) {
            callback('手机号已被注册');
          } else {
            callback();
          }
        });
    }
    callback();
  };

  // 用户名校验 重复
  handleUserNameVerify = (rule, value, callback) => {
    queryUserNameVerify({ userName: value }).then(res => {
      if (res.isExistence) {
        callback('用户名已被注册');
      } else {
        callback();
      }
    });
    // this.props.dispatch({
    //   type: `${namespace}/fetchUserNameVerify`,
    //   payload: {userName: value},
    // }).then((res) => {
    //   if(res.isExistence) {
    //     callback('用户名已被注册');
    //   }
    // });
    callback();
  };

  handleAdd = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/fetchId`,
    }).then(result => {
      const val = (result.id + 1).toString();
      const zero = 7 - parseInt(val.length, 0);
      let userId = 'S1';
      let i;
      for (i = 0; i < zero; i += 1) {
        userId += '0';
      }
      userId += val;
      showCreateModal({
        title: formatMessage({ id: 'form.userInfo.addModal.title' }),
        width: 800,
        col: 2,
        inputItems: [
          {
            name: formatMessage({ id: 'form.cardNum.label' }), // 会员卡号
            field: 'cardNum',
            value: userId,
            placeholder: formatMessage({ id: 'app.filter.text_pleaseInput' }),
            rules: [{ required: true, message: formatMessage({ id: 'form.validation.required' }) }],
            inputProps: {
              disabled: true,
            },
          },
          {
            name: formatMessage({ id: 'form.userInfo.userName.label' }), // 用户名 自动生成 no disabled
            field: 'userName',
            placeholder: formatMessage({ id: 'app.filter.text_pleaseInput' }),
            // rules: [
            //   (rule, value, callback, source, options) => {
            //     if (!value) {
            //       callback('用户名不能为空');
            //     }
            //     this.props.dispatch({
            //       type: `${namespace}/fetchUserNameVerify`,
            //       payload: {userName: value},
            //     }).then((res) => {
            //       if(res.isExistence) {
            //         callback('用户名已被注册');
            //       }
            //     });
            //     callback();
            //   }
            // ],
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'form.validation.required' }),
              },
              {
                validator: this.handleUserNameVerify,
              },
            ],
            // rules: [{ required: true, message: formatMessage({ id: 'form.validation.required' }) }],
            value: `name_${userId}`,
          },
          {
            name: formatMessage({ id: 'form.userInfo.name.label' }), // 会员姓名
            field: 'name',
            placeholder: formatMessage({ id: 'app.filter.select_pleaseChoose' }),
            rules: [{ required: true, message: formatMessage({ id: 'form.validation.required' }) }],
          },
          {
            name: formatMessage({ id: 'form.userInfo.mobile.label' }), // 手机号码
            field: 'mobile',
            placeholder: formatMessage({ id: 'app.filter.text_pleaseInput' }),
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'form.validation.required' }),
              },
              {
                validator: this.handleMobileVerify,
              },
            ],
            // rules: [{ required: true, message: formatMessage({ id: 'form.validation.required' }) }],
          },
          {
            name: formatMessage({ id: 'form.userInfo.sex.label' }), // 性别
            type: 'radio',
            field: 'sex',
            value: 'true',
            // rules: [{ required: true, message: formatMessage({ id: 'form.validation.required' }) }],
            dataSource: [
              {
                text: '男',
                value: 'true',
              },
              {
                text: '女',
                value: 'false',
              },
            ],
          },
          {
            name: formatMessage({ id: 'form.userInfo.birth.label' }), // 生日
            type: 'date',
            field: 'birth',
            inputProps: {
              placeholder: formatMessage({ id: 'app.filter.text_pleaseInput' }),
              showTime: true,
              format: 'YYYY-MM-DD',
            },
          },
          {
            name: formatMessage({ id: 'form.userInfo.email.label' }), // 邮箱
            field: 'email',
            placeholder: formatMessage({ id: 'app.filter.text_pleaseInput' }),
          },
        ],
        onHandleOk: values => {
          // const { dispatch } = this.props;
          dispatch({
            type: `${namespace}/fetchAddUserInfo`,
            payload: values,
          }).then(res => {
            if (res.success) {
              message.success(res.message || '添加成功');
              this.loadInitData(); // 刷新列表
            } else {
              Modal.error({
                title: '添加失败',
                content: res.message,
              });
            }
          });
        },
      });
    });
  };

  getExtraButtons = () => [
    <Button
      type="primary"
      ghost
      icon="plus"
      key="add"
      className={styles.addUserBtn}
      onClick={this.handleAdd}
    >
      {formatMessage({ id: 'form.new.btn' })}
    </Button>,
  ];

  getFilters = () => [
    {
      name: formatMessage({ id: 'form.cardNum.label' }), // 会员卡号
      field: 'cardNum',
    },
    {
      name: formatMessage({ id: 'form.userInfo.mobile.label' }), // 手机号码
      field: 'mobile',
    },
  ];

  getColumns = () => [
    {
      title: formatMessage({ id: 'form.index.label' }), // index序号
      width: 60,
      key: 'index',
      render: (val, record, index) => index + 1,
    },
    {
      title: formatMessage({ id: 'form.cardNum.label' }), // 会员卡号
      width: 150,
      dataIndex: 'cardNum',
      key: 'cardNum',
    },
    {
      title: formatMessage({ id: 'form.userInfo.cardBalance.label' }), // 卡金额
      width: 110,
      dataIndex: 'cardBalance',
      key: 'cardBalance',
    },
    {
      title: formatMessage({ id: 'form.userInfo.vipAmount.label' }), // 消费总额
      width: 110,
      dataIndex: 'vipAmount',
      key: 'vipAmount',
    },
    {
      title: formatMessage({ id: 'form.userInfo.vipCredit.label' }), // 累计积分
      width: 120,
      dataIndex: 'vipCredit',
      key: 'vipCredit',
    },
    {
      title: formatMessage({ id: 'form.userInfo.cardActiveDate.label' }), // 开卡时间
      width: 150,
      dataIndex: 'cardActiveDate',
      sorter: true,
      key: 'cardActiveDate',
    },
    {
      title: formatMessage({ id: 'form.userInfo.operation.label' }), // 操作
      width: 150,
      // dataIndex: 'operation',
      key: 'operation',
      render: (text, record) => (
        <Fragment>
          <Link to={`/info/update-user?userName=${record.cardNum}`}>修改</Link>
          <Divider type="vertical" />
          <Link to={`/info/del-user?userName=${record.cardNum}`}>删除</Link>
        </Fragment>
      ),
    },
  ];
}

export default UserInfoAdd;
