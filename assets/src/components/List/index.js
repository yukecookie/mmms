/**
 * Author: yunqiang.wu
 * Create on: 2017-9-05 17:40
 * List通用组件
 */
import React, { PureComponent } from 'react';
import { Table, Alert } from 'antd';
import { formatMessage } from 'umi/locale';
import classnames from 'classnames';
import styles from './style.less';

class List extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    // clean state
    if (!nextProps.selectedRows || nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
      });
    }
  }

  handleOnChange = (pagination, filters, sortInfo) => {
    const { onChange } = this.props;
    if (!onChange) {
      return;
    }

    onChange({
      ...pagination,
      orderField: sortInfo.columnKey,
      orderMethod: sortInfo.order,
    });
  };

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    // const totalCallNo = selectedRows.reduce((sum, val) => {
    //   return sum + parseFloat(val.callNo, 10);
    // }, 0);

    const { onSelectRow, rowSelection } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }
    if (rowSelection && rowSelection.onChange) {
      rowSelection.onChange(selectedRowKeys, selectedRows);
    }
    if (!rowSelection) {
      this.setState({ selectedRowKeys });
    }
  };

  cleanSelectedKeys = () => {
    const { rowSelection } = this.props;
    if (rowSelection && rowSelection.onCleanSelectedKeys) {
      rowSelection.onCleanSelectedKeys();
    } else {
      this.handleRowSelectChange([], []);
    }
  };

  render() {
    // onRowDoubleClick={(item:any) => { onEditItem(item) }}
    const { description, scrollWidth, wrapStyle, singleCol, ...tableProps } = this.props;
    const newTableProps = {
      ...tableProps,
    };
    // if (sortInfo) {
    //   newTableProps.columns = tableProps.columns.map((item) => {
    //     if (sortInfo[item.dataIndex]) {
    //       return {
    //         ...item,
    //         sorter: true,
    //       };
    //     }
    //     return item;
    //   });
    // }
    const { selectedRowKeys } = this.state;
    if (newTableProps.pagination) {
      newTableProps.pagination = {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100', '300', '500'],
        showTotal: (total, range) =>
          formatMessage(
            { id: 'app.site.tableShowTotal' },
            {
              total,
              rangeStart: range[0],
              rangeEnd: range[1],
            }
          ),
        ...tableProps.pagination,
      };
    }

    if (newTableProps.bordered) {
      newTableProps.size = 'small';
    }

    if (singleCol) {
      // newTableProps.columns[0].className = styles.singleCol;
      // newTableProps.rowClassName = styles.singleCol;
      newTableProps.scroll = { x: false };
    } else if (newTableProps.scroll === false) {
      delete newTableProps.scroll;
    } else {
      const newScrollWidth =
        scrollWidth || tableProps.columns.reduce((result, a) => result + a.width, 0);
      newTableProps.scroll = { ...newTableProps.scroll, x: newScrollWidth };
    }

    const rowSelection =
      tableProps.rowSelection === null
        ? undefined
        : tableProps.rowSelection || {
            selectedRowKeys,
            onChange: this.handleRowSelectChange,
            getCheckboxProps: record => ({
              disabled: record.disabled,
            }),
          };
    return (
      <div style={{ width: '100%', ...wrapStyle }}>
        {rowSelection !== undefined && (
          <Alert
            message={
              <div className={styles.info}>
                {formatMessage({ id: 'app.list.message_hasChoosePart1' })}{' '}
                <a style={{ fontWeight: 600 }}>{rowSelection.selectedRowKeys.length} </a>
                {formatMessage({ id: 'app.list.message_hasChoosePart2' })}&nbsp;&nbsp;
                {rowSelection.selectedRowKeys.length > 0 && (
                  <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                    {formatMessage({ id: 'app.list.btn_clear' })}
                  </a>
                )}
                {description && (
                  <span className={styles.descript}>&nbsp;&nbsp;&nbsp;&nbsp;{description}</span>
                )}
              </div>
            }
            type="info"
            showIcon
            style={{ marginBottom: 8 }}
          />
        )}
        <Table
          rowSelection={rowSelection}
          {...newTableProps}
          onChange={this.handleOnChange}
          className={classnames({
            [styles.table]: true,
            [styles.singleCol]: singleCol,
          })}
        />
      </div>
    );
  }
}

export default List;
