import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Button, Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import styles from '../UserInfo/UserInfoAdd/UserInfoAdd.less';

const namespace = 'userCard';
const FormItem = Form.Item;

@connect(({ loading }) => ({
  submitting: loading.effects[`${namespace}/fetchCardReplace`],
}))
@Form.create()
class CardReplace extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cardNum: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userInfoAdd/fetchId',
    }).then(result => {
      const val = (result.id + 1).toString();
      const zero = 7 - parseInt(val.length, 0);
      let userId = 'S1';
      let i;
      for (i = 0; i < zero; i += 1) {
        userId += '0';
      }
      userId += val;
      this.setState({ cardNum: userId });
    });
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

  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;

    const { cardNum } = this.state;
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
        title={<FormattedMessage id="app.forms.replace.title" />}
        content={<FormattedMessage id="app.forms.replace.description" />}
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="form.card.old.label" />}>
              {getFieldDecorator('oldCardNum', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'form.validation.old-card.required' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'form.card.placeholder' })} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="form.card.new.label" />}>
              {getFieldDecorator(
                'newCardNum',
                { initialValue: cardNum },
                {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'form.validation.new-card.required' }),
                    },
                  ],
                }
              )(<Input disabled placeholder={formatMessage({ id: 'form.card.placeholder' })} />)}
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

export default CardReplace;
