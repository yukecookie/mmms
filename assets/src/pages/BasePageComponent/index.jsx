/* eslint-disable react/jsx-filename-extension, no-else-return */
import React, { PureComponent } from 'react';
import { Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import ActionButton from '../../components/ActionButton';
// import globalStyles from '../../common/globalStyles.less';
// import styles from './ReturnApply.less';
import Filter from '../../components/Filter';
import List from '../../components/List';
// import ActionButton from '../../components/ActionButton';
// import { isAdminUser, getCurrentUserPrivileges } from '../../utils/Auth/auth';
import { getNewDataMap } from '../../utils/utils';

export default class BasePageComponent extends PureComponent {
  constructor(props, options = {}) {
    super(props);
    this.options = options;
  }

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'global/fetchInitEnumData',
    //   payload: this.options.enumTypeCodes,
    // }).then(() => {
    //   if (this.onAfterEnumLoad) {
    //     setTimeout(this.onAfterEnumLoad, 0);
    //   }
    // });
  }

  getTableRowSelection = () => {
    const {
      [this.options.namespace]: { selectedRowKeys },
    } = this.props;
    return {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      onCleanSelectedKeys: () => this.handleRowSelectChange([], []),
    };
  };

  // getActionButtons = () => {
  //   let actionsButtons = this.props.pageConfig.children
  //     .filter(item => item.type === 'button');

  //   if (!isAdminUser()) {
  //     const privilegeList = getCurrentUserPrivileges();
  //     actionsButtons = actionsButtons.filter((item) => {
  //       return privilegeList.includes(item.hashCode);
  //     });
  //   }
  //   const actionsOptions = this.getActionsOptions ? this.getActionsOptions() : {};
  //   actionsButtons = actionsButtons.map((item) => {
  //     if (item.render) {
  //       return item.render(item);
  //     } else {
  //       return <ActionButton color={item.color} data-code={item.path} key={item.path} {...actionsOptions[item.path]}>{item.name}</ActionButton>;
  //     }
  //   });

  //   if (actionsButtons.length) {
  //     return actionsButtons;
  //   } else {
  //     return false;
  //   }
  // }

  handleRefreshList = () => {
    const {
      [this.options.namespace]: { query, pagination },
    } = this.props;
    this.handleQueryList({
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...query,
    });
  };

  handleQueryList = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.options.namespace}/fetchList`,
      payload: fields,
    });
  };

  handleFilterChange = fields => {
    this.handleQueryList({ ...fields });
    if (this.onAfterFilter) {
      setTimeout(() => this.onAfterFilter(fields), 0);
    }
  };

  handleRowSelectChange = (newSelectedRowKeys, selectedRows) => {
    const {
      dispatch,
      [this.options.namespace]: { dataMap, selectedRowKeys },
    } = this.props;
    const newDataSourceMap = getNewDataMap(
      selectedRows,
      dataMap,
      this.options.rowKey,
      selectedRowKeys,
      newSelectedRowKeys
    );
    dispatch({
      type: `${this.options.namespace}/updateState`,
      payload: {
        selectedRowKeys: newSelectedRowKeys,
        dataMap: newDataSourceMap,
      },
    });
  };

  handleTableChange = page => {
    const {
      [this.options.namespace]: { query },
    } = this.props;
    this.handleQueryList({
      page: page.current,
      pageSize: page.pageSize,
      ...query,
    });
  };

  renderPageHeaderLayout = () => {
    const {
      [this.options.namespace]: { dataSource, pagination },
      loading,
      form,
    } = this.props;
    return (
      <PageHeaderLayout
        // wrapperClassName={this.options.styles[this.options.namespace]}
        filter={
          this.getFilters && (
            <Card>
              {/* {actions &&
              <div className={globalStyles.operator} style={{ marginBottom: '10px' }}>
                {actions}
              </div>} */}
              <Filter
                col={4}
                form={form}
                loading={loading.effects[`${this.options.namespace}/fetchList`]}
                onFilterChange={this.handleFilterChange}
                filters={this.getFilters()}
              />
            </Card>
          )
        }
        table={
          this.getTableRowSelection && (
            <Card>
              <List
                dataSource={dataSource}
                pagination={pagination.total ? pagination : false} // 数据页
                loading={loading.effects[`${this.options.namespace}/fetchList`]}
                rowSelection={this.getTableRowSelection()}
                // scroll: { x: 3380 },
                rowKey={this.options.rowKey}
                onChange={this.handleTableChange}
                columns={this.getColumns()}
              />
            </Card>
          )
        }
      />
    );
  };

  render() {
    const {
      [this.options.namespace]: { dataSource = [], pagination },
      loading,
      form,
    } = this.props;
    // const actions = this.getActionButtons();
    return (
      <PageHeaderLayout
        wrapperClassName={this.options.styles[this.options.namespace]}
        filter={
          this.getFilters && (
            <Card>
              {/* {actions &&
              <div className={globalStyles.operator} style={{ marginBottom: '10px' }}>
                {actions}
              </div>} */}
              <Filter
                col={4}
                form={form}
                extraButtons={this.getExtraButtons()}
                loading={loading.effects[`${this.options.namespace}/fetchList`]}
                onFilterChange={this.handleFilterChange}
                filters={this.getFilters()}
              />
            </Card>
          )
        }
        table={
          this.getTableRowSelection && (
            <Card>
              <List
                dataSource={dataSource}
                pagination={pagination.total ? pagination : false} // 数据页
                loading={loading.effects[`${this.options.namespace}/fetchList`]}
                rowSelection={this.getTableRowSelection()}
                // scroll: { x: 3380 },
                rowKey={this.options.rowKey}
                onChange={this.handleTableChange}
                columns={this.getColumns()}
              />
            </Card>
          )
        }
      />
    );
  }
}
