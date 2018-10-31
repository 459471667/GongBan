import React from  "react";
import "./InsititutionStyle/InsititutionLess.less";
import {NavLink,Route,Switch} from "react-router-dom";
import {Layout,Menu} from  "antd";
import InsititutionSetEdit from "./InsititutionComponent/InsititutionSetEdit";
import InsititutionDetail from "../InsititutionDetail/InsititutionDetail";
export default class InsititutionSet extends React.PureComponent{
	constructor(props){
		super(props);
	}
	componentDidMount(){
		console.log("this component is mounted");
	}
	render(){
		return <Layout style={{flexDirection: 'row'}}>
            <div style={{width:"158px",display:"flex",flexDirection:"column"}}>
            <Layout style={{position:"fixed"}}>
                <Menu
                    mode="inline"
                    selectedKeys={["/admin/org_set/institution_detail"]}
                    style={{height: '100%', width: 158}}
                    className="menu-item-custom"
                >
                    <Menu.Item key="/admin/org_set/institution_detail">
                    	<NavLink to="/admin/org_set/institution_detail">机构设置</NavLink>
                    </Menu.Item>
                </Menu>
            </Layout>
            </div>
                <Switch>
                    <Route path='/admin/org_set/institution_set' component={InsititutionSetEdit}/>
                    <Route path='/admin/org_set/institution_detail' component={InsititutionDetail}/>
                </Switch>
            </Layout>
	}

} 