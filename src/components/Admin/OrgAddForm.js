import React from 'react';
import {Button, Cascader, Form, Input, message, Radio, Select} from 'antd';
import {$axios, navPage} from "../../utils";
import axios from "axios";

const {TextArea} = Input;
const FormItem = Form.Item;
const Option = Select.Option;

class OrgAddForm extends React.Component {

    userId = '';
    selectedLoc = {
        // user_prov_code: '',
        // user_prov_name: '',
        // user_city_code: '',
        // user_city_name: '',
        // user_dist_code: '',
        // user_dist_name: '',
        // user_stre_code: '',
        // user_stre_name: ''
    };
    state = {
        loc_code: 0,
        loc_options: [],
        confirmDirty: false,
        autoCompleteResult: [],
        orgData: {}
    };

    constructor(props) {
        super(props);
        const {userId} = this.props;
        this.userId = userId;
    }

    componentDidMount() {
        this.getLocationData(0)
            .then((locData) => {
                if (locData.data.status === 0) {
                    let options = [];
                    for (let item of locData.data.data.area) {
                        let {area_code: value, area_name: label, ...rest} = item;
                        options.push({value, label, isLeaf: false, rest});
                    }
                    this.setState({
                        loc_options: [...options],
                    });
                }
            });
            console.log('初始化',this.state.loc_options);
    }

    // 提交表单
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                $axios('/Eduunit/Organization/orgAdd', {...values, ...this.selectedLoc})
                    .then(resp => {
                        if (!resp) return;
                        if (resp.ret_code === '0000000') {
                            message.success('添加成功！');
                            navPage('/admin/org_manage/org_list');
                        }
                    });
            }
        });
    };

    loadLocationData = (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        this.getLocationData(targetOption.value)
            .then((resp) => {
                targetOption.loading = false;
                if (resp.data.status === 0) {
                    let options = [];
                    for (let item of resp.data.data.area) {
                        let {area_code: value, area_name: label, ...rest} = item;
                        if (selectedOptions.length === 3) {
                            // 当已经选第三个option时，子option节点设置为叶子leaf
                            options.push({value, label, isLeaf: true, rest});
                        } else {
                            options.push({value, label, isLeaf: false, rest});
                        }
                    }
                    targetOption.children = options;
                    this.setState({
                        loc_options: [...this.state.loc_options],
                    });
                }
                console.log('该表',this.state.loc_options);
                
            })
            .catch((error) => {
                targetOption.loading = false;
                console.log(error);
            });
    };

    onLocationChange = (value, selectedOptions) => {
            this.selectedLoc={};
            let mapLocation=[{code:"user_prov_code",name:"user_prov_name"},
                            {code:"user_city_code",name:"user_city_name"},
                            {code:"user_dist_code",name:"user_dist_name"},{code:"user_stre_code",name:"user_stre_name"}];
            selectedOptions.forEach((elObj,index)=>{
                 this.selectedLoc[mapLocation[index].code]=elObj.value;
                 this.selectedLoc[mapLocation[index].name]=elObj.label;
            });
    };

    getLocationData = (loc_code) => {
        let params = {
            area_f_code: loc_code,
            method: "LoginSupplier.post_area",
            token: ''
        };
        return axios.post('http://www.doubei365.com/index.php?g=Supplier&m=LoginSupplier&a=post_area', params);
    };
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    };
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('passwd')) {
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
                    label="单位名称："
                >
                    {getFieldDecorator('org_name', {
                        rules: [{
                            max: 40, message: '请输入40字以内的单位名称!',
                        }, {
                            required: true, message: '请输入单位名称!',
                        }],
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="管理员账号："
                >
                    {getFieldDecorator('admin_account', {
                        rules: [{
                            min: 4, max: 25, message: '管理员账号为4-25位字符!',
                        }, {
                            required: true, message: '请输入管理员账号!',
                        }],
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="密码："
                >
                    {getFieldDecorator('passwd', {
                        rules: [{
                            min: 6, max: 20, message: '请输入6-20位密码!',
                        }, {
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
                            min: 6, max: 20, message: '请输入6-20位确认密码!',
                        }, {
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
                    label="单位类型："
                >
                    {getFieldDecorator('org_type', {
                        rules: [{
                            required: true, message: '请选择单位类型!',
                        }]
                    })(
                        <Select
                            placeholder="请选择"
                            style={{width: '202px'}}
                            onChange={this.handleSelectChange}
                        >
                            <Option value="0">学校</Option>
                            <Option value="1">教育局</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="是否可用："
                >
                    {getFieldDecorator('available', {
                        rules: [{required: true, message: '请选择是否可用!'}],
                    })(
                        <Radio.Group>
                            <Radio value="0">是</Radio>
                            <Radio value="1">否</Radio>
                        </Radio.Group>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="所在地区："
                >
                    {getFieldDecorator('residence', {
                        rules: [{type: 'array', required: true, message: '请选择所在地区!'}],
                    })(
                        <Cascader
                            placeholder="请选择"
                            style={{width: '100%'}}
                            options={this.state.loc_options}
                            loadData={this.loadLocationData}
                            onChange={this.onLocationChange}
                            changeOnSelect
                        />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="详细地址："
                >
                    {getFieldDecorator('org_location', {
                        rules: [{
                            max: 80, message: '请输入80字以内的地址!',
                        }, {
                            required: true, message: '请输入详细地址!',
                        }],
                    })(
                        <Input style={{width: '100%'}}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="负责人："
                >
                    {getFieldDecorator('admin_name', {
                        rules: [{
                            max: 20, message: '请输入20字以内的负责人名!',
                        }, {
                            required: true, message: '请输入负责人!',
                        }],
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="电话："
                >
                    {getFieldDecorator('admin_tel', {
                        rules: [{
                            pattern: /(^(\d{3,4}-)?\d{7,8})$|(^1\d{10})/g, message: '请输入正确的电话号！'
                        }, {
                            min: 11, max: 13, message: '电话号最长为13位最短为11位！'
                        }, {
                            required: true, message: '请输入电话号码!'
                        }],
                    })(
                        <Input/>
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
                            onClick={() => navPage('/admin/org_manage/org_list')}>返回</Button>
                </FormItem>
            </Form>
        );
    }
}

export default OrgAddForm;
