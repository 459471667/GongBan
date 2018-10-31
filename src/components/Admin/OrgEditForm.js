import React from 'react';
import {Button, Cascader, Form, Input, message, Radio, Select,Message} from 'antd';
import {$axios, navPage} from "../../utils";
import axios from "axios";
import ColumnGroup from 'antd/lib/table/ColumnGroup';

const {TextArea} = Input;
const FormItem = Form.Item;
const Option = Select.Option;

class OrgEditForm extends React.Component {

    params = {
        user_id: '',
        user_prov_code: '',
        user_prov_name: '',
        user_city_code: '',
        user_city_name: '',
        user_dist_code: '',
        user_dist_name: '',
        user_stre_code: '',
        user_stre_name: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            loc_code: 0,
            loc_options: [],
            confirmDirty: false,
            autoCompleteResult: [],
            orgData: {},
            user_id: '',
            user_prov_code: '',
            user_prov_name: '',
            user_city_code: '',
            user_city_name: '',
            user_dist_code: '',
            user_dist_name: '',
            user_stre_code: '',
            user_stre_name: ''
        }
    }
    static defaultProps = ({
        onStop:false
    })

    componentDidMount() {
        
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            loc_options: nextProps.loc_options,
            user_id: nextProps.user_id,
            user_prov_code: nextProps.user_prov_code,
            user_prov_name: nextProps.user_prov_name,
            user_city_code: nextProps.user_city_code,
            user_city_name: nextProps.user_city_name,
            user_dist_code: nextProps.user_dist_code,
            user_dist_name: nextProps.user_dist_name,
            user_stre_code: nextProps.user_stre_code,
            user_stre_name: nextProps.user_stre_name
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let paramObj=Object.assign({},this.state,this.selectedLoc);
        const form = this.props.form;
        let isCorrect = true;
        
        const locationMap = [
            { locationName: "user_prov_name", locationCode: "user_prov_code" },
            { locationName: "user_city_name", locationCode: "user_city_code" },
            { locationName: "user_dist_name", locationCode: "user_dist_code" },
            { locationName: "user_stre_name", locationCode: "user_stre_code" }
        ];

        if (this.selectedLoc !== undefined) {
            for (let i = (4 - this.selectedLoc.length); i > 0; i--) {
                delete paramObj[locationMap[4 - i]["locationCode"]];
                delete paramObj[locationMap[4 - i]["locationName"]];
            };
        }
        
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (form.getFieldValue('passwd') && form.getFieldValue('passwd') !== undefined) {
                    form.validateFields(['passwd','repasswd'],(errors, values)=>{
                        if (values.passwd !== values.repasswd) {
                            message.error('请输入确认密码！');
                            isCorrect= false
                        }
                    })
                }
                if (isCorrect) {
                    $axios('/Eduunit/Organization/orgEdit', {...values,...paramObj})
                    .then(resp => {
                        if (!resp) return;
                        if (resp.ret_code === '0000000') {
                            message.success('编辑成功！');
                            navPage('/admin/org_manage/org_list');
                        } else {
                            message.success(resp.ret_msg);
                        }
                    });
                }
                
            }
        });
    };

    loadLocationData = (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        console.log('selectedOptions',selectedOptions);

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
            })
            .catch((error) => {
                targetOption.loading = false;
                console.log(error);
            });
    };

    onLocationChange = (value, selectedOptions) => {
            // 只要是用户自主选择的地址，都可以保存
            console.log(selectedOptions);
            
            const locationMap = [
                { locationName: "user_prov_name", locationCode: "user_prov_code" },
                { locationName: "user_city_name", locationCode: "user_city_code" },
                { locationName: "user_dist_name", locationCode: "user_dist_code" },
                { locationName: "user_stre_name", locationCode: "user_stre_code" }
            ];
            this.selectedLoc={};
            if(Object.prototype.toString.call(selectedOptions)==="[object Array]"){
                selectedOptions.forEach((locationObj,index)=>{
                    this.selectedLoc[locationMap[index]["locationName"]]=locationObj.label;
                    this.selectedLoc[locationMap[index]["locationCode"]]=locationObj.value;
                });
                this.selectedLoc["length"]=selectedOptions.length;
            }else{
                Message.error("selected location must be an array");
            };
            
    };

    getLocationData = (loc_code) => {
        let params = {area_f_code: loc_code, method: "LoginSupplier.post_area", token: ''};
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

    //判断密码是否为空
    onChangePass = (e) =>{
        const form = this.props.form;
        if (!e.target.value) {
            form.resetFields("repasswd")
        }
        
    }

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
                            min: 6, max: 16, message: '请输入6-16位密码!',
                        }, {
                            required: false, message: '请输入密码!',
                        },{
                            validator: this.validateToNextPassword,
                        }],
                    })(
                        <Input type="password" onChange={this.onChangePass}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="确认密码："
                >
                    {getFieldDecorator('repasswd', {
                        rules: [{
                            min: 6, max: 16, message: '请输入6-16位确认密码!',
                        }, {
                            required: false, message: '请输入确认密码!',
                        }, {
                            validator: this.compareToFirstPassword,
                        }],
                    })(
                        <Input type="password" onBlur={this.handleConfirmBlur} />
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

export default OrgEditForm;
