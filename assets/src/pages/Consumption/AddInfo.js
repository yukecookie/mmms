import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import List from '@/components/List';
import Filter from '@/components/Filter';
import globalStyles from '@/global.less';

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class AddInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    this.defaultTimeArea = [
      moment(
        moment()
          .subtract(90, 'days')
          .format('YYYY-MM-DD')
      ),
      moment(moment().format('YYYY-MM-DD 23:59:59')),
    ];
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }
    });
  };

  /**
   *  Search
   * @param param
   */
  handleQueryData(param) {
    const { dispatch } = this.props;
    dispatch({
      type: 'consumptionInfo/fetchConsumptionInfo',
      payload: {
        ...param,
      },
    });
  }

  render() {
    const {
      loading,
      consumptionInfo: {
        // pagination,
        // query,
        // selectedRowKeys,
        consumptionList,
      },
      form,
      // form: {
      //   setFieldsValue,
      // },
    } = this.props;
    const filterProps = {
      // 查询过滤条件
      hideSubmit: false,
      form,
      formItemLayout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
      },
      onFilterChange: fields => {
        this.handleQueryData({ queryData: { ...fields } });
      },
      filters: [
        {
          name: formatMessage({ id: 'form.consumption.orderCode.label' }), // 订单编号
          field: 'orderCode',
        },
        {
          name: formatMessage({ id: 'form.consumption.cardNum.label' }), // 会员卡号
          field: 'cardNum',
        },
        {
          name: formatMessage({ id: 'form.consumption.amount.label' }), // 消费金额
          field: 'amount',
        },
        {
          name: formatMessage({ id: 'form.consumption.productType.label' }), // 商品类型
          field: 'productType',
        },
        {
          name: formatMessage({ id: 'form.consumption.orderCreationDate.label' }), // 下单时间
          field: 'orderCreationDateMin__orderCreationDateMax',
          type: 'range-picker',
          // col: 2,
          span: 2,
          inputProps: {
            showTime: {
              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
            },
          },
        },
      ],
    };
    const listProps = {
      dataSource: consumptionList,
      // pagination: pagination.total ? pagination : false,
      loading: loading.fetchDeliverOrderList,
      scroll: { y: 600, x: 4000 },
      rowKey: 'shippingName',
      rowSelection: {
        selectedRowKeys: [], // 选中的keys
        onChange: this.handleRowSelectChange, // 选定项改变传入index
        onCleanSelectedKeys: () => this.handleRowSelectChange([], []),
        getCheckboxProps: record => ({
          disabled: record.disabled,
        }),
      },
      onChange: page => {
        this.handleQueryData({
          queryData: {
            page: page.current,
            pageSize: page.pageSize,
            orderField: page.orderField,
            orderMethod: page.orderMethod && page.orderMethod.replace('end', ''),
            // ...query,
          },
          pageFlag: true, // 分页查询标记
        });
      },
      columns: [
        {
          title: formatMessage({ id: 'form.index.label' }), // index序号
          width: 60,
          key: 'index',
          render: (val, record, index) => index + 1,
        },
        {
          title: formatMessage({ id: 'form.consumption.orderCode.label' }), // 订单编号
          width: 150,
          dataIndex: 'orderCode',
          key: 'orderCode',
        },
        {
          title: formatMessage({ id: 'form.consumption.cardNum.label' }), // 会员卡号
          width: 110,
          dataIndex: 'logisticsCompany',
          key: 'logisticsCompany',
        },
        {
          title: formatMessage({ id: 'form.consumption.amount.label' }), // 消费金额
          width: 110,
          dataIndex: 'logisticNum',
          key: 'logisticNum',
        },
        {
          title: formatMessage({ id: 'form.consumption.productType.label' }), // 商品类型
          width: 120,
          dataIndex: 'pointOfService',
          key: 'pointOfService',
          // render: (item, record) => record.posInfo && record.posInfo.displayName,
        },
        {
          title: formatMessage({ id: 'form.consumption.orderCreationDate.label' }), // 下单时间
          width: 150,
          dataIndex: 'orderCreationDate',
          sorter: true,
          key: 'orderCreationDate',
        },
      ],
    };
    return (
      <PageHeaderWrapper
        title={<FormattedMessage id="app.forms.addInfo.title" />}
        content={<FormattedMessage id="app.forms.addInfo.description" />}
      >
        <Card bordered={false}>
          <div className={globalStyles.filter}>
            <Filter {...filterProps} />
          </div>
          <div className={globalStyles.table}>
            <List {...listProps} />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AddInfo;
