import React, {Component} from 'react';
import {Button, Input, Layout, message, Popconfirm, Table,Message,Pagination} from "antd";
import {Link} from "react-router-dom";
import {$axios, navPage} from "../../../utils";
import "./SchoolManageIndex.less"; 

class TeacherList extends Component {

    constructor(props){
        super(props);
        this.goPage=this.goPage.bind(this);
    }

    state = {
        teacherList: [],
        user_name: '',
        user_account: '',
        user_phone: '',
        page: 0,
        total: 0,
        defaultCurrent:1
    };

    componentDidMount() {
        let {user_name, user_account, user_phone, page} = this.state;
        this.getTeacherList({user_name, user_account, user_phone, page});
    }

    onPageChange = (pageNumber) => {
        let {user_name, user_account, user_phone} = this.state;
        this.setState({page: pageNumber,defaultCurrent:pageNumber});
        this.getTeacherList({user_name, user_account, user_phone, page: pageNumber});
    };

    handleInput = (e, inputName) => {
        this.setState({[inputName]: e.target.value});
    };

    search = () => {
        this.setState({page: 0});
        const {user_name, user_account, user_phone} = this.state;
        this.getTeacherList({user_name, user_account, user_phone, page: 0});
    };

    confirmDelete = (teacherId) => {
        let params = {teacher_id: teacherId};
        const {user_name, user_account, user_phone} = this.state;
        $axios('/Eduunit/Teacher/teacherDelete', params).then(data => {
            if (!data) return;
            if (data.ret_code === '0000000') {
                message.success(data.ret_msg);
                this.getTeacherList({user_name, user_account, user_phone, page: 0});
            }
        });
    };

    getTeacherList = (searchParams) => {
        $axios('/Eduunit/Teacher/index', {...searchParams}).then(data => {
            if (!data) return;
            if (data.ret_code === '0000000') {
                this.setState({teacherList: data.ret_data.teacher_list});
                this.setState({total: parseInt(data.ret_data.total, 10)});
            } else if (data.ret_code === '6003') {
                this.setState({teacherList: []});
            }
        });
    };

    goPage(){
        const {total} = this.state;
        try{
            const inputDom=document.getElementsByClassName("ant-pagination-options-quick-jumper")[0].children[0];
            let pageSizeInput=inputDom.value;
            if(!pageSizeInput.trim()){
                Message.error("跳转页数不能为空!");
                return;
            };
            pageSizeInput=parseInt(pageSizeInput);
            let pageCount=total/10;
            if((pageCount+"").indexOf(".")>0)pageCount=parseInt((pageCount+"").split(".")[0])+1;
            if(pageSizeInput>pageCount)pageSizeInput=pageCount;
            this.setState({defaultCurrent:pageSizeInput},()=>{
                this.onPageChange(pageSizeInput);
            });
        }catch(e){
            Message.error(e.message);
        }     
    };

    render() {
        let {teacherList, user_name, user_account, user_phone, total,defaultCurrent} = this.state;
        teacherList = teacherList.map((item, index) => {
            return {...item, key: index};
        });
         let pagination=React.createElement(Pagination,{
                               style:{display:"inline-block",verticalAlign:"middle"},
                               current:defaultCurrent,
                               showQuickJumper:true,
                               hideOnSinglePage:true,
                               onChange:this.onPageChange,
                               defaultPageSize:10,
                               total:total
        });
        const containerStyle = {
            backgroundColor: "white",
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingBottom: "10px"
        };
        return (
            <Layout style={containerStyle}>
                <Layout className="search-btn-block" style={{height:"72px"}}>
                    <div className="search-block">
                        <div>
                            <label>教师姓名</label>
                            <Input value={user_name} style={{width: 146}}
                                   onChange={(e) => this.handleInput(e, 'user_name')}/>
                            <label>登录名</label>
                            <Input value={user_account} style={{width: 146}}
                                   onChange={(e) => this.handleInput(e, 'user_account')}/>
                            <label>手机</label>
                            <Input value={user_phone} style={{width: 120}}
                                   onChange={(e) => this.handleInput(e, 'user_phone')}/>
                        </div>
                        <Button onClick={this.search}>查询</Button>
                    </div>
                    <div className="top-btn-group">
                        <Button type="primary" onClick={() => navPage('/admin/school_manage/teacher_add')}>添加老师</Button>
                        <Button type="primary"
                                onClick={() => navPage('/admin/school_manage/teacher_import')}>导入</Button>
                    </div>
                </Layout>

                <div className="table-container">
                    <Table columns={this.columns} dataSource={teacherList}
                           pagination={false}/>
                    <div style={{textAlign:"center"}} >
                            {pagination}
                            {(total/10)<=1?null:<span
                                className="doubei-go-page-span"
                                onClick={this.goPage}
                                style={{cursor:"pointer",fontSize:"15px",position:"relative",top:"2px",marginLeft:"7px"}}
                    >GO</span>}
                    </div>
                </div>
            </Layout>
        );
    }

    columns = [{
        title: '教师姓名',
        width: '96px',
        dataIndex: 'teacher_name',
        key: 'teacher_name',
    }, {
        title: '性别',
        width: '70px',
        dataIndex: 'teacher_sex',
        key: 'teacher_sex',
        render: (text, record) => {
            if (record.teacher_sex === '1') {
                return '男';
            } else if (record.teacher_sex === '2') {
                return '女';
            }
        },
    }, {
        title: '登录名',
        width: '90px',
        dataIndex: 'teacher_user_account',
        key: 'teacher_user_account',
    }, 
    {
        title: '昵称',
        width: '90px',
        dataIndex: 'teacher_nick_name',
        key: 'teacher_nick_name',
    }, 
    {
        title: '手机',
        width: '135px',
        dataIndex: 'teacher_phone',
        key: 'teacher_phone',
    }, {
        title: '班级',
        width: '126px',
        dataIndex: 'class_data',
        key: 'class_data',
        render: (text, record) => {
            if (!record) return;
            let arr = record.class_data.map(item => {
                return item.class_name
            });
            return arr.join(',');
        }
    }, 
    {
        title: '创建时间',
        width: '200px',
        dataIndex: 'teacher_add_time',
        key: 'teacher_add_time',
    }, 
    {
        title: '操作',
        width: '120px',
        key: 'action',
        render: (text, record) => (
            <span>
                <Link to={`/admin/school_manage/teacher_edit/${record.teacher_id}`}>编辑</Link>
                <Popconfirm title="确定要删除吗?" onConfirm={() => this.confirmDelete(record.teacher_id)}>
                    <Link to="#">删除</Link>
                </Popconfirm>
            </span>
        ),
    }];
}

export default TeacherList;
