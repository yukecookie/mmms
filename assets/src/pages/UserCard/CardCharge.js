import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, InputNumber, Button, Card, Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const namespace = 'userCard';
const FormItem = Form.Item;

@connect(({ loading }) => ({
  submitting: loading.effects[`${namespace}/fetchCardCharge`],
}))
@Form.create()
class CardCharge extends PureComponent {
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: `${namespace}/fetchCardCharge`,
          payload: values,
        }).then(res => {
          if (res.success) {
            Modal.success({
              title: res.message,
            });
          } else {
            Modal.error({
              title: '充值失败',
              content: res.message,
            });
          }
        });
      }
    });
  };

  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderWrapper
        title={<FormattedMessage id="app.forms.charge.title" />}
        content={<FormattedMessage id="app.forms.charge.description" />}
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="form.card.charge.label" />}>
              {getFieldDecorator('num', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'form.validation.card.charge.required' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'form.card.placeholder' })} />)}{' '}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="form.card.charge.amount" />}>
              {getFieldDecorator('amount', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'form.validation.card.amount.required' }),
                  },
                ],
              })(<InputNumber placeholder={formatMessage({ id: 'form.card.placeholder' })} />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32, marginLeft: 200 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="form.submit" />
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CardCharge;
