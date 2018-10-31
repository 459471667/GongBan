import React, {Component} from 'react';
import {Button, Input, Layout, message, Popconfirm, Table,Pagination,Message} from "antd";
import {Link} from "react-router-dom";
import {$axios, navPage} from "../../../utils";
import "./SchoolManageIndex.less" 

class StudentList extends Component {

    constructor(props){
        super(props);
        this.state = {
            userInfo: JSON.parse(localStorage.getItem('userInfo')),
            studentList: [],
            user_name: '',
            user_account: '',
            user_phone: '',
            user_class: '',
            page: 0,
            total: 0,
            defaultCurrent:1
        };
        this.goPage=this.goPage.bind(this);
    }

    componentDidMount() {
        let {user_name, user_account, user_phone, user_class, page} = this.state;
        this.getStudentList({user_name, user_account, user_phone, user_class, page});
    }

    onPageChange = (pageNumber) => {
        this.setState({defaultCurrent:pageNumber});
        let {user_name,user_account,user_phone,user_class,page} = this.state;
        this.getStudentList({user_name, user_account, user_phone, user_class, page:pageNumber});
    };

    handleInput = (e, inputName) => {
        this.setState({[inputName]: e.target.value});
    };

    search = () => {
        this.setState({page: 0});
        const {user_name, user_account, user_phone, user_class} = this.state;
        this.getStudentList({user_name, user_account, user_phone, user_class, page: 0});
    };

    confirmDelete = (studentId) => {
        let params = {student_id: studentId};
        const {user_name, user_account, user_phone, user_class, page} = this.state;
        $axios('/Eduunit/Student/studentDelete', params).then(resp => {
            if (!resp) return;
            if (resp.ret_code === '0000000') {
                this.getStudentList({user_name, user_account, user_phone, user_class, page});
                message.success(resp.ret_msg);
            }
        });
    };

    getStudentList = (searchParams) => {
        let params = {...searchParams};
        $axios('/Eduunit/Student/index', params).then(data => {
            if (!data) return;
            if (data.ret_code === '0000000') {
                console.log("fetch data",data.ret_data.student_list);
                this.setState({studentList: data.ret_data.student_list,total: parseInt(data.ret_data.total, 10)});
            } else if (data.ret_code === '6003') {
                this.setState({studentList: []});
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
            console.log(pageSizeInput);
            this.setState({defaultCurrent:pageSizeInput},()=>{
                this.onPageChange(pageSizeInput);
            });
        }catch(e){
            Message.error(e.message);
        }     
    };

    render() {
        let {studentList, defaultCurrent,user_name, user_account, user_phone, user_class, total, userInfo} = this.state;
        studentList = studentList.map((item, index) => {
            return Object.assign({...item, key: index});
        });
        const columns = [{
            title: '学生姓名',
            width: "112px",
            dataIndex: 'student_name',
            key: 'student_name',
        }, {
            title: '性别',
            width: '70px',
            dataIndex: 'student_sex',
            key: 'student_sex',
        },
         {
            title: '登录名',
            width: '156px',
            dataIndex: 'student_user_account',
            key: 'student_user_account',
        }, {
            title: '昵称',
            width: '156px',
            dataIndex: 'student_nick_name',
            key: 'student_nick_name',
        },{
            title: '手机',
            width: '135px',
            dataIndex: 'student_phone',
            key: 'student_phone',
        }, {
            title: '班级',
            width: '126px',
            dataIndex: 'class_name',
            key: 'class_name',
        }, 
        {
            title: '创建时间',
            width: '200px',
            dataIndex: 'student_add_time',
            key: 'student_add_time',
        }, 
        {
            title: '操作',
            width: '120px',
            key: 'action',
            render: (text, record) => {
                    return (
                        <span>
                            <Link to={`/admin/school_manage/student_edit/${record.student_id}`}>编辑</Link>
                            <Popconfirm title="确定要删除吗?" onConfirm={() => this.confirmDelete(record.student_id)}>
                                <Link to="#">删除</Link>
                            </Popconfirm>
                        </span>
                    )
            }
        }];

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
            <Layout style={containerStyle} className="common-contain-layout">
                <Layout className="search-btn-block" style={{height:"72px"}}>
                    <div className="search-block">
                        <div>
                            <label>学生姓名</label>
                            <Input value={user_name} style={{width: 130}}
                                   onChange={(e) => this.handleInput(e, 'user_name')}/>
                            <label>登录名</label>
                            <Input value={user_account} style={{width: 130}}
                                   onChange={(e) => this.handleInput(e, 'user_account')}/>
                            <label>手机</label>
                            <Input value={user_phone} style={{width: 120}}
                                   onChange={(e) => this.handleInput(e, 'user_phone')}/>
                            <label>班级</label>
                            <Input value={user_class} style={{width: 120}}
                                   onChange={(e) => this.handleInput(e, 'user_class')}/>
                        </div>
                        <Button onClick={this.search}>查询</Button>
                    </div>
                    {userInfo.user_type !== '2' &&
                    <div className="top-btn-group">
                        <Button type="primary"
                                onClick={() => navPage('/admin/school_manage/student_add')}>添加学生</Button>
                        <Button type="primary"
                                onClick={() => navPage('/admin/school_manage/student_import')}>导入</Button>
                    </div>}
                </Layout>

                <div className="table-container">
                    <Table 
                        pagination={false}
                        columns={columns} dataSource={studentList}/>
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
}

export default StudentList;
