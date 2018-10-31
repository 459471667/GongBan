import React, {Component} from 'react';
import {Button, Input, Layout, message, Pagination,Message,Popconfirm, Select, Table} from "antd";
import {Link} from "react-router-dom";
import {$axios, navPage} from "../../../utils";
import moment from "moment";
import "./SchoolManageIndex.less";

class ClassList extends Component {

    constructor(props){
        super(props);
        this.goPage=this.goPage.bind(this);
    };

    state = {
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        gradeOptionNode: [],
        classList: [],
        class_no: '',
        grade_code: '',
        page: 0,
        total: 0,
        defaultCurrent:1
    };

    componentDidMount() {
        this.renderGradeSelect(this.gradeData);
        // 分页问题
        this.getClassList('', '', 0);
    }

    onPageChange = (pageNumber) => {
        this.setState({defaultCurrent:pageNumber});
        let{classNumber,gradeCode} = this.state;
        this.getClassList(classNumber,gradeCode,pageNumber);
    };

    handleChange = (value) => {
        this.setState({grade_code: value});
    };

    handleInput = (e) => {
        this.setState({class_no: e.target.value});
    };

    handleSearch = () => {
        this.setState({page: 0});
        const {class_no, grade_code} = this.state;
        this.getClassList(class_no, grade_code, 0);
    };

    //删除文档
    confirmDelete = (classId) => {
        let params = {class_id: classId};
        $axios('/Eduunit/EduunitClass/class_del', params).then(resp => {
            if (!resp) return;
            if (resp.ret_code === '0000000') {
                const {class_no, grade_code, page} = this.state;
                this.getClassList(class_no, grade_code, page);
                message.success(resp.ret_msg);
            }
        });
    };

    /***
     *@param("class_no") 班级编号
     * 
     *@param("grade_code") 年级
     ***/ 
    getClassList = (class_no, grade_code, page) => {
        let params = {class_no: class_no, grade_code: grade_code, page};
        // 第三个参数为请求类型，如果传的参数为post，则request method为post，如果不传，default request method is get
        $axios('/Eduunit/EduunitClass/index', params)
            .then(data => {
                if (!data) return;
                if (data.ret_code === '0000000') {
                    this.setState({classList: data.ret_data.class_list});
                    this.setState({total: parseInt(data.ret_data.total, 10)});
                } else if (data.ret_code === '6003') {
                    this.setState({classList: []});
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
        let {gradeOptionNode, classList, class_no, total,defaultCurrent} = this.state;
        const btnSearchAreaStyle={height:"72px"};
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        classList = classList.map((item, index) => {
            return Object.assign({...item, key: index});
        });
        let columns = [{
            title: '班级编号',
            width: '200px',
            dataIndex: 'class_no',
            key: 'class_no',
        }, {
            title: '班级名称',
            width: '180px',
            dataIndex: 'class_name',
            key: 'class_name',
        }, 
        // {
        //     title: '年级',
        //     width: '210px',
        //     dataIndex: 'grade_name',
        //     key: 'grade_name',
        // }, 
        {
            title: '创建时间',
            width: '270px',
            dataIndex: 'class_add_time',
            key: 'class_add_time'
        }, 
        {
            title: '操作',
            width: '120px',
            key: 'action',
            render: (text, record) => {
                if (userInfo.user_type !== '2') {
                    return (
                        <span>
                            <Link to={`/admin/school_manage/class_edit/${record.class_id}`}>编辑</Link>
                            <Popconfirm title="确定要删除吗?" onConfirm={() => this.confirmDelete(record.class_id)}>
                                <Link to="#">删除</Link>
                            </Popconfirm>
                        </span>
                    );
                }
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
        const containerStyle={
            paddingLeft:"20px",
            paddingRight:"20px",
            backgroundColor:"white",
            paddingBottom:"10px"
        };
        return (
            <Layout className="common-contain-layout" style={containerStyle} >
                <Layout className="search-btn-block" style={btnSearchAreaStyle} style={{height:"72px"}} >
                    <div className="search-block">
                        <div>
                            <label>班级编号</label>
                            <Input value={class_no} onChange={this.handleInput}/>
                        {/****<label>年级</label>
                            <Select onChange={this.handleChange} style={{width: 100}}>
                                {gradeOptionNode}
                            </Select>****/}
                        </div>
                        <Button onClick={this.handleSearch}>查询</Button>
                    </div>
                    {userInfo.user_type !== '2' &&
                    <div className="top-btn-group">
                        <Button type="primary" onClick={() => navPage('/admin/school_manage/class_add')}>添加班级</Button>
                    </div>
                    }
                </Layout>

                <div className="table-container">
                    <Table  pagination={false} columns={columns} dataSource={classList} />
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

    renderGradeSelect = (gradeData) => {
        let gradeOptionNode = gradeData.map((item, index) => {
            return <Select.Option value={item.value} key={index}>{item.label}</Select.Option>;
        });
        this.setState({gradeOptionNode: gradeOptionNode});
    };


    gradeData = [
        {value: '10001', label: '一年级'},
        {value: '10002', label: '二年级'},
        {value: '10003', label: '三年级'},
        {value: '10004', label: '四年级'},
        {value: '10005', label: '五年级'},
        {value: '10006', label: '六年级'},
        {value: '10007', label: '七年级'},
        {value: '10008', label: '八年级'},
        {value: '10009', label: '九年级'}
    ];
}

export default ClassList;
