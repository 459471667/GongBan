import React from 'react';
import {Button, Form, Input, message, Select} from 'antd';
import {$axios, navPage} from "../../utils";

const {TextArea} = Input;
const FormItem = Form.Item;
const Option = Select.Option;

class StudentAddForm extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
            class_list: [],
            grade_list: []
        };
    }

    componentDidMount() {
        $axios('/Eduunit/EduunitClass/grade_list').then(data => {
            if (!data) return;
            if (data.ret_code === '0000000' && data.ret_data.grade_list) {
                this.setState({grade_list: data.ret_data.grade_list});
            }
        });
        // 获取班级
        // this.fetchAllClass();
    };

    // 提交表单
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                $axios('/Eduunit/Student/studentAdd', {...values})
                    .then(data => {
                        if (!data) return;
                        if (data.ret_code === '0000000') {
                            message.success(data.ret_msg);
                            navPage('/admin/school_manage/student_list');
                        }
                    });
            }
        });
    };

    // 获取全量的班级
    handleGradeChange = (value) => {
        this.props.form.setFieldsValue({class_id: ''});
        $axios('/Eduunit/Student/getClass', {grade_code: value}).then(data => {
            console.log(data,"this is data");
            if (!data) return;
            if (data.ret_code === '0000000' && data.ret_data) {
                this.setState({class_list: data.ret_data});
            }
            if (data.ret_code === '6003' && data.ret_data) {
                this.setState({class_list: data.ret_data});
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
        const {class_list} = this.state;
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
                    label="学生姓名："
                >
                    {getFieldDecorator('student_name', {
                        rules: [{
                            required: true, message: '请输入学生姓名!',
                        }]
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="性别："
                >
                    {getFieldDecorator('student_sex', {
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
            {/***<FormItem
                    {...formItemLayout}
                    label="学号："
                >
                    {getFieldDecorator('student_no', {
                        rules: [{required: false, message: '请输入学号'}],
                    })(
                        <Input/>
                    )}
                </FormItem>****/}
            <FormItem
                    {...formItemLayout}
                    label="年级："
                >
                    {getFieldDecorator('grade_code', {
                        rules: [{required: true, message: '请选择年级'}],
                    })(
                        <Select
                            placeholder="请选择"
                            onChange={this.handleGradeChange}
                        >
                            {this.state.grade_list.map(item => {
                                return <Option key={item.grade_code}>{item.grade_name}</Option>;
                            })}
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="班级："
                >
                    {getFieldDecorator('class_id', {
                        rules: [{required: true, message: '请输入班级'}],
                        initialValue:class_list[0]?class_list[0].class_id:""
                    })(
                        <Select>
                            {class_list.map((elObj)=>{
                                return (<Option 
                                            value={elObj.class_id}
                                            key={elObj.class_id}>{elObj.grade_class_name}
                                         </Option>)
                            })}                            
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="手机："
                >
                    {getFieldDecorator('student_phone', {
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
                    {getFieldDecorator('remark', {
                        rules: [{required: false, message: '请输入备注!'}],
                    })(
                        <TextArea rows={4} style={{width: '424px', height: '82px', resize: 'none'}}/>
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">保存</Button>
                    <Button style={{marginLeft: '20px'}} className="btn-gray"
                            onClick={() => navPage('../school_manage/student_list')}>返回</Button>
                </FormItem>
            </Form>
        );
    }
}

export default StudentAddForm;
