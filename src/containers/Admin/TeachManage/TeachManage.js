import React, {Component} from 'react';
import {Layout, Menu} from "antd";
import WorksManage from "./WorksManage";
import {NavLink, Route, Switch} from "react-router-dom";
import CommentManage from "./CommentManage";
import CourseManage from "./CourseManage";
import TeacherTrainIndex from "../TeacherTrain/TeacherTrainIndex"; 
import OperationSupportIndex from "../OperationSupport/OperationSupportIndex"; 
import PreviewComponentIndex from "../PreviewCommon/PreviewComponentIndex"; 

const {Sider} = Layout;

class TeachManage extends Component {
    constructor(props){
        super(props);
    }
    // 匹配当前url
    match(){
        const {location} = this.props;
        let matchUrl=location.pathname.split('/')[3];
        if(matchUrl==="common_preview_teacher_train")
           matchUrl="teacher_train";
        if(matchUrl==="common_preview_operation_support")
           matchUrl="operation_support";
        if(matchUrl==="common_preview_course_manage")
            matchUrl="course_manage"
        return matchUrl;
    }
    render() {
        let urlArr = ['/admin/teach_manage/works_manage', '/admin/teach_manage/comment_manage',
            '/admin/teach_manage/course_manage', "/admin/teach_manage/teacher_train","/admin/teach_manage/operation_support"];
        let userInfo = JSON.parse(localStorage.getItem('userInfo'));
        let matchUrl=this.match();
        let  _mapUrl=window.location.host.split(".")[0];
        return (
            <Layout style={{ backgroundColor: '#edf1f7'}}>
                <Sider width={158} style={{background: '#edf1f7'}}>
                    <Layout style={{position:"fixed"}}>
                        <Menu
                            mode="inline"
                            selectedKeys={[matchUrl]}
                            style={{height: '100%', backgroundColor: '#edf1f7'
                        }}
                            className="menu-item-custom"
                        >
                        {(userInfo.user_type==="0")?
                            <Menu.Item key={urlArr[0].split('/')[3]}><NavLink to={urlArr[0]}>作品管理</NavLink></Menu.Item>:null
                        }
                        {_mapUrl==="twh"?null:(userInfo.user_type !== '1' &&
                            <Menu.Item key={urlArr[1].split('/')[3]}><NavLink to={urlArr[1]}>评论管理</NavLink></Menu.Item>)
                        }
                        {_mapUrl==="twh"?null:(userInfo.user_type !== '2' &&
                            <Menu.Item key={urlArr[2].split('/')[3]}><NavLink to={urlArr[2]}>课程管理</NavLink></Menu.Item>
                        )}
                        <Menu.Item key={urlArr[3].split('/')[3]}><NavLink to={urlArr[3]}>教师培训</NavLink></Menu.Item>
                        
                        {/***公办平台没有运营支持***/}
                        {/***<Menu.Item key={urlArr[4].split('/')[3]}><NavLink to={urlArr[4]}>运营支持</NavLink></Menu.Item>****/}
                    </Menu>
                    </Layout>
                </Sider>
                <Switch>
                    <Route path='/admin/teach_manage/works_manage' component={WorksManage}/>
                    <Route path='/admin/teach_manage/comment_manage' component={CommentManage}/>
                    <Route path='/admin/teach_manage/course_manage' component={CourseManage}/>
                    <Route path='/admin/teach_manage/teacher_train' component={TeacherTrainIndex}/>
                    <Route path='/admin/teach_manage/operation_support' component={OperationSupportIndex}/>
                    {/**不在首页提供入口的视频或者pdf预览组件**/}
                    <Route path='/admin/teach_manage/common_preview_teacher_train' component={PreviewComponentIndex}/>
                    {/***课件视频预览****/}
                    <Route path='/admin/teach_manage/common_preview_course_manage' component={PreviewComponentIndex}/>
                    {/**<Route path='/admin/teach_manage/common_preview_operation_support' component={PreviewComponentIndex}/>****/}
                </Switch>
            </Layout>
        );
    }
}

export default TeachManage;
