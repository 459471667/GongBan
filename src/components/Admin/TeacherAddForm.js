import React from 'react';
import {Button, Form, Input, message, Select} from 'antd';
import {$axios, navPage} from "../../utils";

const {TextArea} = Input;
const FormItem = Form.Item;
const Option = Select.Option;

class TeacherAddForm extends React.Component {

    userId = '';
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };

    constructor(props) {
        super(props);
        const {userId} = this.props;
        this.userId = userId;
    }

    componentDidMount() {

    }

    // 提交表单
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                $axios('/Eduunit/Teacher/teacherAdd', {...values})
                    .then(data => {
                        if (!data) return;
                        if (data.ret_code === '0000000') {
                            message.success('添加成功！');
                            navPage('/admin/school_manage/teacher_list');
                        }
                    });
            }
        });
    };

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    };
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次密码不一致!');
        } else {
            callback();
        }
    };
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24}, sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24}, sm: {span: 16},
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {span: 24, offset: 0}, sm: {span: 16},
            },
        };

        return (
            <Form onSubmit={this.handleSubmit} autoComplete='false'>
                <FormItem
                    {...formItemLayout}
                    label="教师姓名："
                >
                    {getFieldDecorator('teacher_name', {
                        rules: [{
                            required: true, message: '请输入教师姓名!',
                        }]
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="性别："
                >
                    {getFieldDecorator('teacher_sex', {
                        rules: [{
                            required: true, message: '请选择性别!',
                        }]
                    })(
                        <Select
                            placeholder="请选择"
                            onChange={this.handleSelectChange}
                        >
                            <Option value="1">男</Option>
                            <Option value="2">女</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="手机："
                >
                    {getFieldDecorator('teacher_phone', {
                        rules: [{
                            pattern: /(^(\d{3,4}-)?\d{7,8})$|(^1\d{10})/g, message: '请输入正确的电话号！'
                        }, {
                            min: 11, max: 13, message: '电话号最长为13位最短为11位！'
                        }, {
                            required: true, message: '请输入电话号码!'
                        }]
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="密码："
                >
                    {getFieldDecorator('password', {
                        rules: [{
                            required: true, message: '请输入密码!',
                        }, {
                            validator: this.validateToNextPassword,
                        }],
                    })(
                        <Input type="password"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="确认密码："
                >
                    {getFieldDecorator('repasswd', {
                        rules: [{
                            required: true, message: '请输入确认密码!',
                        }, {
                            validator: this.compareToFirstPassword,
                        }],
                    })(
                        <Input type="password" onBlur={this.handleConfirmBlur}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="备注："
                >
                    {getFieldDecorator('teacher_remark', {
                        rules: [{required: false, message: '请输入备注!'}],
                    })(
                        <TextArea rows={4} style={{width: '424px', height: '82px', resize: 'none'}}/>
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">保存</Button>
                    <Button style={{marginLeft: '20px'}} className="btn-gray"
                            onClick={() => navPage('/admin/school_manage/teacher_list')}>返回</Button>
                </FormItem>
            </Form>
        );
    }
}

export default TeacherAddForm;
