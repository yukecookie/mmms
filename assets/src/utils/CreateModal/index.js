/* eslint-disable */
import { formatMessage } from 'umi/locale';
import React, { PureComponent } from 'react';
import * as ReactDOM from 'react-dom';
import { Form, Modal, message, Button } from 'antd';
import InputGroups from '@/components/InputGroups';

const IS_REACT_16 = !!ReactDOM.createPortal;

@Form.create()
class CreateModal extends PureComponent {
  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOk = this.handleOk.bind(this);
    const { inputItems } = this.props;
    this.promiseMap = {};
    const newInputItems = inputItems.map(item => {
      // if (item.type === 'lov-select') {
      //   return {
      //     ...item,
      //     lovProps: {
      //       ...item.lovProps,
      //       // form,
      //     },
      //   };
      // }
      if (item.dataSourcePromise) {
        this.promiseMap[item.field] = item.dataSourcePromise().then(data => {
          if (Array.isArray(data)) {
            return data;
          }
          if (data.success) {
            return data.data;
          } else {
            message.error(data.message);
            return [];
          }
        });
        return {
          ...item,
          dataSource: [],
        };
      }
      return item;
    });
    this.state = {
      inputItems: newInputItems,
      loading: false,
      // loadingEnum: Object.keys(this.promiseMap).length,
    };
  }

  componentDidMount() {
    const { inputItems } = this.state;
    const promiseFields = Object.keys(this.promiseMap);
    if (promiseFields.length) {
      Promise.all(Object.values(this.promiseMap)).then(enumDatas => {
        const newInputItems = inputItems.map((item, index) => {
          const enumField = promiseFields[index];
          if (item.field === enumField) {
            return {
              ...item,
              dataSource: enumDatas[index],
            };
          }
          return item;
        });
        this.setState({
          inputItems: newInputItems,
          // loadingEnum: false,
        });
      });
    }
  }

  handleCancel(...args) {
    const { onCancel, close } = this.props;
    if (onCancel) {
      onCancel(...args);
    }
    close(...args);
  }

  handleOk() {
    const { form, onHandleOk, close } = this.props;
    return new Promise((resolve, reject) => {
      form.validateFields((err, value) => {
        if (err) {
          return;
        }
        this.setState({
          loading: true,
        });
        const okRes = onHandleOk(value);
        if (!okRes) {
          resolve();
          this.setState({
            loading: false,
          });
          close();
        } else if (okRes.then) {
          return okRes.then(
            () => {
              resolve();
              this.setState({
                loading: false,
              });
              close();
            },
            e => {
              this.setState({
                loading: false,
              });
              reject(e);
            }
          );
        } else if (okRes) {
          close();
          reject();
        }
        // this.props.close();
      });
    });
  }

  render() {
    const {
      visible,
      title,
      width = 878,
      col = 2,
      form,
      buttonOnclick,
      button,
      ...modalProps
    } = this.props;
    const { inputItems, loading } = this.state;
    const inputGroupsProps = {
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      },
      form,
      col,
      inputItems,
    };
    return (
      <Modal
        {...modalProps}
        width={width}
        title={<h3>{title}</h3>}
        visible={visible}
        confirmLoading={loading}
        className={modalProps.className}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
        cancelText={formatMessage({ id: 'app.filter.btn_cancel' })}
        okText={formatMessage({ id: 'app.filter.btn_ok' })}
      >
        {button ? (
          <Button type="primary" onClick={buttonOnclick}>
            {button}
          </Button>
        ) : (
          ''
        )}
        <InputGroups {...inputGroupsProps} />
      </Modal>
    );
  }
}

export const showCreateModal = function(config) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  function destroy(...args) {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
    const triggerCancel = args && args.length && args.some(param => param && param.triggerCancel);
    if (config.onCancel && triggerCancel) {
      config.onCancel(...args);
    }
  }
  function render(props) {
    ReactDOM.render(<CreateModal {...props} />, div);
  }
  function close(...args) {
    if (IS_REACT_16) {
      render({ ...config, close, visible: false, afterClose: destroy.bind(this, ...args) });
    } else {
      destroy(...args);
    }
  }
  render({ ...config, visible: true, close });
  return {
    destroy: close,
  };
};
