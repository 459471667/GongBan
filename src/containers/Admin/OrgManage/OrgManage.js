import React from 'react';
import {NavLink, Route, Switch} from "react-router-dom";
import OrgAdd from "./OrgAdd";
import OrgList from "./OrgList";
import OrgEdit from "./OrgEdit";
import OrgDetail from "./OrgDetail";
import OrgSetting from "./OrgSetting";
import OrgPassword from "./OrgPassword";
import {Layout, Menu} from "antd";

class OrgManage extends React.Component {
     // 匹配当前url
     match(){
        const {location} = this.props;
        let matchUrl=location.pathname.split('/')[3];
        return matchUrl;
    }

    render() {
        let userInfo = JSON.parse(localStorage.getItem('userInfo'));
        let urlArr = ['/admin/org_manage/org_list', '/admin/org_manage/org_setting','/admin/org_manage/org_password'];
        let matchUrl=this.match();

        return (
            <Layout style={{flexDirection: 'row'}}>
                <div style={{display:"inlineBlock",display:"flex",flexDirection:"column",width:"158px", backgroundColor: '#edf1f7'}}>
                    <Layout style={{position:"fixed"}}>
                    <Menu
                        mode="inline"
                        selectedKeys={[matchUrl]}
                        style={{height: '100%', width: 158, backgroundColor: '#edf1f7'}}
                        className="menu-item-custom">
                    <Menu.Item key={urlArr[0].split('/')[3]}>
                        <NavLink to={urlArr[0]}>单位管理</NavLink>
                    </Menu.Item>
                    <Menu.Item key={urlArr[2].split('/')[3]}>
                        <NavLink to={urlArr[2]+'/'+userInfo.user_id}>修改密码</NavLink>
                    </Menu.Item>
                    {/* 升学
                    {(userInfo.user_f_type==="0")?
                        <Menu.Item key={urlArr[1].split('/')[3]}><NavLink to={urlArr[1]}>升学管理</NavLink></Menu.Item>:null
                    }
                    */}
                    
                    
                    </Menu>
                    </Layout>
                </div>
                <Switch>
                    <Route path='/admin/org_manage/org_add' component={OrgAdd}/>
                    <Route path='/admin/org_manage/org_edit/:user_id' component={OrgEdit}/>
                    <Route path='/admin/org_manage/org_list' component={OrgList}/>
                    <Route path='/admin/org_manage/org_detail/:user_id' component={OrgDetail}/>
                    <Route path='/admin/org_manage/org_password/:user_id' component={OrgPassword}/>
                    {/*
                    <Route path='/admin/org_manage/org_setting' component={OrgSetting}/>
                    */}
                </Switch>
            </Layout>
        );
    }
}

export default OrgManage;