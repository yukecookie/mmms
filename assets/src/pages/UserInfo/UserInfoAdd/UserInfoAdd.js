/**
 * author: 朱港回
 * time: 2019/03/26
 * feature: 会员信息添加
 */

import React, { Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Form, Button, message, Modal, Divider } from 'antd';
import BasePageComponent from '../../BasePageComponent';
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
    const rowKey = 'orderCode';
    super(props, {
      namespace,
      rowKey,
      styles,
    });
  }

  handleAdd = () => {
    showCreateModal({
      title: formatMessage({ id: 'form.userInfo.addModal.title' }),
      width: 800,
      col: 2,
      inputItems: [
        {
          name: formatMessage({ id: 'form.cardNum.label' }), // 会员卡号
          field: 'orderCode',
          placeholder: formatMessage({ id: 'app.filter.text_pleaseInput' }),
          rules: [{ required: true, message: formatMessage({ id: 'form.validation.required' }) }],
        },
        {
          name: formatMessage({ id: 'form.userInfo.userName.label' }), // 用户名 自动生成
          field: 'cardNum',
          placeholder: formatMessage({ id: 'app.filter.text_pleaseInput' }),
          rules: [{ required: true, message: formatMessage({ id: 'form.validation.required' }) }],
        },
        {
          name: formatMessage({ id: 'form.userInfo.name.label' }), // 会员姓名
          field: 'productType',
          placeholder: formatMessage({ id: 'app.filter.select_pleaseChoose' }),
          rules: [{ required: true, message: formatMessage({ id: 'form.validation.required' }) }],
        },
        {
          name: formatMessage({ id: 'fform.userInfo.mobile.label' }), // 手机号码
          field: 'amount',
          placeholder: formatMessage({ id: 'app.filter.text_pleaseInput' }),
          rules: [{ required: true, message: formatMessage({ id: 'form.validation.required' }) }],
        },
        {
          name: formatMessage({ id: 'form.userInfo.sex.label' }), // 性别
          type: 'radio',
          field: 'isScore',
          value: 'false',
          dataSource: [
            {
              text: '是',
              value: 'true',
            },
            {
              text: '否',
              value: 'false',
            },
          ],
        },
        {
          name: formatMessage({ id: 'form.userInfo.email.label' }), // 邮箱
          field: 'amount1',
          placeholder: formatMessage({ id: 'app.filter.text_pleaseInput' }),
        },
        {
          name: formatMessage({ id: 'form.userInfo.qq.label' }), // qq
          type: 'date',
          field: 'orderCreationDate',
          inputProps: {
            showTime: true,
            format: 'YYYY-MM-DD HH:mm:ss',
            placeholder: formatMessage({ id: 'app.filter.select_pleaseChoose' }),
          },
          // formItemLayout: {
          //   labelCol: { span: 10 },
          //   wrapperCol: { span: 14 },
          // },
        },
      ],
      onHandleOk: values => {
        const { dispatch } = this.props;
        dispatch({
          type: `${this.options.namespace}/addConsumptionInfo`,
          payload: values,
        }).then(
          res => {
            message.success(res.message || '添加成功');
            // this.loadInitData();// 刷新列表
            return res;
          },
          err => {
            Modal.error({
              title: '添加失败',
              content: err.message,
            });
            return Promise.reject(err);
          }
        );
      },
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
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>配置</a>
          <Divider type="vertical" />
          <a href="">订阅警报</a>
        </Fragment>
      ),
    },
  ];
}

export default UserInfoAdd;
