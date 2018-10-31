import React from 'react';
import {Layout, Divider, Table } from "antd";
import {Link} from "react-router-dom";
import './Index.less';
import {$axios, navPage,navBack} from "../../utils";
import publish_icon from "../../assets/img/publish.png"; 
import check_icon from "../../assets/img/check.png"; 
import fav_icon from "../../assets/img/fav.png"; 
import good_icon from "../../assets/img/good.png"; 

class Index extends React.Component {

    state = {
        totalData: {},
        distribution:[],
        totalDataArray:[],
        distributionArray:[],
        userInfo: JSON.parse(localStorage.getItem('userInfo')),
        defaultdisplay:{display:"none"},
        user_title:'',
        user_title_Array:[],
    };

    componentWillMount() {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            navPage('/login');
            return false;
        }
    }

    componentDidMount() {
        const {userInfo} = this.state;
        this._fetchTotalData(userInfo.token, userInfo.user_id);
        this._fetchDistributionData(userInfo.token, userInfo.user_id);
        this.setState({
            user_title: userInfo.user_name
        });
        this.state.user_title_Array.push(userInfo.user_name);
    }

    componentWillUnmount() {
        this.setState({
            totalDataArray:[],
            distributionArray:[],
            user_title_Array:[]
        })
    } 

    // 数据请求-数据总计
    _fetchTotalData =(parma_token, parma_user_id) =>{
        $axios('/Eduunit/EduunitHome/index', {token:parma_token, user_id: parma_user_id})
        .then(data => {
            if (!data) return;
            if (data.ret_code === '0000000') {
                this.setState({totalData: data.ret_data});
                this.state.totalDataArray.push(data.ret_data);
            }
        });
    }

    // 数据请求-分布统计
    _fetchDistributionData = (parma_token, parma_user_id) =>{
        $axios('/Eduunit/EduunitHome/distribution', {token:parma_token, user_id: parma_user_id})
        .then(data => {
            if (!data) return;
            if (data.ret_code === '0000000') {
                data.ret_data = data.ret_data.map((item, index)=>{
                    return Object.assign({...item, key:item.user_id}); 
                });
                this.setState({distribution: data.ret_data});
                this.state.distributionArray.push(data.ret_data);
            }
        });
    }

    // 返回上一页
    _goBack = () =>{
        let totalDataArray = this.state.totalDataArray;
        let distributionArray = this.state.distributionArray;
        let user_title_Array = this.state.user_title_Array;
        totalDataArray.pop();
        distributionArray.pop();
        user_title_Array.pop();

        let total_length = totalDataArray.length;

        this.setState({
            totalData: totalDataArray[total_length-1],
            distribution: distributionArray[total_length-1],
            user_title: user_title_Array[total_length-1]
        });

        if (total_length==1) {
            this.setState({ 
                defaultdisplay: {display:"none"},
            })
        }
       
    }

     // 查看详情
     ItemDetail = (record,index) =>{
        const {userInfo} = this.state;
        this.scrollToAnchor('screens')
        this._fetchTotalData(userInfo.token, record.user_id);
        this._fetchDistributionData(userInfo.token, record.user_id);
        this.state.user_title_Array.push(record.user_unit_name);

        this.setState({
            defaultdisplay: {display:"block"},
            user_title: record.user_unit_name
        })

    }

    // 跳到顶部
    scrollToAnchor = (anchorName) => {
        if (anchorName) {
            let anchorElement = document.getElementById(anchorName);
            if(anchorElement) { anchorElement.scrollIntoView(); }
        }
    }

    LeftItem = (imgurl, text, number, number_type) =>{
        number = (number == undefined ? '0' : number);
        return (
            <div className="content_left_item">
                <img src={imgurl}/>
                <span>{text}</span>
                <div></div>
                <span>{number}{number_type}</span>
            </div>
        )
    }

    RightItem = (imgurl, title, number, number_type) =>{
        number = (number == undefined ? '0' : number);
        return (
            <div className='content_right_item'>
                <div className='icon_text'>
                    <img src={imgurl} />
                    <span>{title}</span>
                </div>
                <div className='slice'></div>
                <span>{number}{number_type}</span>
            </div>
        )
    }

    render() {
        const {totalData, userInfo} = this.state;

        let columns = [{
                title: '序号',
                width: '80px',
                key: 'index',
                className:'columnsstyle',
                render: (text, record, index) =>{
                    return (
                        <span>{index+1}</span>
                    )
                }
            },{
                title: '直属单位',
                width: '650px',
                dataIndex: 'user_unit_name',
                key: 'user_unit_name',
                className:'columnsstyle'
            },{
                title: '学校',
                width: '150px',
                dataIndex: 'school_num',
                key: 'school_num',
                className:'columnsstyle'
            },{
                title: '班级',
                width: '150px',
                dataIndex: 'class_num',
                key: 'class_num',
                className:'columnsstyle'
            },{
                title: '教师',
                width: '150px',
                dataIndex: 'teacher_num',
                key: 'teacher_num',
                className:'columnsstyle'
            },{
                title: '学生',
                width: '150px',
                dataIndex: 'student_num',
                key: 'student_num',
                className:'columnsstyle'
            },{
                title: '申请发布作品',
                width: '250px',
                dataIndex: 'works_num',
                key: 'works_num',
                className:'columnsstyle'
            },{
                title: '审核通过作品',
                width: '250px',
                dataIndex: 'works_status_num',
                key: 'works_status_num',
                className:'columnsstyle'
            },{
                title: '作品点赞',
                width: '190px',
                dataIndex: 'works_praise_num',
                key: 'works_praise_num',
                className:'columnsstyle'
            },
            {
                title: '作品收藏',
                width: '190px',
                dataIndex: 'collect_num',
                key: 'collect_num',
                className:'columnsstyle'
            },
            {
                title: '布置作业',
                width: '190px',
                dataIndex: 'task_add_num',
                key: 'task_add_num',
                className:'columnsstyle'
            },
            {
                title: '提交作业',
                width: '190px',
                dataIndex: 'task_student_num',
                key: 'task_student_num',
                className:'columnsstyle'
            },
            {
                title: '操作',
                width: '180px',
                key: 'action',
                className:'columnsstyle',
                render: (text, record, index) => {
                    if (record.user_type == 1) {
                        return (
                            <span>
                                <a href="javascript:;" onClick={this.ItemDetail.bind(this,record,index)} >查看详情</a>
                            </span>
                        )
                    }
                }
                  
            }, ]

        
        const containerStyle = { backgroundColor:"#edf1f7", marginTop: 20 };
 
        return (
            <Layout ref="top"  className="admin-index" style={{ backgroundColor:"#edf1f7"}}>
                <a className='screens' id="screens"></a>
                <div className="admin-title" >
                    <span>{this.state.user_title}数据统计</span>
                    <span className="back_btn" style={this.state.defaultdisplay} onClick={this._goBack} >返回</span>
                </div>
                <Layout style={containerStyle}>
                    <div className="admin-text"><span>数据总计</span></div>
                    <div className="admin-content">
                        <div className="content_left">
                            {this.LeftItem(require("../../assets/icon/icon_school.png"), "学校", totalData.school_num , "个")}
                            <Divider style={{margin:0}}/>
                            {this.LeftItem(require("../../assets/icon/icon_class.png"), "班级", totalData.class_num , '个' )}
                            <Divider style={{margin:0}}/>
                            {this.LeftItem(require("../../assets/icon/icon_teacher.png"), "教师", totalData.teacher_num , '人' )}
                            <Divider style={{margin:0}}/>
                            {this.LeftItem(require("../../assets/icon/icon_student.png"), "学生", totalData.student_num , '人' )}
                        </div>
                        <div className="content_right">
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                { this.RightItem(require("../../assets/icon/icon_release.png"), '申请发布作品', totalData.works_num , '个' ) }
                                { this.RightItem(require("../../assets/icon/icon_fabulous.png"), '作品点赞', totalData.works_praise_num, '次' ) }
                                { this.RightItem(require("../../assets/icon/icon_arrangement.png"), '布置作业', totalData.task_add_num, '次' ) }
                            </div>
                            <div style={{display: 'flex',flexDirection: 'row', marginTop:20}}>
                                { this.RightItem(require("../../assets/icon/icon_examine.png"), '审核通过作品', totalData.works_status_num , '个' ) }
                                { this.RightItem(require("../../assets/icon/icon_collection.png"), '作品收藏  ', totalData.collect_num , '次' ) }
                                { this.RightItem(require("../../assets/icon/icon_submission.png"), '提交作业  ', totalData.task_student_num , '次' ) }
                            </div>
                        </div>
                    </div>
                </Layout>

                <Layout style={containerStyle}>
                    <div className="admin-text"><span>分布统计</span></div>
                    <div style={{backgroundColor:'#ffffff'}}>
                        <Table pagination={false} columns={columns} dataSource={this.state.distribution} />
                    </div>
                    
                </Layout>
               

            </Layout>
        );
    }
}

export default Index;