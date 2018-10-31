import React from 'react';
import { Button, Form, Input, Layout, message, Select } from 'antd';
import { $axios, navPage } from "../../utils";

const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;

class ClassAddForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
            teacher_data: [],
            grade_name: ''
        };
        this.checkValue = this.checkValue.bind(this);
        this.handleInputValueChange = this.handleInputValueChange.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            teacher_data: nextProps.teacher_data
        };
    }

    handleInputValueChange(event) {
        event.persist();
        const { value } = event.target;
        const { form } = this.props;
        if (parseInt(value) <= 0) {
            setTimeout(() => {
                form.setFieldsValue({ class_name: 1 });
            }, 1300);
        }
    }

    // custom define validator
    checkValue(rule, value, cb) {
        if (parseInt(value) <= 0) {
            cb("班级数字不能小于等于0!");
            return;
        };
        cb();
    }



    // 提交表单
    handleSubmit = (e) => {
        let { grade_name } = this.state;
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                $axios('/Eduunit/EduunitClass/class_add',
                    { ...values, grade_name }).then(data => {
                        if (!data) return;
                        if (data.ret_code === '0000000') {
                            message.success(data.ret_msg);
                            navPage('/admin/school_manage/class_list');
                        }
                    });
            }
        });
    };

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    handleChange = (value, option) => {
        console.log(value, option);
    };

    handleSearch = (value) => {
        console.log(value);
    };

    handleSelectChange = (value, option) => {
        this.setState({ grade_name: option.props.children });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 }, sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 }, sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: { span: 24, offset: 0 }, sm: { span: 16 },
            },
        };

        const children = [];
        for (let item of this.state.teacher_data) {
            children.push(<Option key={item.teacher_id}>{item.teacher_name}</Option>);
        }

        return (
            <Form onSubmit={this.handleSubmit} autoComplete='false'>
                <FormItem
                    {...formItemLayout}
                    label="年级："
                >
                    {getFieldDecorator('grade_code', {
                        rules: [{
                            required: true, message: '请选择年级!',
                        }]
                    })(
                        <Select
                            placeholder="请选择"
                            style={{ width: '202px' }}
                            onChange={this.handleSelectChange}
                        >
                            <Option value="10001">一年级</Option>
                            <Option value="10002">二年级</Option>
                            <Option value="10003">三年级</Option>
                            <Option value="10004">四年级</Option>
                            <Option value="10005">五年级</Option>
                            <Option value="10006">六年级</Option>
                            <Option value="10007">七年级</Option>
                            <Option value="10008">八年级</Option>
                            <Option value="10009">九年级</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="班级名称："
                >
                    <Layout className="input-group">
                        {this.props.grade_name}
                        {getFieldDecorator('class_name', {
                            rules: [{ required: true, message: '请输入班级!' }, { validator: this.checkValue }]
                        })(
                            <Input
                                onChange={this.handleInputValueChange}
                                min={1} type="number" />
                        )}
                        班
                        <span>请输入阿拉伯数字</span>
                    </Layout>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="教师："
                >
                    {getFieldDecorator('teacher_data', {
                        rules: [{
                            required: true, message: '请选择教师!',
                        }],
                    })(
                        <Select
                            mode="multiple"
                            placeholder="请选择"
                            onChange={this.handleChange}
                            onSearch={this.handleSearch}
                            style={{ width: '422px', height: 'auto' }}
                        >
                            {children}
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="备注："
                >
                    {getFieldDecorator('class_remarks', {
                        rules: [{ required: false, message: '请输入备注!' }],
                    })(
                        <TextArea rows={4} style={{ width: '424px', height: '82px', resize: 'none' }} />
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">保存</Button>
                    <Button style={{ marginLeft: '20px' }} className="btn-gray"
                        onClick={() => navPage('/admin/school_manage/class_list')}>返回</Button>
                </FormItem>
            </Form>
        );
    }
}

export default ClassAddForm;
