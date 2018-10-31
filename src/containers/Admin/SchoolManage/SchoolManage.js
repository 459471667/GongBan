import React, {Component} from 'react';
import {Layout, Menu} from "antd";
import {NavLink, Route, Switch} from "react-router-dom";
import ClassList from "./ClassList";
import ClassAdd from "./ClassAdd";
import ClassEdit from "./ClassEdit";
import ClassImport from "./ClassImport";
import './SchoolManage.less';
import StudentList from "./StudentList";
import TeacherList from "./TeacherList";
import TeacherAdd from "./TeacherAdd";
import TeacherEdit from "./TeacherEdit";
import StudentAdd from "./StudentAdd";
import StudentEdit from "./StudentEdit";
import SchoolPassword from "./SchoolPassword"

const {Sider} = Layout;


class SchoolManage extends Component {

    state = {
        userInfo: JSON.parse(localStorage.getItem('userInfo'))
    };

    render() {
        let urlArr = ['/admin/school_manage/class_list', '/admin/school_manage/student_list',
            '/admin/school_manage/teacher_list','/admin/school_manage/school_pass'];
        const {location} = this.props;
        const {userInfo} = this.state;
        return (
            <Layout>
                <Sider width={158} style={{background: "#edf1f7"}}>
                    <Layout style={{position:"fixed"}} >
                        <Menu
                        mode="inline"
                        defaultSelectedKeys={[urlArr[0].split('/')[3]]}
                        selectedKeys={[location.pathname.split('/')[3]]}
                        style={{height: '100%', backgroundColor: "#edf1f7"}}
                        className="menu-item-custom"
                    >
                        {userInfo.user_type !== '2' &&
                        <Menu.Item key={urlArr[0].split('/')[3]}><NavLink to={urlArr[0]}>班级管理</NavLink></Menu.Item>
                        }
                        <Menu.Item key={urlArr[1].split('/')[3]}><NavLink to={urlArr[1]}>学生管理</NavLink></Menu.Item>
                        {userInfo.user_type !== '2' &&
                        <Menu.Item key={urlArr[2].split('/')[3]}><NavLink to={urlArr[2]}>教师管理</NavLink></Menu.Item>
                        }
                        {(userInfo.user_type !== '1' && userInfo.user_type !== "2" )?
                            <Menu.Item key={urlArr[3].split('/')[3]}><NavLink to={urlArr[3]+'/'+userInfo.user_id}>修改密码</NavLink></Menu.Item>:null
                        }
                        </Menu>
                    </Layout>
                </Sider>
                <Switch>
                    <Route path='/admin/school_manage/class_list' component={ClassList}/>
                    <Route path='/admin/school_manage/student_list' component={StudentList}/>
                    <Route path='/admin/school_manage/teacher_list' component={TeacherList}/>
                    <Route path='/admin/school_manage/class_add' component={ClassAdd}/>
                    <Route path='/admin/school_manage/class_edit/:class_id' component={ClassEdit}/>
                    <Route path='/admin/school_manage/student_add' component={StudentAdd}/>
                    <Route path='/admin/school_manage/student_edit/:student_id' component={StudentEdit}/>
                    <Route path='/admin/school_manage/teacher_add' component={TeacherAdd}/>
                    <Route path='/admin/school_manage/teacher_edit/:teacher_id' component={TeacherEdit}/>
                    <Route path='/admin/school_manage/class_import' component={ClassImport}/>
                    <Route path='/admin/school_manage/student_import' component={ClassImport}/>
                    <Route path='/admin/school_manage/teacher_import' component={ClassImport}/>
                    <Route path='/admin/school_manage/school_pass/:user_id' component={SchoolPassword}/>
                </Switch>
            </Layout>
        );
    }
}

export default SchoolManage;
