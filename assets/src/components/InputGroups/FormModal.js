/**
 * author:  learnwy, Yang.Wang, 汪洋
 * time: 2018-01-25
 * feature: FormModal
 * email: learnwy@gamil.com,yang.wang06@hand-china.com
 */
import React, { PureComponent } from 'react';
import { Form, Modal } from 'antd';
import InputGroups from './index';

/**
 * FormModal.需要一个InputGroupProps, 不需要 form 属性
 */

@Form.create()
class FormModal extends PureComponent {
  render() {
    const {
      form,
      inputGroupsProps,
      maskClosable,
      visible,
      title,
      onOk,
      onCancel,
      appendChild,
    } = this.props;
    const onModalOk = () => {
      if (onOk) {
        form.validateFieldsAndScroll((errors, values) => {
          if (!errors) {
            onOk(values);
          }
        });
      }
    };
    const onModalCancel = () => {
      if (onCancel) {
        onCancel();
      }
    };
    return (
      <Modal
        title={title}
        maskClosable={maskClosable}
        visible={visible}
        onOk={onModalOk}
        onCancel={onModalCancel}
      >
        <InputGroups {...inputGroupsProps} form={form} />
        {appendChild}
      </Modal>
    );
  }
}
export default FormModal;
